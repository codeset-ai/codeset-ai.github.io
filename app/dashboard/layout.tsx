"use client"

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { User, Key, Home, CreditCard } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-gray-50 font-mono">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-lg font-semibold">
              &lt;codeset&gt;
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Dashboard</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <User size={16} />
            <span>{user.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Home size={16} />
                <span>Overview</span>
              </Link>
              <Link
                href="/dashboard/api-keys"
                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Key size={16} />
                <span>API Keys</span>
              </Link>
              <Link
                href="/dashboard/credits"
                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <CreditCard size={16} />
                <span>Credits</span>
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}