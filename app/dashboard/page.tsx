'use client';

import Link from 'next/link';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const SDK_EXAMPLE = `from codeset import Codeset

# Initialize client with your API key
client = Codeset(api_key="your_api_key")

# Create a session for a task
session = client.sessions.create(
    dataset="codeset-gym-python",
    sample_id="matiasb__python-unidiff-19"
)

# Interact with the environment
result = client.sessions.execute_command(
    session_id=session.session_id,
    command="ls -lah"
)

# Start a verification job
verify = client.sessions.verify.start(
    session_id=session.session_id
)

# Close session
client.sessions.close(session_id=session.session_id)
`;

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="mt-2 text-gray-600 max-w-2xl">
          The Codeset Platform allows you to train and evaluate agentic models with large-scale datasets
          of reproducible, sandboxed environments. You run sandbox sessions, interact with the
          environment, and run verification — all via the API. Use API keys to authenticate, pay
          only for compute time, and track usage in your dashboard.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Example</h2>
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-200 bg-gray-100 flex items-center gap-2">
          <span className="w-3 h-3 bg-red-400 rounded-full" />
          <span className="w-3 h-3 bg-yellow-400 rounded-full" />
          <span className="w-3 h-3 bg-green-400 rounded-full" />
        </div>
        <div className="text-sm">
          <SyntaxHighlighter
            language="python"
            style={atomOneDark}
            customStyle={{ background: '#1f2937', padding: '1rem 1.25rem', margin: 0 }}
            showLineNumbers={false}
          >
            {SDK_EXAMPLE}
          </SyntaxHighlighter>
        </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          <a href="https://docs.codeset.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-black">
            Full documentation →
          </a>
        </p>
      </div>
    </div>
  );
}
