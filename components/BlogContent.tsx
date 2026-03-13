"use client"

import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { addHeadingIds } from '@/lib/headings'

interface BlogContentProps {
  content: string
}

// Y range: 40%–75% over 200px → 5.714px/pp. Bottom anchor at y=230.
const CHART_BOTTOM = 230
const CHART_SCALE = 200 / 35 // px per percentage point

function pct(val: number) {
  return CHART_BOTTOM - (val - 40) * CHART_SCALE
}

function ResultsChart() {
  const barW = 78
  // Groups: Haiku x=60, Sonnet x=294
  const bars = [
    { x: 60,  val: 52,   fill: '#d1d5db', label: '52%',   labelFill: '#6b7280', fw: 'normal' },
    { x: 148, val: 62,   fill: '#111827', label: '62%',   labelFill: '#111827', fw: '600'    },
    { x: 294, val: 56,   fill: '#d1d5db', label: '56%',   labelFill: '#6b7280', fw: 'normal' },
    { x: 382, val: 63.3, fill: '#111827', label: '63.3%', labelFill: '#111827', fw: '600'    },
  ]

  return (
    <div className="not-prose border border-gray-200 rounded-lg overflow-hidden p-5 my-2">
      <svg viewBox="0 0 540 300" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block', fontFamily: 'ui-monospace, monospace' }}>
        {/* Gridlines + Y-axis labels */}
        {[70, 60, 50, 40].map((tick) => (
          <g key={tick}>
            <line x1={48} y1={pct(tick)} x2={500} y2={pct(tick)} stroke={tick === 40 ? '#e5e7eb' : '#f3f4f6'} strokeWidth={1} />
            <text x={42} y={pct(tick) + 4} textAnchor="end" fontSize={11} fill="#9ca3af">{tick}%</text>
          </g>
        ))}

        {/* Bars */}
        {bars.map((b) => {
          const top = pct(b.val)
          const h = CHART_BOTTOM - top
          return (
            <g key={b.x}>
              <rect x={b.x} y={top} width={barW} height={h} fill={b.fill} rx={2} />
              <text x={b.x + barW / 2} y={top - 7} textAnchor="middle" fontSize={12} fontWeight={b.fw} fill={b.labelFill}>{b.label}</text>
            </g>
          )
        })}

        {/* Group labels */}
        <text x={143} y={252} textAnchor="middle" fontSize={12} fill="#374151" fontWeight={500}>Haiku</text>
        <text x={377} y={252} textAnchor="middle" fontSize={12} fill="#374151" fontWeight={500}>Sonnet</text>

        {/* Legend */}
        <rect x={148} y={270} width={10} height={10} fill="#d1d5db" rx={1} />
        <text x={163} y={280} fontSize={11} fill="#6b7280">Baseline</text>
        <rect x={248} y={270} width={10} height={10} fill="#111827" rx={1} />
        <text x={263} y={280} fontSize={11} fill="#6b7280">with Codeset Agent</text>
      </svg>
    </div>
  )
}


export default function BlogContent({ content }: BlogContentProps) {
  const contentWithIds = addHeadingIds(content)
  // Split by code blocks first, then by chart markers
  const processContent = (html: string) => {
    const parts = html.split(/(<pre><code[^>]*>[\s\S]*?<\/code><\/pre>|<p>CHART_RESULTS_PLACEHOLDER<\/p>)/g)

    return parts.map((part, index) => {
      // Code block
      const codeMatch = part.match(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/)
      if (codeMatch) {
        const codeContent = codeMatch[1]
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'")

        return (
          <div key={index} className="not-prose bg-gray-900 border border-gray-200 rounded-lg shadow-lg font-mono text-left text-sm overflow-hidden my-6 blog-code-block">
            <div className="bg-gray-100 px-4 py-2 flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            <SyntaxHighlighter
              language="python"
              style={atomOneDark}
              customStyle={{ background: '#1f2937', padding: '1.5rem', margin: 0, fontSize: '0.875rem', lineHeight: '1.5' }}
              codeTagProps={{ style: { background: 'transparent !important', color: '#f9fafb !important' } }}
            >
              {codeContent.trim()}
            </SyntaxHighlighter>
          </div>
        )
      }

      // Chart marker
      if (part === '<p>CHART_RESULTS_PLACEHOLDER</p>') {
        return <ResultsChart key={index} />
      }

      // Regular HTML content
      return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />
    })
  }

  return (
    <div className="prose prose-lg max-w-none
      prose-headings:font-medium prose-headings:text-black prose-headings:tracking-tight
      prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-4
      prose-h3:text-base prose-h3:mt-8 prose-h3:mb-2
      prose-p:text-gray-600 prose-p:leading-relaxed prose-p:my-4
      prose-li:text-gray-600 prose-li:leading-relaxed
      prose-strong:text-gray-900 prose-strong:font-medium
      prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-gray-800 prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
      [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:rounded-none [&_pre_code]:text-inherit [&_pre_code]:text-sm
      prose-hr:border-gray-100 prose-hr:my-12
      prose-table:text-sm prose-table:border-collapse
      prose-th:text-left prose-th:font-medium prose-th:text-gray-900 prose-th:py-2.5 prose-th:px-4 prose-th:border-b prose-th:border-gray-200 prose-th:bg-gray-50
      prose-td:py-2.5 prose-td:px-4 prose-td:border-b prose-td:border-gray-100 prose-td:text-gray-600
      prose-blockquote:border-l-2 prose-blockquote:border-gray-200 prose-blockquote:pl-4 prose-blockquote:text-gray-500 prose-blockquote:not-italic">
      {processContent(contentWithIds)}
    </div>
  )
}