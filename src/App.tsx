/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  PatientRecord,
  PriorityWorkflowItem,
  HistoricalObservationPoint
} from "./types/clinical";
import { INITIAL_SAMPLE_PATIENT, SAMPLE_PATIENT_HISTORY } from "./data/samplePatients";
import { evaluateClinicalSafetyRules } from "./rules/pediatricEngine";

import { StartupNavbar } from "./components/StartupNavbar";
import { StartupHero } from "./components/StartupHero";
import { ProblemSection } from "./components/ProblemSection";
import { SolutionSection } from "./components/SolutionSection";
import { InteractiveCDSDemo } from "./components/InteractiveCDSDemo";
import { EvidenceSection } from "./components/EvidenceSection";
import { FAQSection } from "./components/FAQSection";
import { StartupFooter } from "./components/StartupFooter";
import { GeminiAssistantDrawer } from "./components/GeminiAssistantDrawer";

export default function App() {
  const [patient] = useState<PatientRecord>(INITIAL_SAMPLE_PATIENT);
  const [history] = useState<HistoricalObservationPoint[]>(SAMPLE_PATIENT_HISTORY);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Gemini Backend Mode Check
  const [geminiStatus, setGeminiStatus] = useState<{ live: boolean; mode: string }>({
    live: false,
    mode: "Initializing..."
  });

  useEffect(() => {
    fetch("/api/gemini/status")
      .then((res) => res.json())
      .then((data) => setGeminiStatus(data))
      .catch(() => setGeminiStatus({ live: false, mode: "Deterministic Mock Fallback" }));
  }, []);

  // Run Deterministic Safety & Workflow Rules Engine for AI Assistant Context
  const rulesOutput = useMemo(() => {
    return evaluateClinicalSafetyRules(patient, history);
  }, [patient, history]);

  const scrollToDemo = () => {
    const el = document.getElementById("how-it-works");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased selection:bg-teal-100 selection:text-teal-900">
      {/* 1. Startup Navigation Bar */}
      <StartupNavbar
        onOpenDemo={scrollToDemo}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      <main className="flex-1">
        {/* 2. Hero Section: Transforming Pediatric Sepsis Care */}
        <StartupHero
          onOpenDemo={scrollToDemo}
          onOpenAssistant={() => setIsAssistantOpen(true)}
        />

        {/* 3. Problem Section: Why Pediatric Sepsis is Medicine's Deceptive Emergency */}
        <ProblemSection />

        {/* 4. Solution Section: What Chempions AI Aims to Solve */}
        <SolutionSection />

        {/* 5. Interactive CDS Sandbox (Single-patient live simulator, no hypothetical case lists) */}
        <InteractiveCDSDemo onOpenAssistant={() => setIsAssistantOpen(true)} />

        {/* 6. Evidence & Guidelines: SSC 2026, Phoenix Criteria */}
        <EvidenceSection />

        {/* 7. FAQ Section: Safety, Weight Verification & EHR Integration */}
        <FAQSection />
      </main>

      {/* 8. Startup Footer */}
      <StartupFooter />

      {/* 9. AI Assistant Drawer (Action Plan & Clinical Follow-up Questions) */}
      <GeminiAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        patient={patient}
        priorities={rulesOutput.priorities}
        geminiMode={geminiStatus}
      />
    </div>
  );
}
