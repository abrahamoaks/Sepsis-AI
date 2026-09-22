import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Scale,
  Sparkles,
  CheckCircle2,
  Lock,
  Unlock,
  Clock,
  ArrowRight,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Send,
  Heart,
  Bot
} from "lucide-react";
import { useSpeechChat } from "../utils/useSpeechChat";
import { generateClinicalReasonerResponse } from "../rules/clinicalReasoner";
import { INITIAL_SAMPLE_PATIENT } from "../data/samplePatients";

interface ClinicalIntelligenceConsoleProps {
  onOpenAssistant: (initialQuery?: string) => void;
  onStartVoice: () => void;
}

export const ClinicalIntelligenceConsole: React.FC<ClinicalIntelligenceConsoleProps> = ({
  onOpenAssistant,
  onStartVoice
}) => {
  // Clinical Patient State
  const [selectedCase, setSelectedCase] = useState<"toddler-shock" | "early-febrile" | "infant-dehydration">("toddler-shock");
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

  // Embedded Console Voice & Chat State
  const [consoleQuery, setConsoleQuery] = useState("");
  const [consoleResponse, setConsoleResponse] = useState<string | null>(
    `**Immediate Action Plan for Obi Eze (14.2 kg):**\n1. **Bedside Scale Verified**: Weight 14.2 kg confirmed. Unlock dosing.\n2. **Stat IV Ceftriaxone**: Administer **710 mg IV** (50 mg/kg) over 30 minutes stat [SSC 2026].\n3. **Targeted Crystalloid Bolus**: Infuse **142–284 mL** (10–20 mL/kg) balanced crystalloid over 15–20 minutes with serial CRT checks.\n4. **Blood Cultures**: Draw 2 peripheral sets stat prior to antimicrobial infusion.`
  );
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);

  // Embedded Speech Hook
  const {
    isListening,
    transcript,
    interimTranscript,
    isSpeaking,
    speechError,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    resetTranscript
  } = useSpeechChat({
    onTranscriptComplete: (spoken) => {
      if (spoken.trim()) {
        setConsoleQuery(spoken);
        executeClinicalQuery(spoken);
      }
    }
  });

  // Execute clinical query
  const executeClinicalQuery = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    setIsGeneratingResponse(true);
    stopSpeaking();

    try {
      // Build dynamic patient record for reasoner
      const dynamicPatient = {
        ...INITIAL_SAMPLE_PATIENT,
        ageYears: Number((ageMonths / 12).toFixed(1)),
        weightKg,
        weightVerified: isWeightVerified,
        vitals: {
          ...INITIAL_SAMPLE_PATIENT.vitals,
          heartRate: { ...INITIAL_SAMPLE_PATIENT.vitals.heartRate, value: heartRate },
          respiratoryRate: { ...INITIAL_SAMPLE_PATIENT.vitals.respiratoryRate, value: 44 },
          systolicBP: { ...INITIAL_SAMPLE_PATIENT.vitals.systolicBP, value: systolicBP },
          diastolicBP: { ...INITIAL_SAMPLE_PATIENT.vitals.diastolicBP, value: 42 },
          capillaryRefill: { ...INITIAL_SAMPLE_PATIENT.vitals.capillaryRefill, value: capRefill },
          spO2: { ...INITIAL_SAMPLE_PATIENT.vitals.spO2, value: spO2 }
        },
        labs: {
          ...INITIAL_SAMPLE_PATIENT.labs,
          lactate: { ...INITIAL_SAMPLE_PATIENT.labs.lactate, value: lactate }
        }
      };

      // Call API or fallback
      let answerText: string | null = null;
      try {
        const res = await fetch("/api/gemini/assist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: q,
            patientContext: dynamicPatient,
            triggeredAlerts: []
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.answer) {
            answerText = data.answer;
          }
        }
      } catch (e) {
        console.warn("Using local reasoner", e);
      }

      if (!answerText) {
        const local = generateClinicalReasonerResponse(q, dynamicPatient as any, []);
        answerText = local.text;
      }

      setConsoleResponse(answerText);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingResponse(false);
      resetTranscript();
    }
  };

  const handleCaseSelect = (caseType: "toddler-shock" | "early-febrile" | "infant-dehydration") => {
    setSelectedCase(caseType);
    if (caseType === "toddler-shock") {
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
      executeClinicalQuery("Immediate resuscitation bundle for 18mo toddler in septic shock");
    } else if (caseType === "early-febrile") {
      setAgeMonths(36);
      setWeightKg(15.8);
      setIsWeightVerified(false);
      setHeartRate(128);
      setCapRefill(1.9);
      setSystolicBP(92);
      setLactate(1.8);
      setSpO2(98);
      setMentalStatus("alert");
      setSuspectedInfection(true);
      executeClinicalQuery("Dosing safety lock for 3y child with unverified weight");
    } else {
      setAgeMonths(8);
      setWeightKg(8.4);
      setIsWeightVerified(true);
      setHeartRate(165);
      setCapRefill(2.8);
      setSystolicBP(74);
      setLactate(2.9);
      setSpO2(95);
      setMentalStatus("lethargic");
      setSuspectedInfection(true);
      executeClinicalQuery("Infant tachycardia and fluid rehydration safety check");
    }
  };

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

  // Dosing calculations
  const ceftriaxoneDose = Math.round(weightKg * 50);
  const fluidMin = Math.round(weightKg * 10);
  const fluidMax = Math.round(weightKg * 20);

  return (
    <section id="clinical-console" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold">
            <Radio className="w-3.5 h-3.5 text-teal-700 animate-pulse" />
            <span>Bedside Clinical Intelligence & Voice Reasoner</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Live Bedside Surveillance & Hands-Free AI Reasoner
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Continuous age-normative telemetry monitoring, mandatory bedside scale-locked dosing, and instantaneous voice clinical decision support.
          </p>
        </div>

        {/* Clinical Case Selection Tabs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Bedside Profile:
          </span>
          <button
            onClick={() => handleCaseSelect("toddler-shock")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              selectedCase === "toddler-shock"
                ? "bg-rose-900 text-white shadow-md ring-2 ring-rose-300"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            <span>Bay 2: Toddler Septic Shock (18m, 14.2 kg)</span>
          </button>

          <button
            onClick={() => handleCaseSelect("early-febrile")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              selectedCase === "early-febrile"
                ? "bg-amber-900 text-white shadow-md ring-2 ring-amber-300"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Bay 4: Unverified Weight Safety Lock (3y, 15.8 kg)</span>
          </button>

          <button
            onClick={() => handleCaseSelect("infant-dehydration")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              selectedCase === "infant-dehydration"
                ? "bg-teal-900 text-white shadow-md ring-2 ring-teal-300"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span>Bay 1: Infant Tachycardia (8m, 8.4 kg)</span>
          </button>
        </div>

        {/* The Live Clinical Grid */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Bedside Telemetry & Scale Safety Lock */}
          <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-6 sm:p-7 border border-slate-200 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-teal-700" />
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800">
                  Bedside Patient Telemetry
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                {getAgeBracket(ageMonths)} • {weightKg} kg
              </span>
            </div>

            {/* Scale-Verified Weight Lock Feature Card */}
            <div
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                isWeightVerified
                  ? "bg-emerald-50/80 border-emerald-200"
                  : "bg-rose-50/80 border-rose-300 ring-2 ring-rose-300/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isWeightVerified ? "bg-emerald-700 text-white" : "bg-rose-700 text-white"
                  }`}
                >
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <span
                    className={`text-xs font-bold block ${
                      isWeightVerified ? "text-emerald-950" : "text-rose-950"
                    }`}
                  >
                    {isWeightVerified
                      ? "Bedside Scale Weight Verified"
                      : "Unverified Weight — Safety Interlock Active"}
                  </span>
                  <span className="text-[11px] text-slate-600 block">
                    {isWeightVerified
                      ? "Scale-locked: Dosing calculations authorized for infusion."
                      : "Dosing locked: Weigh patient on calibrated bed scale to authorize infusion."}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsWeightVerified(!isWeightVerified)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isWeightVerified
                    ? "bg-emerald-800 text-white hover:bg-emerald-900"
                    : "bg-rose-800 text-white hover:bg-rose-900 animate-pulse"
                }`}
              >
                {isWeightVerified ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{isWeightVerified ? "Verified ✓" : "Verify Scale"}</span>
              </button>
            </div>

            {/* Live Vital Telemetry Stream Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {/* Heart Rate */}
              <div className={`p-3 rounded-2xl border ${isTachycardia ? "bg-rose-50 border-rose-200" : "bg-white border-slate-200"}`}>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Heart Rate</span>
                <span className={`text-xl font-black font-mono ${isTachycardia ? "text-rose-800" : "text-slate-900"}`}>
                  {heartRate}
                </span>
                <span className="text-[10px] text-slate-500 block">bpm (&gt;150 crit)</span>
              </div>

              {/* CRT */}
              <div className={`p-3 rounded-2xl border ${isProlongedCRT ? "bg-rose-50 border-rose-200" : "bg-white border-slate-200"}`}>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Cap Refill</span>
                <span className={`text-xl font-black font-mono ${isProlongedCRT ? "text-rose-800" : "text-slate-900"}`}>
                  {capRefill.toFixed(1)}s
                </span>
                <span className="text-[10px] text-slate-500 block">normal &le; 2.0s</span>
              </div>

              {/* SBP */}
              <div className={`p-3 rounded-2xl border ${isHypotension ? "bg-rose-50 border-rose-200" : "bg-white border-slate-200"}`}>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Systolic BP</span>
                <span className={`text-xl font-black font-mono ${isHypotension ? "text-rose-800" : "text-slate-900"}`}>
                  {systolicBP}
                </span>
                <span className="text-[10px] text-slate-500 block">mmHg</span>
              </div>

              {/* Lactate */}
              <div className={`p-3 rounded-2xl border ${isHighLactate ? "bg-rose-50 border-rose-200" : "bg-white border-slate-200"}`}>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Lactate</span>
                <span className={`text-xl font-black font-mono ${isHighLactate ? "text-rose-800" : "text-slate-900"}`}>
                  {lactate.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-500 block">mM (&ge;4.0 crit)</span>
              </div>
            </div>

            {/* Resuscitation Orders with Scale Lock */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Deterministic 1-Hour Golden Window Dosing</span>
                <span className="text-teal-700 font-mono">Surviving Sepsis 2026</span>
              </div>

              {/* Task 1: Antimicrobial */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    1. IV Ceftriaxone (50 mg/kg stat)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Infuse within 60 min of recognition
                  </span>
                </div>
                {isWeightVerified ? (
                  <span className="text-xs font-mono font-black text-teal-900 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl">
                    {ceftriaxoneDose} mg IV
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    Locked (Verify Scale)
                  </span>
                )}
              </div>

              {/* Task 2: Fluid Bolus */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    2. Balanced Crystalloid Bolus (10–20 mL/kg)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Infuse over 15–20 min with serial lung & liver checks
                  </span>
                </div>
                {isWeightVerified ? (
                  <span className="text-xs font-mono font-black text-teal-900 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl">
                    {fluidMin}–{fluidMax} mL
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    Locked (Verify Scale)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Chempions AI Voice & Clinical Reasoner Terminal */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl space-y-5">
            {/* Terminal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-2xs">
                  <Sparkles className="w-4 h-4 text-teal-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900">
                      Chempions AI Voice Reasoner
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Live Bedside
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Speak or type clinical queries hands-free
                  </p>
                </div>
              </div>

              {/* Read Aloud Audio Synthesizer */}
              {consoleResponse && (
                <button
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeaking();
                    } else {
                      speakText(consoleResponse);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSpeaking
                      ? "bg-rose-100 text-rose-800 border border-rose-300 animate-pulse"
                      : "bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200"
                  }`}
                  title={isSpeaking ? "Stop voice audio" : "Listen to Chempions AI Audio"}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                      <span>Stop Audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-teal-700" />
                      <span>Listen to Plan</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Active Voice Listening Banner */}
            {isListening && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-600 animate-ping absolute" />
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-rose-950">
                      Listening to your clinical query...
                    </p>
                    <p className="text-[11px] text-rose-700 font-mono italic">
                      {interimTranscript || transcript || "Speak now (e.g., 'Check Ceftriaxone dose')..."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={stopListening}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-700 text-white hover:bg-rose-800 cursor-pointer"
                >
                  Stop
                </button>
              </div>
            )}

            {/* Embedded Response Box */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 min-h-[190px] text-xs leading-relaxed text-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono uppercase pb-2 border-b border-slate-200/80">
                <span className="font-bold text-slate-700">Chempions AI Response</span>
                <span>Guideline Grounded</span>
              </div>

              {isGeneratingResponse ? (
                <div className="py-6 flex items-center justify-center gap-2 text-slate-500">
                  <Bot className="w-4 h-4 text-teal-700 animate-spin" />
                  <span>Synthesizing clinical recommendation...</span>
                </div>
              ) : consoleResponse ? (
                <div className="space-y-2 whitespace-pre-wrap font-sans text-xs sm:text-[13px] leading-relaxed text-slate-800">
                  {consoleResponse}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 italic">
                  Tap the microphone or select a clinical prompt below to consult Chempions AI.
                </div>
              )}
            </div>

            {/* Quick Clickable Voice Queries */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Instant Inquiries:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => executeClinicalQuery("Check 50 mg/kg Ceftriaxone dosing and administration for 14.2 kg child")}
                  className="text-[11px] bg-white hover:bg-teal-50 hover:text-teal-900 hover:border-teal-300 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 font-medium transition-colors cursor-pointer"
                >
                  💊 Verify Dosing
                </button>
                <button
                  onClick={() => executeClinicalQuery("What is the 10-20 mL/kg fluid resuscitation bolus volume and stop criteria?")}
                  className="text-[11px] bg-white hover:bg-teal-50 hover:text-teal-900 hover:border-teal-300 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 font-medium transition-colors cursor-pointer"
                >
                  🫁 Fluid Bolus Criteria
                </button>
                <button
                  onClick={() => executeClinicalQuery("What are the Phoenix 2024 septic shock criteria?")}
                  className="text-[11px] bg-white hover:bg-teal-50 hover:text-teal-900 hover:border-teal-300 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 font-medium transition-colors cursor-pointer"
                >
                  📊 Phoenix Criteria
                </button>
                <button
                  onClick={() => executeClinicalQuery("PICU escalation criteria and vasoactive preparation")}
                  className="text-[11px] bg-white hover:bg-teal-50 hover:text-teal-900 hover:border-teal-300 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 font-medium transition-colors cursor-pointer"
                >
                  🚨 PICU Escalation
                </button>
              </div>
            </div>

            {/* Voice & Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeClinicalQuery(consoleQuery);
              }}
              className="flex items-center gap-2 pt-1"
            >
              <button
                type="button"
                onClick={() => {
                  if (isListening) {
                    stopListening();
                  } else {
                    startListening();
                  }
                }}
                className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  isListening
                    ? "bg-rose-600 text-white animate-pulse shadow-md ring-2 ring-rose-300"
                    : "bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 shadow-2xs"
                }`}
                title={isListening ? "Stop voice listening" : "Click to speak voice clinical query"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-teal-700" />}
              </button>

              <input
                type="text"
                value={consoleQuery}
                onChange={(e) => setConsoleQuery(e.target.value)}
                placeholder={isListening ? "Listening to your voice..." : "Ask Chempions AI about this patient..."}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-slate-50/50"
              />

              <button
                type="submit"
                disabled={!consoleQuery.trim() || isGeneratingResponse}
                className="p-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer shadow-xs shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Bottom Expansion Link */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Need deep research citations & guidelines?
              </span>
              <button
                onClick={() => onOpenAssistant(consoleQuery || "Explain immediate resuscitation bundle")}
                className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
              >
                <span>Open Full Clinical Assistant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
