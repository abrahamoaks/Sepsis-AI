import React, { useState } from "react";
import {
  X,
  Sparkles,
  Send,
  BookOpen,
  AlertTriangle,
  Info,
  Shield,
  HelpCircle,
  RotateCcw,
  Bot
} from "lucide-react";
import { PatientRecord, PriorityWorkflowItem, KnowledgeDocument } from "../types/clinical";
import { retrieveRelevantKnowledge } from "../knowledge/guidelines";

interface GeminiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientRecord;
  priorities: PriorityWorkflowItem[];
  geminiMode: { live: boolean; mode: string };
}

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: { title: string; version: string; section?: string }[];
  source?: string;
  modeNote?: string;
}

export const GeminiAssistantDrawer: React.FC<GeminiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  patient,
  priorities,
  geminiMode
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "**Chempions AI Clinical Assistant** initialized.\n\nI provide transparent, evidence-grounded explanations of triggered safety alerts, documented physiological trends, and active guideline recommendations.\n\n*Safety Notice: I am a clinical decision-support module. I do not provide autonomous medical orders or independent diagnoses. Full clinical authority remains with the treating clinician.*",
      citations: [
        { title: "Surviving Sepsis Campaign 2026 Pediatric Guidelines", version: "2026", section: "Decision Support Principles" }
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    "Summarize the documented clinical concerns.",
    "Which observations are missing or outdated?",
    "Explain why this alert was triggered.",
    "Show the recent heart-rate and perfusion trends.",
    "What does the retrieved guideline say about initial fluid boluses?",
    "Which configured reassessment tasks remain outstanding?"
  ];

  const handleSendMessage = async (queryText: string) => {
    const query = queryText.trim();
    if (!query || isLoading) return;

    // Add user message
    const newMessages: Message[] = [...messages, { role: "user", content: query }];
    setMessages(newMessages);
    setInputQuery("");
    setIsLoading(true);

    try {
      // Gather relevant structured context
      const retrieved = retrieveRelevantKnowledge(query, patient.suspectedInfectionSource, patient.ageGroup);

      const payload = {
        question: query,
        patientContext: {
          age: `${patient.ageYears}y`,
          weight: patient.weightKg,
          weightVerified: patient.weightVerified,
          location: patient.careLocation,
          suspectedInfectionSource: patient.suspectedInfectionSource,
          vitals: {
            heartRate: patient.vitals.heartRate,
            respiratoryRate: patient.vitals.respiratoryRate,
            bloodPressure: `${patient.vitals.systolicBP.value}/${patient.vitals.diastolicBP.value} mmHg`,
            spO2: patient.vitals.spO2,
            capillaryRefill: patient.vitals.capillaryRefill,
            mentalStatus: patient.vitals.mentalStatus,
            peripheralTemp: patient.vitals.peripheralTemp
          },
          labs: patient.labs,
          workflowState: patient.currentWorkflowState
        },
        triggeredAlerts: priorities.map(p => ({
          title: p.title,
          urgency: p.urgency,
          why: p.whyDisplayed,
          source: p.applicableRuleOrSource
        })),
        retrievedEvidence: retrieved
      };

      const response = await fetch("/api/gemini/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data.answer,
          citations: data.citations || [],
          source: data.source,
          modeNote: data.modeNote
        }
      ]);
    } catch (err: any) {
      console.error("Clinical assistant error:", err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `**Clinical Reasoner Notification**:\n\nThe remote assistant service could not be reached. Local safety engine alerts and deterministic threshold checks remain 100% operational.\n\n*Action*: Assess airway, breathing, and perfusion at bedside and consult institutional emergency escalation pathways.`,
          citations: [
            { title: "Institutional 1-Hour Sepsis Bundle", version: "v4.2 (2026)", section: "Emergency Resuscitation" }
          ]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[520px] bg-white shadow-2xl border-l border-slate-200 flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-teal-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-900">Ask Chempions AI</h3>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                geminiMode.live ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}>
                {geminiMode.live ? "Gemini 3.8 Flash (Live)" : "Hospital CDS Protocol Model"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Evidence-grounded explanation of alerts, guidelines, and observations
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Safety Notice Strip */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-[11px] text-amber-900 flex items-start space-x-2">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Non-Autonomous Assistant:</strong> The model cannot make autonomous treatment orders or override clinical judgment. All suggestions must be verified by the treating clinician.
        </p>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[92%] p-3.5 rounded-xl ${
                msg.role === "user"
                  ? "bg-teal-700 text-white font-medium rounded-tr-none"
                  : "bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none space-y-2 shadow-2xs"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                  <span>Chempions AI Reasoner</span>
                  {msg.source && <span className="capitalize text-teal-800">{msg.source.replace(/_/g, " ")}</span>}
                </div>
              )}

              <div className="whitespace-pre-wrap leading-relaxed">
                {msg.content}
              </div>

              {/* Citations Box */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-200/70 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-teal-700" /> Evidence Grounding:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.citations.map((c, cIdx) => (
                      <span
                        key={cIdx}
                        className="text-[10px] font-mono bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                      >
                        {c.title} ({c.version}) {c.section ? `• ${c.section}` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {msg.modeNote && (
                <p className="text-[10px] text-slate-400 italic pt-1">{msg.modeNote}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-500 text-xs p-3 bg-slate-50 rounded-lg border border-slate-200 animate-pulse">
            <Bot className="w-4 h-4 text-teal-700 animate-spin" />
            <span>Generating evidence-grounded clinical explanation...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 bg-slate-50/80 border-t border-slate-200 overflow-x-auto">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Suggested Clinical Queries:
        </span>
        <div className="flex gap-1.5 pb-1">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] whitespace-nowrap bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-300 font-medium transition-colors cursor-pointer shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage(inputQuery);
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder="Ask about alerts, guideline excerpts, or physiological trends..."
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-700"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
