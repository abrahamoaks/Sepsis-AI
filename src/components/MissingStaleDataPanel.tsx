import React from "react";
import {
  AlertTriangle,
  Clock,
  ShieldAlert,
  Edit3,
  FileQuestion,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from "lucide-react";
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
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileQuestion className="w-4 h-4 text-amber-600" /> Data Quality, Missing & Stale Observations
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Active chart audit. Missing observations are flagged for clinical entry and never assumed to be normal.
          </p>
        </div>
        <button
          onClick={onOpenDataEntry}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Enter Missing Observations</span>
        </button>
      </div>

      {!hasIssues ? (
        <div className="mt-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Core Pediatric Sepsis Dataset Complete</p>
            <p className="text-emerald-700 mt-0.5">All essential vital signs, laboratory indices, and weight verification flags are actively documented.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Column 1: Missing Observations */}
          <div className="border border-amber-200 bg-amber-50/50 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                Missing Observations ({missingObservations.length})
              </span>
              <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                Gaps Identified
              </span>
            </div>
            <p className="text-[11px] text-amber-800">
              The following data points are needed to complete risk evaluation or protocol calculations:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-800">
              {missingObservations.map((item, idx) => (
                <li key={idx} className="flex items-start justify-between bg-white/80 p-2 rounded border border-amber-200/60">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span className="font-medium">{item}</span>
                  </div>
                  {item.toLowerCase().includes("weight") ? (
                    <button
                      onClick={onVerifyWeight}
                      className="text-[11px] text-teal-800 font-bold hover:underline cursor-pointer"
                    >
                      Verify Weight
                    </button>
                  ) : (
                    <button
                      onClick={onOpenDataEntry}
                      className="text-[11px] text-slate-700 font-medium hover:underline cursor-pointer"
                    >
                      Enter Value
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Stale & Unverified Data */}
          <div className="border border-slate-200 bg-slate-50 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-600" />
                Stale & Unverified Items ({staleObservations.length + (!patient.weightVerified ? 1 : 0)})
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                Action Required
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Stale or unverified measurements must not be relied upon without clinician re-evaluation:
            </p>
            <div className="space-y-2 text-xs">
              {!patient.weightVerified && (
                <div className="bg-white p-2 rounded border border-red-200 flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-red-800 block">Weight Unverified (Safety Lock Active)</span>
                    <span className="text-[11px] text-slate-600">
                      Entered weight of {patient.weightKg ?? "?"} kg has not been confirmed on bedside scale. Fluid & antimicrobial dosing calculations are blocked.
                    </span>
                  </div>
                  <button
                    onClick={onVerifyWeight}
                    className="px-2 py-1 bg-red-600 text-white text-[11px] font-bold rounded shrink-0 cursor-pointer"
                  >
                    Verify
                  </button>
                </div>
              )}

              {staleObservations.map((item, idx) => (
                <div key={idx} className="bg-white p-2 rounded border border-slate-200 flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="font-medium text-slate-800">{item}</span>
                  </div>
                  <button
                    onClick={onOpenDataEntry}
                    className="text-[11px] text-teal-800 font-semibold hover:underline shrink-0 cursor-pointer"
                  >
                    Repeat Cuff
                  </button>
                </div>
              ))}

              {staleObservations.length === 0 && patient.weightVerified && (
                <p className="text-xs text-slate-500 italic p-2">No stale physiological observations detected.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
