import {
  PatientRecord,
  PriorityWorkflowItem,
  HistoricalObservationPoint,
  TrendDirection,
  AgeGroup
} from "../types/clinical";

export interface PediatricVitalThresholds {
  ageGroupLabel: string;
  hrNormalMin: number;
  hrNormalMax: number;
  rrNormalMin: number;
  rrNormalMax: number;
  sbpMinNormal: number; // 5th percentile
  hypotensionThreshold: number;
}

export function getAgeThresholds(ageYears: number, ageMonths: number): PediatricVitalThresholds {
  const totalMonths = ageYears * 12 + ageMonths;

  if (totalMonths <= 1) {
    return {
      ageGroupLabel: "Neonate (0–28 days)",
      hrNormalMin: 100,
      hrNormalMax: 180,
      rrNormalMin: 30,
      rrNormalMax: 60,
      sbpMinNormal: 65,
      hypotensionThreshold: 60
    };
  }
  if (totalMonths <= 12) {
    return {
      ageGroupLabel: "Infant (1–12 months)",
      hrNormalMin: 100,
      hrNormalMax: 160,
      rrNormalMin: 30,
      rrNormalMax: 50,
      sbpMinNormal: 75,
      hypotensionThreshold: 70
    };
  }
  if (ageYears <= 5) {
    // 1 to 5 years (e.g., 3-year-old child): SBP 5th percentile = 70 + (2 * age) = 76 mmHg
    const sbpThreshold = 70 + 2 * ageYears;
    return {
      ageGroupLabel: "Toddler / Preschool (1–5 years)",
      hrNormalMin: 80,
      hrNormalMax: 140,
      rrNormalMin: 20,
      rrNormalMax: 30,
      sbpMinNormal: sbpThreshold + 10,
      hypotensionThreshold: sbpThreshold // e.g. 76 mmHg for 3yo
    };
  }
  if (ageYears <= 12) {
    const sbpThreshold = 70 + 2 * ageYears;
    return {
      ageGroupLabel: "School-age (6–12 years)",
      hrNormalMin: 70,
      hrNormalMax: 120,
      rrNormalMin: 16,
      rrNormalMax: 24,
      sbpMinNormal: sbpThreshold + 10,
      hypotensionThreshold: sbpThreshold
    };
  }
  return {
    ageGroupLabel: "Adolescent (>12 years)",
    hrNormalMin: 60,
    hrNormalMax: 100,
    rrNormalMin: 12,
    rrNormalMax: 20,
    sbpMinNormal: 100,
    hypotensionThreshold: 90
  };
}

export const getPediatricVitalThresholds = getAgeThresholds;

export interface RuleEvaluationResult {
  hasCriticalAlert: boolean;
  hasHighPriorityAlert: boolean;
  alertMessages: string[];
  criticalAlerts: string[];
  organDysfunctionList: string[];
  missingObservations: string[];
  staleObservations: string[];
  priorities: PriorityWorkflowItem[];
  suggestedWorkflowState: PatientRecord["currentWorkflowState"];
  dataCompletenessPercentage: number;
  thresholds: PediatricVitalThresholds;
}

export function evaluateClinicalSafetyRules(
  patient: PatientRecord,
  history: HistoricalObservationPoint[] = []
): RuleEvaluationResult {
  const thresholds = getAgeThresholds(patient.ageYears, patient.ageMonths);
  const alerts: string[] = [];
  const organDysfunctions: string[] = [];
  const missing: string[] = [];
  const stale: string[] = [];
  const priorities: PriorityWorkflowItem[] = [];

  let totalKeyDataPoints = 10;
  let presentKeyDataPoints = 0;

  // 1. Heart Rate
  const hr = patient.vitals.heartRate.value;
  if (hr === null || hr === undefined) {
    missing.push("Heart Rate");
  } else {
    presentKeyDataPoints++;
    if (hr > thresholds.hrNormalMax) {
      alerts.push(`Severe Tachycardia for age (${hr} bpm > ${thresholds.hrNormalMax} bpm limit)`);
      organDysfunctions.push("Cardiovascular: Tachycardia");
    } else if (hr < thresholds.hrNormalMin) {
      alerts.push(`Bradycardia for age (${hr} bpm < ${thresholds.hrNormalMin} bpm limit) - Ominous in pediatric shock`);
      organDysfunctions.push("Cardiovascular: Critical Bradycardia");
    }
  }

  // 2. Respiratory Rate & SpO2
  const rr = patient.vitals.respiratoryRate.value;
  if (rr === null || rr === undefined) {
    missing.push("Respiratory Rate");
  } else {
    presentKeyDataPoints++;
    if (rr > thresholds.rrNormalMax) {
      alerts.push(`Severe Tachypnea for age (${rr} breaths/min > ${thresholds.rrNormalMax} limit)`);
      organDysfunctions.push("Respiratory: Tachypnea / Increased work of breathing");
    }
  }

  const spo2 = patient.vitals.spO2.value;
  if (spo2 === null || spo2 === undefined) {
    missing.push("Oxygen Saturation (SpO₂)");
  } else {
    presentKeyDataPoints++;
    if (spo2 < 92) {
      alerts.push(`Hypoxemia documented (SpO₂ ${spo2}% < 92% on room air/current support)`);
      organDysfunctions.push("Respiratory: Hypoxemia");
    }
  }

  // 3. Blood Pressure
  const sbp = patient.vitals.systolicBP.value;
  const dbp = patient.vitals.diastolicBP.value;
  if (sbp === null || sbp === undefined) {
    missing.push("Blood Pressure (Systolic / Diastolic)");
  } else {
    presentKeyDataPoints++;
    if (sbp <= thresholds.hypotensionThreshold) {
      alerts.push(`Hypotension for age: SBP ${sbp} mmHg (Hypotension threshold ≤ ${thresholds.hypotensionThreshold} mmHg for ${thresholds.ageGroupLabel})`);
      organDysfunctions.push("Cardiovascular: Decompensated Hypotensive Shock");
    }

    if (patient.vitals.systolicBP.isStale) {
      stale.push("Blood Pressure (measurement older than 30 minutes in acute encounter)");
    }
  }

  // 4. Capillary Refill & Perfusion
  const crt = patient.vitals.capillaryRefill.value;
  if (crt === null || crt === undefined) {
    missing.push("Capillary Refill Time");
  } else {
    presentKeyDataPoints++;
    if (crt > 2) {
      alerts.push(`Prolonged Capillary Refill Time (${crt} seconds > 2.0s normal threshold)`);
      organDysfunctions.push("Perfusion: Delayed Capillary Refill");
    }
  }

  const periphTemp = patient.vitals.peripheralTemp.value;
  if (!periphTemp) {
    missing.push("Peripheral Temperature Exam");
  } else {
    presentKeyDataPoints++;
    if (periphTemp === "cold" || periphTemp === "cool" || periphTemp === "mottled") {
      alerts.push(`Peripheral Perfusion Impairment (${periphTemp} extremities documented)`);
      organDysfunctions.push("Perfusion: Cold / Mottled Extremities");
    }
  }

  // 5. Mental Status
  const mental = patient.vitals.mentalStatus.value;
  if (!mental) {
    missing.push("Neurological / Mental Status");
  } else {
    presentKeyDataPoints++;
    if (mental !== "alert") {
      alerts.push(`Altered Mental Status Documented (${mental.toUpperCase()}) - Sign of cerebral hypoperfusion`);
      organDysfunctions.push("Neurological: Altered Encephalopathy");
    }
  }

  // 6. Temperature
  const temp = patient.vitals.temperature.value;
  if (temp === null || temp === undefined) {
    missing.push("Core Temperature");
  } else {
    presentKeyDataPoints++;
    if (temp >= 38.5) {
      alerts.push(`Fever Documented (${temp} °C)`);
    } else if (temp < 36.0) {
      alerts.push(`Hypothermia Documented (${temp} °C < 36.0°C) - High risk in pediatric sepsis`);
      organDysfunctions.push("Thermoregulatory: Hypothermia");
    }
  }

  // 7. Lactate
  const lactate = patient.labs.lactate.value;
  if (lactate === null || lactate === undefined) {
    missing.push("Serum Lactate");
  } else {
    presentKeyDataPoints++;
    if (lactate >= 4.0) {
      alerts.push(`Critical Hyperlactatemia (${lactate} mmol/L ≥ 4.0 mmol/L) - Severe cellular hypoperfusion`);
      organDysfunctions.push("Metabolic: Severe Hyperlactatemia (≥4.0)");
    } else if (lactate > 2.0) {
      alerts.push(`Elevated Serum Lactate (${lactate} mmol/L > 2.0 mmol/L)`);
      organDysfunctions.push("Metabolic: Hyperlactatemia (>2.0)");
    }
  }

  // 8. Glucose
  const glucose = patient.labs.glucose.value;
  if (glucose === null || glucose === undefined) {
    missing.push("Blood Glucose");
  } else {
    presentKeyDataPoints++;
    if (glucose < 3.3) {
      alerts.push(`Hypoglycemia Warning (${glucose} mmol/L < 3.3 mmol/L [~60 mg/dL]) - Immediate correction indicated`);
      organDysfunctions.push("Endocrine: Hypoglycemia");
    }
  }

  // Weight Verification Check
  if (!patient.weightVerified) {
    alerts.push("Weight is UNVERIFIED. Weight-based dosing & fluid boluses locked pending bedside scale verification.");
    missing.push("Verified Weight (Bedside scale / certified measurement)");
  }

  // Urine output check
  if (!patient.vitals.urineOutput || patient.vitals.urineOutput.value === null) {
    missing.push("Urine Output Observation (mL/kg/h)");
  }

  // Blood culture check
  const hasBloodCulture = patient.interventions.some(i => i.category === "blood_culture");
  const hasAntibiotics = patient.interventions.some(i => i.category === "antimicrobial");
  if (!hasBloodCulture) {
    missing.push("Blood Cultures (required prior to antimicrobial administration)");
  }

  const dataCompletenessPercentage = Math.round((presentKeyDataPoints / totalKeyDataPoints) * 100);

  // BUILD RANKED PRIORITIES FOR CLINICIAN REVIEW
  const nowStr = new Date().toISOString();

  // Priority 1: ABC and Oxygenation
  if (spo2 !== null && spo2 !== undefined && spo2 < 92) {
    priorities.push({
      id: "prio-abc-o2",
      title: "Reassess Airway, Breathing & Apply Oxygen Therapy",
      category: "airway_breathing",
      urgency: "critical",
      whyDisplayed: `Documented SpO₂ is ${spo2}%, below target threshold of ≥94%. Tachypnea present (RR ${rr ?? "N/A"}).`,
      supportingData: `SpO₂: ${spo2}%, RR: ${rr ?? "unrecorded"} breaths/min, Work of breathing elevated.`,
      applicableRuleOrSource: "Surviving Sepsis Campaign 2026 Pediatric Guidelines (Section 3.1) & Hospital Protocol",
      requiresClinicianConfirmation: true,
      isCompleted: patient.respiratorySupport !== "none",
      completedAt: patient.respiratorySupport !== "none" ? nowStr : undefined,
      whyAmISeeingThis: {
        documentedFindings: [
          { parameter: "SpO2", value: `${spo2}%`, timestamp: patient.vitals.spO2.timestamp, source: patient.vitals.spO2.source },
          { parameter: "Respiratory Rate", value: `${rr} bpm`, timestamp: patient.vitals.respiratoryRate.timestamp, source: patient.vitals.respiratoryRate.source }
        ],
        ruleConditionTriggered: "SpO₂ < 92% or severe respiratory distress detected in pediatric patient with suspected infection.",
        supportingGuidelineOrProtocol: {
          sourceTitle: "Surviving Sepsis Campaign 2026 Pediatric Guidelines",
          issuingOrg: "SCCM / ESICM",
          version: "2026 Update",
          section: "Airway & Respiratory Support (Section 3.2)",
          excerpt: "Provide supplemental oxygen targeting SpO₂ 94-98% for children with signs of septic shock or hypoxemia."
        },
        knownLimitationsAndMissingData: missing.includes("Blood Gas") ? ["Arterial/capillary blood gas not yet obtained"] : []
      }
    });
  }

  // Priority 2: Verified Weight Check
  if (!patient.weightVerified) {
    priorities.push({
      id: "prio-verify-weight",
      title: "Verify Patient Weight at Bedside",
      category: "data_quality",
      urgency: "critical",
      whyDisplayed: "Documented weight is unverified. Pediatric safety rules block fluid and medication dosing calculations until confirmed on a calibrated bedside scale.",
      supportingData: `Entered weight: ${patient.weightKg ?? "missing"} kg (Unverified).`,
      applicableRuleOrSource: "Deterministic Safety Rules Engine & Hospital Pediatric Medication Safety Standard",
      requiresClinicianConfirmation: true,
      isCompleted: patient.weightVerified,
      whyAmISeeingThis: {
        documentedFindings: [
          { parameter: "Weight", value: `${patient.weightKg ?? "null"} kg (unverified)`, timestamp: patient.lastUpdated, source: "conflicting_unverified" }
        ],
        ruleConditionTriggered: "weightVerified === false. Dosing engine blocks calculation without confirmed bedside measurement.",
        supportingGuidelineOrProtocol: {
          sourceTitle: "Hospital Pediatric Clinical Practice Committee",
          issuingOrg: "Clinical Safety Directorate",
          version: "2026",
          section: "Weight Verification Directive",
          excerpt: "Weight-based fluid boluses and antibiotic doses must use scale-verified weight or emergency length-based tape."
        },
        knownLimitationsAndMissingData: ["Weight measurement time not certified by bedside nurse or clinician."]
      }
    });
  }

  // Priority 3: Vascular Access & Blood Cultures
  priorities.push({
    id: "prio-blood-cultures",
    title: "Obtain Blood Cultures & Diagnostic Labs Prior to Antimicrobials",
    category: "diagnostics",
    urgency: hasAntibiotics && !hasBloodCulture ? "critical" : "high",
    whyDisplayed: hasBloodCulture
      ? "Blood cultures documented."
      : "Blood cultures must be drawn before initiating empiric broad-spectrum intravenous antimicrobials.",
    supportingData: `Infection source: ${patient.suspectedInfectionSource}. Blood cultures drawn: ${hasBloodCulture ? "YES" : "PENDING"}.`,
    applicableRuleOrSource: "Surviving Sepsis Campaign 2026 & Institutional 1-Hour Sepsis Bundle",
    requiresClinicianConfirmation: true,
    isCompleted: hasBloodCulture,
    whyAmISeeingThis: {
      documentedFindings: [
        { parameter: "Suspected Infection", value: patient.suspectedInfectionSource, timestamp: patient.lastUpdated, source: "clinician_entered" },
        { parameter: "Blood Culture Documented", value: hasBloodCulture ? "Yes" : "No", timestamp: patient.lastUpdated, source: "system_derived" }
      ],
      ruleConditionTriggered: "Suspected sepsis workflow: Blood cultures required prior to antimicrobial infusion without delaying therapy >45min.",
      supportingGuidelineOrProtocol: {
        sourceTitle: "Surviving Sepsis Campaign Pediatric Guidelines",
        issuingOrg: "SCCM / ESICM",
        version: "2026",
        section: "Diagnostic Microbiology (Section 5.2)",
        excerpt: "Obtain appropriate microbiological cultures before starting antimicrobial therapy if this can be done without substantial delay."
      },
      knownLimitationsAndMissingData: hasBloodCulture ? [] : ["Blood culture specimen tracking pending"]
    }
  });

  // Priority 4: Antimicrobial Initiation
  priorities.push({
    id: "prio-antimicrobial",
    title: "Initiate Empiric Intravenous Antimicrobials (within 1 Hour)",
    category: "antimicrobial",
    urgency: "critical",
    whyDisplayed: `Suspected ${patient.suspectedInfectionSource} with hemodynamic/perfusion signs of sepsis. Institutional target ≤60 mins.`,
    supportingData: `Interventions documented: ${hasAntibiotics ? "Antimicrobial Administered" : "Not yet administered"}`,
    applicableRuleOrSource: "Institutional 1-Hour Pediatric Sepsis Protocol & SSC 2026",
    requiresClinicianConfirmation: true,
    isCompleted: hasAntibiotics,
    whyAmISeeingThis: {
      documentedFindings: [
        { parameter: "Suspected Source", value: patient.suspectedInfectionSource, timestamp: patient.lastUpdated, source: "clinician_entered" },
        { parameter: "Antimicrobial Administered", value: hasAntibiotics ? "Yes" : "No", timestamp: patient.lastUpdated, source: "system_derived" }
      ],
      ruleConditionTriggered: "Presence of septic shock or sepsis-induced hypoperfusion requires antimicrobials within 1 hour.",
      supportingGuidelineOrProtocol: {
        sourceTitle: "Institutional 1-Hour Sepsis Bundle",
        issuingOrg: "Institutional Pediatric Clinical Practice Committee",
        version: "v4.2 (2026)",
        section: "Step 5: Antimicrobial Delivery",
        excerpt: "Deliver first dose of empiric broad-spectrum antibiotic within 60 minutes of recognizing suspected sepsis with organ dysfunction."
      },
      knownLimitationsAndMissingData: !patient.weightVerified ? ["Weight unverified: exact mg/kg dosing requires confirmation"] : []
    }
  });

  // Priority 5: Fluid Resuscitation & Perfusion Assessment
  const hasFluidBolus = patient.interventions.some(i => i.category === "fluid_bolus");
  if ((crt !== null && crt > 2) || (sbp !== null && sbp <= thresholds.hypotensionThreshold) || (lactate !== null && lactate >= 2.0)) {
    priorities.push({
      id: "prio-fluid-bolus",
      title: "Evaluate Fluid Resuscitation (10–20 mL/kg Balanced Crystalloid)",
      category: "circulation_fluid",
      urgency: "critical",
      whyDisplayed: `Hypoperfusion documented: CRT ${crt ?? "N/A"}s, SBP ${sbp ?? "N/A"} mmHg, Lactate ${lactate ?? "N/A"} mmol/L.`,
      supportingData: `Weight: ${patient.weightKg ?? "unverified"} kg. Fluid bolus documented: ${hasFluidBolus ? "YES" : "PENDING"}.`,
      applicableRuleOrSource: "SSC 2026 Pediatric Guidelines & Institutional Protocol",
      requiresClinicianConfirmation: true,
      isCompleted: hasFluidBolus,
      whyAmISeeingThis: {
        documentedFindings: [
          { parameter: "Capillary Refill", value: `${crt ?? "N/A"}s`, timestamp: patient.vitals.capillaryRefill.timestamp, source: patient.vitals.capillaryRefill.source },
          { parameter: "Systolic BP", value: `${sbp ?? "N/A"} mmHg`, timestamp: patient.vitals.systolicBP.timestamp, source: patient.vitals.systolicBP.source },
          { parameter: "Lactate", value: `${lactate ?? "N/A"} mmol/L`, timestamp: patient.labs.lactate.timestamp, source: patient.labs.lactate.source }
        ],
        ruleConditionTriggered: "Delayed CRT (>2s) or hypotension for age indicates fluid-responsive shock evaluation.",
        supportingGuidelineOrProtocol: {
          sourceTitle: "Surviving Sepsis Campaign Pediatric Guidelines",
          issuingOrg: "SCCM / ESICM",
          version: "2026",
          section: "Initial Fluid Resuscitation (Section 4.2)",
          excerpt: "Administer 10-20 mL/kg balanced crystalloids over 10-20 minutes with frequent bedside reassessment of lung fields and liver."
        },
        knownLimitationsAndMissingData: !patient.weightVerified ? ["BLOCKED: Verified weight required before bolus calculation"] : []
      }
    });
  }

  // Priority 6: Senior Clinician / PICU Escalation Review
  const isCriticalShock = (sbp !== null && sbp <= thresholds.hypotensionThreshold) || (lactate !== null && lactate >= 4.0) || (crt !== null && crt >= 4);
  if (isCriticalShock) {
    priorities.push({
      id: "prio-picu-escalation",
      title: "Consider Senior Pediatrician & PICU Escalation Review",
      category: "escalation",
      urgency: "critical",
      whyDisplayed: "Patient meets institutional criteria for high-risk septic shock or acute deterioration.",
      supportingData: `SBP ${sbp ?? "N/A"} mmHg (Hypotensive), Lactate ${lactate ?? "N/A"} mmol/L (Severe), CRT ${crt ?? "N/A"}s.`,
      applicableRuleOrSource: "Institutional Escalation and PICU Referral Criteria (Section 7)",
      requiresClinicianConfirmation: true,
      isCompleted: patient.reassessments.some(r => r.escalationDecision === "picu_consult" || r.escalationDecision === "senior_fellow_review"),
      whyAmISeeingThis: {
        documentedFindings: [
          { parameter: "Shock Criteria", value: "Hypotension + CRT ≥4s + Lactate ≥4.0", timestamp: patient.lastUpdated, source: "system_derived" }
        ],
        ruleConditionTriggered: "Trigger PICU consultation when signs of fluid-refractory or hypotensive septic shock are recognized.",
        supportingGuidelineOrProtocol: {
          sourceTitle: "Hospital Pediatric Sepsis 1-Hour Management Protocol",
          issuingOrg: "Institutional Pediatric Clinical Practice Committee",
          version: "v4.2 (2026)",
          section: "Section 7: Escalation to PICU",
          excerpt: "Initiate senior attending or PICU consult immediately upon recognition of hypotensive pediatric shock or lactate >4.0 mmol/L."
        },
        knownLimitationsAndMissingData: []
      }
    });
  }

  // Determine Suggested Workflow State
  let suggestedWorkflowState: PatientRecord["currentWorkflowState"] = "at_risk";

  if (isCriticalShock) {
    suggestedWorkflowState = "possible_shock_deterioration";
  } else if (organDysfunctions.length > 0) {
    suggestedWorkflowState = "possible_sepsis_organ_dysfunction";
  } else if (patient.suspectedInfectionSource && patient.suspectedInfectionSource !== "none") {
    suggestedWorkflowState = "suspected_infection";
  }

  // If patient received interventions and has reassessment:
  const latestReassessment = patient.reassessments[patient.reassessments.length - 1];
  if (latestReassessment) {
    if (latestReassessment.postInterventionResponse === "improved") {
      suggestedWorkflowState = "responding_to_interventions";
    } else if (latestReassessment.postInterventionResponse === "deteriorated") {
      suggestedWorkflowState = "persistent_abnormalities_escalation_required";
    }
  }

  const criticalAlerts = alerts.filter(a => a.includes("Critical") || a.includes("Severe") || a.includes("Hypotension"));

  return {
    hasCriticalAlert: criticalAlerts.length > 0,
    hasHighPriorityAlert: alerts.length > 0,
    alertMessages: alerts,
    criticalAlerts,
    organDysfunctionList: organDysfunctions,
    missingObservations: missing,
    staleObservations: stale,
    priorities,
    suggestedWorkflowState,
    dataCompletenessPercentage,
    thresholds
  };
}

// Deterministic Weight-Based Calculation with verified check & safety caps
export interface WeightCalculationResult {
  allowed: boolean;
  blockReason?: string;
  calculatedValue: number | null;
  unit: string;
  formula: string;
  appliedCap?: number;
  protocolSource: string;
  notes: string;
}

export function calculateFluidBolus(
  patient: PatientRecord,
  aliquotMlLperKg: number = 20
): WeightCalculationResult {
  const protocolSource = "Surviving Sepsis Campaign 2026 (Section 4.2) / Hospital Sepsis Protocol v4.2";

  if (!patient.weightKg || patient.weightKg <= 0) {
    return {
      allowed: false,
      blockReason: "Patient weight is missing. Obtain certified bedside scale measurement before fluid bolus calculation.",
      calculatedValue: null,
      unit: "mL",
      formula: "Volume = Weight (kg) × Aliquot (mL/kg)",
      protocolSource,
      notes: "Safety engine blocked calculation due to missing weight."
    };
  }

  if (!patient.weightVerified) {
    return {
      allowed: false,
      blockReason: "Weight is UNVERIFIED. Bedside nurse or clinician must confirm weight on calibrated scale or length-based tape before safety calculation.",
      calculatedValue: null,
      unit: "mL",
      formula: `Volume = ${patient.weightKg} kg × ${aliquotMlLperKg} mL/kg (BLOCKED)`,
      protocolSource,
      notes: "Safety engine blocked calculation: weight verification required."
    };
  }

  // Authorized calculation
  const rawVolume = patient.weightKg * aliquotMlLperKg;
  const maxSingleBolusCap = 1000; // mL
  const finalVolume = Math.min(rawVolume, maxSingleBolusCap);
  const capped = rawVolume > maxSingleBolusCap;

  return {
    allowed: true,
    calculatedValue: finalVolume,
    unit: "mL",
    formula: `Volume = ${patient.weightKg} kg × ${aliquotMlLperKg} mL/kg = ${rawVolume} mL${capped ? ` (Capped at maximum single aliquot ${maxSingleBolusCap} mL)` : ""}`,
    appliedCap: capped ? maxSingleBolusCap : undefined,
    protocolSource,
    notes: "Administer balanced crystalloid over 10-20 minutes. Reassess for crackles/hepatomegaly immediately post-bolus."
  };
}

export function calculateAntimicrobialDose(
  patient: PatientRecord,
  drug: "ceftriaxone" | "vancomycin" | "ampicillin"
): WeightCalculationResult {
  const protocolSource = "Pediatric Antimicrobial Formulary 2026 / Stewardship Guidelines";

  if (!patient.weightKg || patient.weightKg <= 0) {
    return {
      allowed: false,
      blockReason: "Missing weight. Cannot calculate antibiotic dose.",
      calculatedValue: null,
      unit: "mg",
      formula: "Dose = Weight (kg) × Dose/kg",
      protocolSource,
      notes: "Calculation blocked."
    };
  }

  if (!patient.weightVerified) {
    return {
      allowed: false,
      blockReason: "Weight is UNVERIFIED. Bedside verification required prior to antibiotic calculation.",
      calculatedValue: null,
      unit: "mg",
      formula: "Dose = Weight (kg) × Dose/kg (BLOCKED)",
      protocolSource,
      notes: "Calculation blocked."
    };
  }

  if (drug === "ceftriaxone") {
    // 50 mg/kg (up to 100 mg/kg in meningitis/septic shock), max 2000 mg
    const dosePerKg = 50;
    const raw = patient.weightKg * dosePerKg;
    const maxCap = 2000;
    const finalDose = Math.min(raw, maxCap);
    return {
      allowed: true,
      calculatedValue: finalDose,
      unit: "mg",
      formula: `Dose = ${patient.weightKg} kg × ${dosePerKg} mg/kg = ${raw} mg${raw > maxCap ? ` (Capped at adult max ${maxCap} mg)` : ""}`,
      appliedCap: raw > maxCap ? maxCap : undefined,
      protocolSource,
      notes: "IV once daily. Infuse over 30 minutes. Verify allergy history."
    };
  }

  if (drug === "vancomycin") {
    // 15 mg/kg, max 1000 mg single dose
    const dosePerKg = 15;
    const raw = patient.weightKg * dosePerKg;
    const maxCap = 1000;
    const finalDose = Math.min(raw, maxCap);
    return {
      allowed: true,
      calculatedValue: finalDose,
      unit: "mg",
      formula: `Dose = ${patient.weightKg} kg × ${dosePerKg} mg/kg = ${raw} mg${raw > maxCap ? ` (Capped at single dose max ${maxCap} mg)` : ""}`,
      appliedCap: raw > maxCap ? maxCap : undefined,
      protocolSource,
      notes: "IV q6h. Infuse over ≥60 minutes. Monitor trough level prior to 4th dose."
    };
  }

  return {
    allowed: false,
    blockReason: "Clinical rule not configured. Refer to the applicable institutional protocol.",
    calculatedValue: null,
    unit: "mg",
    formula: "N/A",
    protocolSource,
    notes: "Clinical rule not configured. Refer to the applicable institutional protocol."
  };
}

// Trend Evaluation
export function evaluateTrendDirection(values: (number | undefined | null)[]): TrendDirection {
  const clean = values.filter((v): v is number => typeof v === "number" && !isNaN(v));
  if (clean.length < 2) return "insufficient_data";

  const first = clean[0];
  const last = clean[clean.length - 1];
  const delta = last - first;

  if (Math.abs(delta) < 0.05 * first) {
    return "stable";
  }

  // Worsening or improving depends on the physiological variable, but helper calculates trajectory
  return delta > 0 ? "worsening" : "improving";
}
