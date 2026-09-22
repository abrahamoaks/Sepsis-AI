import { PatientRecord, HistoricalObservationPoint, ValidationScenario } from "../types/clinical";

const now = new Date();
const timeMinus = (minutes: number) => new Date(now.getTime() - minutes * 60000).toISOString();

export const INITIAL_SAMPLE_PATIENT: PatientRecord = {
  id: "pt-eze-obi",
  name: "Obi Eze",
  sex: "M",
  dob: "2023-04-12",
  mrn: "309-842-11",
  bedLocation: "ED Resus Bay 2",
  isFictional: false,
  ageYears: 3,
  ageMonths: 0,
  ageGroup: "toddler_preschool_1_5y",
  weightKg: 14.2,
  weightVerified: false,
  weightMeasurementTime: null,
  careLocation: "emergency_department",
  arrivalTime: timeMinus(18),
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
    id: "pt-eze-obi",
    title: "Obi Eze (3y M) • ED Resus Bay 2",
    name: "Obi Eze",
    patientName: "Obi Eze",
    bedLocation: "ED Resus Bay 2",
    acuityLevel: "Critical (Level 1)",
    description: "Acute septic shock with tachycardia (168 bpm), tachypnea (42/min), and hyperlactatemia (4.1 mmol/L).",
    keySafetyCheck: "Immediate 1-hour sepsis resuscitation bundle & bedside scale weight verification.",
    expectedBehavior: "Active shock warning with prioritized airway, weight safety check, blood cultures, and empiric IV antibiotics.",
    patientData: INITIAL_SAMPLE_PATIENT,
    history: INITIAL_SAMPLE_HISTORY
  },
  {
    id: "pt-diallo-amina",
    title: "Amina Diallo (18m F) • ED Bed 4",
    name: "Amina Diallo",
    patientName: "Amina Diallo",
    bedLocation: "ED Bed 4",
    acuityLevel: "Stable • Step 4 of 6",
    description: "18-month-old female with occult bacteremia under protocolized management; broad-spectrum IV ceftriaxone administered.",
    keySafetyCheck: "Monitor post-infusion vital sign recovery and fluid maintenance.",
    expectedBehavior: "Stable trajectory with completed antimicrobial infusion and repeat lactate scheduled.",
    patientData: {
      ...INITIAL_SAMPLE_PATIENT,
      id: "pt-diallo-amina",
      name: "Amina Diallo",
      sex: "F",
      dob: "2024-11-04",
      mrn: "482-194-08",
      bedLocation: "ED Bed 4",
      ageYears: 1,
      ageMonths: 6,
      ageGroup: "toddler_preschool_1_5y",
      weightKg: 10.8,
      weightVerified: true,
      weightMeasurementTime: timeMinus(35),
      suspectedInfectionSource: "Suspected Occult Bacteremia / Febrile Illness",
      vitals: {
        ...INITIAL_SAMPLE_PATIENT.vitals,
        heartRate: { value: 124, unit: "bpm", timestamp: timeMinus(10), source: "measured", sourceLabel: "Bedside Monitor" },
        respiratoryRate: { value: 28, unit: "breaths/min", timestamp: timeMinus(10), source: "clinician_entered", sourceLabel: "Nurse Exam" },
        systolicBP: { value: 88, unit: "mmHg", timestamp: timeMinus(10), source: "measured", sourceLabel: "Pediatric NIBP Cuff" },
        diastolicBP: { value: 52, unit: "mmHg", timestamp: timeMinus(10), source: "measured", sourceLabel: "Pediatric NIBP Cuff" },
        spO2: { value: 97, unit: "%", timestamp: timeMinus(10), source: "measured", sourceLabel: "Pulse Oximeter" },
        capillaryRefill: { value: 2, unit: "seconds", timestamp: timeMinus(10), source: "clinician_entered", sourceLabel: "Exam" },
        temperature: { value: 38.4, unit: "°C", timestamp: timeMinus(15), source: "measured", sourceLabel: "Axillary" },
        mentalStatus: { value: "alert", unit: "clinical_scale", timestamp: timeMinus(10), source: "clinician_entered", sourceLabel: "Alert, consolable" },
        peripheralTemp: { value: "warm", unit: "exam_finding", timestamp: timeMinus(10), source: "clinician_entered", sourceLabel: "Warm extremities" }
      },
      labs: {
        ...INITIAL_SAMPLE_PATIENT.labs,
        lactate: { value: 1.9, unit: "mmol/L", timestamp: timeMinus(15), source: "measured", sourceLabel: "POC Blood Gas" }
      },
      interventions: [
        {
          id: "abx-diallo-1",
          category: "antimicrobial",
          name: "Broad-spectrum IV Ceftriaxone (50 mg/kg)",
          dose: 540,
          doseUnit: "mg",
          route: "IV",
          timestamp: timeMinus(14),
          administeredBy: "K. Chen, RN",
          verifiedWeightUsedKg: 10.8,
          status: "administered"
        }
      ],
      currentWorkflowState: "responding_to_interventions",
      clinicianConfirmedState: true
    },
    history: [
      {
        timestamp: timeMinus(45),
        heartRate: 148,
        respiratoryRate: 36,
        systolicBP: 82,
        diastolicBP: 48,
        capillaryRefill: 3,
        lactate: 2.6,
        spO2: 95,
        eventNote: "Initial ED Triage Arrival"
      },
      {
        timestamp: timeMinus(10),
        heartRate: 124,
        respiratoryRate: 28,
        systolicBP: 88,
        diastolicBP: 52,
        capillaryRefill: 2,
        lactate: 1.9,
        spO2: 97,
        eventNote: "Post-antibiotic vital sign check"
      }
    ]
  },
  {
    id: "pt-mensah-kofi",
    title: "Kofi Mensah (5y M) • PICU Bed 1",
    name: "Kofi Mensah",
    patientName: "Kofi Mensah",
    bedLocation: "PICU Bed 1",
    acuityLevel: "Guarded • Step 5 of 6",
    description: "5-year-old male with severe pneumonia; post-fluid bolus (10 mL/kg) undergoing perfusion reassessment.",
    keySafetyCheck: "Auscultate lung bases for fluid overload / crackles following initial bolus.",
    expectedBehavior: "Evaluates capillary refill time and blood pressure response before second fluid bolus.",
    patientData: {
      ...INITIAL_SAMPLE_PATIENT,
      id: "pt-mensah-kofi",
      name: "Kofi Mensah",
      sex: "M",
      dob: "2021-06-18",
      mrn: "512-780-32",
      bedLocation: "PICU Bed 1",
      careLocation: "picu",
      ageYears: 5,
      ageMonths: 3,
      weightKg: 18.2,
      weightVerified: true,
      weightMeasurementTime: timeMinus(45),
      respiratorySupport: "nasal_cannula",
      vitals: {
        ...INITIAL_SAMPLE_PATIENT.vitals,
        heartRate: { value: 126, unit: "bpm", timestamp: timeMinus(5), source: "measured", sourceLabel: "Telemetry" },
        respiratoryRate: { value: 28, unit: "breaths/min", timestamp: timeMinus(5), source: "clinician_entered", sourceLabel: "Nurse Exam" },
        systolicBP: { value: 94, unit: "mmHg", timestamp: timeMinus(5), source: "measured", sourceLabel: "Arterial Line" },
        diastolicBP: { value: 58, unit: "mmHg", timestamp: timeMinus(5), source: "measured", sourceLabel: "Arterial Line" },
        spO2: { value: 96, unit: "%", timestamp: timeMinus(5), source: "measured", sourceLabel: "Pulse Oximeter (2L NC)" },
        capillaryRefill: { value: 2.5, unit: "seconds", timestamp: timeMinus(5), source: "clinician_entered", sourceLabel: "Exam" },
        mentalStatus: { value: "alert", unit: "clinical_scale", timestamp: timeMinus(5), source: "clinician_entered", sourceLabel: "Calm, looking around" }
      },
      labs: {
        ...INITIAL_SAMPLE_PATIENT.labs,
        lactate: { value: 2.4, unit: "mmol/L", timestamp: timeMinus(15), source: "measured", sourceLabel: "Arterial Blood Gas" }
      },
      interventions: [
        {
          id: "fluid-mensah-1",
          category: "fluid_bolus",
          name: "Balanced Crystalloid (10 mL/kg)",
          dose: 182,
          doseUnit: "mL",
          route: "IV",
          timestamp: timeMinus(25),
          administeredBy: "J. Carter, RN",
          verifiedWeightUsedKg: 18.2,
          status: "administered"
        }
      ],
      currentWorkflowState: "responding_to_interventions",
      clinicianConfirmedState: true
    },
    history: [
      {
        timestamp: timeMinus(50),
        heartRate: 156,
        respiratoryRate: 38,
        systolicBP: 80,
        diastolicBP: 44,
        capillaryRefill: 4,
        lactate: 3.8,
        spO2: 92,
        eventNote: "Initial PICU transfer"
      },
      {
        timestamp: timeMinus(5),
        heartRate: 126,
        respiratoryRate: 28,
        systolicBP: 94,
        diastolicBP: 58,
        capillaryRefill: 2.5,
        lactate: 2.4,
        spO2: 96,
        eventNote: "Post-fluid bolus assessment"
      }
    ]
  }
];
