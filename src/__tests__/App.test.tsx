import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import App from '../App.tsx'
import type { AuditResponse } from '../types/audit.ts'

const MOCK_AUDIT_RESPONSE: AuditResponse = {
  overallScore: 45,
  summary:
    'Critical missing alt text and insufficient color contrast detected.',
  issues: [
    {
      id: 'issue-1',
      type: 'missing-alt',
      severity: 'critical',
      element: '<img src="banner.png">',
      issue: 'Image is missing an alternative text attribute.',
      recommendation: 'Provide a descriptive alt attribute for screen readers.',
      codePatch: '<img src="banner.png" alt="Promotional product banner" />',
    },
  ],
}

describe('WCAG Alt-Text & Contrast Auditor - App Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('Test 1 (Happy Path): renders structured WCAG results when fetch returns valid AI JSON', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => MOCK_AUDIT_RESPONSE,
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const textarea = screen.getByRole('textbox')
    await user.clear(textarea)
    await user.type(textarea, '<img src="banner.png">')

    const submitButton = screen.getByRole('button', { name: /run wcag audit/i })
    await user.click(submitButton)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/audit',
      expect.objectContaining({
        method: 'POST',
      })
    )

    await waitFor(() => {
      expect(screen.getByText(/45/)).toBeInTheDocument()
      expect(
        screen.getByText(
          /Critical missing alt text and insufficient color contrast detected./i
        )
      ).toBeInTheDocument()
      expect(
        screen.getByText(/Image is missing an alternative text attribute./i)
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          '<img src="banner.png" alt="Promotional product banner" />'
        )
      ).toBeInTheDocument()
    })
  })

  it('Test 2 (Validation): disables submit and does not call fetch when input is empty', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const textarea = screen.getByRole('textbox')
    await user.clear(textarea)

    const submitButton = screen.getByRole('button', { name: /run wcag audit/i })
    expect(submitButton).toBeDisabled()

    await user.click(submitButton)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("Test 3 (API Failure Fallback): displays a role='alert' error banner when fetch returns a 500 error", async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({
        error: 'Internal Server Error from Gemini backend',
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const textarea = screen.getByRole('textbox')
    await user.clear(textarea)
    await user.type(textarea, '<div>Unlabeled button</div>')

    const submitButton = screen.getByRole('button', { name: /run wcag audit/i })
    await user.click(submitButton)

    const alertBanner = await screen.findByRole('alert')
    expect(alertBanner).toBeInTheDocument()
    expect(alertBanner).toHaveTextContent(
      /Internal Server Error from Gemini backend|audit failed/i
    )
  })
})
