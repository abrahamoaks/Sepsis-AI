import React from "react";
import { Users, Bed, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { ValidationScenario } from "../types/clinical";

interface PatientCensusStripProps {
  scenarios: ValidationScenario[];
  selectedScenarioId: string;
  onSelectScenario: (scenario: ValidationScenario) => void;
  onOpenCensusModal: () => void;
}

export const PatientCensusStrip: React.FC<PatientCensusStripProps> = ({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  onOpenCensusModal
}) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 px-3 sm:px-6 py-2.5 shadow-inner">
      <div className="max-w-7xl mx-auto">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-teal-400" />
              Pediatric ED / PICU Active Census ({scenarios.length} Patients)
            </span>
          </div>
          <button
            onClick={onOpenCensusModal}
            className="text-[11px] font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Unit Board</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Scrollable Patient Cards */}
        <div className="flex gap-2.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
          {scenarios.map((sc) => {
            const isSelected = sc.id === selectedScenarioId;
            const p = sc.patientData || sc.patient;
            if (!p) return null;

            const isCritical =
              sc.acuityLevel === "critical" ||
              p.currentWorkflowState === "possible_shock_deterioration" ||
              (p.vitals?.heartRate?.value ?? 0) > 160;

            const hrVal = p.vitals?.heartRate?.value;
            const crtVal = p.vitals?.capillaryRefill?.value;
            const lacVal = p.labs?.lactate?.value;

            return (
              <motion.button
                key={sc.id}
                onClick={() => onSelectScenario(sc)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`text-left shrink-0 rounded-xl px-3 py-2 transition-all cursor-pointer border min-w-[210px] sm:min-w-[240px] ${
                  isSelected
                    ? "bg-teal-950/90 border-teal-500 shadow-sm ring-1 ring-teal-500"
                    : "bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-bold text-white truncate">
                      {p.name || sc.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700/80 text-slate-300 font-medium">
                      {p.ageYears}y
                    </span>
                  </div>
                  {isCritical ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-rose-300 bg-rose-950/90 border border-rose-800/60 px-1.5 py-0.5 rounded-full shrink-0">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      Critical
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-300 bg-emerald-950/80 border border-emerald-800/60 px-1.5 py-0.5 rounded-full shrink-0">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Stable
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 truncate">
                    <Bed className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{p.bedLocation || "Resus Bay"}</span>
                  </span>
                  <span className="font-mono text-[10px] font-semibold text-slate-300">
                    {p.weightKg} kg {p.weightVerified ? "✓" : "⚠"}
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span>
                    HR:{" "}
                    <strong className={hrVal && hrVal > 140 ? "text-rose-400" : "text-slate-200"}>
                      {hrVal ?? "--"}
                    </strong>
                  </span>
                  <span>
                    CRT:{" "}
                    <strong className={crtVal && crtVal > 2 ? "text-rose-400" : "text-slate-200"}>
                      {crtVal ? `${crtVal}s` : "--"}
                    </strong>
                  </span>
                  <span>
                    Lac:{" "}
                    <strong className={lacVal && lacVal >= 4 ? "text-rose-400" : "text-slate-200"}>
                      {lacVal ?? "--"}
                    </strong>
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
