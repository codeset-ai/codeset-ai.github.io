"use client"

import { useState, useEffect, useRef, useCallback } from "react"

const LOGOS = [
  { src: "/logos/claude.svg", alt: "Claude Code" },
  { src: "/logos/cursor.svg", alt: "Cursor" },
  { src: "/logos/github-copilot.svg", alt: "GitHub Copilot" },
  { src: "/logos/openai.svg", alt: "OpenAI Codex" },
  { src: "/logos/gemini.svg", alt: "Gemini CLI" },
]

const DURATION_MS = 12000
const CENTER_ZONE_START = 0.42
const CENTER_ZONE_END = 0.58

export default function PipelineAnimation() {
  const [items, setItems] = useState<{ id: number; logoIndex: number }[]>([])
  const idCounterRef = useRef(0)

  const spawnItem = useCallback(() => {
    const id = ++idCounterRef.current
    const logoIndex = id % LOGOS.length
    setItems((prev) => [...prev, { id, logoIndex }])
  }, [])

  useEffect(() => {
    spawnItem()
    const interval = setInterval(spawnItem, DURATION_MS / (LOGOS.length + 1))
    return () => clearInterval(interval)
  }, [spawnItem])

  return (
    <div className="relative w-full h-16 overflow-hidden">
      <div className="absolute inset-0 flex items-center">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-24 h-14 md:w-28 md:h-16 bg-black rounded-lg flex items-center justify-center shadow-lg border border-gray-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/bacalhau.svg" alt="Codeset" className="h-6 md:h-8 w-auto object-contain invert" />
        </div>

        {items.map((item) => (
          <PipelineLogo
            key={item.id}
            logo={LOGOS[item.logoIndex]}
            durationMs={DURATION_MS}
            centerZoneStart={CENTER_ZONE_START}
            centerZoneEnd={CENTER_ZONE_END}
            onComplete={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
          />
        ))}
      </div>
    </div>
  )
}

function PipelineLogo({
  logo,
  durationMs,
  centerZoneStart,
  centerZoneEnd,
  onComplete,
}: {
  logo: { src: string; alt: string }
  durationMs: number
  centerZoneStart: number
  centerZoneEnd: number
  onComplete: () => void
}) {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number>()
  const startRef = useRef<number>(0)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    startRef.current = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startRef.current
      const p = Math.min(elapsed / durationMs, 1)
      setProgress(p)
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        onCompleteRef.current()
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [durationMs])

  const leftPercent = -5 + progress * 110
  const inZone = progress >= centerZoneStart && progress <= centerZoneEnd

  return (
    <div
      className="absolute z-20 flex items-center justify-center -translate-x-1/2"
      style={{ left: `${leftPercent}%` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.src}
        alt={logo.alt}
        className={`h-5 transition-all duration-300 ${
          inZone
            ? "opacity-100 grayscale-0 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]"
            : "opacity-40 grayscale"
        }`}
      />
    </div>
  )
}
