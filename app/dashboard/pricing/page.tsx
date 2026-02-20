'use client';

import { useState, useEffect } from 'react';
import { ApiService, PricingInfo } from '@/lib/api';
import { CreditCard, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPricingPage() {
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    ApiService.getPricingInfo()
      .then((data) => {
        if (!cancelled) setPricing(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pricing</h1>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Pay only for what you use. No monthly fees or subscriptions.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 size={20} className="animate-spin" />
          Loading…
        </div>
      ) : pricing ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <CreditCard className="text-gray-400" size={24} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Per-minute usage</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(pricing.cost_per_minute_cents)}/min
                </p>
                <p className="text-sm text-gray-600">
                  Charged for actual session compute time
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Pay only for active session time</li>
              <li>• No monthly fees or subscriptions</li>
              <li>• Unused credits do not expire</li>
            </ul>
          </div>
          <div className="mt-4 flex gap-3">
            <Link
              href="/dashboard/credits"
              className="text-sm font-medium text-black hover:underline"
            >
              Add credits →
            </Link>
            <Link
              href="/dashboard/api-keys"
              className="text-sm font-medium text-black hover:underline"
            >
              API Keys →
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Failed to load pricing.</p>
      )}
    </div>
  );
}
