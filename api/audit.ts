import { Anthropic } from '@anthropic-ai/sdk'
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error:
        'ANTHROPIC_API_KEY is missing from environment variables (.env.local).',
    })
  }

  const anthropic = new Anthropic({ apiKey })

  try {
    const { htmlCode } = req.body

    if (!htmlCode || typeof htmlCode !== 'string') {
      return res
        .status(400)
        .json({ error: 'Valid HTML code string is required' })
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      system: `You are an expert Web Accessibility (WCAG 2.1 AA/AAA) and Semantic HTML auditor. 
Analyze the provided HTML/JSX snippet and return a strict JSON object (and nothing else, no markdown code block formatting outside JSON) matching this exact structure:
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
}`,
      messages: [
        {
          role: 'user',
          content: `Please audit this snippet for accessibility compliance:\n\n${htmlCode}`,
        },
      ],
    })

    const contentBlock = response.content[0]
    if (contentBlock.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic')
    }

    // Strip markdown code fences if the model wraps the JSON output
    const cleanedJson = contentBlock.text
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    const jsonOutput = JSON.parse(cleanedJson)
    return res.status(200).json(jsonOutput)
  } catch (error: unknown) {
    console.error('Audit API Error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error'
    return res.status(500).json({ error: errorMessage })
  }
}
