"use client"

import Link from "next/link"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { User, LogOut, Menu, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function Header() {
  const { user, login, logout, loading } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileMenuTop, setMobileMenuTop] = useState(0)
  const [scrollLockPad, setScrollLockPad] = useState(0)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useLayoutEffect(() => {
    if (!mobileMenuOpen) return
    const el = barRef.current
    if (!el) return
    const update = () => setMobileMenuTop(el.offsetHeight)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [mobileMenuOpen])

  useEffect(() => {
    if (!mobileMenuOpen) {
      setScrollLockPad(0)
      return
    }
    const pad = Math.max(0, window.innerWidth - document.documentElement.clientWidth)
    setScrollLockPad(pad)
    const prevOverflow = document.body.style.overflow
    const prevPadding = document.body.style.paddingRight
    document.body.style.overflow = "hidden"
    if (pad > 0) document.body.style.paddingRight = `${pad}px`
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPadding
      setScrollLockPad(0)
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mobileMenuOpen])

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    const onChange = () => {
      if (mq.matches) setMobileMenuOpen(false)
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const closeMobile = () => setMobileMenuOpen(false)

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full max-w-[100vw] box-border ${
        mobileMenuOpen ? "z-[100]" : "z-20"
      }`}
      style={{ paddingRight: scrollLockPad || undefined }}
    >
      <div
        ref={barRef}
        className="relative z-[101] w-full min-w-0 flex flex-nowrap items-center justify-between gap-2 box-border bg-white/80 backdrop-blur-sm pl-3 pr-4 py-2 sm:px-4 sm:py-3"
      >
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 text-base sm:text-lg font-semibold text-black min-w-0 shrink overflow-hidden">
          <img src="/bacalhau.svg" alt="" className="h-6 w-6 sm:h-12 sm:w-12 flex-shrink-0 object-contain mt-0.5 ml-0.5" />
          <span className="truncate">&lt;codeset&gt;</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 sm:gap-10 shrink-0 min-w-0 ml-2">
          <nav className="flex items-center gap-5 sm:gap-8 text-sm sm:text-base" aria-label="Main">
            <Link href="/team" className="font-medium text-gray-600 hover:text-black transition-colors whitespace-nowrap">
              About Us
            </Link>
            <Link href="/blog" className="font-medium text-gray-600 hover:text-black transition-colors whitespace-nowrap">
              Blog
            </Link>
            <Link href="/contact" className="font-medium text-gray-600 hover:text-black transition-colors whitespace-nowrap">
              Contacts
            </Link>
          </nav>

          {!loading && (
            user ? (
              <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                <Link href="/dashboard" className="flex items-center gap-2 px-2 sm:px-3 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
                  <User size={16} />
                  <div className="hidden sm:flex flex-col">
                    <span>{user.name}</span>
                    <span className="text-xs text-gray-500">Dashboard</span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-2 sm:px-3 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-white bg-[#6366F1] rounded-md hover:brightness-110 transition-all whitespace-nowrap"
              >
                Sign In
              </button>
            )
          )}
        </div>

        <button
          type="button"
          className="md:hidden flex items-center justify-center p-2 -mr-1 text-gray-700 hover:text-black"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen((o) => !o)}
        >
          {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {mobileMenuOpen ? (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="md:hidden fixed left-0 right-0 z-[100] flex min-h-0 flex-col bg-white"
          style={{
            top: mobileMenuTop,
            height: `max(0px, calc(100dvh - ${mobileMenuTop}px))`,
          }}
        >
          <nav
            className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto border-t border-gray-200 px-4 pb-8 pt-4"
            aria-label="Main"
          >
            <Link
              href="/team"
              onClick={closeMobile}
              className="block rounded-lg px-3 py-3 text-lg font-medium text-gray-800 hover:bg-gray-100"
            >
              About Us
            </Link>
            <Link
              href="/blog"
              onClick={closeMobile}
              className="block rounded-lg px-3 py-3 text-lg font-medium text-gray-800 hover:bg-gray-100"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              onClick={closeMobile}
              className="block rounded-lg px-3 py-3 text-lg font-medium text-gray-800 hover:bg-gray-100"
            >
              Contacts
            </Link>

            <div className="my-4 border-t border-gray-100" aria-hidden />

            {loading ? (
              <div className="px-3 py-3 text-sm text-gray-500">Loading…</div>
            ) : user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={closeMobile}
                  className="flex items-center gap-2 rounded-lg px-3 py-3 text-lg font-medium text-gray-800 hover:bg-gray-100"
                >
                  <User size={20} />
                  <span className="flex flex-col items-start leading-tight">
                    <span>{user.name}</span>
                    <span className="text-sm font-normal text-gray-500">Dashboard</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    closeMobile()
                    void logout()
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-lg font-medium text-gray-800 hover:bg-gray-100"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  closeMobile()
                  void login()
                }}
                className="w-full rounded-lg bg-[#6366F1] px-3 py-3 text-center text-lg font-medium text-white hover:brightness-110"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
