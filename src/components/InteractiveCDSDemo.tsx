import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Scale,
  Sparkles,
  CheckCircle2,
  Lock,
  Unlock,
  RefreshCw,
  HelpCircle,
  FileText,
  Clock,
  ArrowRight
} from "lucide-react";
import { motion } from "motion/react";

interface InteractiveCDSDemoProps {
  onOpenAssistant: () => void;
}

export const InteractiveCDSDemo: React.FC<InteractiveCDSDemoProps> = ({
  onOpenAssistant
}) => {
  // Interactive state
  const [ageMonths, setAgeMonths] = useState<number>(18);
  const [weightKg, setWeightKg] = useState<number>(14.2);
  const [isWeightVerified, setIsWeightVerified] = useState<boolean>(true);
  const [heartRate, setHeartRate] = useState<number>(172);
  const [capRefill, setCapRefill] = useState<number>(3.5);
  const [systolicBP, setSystolicBP] = useState<number>(76);
  const [lactate, setLactate] = useState<number>(4.2);
  const [spO2, setSpO2] = useState<number>(93);
  const [mentalStatus, setMentalStatus] = useState<"alert" | "lethargic" | "unresponsive">("lethargic");
  const [suspectedInfection, setSuspectedInfection] = useState<boolean>(true);

  // Age bracket helper
  const getAgeBracket = (months: number) => {
    if (months < 1) return "Neonate (0–1m)";
    if (months < 12) return "Infant (1–12m)";
    if (months < 24) return "Toddler (1–2y)";
    if (months < 60) return "Early Child (2–5y)";
    if (months < 144) return "School Age (5–12y)";
    return "Adolescent (>12y)";
  };

  // Thresholds based on age (1-2y toddler baseline)
  const isTachycardia = heartRate > 150;
  const isProlongedCRT = capRefill > 2.0;
  const isHypotension = systolicBP < 70 + 2 * Math.floor(ageMonths / 12);
  const isHighLactate = lactate >= 4.0;
  const isAlteredMental = mentalStatus !== "alert";

  // Sepsis risk evaluation
  const isSepticShock = suspectedInfection && (isHypotension || (isProlongedCRT && (isTachycardia || isHighLactate)));
  const isSepsisAlert = suspectedInfection && (isTachycardia || isProlongedCRT || isHighLactate || isAlteredMental);

  // Calculations
  const ceftriaxoneDose = Math.round(weightKg * 50);
  const fluidMin = Math.round(weightKg * 10);
  const fluidMax = Math.round(weightKg * 20);

  const resetToSevereDemo = () => {
    setAgeMonths(18);
    setWeightKg(14.2);
    setIsWeightVerified(true);
    setHeartRate(172);
    setCapRefill(3.5);
    setSystolicBP(76);
    setLactate(4.2);
    setSpO2(93);
    setMentalStatus("lethargic");
    setSuspectedInfection(true);
  };

  const resetToMildDemo = () => {
    setAgeMonths(36);
    setWeightKg(15.8);
    setIsWeightVerified(false);
    setHeartRate(125);
    setCapRefill(1.8);
    setSystolicBP(92);
    setLactate(1.8);
    setSpO2(98);
    setMentalStatus("alert");
    setSuspectedInfection(true);
  };

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Interactive CDS Demonstration
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            See the Deterministic Clinical Engine in Action
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Test how Chempions AI reacts to changing vital signs, enforces scale-verified weight locks, and generates Surviving Sepsis Campaign 1-hour resuscitation bundles.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs font-bold text-slate-500">Quick Simulation Presets:</span>
          <button
            onClick={resetToSevereDemo}
            className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-colors cursor-pointer"
          >
            🚨 Toddler Septic Shock (18m, 14.2 kg)
          </button>
          <button
            onClick={resetToMildDemo}
            className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
          >
            ⚠️ Early Febrile Illness with Unverified Weight (3y, 15.8 kg)
          </button>
        </div>

        {/* The Live Interactive Sandbox Grid */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (Bedside Observations) */}
          <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-6 sm:p-7 border border-slate-200 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-700" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                  Bedside Observation Inputs
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {getAgeBracket(ageMonths)}
              </span>
            </div>

            {/* Age & Weight Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Patient Age: <span className="font-mono text-teal-800">{ageMonths} months</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="144"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(Number(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Weight: <span className="font-mono text-teal-800">{weightKg} kg</span>
                </label>
                <input
                  type="range"
                  min="3"
                  max="50"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Bedside Scale Weight Lock Switch */}
            <div className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
              isWeightVerified
                ? "bg-emerald-50/80 border-emerald-200"
                : "bg-rose-50/80 border-rose-300"
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isWeightVerified ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                }`}>
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <span className={`text-xs font-bold block ${
                    isWeightVerified ? "text-emerald-950" : "text-rose-950"
                  }`}>
                    {isWeightVerified ? "Bedside Scale Weight Verified" : "Weight Unverified (Safety Lock Active)"}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {isWeightVerified ? "Dosing unlocked for clinical calculations" : "Fluid & antimicrobial dosing safety lock enabled"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsWeightVerified(!isWeightVerified)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isWeightVerified
                    ? "bg-emerald-700 text-white hover:bg-emerald-800"
                    : "bg-rose-700 text-white hover:bg-rose-800"
                }`}
              >
                {isWeightVerified ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{isWeightVerified ? "Lock" : "Verify Scale"}</span>
              </button>
            </div>

            {/* Vital Signs Sliders */}
            <div className="space-y-4 pt-2 border-t border-slate-200">
              {/* Heart Rate */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-700">Heart Rate (HR):</span>
                  <span className={`font-mono font-black ${isTachycardia ? "text-rose-700" : "text-slate-900"}`}>
                    {heartRate} bpm {isTachycardia && "⚠️ High"}
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="220"
                  value={heartRate}
                  onChange={(e) => setHeartRate(Number(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer"
                />
              </div>

              {/* Capillary Refill */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-700">Capillary Refill Time (CRT):</span>
                  <span className={`font-mono font-black ${isProlongedCRT ? "text-rose-700" : "text-slate-900"}`}>
                    {capRefill.toFixed(1)}s {isProlongedCRT && "⚠️ Prolonged (>2.0s)"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="6.0"
                  step="0.1"
                  value={capRefill}
                  onChange={(e) => setCapRefill(Number(e.target.value))}
                  className="w-full accent-teal-700 cursor-pointer"
                />
              </div>

              {/* Blood Pressure & Lactate in 2 columns */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-slate-700">Systolic BP:</span>
                    <span className={`font-mono font-black ${isHypotension ? "text-rose-700" : "text-slate-900"}`}>
                      {systolicBP} {isHypotension && "⚠️"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="140"
                    value={systolicBP}
                    onChange={(e) => setSystolicBP(Number(e.target.value))}
                    className="w-full accent-teal-700 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-slate-700">Lactate:</span>
                    <span className={`font-mono font-black ${isHighLactate ? "text-rose-700" : "text-slate-900"}`}>
                      {lactate.toFixed(1)} mM {isHighLactate && "⚠️"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10.0"
                    step="0.1"
                    value={lactate}
                    onChange={(e) => setLactate(Number(e.target.value))}
                    className="w-full accent-teal-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* Mental Status and Suspected Infection */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mental Status:</label>
                  <select
                    value={mentalStatus}
                    onChange={(e) => setMentalStatus(e.target.value as any)}
                    className="w-full text-xs font-semibold p-2 bg-white rounded-xl border border-slate-300 focus:outline-teal-700"
                  >
                    <option value="alert">Alert (Normal)</option>
                    <option value="lethargic">Lethargic / Irritable (Abnormal)</option>
                    <option value="unresponsive">Unresponsive (Critical)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Infection Suspected:</label>
                  <button
                    onClick={() => setSuspectedInfection(!suspectedInfection)}
                    className={`w-full text-xs font-bold p-2 rounded-xl border transition-colors cursor-pointer ${
                      suspectedInfection
                        ? "bg-teal-700 text-white border-teal-700"
                        : "bg-white text-slate-700 border-slate-300"
                    }`}
                  >
                    {suspectedInfection ? "✓ Suspected Focus" : "No Infection Focus"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time CDS Output Column */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-lg space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                Chempions AI Clinical Evaluation Output
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Deterministic SSC 2026 Engine
              </span>
            </div>

            {/* Clinical Stage Banner */}
            <div className={`p-4 rounded-2xl border transition-all ${
              isSepticShock
                ? "bg-rose-50 border-rose-300 text-rose-950"
                : isSepsisAlert
                ? "bg-amber-50 border-amber-300 text-amber-950"
                : "bg-emerald-50 border-emerald-300 text-emerald-950"
            }`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      isSepticShock ? "bg-rose-600 animate-ping" : isSepsisAlert ? "bg-amber-600" : "bg-emerald-600"
                    }`} />
                    <h4 className="text-sm font-black uppercase tracking-wide">
                      {isSepticShock
                        ? "🚨 High-Risk Septic Shock Deterioration"
                        : isSepsisAlert
                        ? "⚠️ Sepsis Warning • Suspected Infection & Abnormal Perfusion"
                        : "✓ Hemodynamically Compensated / Low Risk"}
                    </h4>
                  </div>
                  <p className="text-xs mt-1 text-slate-700">
                    {isSepticShock
                      ? "Persistent abnormal perfusion with extreme tachycardia and elevated lactate requires immediate bedside resuscitation bundle."
                      : isSepsisAlert
                      ? "Age-normative vital abnormalities detected with suspected infection focus. Close serial surveillance mandated."
                      : "Vital observations fall within normal pediatric baseline for age group."}
                  </p>
                </div>
              </div>
            </div>

            {/* Calculated 1-Hour Sepsis Bundle */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Immediate Resuscitation Action Plan</span>
                <span className="text-teal-700">1-Hour Golden Window</span>
              </div>

              {/* Task 1: Antimicrobial */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    1. Broad-Spectrum IV Antimicrobial (Ceftriaxone)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Target: Infuse within 60 min of sepsis recognition
                  </span>
                </div>
                {isWeightVerified ? (
                  <span className="text-xs font-mono font-black text-teal-900 bg-teal-100/70 border border-teal-300 px-2.5 py-1 rounded-lg">
                    {ceftriaxoneDose} mg IV
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-100 border border-rose-200 px-2 py-1 rounded-lg flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Locked (Verify Scale)
                  </span>
                )}
              </div>

              {/* Task 2: Targeted Fluid Bolus */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    2. Balanced Crystalloid Bolus (10–20 mL/kg)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Serial perfusion checks after each 10 mL/kg aliquot
                  </span>
                </div>
                {isWeightVerified ? (
                  <span className="text-xs font-mono font-black text-teal-900 bg-teal-100/70 border border-teal-300 px-2.5 py-1 rounded-lg">
                    {fluidMin}–{fluidMax} mL
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-100 border border-rose-200 px-2 py-1 rounded-lg flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Locked (Verify Scale)
                  </span>
                )}
              </div>

              {/* Task 3: Blood Cultures */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">
                    3. Pre-Antibiotic Blood Cultures
                  </span>
                  <span className="text-[11px] text-slate-500">
                    2 sets peripheral; do not delay antibiotics &gt;45 min
                  </span>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Stat Protocol
                </span>
              </div>
            </div>

            {/* Ask AI Assistant Bar */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Want immediate guideline-grounded rationale?
              </span>
              <button
                onClick={onOpenAssistant}
                className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI Reasoner</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
