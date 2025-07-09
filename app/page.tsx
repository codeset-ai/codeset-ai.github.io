"use client"

import Link from "next/link"
import Header from "@/components/Header"
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export default function Home() {

  const sdkCode = `from codeset import Codeset

# Create a session with a sample task
client = Codeset()
session = client.sessions.create(sample_id="swe-task-1")

# Your agent interacts with the environment
client.sessions.execute_command(session.session_id, command)

# Verify your trajectory
verification_result = client.sessions.verify(session)

# Log the result and use as a reward signal during training
print(verification_result)
`

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-mono">
      <Header />
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="w-full mx-auto px-8 flex flex-col md:flex-row items-center gap-12">
          {/* Left Column: Text Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-4">
              &lt;codeset&gt;
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-600 mb-6">
              Accelerate your AI Code Agents
            </h2>
            <p className="max-w-md md:max-w-none mx-auto md:mx-0 text-gray-500 mb-10">
              A platform for training and evaluating agentic code models with large-scale datasets of reproducible, sandboxed environments.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <Link href="https://calendly.com/andre-codeset/intro-to-codeset" className="px-6 py-3 text-base font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors">
                Book a Demo
              </Link>
              <Link href="/contact" className="px-6 py-3 text-base font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors">
                Get In Touch
              </Link>
              <Link href="https://docs.codeset.ai" className="px-6 py-3 text-base font-medium text-black bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 transition-colors">
                Read the Docs
              </Link>
            </div>
          </div>

          {/* Right Column: SDK Code Example */}
          <div className="md:w-1/2 w-full">
            <div className="bg-gray-900 border border-gray-200 rounded-lg shadow-lg font-mono text-left text-sm overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
              <SyntaxHighlighter language="python" style={atomOneDark} customStyle={{ background: '#1f2937', padding: '1.5rem' }}>
                {sdkCode}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
