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
      <div className="p-6">
        <div className="text-center text-gray-600">
          Please log in to view your usage history.
        </div>
      </div>
    );
  }

  if (loading && !usageData) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Usage History</h1>
        <div className="text-center text-gray-600">Loading usage data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Usage History</h1>
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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Usage History</h1>
      <p className="text-sm text-gray-500 mb-6">
        Summary and transaction list below are limited to 10,000 transactions.
      </p>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          From
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          To
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2 ml-4 border-l border-gray-200 pl-4">
          <span className="text-sm text-gray-700">Type:</span>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(usageData.current_balance_cents)}
          </div>
          <div className="text-sm text-gray-600 mt-1">Current Balance</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(usageData.total_deposits_cents)}
          </div>
          <div className="text-sm text-gray-600 mt-1">Total Deposits</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(usageData.total_usage_cents)}
          </div>
          <div className="text-sm text-gray-600 mt-1">Total Usage</div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {usageData.summary.total_sessions}
          </div>
          <div className="text-sm text-gray-600 mt-1">Total Sessions</div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
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
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
        </div>

        <div className="overflow-x-auto relative">
          {loading && usageData && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-b-lg">
              <span className="text-sm text-gray-600">Loading...</span>
            </div>
          )}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usageData.transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
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
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.duration_minutes ? formatDuration(transaction.duration_minutes) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {usageData.transactions.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No usage history available yet.
          </div>
        )}

        {/* Pagination */}
        {usageData.pagination && usageData.pagination.total_pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {usageData.pagination.current_page} of {usageData.pagination.total_pages}
                ({usageData.pagination.total_items} total items)
              </div>

              <div className="flex items-center space-x-2">
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
                <div className="flex items-center space-x-1">
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