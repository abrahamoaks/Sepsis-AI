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
  const lactate = patient.labs?.lactate?.value ?? "Pending";
  const weight = patient.weightKg ?? 14.2;
  const isVerified = Boolean(patient.weightVerified);

  const citations = [
    RESEARCH_REFERENCES.REF_SSC_2026,
    RESEARCH_REFERENCES.REF_PHOENIX_SEPSIS,
    RESEARCH_REFERENCES.REF_HOSPITAL_1HOUR
  ];

  // 1. Antimicrobial dosing / Antibiotics queries
  if (
    qLower.includes("antibiotic") || 
    qLower.includes("antimicrobial") || 
    qLower.includes("ceftriaxone") || 
    qLower.includes("dose") || 
    qLower.includes("dosing")
  ) {
    const ceftriaxoneDose = Math.min(Math.round(weight * 50), 2000);
    const vancoDose = Math.min(Math.round(weight * 15), 1000);

    const bodyText = `### 1. Immediate Action Plan
1. **Bedside Scale Verification**: ${isVerified ? `Confirmed scale weight ${weight} kg [3].` : `Scale weight UNVERIFIED. Obtain digital scale weight prior to infusion [3].`}
2. **Pre-Antibiotic Blood Cultures**: Draw 2 peripheral sets immediately (do not delay antibiotic >45 min) [1].
3. **Empiric IV Ceftriaxone**: Administer **${ceftriaxoneDose} mg IV** (50 mg/kg for ${weight} kg) infused over 30 min stat [1,3].
4. **Second-Line Staph/MRSA Coverage**: Add Vancomycin **${vancoDose} mg IV** (15 mg/kg) if toxic appearance or central line present [1].

### 2. Clinical Follow-Up Questions
1. Does the patient have any documented cephalosporin or beta-lactam anaphylaxis history?
2. Has the child received any pre-hospital antibiotics within the last 24 hours?
3. Are blood culture bottles inoculated and barcodes scanned for the laboratory?`;

    return {
      text: bodyText + formatPaperReferences(citations),
      citations,
      source: "chempions_clinical_reasoner"
    };
  }

  // 2. Fluid resuscitation / bolus queries
  if (
    qLower.includes("fluid") || 
    qLower.includes("bolus") || 
    qLower.includes("crystalloid") || 
    qLower.includes("saline")
  ) {
    const bolus10 = Math.min(Math.round(weight * 10), 1000);
    const bolus20 = Math.min(Math.round(weight * 20), 1000);

    const bodyText = `### 1. Immediate Action Plan
1. **Bedside Weight Lock**: Verify ${weight} kg scale weight before volumetric push [3].
2. **Targeted Balanced Crystalloid Bolus**: Infuse **${bolus10}–${bolus20} mL** (10–20 mL/kg Plasmalyte or LR) via pressure bag over 15–20 min [1,2].
3. **Serial Perfusion Checks**: Re-evaluate capillary refill time, heart rate, and liver edge at 5-minute intervals during infusion [1].
4. **Fluid-Overload Stop Criteria**: Discontinue fluid bolus if new bibasilar crackles or liver edge enlargement >2 cm occurs [1,3].

### 2. Clinical Follow-Up Questions
1. What is the current liver span and are lung bases clear to auscultation?
2. Did distal pulses improve and capillary refill decrease to ≤2 seconds after the bolus?
3. Is peripheral IV flow adequate, or is an intraosseous needle required?`;

    return {
      text: bodyText + formatPaperReferences(citations),
      citations,
      source: "chempions_clinical_reasoner"
    };
  }

  // 3. PICU escalation and transfer criteria
  if (
    qLower.includes("escalat") || 
    qLower.includes("picu") || 
    qLower.includes("transfer") || 
    qLower.includes("vasoactive")
  ) {
    const bodyText = `### 1. Immediate Action Plan
1. **PICU Emergency Consult Stat**: Page on-call pediatric intensivist for acute shock resuscitation in ED Resus Bay [1,2].
2. **Prepare Peripheral Epinephrine**: If fluid-refractory after 40–60 mL/kg, initiate Epinephrine infusion at 0.05–0.1 mcg/kg/min [1].
3. **Advanced Airway & Vascular Access**: Prepare high-flow nasal cannula / non-invasive positive pressure and second large-bore IV/IO line [1].
4. **Serial Lactate Clearance Tracking**: Repeat POC lactate within 2 hours to confirm downward trend [2,3].

### 2. Clinical Follow-Up Questions
1. Does the patient exhibit ongoing signs of cold shock (cool peripheries, weak femoral pulses) despite fluids?
2. What is the current urine output per kilogram per hour (<1 mL/kg/h indicates hypoperfusion)?
3. Is second-line invasive arterial line monitoring ready for transport?`;

    return {
      text: bodyText + formatPaperReferences(citations),
      citations,
      source: "chempions_clinical_reasoner"
    };
  }

  // Default general clinical inquiry (overview / summary / next steps)
  const bolus10 = Math.min(Math.round(weight * 10), 1000);
  const bolus20 = Math.min(Math.round(weight * 20), 1000);
  const ceftriaxoneDose = Math.min(Math.round(weight * 50), 2000);

  const bodyText = `### 1. Immediate Action Plan
1. **Safety Lock Weight Verification**: Verify scale weight (${weight} kg) before medication calculation [3].
2. **High-Flow O2 Delivery**: Place high-flow nasal cannula or non-rebreather to maintain SpO2 ≥ 95% and unload work of breathing [1].
3. **Emergency Pre-Antibiotic Blood Cultures**: Draw 2 sets peripheral blood cultures + POC lactate stat [1,2].
4. **Empiric IV Ceftriaxone**: Infuse **${ceftriaxoneDose} mg IV** (50 mg/kg) within 60 minutes of Time-Zero [1,3].
5. **Balanced Crystalloid Bolus**: Push **${bolus10}–${bolus20} mL** (10–20 mL/kg) over 15–20 min with continuous cardiac monitoring [1].
6. **PICU Bedside Notification**: Alert pediatric critical care team of active resus patient [1,2].

### 2. Clinical Follow-Up Questions
1. What is the current work of breathing and mental status response to oxygen?
2. Following the initial fluid bolus, has capillary refill normalized (<2 seconds)?
3. Are there any known medication allergies or underlying immune deficiencies?`;

  return {
    text: bodyText + formatPaperReferences(citations),
    citations,
    source: "chempions_clinical_reasoner"
  };
}
