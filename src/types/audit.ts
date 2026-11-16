export interface AuditIssue {
  id: string
  type: 'missing-alt' | 'contrast-ratio' | 'missing-aria' | 'semantic-html'
  severity: 'critical' | 'warning' | 'info'
  element: string // The snippet or tag being flagged
  issue: string // Description of the WCAG violation
  recommendation: string // How to fix it
  codePatch: string // Valid HTML/ARIA replacement snippet
}

export interface AuditResponse {
  overallScore: number // 0 - 100 WCAG compliance score
  summary: string
  issues: AuditIssue[]
}
