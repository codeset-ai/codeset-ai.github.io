import type { Metadata } from 'next'
import '../globals.css'
import { IBM_Plex_Mono } from "next/font/google"
import { GoogleAnalytics, GA_TRACKING_ID } from "../components/GoogleAnalytics";
import Script from "next/script";
import { Suspense } from "react";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
})

export const metadata: Metadata = {
  title: "codeset",
  description:
    "Training and evaluating agentic models with large-scale datasets of reproducible, sandboxed environments.",
  icons: {
    icon: '/favicon-bacalhau.png',
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
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="top-right" />
        <Suspense>
          <GoogleAnalytics />
        </Suspense>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_TRACKING_ID}');`}
        </Script>
      </body>
    </html>
  )
}
