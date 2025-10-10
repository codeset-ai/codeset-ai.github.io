"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
          />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {/* <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
            Pricing
          </Link> */}
          <Link href="/team" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
            Team
          </Link>
          <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
            Blog
          </Link>
          <Link href="https://docs.codeset.ai" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
            Docs
          </Link>
          <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
            Contact
          </Link>

          {!loading && (
            user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
                  <User size={16} />
                  {user.name}
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
              <div className="flex items-center gap-2">
                <button
                  onClick={login}
                  className="px-4 py-2 text-sm font-medium text-black bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Sign In
                </button>
              </div>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-black z-50 relative"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/90 backdrop-blur-md z-40 shadow-lg">
          <div className="flex flex-col items-center space-y-4 p-6">
            {/* <Link
              href="/pricing"
              className="text-lg font-medium text-black hover:scale-105 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link> */}
            <Link
              href="/team"
              className="text-lg font-medium text-black hover:scale-105 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Team
            </Link>
            <Link
              href="/blog"
              className="text-lg font-medium text-black hover:scale-105 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="https://docs.codeset.ai"
              className="text-lg font-medium text-black hover:scale-105 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
            <Link
              href="/contact"
              className="text-lg font-medium text-black hover:scale-105 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            {/* <div className="pt-4 border-t border-black/10 w-full mt-4">
              <Link href="https://calendly.com/andre-codeset/intro-to-codeset" className="w-full block text-center px-4 py-3 text-lg font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors">
                Book a Demo
              </Link>
            </div> */}

            {!loading && (
              <div className="pt-4 border-t border-black/10 w-full mt-4 space-y-3">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-lg font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User size={18} />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-lg font-medium text-black bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        login();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-lg font-medium text-black bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
