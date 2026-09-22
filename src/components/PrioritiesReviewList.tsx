import React, { useState } from "react";
import {
  ListOrdered,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Syringe,
  ShieldCheck
} from "lucide-react";
import { motion } from "motion/react";
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
  onOpenInterventions
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const urgencyBadge = (urgency: PriorityWorkflowItem["urgency"]) => {
    switch (urgency) {
      case "critical":
        return <span className="text-[10px] uppercase font-black bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md border border-rose-200">Stat / Critical</span>;
      case "high":
        return <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">&lt; 60 Min</span>;
      default:
        return <span className="text-[10px] uppercase font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">Bundle Task</span>;
    }
  };

  const pendingCount = priorities.filter(p => !p.isCompleted).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-teal-700" />
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">
            Immediate Action Plan & Resuscitation Bundle
          </h3>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
          {pendingCount} Pending
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-2 mt-3.5">
        {priorities.map((item, idx) => {
          const isExpanded = expandedId === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              className={`rounded-xl border p-3 sm:p-3.5 transition-all ${
                item.isCompleted
                  ? "bg-slate-50/70 border-slate-200 opacity-70"
                  : "bg-white hover:bg-slate-50/50 border-slate-200 shadow-2xs"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Checkbox and Number */}
                <button
                  onClick={() => onCompletePriority(item.id)}
                  className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                    item.isCompleted
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-slate-300 hover:border-teal-600 bg-white text-transparent hover:text-slate-300"
                  }`}
                  title={item.isCompleted ? "Mark Incomplete" : "Mark Completed"}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      #{idx + 1}
                    </span>
                    <h4
                      onClick={() => onCompletePriority(item.id)}
                      className={`text-sm font-bold cursor-pointer select-none ${
                        item.isCompleted ? "line-through text-slate-400" : "text-slate-900"
                      }`}
                    >
                      {item.title}
                    </h4>
                    {urgencyBadge(item.urgency)}
                  </div>

                  {/* Scannable Tag Line */}
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                    <span className="font-medium text-slate-600 truncate">
                      {item.supportingData}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-mono text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                      {item.applicableRuleOrSource.split(" ")[0]}
                    </span>
                  </div>

                  {/* Optional Expandable Clinical Rationale */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1 bg-slate-50/80 p-2.5 rounded-lg"
                    >
                      <p>
                        <strong className="text-slate-800">Clinical Indication:</strong> {item.whyDisplayed}
                      </p>
                      <p className="font-mono text-[11px] text-slate-500">
                        <strong>Guideline Reference:</strong> {item.applicableRuleOrSource}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg text-xs transition-colors cursor-pointer"
                    title="Toggle Guideline Rationale"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => onOpenWhySeeingThisItem(item)}
                    className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg text-xs transition-colors cursor-pointer"
                    title="Full Safety Audit"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
