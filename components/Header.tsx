"use client"

import Link from "next/link"
import Image from "next/image"
import { User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function Header() {
  const { user, login, logout, loading } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-20 px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="w-full mx-auto px-8 flex items-center justify-between">
        <Link href="/">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Company%20Logo-JsOfHZ9d6BDOHKAfZ1zx71BLYUE7dw.svg"
            alt="Codeset"
            width={100}
            height={20}
            className="filter invert"
            priority
          />
        </Link>

        {!loading && (
          user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
                <User size={16} />
                <div className="flex flex-col">
                  <span>{user.name}</span>
                  <span className="text-xs text-gray-500">Dashboard</span>
                </div>
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="px-4 py-2 text-sm font-medium text-black bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 transition-colors"
            >
              Sign In
            </button>
          )
        )}
      </div>
    </header>
  )
}
