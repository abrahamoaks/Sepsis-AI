import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does Chempions AI prevent AI hallucinations in critical care?",
      answer:
        "All alert triggers, physiological thresholds, and dosage formulas are calculated using a 100% deterministic rules engine directly derived from peer-reviewed pediatric guidelines (Surviving Sepsis Campaign 2026, Phoenix Criteria). The AI reasoner is strictly restricted to explaining these deterministic outputs and synthesizing guideline references with citations—it never generates unaudited numerical medical prescriptions."
    },
    {
      question: "Why is scale-verified weight mandatory before drug and fluid calculations?",
      answer:
        "In pediatrics, every fluid bolus and drug dose is strictly per-kilogram. Unverified or estimated weights under acute stress are a leading cause of accidental overdoses and fatal pulmonary fluid overload. Chempions AI enforces a hard safety lock that requires the clinical team to verify a calibrated bedside scale measurement before automated doses are displayed."
    },
    {
      question: "Does Chempions AI replace physician clinical decision-making?",
      answer:
        "No. Chempions AI is an assistive Clinical Decision Support (CDS) system designed to augment, not replace, clinical judgment. Frontline physicians and advanced practice providers retain complete independent decision authority, with the ability to override, customize, or document alternative rationale at any time."
    },
    {
      question: "Can Chempions AI support community EDs and non-pediatric specialty hospitals?",
      answer:
        "Yes. Over 80% of pediatric emergencies present to general community emergency departments that may lack on-site pediatric intensivists. Chempions AI levels the playing field by providing immediate, age-normative pediatric vital thresholds, standardized 1-hour resuscitation checklists, and PICU transfer escalation criteria."
    },
    {
      question: "How does Chempions AI integrate with hospital EHR systems?",
      answer:
        "Chempions AI is built on modern HL7 FHIR (Fast Healthcare Interoperability Resources) APIs and SMART-on-FHIR standards, allowing seamless bi-directional integration into existing EHR workflows (Epic, Oracle Health / Cerner, MEDITECH) as an embedded bedside surveillance widget."
    }
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Safety, Compliance & Clinical Architecture
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Answers to common clinical, technical, and regulatory questions.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
                className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {faq.question}
                  </span>
                  <span className="p-1 rounded-lg bg-slate-100 text-slate-500 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
