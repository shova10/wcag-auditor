import { GoogleGenAI } from '@google/genai'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const SYSTEM_INSTRUCTION = `You are an expert Web Accessibility (WCAG 2.1 AA/AAA) and Semantic HTML auditor.
Analyze the provided HTML/JSX snippet and return a strict JSON object matching this exact schema:
{
  "overallScore": number (0-100),
  "summary": "Brief summary of accessibility health",
  "issues": [
    {
      "id": "unique-string",
      "type": "missing-alt" | "contrast-ratio" | "missing-aria" | "semantic-html",
      "severity": "critical" | "warning" | "info",
      "element": "the offending tag or attribute",
      "issue": "clear description of WCAG violation",
      "recommendation": "remediation steps",
      "codePatch": "fully corrected HTML snippet with proper ARIA/alt tags"
    }
  ]
}`

const MODEL_NAME = 'gemini-3.8-flash'
const MAX_RETRIES = 3

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error:
        'GEMINI_API_KEY is missing from environment variables (.env.local).',
    })
  }

  const ai = new GoogleGenAI({ apiKey })

  try {
    const { htmlCode } = req.body

    if (!htmlCode || typeof htmlCode !== 'string') {
      return res
        .status(400)
        .json({ error: 'Valid HTML code string is required' })
    }

    let lastError: unknown = null

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: MODEL_NAME,
          contents: `Please audit this HTML/JSX snippet for WCAG 2.1 AA/AAA accessibility compliance:\n\n${htmlCode}`,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
          },
        })

        if (!response.text) {
          throw new Error(`Empty response returned from ${MODEL_NAME}`)
        }

        const jsonOutput = JSON.parse(response.text)
        return res.status(200).json(jsonOutput)
      } catch (err: unknown) {
        lastError = err
        const message = err instanceof Error ? err.message : String(err)
        const isTransient =
          message.includes('503') ||
          message.includes('UNAVAILABLE') ||
          message.includes('429')

        if (isTransient && attempt < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, attempt * 1500))
          continue
        }
        throw err
      }
    }

    throw lastError
  } catch (error: unknown) {
    console.error('Audit API Error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error'
    return res.status(500).json({ error: errorMessage })
  }
}
