"use client"

import { useEffect, useState } from "react"
import type { TocHeading } from "@/lib/headings"

export type { TocHeading }

export default function TableOfContents({ headings, showLabel = true }: { headings: TocHeading[], showLabel?: boolean }) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0px 0px -70% 0px" }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav>
      {showLabel && (
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-3">
          On this page
        </p>
      )}
      <ul className="space-y-1.5">
        {headings.map(({ id, text, level }) => (
          <li key={id} style={{ paddingLeft: level === 3 ? "0.75rem" : "0" }}>
            <a
              href={`#${id}`}
              className={`block text-xs leading-snug transition-colors ${
                activeId === id
                  ? "text-black font-medium"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
