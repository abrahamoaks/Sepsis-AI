import React, { useState } from "react";
import {
  X,
  Users,
  Search,
  Bed,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter
} from "lucide-react";
import { ValidationScenario } from "../types/clinical";

interface PatientCensusModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenarios: ValidationScenario[];
  selectedScenarioId: string;
  onSelectScenario: (scenario: ValidationScenario) => void;
  onResetToDefault: () => void;
}

export const PatientCensusModal: React.FC<PatientCensusModalProps> = ({
  isOpen,
  onClose,
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  onResetToDefault
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterUnit, setFilterUnit] = useState<"all" | "ed" | "picu" | "ward">("all");

  if (!isOpen) return null;

  const filteredPatients = scenarios.filter(sc => {
    const nameMatch = (sc.patientName || sc.name || sc.title)
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      sc.patientData.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sc.bedLocation || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!nameMatch) return false;

    if (filterUnit === "ed") return sc.patientData.careLocation === "emergency_department";
    if (filterUnit === "picu") return sc.patientData.careLocation === "picu";
    if (filterUnit === "ward") return sc.patientData.careLocation === "pediatric_ward";
    return true;
  });

  const getAcuityBadge = (acuity?: string) => {
    if (!acuity) return null;
    if (acuity.includes("Critical") || acuity.includes("Level 1")) {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 px-2 py-0.5 rounded border border-red-200">
          Level 1 • Critical
        </span>
      );
    }
    if (acuity.includes("Urgent") || acuity.includes("Level 2")) {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-200">
          Level 2 • Urgent
        </span>
      );
    }
    if (acuity.includes("Guarded") || acuity.includes("Level 3")) {
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-2 py-0.5 rounded border border-sky-200">
          Level 3 • Guarded
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
        Level 4 • Stable
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs antialiased">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Pediatric Unit Census & Patient Roster
              </h3>
              <p className="text-xs text-slate-500">
                Chempions AI Pediatric CDS • Active admissions across Emergency, PICU, and Inpatient units
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Close Census"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Unit Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold text-slate-600">
            <button
              onClick={() => setFilterUnit("all")}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                filterUnit === "all" ? "bg-white text-slate-900 shadow-2xs font-bold" : "hover:text-slate-900"
              }`}
            >
              All Admissions ({scenarios.length})
            </button>
            <button
              onClick={() => setFilterUnit("ed")}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                filterUnit === "ed" ? "bg-white text-slate-900 shadow-2xs font-bold" : "hover:text-slate-900"
              }`}
            >
              Emergency ({scenarios.filter(s => s.patientData.careLocation === "emergency_department").length})
            </button>
            <button
              onClick={() => setFilterUnit("picu")}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                filterUnit === "picu" ? "bg-white text-slate-900 shadow-2xs font-bold" : "hover:text-slate-900"
              }`}
            >
              PICU ({scenarios.filter(s => s.patientData.careLocation === "picu").length})
            </button>
            <button
              onClick={() => setFilterUnit("ward")}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                filterUnit === "ward" ? "bg-white text-slate-900 shadow-2xs font-bold" : "hover:text-slate-900"
              }`}
            >
              Ward ({scenarios.filter(s => s.patientData.careLocation === "pediatric_ward").length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, MRN, or bed..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-teal-700 text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Patient Roster List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredPatients.map(sc => {
            const isCurrent = sc.id === selectedScenarioId;
            const pt = sc.patientData;

            return (
              <div
                key={sc.id}
                onClick={() => {
                  onSelectScenario(sc);
                  onClose();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCurrent
                    ? "bg-teal-50/70 border-teal-500 shadow-xs ring-1 ring-teal-500/50"
                    : "bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {sc.patientName || pt.name || sc.title}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      ({pt.ageYears}y {pt.ageMonths > 0 ? `${pt.ageMonths}m` : ""} {pt.sex === "M" ? "Male" : "Female"})
                    </span>
                    <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      MRN: {pt.mrn}
                    </span>
                    {getAcuityBadge(sc.acuityLevel)}
                    {isCurrent && (
                      <span className="text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded">
                        Active Chart
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800">
                        {sc.bedLocation || pt.bedLocation || "Pediatric Unit"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-slate-400" />
                      <span className="line-clamp-1">{sc.description}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3 pt-0.5">
                    <span>
                      Weight: <strong className="text-slate-700">{pt.weightKg ?? "?"} kg</strong>{" "}
                      {pt.weightVerified ? (
                        <span className="text-emerald-700 font-semibold">(Verified)</span>
                      ) : (
                        <span className="text-amber-700 font-semibold">(Unverified)</span>
                      )}
                    </span>
                    <span>•</span>
                    <span>
                      Diagnosis Focus: <strong className="text-slate-700">{pt.suspectedInfectionSource}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center sm:self-center gap-2 shrink-0">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onSelectScenario(sc);
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isCurrent
                        ? "bg-teal-700 text-white shadow-2xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                    }`}
                  >
                    <span>{isCurrent ? "Current Patient" : "Open Chart"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredPatients.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-xs">
              No admitted patients matched your search query.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>{scenarios.length} Total Patients Admitted to Service</span>
          <button
            onClick={() => {
              onResetToDefault();
              onClose();
            }}
            className="text-teal-800 hover:text-teal-900 font-semibold hover:underline cursor-pointer"
          >
            Reset to Primary Triage Patient (Leo Vance)
          </button>
        </div>
      </div>
    </div>
  );
};
