# WCAG Alt-Text & Contrast Auditor

An AI-powered web accessibility and semantic HTML auditor built with React, TypeScript, Tailwind CSS v4, and Vercel Serverless Functions. Paste raw HTML or JSX snippets into the split-pane editor to receive a structured WCAG 2.1 AA/AAA compliance score, categorized violation diagnostics, and drop-in remediation code patches.

---

## Key Features

- **Split-Pane Workspace:** Responsive side-by-side layout pairing a keyboard-accessible HTML/JSX code editor with a real-time accessibility report panel.
- **Structured WCAG 2.1 AA/AAA Diagnostics:** Evaluates snippets across four core categories:
  - `missing-alt` — Missing, empty, or non-descriptive `alt` attributes on informative images.
  - `contrast-ratio` — Low-contrast foreground/background color combinations failing AA/AAA thresholds.
  - `missing-aria` — Missing accessible names, labels, roles, or state attributes on interactive controls.
  - `semantic-html` — Non-semantic `<div>`/`<span>` patterns where native elements (`<button>`, `<nav>`, `<main>`, `<label>`) should be used.
- **Actionable Code Patches:** Generates copy-ready, corrected HTML/JSX snippets alongside severity badges (`critical`, `warning`, `info`) and remediation guidance.
- **Resilient Serverless Backend:** Uses Google Gemini (`gemini-3.8-flash`) with enforced `application/json` schema output and automatic exponential backoff retry handling for transient API load spikes.
- **Accessible UI Architecture:** Built with semantic landmarks, live status announcements (`aria-live`), focus management, and keyboard-first controls.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS v4, Lucide React Icons |
| **Backend** | Vercel Serverless Functions (`@vercel/node`) |
| **AI Engine** | Google Gen AI SDK (`@google/genai` — `gemini-3.8-flash`) |
| **Testing** | Vitest, React Testing Library |

---

## Project Architecture

```text
wcag-auditor/
├── api/
│   └── audit.ts               # Serverless POST handler calling Gemini with retry logic
├── src/
│   ├── components/
│   │   ├── AuditCard.tsx      # Individual WCAG issue card with severity & code patch
│   │   ├── AuditResultsPane.tsx # Score summary header, empty/error states, & issue list
│   │   └── CodeInputPane.tsx  # Accessible HTML/JSX input editor & submit controls
│   ├── types/
│   │   └── audit.ts           # Strict TypeScript interfaces for AuditRequest & AuditResponse
│   ├── App.tsx                # Split-pane state orchestration & API fetch integration
│   ├── index.css              # Tailwind CSS v4 imports and design tokens
│   └── main.tsx               # Application entry point
├── vercel.json                # Vercel deployment configuration
├── package.json
└── tsconfig.json
```

## Local Development Setup
Prerequisites
Node.js v18 or higher

Vercel CLI (npm i -g vercel) to run the /api/audit serverless function locally

A free Google Gemini API Key from Google AI Studio

1. Clone & Install Dependencies
   
   git clone [https://github.com/](https://github.com/)<your-username>/wcag-auditor.git
   cd wcag-auditor
   npm install

2. Configure Environment Variables
Create a .env.local file in the root directory and add your Gemini API key:

  Code snippet
  GEMINI_API_KEY=your_gemini_api_key_here


3. Start the Local Full-Stack Server
Run vercel dev so both the Vite frontend and /api/audit serverless endpoint run together on http://localhost:3000:

Bash
   vercel dev
(Note on Windows PowerShell: If vercel dev does not automatically pick up .env.local, load it into your session first:)

PowerShell
      Get-Content .env.local | ForEach-Object { if ($_ -match '^\s*([^#][^=]+)=(.*)$') {      [Environment]::SetEnvironmentVariable($matches[1].Trim(),$matches[2].Trim(), "Process") } }
    vercel dev

Deployment (Vercel)
Push this repository to GitHub.

Import the repository into Vercel.

Navigate to Project Settings → Environment Variables and add GEMINI_API_KEY.

Trigger a deployment—Vercel automatically builds the Vite frontend and deploys api/audit.ts as a serverless function.


API Reference
POST /api/audit
Audits an HTML or JSX snippet and returns structured WCAG findings.

Request Body:

JSON
{
  "htmlCode": "<img src=\"hero.jpg\"><div onclick=\"submitForm()\" style=\"color:#aaa;background:#fff\">Submit</div>"
}
Response (200 OK):

JSON
{
  "overallScore": 35,
  "summary": "Critical accessibility violations found: missing image alternative text, non-semantic interactive element, and insufficient text contrast.",
  "issues": [
    {
      "id": "issue-1",
      "type": "missing-alt",
      "severity": "critical",
      "element": "<img src=\"hero.jpg\">",
      "issue": "Image element is missing an alt attribute, preventing screen readers from conveying its purpose.",
      "recommendation": "Add a descriptive alt attribute or alt=\"\" if the image is purely decorative.",
      "codePatch": "<img src=\"hero.jpg\" alt=\"Descriptive summary of the hero image\" />"
    }
  ]
}

---

<ElicitationsGroup message="What would you like to add or polish next?">
  <Elicitation label="Add an accessible Copy Patch button to each issue card" query="How do I add an accessible Copy Patch button to AuditCard.tsx so users can copy the fixed HTML snippet?"/>
  <Elicitation label="Write Vitest and React Testing Library unit tests for the UI" query="Write unit tests using Vitest and React Testing Library to test CodeInputPane, AuditResultsPane, and the audit flow."/>
  <Elicitation label="Give me git commands to commit and push README.md to GitHub" query="Give me the git commands to commit and push my new README.md to GitHub."/>
</ElicitationsGroup>

