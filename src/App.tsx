import { useState } from 'react'
import { Accessibility } from 'lucide-react'
import { CodeInputPane } from './components/CodeInputPane'
import { AuditResultsPane } from './components/AuditResultsPane'
import type { AuditResponse } from './types/audit'

export function App() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<AuditResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRunAudit = async () => {
    if (!code.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ htmlCode: code }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to audit snippet')
      }

      setResult(data as AuditResponse)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-md"
      >
        Skip to main content
      </a>

      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-lg">
            <Accessibility className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              WCAG Alt-Text & Contrast Auditor
            </h1>
            <p className="text-xs text-slate-500">
              AI-powered semantic HTML, contrast ratio, and ARIA compliance
              analyzer
            </p>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <CodeInputPane
          code={code}
          onChange={setCode}
          onAudit={handleRunAudit}
          isLoading={isLoading}
        />
        <AuditResultsPane result={result} isLoading={isLoading} error={error} />
      </main>
    </div>
  )
}

export default App
