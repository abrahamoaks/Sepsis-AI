import React, { useState, useEffect } from "react";
import { AlertTriangle, Clock, RefreshCw, ShieldAlert, Sparkles, TestTube, User, MapPin } from "lucide-react";
import { PatientRecord, WorkflowState } from "../types/clinical";

interface HeaderProps {
  patient?: PatientRecord;
  elapsedMinutes?: number;
  onOpenDataEntry?: () => void;
  onOpenAssistant: () => void;
  onOpenSimulation?: () => void;
  onOpenInterventions?: () => void;
  isSimulationActive?: boolean;
  geminiMode: { live: boolean; mode: string };
  currentWorkflowState?: WorkflowState;
}

export const Header: React.FC<HeaderProps> = ({
  patient,
  elapsedMinutes = 55,
  onOpenDataEntry,
  onOpenAssistant,
  onOpenSimulation,
  onOpenInterventions,
  isSimulationActive = false,
  geminiMode,
  currentWorkflowState
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
    pediatric_ward: "Pediatric Inpatient Ward (Bed 4)",
    picu: "Pediatric Intensive Care Unit (Bed 1)",
    triage: "Pediatric Triage"
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      {/* Persistent Demonstration & Clinical Safety Banner */}
      <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between tracking-wide border-b border-amber-600">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-slate-950 shrink-0" />
          <span>
            DEMONSTRATION ONLY — NOT VALIDATED FOR CLINICAL USE. Do not use this application to diagnose, prescribe, or make treatment decisions for real patients.
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-3 text-[11px] font-medium text-slate-900">
          <span className="bg-amber-400 px-2 py-0.5 rounded text-slate-950 font-bold">Fictional Data Only</span>
          <span>Clinician retains 100% decision authority</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & System Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <span className="text-white">P</span>
            <span className="text-teal-200 text-xs font-mono ml-0.5">S</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">PediaSepsis AI</h1>
              <span className="text-xs bg-slate-100 text-slate-700 font-mono px-1.5 py-0.5 rounded border border-slate-200">
                v2.6 CDS Prototype
              </span>
              {isSimulationActive && (
                <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded flex items-center gap-1 border border-purple-200">
                  <TestTube className="w-3 h-3" /> Test Mode Active
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 hidden sm:block">
              Pediatric Sepsis Real-Time Decision Support & Deterioration Monitoring
            </p>
          </div>
        </div>

        {/* Clinical Encounter Context */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
          {/* Location */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-md text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-teal-700" />
            <span className="font-medium">{locationLabels[patient?.careLocation || "emergency_department"] || "Emergency Dept"}</span>
          </div>

          {/* Time and Freshness */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-md text-slate-700">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentTimeStr || "00:00:00"}</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1">
              <span className="text-slate-500">Encounter:</span>
              <span className="font-semibold text-slate-900">+{elapsedMinutes} min</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-700 font-medium">Live Feed (Sim)</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSimulation}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-medium text-xs flex items-center gap-1.5 border border-slate-300 transition-colors cursor-pointer"
              title="Open Validation and Test Scenarios"
            >
              <TestTube className="w-3.5 h-3.5 text-purple-700" />
              <span>Scenarios & Test Suite</span>
            </button>

            <button
              onClick={onOpenAssistant}
              className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-md font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="Ask PediaSepsis AI (Gemini Assistant)"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-200" />
              <span>Ask PediaSepsis AI</span>
              <span className={`w-1.5 h-1.5 rounded-full ${geminiMode.live ? "bg-emerald-400" : "bg-amber-300"}`}></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
