/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  History,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Layers,
  FileQuestion,
  RotateCcw,
  CheckCircle2,
  Clock,
  UserCheck
} from "lucide-react";

import {
  PatientRecord,
  HistoricalObservationPoint,
  AuditEvent,
  WorkflowState,
  PriorityWorkflowItem,
  WhySeeingThisExplanation,
  DocumentedIntervention,
  ClinicianReassessment,
  ValidationScenario
} from "./types/clinical";

import {
  INITIAL_SAMPLE_PATIENT,
  SAMPLE_PATIENT_HISTORY,
  VALIDATION_SCENARIOS
} from "./data/samplePatients";

import {
  evaluateClinicalSafetyRules,
  getPediatricVitalThresholds
} from "./rules/pediatricEngine";

import { APPROVED_KNOWLEDGE_DOCUMENTS } from "./knowledge/guidelines";

import { Header } from "./components/Header";
import { PatientOverviewCard } from "./components/PatientOverviewCard";
import { ClinicalStatusCards } from "./components/ClinicalStatusCards";
import { PrioritiesReviewList } from "./components/PrioritiesReviewList";
import { TrendMonitorView } from "./components/TrendMonitorView";
import { MissingStaleDataPanel } from "./components/MissingStaleDataPanel";
import { EvidenceViewer } from "./components/EvidenceViewer";
import { AuditTrailView } from "./components/AuditTrailView";
import { ScenarioSelectorBar } from "./components/ScenarioSelectorBar";
import { DataEntryModal } from "./components/DataEntryModal";
import { InterventionsModal } from "./components/InterventionsModal";
import { GeminiAssistantDrawer } from "./components/GeminiAssistantDrawer";
import { WhySeeingThisModal } from "./components/WhySeeingThisModal";

export default function App() {
  // Application State
  const [patient, setPatient] = useState<PatientRecord>(INITIAL_SAMPLE_PATIENT);
  const [history, setHistory] = useState<HistoricalObservationPoint[]>(SAMPLE_PATIENT_HISTORY);
  const [activeScenarioId, setActiveScenarioId] = useState<string>("default");
  const [knowledgeDocs, setKnowledgeDocs] = useState(APPROVED_KNOWLEDGE_DOCUMENTS);
  const [activeTab, setActiveTab] = useState<"dashboard" | "trends" | "evidence" | "audit">("dashboard");

  // Modals & Panels
  const [isDataEntryOpen, setIsDataEntryOpen] = useState(false);
  const [isInterventionsOpen, setIsInterventionsOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [whyModalData, setWhyModalData] = useState<{
    isOpen: boolean;
    title: string;
    explanation: WhySeeingThisExplanation | null;
  }>({
    isOpen: false,
    title: "",
    explanation: null
  });

  // Completed priorities tracking
  const [completedPriorityIds, setCompletedPriorityIds] = useState<string[]>([]);

  // Audit Events Log (Append-only)
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([
    {
      id: "audit-init",
      timestamp: new Date().toISOString(),
      userRole: "System Clinical Engine",
      userId: "SYS-INIT",
      eventType: "data_entered",
      summary: "Patient record loaded into PediaSepsis AI decision-support environment.",
      verificationState: "unverified"
    }
  ]);

  // Gemini Backend Mode Check
  const [geminiStatus, setGeminiStatus] = useState<{ live: boolean; mode: string }>({
    live: false,
    mode: "Initializing..."
  });

  useEffect(() => {
    fetch("/api/gemini/status")
      .then(res => res.json())
      .then(data => setGeminiStatus(data))
      .catch(() => setGeminiStatus({ live: false, mode: "Deterministic Mock Fallback" }));
  }, []);

  // Run Deterministic Safety & Workflow Rules Engine
  const rulesOutput = useMemo(() => {
    return evaluateClinicalSafetyRules(patient, history);
  }, [patient, history]);

  // Merge dynamic completion state into priorities
  const activePriorities: PriorityWorkflowItem[] = useMemo(() => {
    return rulesOutput.priorities.map(p => ({
      ...p,
      isCompleted: completedPriorityIds.includes(p.id)
    }));
  }, [rulesOutput.priorities, completedPriorityIds]);

  // Helper to log audit events
  const addAuditEvent = (
    eventType: AuditEvent["eventType"],
    summary: string,
    opts: Partial<AuditEvent> = {}
  ) => {
    const newEvent: AuditEvent = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      userRole: opts.userRole || "Pediatric Attending",
      userId: opts.userId || "MD-9402",
      eventType,
      summary,
      verificationState: opts.verificationState || (patient.weightVerified ? "verified" : "unverified"),
      ...opts
    };
    setAuditEvents(prev => [newEvent, ...prev]);
  };

  // Handler: Weight Verification
  const handleVerifyWeight = (weightKg?: number) => {
    const finalWeight = weightKg !== undefined ? weightKg : patient.weightKg;
    const prevWeight = patient.weightKg;

    setPatient(prev => ({
      ...prev,
      weightKg: finalWeight,
      weightVerified: true,
      weightMeasurementTime: new Date().toISOString()
    }));

    addAuditEvent(
      "weight_verified",
      `Weight verified on bedside scale: ${finalWeight} kg. Dosing calculations authorized.`,
      {
        previousValue: `${prevWeight} kg (Unverified)`,
        newValue: `${finalWeight} kg (Bedside Scale Confirmed)`,
        verificationState: "verified"
      }
    );
  };

  // Handler: Workflow State Change
  const handleWorkflowStateChange = (newState: WorkflowState) => {
    const prevState = patient.currentWorkflowState;
    setPatient(prev => ({
      ...prev,
      currentWorkflowState: newState
    }));

    addAuditEvent(
      "data_modified",
      `Clinician updated workflow state from "${prevState.replace(/_/g, " ")}" to "${newState.replace(/_/g, " ")}"`,
      {
        previousValue: prevState,
        newValue: newState
      }
    );
  };

  // Handler: Priority Review Complete
  const handleCompletePriority = (id: string) => {
    if (!completedPriorityIds.includes(id)) {
      setCompletedPriorityIds(prev => [...prev, id]);
      const targetItem = activePriorities.find(p => p.id === id);
      addAuditEvent(
        "priority_completed",
        `Clinician marked priority action complete: "${targetItem?.title || id}"`,
        { verificationState: "verified" }
      );
    }
  };

  // Handler: Save Patient Data (from DataEntryModal)
  const handleSavePatientData = (updatedPatient: PatientRecord, changeSummary: string) => {
    setPatient(updatedPatient);

    // Also add to trend history if vital signs changed
    if (updatedPatient.vitals.heartRate.value !== null) {
      setHistory(prev => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          heartRate: updatedPatient.vitals.heartRate.value ?? undefined,
          respiratoryRate: updatedPatient.vitals.respiratoryRate.value ?? undefined,
          systolicBP: updatedPatient.vitals.systolicBP.value ?? undefined,
          diastolicBP: updatedPatient.vitals.diastolicBP.value ?? undefined,
          capillaryRefill: updatedPatient.vitals.capillaryRefill.value ?? undefined,
          lactate: updatedPatient.labs.lactate.value ?? undefined,
          eventNote: "Clinician Bedside Form Update"
        }
      ]);
    }

    addAuditEvent("data_entered", changeSummary, {
      verificationState: updatedPatient.weightVerified ? "verified" : "unverified"
    });
  };

  // Handler: Document Intervention (from InterventionsModal)
  const handleDocumentIntervention = (intervention: DocumentedIntervention) => {
    setPatient(prev => ({
      ...prev,
      interventions: [...prev.interventions, intervention]
    }));

    addAuditEvent(
      "priority_completed",
      `Intervention administered: ${intervention.name} (${intervention.dose ?? ""} ${intervention.doseUnit ?? ""})`,
      {
        userRole: intervention.administeredBy || "Bedside RN",
        verificationState: "verified"
      }
    );
  };

  // Handler: Document Reassessment (from InterventionsModal)
  const handleDocumentReassessment = (reassessment: ClinicianReassessment) => {
    setPatient(prev => ({
      ...prev,
      reassessments: [...prev.reassessments, reassessment],
      currentWorkflowState: reassessment.confirmedWorkflowState
    }));

    addAuditEvent(
      "priority_completed",
      `Clinician bedside reassessment documented. Response: "${reassessment.postInterventionResponse}". Escalation decision: "${reassessment.escalationDecision}".`,
      {
        userRole: `${reassessment.clinicianName} (${reassessment.clinicianRole})`,
        verificationState: "verified"
      }
    );
  };

  // Handler: Toggle Knowledge Source
  const handleToggleKnowledgeDoc = (id: string) => {
    setKnowledgeDocs(prev =>
      prev.map(doc => (doc.id === id ? { ...doc, isActive: !doc.isActive } : doc))
    );
    const targetDoc = knowledgeDocs.find(d => d.id === id);
    addAuditEvent(
      "data_modified",
      `Knowledge document "${targetDoc?.title}" toggled to ${targetDoc?.isActive ? "INACTIVE" : "ACTIVE"}`
    );
  };

  // Handler: Switch Validation Scenario
  const handleSelectScenario = (scenario: ValidationScenario) => {
    const selectedPatient = scenario.patientData || scenario.patient;
    if (!selectedPatient) return;

    setActiveScenarioId(scenario.id);
    setPatient(selectedPatient);
    setCompletedPriorityIds([]);

    if (scenario.history && scenario.history.length > 0) {
      setHistory(scenario.history);
    } else if (selectedPatient.vitals.heartRate.value !== null) {
      setHistory([
        {
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          heartRate: selectedPatient.vitals.heartRate.value - 15,
          capillaryRefill: Math.max(1, (selectedPatient.vitals.capillaryRefill.value || 2) - 1),
          lactate: (selectedPatient.labs.lactate.value || 1.8) * 0.8,
          systolicBP: (selectedPatient.vitals.systolicBP.value || 90) + 5,
          eventNote: "Triage Baseline"
        },
        {
          timestamp: new Date().toISOString(),
          heartRate: selectedPatient.vitals.heartRate.value ?? undefined,
          capillaryRefill: selectedPatient.vitals.capillaryRefill.value ?? undefined,
          lactate: selectedPatient.labs.lactate.value ?? undefined,
          systolicBP: selectedPatient.vitals.systolicBP.value ?? undefined,
          eventNote: "Active Test Scenario Snapshot"
        }
      ]);
    } else {
      setHistory([]);
    }

    addAuditEvent(
      "data_modified",
      `Loaded validation scenario ${scenario.id}: "${scenario.title || scenario.name}". Expected: ${scenario.expectedBehavior || scenario.keySafetyCheck}`
    );
  };

  const handleResetToDefault = () => {
    setActiveScenarioId("default");
    setPatient(INITIAL_SAMPLE_PATIENT);
    setHistory(SAMPLE_PATIENT_HISTORY);
    setCompletedPriorityIds([]);
    addAuditEvent("data_modified", "Reset clinical state to default prototype patient (Leo Vance, 3yo severe septic shock).");
  };

  // Build "Why am I seeing this?" modal data
  const handleOpenWhySeeingThis = (title: string, contextData: any) => {
    const matchingDoc = knowledgeDocs.find(d => d.isActive) || knowledgeDocs[0];
    const explanation: WhySeeingThisExplanation = {
      documentedFindings: [
        {
          parameter: "Heart Rate",
          value: patient.vitals.heartRate.value ? `${patient.vitals.heartRate.value} bpm` : "Missing",
          timestamp: patient.vitals.heartRate.timestamp,
          source: patient.vitals.heartRate.source
        },
        {
          parameter: "Capillary Refill Time",
          value: patient.vitals.capillaryRefill.value ? `${patient.vitals.capillaryRefill.value} sec` : "Missing",
          timestamp: patient.vitals.capillaryRefill.timestamp,
          source: patient.vitals.capillaryRefill.source
        },
        {
          parameter: "Blood Pressure",
          value: patient.vitals.systolicBP.value ? `${patient.vitals.systolicBP.value}/${patient.vitals.diastolicBP.value ?? "?"} mmHg` : "Missing",
          timestamp: patient.vitals.systolicBP.timestamp,
          source: patient.vitals.systolicBP.source
        },
        {
          parameter: "Serum Lactate",
          value: patient.labs.lactate.value ? `${patient.labs.lactate.value} mmol/L` : "Missing",
          timestamp: patient.labs.lactate.timestamp,
          source: patient.labs.lactate.source
        }
      ],
      ruleConditionTriggered:
        "Pediatric Shock Alert: Documented Heart Rate > 140 bpm (3yo threshold) with prolonged Capillary Refill (5s) and Critical Lactate (4.1 mmol/L) meeting criteria for acute septic shock requiring emergent resuscitation.",
      supportingGuidelineOrProtocol: {
        sourceTitle: matchingDoc.title,
        issuingOrg: matchingDoc.issuingOrganization,
        version: matchingDoc.version,
        section: matchingDoc.sections[0]?.sectionTitle || "Initial Management",
        excerpt: matchingDoc.sections[0]?.keyExcerpt || "Initiate rapid fluid resuscitation and empiric antimicrobials."
      },
      knownLimitationsAndMissingData: rulesOutput.missingObservations.concat(
        !patient.weightVerified ? ["Patient weight remains unverified on calibrated scale."] : []
      )
    };

    setWhyModalData({
      isOpen: true,
      title,
      explanation
    });

    addAuditEvent("why_seeing_this_opened", `Clinician inspected transparent rationale: "${title}"`);
  };

  const handleOpenWhySeeingThisItem = (item: PriorityWorkflowItem) => {
    const matchingDoc = knowledgeDocs.find(d => d.isActive) || knowledgeDocs[0];
    const explanation: WhySeeingThisExplanation = {
      documentedFindings: [
        {
          parameter: "Clinical Finding",
          value: item.supportingData,
          timestamp: new Date().toISOString(),
          source: "clinician_entered"
        }
      ],
      ruleConditionTriggered: item.whyDisplayed,
      supportingGuidelineOrProtocol: {
        sourceTitle: matchingDoc.title,
        issuingOrg: matchingDoc.issuingOrganization,
        version: matchingDoc.version,
        section: "Workflow Priority Item",
        excerpt: `Guideline standard: ${item.applicableRuleOrSource}`
      },
      knownLimitationsAndMissingData: rulesOutput.missingObservations
    };

    setWhyModalData({
      isOpen: true,
      title: item.title,
      explanation
    });

    addAuditEvent("why_seeing_this_opened", `Clinician opened rationale for priority: "${item.title}"`);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col antialiased">
      {/* 1. Header (Banner, Clinical Safety Status, Actions) */}
      <Header
        currentWorkflowState={patient.currentWorkflowState}
        geminiMode={geminiStatus}
        onOpenAssistant={() => {
          setIsAssistantOpen(true);
          addAuditEvent("assistant_queried", "Clinician opened Ask PediaSepsis AI assistant panel.");
        }}
        onOpenDataEntry={() => setIsDataEntryOpen(true)}
        onOpenInterventions={() => setIsInterventionsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 space-y-4">
        {/* 2. Scenario Testing & Simulation Switcher */}
        <ScenarioSelectorBar
          scenarios={VALIDATION_SCENARIOS}
          selectedScenarioId={activeScenarioId}
          onSelectScenario={handleSelectScenario}
          onResetToDefault={handleResetToDefault}
        />

        {/* 3. Patient Overview Card (Demographics, Weight verification, Workflow state) */}
        <PatientOverviewCard
          patient={patient}
          onVerifyWeight={() => handleVerifyWeight()}
          onChangeWorkflowState={handleWorkflowStateChange}
          onOpenDataEntry={() => setIsDataEntryOpen(true)}
        />

        {/* 4. Active Safety & Deterioration Banner (if critical) */}
        {rulesOutput.criticalAlerts.length > 0 && (
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 shadow-xs">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-red-900 uppercase tracking-wide">
                    Critical Clinical Safety Alert ({rulesOutput.criticalAlerts.length} Triggered)
                  </h4>
                  <span className="text-[10px] font-mono font-bold bg-red-200 text-red-900 px-2 py-0.5 rounded">
                    Immediate Action Recommended
                  </span>
                </div>
                <div className="text-xs text-red-800 space-y-1 pt-1">
                  {rulesOutput.criticalAlerts.map((alert: string, idx: number) => (
                    <div key={idx} className="flex items-start justify-between">
                      <span>• {alert}</span>
                      <button
                        onClick={() => handleOpenWhySeeingThis(alert, {})}
                        className="text-[11px] font-bold text-red-900 underline ml-2 shrink-0 cursor-pointer"
                      >
                        Why am I seeing this?
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Navigation Tab Strip */}
        <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 text-xs font-semibold gap-2 shadow-2xs">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`pb-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "dashboard"
                ? "border-teal-700 text-teal-900 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Clinical Dashboard & Priorities</span>
          </button>

          <button
            onClick={() => setActiveTab("trends")}
            className={`pb-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "trends"
                ? "border-teal-700 text-teal-900 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Longitudinal Trends & Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab("evidence")}
            className={`pb-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "evidence"
                ? "border-teal-700 text-teal-900 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Guideline & Knowledge Base</span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`pb-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "audit"
                ? "border-teal-700 text-teal-900 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Audit Log ({auditEvents.length})</span>
          </button>
        </div>

        {/* 6. TAB CONTENT */}
        {activeTab === "dashboard" && (
          <div className="space-y-4">
            {/* System Cards (Circulation, Respiratory, Neuro, Infection) */}
            <ClinicalStatusCards
              patient={patient}
              thresholds={rulesOutput.thresholds}
              onOpenWhySeeingThis={handleOpenWhySeeingThis}
              onOpenDataEntry={() => setIsDataEntryOpen(true)}
            />

            {/* Priorities for Clinician Review (Ranked workflow actions) */}
            <PrioritiesReviewList
              priorities={activePriorities}
              onCompletePriority={handleCompletePriority}
              onOpenWhySeeingThisItem={handleOpenWhySeeingThisItem}
              onOpenInterventions={() => setIsInterventionsOpen(true)}
              onOpenDataEntry={() => setIsDataEntryOpen(true)}
            />

            {/* Missing & Stale Data Panel */}
            <MissingStaleDataPanel
              patient={patient}
              missingObservations={rulesOutput.missingObservations}
              staleObservations={rulesOutput.staleObservations}
              onOpenDataEntry={() => setIsDataEntryOpen(true)}
              onVerifyWeight={() => handleVerifyWeight()}
            />
          </div>
        )}

        {activeTab === "trends" && (
          <TrendMonitorView
            history={history}
            currentPatient={patient}
            onOpenReassessmentModal={() => setIsInterventionsOpen(true)}
          />
        )}

        {activeTab === "evidence" && (
          <EvidenceViewer
            knowledgeDocuments={knowledgeDocs}
            onToggleDocumentActive={handleToggleKnowledgeDoc}
          />
        )}

        {activeTab === "audit" && (
          <AuditTrailView auditEvents={auditEvents} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-8 py-4 px-6 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">
          PediaSepsis AI — Pediatric Sepsis Decision-Support Environment
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Prototype designed strictly for clinician demonstration and workflow research. All data shown is fictional.
        </p>
      </footer>

      {/* Modals & Drawers */}
      {isDataEntryOpen && (
        <DataEntryModal
          patient={patient}
          onClose={() => setIsDataEntryOpen(false)}
          onSavePatientData={handleSavePatientData}
        />
      )}

      {isInterventionsOpen && (
        <InterventionsModal
          patient={patient}
          onClose={() => setIsInterventionsOpen(false)}
          onDocumentIntervention={handleDocumentIntervention}
          onDocumentReassessment={handleDocumentReassessment}
          onVerifyWeight={handleVerifyWeight}
        />
      )}

      <GeminiAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        patient={patient}
        priorities={activePriorities}
        geminiMode={geminiStatus}
      />

      {whyModalData.isOpen && (
        <WhySeeingThisModal
          title={whyModalData.title}
          explanation={whyModalData.explanation}
          onClose={() => setWhyModalData({ isOpen: false, title: "", explanation: null })}
        />
      )}
    </div>
  );
}
