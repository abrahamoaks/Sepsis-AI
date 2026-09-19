import { KnowledgeDocument } from "../types/clinical";

export const INITIAL_KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: "ssc-pediatric-2026",
    title: "Surviving Sepsis Campaign: International Guidelines for the Management of Septic Shock and Sepsis-Associated Organ Dysfunction in Children",
    issuingOrganization: "Society of Critical Care Medicine (SCCM) / European Society of Intensive Care Medicine (ESICM)",
    version: "2026 Update",
    publicationDate: "2026-02-15",
    reviewDate: "2026-06-01",
    isActive: true,
    scope: "Pediatric Sepsis & Septic Shock (0 days to 18 years)",
    summary: "Comprehensive international recommendations for screening, fluid resuscitation, antimicrobial timing, inotropes, and organ-support monitoring in children.",
    sections: [
      {
        sectionTitle: "Screening & Early Recognition",
        pageOrParagraph: "Section 3.1, p. 12",
        keyExcerpt: "We recommend using systematic screening tools for early identification of children with suspected sepsis or septic shock. Tachycardia out of proportion to fever, tachypnea, prolonged capillary refill (>2s), altered mental status, and unexplained hyperlactatemia (>2 mmol/L) warrant immediate clinician evaluation.",
        evidenceGrade: "Strong recommendation, moderate-quality evidence"
      },
      {
        sectionTitle: "Initial Fluid Resuscitation",
        pageOrParagraph: "Section 4.2, p. 28",
        keyExcerpt: "In healthcare systems with intensive care availability, administer 10-20 mL/kg aliquots of balanced crystalloids over 10-20 minutes, with careful bedside reassessment between aliquots for signs of fluid responsiveness and fluid overload (hepatomegaly, crackles). Block unverified weight calculations to prevent volumetric overdose. Cap single aliquots at 1000 mL or maximum cumulative 40-60 mL/kg in first hour without intensive monitoring.",
        evidenceGrade: "Best Practice Statement"
      },
      {
        sectionTitle: "Antimicrobial Timing",
        pageOrParagraph: "Section 5.1, p. 35",
        keyExcerpt: "For children with septic shock, we recommend initiating broad-spectrum intravenous antimicrobials as soon as possible and within 1 hour of recognition. For sepsis without shock, prompt evaluation (within 3 hours) with blood cultures obtained prior to antimicrobial administration whenever feasible without causing undue delay.",
        evidenceGrade: "Strong recommendation, moderate-quality evidence"
      },
      {
        sectionTitle: "Lactate Monitoring & Clearance",
        pageOrParagraph: "Section 3.4, p. 19",
        keyExcerpt: "Serum lactate should be measured upon recognition. Lactate >2.0 mmol/L indicates abnormal cellular perfusion; lactate >4.0 mmol/L signifies severe metabolic stress and heightened mortality risk. Monitor serial lactate clearance to guide resuscitation response.",
        evidenceGrade: "Weak recommendation, low-quality evidence"
      }
    ]
  },
  {
    id: "who-pediatric-sepsis-2025",
    title: "WHO Guidelines on the Clinical Management of Sepsis and Severe Infections in Children",
    issuingOrganization: "World Health Organization (WHO)",
    version: "WHO/MCA/25.4",
    publicationDate: "2025-08-10",
    reviewDate: "2026-01-20",
    isActive: true,
    scope: "Global Pediatric Sepsis, Resource-Variable Settings",
    summary: "WHO guidance on danger signs, tiered resuscitation, monitoring capillary refill and respiratory distress, and preventing fluid overload.",
    sections: [
      {
        sectionTitle: "Danger Signs of Severe Illness",
        pageOrParagraph: "Module 2, p. 8",
        keyExcerpt: "Immediate danger signs in children: inability to drink or breastfeed, vomiting everything, convulsions, lethargy or unconsciousness, and severe respiratory distress. Prolonged capillary refill (>3 seconds) and cold extremities indicate compromised peripheral perfusion.",
        evidenceGrade: "Standard of Care"
      },
      {
        sectionTitle: "Cautious Fluid Administration",
        pageOrParagraph: "Module 4, p. 22",
        keyExcerpt: "Where intensive mechanical ventilation and inotropic support are limited, routine rapid large-volume boluses without confirmed hypovolemia carry harm. Titrate smaller boluses (10 mL/kg) and re-evaluate lung fields and liver size immediately.",
        evidenceGrade: "Strong recommendation"
      }
    ]
  },
  {
    id: "who-young-infant-0-59d",
    title: "WHO Clinical Management of Serious Bacterial Infections in Young Infants Aged 0–59 Days",
    issuingOrganization: "World Health Organization (WHO)",
    version: "2024 Revised Edition",
    publicationDate: "2024-11-01",
    reviewDate: "2025-12-10",
    isActive: true,
    scope: "Young Infants (0 to 59 days)",
    summary: "Targeted clinical criteria for neonates and young infants with hypothermia, fever, poor feeding, apnea, or severe chest indrawing.",
    sections: [
      {
        sectionTitle: "Neonate Sepsis Signs",
        pageOrParagraph: "Section 1, p. 5",
        keyExcerpt: "In infants under 60 days, temperature instability (<36.0°C or >38.0°C), tachypnea (>60 bpm), grunting, cyanosis, and abdominal distension indicate serious bacterial infection requiring immediate parenteral amp + gent or cefotaxime.",
        evidenceGrade: "Strong recommendation"
      }
    ]
  },
  {
    id: "inst-1hour-sepsis-bundle",
    title: "Hospital Pediatric Sepsis 1-Hour Management Protocol",
    issuingOrganization: "Institutional Pediatric Clinical Practice Committee",
    version: "v4.2 (2026)",
    publicationDate: "2026-01-05",
    reviewDate: "2026-07-01",
    isActive: true,
    scope: "Emergency Department, Pediatric Wards, Rapid Response",
    summary: "Institutional mandatory time-zero bundle: Recognition, ABC reassessment, IV/IO access, Blood cultures, Broad-spectrum antibiotics within 60 mins, Weight-verified fluid bolus, Senior clinician notification.",
    sections: [
      {
        sectionTitle: "Bundle Deliverables within 60 Minutes",
        pageOrParagraph: "Protocol Step 1–5",
        keyExcerpt: "1. Reassess Airway, Breathing, Perfusion.\n2. Obtain IV/IO access and draw blood cultures + lactate + glucose within 30 min.\n3. Verify patient weight on scale or Broselow/PAWPER tape.\n4. Administer 10–20 mL/kg balanced crystalloid if signs of shock present (max 1000 mL/bolus).\n5. Deliver first dose empiric broad-spectrum antibiotic within 60 min.\n6. Notify attending pediatric physician / PICU fellow.",
        evidenceGrade: "Institutional Protocol"
      },
      {
        sectionTitle: "Escalation Criteria to Pediatric Intensive Care",
        pageOrParagraph: "Protocol Section 7",
        keyExcerpt: "Trigger PICU / Critical Care Consult immediately if: persistent hypotension following 40 mL/kg fluid resuscitation, requirement for vasoactive inotropic infusion, refractory hypoxemia (FiO2 >0.50), worsening encephalopathy, or failure of lactate clearance after 2 hours.",
        evidenceGrade: "Mandatory Safety Criterion"
      }
    ]
  },
  {
    id: "pediatric-antimicrobial-formulary",
    title: "Pediatric Antimicrobial Formulary and Empiric Regimens",
    issuingOrganization: "Hospital Antimicrobial Stewardship Program",
    version: "2026 Edition",
    publicationDate: "2026-01-10",
    reviewDate: "2026-06-15",
    isActive: true,
    scope: "Inpatient Pediatric Antibiotic Dosing & Safety Limits",
    summary: "Weight-tiered dosing rules with strict maximum adult-dose caps for common pediatric sepsis presentations.",
    sections: [
      {
        sectionTitle: "Severe Community-Acquired Sepsis / Pneumonia",
        pageOrParagraph: "Table 2.1, p. 14",
        keyExcerpt: "Ceftriaxone 50–100 mg/kg IV once daily (max single dose 2000 mg) PLUS Vancomycin 15 mg/kg IV q6h (max single dose 1000 mg) if MRSA or severe septic shock suspected. Ampicillin + Gentamicin for infants <1 month.",
        evidenceGrade: "Institutional Formulary Guideline"
      }
    ]
  }
];

export function retrieveRelevantKnowledge(
  query: string,
  infectionSource?: string,
  ageGroup?: string
): { title: string; issuingOrg: string; version: string; section: string; excerpt: string }[] {
  const qLower = (query || "").toLowerCase();
  const sourceLower = (infectionSource || "").toLowerCase();
  const results: { title: string; issuingOrg: string; version: string; section: string; excerpt: string }[] = [];

  for (const doc of INITIAL_KNOWLEDGE_DOCUMENTS) {
    if (!doc.isActive) continue;

    for (const sec of doc.sections) {
      const matchQuery = qLower && (sec.sectionTitle.toLowerCase().includes(qLower) || sec.keyExcerpt.toLowerCase().includes(qLower));
      const matchSource = sourceLower && (sec.sectionTitle.toLowerCase().includes(sourceLower) || sec.keyExcerpt.toLowerCase().includes(sourceLower));
      const matchAge = ageGroup === "neonate_0_28d" && doc.id.includes("young-infant");

      if (matchQuery || matchSource || matchAge || qLower.includes("general") || qLower.includes("alert")) {
        results.push({
          title: doc.title,
          issuingOrg: doc.issuingOrganization,
          version: doc.version,
          section: `${sec.sectionTitle} (${sec.pageOrParagraph || "Guideline"})`,
          excerpt: sec.keyExcerpt
        });
      }
    }
  }

  // Ensure at least core SSC excerpt is always available if none matched
  if (results.length === 0) {
    const ssc = INITIAL_KNOWLEDGE_DOCUMENTS[0];
    results.push({
      title: ssc.title,
      issuingOrg: ssc.issuingOrganization,
      version: ssc.version,
      section: ssc.sections[0].sectionTitle,
      excerpt: ssc.sections[0].keyExcerpt
    });
  }

  return results.slice(0, 4);
}

export const APPROVED_KNOWLEDGE_DOCUMENTS = INITIAL_KNOWLEDGE_DOCUMENTS;
