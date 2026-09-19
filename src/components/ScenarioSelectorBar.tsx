import React, { useState } from "react";
import {
  FlaskConical,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Play,
  Info
} from "lucide-react";
import { ValidationScenario, PatientRecord } from "../types/clinical";

interface ScenarioSelectorBarProps {
  scenarios: ValidationScenario[];
  selectedScenarioId: string;
  onSelectScenario: (scenario: ValidationScenario) => void;
  onResetToDefault: () => void;
}

export const ScenarioSelectorBar: React.FC<ScenarioSelectorBarProps> = ({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  onResetToDefault
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeScenario = scenarios.find(s => s.id === selectedScenarioId);

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-3.5 sm:p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0 border border-teal-500/30">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 font-mono">
                Clinical Simulation & Testing Suite
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                10 Scenarios Available
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-0.5">
              {activeScenario ? (activeScenario.title || activeScenario.name) : "Default Prototype Patient (Severe Septic Shock - Leo Vance)"}
            </h4>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-md border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{isOpen ? "Hide Scenarios" : "Switch Scenario"}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {selectedScenarioId !== "default" && (
            <button
              onClick={onResetToDefault}
              className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
            >
              Reset Default
            </button>
          )}
        </div>
      </div>

      {/* Description of active scenario */}
      {activeScenario && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="line-clamp-2">
            <strong className="text-teal-300">Expected Behavior:</strong> {activeScenario.expectedBehavior || (activeScenario.expectedBehaviors && activeScenario.expectedBehaviors.join(" • ")) || "Evaluates configured rules against patient observations."}
          </p>
        </div>
      )}

      {/* Expandable Scenario Selector Grid */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Select A Test Scenario to Verify Rule Engine & Clinical Workflow:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {scenarios.map(sc => {
              const isSelected = sc.id === selectedScenarioId;
              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    onSelectScenario(sc);
                    setIsOpen(false);
                  }}
                  className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-teal-950/80 border-teal-500 text-white shadow-2xs"
                      : "bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono font-bold text-teal-400">
                      {sc.id}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] bg-teal-500/30 text-teal-200 px-1.5 py-0.5 rounded font-bold">
                        Active
                      </span>
                    )}
                  </div>
                  <h5 className="text-xs font-bold text-white line-clamp-1">{sc.title || sc.name}</h5>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{sc.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
