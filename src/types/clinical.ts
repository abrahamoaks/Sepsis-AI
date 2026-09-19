export type DataSourceType =
  | "measured"
  | "clinician_entered"
  | "system_derived"
  | "ai_generated"
  | "missing"
  | "stale"
  | "conflicting_unverified";

export type TrendDirection = "improving" | "worsening" | "stable" | "insufficient_data";

export interface ClinicalObservation<T = number | string> {
  value: T | null;
  unit: string;
  timestamp: string; // ISO 8601
  source: DataSourceType;
  sourceLabel?: string;
  isStale?: boolean;
  isVerified?: boolean;
  notes?: string;
}

export type AgeGroup =
  | "neonate_0_28d"
  | "infant_1_12m"
  | "toddler_preschool_1_5y"
  | "school_age_5_12y"
  | "adolescent_gt_12y";

export type CareLocation = "emergency_department" | "pediatric_ward" | "picu" | "triage";

export type MentalStatus = "alert" | "verbal" | "pain" | "unresponsive" | "altered" | "lethargic" | "irritable";
export type PeripheralTemperature = "warm" | "cool" | "cold" | "mottled";

export interface VitalSigns {
  heartRate: ClinicalObservation<number>;
  respiratoryRate: ClinicalObservation<number>;
  systolicBP: ClinicalObservation<number>;
  diastolicBP: ClinicalObservation<number>;
  spO2: ClinicalObservation<number>;
  temperature: ClinicalObservation<number>;
  capillaryRefill: ClinicalObservation<number>;
  mentalStatus: ClinicalObservation<MentalStatus>;
  peripheralTemp: ClinicalObservation<PeripheralTemperature>;
  urineOutput?: ClinicalObservation<number>; // mL/kg/h
}

export interface LabResults {
  lactate: ClinicalObservation<number>;
  glucose: ClinicalObservation<number>;
  whiteBloodCellCount?: ClinicalObservation<number>;
  platelets?: ClinicalObservation<number>;
  crp?: ClinicalObservation<number>;
  creatinine?: ClinicalObservation<number>;
}

export interface DocumentedIntervention {
  id: string;
  category: "fluid_bolus" | "antimicrobial" | "oxygen" | "blood_culture" | "vasoactive" | "vascular_access";
  name: string;
  dose?: number;
  doseUnit?: string;
  calculatedDosePerKg?: number;
  formulaUsed?: string;
  maxDoseLimit?: number;
  route?: string;
  timestamp: string;
  administeredBy: string;
  verifiedWeightUsedKg?: number;
  status: "ordered" | "administered" | "held" | "completed";
  clinicalNotes?: string;
}

export interface ClinicianReassessment {
  id: string;
  timestamp: string;
  clinicianName: string;
  clinicianRole: string;
  postInterventionResponse: "improved" | "unchanged" | "deteriorated" | "pending_evaluation";
  findings: string;
  confirmedWorkflowState: WorkflowState;
  escalationDecision?: "continue_protocol" | "picu_consult" | "senior_fellow_review" | "de-escalate";
}

export type WorkflowState =
  | "at_risk"
  | "suspected_infection"
  | "possible_sepsis_organ_dysfunction"
  | "possible_shock_deterioration"
  | "responding_to_interventions"
  | "persistent_abnormalities_escalation_required";

export interface PatientRecord {
  id: string;
  mrn: string; // Fictional ID (e.g. FIC-PED-9402)
  isFictional: true;
  ageYears: number;
  ageMonths: number;
  ageGroup: AgeGroup;
  weightKg: number | null;
  weightVerified: boolean;
  weightMeasurementTime: string | null;
  careLocation: CareLocation;
  arrivalTime: string;
  suspectedInfectionSource: string;
  respiratorySupport: "none" | "nasal_cannula" | "high_flow" | "cpap" | "invasive_ventilation";
  vitals: VitalSigns;
  labs: LabResults;
  documentedOrganDysfunction: string[];
  interventions: DocumentedIntervention[];
  reassessments: ClinicianReassessment[];
  currentWorkflowState: WorkflowState;
  clinicianConfirmedState: boolean;
  lastUpdated: string;
  notes: string[];
}

export interface HistoricalObservationPoint {
  timestamp: string;
  heartRate?: number;
  respiratoryRate?: number;
  systolicBP?: number;
  diastolicBP?: number;
  capillaryRefill?: number;
  lactate?: number;
  spO2?: number;
  eventNote?: string;
}

export interface PriorityWorkflowItem {
  id: string;
  title: string;
  category: "airway_breathing" | "circulation_fluid" | "antimicrobial" | "diagnostics" | "escalation" | "data_quality";
  urgency: "critical" | "high" | "moderate" | "routine";
  whyDisplayed: string;
  supportingData: string;
  applicableRuleOrSource: string;
  requiresClinicianConfirmation: boolean;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: string;
  whyAmISeeingThis: WhySeeingThisExplanation;
}

export interface WhySeeingThisExplanation {
  documentedFindings: { parameter: string; value: string; timestamp: string; source: DataSourceType }[];
  ruleConditionTriggered: string;
  supportingGuidelineOrProtocol: {
    sourceTitle: string;
    issuingOrg: string;
    version: string;
    section: string;
    excerpt: string;
  };
  knownLimitationsAndMissingData: string[];
}

export type AuditEventType =
  | "data_entered"
  | "data_modified"
  | "observation_entered"
  | "observation_corrected"
  | "rule_triggered"
  | "alert_triggered"
  | "intervention_documented"
  | "priority_completed"
  | "reassessment_logged"
  | "weight_verified"
  | "gemini_explanation_generated"
  | "assistant_queried"
  | "why_seeing_this_opened"
  | "alert_acknowledged"
  | "clinician_override";

export interface AuditEvent {
  id: string;
  timestamp: string;
  userRole?: string;
  userId?: string;
  actor?: string;
  role?: string;
  eventType?: AuditEventType;
  action?: string;
  summary: string;
  previousValue?: string;
  newValue?: string;
  verificationState?: "verified" | "unverified" | "pending";
  details?: Record<string, any>;
  whyAmISeeingThis?: WhySeeingThisExplanation;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  issuingOrganization: string;
  version: string;
  publicationDate: string;
  reviewDate: string;
  isActive: boolean;
  scope: string;
  summary: string;
  sections: {
    sectionTitle: string;
    pageOrParagraph?: string;
    keyExcerpt: string;
    evidenceGrade?: string;
  }[];
}

export interface ValidationScenario {
  id: string;
  title: string;
  name?: string;
  description: string;
  keySafetyCheck: string;
  expectedBehavior: string;
  expectedBehaviors?: string[];
  patientData: PatientRecord;
  patient?: PatientRecord;
  history: HistoricalObservationPoint[];
  purpose?: string;
}
