import type { Metadata } from 'next'
import '../globals.css'
import { IBM_Plex_Mono } from "next/font/google"

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
})

export const metadata: Metadata = {
  // Title only talks about train due to title being cut otherwise
  title: "codeset - Building large-scale code datasets to train code agents",
  description:
    "Training and evaluating autonomous code agents with high-quality, executable code datasets.",
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={ibmPlexMono.variable}>
      <body>{children}</body>
    </html>
  )
}
