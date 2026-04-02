import type { Metadata } from 'next'
import '../globals.css'
import { IBM_Plex_Mono } from "next/font/google"
import Script from "next/script"
import { GoogleAnalytics } from "../components/GoogleAnalytics";
import { PlausibleAnalytics } from "../components/PlausibleAnalytics";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { getGtagConsentBootstrapScript } from "@/lib/analyticsConsent";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
})

export const metadata: Metadata = {
  title: "codeset — Onboard your coding agent",
  description:
    "Give Claude Code, Cursor, and other coding agents the codebase knowledge your team spent years building. Extracted from your codebase and commit history with AI.",
  icons: {
    icon: '/favicon-bacalhau.png',
  },
  openGraph: {
    title: "codeset — Onboard your coding agent",
    description:
      "Give Claude Code, Cursor, and other coding agents the codebase knowledge your team spent years building. Extracted from your codebase and commit history with AI.",
    url: "https://codeset.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "codeset — Onboard your coding agent",
    description:
      "Give Claude Code, Cursor, and other coding agents the codebase knowledge your team spent years building. Extracted from your codebase and commit history with AI.",
  },
}

import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'sonner'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={ibmPlexMono.variable}>
      <body>
        <Script id="google-consent-default" strategy="beforeInteractive">
          {getGtagConsentBootstrapScript()}
        </Script>
        <PlausibleAnalytics />
        <CookieConsentProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster position="top-right" />
          <GoogleAnalytics />
        </CookieConsentProvider>
      </body>
    </html>
  )
}
