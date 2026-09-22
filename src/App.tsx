/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  PatientRecord,
  HistoricalObservationPoint
} from "./types/clinical";
import { INITIAL_SAMPLE_PATIENT, SAMPLE_PATIENT_HISTORY } from "./data/samplePatients";
import { evaluateClinicalSafetyRules } from "./rules/pediatricEngine";

import { StartupNavbar } from "./components/StartupNavbar";
import { StartupHero } from "./components/StartupHero";
import { ProblemSection } from "./components/ProblemSection";
import { SolutionSection } from "./components/SolutionSection";
import { ClinicalIntelligenceConsole } from "./components/ClinicalIntelligenceConsole";
import { EvidenceSection } from "./components/EvidenceSection";
import { FAQSection } from "./components/FAQSection";
import { StartupFooter } from "./components/StartupFooter";
import { GeminiAssistantDrawer } from "./components/GeminiAssistantDrawer";
import { VoiceConsultDock } from "./components/VoiceConsultDock";

export default function App() {
  const [patient] = useState<PatientRecord>(INITIAL_SAMPLE_PATIENT);
  const [history] = useState<HistoricalObservationPoint[]>(SAMPLE_PATIENT_HISTORY);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantInitialQuery, setAssistantInitialQuery] = useState<string | undefined>(undefined);

  // Gemini Backend Mode Check
  const [geminiStatus, setGeminiStatus] = useState<{ live: boolean; mode: string }>({
    live: false,
    mode: "Initializing..."
  });

  useEffect(() => {
    fetch("/api/gemini/status")
      .then((res) => res.json())
      .then((data) => setGeminiStatus(data))
      .catch(() => setGeminiStatus({ live: false, mode: "Hospital CDS Protocol Model" }));
  }, []);

  // Run Deterministic Safety & Workflow Rules Engine for AI Assistant Context
  const rulesOutput = useMemo(() => {
    return evaluateClinicalSafetyRules(patient, history);
  }, [patient, history]);

  const scrollToConsole = () => {
    const el = document.getElementById("clinical-console") || document.getElementById("how-it-works");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenAssistant = (query?: string) => {
    setAssistantInitialQuery(query);
    setIsAssistantOpen(true);
  };

  const handleStartVoice = () => {
    // Open drawer ready for voice consult
    setAssistantInitialQuery(undefined);
    setIsAssistantOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased selection:bg-teal-100 selection:text-teal-900">
      {/* 1. Navigation Bar with Ask Chempions AI & Voice Action */}
      <StartupNavbar
        onOpenConsole={scrollToConsole}
        onOpenAssistant={handleOpenAssistant}
        onStartVoice={handleStartVoice}
      />

      <main className="flex-1">
        {/* 2. Hero Section with Embedded Voice & Text Consult Bar */}
        <StartupHero
          onOpenConsole={scrollToConsole}
          onOpenAssistant={handleOpenAssistant}
          onStartVoice={handleStartVoice}
        />

        {/* 3. Problem Section: The Clinical Challenge */}
        <ProblemSection onOpenAssistant={handleOpenAssistant} />

        {/* 4. Solution Section: 4 Clinical Safety Pillars */}
        <SolutionSection onOpenAssistant={handleOpenAssistant} />

        {/* 5. Bedside Clinical Intelligence & Voice Reasoner Console */}
        <ClinicalIntelligenceConsole
          onOpenAssistant={handleOpenAssistant}
          onStartVoice={handleStartVoice}
        />

        {/* 6. Evidence & Guidelines: SSC 2026, Phoenix Criteria */}
        <EvidenceSection onOpenAssistant={handleOpenAssistant} />

        {/* 7. FAQ Section: Safety, Weight Verification & EHR Integration */}
        <FAQSection />
      </main>

      {/* 8. Startup Footer */}
      <StartupFooter />

      {/* 9. Floating Persistent Voice & Chat Dock */}
      <VoiceConsultDock
        onOpenAssistant={handleOpenAssistant}
        onStartVoice={handleStartVoice}
      />

      {/* 10. AI Assistant Drawer with Full Speech Recognition & Text-to-Speech */}
      <GeminiAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => {
          setIsAssistantOpen(false);
          setAssistantInitialQuery(undefined);
        }}
        patient={patient}
        priorities={rulesOutput.priorities}
        geminiMode={geminiStatus}
        initialQuery={assistantInitialQuery}
      />
    </div>
  );
}
