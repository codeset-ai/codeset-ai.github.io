"use client"

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { User, LogOut, BookOpen, Menu, X } from 'lucide-react';
import TermsAcceptModal from '@/components/TermsAcceptModal';

type ProductNavItem = {
  href: string;
  label: string;
  active: boolean;
};

function DashboardMobileProductSheet({
  open,
  chromeTopPx,
  items,
  onClose,
}: {
  open: boolean;
  chromeTopPx: number;
  items: readonly ProductNavItem[];
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      id="dashboard-product-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Dashboard products"
      className="fixed z-40 overflow-y-auto overscroll-y-contain bg-white md:hidden font-mono"
      style={{
        top: chromeTopPx,
        left: 0,
        right: 0,
        bottom: 0,
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div className="px-4 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
        <ul className="m-0 w-full max-w-sm list-none space-y-2 p-0">
          {items.map(({ href, label, active }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={onClose}
                className={`flex min-h-11 w-full items-center justify-center rounded-lg px-4 py-3 text-center text-sm font-medium leading-snug transition-colors ${
                  active
                    ? 'bg-[#6366F1] text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const dashboardChromeRef = useRef<HTMLDivElement>(null);
  const [chromeTopPx, setChromeTopPx] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!pathname?.startsWith('/dashboard')) return;
    document.title = 'codeset | Dashboard';
    const id = setTimeout(() => {
      document.title = 'codeset | Dashboard';
    }, 100);
    return () => {
      clearTimeout(id);
      document.title = 'codeset';
    };
  }, [pathname]);

  useEffect(() => {
    setProductMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!productMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [productMenuOpen]);

  useEffect(() => {
    if (!productMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProductMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [productMenuOpen]);

  useEffect(() => {
    if (!productMenuOpen) return;
    const mq = window.matchMedia('(min-width: 768px)');
    const close = () => {
      if (mq.matches) setProductMenuOpen(false);
    };
    close();
    mq.addEventListener('change', close);
    return () => mq.removeEventListener('change', close);
  }, [productMenuOpen]);

  useLayoutEffect(() => {
    if (!user) return;
    const el = dashboardChromeRef.current;
    if (!el) return;
    const sync = () => setChromeTopPx(el.offsetHeight);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [user, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const needsTermsAccept = !user.terms_accepted_at;
  const isAgentTab = pathname?.startsWith('/dashboard/agent');
  const isPlatformTab =
    pathname === '/dashboard/platform' ||
    pathname === '/dashboard/api-keys' ||
    pathname === '/dashboard/datasets' ||
    pathname === '/dashboard/pricing';
  const isCreditsTab = pathname === '/dashboard/credits';
  const isUsageTab = pathname === '/dashboard/usage';

  const productNavItems = [
    { href: '/dashboard/agent', label: 'Codeset', active: isAgentTab },
    { href: '/dashboard/platform', label: 'Codeset Platform', active: isPlatformTab },
    { href: '/dashboard/credits', label: 'Credits', active: isCreditsTab },
    { href: '/dashboard/usage', label: 'Usage History', active: isUsageTab },
  ] as const;

  const activeProductLabel =
    productNavItems.find((item) => item.active)?.label ?? 'Dashboard';

  return (
    <>
      <div className="relative min-h-screen bg-gray-50 font-mono">
        <div ref={dashboardChromeRef} className="sticky top-0 z-50 bg-white">
          <div className="border-b border-gray-200 px-3 py-3 sm:px-4 sm:py-4">
            <div className="max-w-7xl mx-auto min-w-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
                <Link
                  href="/"
                  className="flex min-w-0 items-center gap-2 sm:gap-2.5 text-base sm:text-lg font-semibold"
                >
                  <img
                    src="/bacalhau.svg"
                    alt=""
                    className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 object-contain mt-0.5"
                  />
                  <span className="truncate">&lt;codeset&gt;</span>
                </Link>
                <span className="text-gray-400 shrink-0">/</span>
                <span className="text-gray-600 shrink-0 text-sm sm:text-base">Dashboard</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm sm:gap-4 sm:justify-end min-w-0">
                <div className="flex min-w-0 max-w-full items-center gap-2">
                  <User size={16} className="shrink-0" />
                  <span className="truncate">{user.name}</span>
                </div>
                <Link
                  href="https://docs.codeset.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex shrink-0 items-center gap-2 px-3 py-2 font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <BookOpen size={16} />
                  <span>Docs</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="flex shrink-0 items-center gap-2 px-3 py-2 font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
                <button
                  type="button"
                  className="md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  aria-expanded={productMenuOpen}
                  aria-controls="dashboard-product-menu"
                  aria-label={productMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                  onClick={() => setProductMenuOpen((v) => !v)}
                >
                  {productMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 px-3 sm:px-4">
            <div className="max-w-7xl mx-auto min-w-0">
              <div className="py-3 text-center md:hidden">
                <span className="text-sm font-medium text-gray-900">{activeProductLabel}</span>
              </div>

              <div className="hidden md:grid md:grid-cols-4 md:gap-2 md:pt-3 md:pb-2">
                {productNavItems.map(({ href, label, active }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center justify-center px-4 py-2 text-center text-sm font-medium rounded-t-md transition-colors ${
                      active
                        ? 'bg-[#6366F1] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
              {isPlatformTab && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-3 border-t border-gray-100 md:grid-cols-4 md:gap-x-6">
                  <Link
                    href="/dashboard/platform"
                    className={`text-center text-sm font-medium transition-colors md:text-left ${
                      pathname === '/dashboard/platform'
                        ? 'text-black underline underline-offset-4'
                        : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    Overview
                  </Link>
                  <Link
                    href="/dashboard/datasets"
                    className={`text-center text-sm font-medium transition-colors md:text-left ${
                      pathname === '/dashboard/datasets'
                        ? 'text-black underline underline-offset-4'
                        : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    Datasets
                  </Link>
                  <Link
                    href="/dashboard/api-keys"
                    className={`text-center text-sm font-medium transition-colors md:text-left ${
                      pathname === '/dashboard/api-keys'
                        ? 'text-black underline underline-offset-4'
                        : 'text-gray-500 hover:text-black'
                    }`}
                  >
                    API Keys
                  </Link>
                  <Link
                    href="/dashboard/pricing"
                    className={`text-center text-sm font-medium transition-colors md:text-left ${
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
        </div>

        <DashboardMobileProductSheet
          open={productMenuOpen}
          chromeTopPx={chromeTopPx}
          items={productNavItems}
          onClose={() => setProductMenuOpen(false)}
        />

        <div className="max-w-7xl mx-auto min-w-0 px-3 py-6 sm:px-4 sm:py-8">{children}</div>
      </div>
      {needsTermsAccept && <TermsAcceptModal />}
    </>
  );
}
