import React from "react";
import { Code2, Play, Sparkles } from "lucide-react";

interface CodeInputPaneProps {
  code: string;
  onChange: (value: string) => void;
  onAudit: () => void;
  isLoading: boolean;
}

const SAMPLE_HTML = `<div class="card" style="background: #f0f0f0; color: #b5b5b5;">
  <img src="banner.jpg" />
  <div onclick="submitForm()" class="btn">Submit</div>
  <input type="text" placeholder="Enter email" />
</div>`;

export const CodeInputPane: React.FC<CodeInputPaneProps> = ({
  code,
  onChange,
  onAudit,
  isLoading,
}) => {
  const handleLoadSample = () => {
    onChange(SAMPLE_HTML);
  };

  return (
    <section
      aria-labelledby="input-heading"
      className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-600" aria-hidden="true" />
          <h2 id="input-heading" className="font-semibold text-slate-800">
            UI Code Snippet
          </h2>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-md transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          Load Sample
        </button>
      </div>

      <div className="flex-1 flex flex-col p-4">
        <label htmlFor="html-code-input" className="sr-only">
          Paste HTML or JSX code to audit for accessibility
        </label>
        <textarea
          id="html-code-input"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your HTML or JSX snippet here..."
          spellCheck={false}
          className="flex-1 w-full min-h-[320px] p-3 font-mono text-sm text-slate-800 bg-slate-900/5 border border-slate-300 rounded-lg resize-none focus:bg-white transition-colors"
        />

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {code.trim().length} characters
          </span>

          <button
            type="button"
            onClick={onAudit}
            disabled={isLoading || !code.trim()}
            aria-busy={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <Play className="w-4 h-4 fill-current" aria-hidden="true" />
            {isLoading ? "Auditing Code..." : "Run WCAG Audit"}
          </button>
        </div>
      </div>
    </section>
  );
};