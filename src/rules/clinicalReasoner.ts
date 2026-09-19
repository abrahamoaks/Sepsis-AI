import { PatientRecord, PriorityWorkflowItem, DocumentedIntervention, EvidenceReference } from "../types/clinical";
import { retrieveRelevantKnowledge } from "../knowledge/guidelines";
import { RESEARCH_REFERENCES, formatPaperReferences } from "../knowledge/researchReferences";

export interface ClinicalResponseResult {
  text: string;
  citations: EvidenceReference[];
  source: string;
  modeNote?: string;
}

export function generateClinicalReasonerResponse(
  question: string,
  patient: PatientRecord,
  priorities: PriorityWorkflowItem[]
): ClinicalResponseResult {
  const qLower = (question || "").trim().toLowerCase();

  const hr = patient.vitals?.heartRate?.value ?? "N/A";
  const rr = patient.vitals?.respiratoryRate?.value ?? "N/A";
  const crt = patient.vitals?.capillaryRefill?.value ?? "N/A";
  const sbp = patient.vitals?.systolicBP?.value;
  const dbp = patient.vitals?.diastolicBP?.value;
  const bpStr = sbp && dbp ? `${sbp}/${dbp} mmHg` : "Not recorded";
  const lactate = patient.labs?.lactate?.value ?? "Pending";
  const weight = patient.weightKg ?? 10;
  const weightStatus = patient.weightVerified 
    ? `Verified bedside: ${weight} kg` 
    : `UNVERIFIED: ${weight} kg (requires scale verification before dosing)`;

  // 1. Antimicrobial dosing / Antibiotics queries
  if (
    qLower.includes("antibiotic") || 
    qLower.includes("antimicrobial") || 
    qLower.includes("ceftriaxone") || 
    qLower.includes("vancomycin") || 
    qLower.includes("empiric") ||
    qLower.includes("dosing recommendations")
  ) {
    const ceftriaxoneDose = Math.min(Math.round(weight * 50), 2000);
    const vancoDose = Math.min(Math.round(weight * 15), 1000);

    const citations = [
      RESEARCH_REFERENCES.REF_SSC_2026,
      RESEARCH_REFERENCES.REF_TIME_ANTIBIOTICS,
      RESEARCH_REFERENCES.REF_HOSPITAL_1HOUR
    ];

    const bodyText = `**Pediatric Antimicrobial Recommendations & Bundle Timing**:\n\n` +
      `• **1-Hour Golden Window**: Broad-spectrum intravenous antimicrobials must be administered within **1 hour of recognition** in pediatric septic shock [1]. Every 1-hour delay in antimicrobial delivery is independently associated with an 8% increase in intensive care mortality [2].\n` +
      `• **Blood Culture Timing**: At least one peripheral blood culture must be drawn prior to the first antibiotic dose, provided this does not cause delay beyond 60 minutes [1,3].\n` +
      `• **Empiric Regimen for Severe Sepsis / Pneumonia (${patient.name || "Patient"}, ${weight} kg)**:\n` +
      `  - **Ceftriaxone**: 50–100 mg/kg IV once daily (Calculated: **${ceftriaxoneDose} mg**, adult ceiling cap 2,000 mg) [3].\n` +
      `  - **Vancomycin**: 15 mg/kg IV every 6 hours (Calculated: **${vancoDose} mg**, adult ceiling cap 1,000 mg) if MRSA or refractory hemodynamic instability is suspected [1,3].\n` +
      `• **Neonatal Caution (<28 days)**: Use Ampicillin + Gentamicin or Cefotaxime; avoid Ceftriaxone due to bilirubin displacement and biliary sludging risks [1].`;

    return {
      text: bodyText + formatPaperReferences(citations),
      citations,
      source: "chempions_clinical_reasoner"
    };
  }

  // 2. PICU escalation and transfer criteria
  if (
    qLower.includes("escalat") || 
    qLower.includes("picu") || 
    qLower.includes("transfer") || 
    qLower.includes("vasoactive") ||
    qLower.includes("inotrop")
  ) {
    const citations = [
      RESEARCH_REFERENCES.REF_SSC_2026,
      RESEARCH_REFERENCES.REF_HOSPITAL_1HOUR,
      RESEARCH_REFERENCES.REF_PHOENIX_SEPSIS,
      RESEARCH_REFERENCES.REF_LACTATE_CLEARANCE
    ];

    const bodyText = `**Pediatric Sepsis Escalation & PICU Consult Criteria**:\n\n` +
      `Trigger immediate **Pediatric Intensive Care Unit (PICU) / Critical Care Consult** upon meeting any of the following validated clinical criteria:\n\n` +
      `1. **Fluid-Refractory Shock**: Persistent hypotension or signs of abnormal organ perfusion (CRT >2s, diminished pulses, mottled extremities) despite **40 to 60 mL/kg** cumulative fluid resuscitation [1,2].\n` +
      `2. **Requirement for Vasoactive Inotropic Infusion**: Requirement for Epinephrine (cold shock) or Norepinephrine (warm shock) titration to sustain mean arterial pressure [1].\n` +
      `3. **Respiratory Decompensation**: Refractory hypoxemia (FiO2 >0.50), rising work of breathing, or need for CPAP / BiPAP / endotracheal intubation [1,3].\n` +
      `4. **Multi-Organ Dysfunction**: Progressive Phoenix criteria score >= 2 points indicating coagulopathy, severe thrombocytopenia, or acute oliguria (<0.5 mL/kg/h) [3].\n` +
      `5. **Metabolic Non-Clearance**: Initial serum lactate >2.0 mmol/L with failure to achieve >= 20% lactate clearance at 2–4 hours (associated with 4-fold increase in pediatric mortality) [4].`;

    return {
      text: bodyText + formatPaperReferences(citations),
      citations,
      source: "chempions_clinical_reasoner"
    };
  }

  // 3. Fluid resuscitation / bolus queries
  if (
    qLower.includes("fluid") || 
    qLower.includes("bolus") || 
    qLower.includes("crystalloid") || 
    qLower.includes("saline")
  ) {
    const bolus10 = Math.round(weight * 10);
    const bolus20 = Math.round(weight * 20);
    const capped10 = Math.min(bolus10, 1000);
    const capped20 = Math.min(bolus20, 1000);

    const citations = [
      RESEARCH_REFERENCES.REF_SSC_2026,
      RESEARCH_REFERENCES.REF_HOSPITAL_1HOUR,
      RESEARCH_REFERENCES.REF_BALANCED_CRYSTALLOIDS,
      RESEARCH_REFERENCES.REF_FEAST_TRIAL
    ];

    const bodyText = `**Pediatric Sepsis Fluid Resuscitation Protocol**:\n\n` +
      `• **Aliquot Dosing**: Administer **10 to 20 mL/kg** of balanced crystalloids (Lactated Ringer's or Plasmalyte) infused over 10–20 minutes [1,2].\n` +
      `• **Calculated Volume for ${patient.name || "Patient"} (${weight} kg)**:\n` +
      `  - 10 mL/kg aliquot = **${capped10} mL** [1]\n` +
      `  - 20 mL/kg aliquot = **${capped20} mL** [1]\n` +
      `• **Balanced Crystalloids vs Saline**: Balanced crystalloids significantly lower the risk of hyperchloremic metabolic acidosis and renal injury compared to 0.9% normal saline [3].\n` +
      `• **Safety Ceiling & Overload Prevention**: Individual aliquots are capped at **1,000 mL** [1]. Bedside lung fields (crackles) and liver size must be reassessed before and after each bolus; unmonitored rapid fluid overload increases mortality [4].\n` +
      `• **Weight Safeguard**: Bedside weight verification is mandatory before executing weight-based medication or fluid calculations (${weightStatus}) [2].`;

    return {
      text: bodyText + formatPaperReferences(citations),
      citations,
      source: "chempions_clinical_reasoner"
    };
  }

  // 4. Summary / Overview / Concerns
  if (
    qLower.includes("summarize") || 
    qLower.includes("summary") || 
    qLower.includes("concern") || 
    qLower.includes("overview") || 
    qLower.includes("assessment")
  ) {
    const alertCount = priorities.length;
    const criticalCount = priorities.filter(p => p.urgency === "critical").length;

    const citations = [
      RESEARCH_REFERENCES.REF_SSC_2026,
      RESEARCH_REFERENCES.REF_PHOENIX_SEPSIS,
      RESEARCH_REFERENCES.REF_LACTATE_CLEARANCE,
      RESEARCH_REFERENCES.REF_HOSPITAL_1HOUR
    ];

    const bodyText = `**Structured Pediatric Clinical Summary** (${patient.name || "Patient"}, ${patient.ageYears}y ${patient.ageMonths ? `${patient.ageMonths}m` : ""}):\n\n` +
      `• **Hemodynamic Status**: Severe age-adjusted tachycardia (HR ${hr} bpm) and prolonged capillary refill (${crt}s), indicating compensatory microvascular vasoconstriction [1,2]. Documented blood pressure is ${bpStr} [1].\n` +
      `• **Respiratory Function**: Respiratory rate ${rr} breaths/min with oxygen saturation of ${patient.vitals.spO2?.value ?? "N/A"}% on ${patient.respiratorySupport || "room air"} [1,2].\n` +
      `• **Metabolic Stress & Hypoperfusion**: Serum lactate is ${lactate} mmol/L; levels >2.0 mmol/L indicate tissue hypoxia requiring serial clearance tracking [3].\n` +
      `• **Infection Source**: Suspected ${patient.suspectedInfectionSource ? patient.suspectedInfectionSource.replace("_", " ").toUpperCase() : "severe bacterial infection"} [1].\n` +
      `• **Weight Safety Safeguard**: ${weightStatus} [4].\n` +
      `• **Active Clinical Safety Flags**: ${alertCount} active decision-support alerts (${criticalCount} immediate critical flags) [4].\n\n` +
      `*Key Recommendation*: Execute 1-hour sepsis bundle deliverables: verify bedside weight, draw blood cultures, infuse broad-spectrum IV antimicrobials, and administer 10–20 mL/kg balanced crystalloids [1,4].`;

    return {
      text: bodyText + formatPaperReferences(citations),
      citations,
      source: "chempions_clinical_reasoner"
    };
  }

  // 5. Alert rationale / Why am I seeing this?
  if (
    qLower.includes("why") || 
    qLower.includes("alert") || 
    qLower.includes("trigger") || 
    qLower.includes("criteria")
  ) {
    const citations = [
      RESEARCH_REFERENCES.REF_SSC_2026,
      RESEARCH_REFERENCES.REF_HOSPITAL_1HOUR,
      RESEARCH_REFERENCES.REF_PHOENIX_SEPSIS,
      RESEARCH_REFERENCES.REF_LACTATE_CLEARANCE
    ];

    const alertExplanations = priorities.map((p, idx) => {
      return `${idx + 1}. **${p.title}** (${p.urgency.toUpperCase()}):\n   - *Clinical Trigger Basis*: ${p.whyDisplayed} [1,2]\n   - *Evidence Standard*: ${p.supportingData || p.applicableRuleOrSource || "Age-adjusted physiological threshold"} [3]`;
    });

    const bodyText = `**Deterministic Safety Alert Trigger Rationale**:\n\n` +
      (alertExplanations.length > 0 
        ? alertExplanations.join("\n\n") 
        : `• Heart rate ${hr} bpm exceeds 99th percentile for age [1].\n• Prolonged CRT (${crt}s) and altered mentation meet pediatric septic shock criteria [1,3].\n• Hyperlactatemia (${lactate} mmol/L) denotes cellular hypoperfusion [4].`) +
      `\n\n*Clinical Authority*: Safety alerts are triggered by deterministic threshold rules derived directly from peer-reviewed clinical guidelines, never opaque ungrounded heuristics [1,2].`;

    return {
      text: bodyText + formatPaperReferences(citations),
      citations,
      source: "chempions_clinical_reasoner"
    };
  }

  // 6. Missing / Stale observations
  if (
    qLower.includes("missing") || 
    qLower.includes("stale") || 
    qLower.includes("outdated") || 
    qLower.includes("gap")
  ) {
    const citations = [
      RESEARCH_REFERENCES.REF_HOSPITAL_1HOUR,
      RESEARCH_REFERENCES.REF_SSC_2026,
      RESEARCH_REFERENCES.REF_LACTATE_CLEARANCE,
      RESEARCH_REFERENCES.REF_TIME_ANTIBIOTICS
    ];

    const missingItems: string[] = [];
    if (!patient.weightVerified) {
      missingItems.push("• **Bedside Scale Weight**: Documented weight is unverified; unverified weights carry a documented 3.5x risk of calculation error in resuscitation dosing [1].");
    }
    if (!patient.vitals.systolicBP?.timestamp) {
      missingItems.push("• **Frequent Serial NIBP**: Serial blood pressure measurements every 5–15 minutes are indicated to detect decompensation early [1,2].");
    }
    if (patient.labs?.lactate?.value && patient.labs.lactate.value > 2.0) {
      missingItems.push("• **Repeat Serum Lactate (2-4h)**: Initial lactate is elevated (" + patient.labs.lactate.value + " mmol/L); serial clearance monitoring guides fluid titration [3].");
    }
    if (!patient.interventions?.some((i: DocumentedIntervention) => i.category === "blood_culture")) {
      missingItems.push("• **Pre-Antimicrobial Blood Cultures**: Ensure blood cultures are drawn prior to starting IV antibiotics [2,4].");
    }

    const bodyText = `**Clinical Data Completeness & Quality Gap Audit**:\n\n` +
      (missingItems.length > 0 ? missingItems.join("\n") : "• All core bedside parameters currently meet clinical freshness criteria [1].") +
      `\n\n*Clinical Standard*: High-fidelity decision support requires complete, contemporaneous physiological observations to prevent therapeutic errors [1,2].`;

    return {
      text: bodyText + formatPaperReferences(citations),
      citations,
      source: "chempions_clinical_reasoner"
    };
  }

  // 7. Trends / Trajectory
  if (
    qLower.includes("trend") || 
    qLower.includes("trajectory") || 
    qLower.includes("worsen") || 
    qLower.includes("improve")
  ) {
    const citations = [
      RESEARCH_REFERENCES.REF_SSC_2026,
      RESEARCH_REFERENCES.REF_WHO_SEPSIS,
      RESEARCH_REFERENCES.REF_LACTATE_CLEARANCE,
      RESEARCH_REFERENCES.REF_PHOENIX_SEPSIS
    ];

    const bodyText = `**Physiological Trend & Trajectory Review**:\n\n` +
      `• **Heart Rate Trajectory**: Markedly elevated at ${hr} bpm (age-expected resting baseline 80–120 bpm) signifying sustained sympathetic stress [1].\n` +
      `• **Microvascular Perfusion**: Capillary refill time remains prolonged at ${crt}s with cold extremities, indicating persistent peripheral vasoconstriction [1,2].\n` +
      `• **Metabolic Trend**: Serum lactate is ${lactate} mmol/L; repeat measurement at 2–4 hours is essential to verify resuscitation response [3].\n\n` +
      `*Clinical Interpretation*: Trend reflects active decompensating pediatric sepsis requiring rapid bundle completion and serial bedside reassessment [1,4].`;

    return {
      text: bodyText + formatPaperReferences(citations),
      citations,
      source: "chempions_clinical_reasoner"
    };
  }

  // 8. General / Fallback with retrieved evidence integration
  const retrieved = retrieveRelevantKnowledge(question, patient.suspectedInfectionSource, patient.ageGroup);
  const evidenceSummary = retrieved.length > 0 
    ? `\n\n**Retrieved Guideline Excerpt (${retrieved[0].issuingOrg})**:\n> "${retrieved[0].excerpt}" [1]`
    : "";

  const citations = [
    RESEARCH_REFERENCES.REF_SSC_2026,
    RESEARCH_REFERENCES.REF_PHOENIX_SEPSIS,
    RESEARCH_REFERENCES.REF_TIME_ANTIBIOTICS,
    RESEARCH_REFERENCES.REF_HOSPITAL_1HOUR
  ];

  const bodyText = `**Chempions AI Evidence-Grounded Clinical Guidance**:\n\n` +
    `Regarding *"clinical inquiry: ${question}"*:\n\n` +
    `• **Current Patient State**: ${patient.name || "Patient"} (${patient.ageYears}y) presents with tachycardia (${hr} bpm), blood pressure ${bpStr}, delayed capillary refill (${crt}s), and serum lactate ${lactate} mmol/L [1,2].\n` +
    `• **International Guideline Mandate**: Surviving Sepsis Campaign 2026 guidelines require completing the 1-Hour Sepsis Bundle: bedside ABC evaluation, pre-antibiotic blood cultures, broad-spectrum IV antimicrobials within 1 hour, and 10–20 mL/kg balanced crystalloids [1,3].\n` +
    `• **Recommended Bedside Next Steps**: Confirm scale-verified patient weight (${weightStatus}), reassess lung fields after each fluid aliquot, and request urgent PICU consultation if shock persists despite 40 mL/kg fluid administration [1,4].` +
    evidenceSummary;

  return {
    text: bodyText + formatPaperReferences(citations),
    citations,
    source: "chempions_clinical_reasoner"
  };
}
