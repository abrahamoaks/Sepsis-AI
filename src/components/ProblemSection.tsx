import React from "react";
import { AlertCircle, Clock, Scale, BellOff, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface ProblemSectionProps {
  onOpenAssistant: (initialQuery?: string) => void;
}

export const ProblemSection: React.FC<ProblemSectionProps> = ({ onOpenAssistant }) => {
  const challenges = [
    {
      icon: Clock,
      title: "Subtle Presentation & Camouflaged Decompensation",
      subtitle: "Compensated shock hides behind normal blood pressure until collapse",
      description:
        "Unlike adults, pediatric patients maintain arterial blood pressure through extreme systemic vascular resistance until the verge of cardiac arrest. Hypotension is a late, catastrophic finding. Normative vitals change drastically from neonates to toddlers to adolescents, making early recognition intensely error-prone.",
      stat: "80%",
      statLabel: "of pediatric sepsis cases present without hypotension at initial triage",
      aiPrompt: "Why does pediatric septic shock maintain normal blood pressure until late decompensation?"
    },
    {
      icon: Scale,
      title: "The Weight-Based Dosing Minefield",
      subtitle: "Estimated weights trigger catastrophic under-dosing or fluid overload",
      description:
        "Every single fluid bolus and antibiotic dose in pediatrics must be calculated per kilogram of body weight. Frontline teams under extreme stress frequently estimate weights, resulting in sub-therapeutic antimicrobial exposure or lethal pulmonary edema and organ compartment syndromes.",
      stat: "3x Risk",
      statLabel: "of resuscitation dosing error when weight is uncalibrated or estimated",
      aiPrompt: "Explain the clinical hazards of unverified weight estimates in pediatric resuscitation"
    },
    {
      icon: BellOff,
      title: "Alarm Fatigue & The 'Black Box' Distrust",
      subtitle: "Clinicians silence opaque alerts that fail to explain their clinical logic",
      description:
        "Generic EHR sepsis alerts trigger incessantly on benign viral illnesses, training clinicians to dismiss them. Meanwhile, proprietary machine learning risk scores cannot provide bedside physicians with audit-grade guideline citations, making them legally and clinically risky to act upon.",
      stat: "90%+",
      statLabel: "of standard EHR sepsis alerts are overridden or ignored by clinical staff",
      aiPrompt: "How does Chempions AI eliminate EHR alarm fatigue and provide zero-hallucination citations?"
    }
  ];

  return (
    <section id="problem" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            The Clinical Reality
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Why Pediatric Sepsis is Medicine’s Most Deceptive Emergency
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            In pediatric emergency medicine, minutes determine survival. Yet clinicians face rapid age-varying physiology, high-stakes weight dosing, and unreliable alerts.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {challenges.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-slate-50 rounded-3xl p-6 sm:p-7 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all shadow-2xs group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-100/80 text-rose-700 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs font-semibold text-rose-700 mb-3">
                    {item.subtitle}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-200/80 bg-white/70 -mx-6 -mb-6 p-5 rounded-b-3xl space-y-3">
                  <div>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                      {item.stat}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {item.statLabel}
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenAssistant(item.aiPrompt)}
                    className="w-full py-1.5 px-2.5 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-900 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200 hover:border-teal-200 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    <span>Ask Chempions AI about this</span>
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
