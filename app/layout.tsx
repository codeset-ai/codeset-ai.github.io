import type { Metadata } from 'next'
import '../globals.css'
import { IBM_Plex_Mono } from "next/font/google"
import { GoogleAnalytics } from "../components/GoogleAnalytics";
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
      </body>
    </html>
  )
}
