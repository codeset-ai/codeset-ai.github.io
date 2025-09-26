'use client';

import { useState, useEffect } from 'react';
import { ApiService, UsageHistory, UsageTransaction } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';

export default function UsagePage() {
  const { user } = useAuth();
  const [usageData, setUsageData] = useState<UsageHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);

  useEffect(() => {
    loadUsageData();
  }, [currentPage]);

  const loadUsageData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getUsageHistory(currentPage, itemsPerPage);
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

  if (loading) {
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
              {formatDuration(usageData.summary.total_session_duration_minutes)}
            </div>
            <div className="text-sm text-gray-600">Total Session Time</div>
          </div>

          <div>
            <div className="text-lg font-medium text-gray-900">
              {formatDuration(usageData.summary.average_session_duration_minutes)}
            </div>
            <div className="text-sm text-gray-600">Average Session Duration</div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
        </div>

        <div className="overflow-x-auto">
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
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.type === 'deposit'
                        ? 'Deposit'
                        : transaction.type === 'refund'
                        ? 'Refund'
                        : 'Session Usage'}
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