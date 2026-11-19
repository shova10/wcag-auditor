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
```Get-Content .env.local | ForEach-Object { if ($_ -match '^\s*([^#][^=]+)=(.*)$') {      [Environment]::SetEnvironmentVariable($matches[1].Trim(),$matches[2].Trim(), "Process") } }```
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

## Architecture Overview

```
[React 19 + TypeScript UI]
       │  POST /api/audit { htmlCode }
       ▼
[Vercel Serverless Function (/api/audit.ts)]
       │  System Instruction + Strict JSON Schema + Exponential Backoff
       ▼
[Google Gemini API (gemini-3.8-flash)]
       │  Validated JSON Payload
       ▼
[AuditResultsPane & AuditCard Components]
```

AI Integration & Prompt Engineering
System Prompt
"You are an expert WCAG 2.1 AA/AAA web accessibility auditor and senior frontend engineer. Analyze the provided HTML or JSX snippet for accessibility violations across four categories: missing or non-descriptive alt text (missing-alt), insufficient color contrast (contrast-ratio), missing or improper ARIA attributes/labels (missing-aria), and non-semantic HTML structure (semantic-html). Return ONLY valid JSON matching the requested schema with an overallScore (0–100), a concise summary, and an array of actionable issues containing exact drop-in codePatch fixes."

Why Structured JSON Output Was Chosen Over Raw Text
Raw markdown prose from an LLM varies in formatting, breaks UI parsing, and forces users to manually extract fixes from walls of text. Enforcing responseMimeType: "application/json" with a deterministic schema guarantees that every response maps cleanly to TypeScript interfaces (AuditResponse / AuditIssue), enabling severity color-coding, score badges, automated Vitest contract assertions, and one-click Copy Fix buttons.

Known Limitations
No Database Persistence: Audit history is stored strictly in React component state; refreshing the browser clears current findings.

Static Snippet Scope: Evaluates pasted HTML/JSX markup and inline styles rather than crawling live URLs or computing external CSS cascade rules.

API Rate Limits: Subject to upstream AI provider quota limits and serverless cold-start latency during traffic spikes.


---

### 2. Deployment Checklist (FE-11)

| Category | Verification Item | Status | Notes / Verification Evidence |
| :--- | :--- | :---: | :--- |
| **Environment Variables** | `GEMINI_API_KEY` configured in Vercel Production & Preview settings without exposing secrets in client bundles (`VITE_*` omitted). | `[x]` | Verified via `vercel env` and network tab inspection (key stays server-side in `api/audit.ts`). |
| **Error Boundaries & Fallbacks** | Empty input disabled preventatively; `500` / `429` API failures surface an accessible `role="alert"` banner with exponential backoff retry. | `[x]` | Verified via Vitest Test 2 & Test 3 (`src/__tests__/App.test.tsx`) and live error simulation. |
| **Mobile Responsiveness** | Split-pane grid collapses cleanly from `lg:grid-cols-2` to single-column vertical stack on `< 1024px` viewports without horizontal overflow. | `[x]` | Verified at `375x812` (iPhone) and `768x1024` (iPad) in Chrome DevTools & Lighthouse Mobile. |
| **Accessibility & Audits** | Semantic `<header>`, `<main>`, `<section>` landmarks, skip link, `aria-live="polite"` status region, and `0` axe critical/serious issues. | `[x]` | Lighthouse Accessibility **95+**; axe DevTools scan **0** critical/serious issues. |
| **Rollback Procedure** | Instant zero-downtime rollback path documented and verified. | `[x]` | Open **Vercel Dashboard → Deployments**, select the previous green production build, open the `...` menu, and click **Promote to Production**. |

---

### 3. Project Reflection

Building the **WCAG Alt-Text & Contrast Auditor** reinforced that shipping an AI-powered developer tool requires far more engineering around the model boundary than inside the prompt itself. The hardest technical hurdle was stabilizing the full-stack contract and build pipeline: ensuring the serverless endpoint consistently returned strict JSON under transient `429`/`503` load spikes via exponential backoff, while aligning TypeScript project references (`tsconfig.app.json` vs. `tsconfig.node.json`) and Vitest's `jsdom` + V8 coverage environment so both `tsc -b` and automated integration tests executed cleanly.

If I were building the next iteration, I would add client-side URL fetching or a live iframe preview sandbox so users could audit rendered computed styles rather than static JSX snippets alone, alongside `localStorage` audit history so developers can compare before-and-after scores across iterations. One surprising insight from accessibility testing my own auditor was catching subtle contrast edge cases—such as muted helper text (`text-slate-500` on `bg-slate-50`) sitting right on the `4.5:1` WCAG AA boundary—proving that automated tools like axe DevTools and Lighthouse catch real perceptual gaps even when semantic landmarks and ARIA attributes are thoughtfully engineered from day one.



