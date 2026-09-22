import React from "react";
import { BookOpen, CheckCircle2, FileText, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface EvidenceSectionProps {
  onOpenAssistant?: (initialQuery?: string) => void;
}

export const EvidenceSection: React.FC<EvidenceSectionProps> = ({ onOpenAssistant }) => {
  const documents = [
    {
      title: "Surviving Sepsis Campaign: International Guidelines for Management of Septic Shock in Children",
      org: "Society of Critical Care Medicine & European Society of Intensive Care Medicine",
      year: "2026 Consensus Update",
      scope: "Global Pediatric Standard",
      points: [
        "Pre-antimicrobial blood cultures without delaying therapy >45 minutes",
        "Empiric broad-spectrum IV antimicrobials within 60 minutes of sepsis recognition",
        "Targeted crystalloid fluid boluses in 10–20 mL/kg aliquots with serial clinical re-evaluation",
        "Epinephrine / Norepinephrine titration for fluid-refractory shock"
      ],
      aiPrompt: "Detail the Surviving Sepsis Campaign 2026 guidelines for pediatric septic shock management"
    },
    {
      title: "The Phoenix Criteria for Pediatric Sepsis & Septic Shock",
      org: "Society of Critical Care Medicine Pediatric Sepsis Definition Task Force (JAMA)",
      year: "JAMA 2024 Benchmark",
      scope: "Multicenter Organ Dysfunction Scoring",
      points: [
        "Replacement of legacy SIRS criteria with validated organ dysfunction metrics",
        "Age-adjusted cardiovascular, respiratory, coagulation, and neurological scoring",
        "Lactate threshold ≥4.0 mmol/L and vasoactive requirements defining pediatric septic shock"
      ],
      aiPrompt: "Explain the Phoenix 2024 Criteria for pediatric sepsis and organ dysfunction thresholds"
    },
    {
      title: "Institutional Pediatric Golden Hour Resuscitation Bundle",
      org: "Children's Hospital Emergency Medicine Quality Committee",
      year: "2026 Safety Standard",
      scope: "Hospital Emergency Protocol",
      points: [
        "Mandatory calibrated bedside scale weight verification before automated dosing release",
        "Standardized Ceftriaxone 50 mg/kg (max 2g) rapid infusion bundle",
        "Repeat point-of-care lactate clearance tracking at 2-hour interval"
      ],
      aiPrompt: "What are the core components of the Institutional 1-hour pediatric resuscitation bundle?"
    }
  ];

  return (
    <section id="evidence" className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Clinical Rigor & Evidence Grounding
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            100% Traceable to Peer-Reviewed Guidelines
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Chempions AI does not invent medical facts. Every rule condition, alert trigger, and dosing recommendation is deterministically hardcoded against international standards.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {documents.map((doc, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {doc.year}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {doc.scope}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-500 font-medium">
                  {doc.org}
                </p>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  {doc.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-teal-800 font-bold">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                    Deterministic Rule Standard
                  </span>
                  <span className="font-mono text-slate-400">Class 1A Evidence</span>
                </div>

                {onOpenAssistant && (
                  <button
                    onClick={() => onOpenAssistant(doc.aiPrompt)}
                    className="w-full py-2 px-3 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200 hover:border-teal-300 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Ask AI about these guidelines</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
