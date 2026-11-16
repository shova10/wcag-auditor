import React from "react";
import { CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";
import type { AuditResponse } from "../types/audit";
import { AuditCard } from "./AuditCard";

interface AuditResultsPaneProps {
  result: AuditResponse | null;
  isLoading: boolean;
  error: string | null;
}

export const AuditResultsPane: React.FC<AuditResultsPaneProps> = ({
  result,
  isLoading,
  error,
}) => {
  return (
    <section
      aria-labelledby="results-heading"
      className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-indigo-600" aria-hidden="true" />
          <h2 id="results-heading" className="font-semibold text-slate-800">
            Accessibility Report
          </h2>
        </div>

        {result && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600">Score:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                result.overallScore >= 80
                  ? "bg-emerald-100 text-emerald-800"
                  : result.overallScore >= 50
                  ? "bg-amber-100 text-amber-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {result.overallScore} / 100
            </span>
          </div>
        )}
      </div>

      {/* ARIA Live Region for dynamic screen-reader updates */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50"
      >
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">
              Analyzing semantic structure, contrast, and ARIA attributes...
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div
            role="alert"
            className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm"
          >
            <strong className="font-semibold">Audit Failed: </strong>
            {error}
          </div>
        )}

        {!isLoading && !error && !result && (
          <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500 px-6">
            <Sparkles className="w-8 h-8 text-slate-400 mb-2" aria-hidden="true" />
            <p className="text-sm font-medium text-slate-700">
              Ready to audit your UI code
            </p>
            <p className="text-xs mt-1">
              Paste HTML or JSX on the left—or load the sample snippet—to detect
              missing alt text, low contrast, and ARIA gaps.
            </p>
          </div>
        )}

        {!isLoading && !error && result && (
          <>
            <div className="p-3.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-sm text-slate-800">
              {result.summary}
            </div>

            {result.issues.length === 0 ? (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                No WCAG accessibility issues detected!
              </div>
            ) : (
              <div className="space-y-3">
                {result.issues.map((issue) => (
                  <AuditCard key={issue.id} issue={issue} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};