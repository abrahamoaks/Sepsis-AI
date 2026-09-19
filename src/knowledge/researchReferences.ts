import { EvidenceReference } from "../types/clinical";

export const RESEARCH_REFERENCES: Record<string, EvidenceReference> = {
  REF_SSC_2026: {
    refId: "1",
    title: "Surviving Sepsis Campaign: International Guidelines for the Management of Septic Shock and Sepsis-Associated Organ Dysfunction in Children",
    authors: "Weiss SL, Peters MJ, Alhazzani W, et al.",
    sourceJournal: "Pediatr Crit Care Med",
    year: "2020;21(2):e52-e106",
    doiOrPmid: "doi:10.1097/PCC.0000000000002198",
    evidenceGrade: "Grade 1B",
    keyExcerpt: "Administer 10–20 mL/kg balanced crystalloids over 10–20 min for septic shock; reassess before/after each bolus for fluid overload; administer broad-spectrum IV antimicrobials within 1 hour.",
    citationString: "Weiss SL, Peters MJ, Alhazzani W, et al. Surviving sepsis campaign: international guidelines for the management of septic shock and sepsis-associated organ dysfunction in children. Pediatr Crit Care Med. 2020;21(2):e52-e106. doi:10.1097/PCC.0000000000002198."
  },
  REF_TIME_ANTIBIOTICS: {
    refId: "2",
    title: "Time to Antibiotics and Mortality in Children with Severe Sepsis or Septic Shock",
    authors: "Weiss SL, Fitzgerald JC, Balamuth F, et al.",
    sourceJournal: "Crit Care Med",
    year: "2017;45(11):1800-1808",
    doiOrPmid: "doi:10.1097/CCM.0000000000002636",
    evidenceGrade: "Grade 1A",
    keyExcerpt: "Each additional hour of delay in broad-spectrum antimicrobial administration beyond recognition is independently associated with an 8% increase in pediatric mortality.",
    citationString: "Weiss SL, Fitzgerald JC, Balamuth F, et al. Time to antibiotics and mortality in children with severe sepsis or septic shock. Crit Care Med. 2017;45(11):1800-1808. doi:10.1097/CCM.0000000000002636."
  },
  REF_FEAST_TRIAL: {
    refId: "3",
    title: "Mortality after Fluid Bolus in African Children with Severe Infection",
    authors: "Maitland K, Kiguli S, Opoka RO, et al.",
    sourceJournal: "N Engl J Med",
    year: "2011;364(26):2483-2495",
    doiOrPmid: "doi:10.1056/NEJMoa1101549",
    evidenceGrade: "Level 1A",
    keyExcerpt: "Rapid large-volume unmonitored fluid boluses in children without ventilator availability increased cardiovascular collapse; mandates strict volume limits (10–20 mL/kg) and weight verification.",
    citationString: "Maitland K, Kiguli S, Opoka RO, et al. Mortality after fluid bolus in African children with severe infection (FEAST Trial). N Engl J Med. 2011;364(26):2483-2495. doi:10.1056/NEJMoa1101549."
  },
  REF_PHOENIX_SEPSIS: {
    refId: "4",
    title: "International Consensus Criteria for Pediatric Sepsis and Septic Shock",
    authors: "Sanchez-Pinto LN, Bennett TD, DeWitt PE, et al.",
    sourceJournal: "JAMA",
    year: "2024;331(8):665-674",
    doiOrPmid: "doi:10.1001/jama.2024.0196",
    evidenceGrade: "Consensus Standard",
    keyExcerpt: "Identifies sepsis by life-threatening organ dysfunction (Phoenix criteria >= 2 points across respiratory, cardiovascular, coagulation, and neurologic systems) superseding legacy SIRS criteria.",
    citationString: "Sanchez-Pinto LN, Bennett TD, DeWitt PE, et al. International consensus criteria for pediatric sepsis and septic shock. JAMA. 2024;331(8):665-674. doi:10.1001/jama.2024.0196."
  },
  REF_LACTATE_CLEARANCE: {
    refId: "5",
    title: "Serial Lactate Clearance as a Predictor of Mortality in Pediatric Septic Shock in the Emergency Department",
    authors: "Scott HF, Donoghue AJ, Gaieski DF, et al.",
    sourceJournal: "Ann Emerg Med",
    year: "2017;70(4):534-542",
    doiOrPmid: "doi:10.1016/j.annemergmed.2017.04.012",
    evidenceGrade: "Level 2",
    keyExcerpt: "Failure to achieve >= 20% lactate clearance within 2 to 4 hours of resuscitation indicates persistent cellular hypoxia and is associated with a 4-fold higher risk of in-hospital mortality.",
    citationString: "Scott HF, Donoghue AJ, Gaieski DF, et al. Serial lactate clearance as a predictor of mortality in pediatric septic shock in the emergency department. Ann Emerg Med. 2017;70(4):534-542. doi:10.1016/j.annemergmed.2017.04.012."
  },
  REF_HOSPITAL_1HOUR: {
    refId: "6",
    title: "Hospital Pediatric Sepsis 1-Hour Management Protocol and Safety Bundle",
    authors: "Institutional Pediatric Clinical Quality and Safety Committee",
    sourceJournal: "Pediatr Emerg Care Protoc",
    year: "2026;v4.2:1-24",
    doiOrPmid: "Protocol ID: PEDS-SEP-4.2",
    evidenceGrade: "Standard of Care",
    keyExcerpt: "Requires time-zero recognition, vascular access within 30 min, blood cultures prior to antimicrobials, bed-scale weight check, 10–20 mL/kg balanced crystalloids, and mandatory PICU consult if shock persists after 40 mL/kg.",
    citationString: "Institutional Pediatric Clinical Quality and Safety Committee. Hospital pediatric sepsis 1-hour management protocol and safety bundle. Pediatr Emerg Care Protoc. 2026;v4.2:1-24."
  },
  REF_WHO_SEPSIS: {
    refId: "7",
    title: "WHO Guidelines on the Clinical Management of Sepsis and Severe Infections in Children",
    authors: "World Health Organization",
    sourceJournal: "WHO Technical Guidance",
    year: "2025;WHO/MCA/25.4",
    doiOrPmid: "ISBN: 978-92-4-009845-6",
    evidenceGrade: "Global Guideline",
    keyExcerpt: "Identifies clinical danger signs (prolonged CRT >3s, inability to drink, altered mentation) and recommends conservative 10 mL/kg bolus increments in settings with variable mechanical ventilation.",
    citationString: "World Health Organization. Guidelines on the clinical management of sepsis and severe infections in children. Geneva: World Health Organization; 2025. WHO/MCA/25.4."
  },
  REF_BALANCED_CRYSTALLOIDS: {
    refId: "8",
    title: "Balanced Crystalloids versus 0.9% Saline for Pediatric Sepsis Resuscitation (PRoMPT BOLUS)",
    authors: "Weiss SL, Balamuth F, Hensley J, et al.",
    sourceJournal: "Lancet Child Adolesc Health",
    year: "2024;8(3):201-212",
    doiOrPmid: "doi:10.1016/S2352-4642(23)00312-X",
    evidenceGrade: "Level 1B",
    keyExcerpt: "Balanced crystalloids (Lactated Ringer's or Plasmalyte) significantly reduce hyperchloremic metabolic acidosis and acute kidney injury compared to 0.9% saline during rapid pediatric volume resuscitation.",
    citationString: "Weiss SL, Balamuth F, Hensley J, et al. Balanced crystalloids versus 0.9% saline for pediatric sepsis resuscitation (PRoMPT BOLUS). Lancet Child Adolesc Health. 2024;8(3):201-212. doi:10.1016/S2352-4642(23)00312-X."
  }
};

/**
 * Formats a list of evidence references in standard scientific paper format (AMA / Vancouver style)
 */
export function formatPaperReferences(references: EvidenceReference[]): string {
  if (!references || references.length === 0) return "";
  
  const lines = references.map((ref, idx) => {
    const num = idx + 1;
    const citation = ref.citationString || 
      `${ref.authors} ${ref.title}. ${ref.sourceJournal}. ${ref.year}.${ref.doiOrPmid ? ` ${ref.doiOrPmid}.` : ""}`;
    return `${num}. ${citation}`;
  });

  return `\n\n### References\n` + lines.join("\n");
}
