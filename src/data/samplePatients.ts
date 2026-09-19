import { PatientRecord, HistoricalObservationPoint, ValidationScenario } from "../types/clinical";

const now = new Date();
const timeMinus = (minutes: number) => new Date(now.getTime() - minutes * 60000).toISOString();

export const INITIAL_SAMPLE_PATIENT: PatientRecord = {
  id: "pt-vance-leo",
  name: "Leo Vance",
  sex: "M",
  dob: "2023-04-12",
  mrn: "309-842-11",
  bedLocation: "ED Resus Bay 2",
  isFictional: false,
  ageYears: 3,
  ageMonths: 0,
  ageGroup: "toddler_preschool_1_5y",
  weightKg: 14.0,
  weightVerified: false,
  weightMeasurementTime: null,
  careLocation: "emergency_department",
  arrivalTime: timeMinus(55),
  suspectedInfectionSource: "Community-Acquired Pneumonia with Septic Shock",
  respiratorySupport: "none",
  vitals: {
    heartRate: {
      value: 168,
      unit: "bpm",
      timestamp: timeMinus(5),
      source: "measured",
      sourceLabel: "Bedside Pulse Oximetry / ECG Monitor"
    },
    respiratoryRate: {
      value: 42,
      unit: "breaths/min",
      timestamp: timeMinus(5),
      source: "clinician_entered",
      sourceLabel: "Triage Nurse Bedside Count"
    },
    systolicBP: {
      value: 78,
      unit: "mmHg",
      timestamp: timeMinus(8),
      source: "measured",
      sourceLabel: "Automated Pediatric NIBP Cuff #3",
      isStale: false
    },
    diastolicBP: {
      value: 42,
      unit: "mmHg",
      timestamp: timeMinus(8),
      source: "measured",
      sourceLabel: "Automated Pediatric NIBP Cuff #3",
      isStale: false
    },
    spO2: {
      value: 91,
      unit: "%",
      timestamp: timeMinus(5),
      source: "measured",
      sourceLabel: "Pulse Oximeter Probe (Room Air)"
    },
    temperature: {
      value: 39.2,
      unit: "°C",
      timestamp: timeMinus(15),
      source: "measured",
      sourceLabel: "Temporal Artery Thermometer"
    },
    capillaryRefill: {
      value: 5,
      unit: "seconds",
      timestamp: timeMinus(5),
      source: "clinician_entered",
      sourceLabel: "Attending Bedside Assessment"
    },
    mentalStatus: {
      value: "lethargic",
      unit: "clinical_scale",
      timestamp: timeMinus(8),
      source: "clinician_entered",
      sourceLabel: "AVPU Scale: Responsive to Voice Only"
    },
    peripheralTemp: {
      value: "cool",
      unit: "exam_finding",
      timestamp: timeMinus(8),
      source: "clinician_entered",
      sourceLabel: "Physical Exam: Cool distal extremities with weak pulses"
    }
  },
  labs: {
    lactate: {
      value: 4.1,
      unit: "mmol/L",
      timestamp: timeMinus(8),
      source: "measured",
      sourceLabel: "Point-of-Care Blood Gas"
    },
    whiteBloodCellCount: {
      value: 19.8,
      unit: "x10^3/uL",
      timestamp: timeMinus(25),
      source: "measured",
      sourceLabel: "Stat CBC with Differential"
    },
    platelets: {
      value: 165,
      unit: "x10^3/uL",
      timestamp: timeMinus(25),
      source: "measured",
      sourceLabel: "Stat CBC"
    },
    creatinine: {
      value: 0.72,
      unit: "mg/dL",
      timestamp: timeMinus(25),
      source: "measured",
      sourceLabel: "Stat Chemistry Panel"
    },
    glucose: {
      value: 4.2,
      unit: "mmol/L",
      timestamp: timeMinus(8),
      source: "measured",
      sourceLabel: "Point-of-Care Glucometer"
    }
  },
  documentedOrganDysfunction: [
    "Cardiovascular: Severe hypotension for age (SBP 78 ≤ 80 mmHg 5th percentile cutoff)",
    "Perfusion: Prolonged Capillary Refill Time (5 seconds)",
    "Metabolic: Hyperlactatemia (4.1 mmol/L)",
    "Neurologic: Altered Mental Status (Lethargic / Voice-responsive only)"
  ],
  interventions: [
    {
      id: "iv-access-1",
      category: "vascular_access",
      name: "Peripheral IV Line (22G Left Forearm)",
      route: "IV",
      timestamp: timeMinus(30),
      administeredBy: "J. Carter, RN",
      status: "administered"
    },
    {
      id: "blood-culture-1",
      category: "blood_culture",
      name: "Peripheral Blood Cultures x2 Sets Drawn Prior to Antimicrobials",
      route: "Peripheral Venipuncture",
      timestamp: timeMinus(15),
      administeredBy: "J. Carter, RN",
      status: "administered"
    }
  ],
  reassessments: [],
  currentWorkflowState: "possible_shock_deterioration",
  clinicianConfirmedState: false,
  lastUpdated: timeMinus(5),
  notes: [
    "Triage Note (T-55m): 3yo male brought by parents with 2-day fever, rapid breathing, and lethargy.",
    "Exam Note (T-10m): Subcostal retractions, grunting, poor peripheral perfusion, cool distal extremities. Chempions AI resuscitation protocol active."
  ]
};

export const INITIAL_SAMPLE_HISTORY: HistoricalObservationPoint[] = [
  {
    timestamp: timeMinus(50),
    heartRate: 112,
    respiratoryRate: 30,
    systolicBP: 94,
    diastolicBP: 56,
    capillaryRefill: 3,
    lactate: 2.1,
    spO2: 96,
    eventNote: "Triage arrival baseline"
  },
  {
    timestamp: timeMinus(35),
    heartRate: 134,
    respiratoryRate: 36,
    systolicBP: 88,
    diastolicBP: 50,
    capillaryRefill: 4,
    lactate: 2.8,
    spO2: 94,
    eventNote: "Transferred to Resuscitation Bay 2"
  },
  {
    timestamp: timeMinus(20),
    heartRate: 151,
    respiratoryRate: 40,
    systolicBP: 82,
    diastolicBP: 46,
    capillaryRefill: 4,
    lactate: 3.4,
    spO2: 92,
    eventNote: "Venous blood gas & laboratory panels drawn"
  },
  {
    timestamp: timeMinus(5),
    heartRate: 168,
    respiratoryRate: 42,
    systolicBP: 78,
    diastolicBP: 42,
    capillaryRefill: 5,
    lactate: 4.1,
    spO2: 91,
    eventNote: "Clinical deterioration alert triggered"
  }
];

export const SAMPLE_PATIENT_HISTORY = INITIAL_SAMPLE_HISTORY;

export const VALIDATION_SCENARIOS: ValidationScenario[] = [
  {
    id: "scen-2-worsening-shock",
    title: "Vance, Leo (3y M) • ED Resus 2",
    name: "Leo Vance",
    patientName: "Leo Vance",
    bedLocation: "ED Resus Bay 2",
    acuityLevel: "Critical (Level 1)",
    description: "Acute septic shock with hypotension (78/42), tachycardia (168 bpm), and hyperlactatemia (4.1 mmol/L).",
    keySafetyCheck: "Real-time recognition of worsening shock without waiting for autonomous diagnosis.",
    expectedBehavior: "Immediate critical shock alert with recommended fluid bolus and empiric antimicrobials.",
    patientData: INITIAL_SAMPLE_PATIENT,
    history: INITIAL_SAMPLE_HISTORY
  },
  {
    id: "scen-1-incomplete",
    title: "Lin, Maya (18m F) • ED Bed 4",
    name: "Maya Lin",
    patientName: "Maya Lin",
    bedLocation: "ED Bed 4",
    acuityLevel: "Urgent (Level 2)",
    description: "High fever (39.5°C) and tachypnea (48/min); blood pressure and blood gas lactate pending.",
    keySafetyCheck: "Missing data must be explicitly flagged and NEVER silently converted to normal values.",
    expectedBehavior: "Highlights missing observations (BP, Lactate, CRT) and flags pending orders.",
    patientData: {
      ...INITIAL_SAMPLE_PATIENT,
      id: "pt-lin-maya",
      name: "Maya Lin",
      sex: "F",
      dob: "2024-11-04",
      mrn: "482-194-08",
      bedLocation: "ED Bed 4",
      ageYears: 1,
      ageMonths: 6,
      ageGroup: "toddler_preschool_1_5y",
      weightKg: 11.5,
      weightVerified: false,
      suspectedInfectionSource: "Febrile Illness / Suspected Occult Bacteremia",
      vitals: {
        ...INITIAL_SAMPLE_PATIENT.vitals,
        temperature: { value: 39.5, unit: "°C", timestamp: timeMinus(10), source: "measured", sourceLabel: "Triage Tympanic" },
        respiratoryRate: { value: 48, unit: "breaths/min", timestamp: timeMinus(10), source: "clinician_entered", sourceLabel: "Nurse Exam" },
        systolicBP: { value: null, unit: "mmHg", timestamp: timeMinus(30), source: "missing", sourceLabel: "Unrecorded" },
        diastolicBP: { value: null, unit: "mmHg", timestamp: timeMinus(30), source: "missing", sourceLabel: "Unrecorded" },
        capillaryRefill: { value: null, unit: "seconds", timestamp: timeMinus(30), source: "missing", sourceLabel: "Unrecorded" }
      },
      labs: {
        ...INITIAL_SAMPLE_PATIENT.labs,
        lactate: { value: null, unit: "mmol/L", timestamp: timeMinus(30), source: "missing", sourceLabel: "Lab pending" }
      },
      currentWorkflowState: "suspected_infection"
    },
    history: []
  },
  {
    id: "scen-3-improving-response",
    title: "Cole, Ethan (4y M) • PICU Bed 1",
    name: "Ethan Cole",
    patientName: "Ethan Cole",
    bedLocation: "PICU Bed 1",
    acuityLevel: "Urgent (Level 2)",
    description: "Post-fluid bolus (10 mL/kg Plasmalyte) and IV Ceftriaxone; normalizing hemodynamics (HR 118, SBP 92).",
    keySafetyCheck: "Distinguish clinical stabilization requiring clinician-confirmed reassessment.",
    expectedBehavior: "Transitions to 'Responding to documented interventions' with positive trend indicators.",
    patientData: {
      ...INITIAL_SAMPLE_PATIENT,
      id: "pt-cole-ethan",
      name: "Ethan Cole",
      sex: "M",
      dob: "2022-08-19",
      mrn: "512-780-32",
      bedLocation: "PICU Bed 1",
      ageYears: 4,
      ageMonths: 2,
      careLocation: "picu",
      weightKg: 16.0,
      weightVerified: true,
      weightMeasurementTime: timeMinus(40),
      respiratorySupport: "high_flow",
      vitals: {
        ...INITIAL_SAMPLE_PATIENT.vitals,
        heartRate: { value: 118, unit: "bpm", timestamp: timeMinus(2), source: "measured", sourceLabel: "Bedside Monitor" },
        respiratoryRate: { value: 26, unit: "breaths/min", timestamp: timeMinus(2), source: "clinician_entered", sourceLabel: "Nurse Count" },
        systolicBP: { value: 92, unit: "mmHg", timestamp: timeMinus(2), source: "measured", sourceLabel: "NIBP Cuff" },
        diastolicBP: { value: 58, unit: "mmHg", timestamp: timeMinus(2), source: "measured", sourceLabel: "NIBP Cuff" },
        spO2: { value: 98, unit: "%", timestamp: timeMinus(2), source: "measured", sourceLabel: "Pulse Oximeter (FiO2 0.35)" },
        capillaryRefill: { value: 2, unit: "seconds", timestamp: timeMinus(2), source: "clinician_entered", sourceLabel: "Exam" },
        mentalStatus: { value: "alert", unit: "clinical_scale", timestamp: timeMinus(2), source: "clinician_entered", sourceLabel: "Consolable, drinking water" },
        peripheralTemp: { value: "warm", unit: "exam_finding", timestamp: timeMinus(2), source: "clinician_entered", sourceLabel: "Warm peripheries" }
      },
      labs: {
        ...INITIAL_SAMPLE_PATIENT.labs,
        lactate: { value: 1.8, unit: "mmol/L", timestamp: timeMinus(5), source: "measured", sourceLabel: "Repeat POC Blood Gas" }
      },
      interventions: [
        {
          id: "iv-1",
          category: "fluid_bolus",
          name: "Plasmalyte 10 mL/kg (160 mL)",
          dose: 160,
          doseUnit: "mL",
          route: "IV",
          timestamp: timeMinus(30),
          administeredBy: "J. Carter, RN",
          verifiedWeightUsedKg: 16,
          status: "administered"
        },
        {
          id: "abx-1",
          category: "antimicrobial",
          name: "Ceftriaxone 800 mg IV (50 mg/kg)",
          dose: 800,
          doseUnit: "mg",
          route: "IV",
          timestamp: timeMinus(25),
          administeredBy: "J. Carter, RN",
          verifiedWeightUsedKg: 16,
          status: "administered"
        }
      ],
      reassessments: [
        {
          id: "re-1",
          timestamp: timeMinus(5),
          clinicianName: "Dr. S. Vance",
          clinicianRole: "Pediatric Critical Care Attending",
          postInterventionResponse: "improved",
          findings: "Perfusion normalized, CRT <2s, BP stabilized, patient responsive and alert.",
          confirmedWorkflowState: "responding_to_interventions",
          escalationDecision: "continue_protocol"
        }
      ],
      currentWorkflowState: "responding_to_interventions",
      clinicianConfirmedState: true
    },
    history: [
      ...INITIAL_SAMPLE_HISTORY,
      {
        timestamp: timeMinus(2),
        heartRate: 118,
        respiratoryRate: 26,
        systolicBP: 92,
        diastolicBP: 58,
        capillaryRefill: 2,
        lactate: 1.8,
        spO2: 98,
        eventNote: "Post-fluid bolus & antibiotic reassessment"
      }
    ]
  },
  {
    id: "scen-4-unverified-weight",
    title: "Brooks, Emma (11m F) • ED Bed 1",
    name: "Emma Brooks",
    patientName: "Emma Brooks",
    bedLocation: "ED Bed 1",
    acuityLevel: "Urgent (Level 2)",
    description: "Parent-reported weight (9 kg) not scale-verified; automated dosing calculations locked.",
    keySafetyCheck: "Weight-based dosing engine locks all fluid and antibiotic calculations until verified.",
    expectedBehavior: "Blocks automated volumetric dosing until weight is verified on calibrated scale.",
    patientData: {
      ...INITIAL_SAMPLE_PATIENT,
      id: "pt-brooks-emma",
      name: "Emma Brooks",
      sex: "F",
      dob: "2025-06-22",
      mrn: "603-914-77",
      bedLocation: "ED Bed 1",
      ageYears: 0,
      ageMonths: 11,
      ageGroup: "infant_1_12m",
      weightKg: 9.0,
      weightVerified: false,
      weightMeasurementTime: null,
      suspectedInfectionSource: "Severe Bronchiolitis / Viral-Bacterial Superinfection"
    },
    history: INITIAL_SAMPLE_HISTORY
  },
  {
    id: "scen-5-stale-bp",
    title: "Kim, Lucas (2y M) • Ward 4B",
    name: "Lucas Kim",
    patientName: "Lucas Kim",
    bedLocation: "Peds Ward Bed 4B",
    acuityLevel: "Guarded (Level 3)",
    description: "Inpatient admission with pyelonephritis; last blood pressure recorded >50 minutes ago.",
    keySafetyCheck: "Old vital signs must be flagged as STALE to prevent false clinical reassurance.",
    expectedBehavior: "Prompts clinician to repeat vital signs before assessing cardiovascular stability.",
    patientData: {
      ...INITIAL_SAMPLE_PATIENT,
      id: "pt-kim-lucas",
      name: "Lucas Kim",
      sex: "M",
      dob: "2024-05-10",
      mrn: "721-445-90",
      bedLocation: "Peds Ward Bed 4B",
      careLocation: "pediatric_ward",
      ageYears: 2,
      ageMonths: 4,
      suspectedInfectionSource: "Complicated Pyelonephritis",
      vitals: {
        ...INITIAL_SAMPLE_PATIENT.vitals,
        systolicBP: { value: 84, unit: "mmHg", timestamp: timeMinus(52), source: "measured", sourceLabel: "Triage Cuff", isStale: true },
        diastolicBP: { value: 50, unit: "mmHg", timestamp: timeMinus(52), source: "measured", sourceLabel: "Triage Cuff", isStale: true }
      }
    },
    history: []
  },
  {
    id: "scen-6-conflicting-entries",
    title: "Chen, Olivia (5y F) • ED Bed 6",
    name: "Olivia Chen",
    patientName: "Olivia Chen",
    bedLocation: "ED Bed 6",
    acuityLevel: "Urgent (Level 2)",
    description: "Oscillometric cuff reading (102/60) contradicts manual physician auscultation (76/40).",
    keySafetyCheck: "System highlights discordance and flags value as 'Conflicting / Unverified' requiring resolution.",
    expectedBehavior: "Highlights measurement discordance and requires clinician confirmation of authoritative value.",
    patientData: {
      ...INITIAL_SAMPLE_PATIENT,
      id: "pt-chen-olivia",
      name: "Olivia Chen",
      sex: "F",
      dob: "2021-09-03",
      mrn: "834-662-15",
      bedLocation: "ED Bed 6",
      ageYears: 5,
      ageMonths: 0,
      vitals: {
        ...INITIAL_SAMPLE_PATIENT.vitals,
        systolicBP: {
          value: 76,
          unit: "mmHg",
          timestamp: timeMinus(3),
          source: "conflicting_unverified",
          sourceLabel: "Physician Manual Cuff (76) disagrees with Triage Auto Cuff (102)",
          notes: "Discordance between automated oscillometric and manual pediatric cuff."
        }
      }
    },
    history: []
  },
  {
    id: "scen-7-unsupported-rule",
    title: "Patel, Sophia (8y F) • PICU Bed 3",
    name: "Sophia Patel",
    patientName: "Sophia Patel",
    bedLocation: "PICU Bed 3",
    acuityLevel: "Critical (Level 1)",
    description: "Fluid-refractory septic shock requiring immediate pediatric intensivist evaluation and vasoactive infusion.",
    keySafetyCheck: "Early identification of fluid-refractory shock and prompt escalation to vasoactive support.",
    expectedBehavior: "Recommends senior PICU consultation, epinephrine or norepinephrine infusion, and central venous access.",
    patientData: {
      ...INITIAL_SAMPLE_PATIENT,
      id: "pt-patel-sophia",
      name: "Sophia Patel",
      sex: "F",
      dob: "2018-03-29",
      mrn: "905-113-24",
      bedLocation: "PICU Bed 3",
      careLocation: "picu",
      ageYears: 8,
      ageMonths: 5,
      ageGroup: "school_age_5_12y",
      weightKg: 26.0,
      weightVerified: true,
      currentWorkflowState: "persistent_abnormalities_escalation_required",
      suspectedInfectionSource: "Meningococcemia with Septic Shock"
    },
    history: INITIAL_SAMPLE_HISTORY
  },
  {
    id: "scen-10-clinician-override",
    title: "Davis, Noah (3y M) • ED Bed 8",
    name: "Noah Davis",
    patientName: "Noah Davis",
    bedLocation: "ED Bed 8",
    acuityLevel: "Stable (Level 4)",
    description: "Tachycardia alert resolved with clinician override noting active crying and exam anxiety.",
    keySafetyCheck: "Full auditability: original entry preserved, correction reason logged in tamper-evident audit history.",
    expectedBehavior: "Displays clinician override note in audit log while preserving underlying observation history.",
    patientData: {
      ...INITIAL_SAMPLE_PATIENT,
      id: "pt-davis-noah",
      name: "Noah Davis",
      sex: "M",
      dob: "2023-02-14",
      mrn: "419-338-62",
      bedLocation: "ED Bed 8",
      currentWorkflowState: "at_risk",
      notes: [
        "Audit Note: Tachycardia alert acknowledged and overridden by Dr. Vance. Patient was crying vigorously during exam; repeat count resting is 108 bpm."
      ]
    },
    history: INITIAL_SAMPLE_HISTORY
  }
];
