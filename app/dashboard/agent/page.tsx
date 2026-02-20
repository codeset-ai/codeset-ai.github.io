'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ApiService,
  GitHubRepoItem,
  AgentJobListItem,
  AgentJobResponse,
  PricingInfo,
} from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Bot, Download, AlertCircle, Loader2 } from 'lucide-react';
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

function AgentPageContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const [repos, setRepos] = useState<GitHubRepoItem[]>([]);
  const [reposLoading, setReposLoading] = useState(true);
  const [reposError, setReposError] = useState<string | null>(null);
  const [appNotInstalled, setAppNotInstalled] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [ref, setRef] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<AgentJobResponse | null>(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [jobs, setJobs] = useState<AgentJobListItem[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobDetails, setJobDetails] = useState<Record<string, AgentJobResponse>>({});
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const [showRunConfirm, setShowRunConfirm] = useState(false);
  const [downloadDialogJobId, setDownloadDialogJobId] = useState<string | null>(null);
  const [downloadAgentIds, setDownloadAgentIds] = useState<string[]>([]);
  const [downloadError, setDownloadError] = useState<string | null>(null);

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
    } catch {
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  }, []);

  const loadPricing = useCallback(async () => {
    try {
      const data = await ApiService.getPricingInfo();
      setPricing(data);
    } catch {
      setPricing(null);
    }
  }, []);

  useEffect(() => {
    const repoParam = searchParams.get('repo');
    if (repoParam) setSelectedRepo(repoParam);
    sessionStorage.removeItem('codeset_pending_agent_job');
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      loadRepos();
      loadJobs();
      loadPricing();
    }
  }, [user, loadRepos, loadJobs, loadPricing]);

  const terminalStatuses = ['completed', 'error'];
  const isTerminal = (s: string) => terminalStatuses.includes(s);
  const runningJobs = jobs.filter((j) => !isTerminal(j.status));
  const completedJobs = jobs.filter((j) => isTerminal(j.status));
  const runningDisplayList: AgentJobListItem[] =
    currentJobId &&
    (!jobStatus?.status || !isTerminal(jobStatus.status)) &&
    !runningJobs.some((j) => j.job_id === currentJobId)
      ? [
          {
            job_id: currentJobId,
            repo: selectedRepo || '—',
            status: jobStatus?.status ?? 'pending',
            created_at: jobStatus?.created_at ?? new Date().toISOString(),
          },
          ...runningJobs,
        ]
      : runningJobs;
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

  const runAgent = async () => {
    if (!selectedRepo) {
      setCreateError('Select a repository.');
      return;
    }
    setShowRunConfirm(false);
    try {
      setCreateLoading(true);
      setCreateError(null);
      const res = await ApiService.createAgentJob(
        selectedRepo,
        ref.trim() || undefined
      );
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

  const handleRunAgentClick = () => {
    if (!selectedRepo) {
      setCreateError('Select a repository.');
      return;
    }
    if (pricing?.agent_job_cost_cents != null) {
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
      const { blob, filename } = await ApiService.getAgentJobResultBlob(
        downloadDialogJobId,
        downloadAgentIds
      );
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

  const needInstallApp = !reposLoading && repos.length === 0;

  if (!user) return null;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Agent</h1>

      {reposLoading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 size={18} className="animate-spin" />
          Loading…
        </div>
      ) : needInstallApp && (appNotInstalled || GITHUB_APP_INSTALL_URL) ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="font-medium text-amber-800">
            Install the Codeset GitHub App to select repositories and run the agent.
          </p>
          {GITHUB_APP_INSTALL_URL ? (
            <>
              <a
                href={GITHUB_APP_INSTALL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
              >
                <Bot size={16} />
                Install the Codeset GitHub App
              </a>
              <p className="mt-2 text-sm text-amber-700">
                After installing, refresh this page to see your repositories.
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-amber-700">{reposError}</p>
          )}
        </div>
      ) : needInstallApp && reposError ? (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <AlertCircle size={18} />
          {reposError}
        </div>
      ) : null}

      {!reposLoading && repos.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Run agent
          </h2>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Repository
              </label>
              <select
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="">Select a repository</option>
                {repos.map((r) => (
                  <option key={r.full_name} value={r.full_name}>
                    {r.full_name}
                  </option>
                ))}
              </select>
            </div>
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
            disabled={createLoading}
            className="mt-4 flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {createLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Bot size={16} />
            )}
            Run agent
          </button>
        </div>
      )}

      <AlertDialog open={showRunConfirm} onOpenChange={setShowRunConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm agent run</AlertDialogTitle>
            <AlertDialogDescription>
              {pricing?.agent_job_cost_cents != null
                ? `You will be charged ${formatCurrency(pricing.agent_job_cost_cents)} for this run. This amount will be deducted from your balance.`
                : 'Run this agent job?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={runAgent} disabled={createLoading}>
              Confirm
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

      <Dialog
        open={!!downloadDialogJobId}
        onOpenChange={(open) => !open && setDownloadDialogJobId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download result</DialogTitle>
          </DialogHeader>
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
                  className="h-4 w-4 rounded border-gray-300 accent-black focus:ring-black focus:ring-offset-0"
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
              className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
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

      {runningDisplayList.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Running jobs
          </h2>
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
                    <tr key={j.job_id} className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-mono text-xs">{j.job_id}</td>
                      <td className="py-2 pr-4">{j.repo}</td>
                      <td className="py-2 pr-4">{status}</td>
                      <td className="py-2 pr-4 text-gray-600">
                        {d?.error_message ? (
                          <span className="text-red-600 text-xs">{d.error_message}</span>
                        ) : d?.progress_pct != null ? (
                          <>
                            {d.progress_pct}%
                            {d.progress_stage ? ` — ${d.progress_stage}` : ''}
                          </>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-2 pr-4 text-gray-500">
                        {new Date(j.created_at).toLocaleString()}
                      </td>
                      <td className="py-2">
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
        ) : completedJobs.length === 0 ? (
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
                {completedJobs.map((j) => (
                  <tr key={j.job_id} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-mono text-xs">{j.job_id}</td>
                    <td className="py-2 pr-4">{j.repo}</td>
                    <td className="py-2 pr-4">{j.status}</td>
                    <td className="py-2 pr-4 text-gray-500">
                      {new Date(j.created_at).toLocaleString()}
                    </td>
                    <td className="py-2">
                      {j.status === 'completed' && (
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
                ))}
              </tbody>
            </table>
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
