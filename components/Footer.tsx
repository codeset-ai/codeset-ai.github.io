import Link from "next/link"
import { Github, Linkedin } from "lucide-react"

import { CookieSettingsLink } from "@/components/CookieSettingsLink"

const SOCIAL_LINKS = [
  {
    href: "https://github.com/codeset-ai",
    label: "Codeset on GitHub",
    icon: "github" as const,
  },
  {
    href: "https://x.com/codesetai",
    label: "Codeset on X",
    icon: "x" as const,
  },
  {
    href: "https://www.linkedin.com/company/codeset-ai/",
    label: "Codeset on LinkedIn",
    icon: "linkedin" as const,
  },
]

function SocialLinkIcon({ kind }: { kind: "github" | "x" | "linkedin" }) {
  const cls = "h-5 w-5"
  if (kind === "github") return <Github className={cls} strokeWidth={1.5} />
  if (kind === "linkedin") return <Linkedin className={cls} strokeWidth={1.5} />
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Codeset. All rights reserved.
            </p>
            <ul className="flex flex-wrap items-center gap-4 list-none p-0 m-0" aria-label="Codeset on social media">
              {SOCIAL_LINKS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-900 transition-colors inline-flex"
                    aria-label={item.label}
                  >
                    <SocialLinkIcon kind={item.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-10">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Codeset Platform</p>
              <div className="flex flex-col gap-2">
                <Link href="/datasets" className="text-sm text-gray-500 hover:text-black transition-colors">Datasets</Link>
                <Link href="https://docs.codeset.ai" className="text-sm text-gray-500 hover:text-black transition-colors">Documentation</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">About Us</p>
              <div className="flex flex-col gap-2">
                <Link href="/blog" className="text-sm text-gray-500 hover:text-black transition-colors">Blog</Link>
                <Link href="/team" className="text-sm text-gray-500 hover:text-black transition-colors">Team</Link>
                <Link href="/contact" className="text-sm text-gray-500 hover:text-black transition-colors">Contact</Link>
                <Link href="/terms" className="text-sm text-gray-500 hover:text-black transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="text-sm text-gray-500 hover:text-black transition-colors">Privacy Policy</Link>
                <CookieSettingsLink />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
