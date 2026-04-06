"use client"

import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { addHeadingIds } from '@/lib/headings'

interface BlogContentProps {
  content: string
}

const CHART_MIN = 40
const CHART_MAX = 75

function barWidth(val: number) {
  return ((val - CHART_MIN) / (CHART_MAX - CHART_MIN)) * 100
}

function ResultsChart() {
  const groups = [
    { model: 'Claude Haiku 4.5',  baseline: 52,   codeset: 62,   delta: '+10pp' },
    { model: 'Claude Sonnet 4.5', baseline: 56,   codeset: 65.3, delta: '+9.3pp' },
    { model: 'Claude Opus 4.5',   baseline: 60.7, codeset: 68,   delta: '+7.3pp' },
  ]

  return (
    <div className="not-prose border border-gray-200 rounded-lg p-4 sm:p-5 my-2 font-mono">
      <p className="text-[10px] text-gray-400 italic mb-5">codeset-gym-python · 150 tasks</p>
      <div className="space-y-5">
        {groups.map(({ model, baseline, codeset, delta }) => (
          <div key={model}>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">{model}</span>
              <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">{delta}</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-14 text-right text-[9px] text-gray-400 shrink-0">baseline</span>
                <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                  <div className="h-full bg-gray-300 rounded" style={{ width: `${barWidth(baseline)}%` }} />
                </div>
                <span className="text-[10px] text-gray-500 w-10 shrink-0">{baseline}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-14 text-right text-[9px] text-gray-400 shrink-0">codeset</span>
                <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                  <div className="h-full bg-gray-900 rounded" style={{ width: `${barWidth(codeset)}%` }} />
                </div>
                <span className="text-[10px] text-gray-900 font-semibold w-10 shrink-0">{codeset}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-5 mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gray-300" />
          <span className="text-[10px] text-gray-500">Baseline</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gray-900" />
          <span className="text-[10px] text-gray-500">with Codeset</span>
        </div>
      </div>
    </div>
  )
}


function CodexResultsChart() {
  const CHART_MIN = 50
  const CHART_MAX = 70
  function barWidth(val: number) {
    return ((val - CHART_MIN) / (CHART_MAX - CHART_MIN)) * 100
  }

  const benchmarks = [
    { name: 'codeset-gym-python', tasks: '150 tasks', baseline: 60.7, codeset: 66,   delta: '+5.3pp' },
    { name: 'SWE-Bench Pro',      tasks: '400 tasks', baseline: 56.5, codeset: 58.5, delta: '+2.0pp' },
  ]

  return (
    <div className="not-prose border border-gray-200 rounded-lg p-4 sm:p-5 my-2 font-mono">
      <p className="text-[10px] text-gray-400 italic mb-5">GPT-5.4 · resolution rate</p>
      <div className="space-y-5">
        {benchmarks.map(({ name, tasks, baseline, codeset, delta }) => (
          <div key={name}>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">
                {name} <span className="text-gray-400 font-normal">· {tasks}</span>
              </span>
              <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">{delta}</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-14 text-right text-[9px] text-gray-400 shrink-0">baseline</span>
                <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                  <div className="h-full bg-gray-300 rounded" style={{ width: `${barWidth(baseline)}%` }} />
                </div>
                <span className="text-[10px] text-gray-500 w-10 shrink-0">{baseline}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-14 text-right text-[9px] text-gray-400 shrink-0">codeset</span>
                <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                  <div className="h-full bg-gray-900 rounded" style={{ width: `${barWidth(codeset)}%` }} />
                </div>
                <span className="text-[10px] text-gray-900 font-semibold w-10 shrink-0">{codeset}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-5 mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gray-300" />
          <span className="text-[10px] text-gray-500">Baseline</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gray-900" />
          <span className="text-[10px] text-gray-500">with Codeset</span>
        </div>
      </div>
    </div>
  )
}

function processTableHtml(tableHtml: string): string {
  const headers: string[] = []
  const thRegex = /<th[^>]*>([\s\S]*?)<\/th>/g
  let m
  while ((m = thRegex.exec(tableHtml)) !== null) {
    headers.push(m[1].replace(/<[^>]+>/g, '').trim())
  }
  if (headers.length === 0) return tableHtml

  return tableHtml.replace(/<tr>([\s\S]*?)<\/tr>/g, (rowHtml) => {
    if (/<th/.test(rowHtml)) return rowHtml
    let col = 0
    return rowHtml.replace(/<td>/g, () => {
      const label = headers[col] ?? ''
      col++
      return `<td data-label="${label}">`
    })
  })
}

export default function BlogContent({ content }: BlogContentProps) {
  const contentWithIds = addHeadingIds(content)
  const processContent = (html: string) => {
    const parts = html.split(/(<pre><code[^>]*>[\s\S]*?<\/code><\/pre>|<p>CHART_RESULTS_PLACEHOLDER<\/p>|<p>CHART_CODEX_PLACEHOLDER<\/p>|<table[\s\S]*?<\/table>)/g)

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
          <div key={index} className="not-prose border border-gray-200 rounded-lg shadow-lg font-mono text-left text-sm my-6 blog-code-block overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            <SyntaxHighlighter
              language="python"
              style={atomOneDark}
              wrapLongLines={true}
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
      if (part === '<p>CHART_CODEX_PLACEHOLDER</p>') {
        return <CodexResultsChart key={index} />
      }

      // Table — inject data-label attributes for mobile card layout
      if (/<table/.test(part)) {
        return <div key={index} dangerouslySetInnerHTML={{ __html: processTableHtml(part) }} />
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