'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ApiService,
  GitHubRepoItem,
  AgentJobListItem,
  AgentJobResponse,
  PricingInfo,
  UserCredits,
} from '@/lib/api';
import { parseRepo } from '@/lib/repo';
import { useAuth } from '@/contexts/AuthContext';
import { Bot, Download, AlertCircle, Loader2, ExternalLink, Info, CheckCircle2, XCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const POLL_INTERVAL_MS = 15_000;
const GITHUB_APP_INSTALL_URL =
  process.env.NEXT_PUBLIC_GITHUB_APP_INSTALL_URL || '';

const DOWNLOAD_AGENT_OPTIONS = [
  { label: 'Claude Code', value: 'claude_code' },
  { label: 'Cursor', value: 'cursor' },
  { label: 'Codex', value: 'codex' },
  { label: 'GitHub Copilot', value: 'copilot' },
  { label: 'Gemini CLI', value: 'gemini_cli' },
];

export function AgentPageContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [repos, setRepos] = useState<GitHubRepoItem[]>([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [reposError, setReposError] = useState<string | null>(null);
  const [appNotInstalled, setAppNotInstalled] = useState(false);
  const [repoInput, setRepoInput] = useState('');
  const [ref, setRef] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<AgentJobResponse | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [jobs, setJobs] = useState<AgentJobListItem[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsCursor, setJobsCursor] = useState<string | null>(null);
  const [jobsHasMore, setJobsHasMore] = useState(false);
  const [jobsLoadMoreLoading, setJobsLoadMoreLoading] = useState(false);
  const [jobDetails, setJobDetails] = useState<Record<string, AgentJobResponse>>({});
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [showRunConfirm, setShowRunConfirm] = useState(false);
  const [confirmMode, setConfirmMode] = useState<'run' | 'pay'>('run');
  const [pendingShortfall, setPendingShortfall] = useState(0);
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [showRunStarted, setShowRunStarted] = useState(false);
  const downloadOpenedRef = useRef<Set<string>>(new Set());
  const [downloadDialogJobId, setDownloadDialogJobId] = useState<string | null>(null);
  const [downloadAgentIds, setDownloadAgentIds] = useState<string[]>([]);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJobDetailsLoading, setSelectedJobDetailsLoading] = useState(false);
  const [repoVisibility, setRepoVisibility] = useState<'public' | 'private'>('public');

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

  const loadRepos = useCallback(async () => {
    setReposLoading(true);
    setReposError(null);
    setAppNotInstalled(false);
    try {
      const data = await ApiService.getRepos();
      setRepos(data.repos ?? []);
    } catch (err) {
      setRepos([]);
      const code = (err as Error & { code?: string }).code;
      const message = err instanceof Error ? err.message : 'Failed to load repos';
      setReposError(message);
      setAppNotInstalled(
        !!code ||
        /install|not installed|github app/i.test(message)
      );
    } finally {
      setReposLoading(false);
    }
  }, []);

  const loadJobs = useCallback(async () => {
    try {
      setJobsLoading(true);
      const data = await ApiService.listAgentJobs(20);
      setJobs(data.jobs || []);
      setJobsCursor(data.next_cursor ?? null);
      setJobsHasMore(data.has_more);
    } catch {
      setJobs([]);
      setJobsCursor(null);
      setJobsHasMore(false);
    } finally {
      setJobsLoading(false);
    }
  }, []);

  const loadMoreJobs = async () => {
    if (!jobsCursor || !jobsHasMore) return;
    try {
      setJobsLoadMoreLoading(true);
      const data = await ApiService.listAgentJobs(20, jobsCursor);
      setJobs((prev) => {
        const existingIds = new Set(prev.map((j) => j.job_id));
        const newJobs = (data.jobs || []).filter((j) => !existingIds.has(j.job_id));
        return [...prev, ...newJobs];
      });
      setJobsCursor(data.next_cursor ?? null);
      setJobsHasMore(data.has_more);
    } catch {
      // silent — button stays visible for retry
    } finally {
      setJobsLoadMoreLoading(false);
    }
  };

  const loadPricing = useCallback(async () => {
    try {
      const data = await ApiService.getPricingInfo();
      setPricing(data);
    } catch {
      setPricing(null);
    }
  }, []);

  const loadCredits = useCallback(async () => {
    try {
      const data = await ApiService.getUserCredits();
      setUserCredits(data);
    } catch {
      setUserCredits(null);
    }
  }, []);

  const [autorun, setAutorun] = useState(false);
  const [triggerRun, setTriggerRun] = useState(false);

  useEffect(() => {
    const repoParam = searchParams.get('repo');
    const refParam = searchParams.get('ref');
    const hasTrigger = searchParams.get('trigger') === 'true';
    const hasAutorun = searchParams.get('autorun') === 'true';
    if (repoParam) setRepoInput(repoParam);
    if (refParam) setRef(refParam);
    if (hasAutorun) setAutorun(true);
    if (hasTrigger) setTriggerRun(true);
    sessionStorage.removeItem('codeset_pending_agent_job');
    if (hasTrigger || hasAutorun) {
      const params = new URLSearchParams();
      if (repoParam) params.set('repo', repoParam);
      if (refParam) params.set('ref', refParam);
      const qs = params.size ? `?${params}` : '';
      router.replace(`/dashboard/agent${qs}`);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (user) {
      loadRepos();
      loadJobs();
      loadPricing();
      loadCredits();
    }
  }, [user, loadRepos, loadJobs, loadPricing, loadCredits]);

  const parsedRepo = parseRepo(repoInput);
  const repoToRun = parsedRepo.ok ? parsedRepo.repo : '';

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!autorun || !userCredits || !pricing || !parsedRepo.ok) return;
    const jobCost = pricing.agent_job_cost_cents;
    if (jobCost == null || userCredits.balance < jobCost) return;
    setAutorun(false);
    runAgent(); // user already paid — skip confirm dialog
  }, [autorun, userCredits, pricing, parsedRepo.ok]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!triggerRun || !pricing || !userCredits || !parsedRepo.ok) return;
    setTriggerRun(false);
    const jobCost = pricing.agent_job_cost_cents;
    if (jobCost != null && userCredits.balance < jobCost) {
      setPendingShortfall(jobCost - userCredits.balance);
      setConfirmMode('pay');
      setShowRunConfirm(true);
      return;
    }
    if (jobCost != null) {
      setConfirmMode('run');
      setShowRunConfirm(true);
    } else {
      runAgent();
    }
  }, [triggerRun, pricing, userCredits, parsedRepo.ok]);
  const repoValidationError =
    !parsedRepo.ok && repoInput.trim() ? parsedRepo.error : null;
  const selectedRepoFromList = repos.find((r) => r.full_name === repoToRun)?.full_name ?? '';

  const terminalStatuses = ['completed', 'error'];
  const isTerminal = (s: string) => terminalStatuses.includes(s);
  const runningJobs = jobs.filter((j) => !isTerminal(j.status));
  const completedJobs = jobs.filter((j) => isTerminal(j.status));
  const completedFromDetails: AgentJobListItem[] = Object.entries(jobDetails)
    .filter(([, d]) => isTerminal(d.status))
    .filter(([id]) => !completedJobs.some((j) => j.job_id === id))
    .map(([id, d]) => ({
      job_id: id,
      repo: jobs.find((j) => j.job_id === id)?.repo ?? '—',
      status: d.status,
      created_at: d.created_at,
    }));
  const completedJobsDisplay = [...completedJobs, ...completedFromDetails].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const runningJobsFiltered = runningJobs.filter(
    (j) => !isTerminal(jobDetails[j.job_id]?.status ?? j.status)
  );
  const currentJobTerminal =
    currentJobId && isTerminal(jobDetails[currentJobId]?.status ?? jobStatus?.status ?? '');
  const runningDisplayList: AgentJobListItem[] =
    currentJobId &&
    !currentJobTerminal &&
    !runningJobsFiltered.some((j) => j.job_id === currentJobId)
      ? [
          {
            job_id: currentJobId,
            repo: repoToRun || '—',
            status: jobDetails[currentJobId]?.status ?? jobStatus?.status ?? 'pending',
            created_at: jobStatus?.created_at ?? new Date().toISOString(),
          },
          ...runningJobsFiltered,
        ]
      : runningJobsFiltered;
  const hasRunningJobs = runningDisplayList.length > 0;

  useEffect(() => {
    if (!hasRunningJobs) return;

    const poll = async () => {
      const ids = runningDisplayList.map((j) => j.job_id);
      const results = await Promise.allSettled(
        ids.map((id) => ApiService.getAgentJob(id))
      );
      let anyTerminal = false;
      setJobDetails((prev) => {
        const next = { ...prev };
        results.forEach((r, i) => {
          if (r.status === 'fulfilled') {
            next[ids[i]] = r.value;
            if (isTerminal(r.value.status)) anyTerminal = true;
          }
        });
        return next;
      });
      if (anyTerminal) loadJobs();
    };

    const t = setInterval(poll, POLL_INTERVAL_MS);
    poll();
    return () => clearInterval(t);
  }, [currentJobId, jobStatus?.status, runningJobs.length, loadJobs]);

  useEffect(() => {
    if (!currentJobId) return;
    const detail = jobDetails[currentJobId];
    if (
      detail?.status === 'completed' &&
      detail?.result_available &&
      !downloadOpenedRef.current.has(currentJobId)
    ) {
      downloadOpenedRef.current.add(currentJobId);
      openDownloadDialog(currentJobId);
    }
  }, [currentJobId, jobDetails]);

  useEffect(() => {
    if (!selectedJobId || jobDetails[selectedJobId]) return;
    let cancelled = false;
    setSelectedJobDetailsLoading(true);
    ApiService.getAgentJob(selectedJobId)
      .then((d) => {
        if (!cancelled) setJobDetails((prev) => ({ ...prev, [selectedJobId]: d }));
      })
      .finally(() => {
        if (!cancelled) setSelectedJobDetailsLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedJobId]);

  const runAgent = async () => {
    if (!parsedRepo.ok) {
      setCreateError(parsedRepo.error);
      return;
    }
    setShowRunConfirm(false);
    try {
      setCreateLoading(true);
      setCreateError(null);
      const res = await ApiService.createAgentJob(
        repoToRun,
        ref.trim() || undefined
      );
      setRepoInput('');
      setCurrentJobId(res.job_id);
      const initial: AgentJobResponse = {
        job_id: res.job_id,
        status: res.status,
        created_at: new Date().toISOString(),
        result_available: false,
      };
      setJobStatus(initial);
      setJobDetails((prev) => ({ ...prev, [res.job_id]: initial }));
      loadJobs();
      setShowRunStarted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create job';
      const code = (err as Error & { code?: string }).code;
      setCreateError(message);
      if (code === 'GITHUB_APP_NOT_INSTALLED' && GITHUB_APP_INSTALL_URL) {
        setReposError('Install the Codeset GitHub App on this repository.');
      }
    } finally {
      setCreateLoading(false);
    }
  };

  const topUpAndRun = async (shortfall: number) => {
    try {
      setTopUpLoading(true);
      const params = new URLSearchParams({ repo: repoToRun, autorun: 'true' });
      if (ref.trim()) params.set('ref', ref.trim());
      const successUrl = `${window.location.origin}/dashboard/agent?${params}`;
      const cancelUrl = `${window.location.origin}/dashboard/agent?repo=${encodeURIComponent(repoToRun)}`;
      // Store pending job so credits page can redirect back if the backend doesn't honour success_url
      sessionStorage.setItem(
        'codeset_pending_agent_job',
        JSON.stringify({ repo: repoToRun, autorun: true, ...(ref.trim() ? { ref: ref.trim() } : {}) })
      );
      const response = await ApiService.createDepositSession({
        amount_cents: Math.max(shortfall, 100),
        currency: 'usd',
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      window.location.href = response.checkout_url;
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create payment session');
    } finally {
      setTopUpLoading(false);
    }
  };

  const handleRunAgentClick = () => {
    if (!parsedRepo.ok) {
      setCreateError(parsedRepo.error);
      return;
    }
    const jobCost = pricing?.agent_job_cost_cents;
    if (jobCost != null && userCredits != null && userCredits.balance < jobCost) {
      setPendingShortfall(jobCost - userCredits.balance);
      setConfirmMode('pay');
      setShowRunConfirm(true);
      return;
    }
    if (jobCost != null) {
      setConfirmMode('run');
      setShowRunConfirm(true);
    } else {
      runAgent();
    }
  };

  const openDownloadDialog = (jobId: string) => {
    setDownloadDialogJobId(jobId);
    setDownloadAgentIds([]);
  };

  const toggleDownloadAgent = (value: string) => {
    setDownloadAgentIds((prev) =>
      prev.includes(value) ? prev.filter((id) => id !== value) : [...prev, value]
    );
  };

  const handleDownloadConfirm = async () => {
    if (!downloadDialogJobId) return;
    if (!downloadAgentIds.length) {
      setCreateError('Select at least one agent.');
      return;
    }
    try {
      setDownloadLoading(true);
      setCreateError(null);
      const { blob, filename: apiFilename } = await ApiService.getAgentJobResultBlob(
        downloadDialogJobId,
        downloadAgentIds
      );
      const job = jobs.find((j) => j.job_id === downloadDialogJobId);
      const filename = job
        ? `codeset-${job.repo.replace(/\//g, '-')}-${job.created_at.slice(0, 10)}.tar.gz`
        : apiFilename;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setDownloadDialogJobId(null);
    } catch {
      setDownloadDialogJobId(null);
      setDownloadError('Download failed or result not available.');
    } finally {
      setDownloadLoading(false);
    }
  };

  const showReposWarning =
    !reposLoading && repos.length === 0 && (appNotInstalled || !!GITHUB_APP_INSTALL_URL);
  const showReposError =
    !reposLoading && repos.length === 0 && reposError && !GITHUB_APP_INSTALL_URL;

  if (!user) return null;

  return (
    <div className="space-y-8">

      <div className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        {repoVisibility === 'private' && GITHUB_APP_INSTALL_URL && (
          <a
            href={GITHUB_APP_INSTALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-4 top-4 inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
          >
            <ExternalLink size={14} />
            Install app
          </a>
        )}
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Extract Knowledge Base
        </h2>
        <div className="mb-4 inline-flex rounded-md border border-gray-200 text-sm font-medium overflow-hidden">
          <button
            type="button"
            onClick={() => setRepoVisibility('public')}
            className={`px-3 py-1.5 transition-colors ${repoVisibility === 'public' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Public Repo
          </button>
          <button
            type="button"
            onClick={() => setRepoVisibility('private')}
            className={`px-3 py-1.5 border-l border-gray-200 transition-colors ${repoVisibility === 'private' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Private Repo
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Repository
            </label>
            <input
              type="text"
              value={repoInput}
              onChange={(e) => setRepoInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunAgentClick()}
              placeholder="owner/repo or github.com/owner/repo"
              className={`w-full rounded-md border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 ${
                repoValidationError
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-[#6366F1] focus:ring-[#6366F1]'
              }`}
              aria-invalid={!!repoValidationError}
              aria-describedby={repoValidationError ? 'repo-validation-error' : undefined}
            />
            {repoValidationError && (
              <p id="repo-validation-error" className="mt-1 text-sm text-red-600">
                {repoValidationError}
              </p>
            )}
          </div>
          {repoVisibility === 'private' && (
          <div className="md:col-span-2">
            <label
              htmlFor="agent-repo-select"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Or pick from your repositories
            </label>
            <select
              id="agent-repo-select"
              value={selectedRepoFromList}
              onChange={(e) => setRepoInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunAgentClick()}
              disabled={reposLoading}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring disabled:bg-muted disabled:text-muted-foreground"
            >
              {reposLoading ? (
                <option value="">Loading…</option>
              ) : (
                <>
                  <option value="">Select a repository</option>
                  {repos.map((r) => (
                    <option key={r.full_name} value={r.full_name}>
                      {r.full_name}
                    </option>
                  ))}
                </>
              )}
            </select>
            {showReposWarning && (
              <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm font-medium text-amber-800">
                  Install the Codeset GitHub App to use your private repositories.
                </p>
                {GITHUB_APP_INSTALL_URL && (
                  <>
                    <a
                      href={GITHUB_APP_INSTALL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 rounded-md bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700"
                    >
                      <Bot size={14} />
                      Install the Codeset GitHub App
                    </a>
                    <p className="mt-1.5 text-xs text-amber-700">
                      After installing, refresh this page to see your repositories.
                    </p>
                  </>
                )}
              </div>
            )}
            {showReposError && (
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <AlertCircle size={16} />
                {reposError}
              </div>
            )}
          </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Ref / branch (optional)
            </label>
            <input
              type="text"
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              placeholder="e.g. main"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>
          {pricing?.agent_job_cost_cents != null && (
            <p className="mt-2 text-sm text-gray-600">
              Each run costs {formatCurrency(pricing.agent_job_cost_cents)}.
            </p>
          )}
        {createError && (
          <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle size={16} />
            {createError}
            {GITHUB_APP_INSTALL_URL &&
              createError.toLowerCase().includes('install') && (
                <a
                  href={GITHUB_APP_INSTALL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Install app
                </a>
              )}
          </div>
        )}
        <button
          onClick={handleRunAgentClick}
          disabled={createLoading || topUpLoading}
          className="mt-4 flex items-center gap-2 rounded-md bg-[#6366F1] px-4 py-2 text-sm font-medium text-white hover:brightness-110 disabled:opacity-50"
        >
          {createLoading || topUpLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Bot size={16} />
          )}
          Extract Knowledge Base
        </button>
      </div>

      <AlertDialog open={showRunConfirm} onOpenChange={setShowRunConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmMode === 'pay' ? 'Add credits & run' : 'Run Codeset'}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  {confirmMode === 'pay'
                    ? <>We&apos;ll charge your card <strong className="text-gray-900">{formatCurrency(Math.max(pendingShortfall, 100))}</strong> and immediately start the analysis on <strong className="text-gray-900">{repoToRun}</strong>.</>
                    : <>We&apos;ll analyze <strong className="text-gray-900">{repoToRun}</strong> and deduct <strong className="text-gray-900">{formatCurrency(pricing?.agent_job_cost_cents ?? 0)}</strong> from your balance.</>
                  }
                </p>
                <p className="text-gray-500">Ready in ~45 minutes for a medium-sized repo. You can close the tab while it runs.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmMode === 'pay'
                ? () => { setShowRunConfirm(false); topUpAndRun(pendingShortfall); }
                : runAgent
              }
              disabled={createLoading || topUpLoading}
            >
              {confirmMode === 'pay'
                ? `Pay ${formatCurrency(Math.max(pendingShortfall, 100))} →`
                : 'Run →'
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!downloadError} onOpenChange={(open) => !open && setDownloadError(null)}>
        <AlertDialogContent>
          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="text-xl font-semibold leading-tight text-gray-900">
              {downloadError}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setDownloadError(null)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showRunStarted} onOpenChange={setShowRunStarted}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run started!</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            The analysis has started. It takes ~45 minutes for a medium-sized repo. You can close this tab and come back later.
          </p>
          <DialogFooter>
            <button
              onClick={() => setShowRunStarted(false)}
              className="rounded-md bg-[#6366F1] px-4 py-2 text-sm font-medium text-white hover:brightness-110"
            >
              Got it
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!downloadDialogJobId}
        onOpenChange={(open) => !open && setDownloadDialogJobId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download result</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            The tar archive contains hidden files (e.g. <code className="font-mono">.claude</code>). Make sure to also add these to your repo.
          </p>
          <div className="space-y-3 py-2">
            {DOWNLOAD_AGENT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
              >
                <input
                  type="checkbox"
                  checked={downloadAgentIds.includes(opt.value)}
                  onChange={() => toggleDownloadAgent(opt.value)}
                  className="h-4 w-4 rounded border-gray-300 accent-[#6366F1] focus:ring-[#6366F1] focus:ring-offset-0"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setDownloadDialogJobId(null)}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDownloadConfirm}
              disabled={downloadLoading || !downloadAgentIds.length}
              className="flex items-center gap-2 rounded-md bg-[#6366F1] px-4 py-2 text-sm font-medium text-white hover:brightness-110 disabled:opacity-50"
            >
              {downloadLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              Download
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedJobId}
        onOpenChange={(open) => !open && setSelectedJobId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Job details</DialogTitle>
          </DialogHeader>
          {selectedJobId && (
            <div className="space-y-3 py-2 text-sm">
              {selectedJobDetailsLoading ? (
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader2 size={16} className="animate-spin" />
                  Loading…
                </div>
              ) : (
                <>
                  <div className="grid gap-2 font-mono text-xs text-gray-600">
                    <p><span className="font-medium text-gray-900">Job ID:</span> {selectedJobId}</p>
                    <p>
                      <span className="font-medium text-gray-900">Repo:</span>{' '}
                      {[...runningDisplayList, ...completedJobsDisplay].find((j) => j.job_id === selectedJobId)?.repo ?? '—'}
                    </p>
                    {jobDetails[selectedJobId] && (
                      <>
                        <p><span className="font-medium text-gray-900">Status:</span> {jobDetails[selectedJobId].status}</p>
                        <p><span className="font-medium text-gray-900">Created:</span> {new Date(jobDetails[selectedJobId].created_at).toLocaleString()}</p>
                        {jobDetails[selectedJobId].completed_at && (
                          <p><span className="font-medium text-gray-900">Completed:</span> {new Date(jobDetails[selectedJobId].completed_at).toLocaleString()}</p>
                        )}
                        {jobDetails[selectedJobId].progress_stage && (
                          <p><span className="font-medium text-gray-900">Stage:</span> {jobDetails[selectedJobId].progress_stage}</p>
                        )}
                      </>
                    )}
                  </div>
                  {jobDetails[selectedJobId]?.error_message && (
                    <div className="rounded-md border border-red-200 bg-red-50 p-3">
                      <p className="text-xs font-medium text-red-800 mb-1">Error</p>
                      <p className="text-sm text-red-700 whitespace-pre-wrap">{jobDetails[selectedJobId].error_message}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {runningDisplayList.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Running jobs</h2>
            <div className="group relative">
              <Info size={16} className="text-gray-400 hover:text-gray-600 cursor-default" />
              <div className="pointer-events-none absolute right-0 top-6 z-10 w-64 rounded-md border border-gray-200 bg-white p-3 text-xs text-gray-600 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                Jobs typically take <strong>~45 min</strong> for medium-sized repos, with runtime scaling with the size of the repo. You can close this tab while it runs.
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="pb-2 pr-4">Job ID</th>
                  <th className="pb-2 pr-4">Repo</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 pr-4">Progress</th>
                  <th className="pb-2 pr-4">Created</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {runningDisplayList.map((j) => {
                  const d = jobDetails[j.job_id];
                  const status = d?.status ?? j.status;
                  const isComplete = status === 'completed' && d?.result_available;
                  return (
                    <tr
                      key={j.job_id}
                      className="border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedJobId(j.job_id)}
                    >
                      <td className="py-2 pr-4 font-mono text-xs">{j.job_id}</td>
                      <td className="py-2 pr-4">{j.repo}</td>
                      <td className="py-2 pr-4">
                        <span className="inline-flex items-center gap-2">
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
                          </span>
                          {status}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-gray-600 min-w-[120px]">
                        {d?.error_message ? (
                          <span className="text-red-600 text-xs">{d.error_message}</span>
                        ) : d?.progress_pct != null ? (
                          <div className="space-y-1">
                            <div className="h-2 w-full min-w-[100px] overflow-hidden rounded-full bg-gray-200">
                              <div
                                className="h-full rounded-full bg-[#6366F1] transition-[width] duration-300"
                                style={{ width: `${Math.min(100, Math.max(0, d.progress_pct))}%` }}
                              />
                            </div>
                            {d.progress_stage ? (
                              <span className="text-xs text-gray-500">{d.progress_stage}</span>
                            ) : null}
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-2 pr-4 text-gray-500">
                        {new Date(j.created_at).toLocaleString()}
                      </td>
                      <td className="py-2" onClick={(e) => e.stopPropagation()}>
                        {isComplete && (
                          <button
                            onClick={() => openDownloadDialog(j.job_id)}
                            disabled={downloadLoading}
                            className="flex items-center gap-1 text-gray-600 hover:text-black disabled:opacity-50"
                          >
                            <Download size={14} />
                            Download
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          Job history
        </h2>
        {jobsLoading ? (
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 size={16} className="animate-spin" />
            Loading…
          </div>
        ) : completedJobsDisplay.length === 0 ? (
          <p className="text-sm text-gray-500">No jobs yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-gray-600">
                  <th className="pb-2 pr-4">Job ID</th>
                  <th className="pb-2 pr-4">Repo</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 pr-4">Created</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody>
                {completedJobsDisplay.map((j) => {
                  const d = jobDetails[j.job_id];
                  const canDownload =
                    j.status === 'completed' && (d == null ? true : d.result_available);
                  return (
                    <tr
                      key={j.job_id}
                      className="border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedJobId(j.job_id)}
                    >
                      <td className="py-2 pr-4 font-mono text-xs">{j.job_id}</td>
                      <td className="py-2 pr-4">{j.repo}</td>
                      <td className="py-2 pr-4">
                        {j.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1.5 text-green-600">
                            <CheckCircle2 size={15} />
                            completed
                          </span>
                        ) : j.status === 'error' ? (
                          <span className="inline-flex items-center gap-1.5 text-red-600">
                            <XCircle size={15} />
                            error
                          </span>
                        ) : (
                          j.status
                        )}
                      </td>
                      <td className="py-2 pr-4 text-gray-500">
                        {new Date(j.created_at).toLocaleString()}
                      </td>
                      <td className="py-2" onClick={(e) => e.stopPropagation()}>
                        {canDownload && (
                          <button
                            onClick={() => openDownloadDialog(j.job_id)}
                            disabled={downloadLoading}
                            className="flex items-center gap-1 text-gray-600 hover:text-black disabled:opacity-50"
                          >
                            <Download size={14} />
                            Download
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {jobsHasMore && (
              <div className="mt-3 flex justify-center">
                <button
                  onClick={loadMoreJobs}
                  disabled={jobsLoadMoreLoading}
                  className="flex items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  {jobsLoadMoreLoading && <Loader2 size={14} className="animate-spin" />}
                  Load more
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AgentPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center gap-2 text-gray-600">
        <Loader2 size={18} className="animate-spin" />
        Loading…
      </div>
    }>
      <AgentPageContent />
    </Suspense>
  );
}
