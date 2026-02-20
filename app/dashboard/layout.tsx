"use client"

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, BookOpen } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isAgentTab = pathname?.startsWith('/dashboard/agent');
  const isPlatformTab = pathname === '/dashboard' || pathname === '/dashboard/api-keys' || pathname === '/dashboard/datasets' || pathname === '/dashboard/pricing';
  const isCreditsTab = pathname === '/dashboard/credits';
  const isUsageTab = pathname === '/dashboard/usage';

  return (
    <div className="min-h-screen bg-gray-50 font-mono">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-lg font-semibold">
              &lt;codeset&gt;
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Dashboard</span>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <User size={16} />
              <span>{user.name}</span>
            </div>
            <Link
              href="https://docs.codeset.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <BookOpen size={16} />
              <span>Docs</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product switcher */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 pt-3">
            <Link
              href="/dashboard/agent"
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                isAgentTab
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Codeset Agent
            </Link>
            <Link
              href="/dashboard"
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                isPlatformTab
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Codeset Platform
            </Link>
            <Link
              href="/dashboard/credits"
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                isCreditsTab
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Credits
            </Link>
            <Link
              href="/dashboard/usage"
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                isUsageTab
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Usage History
            </Link>
          </div>
          {isPlatformTab && (
            <div className="flex items-center gap-6 py-3 border-t border-gray-100">
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/dashboard'
                    ? 'text-black underline underline-offset-4'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Overview
              </Link>
              <Link
                href="/dashboard/datasets"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/dashboard/datasets'
                    ? 'text-black underline underline-offset-4'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Datasets
              </Link>
              <Link
                href="/dashboard/api-keys"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/dashboard/api-keys'
                    ? 'text-black underline underline-offset-4'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                API Keys
              </Link>
              <Link
                href="/dashboard/pricing"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/dashboard/pricing'
                    ? 'text-black underline underline-offset-4'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Pricing
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
