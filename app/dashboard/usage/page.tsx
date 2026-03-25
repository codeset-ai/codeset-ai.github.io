'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { ApiService, UsageHistory, UsageTransaction } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';

const TRANSACTION_TYPE_OPTIONS: { value: string; label: string; checkedClass: string }[] = [
  { value: 'deposit', label: 'Deposit', checkedClass: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'usage', label: 'Session usage', checkedClass: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'charge', label: 'Charge', checkedClass: 'bg-red-100 text-red-800 border-red-200' },
  { value: 'refund', label: 'Refund', checkedClass: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'agent_job_usage', label: 'Extraction', checkedClass: 'bg-amber-100 text-amber-800 border-amber-200' },
  { value: 'agent_job_refund', label: 'Extraction refund', checkedClass: 'bg-blue-100 text-blue-800 border-blue-200' },
];

function last7Days(): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 6);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

export default function UsagePage() {
  const { user } = useAuth();
  const [usageData, setUsageData] = useState<UsageHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);
  const [startDate, setStartDate] = useState(() => last7Days().start);
  const [endDate, setEndDate] = useState(() => last7Days().end);
  const [transactionTypes, setTransactionTypes] = useState<string[]>([]);

  useEffect(() => {
    loadUsageData();
  }, [currentPage, startDate, endDate, transactionTypes]);

  const loadUsageData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getUsageHistory(
        currentPage,
        itemsPerPage,
        startDate,
        endDate,
        transactionTypes.length ? transactionTypes : undefined,
      );
      setUsageData(data);
    } catch (err) {
      console.error('Error loading usage data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load usage data');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatCurrency = (cents: number) => {
    return `$${Math.abs(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes.toFixed(1)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes.toFixed(0)}m`;
  };

  if (!user) {
    return (
      <div className="min-w-0">
        <div className="text-center text-gray-600">
          Please log in to view your usage history.
        </div>
      </div>
    );
  }

  if (loading && !usageData) {
    return (
      <div className="min-w-0 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Usage History</h1>
        <div className="text-center text-gray-600">Loading usage data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-w-0 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Usage History</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 font-medium">Error loading usage history</div>
          <div className="text-red-600 text-sm mt-1">{error}</div>
          <button
            onClick={loadUsageData}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!usageData) {
    return null;
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="min-w-0 space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Usage History</h1>
        <p className="text-sm text-gray-500">
          Summary and transaction list below are limited to 10,000 transactions.
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-center">
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          <label className="flex min-w-0 items-center gap-2 text-sm text-gray-700">
            <span className="w-10 shrink-0 sm:w-auto">From</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-2 py-2 text-sm sm:w-auto sm:flex-initial sm:min-w-[10rem] sm:px-3"
            />
          </label>
          <label className="flex min-w-0 items-center gap-2 text-sm text-gray-700">
            <span className="w-10 shrink-0 sm:w-auto">To</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
              className="min-w-0 flex-1 rounded-lg border border-gray-300 px-2 py-2 text-sm sm:w-auto sm:flex-initial sm:min-w-[10rem] sm:px-3"
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-gray-200 lg:border-l lg:pl-4">
          <span className="w-full text-sm font-medium text-gray-700 lg:w-auto">Type</span>
          {TRANSACTION_TYPE_OPTIONS.map(({ value, label, checkedClass }) => {
            const checked = transactionTypes.includes(value);
            return (
              <label
                key={value}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium cursor-pointer transition-colors ${
                  checked ? checkedClass : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    setTransactionTypes((prev) =>
                      e.target.checked ? [...prev, value] : prev.filter((t) => t !== value)
                    );
                    setCurrentPage(1);
                  }}
                  className="sr-only"
                />
                {checked && <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />}
                {label}
              </label>
            );
          })}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(usageData.current_balance_cents)}
          </div>
          <div className="text-sm text-gray-600 mt-1">Current Balance</div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(usageData.total_deposits_cents)}
          </div>
          <div className="text-sm text-gray-600 mt-1">Total Deposits</div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(usageData.total_usage_cents)}
          </div>
          <div className="text-sm text-gray-600 mt-1">Total Usage</div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
          <div className="text-2xl font-bold text-purple-600">
            {usageData.summary.total_sessions}
          </div>
          <div className="text-sm text-gray-600 mt-1">Total Sessions</div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-lg font-medium text-gray-900">
              {formatCurrency(usageData.summary.average_session_cost_cents)}
            </div>
            <div className="text-sm text-gray-600">Average Session Cost</div>
          </div>

          <div>
            <div className="text-lg font-medium text-gray-900">
              {formatDuration(usageData.summary.total_session_duration_minutes ?? 0)}
            </div>
            <div className="text-sm text-gray-600">Total Session Time</div>
          </div>

          <div>
            <div className="text-lg font-medium text-gray-900">
              {formatDuration(usageData.summary.average_session_duration_minutes ?? 0)}
            </div>
            <div className="text-sm text-gray-600">Average Session Duration</div>
          </div>

          <div>
            <div className="text-lg font-medium text-gray-900">
              {usageData.summary.total_agent_jobs ?? 0}
            </div>
            <div className="text-sm text-gray-600">Extractions</div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
        </div>

        <div className="relative overflow-x-auto">
          {loading && usageData && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-b-lg">
              <span className="text-sm text-gray-600">Loading...</span>
            </div>
          )}
          <table className="w-full table-fixed divide-y divide-gray-200 sm:table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-[36%] px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:w-auto sm:px-6">
                  Type
                </th>
                <th className="hidden px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:table-cell sm:px-6">
                  Description
                </th>
                <th className="w-[28%] px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:w-auto sm:px-6">
                  Amount
                </th>
                <th className="hidden px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:table-cell sm:px-6">
                  Duration
                </th>
                <th className="w-[36%] px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:w-auto sm:px-6">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {usageData.transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="whitespace-normal px-3 py-3 sm:whitespace-nowrap sm:px-6 sm:py-4">
                    <span
                      className={`inline-flex max-w-full px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.type === 'deposit'
                          ? 'bg-green-100 text-green-800'
                          : transaction.type === 'refund'
                          ? 'bg-blue-100 text-blue-800'
                          : transaction.type === 'agent_job_refund'
                          ? 'bg-blue-100 text-blue-800'
                          : transaction.type === 'agent_job_usage'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.type === 'deposit'
                        ? 'Deposit'
                        : transaction.type === 'refund'
                        ? 'Refund'
                        : transaction.type === 'agent_job_usage'
                        ? 'Extraction'
                        : transaction.type === 'agent_job_refund'
                        ? 'Extraction refund'
                        : 'Session usage'}
                    </span>
                  </td>
                  <td className="hidden max-w-[12rem] px-3 py-3 text-xs text-gray-900 sm:table-cell sm:max-w-none sm:px-6 sm:py-4 sm:text-sm">
                    <span className="break-words">{transaction.description}</span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs font-medium sm:px-6 sm:py-4 sm:text-sm">
                    <span
                      className={
                        transaction.amount_cents >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {transaction.amount_cents >= 0 ? '+' : ''}
                      {formatCurrency(transaction.amount_cents)}
                    </span>
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-3 text-xs text-gray-500 sm:table-cell sm:px-6 sm:py-4 sm:text-sm">
                    {transaction.duration_minutes ? formatDuration(transaction.duration_minutes) : '-'}
                  </td>
                  <td className="whitespace-normal px-3 py-3 text-xs text-gray-500 sm:whitespace-nowrap sm:px-6 sm:py-4 sm:text-sm">
                    {formatDate(transaction.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {usageData.transactions.length === 0 && (
          <div className="p-4 text-center text-gray-500 sm:p-6">
            No usage history available yet.
          </div>
        )}

        {/* Pagination */}
        {usageData.pagination && usageData.pagination.total_pages > 1 && (
          <div className="border-t border-gray-200 bg-gray-50 px-3 py-4 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-center text-sm text-gray-700 sm:text-left">
                Showing page {usageData.pagination.current_page} of {usageData.pagination.total_pages}
                <span className="hidden sm:inline"> </span>
                <span className="block sm:inline">
                  ({usageData.pagination.total_items} total items)
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
                <button
                  onClick={() => handlePageChange(usageData.pagination.current_page - 1)}
                  disabled={!usageData.pagination.has_previous}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    usageData.pagination.has_previous
                      ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>

                {/* Page numbers */}
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {Array.from({ length: Math.min(5, usageData.pagination.total_pages) }, (_, i) => {
                    // Calculate start page to center around current page
                    const totalPages = usageData.pagination.total_pages;
                    const currentPage = usageData.pagination.current_page;
                    const maxButtons = Math.min(5, totalPages);

                    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
                    if (startPage + maxButtons - 1 > totalPages) {
                      startPage = Math.max(1, totalPages - maxButtons + 1);
                    }

                    const page = startPage + i;

                    if (page > totalPages) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          page === usageData.pagination.current_page
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(usageData.pagination.current_page + 1)}
                  disabled={!usageData.pagination.has_next}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    usageData.pagination.has_next
                      ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}