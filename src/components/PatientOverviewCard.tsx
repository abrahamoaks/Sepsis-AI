import React from "react";
import {
  AlertTriangle,
  Scale,
  ShieldCheck,
  ShieldAlert,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Info
} from "lucide-react";
import { PatientRecord, WorkflowState } from "../types/clinical";

interface PatientOverviewCardProps {
  patient: PatientRecord;
  dataCompletenessPercentage?: number;
  hasCriticalAlert?: boolean;
  onOpenDataEntry: () => void;
  onVerifyWeight: () => void;
  onConfirmWorkflowState?: (state: WorkflowState) => void;
  onChangeWorkflowState?: (state: WorkflowState) => void;
  onOpenWhySeeingThis?: () => void;
}

export const PatientOverviewCard: React.FC<PatientOverviewCardProps> = ({
  patient,
  dataCompletenessPercentage = 85,
  hasCriticalAlert = false,
  onOpenDataEntry,
  onVerifyWeight,
  onConfirmWorkflowState,
  onChangeWorkflowState,
  onOpenWhySeeingThis
}) => {
  const handleStateChange = onChangeWorkflowState || onConfirmWorkflowState;
  const workflowStateConfig: Record<WorkflowState, { label: string; color: string; desc: string }> = {
    at_risk: {
      label: "At Risk",
      color: "bg-blue-50 text-blue-800 border-blue-200",
      desc: "Initial triage risk factors identified"
    },
    suspected_infection: {
      label: "Suspected Infection",
      color: "bg-amber-50 text-amber-900 border-amber-200",
      desc: "Infection focus documented without overt shock"
    },
    possible_sepsis_organ_dysfunction: {
      label: "Possible Sepsis / Organ Dysfunction",
      color: "bg-orange-100 text-orange-900 border-orange-300",
      desc: "Physiological abnormalities or organ dysfunction present"
    },
    possible_shock_deterioration: {
      label: "Possible Shock / Acute Deterioration",
      color: "bg-red-100 text-red-900 border-red-300",
      desc: "Severe hypoperfusion, hypotension, or hyperlactatemia"
    },
    responding_to_interventions: {
      label: "Responding to Documented Interventions",
      color: "bg-emerald-100 text-emerald-900 border-emerald-300",
      desc: "Perfusion and vitals showing documented recovery"
    },
    persistent_abnormalities_escalation_required: {
      label: "Persistent Abnormalities / Escalation Required",
      color: "bg-rose-100 text-rose-950 border-rose-400",
      desc: "Unresponsive to initial fluids/antimicrobials; PICU consult advised"
    }
  };

  const currentState = workflowStateConfig[patient.currentWorkflowState] || workflowStateConfig.at_risk;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Prominent Critical Emergency Alert Banner when severe deterioration is recognized */}
      {hasCriticalAlert && (
        <div className="bg-red-600 text-white px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-pulse-slow">
          <div className="flex items-start sm:items-center space-x-2.5">
            <ShieldAlert className="w-5 h-5 text-white shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="font-bold text-sm tracking-wide">
                CRITICAL ABNORMALITY DETECTED: IMMINENT RISK OF DETERIORATION
              </p>
              <p className="text-xs text-red-100 mt-0.5">
                Immediately evaluate airway, breathing, and perfusion at bedside. Follow institutional emergency escalation pathway.
                <strong> Do not delay urgent clinical interventions while waiting for AI decision-support.</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onOpenWhySeeingThis}
            className="self-start sm:self-center px-3 py-1.5 bg-white text-red-700 hover:bg-red-50 text-xs font-bold rounded shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            Inspect Criteria Basis
          </button>
        </div>
      )}

      {/* Main Patient Data Header Bar */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {/* Column 1: Patient Identity & Age */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200">
                {patient.mrn} (Fictional)
              </span>
              <span className="text-xs text-slate-500">Demographic</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {patient.ageYears} Years Old
              </h2>
              <span className="text-xs text-slate-600 font-medium">
                ({patient.ageGroup.replace(/_/g, " ")})
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Arrival: <span className="font-medium text-slate-800">{new Date(patient.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </p>
          </div>

          {/* Column 2: Weight & Verification Status */}
          <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-100 md:pl-4 pt-2 md:pt-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-slate-400" /> Patient Weight
              </span>
              <button
                onClick={onVerifyWeight}
                className="text-xs text-teal-800 hover:text-teal-900 font-medium underline underline-offset-2 cursor-pointer"
              >
                {patient.weightVerified ? "Update Weight" : "Verify Bedside"}
              </button>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-slate-900 font-mono">
                {patient.weightKg !== null ? `${patient.weightKg} kg` : "Unrecorded"}
              </span>
              {patient.weightVerified ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" /> Scale Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                  <AlertCircle className="w-3 h-3 text-amber-700" /> Unverified (Dosing Locked)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-600">
              {patient.weightVerified
                ? `Verified at ${patient.weightMeasurementTime ? new Date(patient.weightMeasurementTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "bedside"}`
                : "Required before automated weight-based fluids or antibiotics"}
            </p>
          </div>

          {/* Column 3: Suspected Focus & Organ Dysfunction */}
          <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-100 md:pl-4 pt-2 md:pt-0">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5 text-slate-400" /> Suspected Infection Source
            </span>
            <p className="text-sm font-bold text-slate-900 line-clamp-1">
              {patient.suspectedInfectionSource}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span>Organ Dysfunctions:</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                {patient.documentedOrganDysfunction.length} Documented
              </span>
            </div>
          </div>

          {/* Column 4: Workflow State & Data Completeness */}
          <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-100 md:pl-4 pt-2 md:pt-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Clinical Workflow State</span>
              <span className="text-[11px] text-slate-500 font-mono">
                Completeness: {dataCompletenessPercentage}%
              </span>
            </div>

            {/* Workflow State Pill */}
            <div className={`p-2 rounded-lg border text-xs ${currentState.color}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold">{currentState.label}</span>
                {patient.clinicianConfirmedState ? (
                  <span className="text-[10px] bg-white/80 font-bold px-1.5 py-0.5 rounded border border-emerald-300 text-emerald-900">
                    Clinician Confirmed
                  </span>
                ) : (
                  <span className="text-[10px] bg-white/80 font-semibold px-1.5 py-0.5 rounded border border-slate-300 text-slate-800">
                    System Suggested
                  </span>
                )}
              </div>
              <p className="text-[11px] opacity-90 mt-0.5">{currentState.desc}</p>
            </div>

            {/* Data completeness bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
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

      {/* Bottom Action strip for quick edits and confirmation */}
      <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-600">
          <Info className="w-3.5 h-3.5 text-teal-700" />
          <span>
            State transitions are <strong>deterministic workflow states</strong>, not autonomous medical diagnoses.
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenDataEntry}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 font-medium rounded border border-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3 h-3 text-slate-600" />
            <span>Edit Observations</span>
          </button>
          {!patient.clinicianConfirmedState && handleStateChange && (
            <button
              onClick={() => handleStateChange(patient.currentWorkflowState)}
              className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Confirm Workflow State</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
