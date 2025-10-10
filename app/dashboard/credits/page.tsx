"use client"

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ApiService, UserCredits, PricingInfo } from '@/lib/api';
import { CreditCard, DollarSign, TrendingUp, TrendingDown, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function CreditsPage() {
  const searchParams = useSearchParams();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [depositAmount, setDepositAmount] = useState(10);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [creditsData, pricingData] = await Promise.all([
        ApiService.getUserCredits(),
        ApiService.getPricingInfo()
      ]);
      setCredits(creditsData);
      setPricing(pricingData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load credits data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Handle payment status from URL params
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      toast.success('Payment successful! Refreshing your balance...');
      // Remove the query parameter from URL
      window.history.replaceState({}, '', '/dashboard/credits');

      // Delay initial load to give webhook time to process
      setTimeout(() => {
        loadData();
        // Set up polling to check for balance updates
        const pollInterval = setInterval(async () => {
          try {
            const creditsData = await ApiService.getUserCredits();
            setCredits(prevCredits => {
              if (prevCredits && creditsData.balance > prevCredits.balance) {
                // Balance has increased, stop polling and show success
                clearInterval(pollInterval);
                toast.success('Credits successfully added to your account!');
                return creditsData;
              }
              return creditsData;
            });
          } catch (error) {
            console.error('Failed to poll credits:', error);
          }
        }, 2000); // Poll every 2 seconds

        // Stop polling after 30 seconds
        setTimeout(() => {
          clearInterval(pollInterval);
        }, 30000);
      }, 1000);

      return; // Don't load data immediately
    } else if (paymentStatus === 'cancelled') {
      toast.error('Payment was cancelled.');
      // Remove the query parameter from URL
      window.history.replaceState({}, '', '/dashboard/credits');
    }

    loadData();
  }, [searchParams]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    toast.success('Balance refreshed!');
  };

  const handleDeposit = async () => {
    if (depositAmount < 1) {
      toast.error('Minimum deposit is $1.00');
      return;
    }

    try {
      const response = await ApiService.createDepositSession({
        amount_cents: Math.round(depositAmount * 100),
        currency: 'usd'
      });

      // Redirect to Stripe Checkout
      window.location.href = response.checkout_url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create payment session');
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Credits</h1>
            <p className="text-gray-600">Manage your account balance and billing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!credits || !pricing) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load credits data</p>
      </div>
    );
  }

  const depositAmountOptions = [5, 10, 25, 50, 100];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Credits</h1>
          <p className="text-gray-600">Manage your account balance and billing</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 border border-gray-200 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowDepositDialog(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} />
            <span>Add Credits</span>
          </button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Balance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="text-green-600" size={20} />
              <h3 className="text-lg font-medium text-gray-900">Current Balance</h3>
            </div>
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-2">
            {formatCurrency(credits.balance)}
          </div>
          <p className="text-sm text-gray-600">
            Updated {formatDate(credits.last_updated)}
          </p>
        </div>

        {/* Total Deposited */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="text-blue-600" size={20} />
              <h3 className="text-lg font-medium text-gray-900">Total Deposited</h3>
            </div>
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-2">
            {formatCurrency(credits.total_deposited)}
          </div>
          <p className="text-sm text-gray-600">All-time deposits</p>
        </div>

        {/* Total Spent */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="text-purple-600" size={20} />
              <h3 className="text-lg font-medium text-gray-900">Total Spent</h3>
            </div>
          </div>
          <div className="text-3xl font-semibold text-gray-900 mb-2">
            {formatCurrency(credits.total_spent)}
          </div>
          <p className="text-sm text-gray-600">All-time usage</p>
        </div>
      </div>

      {/* Pricing Information */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <CreditCard className="text-gray-400" size={24} />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Per-Minute Usage</h4>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(pricing.cost_per_minute_cents)}/min
              </p>
              <p className="text-sm text-gray-600">
                You're only charged for actual compute time
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">How billing works</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Pay only for active session time</li>
              <li>• No monthly fees or subscriptions</li>
              <li>• Unused credits never expire</li>
              <li>• Billing is calculated per minute</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Low Balance Warning */}
      {credits.balance < 500 && ( // Less than $5.00
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-yellow-800">Low Balance</span>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            Your balance is running low. Consider adding more credits to avoid service interruption.
          </p>
        </div>
      )}

      {/* Deposit Dialog */}
      {showDepositDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <Plus className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Add Credits</h3>
                <p className="text-sm text-gray-500">
                  Add funds to your account via Stripe
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Amount
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {depositAmountOptions.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDepositAmount(amount)}
                      className={`px-3 py-2 text-sm rounded-md border ${
                        depositAmount === amount
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                <div>
                  <label htmlFor="customAmount" className="block text-sm text-gray-600 mb-1">
                    Or enter custom amount:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="customAmount"
                      min="1"
                      max="10000"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      className="pl-8 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded p-3">
                <p className="text-sm text-gray-600">
                  You'll be redirected to Stripe to complete the payment securely.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowDepositDialog(false);
                  setDepositAmount(10);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                disabled={depositAmount < 1}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add {formatCurrency(depositAmount * 100)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}