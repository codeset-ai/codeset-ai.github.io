"use client"

import Link from "next/link"
import { User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function Header() {
  const { user, login, logout, loading } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-20 w-full max-w-[100vw] box-border pl-3 pr-4 py-2 sm:px-4 sm:py-3 bg-white/80 backdrop-blur-sm">
      <div className="w-full min-w-0 flex flex-nowrap items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 text-base sm:text-lg font-semibold text-black min-w-0 shrink overflow-hidden">
          <img src="/bacalhau.svg" alt="" className="h-6 w-6 sm:h-12 sm:w-12 flex-shrink-0 object-contain mt-0.5 ml-0.5" />
          <span className="truncate">&lt;codeset&gt;</span>
        </Link>

        {!loading && (
          user ? (
            <div className="flex items-center gap-1 sm:gap-3 shrink-0 ml-2">
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
              className="shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-black bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              Sign In
            </button>
          )
        )}
      </div>
    </header>
  )
}
