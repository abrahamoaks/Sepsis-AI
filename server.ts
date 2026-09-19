import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const PORT = 3000;
const app = express();
app.use(express.json());

// Lazy-initialized Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

// System instructions for Gemini clinical assistant
const CLINICAL_SAFETY_SYSTEM_INSTRUCTION = `
You are PediaSepsis AI Clinical Assistant, an evidence-grounded clinical explanation and decision-support module for healthcare professionals.

MANDATORY SAFETY AND SCOPE DIRECTIVES:
1. You are a decision-support tool for clinicians, NOT an autonomous diagnostic, prescribing, or treatment system. Full clinical authority remains strictly with the treating clinician.
2. DO NOT make independent medical diagnoses, prescribe medications, or invent unconfigured fluid or antibiotic regimens.
3. Ground every statement strictly in the structured patient observations, triggered safety rules, and retrieved clinical guideline excerpts provided in the prompt.
4. Distinguish explicitly between:
   - Documented facts and measurements
   - Clinical interpretations and risk indicators
   - Missing or outdated observations
5. Never invent or assume normal values for missing or stale observations. If data (e.g. lactate, blood pressure, verified weight) is missing or stale, explicitly highlight this limitation.
6. Clearly cite the retrieved clinical guideline (e.g., Surviving Sepsis Campaign 2026 Pediatric Guidelines, WHO Sepsis Guidance, Institutional 1-Hour Protocol) when referencing recommendations.
7. If the clinician's query asks for an unsupported treatment decision or if no local protocol covers the query, explicitly state: "Clinical recommendation not configured in the active guideline base. Refer to your institutional pediatric escalation pathway."
8. If physiological data indicates severe hypoperfusion, altered mental status, or hypotension, prominently emphasize the need for immediate bedside clinical reassessment and following emergency escalation protocols.
9. Keep tone objective, precise, professional, and concise. Avoid conversational filler or unwarranted clinical optimism.
`;

// API routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/gemini/status", (_req, res) => {
  const isLive = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY");
  res.json({
    live: isLive,
    model: "gemini-3.8-flash",
    mode: isLive ? "Live Gemini API" : "Simulated Clinical AI (Mock Mode - API Key Not Configured)"
  });
});

app.post("/api/gemini/assist", async (req, res) => {
  try {
    const { question, patientContext, triggeredAlerts, retrievedEvidence } = req.body;
    const client = getGeminiClient();

    if (!client) {
      // Deterministic, clinically grounded fallback response
      const fallbackResponse = generateMockClinicalResponse(question, patientContext, triggeredAlerts, retrievedEvidence);
      return res.json({
        answer: fallbackResponse.text,
        citations: fallbackResponse.citations,
        source: "simulated_clinical_reasoner",
        modeNote: "Generated via local deterministic clinical reasoner (GEMINI_API_KEY not set in environment)."
      });
    }

    const promptText = `
PATIENT CLINICAL CONTEXT:
${JSON.stringify(patientContext, null, 2)}

ACTIVE DETERMINISTIC SAFETY ALERTS & WORKFLOW TASKS:
${JSON.stringify(triggeredAlerts, null, 2)}

RETRIEVED GUIDELINE KNOWLEDGE EXCERPTS:
${JSON.stringify(retrievedEvidence, null, 2)}

CLINICIAN INQUIRY:
"${question}"

Provide a structured, evidence-grounded clinical response addressing the clinician's question. Reference the specific guideline sources and observations. Maintain explicit safety warnings for any missing or critical data.
`;

    const response = await client.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptText,
      config: {
        systemInstruction: CLINICAL_SAFETY_SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for factual clinical fidelity
      }
    });

    const responseText = response.text || "Unable to generate clinical explanation from model.";
    return res.json({
      answer: responseText,
      citations: Array.isArray(retrievedEvidence) ? retrievedEvidence.map((e: any) => ({
        title: e.title || "Clinical Guideline",
        version: e.version || "Current",
        section: e.section || "General"
      })) : [],
      source: "gemini_live",
      model: "gemini-3.8-flash"
    });

  } catch (error: any) {
    console.error("Gemini API error:", error);
    // Fallback gracefully without breaking client
    const { question, patientContext, triggeredAlerts, retrievedEvidence } = req.body;
    const fallback = generateMockClinicalResponse(question, patientContext, triggeredAlerts, retrievedEvidence);
    return res.json({
      answer: fallback.text,
      citations: fallback.citations,
      source: "fallback_after_api_error",
      errorDetails: error?.message || "Remote Gemini call failed; provided deterministic clinical fallback."
    });
  }
});

function generateMockClinicalResponse(
  question: string,
  patient: any,
  alerts: any[],
  evidence: any[]
): { text: string; citations: any[] } {
  const qLower = (question || "").toLowerCase();
  const citations = [
    { title: "Surviving Sepsis Campaign Pediatric Guidelines", version: "2026", section: "Initial Resuscitation & Recognition" },
    { title: "Institutional 1-Hour Pediatric Sepsis Protocol", version: "v4.2 (2026)", section: "Bundle Adherence" }
  ];

  if (qLower.includes("summarize") || qLower.includes("concern")) {
    const hr = patient?.vitals?.heartRate?.value ?? "N/A";
    const rr = patient?.vitals?.respiratoryRate?.value ?? "N/A";
    const crt = patient?.vitals?.capillaryRefill?.value ?? "N/A";
    const bp = patient?.vitals?.bloodPressure?.systolic ? `${patient.vitals.bloodPressure.systolic}/${patient.vitals.bloodPressure.diastolic} mmHg` : "Not recorded";
    const lactate = patient?.labs?.lactate?.value ?? "Pending";
    const weightStatus = patient?.weightVerified ? `Verified: ${patient.weightKg} kg` : `UNVERIFIED: ${patient?.weightKg ?? "missing"} kg (requires bedside verification before dosing)`;

    return {
      text: `**Structured Clinical Summary & Concerns**:\n\n` +
        `• **Cardiovascular & Perfusion**: Severe tachycardia (HR ${hr} bpm), prolonged capillary refill (${crt}s), cold peripheries, and documented blood pressure (${bp}) indicating abnormal perfusion/compensated to hypotensive shock.\n` +
        `• **Respiratory**: Tachypnea (RR ${rr} breaths/min) with documented hypoxemia requiring immediate airway and oxygenation reassessment.\n` +
        `• **Metabolic**: Hyperlactatemia (${lactate} mmol/L), signaling significant systemic tissue hypoperfusion.\n` +
        `• **Weight Safety Check**: Weight is ${weightStatus}.\n` +
        `• **Immediate Priority**: Bedside ABC reassessment, high-flow oxygen, IV/IO access, blood cultures prior to antimicrobials, and verified weight confirmation for protocolized fluid administration.`,
      citations
    };
  }

  if (qLower.includes("missing") || qLower.includes("outdated") || qLower.includes("stale")) {
    return {
      text: `**Missing & Stale Observation Audit**:\n\n` +
        `1. **Weight Verification**: Weight must be verified at bedside with an authorized pediatric scale or length-based tape before safety-critical fluid or medication calculation.\n` +
        `2. **Urine Output**: Catheterized or diaper-weighed urine output interval has not been documented; monitoring is required for organ dysfunction staging.\n` +
        `3. **Serial Lactate**: Initial lactate is elevated (4.1 mmol/L). Follow-up lactate should be scheduled within 2-4 hours to evaluate clearance.\n` +
        `4. **Blood Cultures**: Ensure blood cultures are drawn prior to initiating empiric intravenous antimicrobials.`,
      citations
    };
  }

  if (qLower.includes("trend") || qLower.includes("heart-rate") || qLower.includes("perfusion")) {
    return {
      text: `**Documented Trend Review**:\n\n` +
        `• **Heart Rate**: Progressive rise observed (112 → 134 → 151 → 168 bpm), meeting criteria for worsening tachycardia.\n` +
        `• **Capillary Refill**: Deteriorated from 3s to 5s, reflecting progressive microvascular hypoperfusion.\n` +
        `• **Serum Lactate**: Increased from 2.1 to 4.1 mmol/L, indicating worsening cellular hypoxia.\n\n` +
        `*Clinical Note*: Trends indicate physiological deterioration. No causal relationship to unverified interventions should be inferred without formal clinician reassessment.`,
      citations
    };
  }

  if (qLower.includes("why") || qLower.includes("alert") || qLower.includes("trigger")) {
    return {
      text: `**Alert Trigger Rationale**:\n\n` +
        `• **Criterion 1 (Tachycardia for Age)**: HR of ${patient?.vitals?.heartRate?.value || 168} bpm exceeds the 99th percentile for pediatric age group (1–5 years threshold: >140 bpm).\n` +
        `• **Criterion 2 (Hypoperfusion & Altered Status)**: CRT of 5 seconds (>2s threshold) plus altered mental status and cold peripheries satisfies institutional criteria for possible septic shock.\n` +
        `• **Criterion 3 (Hyperlactatemia)**: Serum lactate of 4.1 mmol/L exceeds the >2.0 mmol/L alert threshold and approaches critical tissue hypoxia levels (>4.0 mmol/L).\n\n` +
        `*Guideline Reference*: Surviving Sepsis Campaign 2026 recommends rapid recognition within 1 hour and immediate bedside evaluation by a senior clinician.`,
      citations
    };
  }

  return {
    text: `**PediaSepsis AI Clinical Note**:\n\n` +
      `The patient exhibits documented markers of acute physiological deterioration and suspected septic shock (elevated heart rate, tachypnea, prolonged capillary refill, altered mental status, and hyperlactatemia).\n\n` +
      `**Safety Directive**: Clinician must confirm bedside clinical findings and initiate institutional pediatric sepsis bundle immediately. Weight must be verified before administering weight-based fluid boluses or antimicrobials.`,
    citations
  };
}

// Vite integration
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PediaSepsis AI server running on http://0.0.0.0:${PORT}`);
  });
}

start();
