"use client"

import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'

interface BlogContentProps {
  content: string
}

export default function BlogContent({ content }: BlogContentProps) {
  // Function to replace code blocks with SyntaxHighlighter
  const processContent = (html: string) => {
    // Split content by code blocks
    const parts = html.split(/(<pre><code[^>]*>[\s\S]*?<\/code><\/pre>)/g)

    return parts.map((part, index) => {
      // Check if this part is a code block
      const codeMatch = part.match(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/)

      if (codeMatch) {
        // Extract the code content and decode HTML entities
        const codeContent = codeMatch[1]
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'")

        // Detect language (defaulting to python for now)
        const language = 'python'

        return (
          <div key={index} className="bg-gray-900 border border-gray-200 rounded-lg shadow-lg font-mono text-left text-sm overflow-hidden my-6 blog-code-block">
            <div className="bg-gray-100 px-4 py-2 flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            <SyntaxHighlighter
              language={language}
              style={atomOneDark}
              customStyle={{
                background: '#1f2937',
                padding: '1.5rem',
                margin: 0,
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}
              codeTagProps={{
                style: {
                  background: 'transparent !important',
                  color: '#f9fafb !important'
                }
              }}
            >
              {codeContent.trim()}
            </SyntaxHighlighter>
          </div>
        )
      }

      // Return regular content
      return (
        <div
          key={index}
          dangerouslySetInnerHTML={{ __html: part }}
        />
      )
    })
  }

  return (
    <div className="prose prose-lg max-w-none prose-headings:font-medium prose-headings:text-black prose-p:text-gray-700 prose-p:leading-relaxed prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-black">
      {processContent(content)}
    </div>
  )
}