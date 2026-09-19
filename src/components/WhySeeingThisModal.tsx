import React from "react";
import {
  X,
  HelpCircle,
  BookOpen,
  AlertTriangle,
  Clock,
  Database,
  FileText,
  Info
} from "lucide-react";
import { WhySeeingThisExplanation } from "../types/clinical";

interface WhySeeingThisModalProps {
  title: string;
  explanation: WhySeeingThisExplanation | null;
  onClose: () => void;
}

export const WhySeeingThisModal: React.FC<WhySeeingThisModalProps> = ({
  title,
  explanation,
  onClose
}) => {
  if (!explanation) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-teal-700" />
            <div>
              <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider font-mono">
                Transparency & Evidence Breakdown
              </span>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* 1. Documented Findings, Timestamps & Sources */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-teal-700" />
              1. Documented Bedside Observations & Data Sources
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs bg-white rounded-lg border border-slate-200">
                <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase font-semibold">
                  <tr>
                    <th className="py-2 px-3">Parameter</th>
                    <th className="py-2 px-3">Recorded Value</th>
                    <th className="py-2 px-3">Timestamp</th>
                    <th className="py-2 px-3">Source Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {explanation.documentedFindings.map((finding, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-semibold text-slate-900">{finding.parameter}</td>
                      <td className="py-2 px-3 font-mono font-bold text-red-700">{finding.value}</td>
                      <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">
                        {new Date(finding.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="py-2 px-3">
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {finding.source.replace(/_/g, " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Deterministic Rule Condition Triggered */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              2. Deterministic Safety Rule / Workflow Condition Triggered
            </span>
            <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
              {explanation.ruleConditionTriggered}
            </div>
          </div>

          {/* 3. Supporting Guideline or Protocol */}
          <div className="bg-teal-50/60 rounded-xl p-4 border border-teal-200 space-y-2">
            <span className="font-bold text-teal-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-teal-700" />
              3. Supporting Clinical Guideline / Protocol Excerpt
            </span>
            <div className="bg-white p-3.5 rounded-lg border border-teal-200/80 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                <strong className="text-slate-900">{explanation.supportingGuidelineOrProtocol.sourceTitle}</strong>
                <span className="text-teal-800 font-mono font-semibold">
                  {explanation.supportingGuidelineOrProtocol.version} • {explanation.supportingGuidelineOrProtocol.section}
                </span>
              </div>
              <p className="text-xs text-slate-700 font-serif italic bg-slate-50 p-2.5 rounded border border-slate-100">
                "{explanation.supportingGuidelineOrProtocol.excerpt}"
              </p>
              <span className="text-[10px] text-slate-400 font-mono block">
                Issuing Organization: {explanation.supportingGuidelineOrProtocol.issuingOrg}
              </span>
            </div>
          </div>

          {/* 4. Known Limitations & Missing Information */}
          <div className="bg-amber-50/60 rounded-xl p-4 border border-amber-200 space-y-2">
            <span className="font-bold text-amber-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              4. Known Limitations & Information Gaps
            </span>
            {explanation.knownLimitationsAndMissingData.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 bg-white p-3 rounded-lg border border-amber-200/80">
                {explanation.knownLimitationsAndMissingData.map((lim, idx) => (
                  <li key={idx} className="font-medium text-amber-900">{lim}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-amber-200/80">
                No acute information gaps identified for this specific rule calculation.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Full clinical decision authority resides strictly with treating clinician.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded cursor-pointer transition-colors"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
