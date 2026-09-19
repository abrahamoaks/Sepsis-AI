import React from "react";
import {
  Scale,
  ShieldCheck,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Info,
  User,
  Bed,
  Calendar,
  Syringe,
  Activity
} from "lucide-react";
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
  onChangeWorkflowState,
  onOpenWhySeeingThis
}) => {
  const handleStateChange = onChangeWorkflowState || onConfirmWorkflowState;

  const workflowStateConfig: Record<WorkflowState, { label: string; color: string; desc: string }> = {
    at_risk: {
      label: "At Risk",
      color: "bg-sky-50 text-sky-900 border-sky-200",
      desc: "Initial triage risk factors identified"
    },
    suspected_infection: {
      label: "Suspected Infection",
      color: "bg-amber-50 text-amber-900 border-amber-200",
      desc: "Documented infection focus without overt shock"
    },
    possible_sepsis_organ_dysfunction: {
      label: "Possible Sepsis / Organ Dysfunction",
      color: "bg-orange-50 text-orange-950 border-orange-300",
      desc: "Physiological abnormalities or organ dysfunction present"
    },
    possible_shock_deterioration: {
      label: "Possible Shock / Acute Deterioration",
      color: "bg-rose-50 text-rose-950 border-rose-300",
      desc: "Severe hypoperfusion, hypotension, or hyperlactatemia"
    },
    responding_to_interventions: {
      label: "Responding to Documented Interventions",
      color: "bg-emerald-50 text-emerald-950 border-emerald-300",
      desc: "Perfusion and vitals showing documented recovery"
    },
    persistent_abnormalities_escalation_required: {
      label: "Persistent Abnormalities / Escalation Required",
      color: "bg-red-50 text-red-950 border-red-400",
      desc: "Unresponsive to initial fluids/antimicrobials; PICU consult advised"
    }
  };

  const currentState = workflowStateConfig[patient.currentWorkflowState] || workflowStateConfig.at_risk;

  const displayName = patient.name || "Leo Vance";
  const displaySex = patient.sex ? (patient.sex === "M" ? "Male" : "Female") : "Male";
  const displayDob = patient.dob || "04/12/2023";
  const displayBed = patient.bedLocation || "ED Resus Bay 2";

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* EHR Patient Demographic Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Patient Primary Identifier */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {displayName}
              </h2>
              <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {patient.ageYears}y {patient.ageMonths > 0 ? `${patient.ageMonths}m` : ""} • {displaySex}
              </span>
              <span className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                MRN: {patient.mrn}
              </span>
            </div>

            {/* Sub-demographics */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-1">
                <Bed className="w-3.5 h-3.5 text-teal-700" />
                <span className="font-semibold text-slate-800">{displayBed}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>DOB: <strong className="text-slate-700">{displayDob}</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Attending: <strong className="text-slate-700">Dr. S. Vance, MD</strong></span>
              </div>
              <div>
                <span>Arrived: <strong className="text-slate-700">{new Date(patient.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Header Clinical Actions */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
            <button
              onClick={onOpenDataEntry}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-slate-600" />
              <span>Document Vitals / Labs</span>
            </button>

            {onOpenInterventions && (
              <button
                onClick={onOpenInterventions}
                className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Syringe className="w-3.5 h-3.5 text-teal-100" />
                <span>Record Intervention</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Clinical Status Strip */}
      <div className="p-4 sm:p-5 bg-slate-50/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {/* Column 1: Patient Weight & Safe Dosing Status */}
          <div className="space-y-1 bg-white p-3.5 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-slate-400" /> Bedside Weight
              </span>
              <button
                onClick={onVerifyWeight}
                className="text-xs text-teal-700 hover:text-teal-900 font-semibold underline underline-offset-2 cursor-pointer"
              >
                {patient.weightVerified ? "Update Weight" : "Verify Bedside"}
              </button>
            </div>
            <div className="flex items-baseline space-x-2 pt-0.5">
              <span className="text-xl font-bold text-slate-900 font-mono">
                {patient.weightKg !== null ? `${patient.weightKg} kg` : "Unrecorded"}
              </span>
              {patient.weightVerified ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Scale Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
                  <AlertCircle className="w-3 h-3 text-amber-600" /> Unverified (Dosing Locked)
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 pt-0.5">
              {patient.weightVerified
                ? `Calibrated scale verification confirmed`
                : "Required before automated weight-based fluids or antibiotics"}
            </p>
          </div>

          {/* Column 2: Suspected Infection & Organ Findings */}
          <div className="space-y-1 bg-white p-3.5 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5 text-slate-400" /> Suspected Infection Source
            </span>
            <p className="text-sm font-bold text-slate-900 line-clamp-1 pt-0.5">
              {patient.suspectedInfectionSource}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-1">
              <span>Organ Dysfunctions:</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                {patient.documentedOrganDysfunction.length} Documented
              </span>
            </div>
          </div>

          {/* Column 3: Clinical Pathway State */}
          <div className="space-y-1.5 bg-white p-3.5 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Care Pathway State</span>
              <span className="text-[11px] text-slate-500 font-mono">
                Data Completeness: {dataCompletenessPercentage}%
              </span>
            </div>

            <div className={`p-2 rounded-lg border text-xs ${currentState.color}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold">{currentState.label}</span>
                {patient.clinicianConfirmedState ? (
                  <span className="text-[10px] bg-white font-bold px-1.5 py-0.5 rounded border border-emerald-300 text-emerald-900">
                    Clinician Confirmed
                  </span>
                ) : (
                  <span className="text-[10px] bg-white font-medium px-1.5 py-0.5 rounded border border-slate-200 text-slate-700">
                    Algorithm Suggested
                  </span>
                )}
              </div>
              <p className="text-[11px] opacity-90 mt-0.5">{currentState.desc}</p>
            </div>

            {/* Mini Completeness Bar */}
            <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden mt-1">
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

      {/* Sub-bar: Confirmation and Notice */}
      <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 text-slate-600">
          <Info className="w-3.5 h-3.5 text-teal-700 shrink-0" />
          <span>
            Clinical decision support operates deterministically under treating physician supervision.
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {!patient.clinicianConfirmedState && handleStateChange && (
            <button
              onClick={() => handleStateChange(patient.currentWorkflowState)}
              className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white font-medium rounded flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Confirm Pathway State</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
