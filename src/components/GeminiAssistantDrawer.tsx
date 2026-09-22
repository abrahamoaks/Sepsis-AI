import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";
import {
  X,
  Sparkles,
  Send,
  BookOpen,
  Bot,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { PatientRecord, PriorityWorkflowItem, EvidenceReference } from "../types/clinical";
import { retrieveRelevantKnowledge } from "../knowledge/guidelines";
import { generateClinicalReasonerResponse } from "../rules/clinicalReasoner";
import { formatPaperReferences } from "../knowledge/researchReferences";
import { useSpeechChat } from "../utils/useSpeechChat";

interface GeminiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientRecord;
  priorities: PriorityWorkflowItem[];
  geminiMode: { live: boolean; mode: string };
  initialQuery?: string;
}

interface Message {
  id: string;
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
  geminiMode,
  initialQuery
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-plan",
      role: "assistant",
      content:
        `### 1. Immediate Action Plan
1. **Safety Weight Verification**: Confirm scale weight (${patient.weightKg || 14.2} kg) before calculating fluid or drug doses [3].
2. **Pre-Antibiotic Blood Cultures**: Obtain 2 sets peripheral cultures stat (do not delay antibiotic >45m) [1].
3. **Broad-Spectrum IV Antimicrobial**: Infuse Ceftriaxone **${Math.round((patient.weightKg || 14.2) * 50)} mg IV** (50 mg/kg) within 60 minutes of recognition [1,3].
4. **Targeted Fluid Bolus**: Administer balanced crystalloid **${Math.round((patient.weightKg || 14.2) * 10)}–${Math.round((patient.weightKg || 14.2) * 20)} mL** (10–20 mL/kg) over 15–20 minutes with serial perfusion checks [1].

### 2. Clinical Follow-Up Questions
1. Does the patient exhibit signs of cold shock (capillary refill >2s, diminished distal pulses)?
2. What is the current work of breathing and oxygen saturation on room air?
3. Has the bedside scale weight been physically calibrated?

### References
1. Weiss SL, Peters MJ, et al. Surviving Sepsis Campaign: International Guidelines for Management of Septic Shock in Children. Pediatr Crit Care Med. 2020.
2. Schlapbach LJ, et al. Phoenix Criteria for Pediatric Sepsis. JAMA. 2024.
3. Institutional Pediatric Sepsis 1-Hour Management Protocol & Safety Bundle. 2026.`
    }
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Speech Hook
  const {
    isListening,
    transcript,
    interimTranscript,
    isSpeaking,
    speechError,
    isSupported,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    resetTranscript
  } = useSpeechChat({
    onTranscriptComplete: (spokenText) => {
      if (spokenText && spokenText.trim().length > 1) {
        setInputQuery(spokenText);
        handleSendMessage(spokenText);
      }
    }
  });

  // Track speech synthesis state
  useEffect(() => {
    if (!isSpeaking) {
      setSpeakingMessageId(null);
    }
  }, [isSpeaking]);

  // Handle external initial queries when drawer opens
  useEffect(() => {
    if (isOpen && initialQuery && initialQuery.trim().length > 0) {
      setInputQuery(initialQuery);
      handleSendMessage(initialQuery);
    }
  }, [isOpen, initialQuery]);

  const suggestedQuestions = [
    "⚡ Immediate Action Plan",
    "💊 Weight Dosing (14.2 kg)",
    "🫁 O2 & Fluid Resuscitation",
    "🚨 PICU Escalation Criteria",
    "⚖️ Scale Weight Safety Check",
    "📊 Phoenix Septic Shock Criteria"
  ];

  const handleSendMessage = async (queryText: string) => {
    const query = queryText.trim();
    if (!query || isLoading) return;

    // Stop speaking if playing
    stopSpeaking();
    setSpeakingMessageId(null);

    // Add user message
    const userMsgId = `user-${Date.now()}`;
    const newMessages: Message[] = [...messages, { id: userMsgId, role: "user", content: query }];
    setMessages(newMessages);
    setInputQuery("");
    resetTranscript();
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
        console.warn("API route not reachable, using client Clinical Reasoner", fetchErr);
      }

      const assistantMsgId = `asst-${Date.now()}`;

      if (assistantResponse && assistantResponse.answer) {
        let fullAnswer = assistantResponse.answer;
        if (!fullAnswer.includes("### References") && !fullAnswer.includes("References\n") && assistantResponse.citations && assistantResponse.citations.length > 0) {
          fullAnswer += formatPaperReferences(assistantResponse.citations as any);
        }
        setMessages([
          ...newMessages,
          {
            id: assistantMsgId,
            role: "assistant",
            content: fullAnswer,
            source: assistantResponse.source,
            modeNote: assistantResponse.modeNote
          }
        ]);
      } else {
        // Deterministic, guideline-grounded reasoning engine
        const localResult = generateClinicalReasonerResponse(query, patient, priorities);
        setMessages([
          ...newMessages,
          {
            id: assistantMsgId,
            role: "assistant",
            content: localResult.text,
            source: localResult.source,
            modeNote: localResult.modeNote || "Deterministic Guidelines Engine"
          }
        ]);
      }
    } catch (err: any) {
      console.error("Clinical assistant error:", err);
      const localResult = generateClinicalReasonerResponse(query, patient, priorities);
      setMessages([
        ...newMessages,
        {
          id: `asst-${Date.now()}`,
          role: "assistant",
          content: localResult.text,
          source: localResult.source,
          modeNote: "Offline Protocol Engine"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSpeakMessage = (msg: Message) => {
    if (speakingMessageId === msg.id) {
      stopSpeaking();
      setSpeakingMessageId(null);
    } else {
      setSpeakingMessageId(msg.id);
      speakText(msg.content);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity cursor-pointer"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[540px] bg-white shadow-2xl border-l border-slate-200 flex flex-col antialiased">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-black tracking-tight text-slate-900">
                  Chempions AI Clinical Reasoner
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-teal-700 animate-pulse" />
                  Voice Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Hands-free voice & text clinical decision support
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeaking();
              stopListening();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Voice Status Banner if listening */}
        {isListening && (
          <div className="bg-rose-50 border-b border-rose-200 px-4 py-3 flex items-center justify-between animate-in slide-in-from-top duration-150">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping absolute" />
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-rose-900">
                  Listening to clinical query...
                </p>
                <p className="text-[11px] text-rose-700 font-mono italic">
                  {interimTranscript || transcript || "Speak now (e.g., 'What is the Ceftriaxone dose?')..."}
                </p>
              </div>
            </div>
            <button
              onClick={stopListening}
              className="px-2.5 py-1 text-xs font-bold rounded-md bg-rose-600 text-white hover:bg-rose-700 cursor-pointer shadow-xs"
            >
              Stop
            </button>
          </div>
        )}

        {/* Speech error notice */}
        {speechError && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{speechError}</span>
          </div>
        )}

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((msg) => {
            const isThisSpeaking = speakingMessageId === msg.id && isSpeaking;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[94%] p-4 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-teal-700 text-white font-medium rounded-tr-none shadow-xs"
                      : "bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none space-y-2.5 shadow-2xs"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 text-[10px] text-slate-500 uppercase font-mono tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-teal-700" />
                        <span className="font-bold text-slate-800">Chempions Clinical Reasoner</span>
                      </div>

                      {/* Read Aloud Button */}
                      <button
                        onClick={() => toggleSpeakMessage(msg)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          isThisSpeaking
                            ? "bg-rose-100 text-rose-800 border border-rose-300 animate-pulse"
                            : "bg-white text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300"
                        }`}
                        title={isThisSpeaking ? "Stop Voice Playback" : "Read Aloud"}
                      >
                        {isThisSpeaking ? (
                          <>
                            <VolumeX className="w-3 h-3 text-rose-600" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3 text-teal-700" />
                            <span>Listen to Plan</span>
                          </>
                        )}
                      </button>
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
                                    References & Guidelines
                                  </h3>
                                </div>
                              );
                            }
                            return <h3 className="text-xs font-bold text-slate-900 mt-2 mb-1">{children}</h3>;
                          },
                          p: ({ children }) => <p className="mb-1.5 last:mb-0 leading-relaxed text-slate-800">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-2">{children}</ul>,
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-5 space-y-1.5 text-[11px] text-slate-700 leading-relaxed my-1">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => <li className="pl-0.5 leading-relaxed">{children}</li>,
                          strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
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
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-slate-600 text-xs p-3.5 bg-slate-50 rounded-xl border border-slate-200 animate-pulse">
              <Bot className="w-4 h-4 text-teal-700 animate-spin" />
              <span className="font-medium">Synthesizing guideline-verified clinical response...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompt Chips */}
        <div className="px-4 py-2.5 bg-slate-50/90 border-t border-slate-200 overflow-x-auto">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Quick Clinical Inquiries:
            </span>
            <span className="text-[10px] text-teal-700 font-medium">Tap or Speak</span>
          </div>
          <div className="flex gap-1.5 pb-1">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="text-[11px] whitespace-nowrap bg-white hover:bg-teal-50 hover:text-teal-900 hover:border-teal-300 text-slate-700 px-2.5 py-1 rounded-full border border-slate-300 font-medium transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input & Voice Controls Area */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputQuery);
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Mic Button */}
            <button
              type="button"
              onClick={() => {
                if (isListening) {
                  stopListening();
                } else {
                  startListening();
                }
              }}
              className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                isListening
                  ? "bg-rose-600 text-white animate-pulse shadow-md ring-2 ring-rose-300"
                  : "bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-300 hover:border-teal-300"
              }`}
              title={isListening ? "Stop voice listening" : "Click to speak voice clinical query"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-teal-700" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={isListening ? "Listening... speak now..." : "Ask Chempions AI about dosing, vitals, or protocols..."}
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 bg-slate-50/50"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="p-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer shadow-xs shrink-0"
              title="Send clinical query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
            <span>Voice & Text Clinical Protocol Engine</span>
            <span>Surviving Sepsis 2026 Grounded</span>
          </div>
        </div>
      </div>
    </>
  );
};
