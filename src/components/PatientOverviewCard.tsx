import React from "react";
import {
  Scale,
  ShieldCheck,
  AlertCircle,
  Stethoscope,
  Bed,
  Calendar,
  Syringe,
  Activity,
  CheckCircle2,
  Clock
} from "lucide-react";
import { motion } from "motion/react";
import { PatientRecord, WorkflowState } from "../types/clinical";

interface PatientOverviewCardProps {
  patient: PatientRecord;
  dataCompletenessPercentage?: number;
  hasCriticalAlert?: boolean;
  onOpenDataEntry: () => void;
  onVerifyWeight: () => void;
  onOpenInterventions?: () => void;
  onConfirmWorkflowState?: (state: WorkflowState) => void;
  onChangeWorkflowState?: (state: WorkflowState) => void;
  onOpenWhySeeingThis?: () => void;
}

export const PatientOverviewCard: React.FC<PatientOverviewCardProps> = ({
  patient,
  dataCompletenessPercentage = 85,
  onOpenDataEntry,
  onVerifyWeight,
  onOpenInterventions,
  onConfirmWorkflowState,
  onChangeWorkflowState
}) => {
  const handleStateChange = onChangeWorkflowState || onConfirmWorkflowState;

  const workflowStateConfig: Record<WorkflowState, { label: string; color: string; badge: string }> = {
    at_risk: {
      label: "At Risk",
      color: "bg-sky-50 text-sky-900 border-sky-200",
      badge: "bg-sky-100 text-sky-800"
    },
    suspected_infection: {
      label: "Suspected Infection",
      color: "bg-amber-50 text-amber-900 border-amber-200",
      badge: "bg-amber-100 text-amber-800"
    },
    possible_sepsis_organ_dysfunction: {
      label: "Possible Sepsis / Organ Dysfunction",
      color: "bg-orange-50 text-orange-950 border-orange-300",
      badge: "bg-orange-100 text-orange-800"
    },
    possible_shock_deterioration: {
      label: "Septic Shock / Acute Deterioration",
      color: "bg-rose-50 text-rose-950 border-rose-300",
      badge: "bg-rose-100 text-rose-800"
    },
    responding_to_interventions: {
      label: "Responding to Interventions",
      color: "bg-emerald-50 text-emerald-950 border-emerald-300",
      badge: "bg-emerald-100 text-emerald-800"
    },
    persistent_abnormalities_escalation_required: {
      label: "Refractory Shock / PICU Required",
      color: "bg-red-50 text-red-950 border-red-400",
      badge: "bg-red-100 text-red-800"
    }
  };

  const currentState = workflowStateConfig[patient.currentWorkflowState] || workflowStateConfig.at_risk;
  const displayName = patient.name || "Obi Eze";
  const displaySex = patient.sex ? (patient.sex === "M" ? "Male" : "Female") : "Male";
  const displayDob = patient.dob || "2023-04-12";
  const displayBed = patient.bedLocation || "ED Resus Bay 2";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
    >
      {/* Top Main Patient Card Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          {/* Patient Details */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {displayName}
              </h2>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                {patient.ageYears}y {patient.ageMonths > 0 ? `${patient.ageMonths}m` : ""} • {displaySex}
              </span>
              <span className="text-xs font-mono font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                MRN {patient.mrn}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 pt-0.5">
              <span className="flex items-center gap-1 font-semibold text-teal-800">
                <Bed className="w-3.5 h-3.5 text-teal-700" />
                {displayBed}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                DOB: {displayDob}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Arrived: {new Date(patient.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={onOpenDataEntry}
              className="flex-1 sm:flex-none min-h-[42px] px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-slate-600" />
              <span>Record Vitals</span>
            </button>

            {onOpenInterventions && (
              <button
                onClick={onOpenInterventions}
                className="flex-1 sm:flex-none min-h-[42px] px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Syringe className="w-3.5 h-3.5 text-teal-100" />
                <span>Interventions</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tri-Grid Metric Strip */}
      <div className="p-3 sm:p-4 bg-slate-50/50">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {/* Tile 1: Bedside Weight Lock */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <Scale className="w-3 h-3 text-slate-400" /> Bedside Weight
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-extrabold text-slate-900 font-mono">
                  {patient.weightKg !== null ? `${patient.weightKg} kg` : "N/A"}
                </span>
                {patient.weightVerified ? (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-2.5 h-2.5" /> Scale Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    <AlertCircle className="w-2.5 h-2.5" /> Unverified
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onVerifyWeight}
              className="text-xs font-bold px-2.5 py-1.5 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer"
            >
              {patient.weightVerified ? "Update" : "Verify"}
            </button>
          </div>

          {/* Tile 2: Clinical Pathway Stage */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Protocol Pathway
              </span>
              <div className="flex items-center gap-1.5 mt-0.5 truncate">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md border truncate ${currentState.color}`}>
                  {currentState.label}
                </span>
              </div>
            </div>
            {handleStateChange && !patient.clinicianConfirmedState && (
              <button
                onClick={() => handleStateChange(patient.currentWorkflowState)}
                className="text-xs font-bold px-2 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                title="Confirm Clinical State"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Confirm</span>
              </button>
            )}
          </div>

          {/* Tile 3: Infection Source & Chart Completeness */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <Stethoscope className="w-3 h-3 text-slate-400" /> Infection Focus
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {dataCompletenessPercentage}% Complete
              </span>
            </div>
            <div className="text-xs font-bold text-slate-800 truncate mt-0.5">
              {patient.suspectedInfectionSource}
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden mt-1.5">
              <div
                className={`h-full transition-all ${
                  dataCompletenessPercentage > 80
                    ? "bg-teal-600"
                    : dataCompletenessPercentage > 50
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${dataCompletenessPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

