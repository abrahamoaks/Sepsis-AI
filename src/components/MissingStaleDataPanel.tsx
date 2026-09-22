import React from "react";
import {
  Clock,
  Edit3,
  FileQuestion,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { motion } from "motion/react";
import { PatientRecord } from "../types/clinical";

interface MissingStaleDataPanelProps {
  patient: PatientRecord;
  missingObservations: string[];
  staleObservations: string[];
  onOpenDataEntry: () => void;
  onVerifyWeight: () => void;
}

export const MissingStaleDataPanel: React.FC<MissingStaleDataPanelProps> = ({
  patient,
  missingObservations,
  staleObservations,
  onOpenDataEntry,
  onVerifyWeight
}) => {
  const hasIssues = missingObservations.length > 0 || staleObservations.length > 0 || !patient.weightVerified;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <FileQuestion className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">
            Data Quality & Chart Gaps
          </h3>
        </div>
        <button
          onClick={onOpenDataEntry}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Add Data</span>
        </button>
      </div>

      {!hasIssues ? (
        <div className="mt-3.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Dataset Complete</p>
            <p className="text-emerald-700 text-[11px] mt-0.5">Core pediatric sepsis observations and weight verification are actively documented.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3.5">
          {/* Missing Observations */}
          <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                Missing Observations ({missingObservations.length})
              </span>
              <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                Gaps
              </span>
            </div>
            <ul className="space-y-1.5 text-xs">
              {missingObservations.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between bg-white p-2 rounded-lg border border-amber-200/60 shadow-2xs">
                  <span className="font-medium text-slate-800 truncate pr-2">{item}</span>
                  {item.toLowerCase().includes("weight") ? (
                    <button
                      onClick={onVerifyWeight}
                      className="text-[11px] text-teal-800 font-bold hover:underline shrink-0 cursor-pointer"
                    >
                      Verify Weight
                    </button>
                  ) : (
                    <button
                      onClick={onOpenDataEntry}
                      className="text-[11px] text-slate-700 font-bold hover:underline shrink-0 cursor-pointer"
                    >
                      Enter
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Stale or Unverified */}
          <div className="border border-slate-200 bg-slate-50/60 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-600" />
                Stale & Unverified ({staleObservations.length + (!patient.weightVerified ? 1 : 0)})
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.2 rounded">
                Action
              </span>
            </div>
            <div className="space-y-1.5 text-xs">
              {!patient.weightVerified && (
                <div className="bg-white p-2 rounded-lg border border-rose-200 shadow-2xs flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-bold text-rose-800 text-xs block truncate">Weight Unverified</span>
                    <span className="text-[10px] text-slate-500 block truncate">Dosing safety lock enabled</span>
                  </div>
                  <button
                    onClick={onVerifyWeight}
                    className="px-2.5 py-1 bg-rose-600 text-white text-[11px] font-bold rounded-lg shrink-0 cursor-pointer"
                  >
                    Verify
                  </button>
                </div>
              )}

              {staleObservations.map((item, idx) => (
                <div key={idx} className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between gap-2">
                  <span className="font-medium text-slate-800 truncate pr-2">{item}</span>
                  <button
                    onClick={onOpenDataEntry}
                    className="text-[11px] text-teal-800 font-bold hover:underline shrink-0 cursor-pointer"
                  >
                    Update
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
