import React, { useState } from "react";
import {
  X,
  Calculator,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Droplets,
  Pill,
  Clock,
  CheckCircle2,
  Lock,
  RotateCcw,
  Sparkles
} from "lucide-react";
import {
  PatientRecord,
  DocumentedIntervention,
  ClinicianReassessment,
  WorkflowState
} from "../types/clinical";
import { calculateFluidBolus, calculateAntimicrobialDose } from "../rules/pediatricEngine";

interface InterventionsModalProps {
  patient: PatientRecord;
  onClose: () => void;
  onDocumentIntervention: (intervention: DocumentedIntervention) => void;
  onDocumentReassessment: (reassessment: ClinicianReassessment) => void;
  onVerifyWeight: (weightKg: number) => void;
}

export const InterventionsModal: React.FC<InterventionsModalProps> = ({
  patient,
  onClose,
  onDocumentIntervention,
  onDocumentReassessment,
  onVerifyWeight
}) => {
  const [activeTab, setActiveTab] = useState<"fluids" | "antimicrobials" | "cultures" | "reassessment">("fluids");

  // Fluids state
  const [fluidType, setFluidType] = useState<"plasmalyte" | "saline">("plasmalyte");
  const [fluidAliquot, setFluidAliquot] = useState<10 | 20>(20);
  const [fluidAdminName, setFluidAdminName] = useState("RN J. Carter");

  // Antibiotics state
  const [selectedDrug, setSelectedDrug] = useState<"ceftriaxone" | "vancomycin">("ceftriaxone");
  const [abxAdminName, setAbxAdminName] = useState("RN J. Carter");

  // Reassessment state
  const [clinicianName, setClinicianName] = useState("Dr. A. Vance");
  const [clinicianRole, setClinicianRole] = useState("Pediatric Emergency Attending");
  const [postResponse, setPostResponse] = useState<"improved" | "unchanged" | "deteriorated">("unchanged");
  const [reassessmentFindings, setReassessmentFindings] = useState("");
  const [confirmedState, setConfirmedState] = useState<WorkflowState>(patient.currentWorkflowState);
  const [escalationDecision, setEscalationDecision] = useState<"continue_protocol" | "picu_consult" | "senior_fellow_review">("continue_protocol");

  // Weight override helper
  const [tempWeightInput, setTempWeightInput] = useState<string>(patient.weightKg ? String(patient.weightKg) : "14.0");

  const fluidCalc = calculateFluidBolus(patient, fluidAliquot);
  const drugCalc = calculateAntimicrobialDose(patient, selectedDrug);

  const handleApplyFluid = () => {
    if (!fluidCalc.allowed || !fluidCalc.calculatedValue) return;

    const newIntervention: DocumentedIntervention = {
      id: `fluid-${Date.now()}`,
      category: "fluid_bolus",
      name: `${fluidType === "plasmalyte" ? "Balanced Crystalloid (Plasma-Lyte)" : "0.9% Normal Saline"} ${fluidAliquot} mL/kg`,
      dose: fluidCalc.calculatedValue,
      doseUnit: "mL",
      calculatedDosePerKg: fluidAliquot,
      formulaUsed: fluidCalc.formula,
      maxDoseLimit: fluidCalc.appliedCap,
      route: "IV / Rapid Infuser",
      timestamp: new Date().toISOString(),
      administeredBy: fluidAdminName,
      verifiedWeightUsedKg: patient.weightKg ?? undefined,
      status: "administered",
      clinicalNotes: `Administered over 15 minutes. Protocol: ${fluidCalc.protocolSource}`
    };

    onDocumentIntervention(newIntervention);
  };

  const handleApplyAntibiotic = () => {
    if (!drugCalc.allowed || !drugCalc.calculatedValue) return;

    const newIntervention: DocumentedIntervention = {
      id: `abx-${Date.now()}`,
      category: "antimicrobial",
      name: `${selectedDrug === "ceftriaxone" ? "Ceftriaxone" : "Vancomycin"} ${drugCalc.calculatedValue} mg IV`,
      dose: drugCalc.calculatedValue,
      doseUnit: "mg",
      calculatedDosePerKg: selectedDrug === "ceftriaxone" ? 50 : 15,
      formulaUsed: drugCalc.formula,
      maxDoseLimit: drugCalc.appliedCap,
      route: "IV Infusion",
      timestamp: new Date().toISOString(),
      administeredBy: abxAdminName,
      verifiedWeightUsedKg: patient.weightKg ?? undefined,
      status: "administered",
      clinicalNotes: `Empiric sepsis regimen. Protocol: ${drugCalc.protocolSource}`
    };

    onDocumentIntervention(newIntervention);
  };

  const handleRecordBloodCultures = () => {
    const newIntervention: DocumentedIntervention = {
      id: `bc-${Date.now()}`,
      category: "blood_culture",
      name: "Aerobic & Anaerobic Blood Cultures (Peripheral & Line)",
      timestamp: new Date().toISOString(),
      administeredBy: fluidAdminName,
      status: "administered",
      clinicalNotes: "Two sets obtained sterilely prior to antimicrobial infusion."
    };
    onDocumentIntervention(newIntervention);
  };

  const handleSaveReassessment = () => {
    const newReassessment: ClinicianReassessment = {
      id: `reassess-${Date.now()}`,
      timestamp: new Date().toISOString(),
      clinicianName,
      clinicianRole,
      postInterventionResponse: postResponse,
      findings: reassessmentFindings || "Post-intervention bedside clinical evaluation documented.",
      confirmedWorkflowState: confirmedState,
      escalationDecision: escalationDecision
    };
    onDocumentReassessment(newReassessment);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-teal-700" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Protocolized Intervention & Safety Engine</h3>
              <p className="text-xs text-slate-500">
                Weight-verified calculations, bundle administration, and post-intervention reassessment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Weight Safety Notice Banner */}
        <div className={`px-5 py-2.5 text-xs flex items-center justify-between border-b ${
          patient.weightVerified
            ? "bg-emerald-50 text-emerald-900 border-emerald-200"
            : "bg-red-50 text-red-950 border-red-200 font-medium"
        }`}>
          <div className="flex items-center space-x-2">
            {patient.weightVerified ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>
              Weight: <strong>{patient.weightKg ?? "?"} kg</strong> —{" "}
              {patient.weightVerified ? "Bedside Scale Verified (Calculations Authorized)" : "UNVERIFIED: Safety lock active. Dosing calculations blocked."}
            </span>
          </div>
          {!patient.weightVerified && (
            <button
              onClick={() => {
                const val = parseFloat(tempWeightInput);
                if (!isNaN(val) && val > 0) onVerifyWeight(val);
              }}
              className="px-2.5 py-1 bg-red-700 hover:bg-red-800 text-white font-bold rounded text-[11px] shadow-2xs shrink-0 cursor-pointer"
            >
              Verify Now (14.0 kg)
            </button>
          )}
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-white px-5 pt-2 text-xs font-semibold gap-2">
          <button
            onClick={() => setActiveTab("fluids")}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "fluids" ? "border-teal-700 text-teal-800" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Fluid Resuscitation (mL/kg)
          </button>
          <button
            onClick={() => setActiveTab("antimicrobials")}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "antimicrobials" ? "border-teal-700 text-teal-800" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Empiric Antimicrobial (mg/kg)
          </button>
          <button
            onClick={() => setActiveTab("cultures")}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "cultures" ? "border-teal-700 text-teal-800" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Diagnostics / Cultures
          </button>
          <button
            onClick={() => setActiveTab("reassessment")}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "reassessment" ? "border-teal-700 text-teal-800" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Clinician Reassessment
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* TAB 1: FLUID RESUSCITATION */}
          {activeTab === "fluids" && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Protocol: Surviving Sepsis Campaign 2026 / Hospital Sepsis Protocol
                </span>
                <p className="text-slate-600">
                  Administer 10–20 mL/kg balanced crystalloids over 10–20 minutes with frequent bedside reassessment of lung fields, work of breathing, and liver margins.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Aliquot Volume (mL/kg):</label>
                    <select
                      value={fluidAliquot}
                      onChange={e => setFluidAliquot(Number(e.target.value) as 10 | 20)}
                      className="w-full bg-white p-2 rounded border border-slate-300 font-medium"
                    >
                      <option value={10}>10 mL/kg (Cautious / Cardiorespiratory Risk)</option>
                      <option value={20}>20 mL/kg (Standard Initial Septic Shock Bolus)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Crystalloid Solution:</label>
                    <select
                      value={fluidType}
                      onChange={e => setFluidType(e.target.value as any)}
                      className="w-full bg-white p-2 rounded border border-slate-300 font-medium"
                    >
                      <option value="plasmalyte">Balanced Crystalloid (Plasma-Lyte A)</option>
                      <option value="saline">0.9% Normal Saline</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Calculation Output Box */}
              <div className={`p-4 rounded-xl border ${fluidCalc.allowed ? "bg-teal-50/70 border-teal-200" : "bg-red-50 border-red-200"}`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="font-bold text-slate-800 text-xs">Deterministic Calculation Output:</span>
                  {fluidCalc.allowed ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Verified & Authorized
                    </span>
                  ) : (
                    <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Blocked by Safety Engine
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold font-mono text-slate-900">
                      {fluidCalc.calculatedValue !== null ? `${fluidCalc.calculatedValue} mL` : "Calculation Blocked"}
                    </span>
                    {fluidCalc.allowed && (
                      <span className="text-slate-600 font-medium">({fluidAliquot} mL/kg × {patient.weightKg} kg)</span>
                    )}
                  </div>
                  <p className="font-mono text-[11px] text-slate-600">{fluidCalc.formula}</p>
                  {!fluidCalc.allowed && (
                    <p className="text-xs font-bold text-red-800 pt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      {fluidCalc.blockReason}
                    </p>
                  )}
                  {fluidCalc.appliedCap && (
                    <p className="text-[11px] text-amber-800 font-semibold">
                      Safety Alert: Aliquot capped at adult standard maximum of {fluidCalc.appliedCap} mL.
                    </p>
                  )}
                </div>

                {fluidCalc.allowed && (
                  <div className="mt-4 pt-3 border-t border-teal-200/60 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <label className="text-slate-600">Administered By:</label>
                      <input
                        type="text"
                        value={fluidAdminName}
                        onChange={e => setFluidAdminName(e.target.value)}
                        className="bg-white px-2 py-1 border rounded text-xs w-36"
                      />
                    </div>
                    <button
                      onClick={() => {
                        handleApplyFluid();
                        onClose();
                      }}
                      className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded shadow-xs transition-colors cursor-pointer"
                    >
                      Confirm & Document Bolus
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ANTIMICROBIALS */}
          {activeTab === "antimicrobials" && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Protocol: Pediatric Antimicrobial Formulary 2026 (1-Hour Sepsis Target)
                </span>
                <p className="text-slate-600">
                  Administer intravenous empiric antimicrobials within 1 hour of recognition of septic shock. Ensure blood cultures drawn prior to initiation.
                </p>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Select Empiric Antibiotic Agent:</label>
                  <select
                    value={selectedDrug}
                    onChange={e => setSelectedDrug(e.target.value as any)}
                    className="w-full bg-white p-2 rounded border border-slate-300 font-medium"
                  >
                    <option value="ceftriaxone">Ceftriaxone (50 mg/kg IV once daily, max 2000 mg) - Severe Sepsis / CAP</option>
                    <option value="vancomycin">Vancomycin (15 mg/kg IV q6h, max 1000 mg) - MRSA / Refractory Shock</option>
                  </select>
                </div>
              </div>

              {/* Calculation Output Box */}
              <div className={`p-4 rounded-xl border ${drugCalc.allowed ? "bg-teal-50/70 border-teal-200" : "bg-red-50 border-red-200"}`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="font-bold text-slate-800 text-xs">Deterministic Dosing Calculation:</span>
                  {drugCalc.allowed ? (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Authorized Dose
                    </span>
                  ) : (
                    <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Blocked by Safety Engine
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold font-mono text-slate-900">
                      {drugCalc.calculatedValue !== null ? `${drugCalc.calculatedValue} mg` : "Dosing Blocked"}
                    </span>
                    {drugCalc.allowed && (
                      <span className="text-slate-600 font-medium font-mono">({drugCalc.formula})</span>
                    )}
                  </div>
                  {!drugCalc.allowed && (
                    <p className="text-xs font-bold text-red-800 pt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      {drugCalc.blockReason}
                    </p>
                  )}
                  {drugCalc.notes && (
                    <p className="text-[11px] text-slate-600 italic">{drugCalc.notes}</p>
                  )}
                </div>

                {drugCalc.allowed && (
                  <div className="mt-4 pt-3 border-t border-teal-200/60 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <label className="text-slate-600">Administered By:</label>
                      <input
                        type="text"
                        value={abxAdminName}
                        onChange={e => setAbxAdminName(e.target.value)}
                        className="bg-white px-2 py-1 border rounded text-xs w-36"
                      />
                    </div>
                    <button
                      onClick={() => {
                        handleApplyAntibiotic();
                        onClose();
                      }}
                      className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded shadow-xs transition-colors cursor-pointer"
                    >
                      Confirm & Document Dose
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DIAGNOSTICS & CULTURES */}
          {activeTab === "cultures" && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Diagnostic Microbiology Adherence
                </span>
                <p className="text-slate-600">
                  SSC 2026 & WHO emphasize drawing blood cultures prior to antibiotic infusion whenever possible without delaying antimicrobial therapy beyond 45–60 minutes.
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">Blood Cultures Status:</span>
                    <span className="ml-2 font-mono text-slate-700">
                      {patient.interventions.some(i => i.category === "blood_culture")
                        ? "Documented (Drawn)"
                        : "Pending / Not Recorded"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleRecordBloodCultures();
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded cursor-pointer"
                  >
                    Document Cultures Drawn
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLINICIAN REASSESSMENT */}
          {activeTab === "reassessment" && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Post-Intervention Clinical Evaluation & Reassessment
                </span>
                <p className="text-slate-600">
                  Mandatory bedside reassessment of heart rate, capillary refill, mental status, and respiratory comfort following fluid boluses or medical interventions.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Clinician Name & Role:</label>
                    <input
                      type="text"
                      value={clinicianName}
                      onChange={e => setClinicianName(e.target.value)}
                      className="w-full bg-white p-2 rounded border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Post-Intervention Response:</label>
                    <select
                      value={postResponse}
                      onChange={e => setPostResponse(e.target.value as any)}
                      className="w-full bg-white p-2 rounded border border-slate-300 font-medium"
                    >
                      <option value="improved">Improved (Perfusion restored, CRT &lt;2s, HR normalizing)</option>
                      <option value="unchanged">Unchanged (Persistent abnormal perfusion)</option>
                      <option value="deteriorated">Deteriorated (Worsening work of breathing, hypotension, crackles)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Clinician-Confirmed Workflow State:</label>
                  <select
                    value={confirmedState}
                    onChange={e => setConfirmedState(e.target.value as any)}
                    className="w-full bg-white p-2 rounded border border-slate-300 font-medium"
                  >
                    <option value="possible_shock_deterioration">Possible Shock / Acute Deterioration</option>
                    <option value="possible_sepsis_organ_dysfunction">Possible Sepsis / Organ Dysfunction</option>
                    <option value="responding_to_interventions">Responding to Documented Interventions</option>
                    <option value="persistent_abnormalities_escalation_required">Persistent Abnormalities / Escalation Required</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Escalation Decision:</label>
                  <select
                    value={escalationDecision}
                    onChange={e => setEscalationDecision(e.target.value as any)}
                    className="w-full bg-white p-2 rounded border border-slate-300 font-medium"
                  >
                    <option value="continue_protocol">Continue Standard Emergency Resuscitation Protocol</option>
                    <option value="senior_fellow_review">Senior Pediatric Attending Bedside Review</option>
                    <option value="picu_consult">PICU Critical Care Team Consult (High Priority)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Bedside Physical Findings & Assessment Note:</label>
                  <textarea
                    rows={3}
                    placeholder="Document lung fields (crackles/wheezes), hepatomegaly, heart rate response, mental status..."
                    value={reassessmentFindings}
                    onChange={e => setReassessmentFindings(e.target.value)}
                    className="w-full bg-white p-2 rounded border border-slate-300 text-xs"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      handleSaveReassessment();
                      onClose();
                    }}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded shadow-xs transition-colors cursor-pointer"
                  >
                    Save Clinician Reassessment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
