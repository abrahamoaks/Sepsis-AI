import React, { useState, useEffect } from "react";
import {
  Users,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  MapPin,
  User,
  ShieldCheck,
  Stethoscope
} from "lucide-react";
import { PatientRecord, WorkflowState } from "../types/clinical";

interface HeaderProps {
  patient?: PatientRecord;
  elapsedMinutes?: number;
  onOpenDataEntry?: () => void;
  onOpenAssistant: () => void;
  onOpenCensus?: () => void;
  onOpenInterventions?: () => void;
  geminiMode: { live: boolean; mode: string };
  currentWorkflowState?: WorkflowState;
  censusCount?: number;
  onNextPatient?: () => void;
  onPrevPatient?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  patient,
  elapsedMinutes = 55,
  onOpenDataEntry,
  onOpenAssistant,
  onOpenCensus,
  onOpenInterventions,
  geminiMode,
  currentWorkflowState,
  censusCount = 8,
  onNextPatient,
  onPrevPatient
}) => {
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTimeStr(d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const locationLabels: Record<string, string> = {
    emergency_department: "Emergency Dept (Resus Bay 2)",
    pediatric_ward: "Pediatric Inpatient Ward (Bed 4B)",
    picu: "Pediatric Intensive Care Unit (Bed 1)",
    triage: "Pediatric Triage"
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      {/* Top Clinical Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Hospital Brand & Application Title */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-base shadow-xs">
            <Stethoscope className="w-5 h-5 text-teal-100" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-base font-extrabold text-teal-800 tracking-tight">
                Chempions AI
              </h1>
              <span className="text-slate-300">|</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                Pediatric Sepsis CDS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Clinical Decision Support & Early Deterioration Protocol (SSC 2026 Grounded)
            </p>
          </div>
        </div>

        {/* Center: Unit Census Quick Patient Navigator */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCensus}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-2 border border-slate-200 transition-colors cursor-pointer"
            title="Open Unit Census & Switch Patient"
          >
            <Users className="w-3.5 h-3.5 text-teal-700" />
            <span>Unit Census ({censusCount})</span>
          </button>

          {patient && (
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
              <span className="text-slate-500 mr-1.5 hidden md:inline">Chart:</span>
              <span className="font-bold text-slate-900 mr-1">
                {patient.name || "Leo Vance"}
              </span>
              <span className="text-slate-500 mr-2">
                ({patient.bedLocation || "Bay 2"})
              </span>
              {onPrevPatient && onNextPatient && (
                <div className="flex items-center border-l border-slate-200 pl-1.5 ml-1 gap-0.5">
                  <button
                    onClick={onPrevPatient}
                    className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                    title="Previous Patient"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={onNextPatient}
                    className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                    title="Next Patient"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Encounter Stats, Clinician, and AI Assistant */}
        <div className="flex items-center gap-3 text-xs">
          {/* Real-time Status */}
          <div className="hidden lg:flex items-center gap-2 text-slate-600">
            <div className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentTimeStr || "00:00:00"}</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 text-[11px] font-medium">EHR Connected</span>
            </div>
          </div>

          {/* Logged in Clinician Badge */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-slate-700">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-[11px]">Dr. S. Vance, MD</span>
          </div>

          {/* AI Clinical Assistant Trigger */}
          <button
            onClick={onOpenAssistant}
            className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Ask Chempions AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-200" />
            <span>Ask Chempions AI</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                geminiMode.live ? "bg-emerald-400" : "bg-teal-300"
              }`}
            ></span>
          </button>
        </div>
      </div>
    </header>
  );
};
