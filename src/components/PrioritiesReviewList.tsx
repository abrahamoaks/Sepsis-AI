import React from "react";
import {
  ListOrdered,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  RotateCcw
} from "lucide-react";
import { PriorityWorkflowItem } from "../types/clinical";

interface PrioritiesReviewListProps {
  priorities: PriorityWorkflowItem[];
  onCompletePriority: (id: string) => void;
  onOpenWhySeeingThisItem: (item: PriorityWorkflowItem) => void;
  onOpenInterventions: () => void;
  onOpenDataEntry: () => void;
}

export const PrioritiesReviewList: React.FC<PrioritiesReviewListProps> = ({
  priorities,
  onCompletePriority,
  onOpenWhySeeingThisItem,
  onOpenInterventions,
  onOpenDataEntry
}) => {
  const urgencyBadge = (urgency: PriorityWorkflowItem["urgency"]) => {
    switch (urgency) {
      case "critical":
        return <span className="text-[10px] uppercase font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded border border-red-300">Critical Priority</span>;
      case "high":
        return <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">High Priority</span>;
      default:
        return <span className="text-[10px] uppercase font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">Standard Bundle</span>;
    }
  };

  const pendingCount = priorities.filter(p => !p.isCompleted).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-teal-700" /> Priorities for Clinician Review & Time-Zero Tasks
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked clinical management workflow based strictly on configured rules, retrieved guidelines, and documented findings.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {pendingCount} Pending Action{pendingCount === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <div className="divide-y divide-slate-100 mt-3">
        {priorities.map((item, idx) => (
          <div
            key={item.id}
            className={`py-3.5 px-2 rounded-lg transition-colors ${
              item.isCompleted ? "bg-slate-50/70 opacity-75" : "hover:bg-slate-50/50"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              {/* Left Column: Number, Title, Details */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className={`text-sm font-bold ${item.isCompleted ? "line-through text-slate-500" : "text-slate-900"}`}>
                    {item.title}
                  </h4>
                  {urgencyBadge(item.urgency)}
                  {item.requiresClinicianConfirmation && (
                    <span className="text-[10px] bg-teal-50 text-teal-800 font-medium px-1.5 py-0.5 rounded border border-teal-200">
                      Requires Clinician Review
                    </span>
                  )}
                </div>

                {/* Why it is displayed */}
                <div className="text-xs text-slate-700 pl-7 space-y-1">
                  <p>
                    <strong className="text-slate-900">Why displayed:</strong> {item.whyDisplayed}
                  </p>
                  <p className="text-slate-600">
                    <strong className="text-slate-800">Supporting data:</strong> {item.supportingData}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    <strong>Rule / Guideline:</strong> {item.applicableRuleOrSource}
                  </p>
                </div>
              </div>

              {/* Right Column: Actions & Confirmation */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pl-7 sm:pl-0">
                <button
                  onClick={() => onOpenWhySeeingThisItem(item)}
                  className="text-xs text-teal-800 hover:text-teal-950 font-semibold flex items-center gap-1 underline underline-offset-2 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Why am I seeing this?</span>
                </button>

                {item.isCompleted ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Completed & Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {item.id.includes("fluid") || item.id.includes("antimicrobial") ? (
                      <button
                        onClick={onOpenInterventions}
                        className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
                      >
                        Open Protocol Calculator
                      </button>
                    ) : item.id.includes("weight") ? (
                      <button
                        onClick={onOpenDataEntry}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
                      >
                        Verify Bedside Weight
                      </button>
                    ) : (
                      <button
                        onClick={() => onCompletePriority(item.id)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
                      >
                        Document Review Done
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
