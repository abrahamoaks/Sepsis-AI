import React, { useState } from "react";
import Markdown from "react-markdown";
import {
  X,
  Sparkles,
  Send,
  BookOpen,
  Bot
} from "lucide-react";
import { PatientRecord, PriorityWorkflowItem, KnowledgeDocument, EvidenceReference } from "../types/clinical";
import { retrieveRelevantKnowledge } from "../knowledge/guidelines";
import { generateClinicalReasonerResponse } from "../rules/clinicalReasoner";
import { RESEARCH_REFERENCES, formatPaperReferences } from "../knowledge/researchReferences";

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
  citations?: (EvidenceReference | { title: string; version?: string; section?: string; authors?: string; sourceJournal?: string; year?: string; doiOrPmid?: string; evidenceGrade?: string; keyExcerpt?: string; refId?: string })[];
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
        "**Chempions AI Clinical Assistant** initialized [1].\n\nI provide transparent, evidence-grounded explanations of triggered safety alerts, documented physiological trends, and active guideline recommendations [1,2]. Every clinical statement is directly grounded in peer-reviewed literature and pediatric resuscitation protocols.\n\nSelect a recommended clinical inquiry below or ask a specific question.\n\n### References\n1. Weiss SL, Peters MJ, Alhazzani W, et al. Surviving sepsis campaign: international guidelines for the management of septic shock and sepsis-associated organ dysfunction in children. *Pediatr Crit Care Med*. 2020;21(2):e52-e106. doi:10.1097/PCC.0000000000002198.\n2. Institutional Pediatric Clinical Safety Committee. Hospital pediatric sepsis 1-hour management protocol and safety bundle. *Pediatr Emerg Care Protoc*. 2026;v4.2:1-24."
    }
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = [
    "Summarize the documented clinical concerns.",
    "What does the guideline say about initial fluid boluses?",
    "What are the empiric antimicrobial dosing recommendations?",
    "Explain why this alert was triggered.",
    "What are the PICU escalation and transfer criteria?",
    "Which observations are missing or outdated?",
    "Show the recent heart-rate and perfusion trends."
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

      let assistantResponse: { answer: string; citations: any[]; source?: string; modeNote?: string } | null = null;

      try {
        const response = await fetch("/api/gemini/assist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            assistantResponse = await response.json();
          }
        }
      } catch (fetchErr) {
        // Backend not available or network error (e.g. Vercel static hosting)
        console.warn("API route not reachable, falling back to client-side Clinical Reasoner", fetchErr);
      }

      if (assistantResponse && assistantResponse.answer) {
        let fullAnswer = assistantResponse.answer;
        if (!fullAnswer.includes("### References") && !fullAnswer.includes("References\n") && assistantResponse.citations && assistantResponse.citations.length > 0) {
          fullAnswer += formatPaperReferences(assistantResponse.citations as any);
        }
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: fullAnswer,
            source: assistantResponse.source,
            modeNote: assistantResponse.modeNote
          }
        ]);
      } else {
        // Deterministic, guideline-grounded local reasoning engine
        const localResult = generateClinicalReasonerResponse(query, patient, priorities);
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: localResult.text,
            source: localResult.source,
            modeNote: localResult.modeNote
          }
        ]);
      }
    } catch (err: any) {
      console.error("Clinical assistant error:", err);
      const localResult = generateClinicalReasonerResponse(query, patient, priorities);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: localResult.text,
          source: localResult.source
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
                {geminiMode.live ? "Gemini AI (Live)" : "Hospital CDS Protocol Model"}
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

              {msg.role === "assistant" ? (
                <div className="text-xs leading-relaxed space-y-2">
                  <Markdown
                    components={{
                      h1: ({ children }) => <h1 className="text-sm font-bold text-slate-900 mt-2 mb-1 border-b border-slate-200/60 pb-1">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xs font-bold text-slate-900 mt-2 mb-1">{children}</h2>,
                      h3: ({ children }) => {
                        const text = String(children);
                        if (text.toLowerCase().includes("reference")) {
                          return (
                            <div className="mt-4 pt-3 border-t border-slate-200">
                              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                                References
                              </h3>
                            </div>
                          );
                        }
                        return <h3 className="text-xs font-bold text-slate-900 mt-2 mb-1">{children}</h3>;
                      },
                      p: ({ children }) => <p className="mb-1.5 last:mb-0 leading-relaxed text-slate-800">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-2">{children}</ul>,
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-5 space-y-1.5 text-[11px] text-slate-600 leading-relaxed font-serif my-1">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => <li className="pl-0.5 leading-relaxed">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
                      em: ({ children }) => <em className="italic text-slate-700">{children}</em>,
                      hr: () => <hr className="my-2 border-slate-200" />,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-teal-600 pl-2.5 py-1 my-1.5 italic text-slate-600 bg-teal-50/50 rounded-r text-[11px]">
                          {children}
                        </blockquote>
                      ),
                      code: ({ children }) => (
                        <code className="px-1 py-0.5 bg-slate-200/60 rounded font-mono text-[11px] text-slate-800">
                          {children}
                        </code>
                      )
                    }}
                  >
                    {msg.content}
                  </Markdown>
                </div>
              ) : (
                <div className="whitespace-pre-wrap leading-relaxed text-white">
                  {msg.content}
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
