"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Key, Calendar, Activity, DollarSign, CreditCard } from 'lucide-react';
import { ApiService, UserCredits } from '@/lib/api';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(true);

  useEffect(() => {
    const loadCredits = async () => {
      try {
        const creditsData = await ApiService.getUserCredits();
        setCredits(creditsData);
      } catch (error) {
        console.error('Failed to load credits:', error);
      } finally {
        setCreditsLoading(false);
      }
    };

    if (user) {
      loadCredits();
    }

    // Refresh credits when page becomes visible (user returns from payment)
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        loadCredits();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600">
          Manage your API keys and monitor your usage from your dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* API Keys */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Key className="text-blue-600" size={20} />
              <h3 className="text-lg font-medium text-gray-900">API Keys</h3>
            </div>
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-2">
            {user.api_keys.filter(key => key.is_active).length}
          </div>
          <p className="text-sm text-gray-600">Active keys</p>
          <Link
            href="/dashboard/api-keys"
            className="inline-block mt-4 text-blue-600 text-sm font-medium hover:text-blue-700"
          >
            Manage keys →
          </Link>
        </div>

        {/* Credits Balance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="text-green-600" size={20} />
              <h3 className="text-lg font-medium text-gray-900">Credits</h3>
            </div>
          </div>
          {creditsLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : credits ? (
            <>
              <div className="text-3xl font-semibold text-gray-900 mb-2">
                {formatCurrency(credits.balance)}
              </div>
              <p className="text-sm text-gray-600">Current balance</p>
              <Link
                href="/dashboard/credits"
                className="inline-block mt-4 text-green-600 text-sm font-medium hover:text-green-700"
              >
                Manage credits →
              </Link>
            </>
          ) : (
            <>
              <div className="text-lg text-gray-500 mb-2">Error loading</div>
              <p className="text-sm text-gray-600">Failed to load balance</p>
            </>
          )}
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <User className="text-green-600" size={20} />
              <h3 className="text-lg font-medium text-gray-900">Account</h3>
            </div>
          </div>
          <div className="text-lg font-semibold text-gray-900 mb-2">
            {user.is_active ? 'Active' : 'Inactive'}
          </div>
          <p className="text-sm text-gray-600">
            Member since {formatDate(user.created_at)}
          </p>
        </div>

        {/* Last Login */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Activity className="text-purple-600" size={20} />
              <h3 className="text-lg font-medium text-gray-900">Activity</h3>
            </div>
          </div>
          <div className="text-lg font-semibold text-gray-900 mb-2">
            {user.last_login_at ? formatDate(user.last_login_at) : 'Never'}
          </div>
          <p className="text-sm text-gray-600">Last login</p>
        </div>
      </div>

      {/* API Keys Preview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent API Keys</h3>
          <Link
            href="/dashboard/api-keys"
            className="text-blue-600 text-sm font-medium hover:text-blue-700"
          >
            View all →
          </Link>
        </div>

        {user.api_keys.length > 0 ? (
          <div className="space-y-3">
            {user.api_keys.slice(0, 3).map((apiKey) => (
              <div
                key={apiKey.key_id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Key size={16} className="text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {apiKey.name || 'Unnamed Key'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Created {formatDate(apiKey.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      apiKey.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {apiKey.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Key size={48} className="mx-auto text-gray-300 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No API keys yet</h4>
            <p className="text-gray-600 mb-4">
              Create your first API key to start using the Codeset API.
            </p>
            <Link
              href="/dashboard/api-keys"
              className="inline-block px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
            >
              Create API Key
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}