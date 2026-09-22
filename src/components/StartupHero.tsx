import React, { useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Heart,
  Scale,
  CheckCircle2,
  Mic,
  Volume2,
  Radio,
  Send
} from "lucide-react";
import { motion } from "motion/react";

interface StartupHeroProps {
  onOpenConsole: () => void;
  onOpenAssistant: (initialQuery?: string) => void;
  onStartVoice: () => void;
}

export const StartupHero: React.FC<StartupHeroProps> = ({
  onOpenConsole,
  onOpenAssistant,
  onStartVoice
}) => {
  const [heroQuery, setHeroQuery] = useState("");

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroQuery.trim()) {
      onOpenAssistant(heroQuery.trim());
      setHeroQuery("");
    } else {
      onOpenAssistant();
    }
  };

  const sampleVoicePrompts = [
    { label: "Weight Dosing (14.2 kg)", query: "Calculate precise Ceftriaxone stat dose and fluid bolus for a 14.2 kg child" },
    { label: "1-Hour Bundle Checklist", query: "What are the priority resuscitation steps in the Surviving Sepsis 1-hour bundle?" },
    { label: "Phoenix Sepsis Criteria", query: "What are the 2024 Phoenix criteria thresholds for pediatric septic shock?" }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 pt-10 sm:pt-16 pb-14 sm:pb-20 border-b border-slate-200">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[840px] h-[380px] bg-teal-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Pediatric Clinical Intelligence & Bedside AI Reasoner</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]"
            >
              Every second counts in pediatric sepsis.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-emerald-700">
                Ask Chempions AI hands-free.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl"
            >
              Pediatric sepsis is a leading cause of childhood mortality, yet early physiological decompensation is deceptively subtle. 
              <strong> Chempions AI</strong> equips emergency teams with voice-activated clinical reasoning, age-normative vital surveillance, and scale-verified dosing locks within the critical 60-minute golden window.
            </motion.p>

            {/* Embedded "Ask Chempions AI" Voice & Text Bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="p-2.5 sm:p-3 bg-white rounded-2xl border-2 border-teal-700/20 shadow-lg space-y-2.5 max-w-xl"
            >
              <form onSubmit={handleHeroSubmit} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onStartVoice}
                  className="px-3.5 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-900 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-teal-200 transition-all cursor-pointer shadow-2xs shrink-0"
                  title="Speak to Chempions AI with your voice"
                >
                  <Mic className="w-4 h-4 text-teal-700 animate-pulse" />
                  <span className="hidden xs:inline">Voice Consult</span>
                </button>

                <input
                  type="text"
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  placeholder="Ask Chempions AI (e.g. dosing, bolus, vitals)..."
                  className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700"
                />

                <button
                  type="submit"
                  className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                  <span>Ask AI</span>
                </button>
              </form>

              {/* Quick Clickable Voice Query Prompts */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Popular Queries:
                </span>
                {sampleVoicePrompts.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onOpenAssistant(item.query)}
                    className="text-[11px] bg-slate-100 hover:bg-teal-50 hover:text-teal-900 hover:border-teal-300 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 font-medium transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              <button
                onClick={onOpenConsole}
                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Bedside Clinical Intelligence</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenAssistant()}
                className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs sm:text-sm shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-teal-700" />
                <span>Open Full AI Assistant</span>
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Surviving Sepsis Campaign 2026
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Phoenix Criteria (JAMA 2024)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Zero-Hallucination Safe Architecture
              </span>
            </motion.div>
          </div>

          {/* Right Column: Live Bedside Clinical Intelligence Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              {/* Card Top Titlebar */}
              <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-bold font-mono tracking-wide">
                    BEDSIDE CLINICAL SURVEILLANCE • BAY 2
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-full">
                  Severe Sepsis Alert
                </span>
              </div>

              {/* Patient Banner */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Obi Eze <span className="text-xs font-medium text-slate-500">• 18 mo (Male)</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Focus: Suspected Pneumonia / Sepsis
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-black text-slate-900 block">
                      14.2 kg
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      ✓ Scale Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Vital Metrics Snapshot */}
              <div className="p-4 grid grid-cols-3 gap-2.5 bg-white text-xs">
                <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/50">
                  <span className="text-[10px] text-rose-800 font-bold block">Heart Rate</span>
                  <span className="text-lg font-black font-mono text-rose-900">172</span>
                  <span className="text-[9px] text-rose-700 block">bpm (&gt;150 max)</span>
                </div>

                <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/50">
                  <span className="text-[10px] text-rose-800 font-bold block">Cap Refill</span>
                  <span className="text-lg font-black font-mono text-rose-900">3.5s</span>
                  <span className="text-[9px] text-rose-700 block">prolonged &gt;2s</span>
                </div>

                <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/50">
                  <span className="text-[10px] text-rose-800 font-bold block">Lactate</span>
                  <span className="text-lg font-black font-mono text-rose-900">4.2</span>
                  <span className="text-[9px] text-rose-700 block">mM (crit ≥4.0)</span>
                </div>
              </div>

              {/* Resuscitation Protocol Action Snapshot */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <span>Immediate Resuscitation Bundle</span>
                  <span className="text-teal-700 font-mono">1-Hour Golden Target</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>1. IV Ceftriaxone</span>
                    <span className="text-teal-800 font-mono bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      710 mg (50 mg/kg)
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>2. Balanced Crystalloids</span>
                    <span className="text-teal-800 font-mono bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      142–284 mL (10–20 mL/kg)
                    </span>
                  </div>
                </div>

                {/* Direct Ask AI Action on the card */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onOpenAssistant("Explain the 710 mg Ceftriaxone dosing and fluid bolus for Obi Eze")}
                    className="py-2 px-2.5 bg-teal-50 hover:bg-teal-100 text-teal-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-teal-200"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                    <span>Ask AI About Obi</span>
                  </button>

                  <button
                    onClick={onOpenConsole}
                    className="py-2 px-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View Telemetry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Global Impact Numbers */}
        <div className="mt-14 pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">3.3M+</div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Annual Pediatric Sepsis Deaths Globally
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-teal-700">&lt; 60 min</div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Golden Hour Bundle Delivery Standard
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">100%</div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Scale-Verified Weight Dosing Enforcement
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-teal-700">0%</div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Black-Box AI Hallucination Risk
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
