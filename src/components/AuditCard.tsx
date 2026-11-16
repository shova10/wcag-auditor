import React, { useState } from "react";
import { AlertCircle, AlertTriangle, Check, Copy, Info } from "lucide-react";
import type { AuditIssue } from "../types/audit";

interface AuditCardProps {
  issue: AuditIssue;
}

export const AuditCard: React.FC<AuditCardProps> = ({ issue }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(issue.codePatch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const severityStyles = {
    critical: {
      badge: "bg-red-100 text-red-800 border-red-200",
      icon: <AlertCircle className="w-4 h-4 text-red-600" aria-hidden="true" />,
    },
    warning: {
      badge: "bg-amber-100 text-amber-800 border-amber-200",
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" aria-hidden="true" />,
    },
    info: {
      badge: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <Info className="w-4 h-4 text-blue-600" aria-hidden="true" />,
    },
  }[issue.severity];

  return (
    <article className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wide ${severityStyles.badge}`}
        >
          {severityStyles.icon}
          {issue.severity}
        </span>
        <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
          {issue.type}
        </span>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 text-sm">{issue.issue}</h3>
        <p className="text-xs text-slate-600 mt-1">{issue.recommendation}</p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">
            WCAG-Compliant Patch
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Code patch copied" : "Copy WCAG code patch"}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-indigo-600 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Copy Fix</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-3 rounded-md bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
          <code>{issue.codePatch}</code>
        </pre>
      </div>
    </article>
  );
};