import React from "react";
import {
  Activity,
  Lock,
  Timer,
  FileCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { motion } from "motion/react";

interface SolutionSectionProps {
  onOpenAssistant: (initialQuery?: string) => void;
}

export const SolutionSection: React.FC<SolutionSectionProps> = ({ onOpenAssistant }) => {
  const solutions = [
    {
      icon: Activity,
      badge: "Pillar 1: Precision Surveillance",
      title: "Age-Calibrated Dynamic Vital Thresholds",
      description:
        "Continuously benchmarks heart rate, respiratory rate, systolic blood pressure, and capillary refill against exact pediatric age brackets—from neonates to adolescents. Identifies early compensated shock hours before systemic arterial collapse.",
      features: [
        "6 standard pediatric age group reference tables",
        "Prolonged capillary refill (>2s) detection",
        "Hypotension and narrow pulse pressure alarms"
      ],
      aiQuery: "Explain how Chempions AI benchmarks age-normative heart rate and capillary refill in pediatric sepsis"
    },
    {
      icon: Lock,
      badge: "Pillar 2: Dosing Safety",
      title: "Scale-Locked Weight Verification",
      description:
        "Enforces physical safety locks on automated fluid and drug calculators until a calibrated scale weight is verified at bedside. Prevents devastating dosing errors caused by eyeballed estimates or stale historical chart values.",
      features: [
        "Hard lock on automated mL/kg and mg/kg dosing",
        "Mandatory calibrated scale confirmation flag",
        "Eliminates accidental 10x drug calculation errors"
      ],
      aiQuery: "How does the Bedside Scale Lock protect against weight-based pediatric dosing errors?"
    },
    {
      icon: Timer,
      badge: "Pillar 3: The Golden Hour",
      title: "Guideline 1-Hour Resuscitation Bundle",
      description:
        "Provides a deterministic, step-by-step checklist matching international Surviving Sepsis Campaign protocols: pre-antibiotic blood cultures, stat broad-spectrum antimicrobials, targeted crystalloid boluses, and serial lactate clearance.",
      features: [
        "Blood cultures stat before antibiotic administration",
        "Antimicrobial infusion target within 60 minutes",
        "Weight-based crystalloid aliquots (10–20 mL/kg)"
      ],
      aiQuery: "What are the 4 mandatory steps in the Surviving Sepsis Campaign 1-hour pediatric bundle?"
    },
    {
      icon: FileCheck,
      badge: "Pillar 4: Complete Transparency",
      title: "Zero-Hallucination 'Why This Alert?' CDS",
      description:
        "Every single alert, suggestion, and bundle priority is immediately traceable to published literature and guideline text. Frontline clinicians inspect the exact rule criteria, observation timestamp, and medical journal citation in one tap.",
      features: [
        "Grounded in SSC 2026 and Phoenix Criteria (JAMA 2024)",
        "Audit-ready chronological event logging",
        "No opaque generative hallucinations at bedside"
      ],
      aiQuery: "What clinical studies and guidelines validate the Chempions AI decision rules?"
    }
  ];

  return (
    <section id="solution" className="py-16 sm:py-24 bg-slate-50/60 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            What Chempions AI Solves
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Built for the High-Stakes Reality of Pediatric Resuscitation
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            By fusing deterministic safety rules with transparent clinical AI, Chempions AI empowers physicians and nurses to deliver guideline-compliant care when seconds matter most.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {solutions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-teal-800 bg-teal-50/80 px-2.5 py-1 rounded-full border border-teal-200">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 space-y-2 border-t border-slate-100">
                    {item.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Ask Chempions AI trigger on each card */}
                <div className="pt-5 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => onOpenAssistant(item.aiQuery)}
                    className="w-full py-2.5 px-3 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-900 rounded-xl text-xs font-bold flex items-center justify-between transition-colors border border-slate-200 hover:border-teal-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                      <span>Ask Chempions AI about this pillar</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 transition-colors" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
