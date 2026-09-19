import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  Clock,
  Activity,
  History,
  Info,
  Calendar,
  Layers
} from "lucide-react";
import { HistoricalObservationPoint, PatientRecord, TrendDirection } from "../types/clinical";
import { evaluateTrendDirection } from "../rules/pediatricEngine";

interface TrendMonitorViewProps {
  history: HistoricalObservationPoint[];
  currentPatient: PatientRecord;
  onOpenReassessmentModal: () => void;
}

export const TrendMonitorView: React.FC<TrendMonitorViewProps> = ({
  history,
  currentPatient,
  onOpenReassessmentModal
}) => {
  const [selectedMetric, setSelectedMetric] = useState<"heartRate" | "capillaryRefill" | "lactate" | "respiratoryRate" | "systolicBP">("heartRate");

  // Extract arrays
  const hrSeries = history.map(h => h.heartRate).filter((v): v is number => typeof v === "number");
  const crtSeries = history.map(h => h.capillaryRefill).filter((v): v is number => typeof v === "number");
  const lactateSeries = history.map(h => h.lactate).filter((v): v is number => typeof v === "number");
  const rrSeries = history.map(h => h.respiratoryRate).filter((v): v is number => typeof v === "number");
  const sbpSeries = history.map(h => h.systolicBP).filter((v): v is number => typeof v === "number");

  const trendBadge = (direction: TrendDirection, metricType: "higherIsWorse" | "higherIsBetter") => {
    let isWorsening = false;
    let isImproving = false;

    if (direction === "insufficient_data") {
      return (
        <span className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded flex items-center gap-1">
          <Minus className="w-3 h-3" /> Insufficient Data
        </span>
      );
    }
    if (direction === "stable") {
      return (
        <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded flex items-center gap-1">
          <Minus className="w-3 h-3" /> Stable Trend
        </span>
      );
    }

    if (metricType === "higherIsWorse") {
      isWorsening = direction === "worsening";
      isImproving = direction === "improving";
    } else {
      isWorsening = direction === "improving"; // lower is worse for BP
      isImproving = direction === "worsening"; // higher is improving for BP
    }

    if (isWorsening) {
      return (
        <span className="text-[11px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded flex items-center gap-1 border border-red-200">
          <TrendingUp className="w-3 h-3 text-red-700" /> Worsening Trend
        </span>
      );
    }
    return (
      <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
        <TrendingDown className="w-3 h-3 text-emerald-700" /> Improving Trend
      </span>
    );
  };

  const metricConfigs = {
    heartRate: {
      label: "Heart Rate",
      unit: "bpm",
      series: hrSeries,
      type: "higherIsWorse" as const,
      color: "text-rose-600",
      bg: "bg-rose-50",
      normalRange: "80–140 bpm (3yo)",
      description: "Progressive tachycardia reflecting sympathetic compensation and systemic inflammatory response."
    },
    capillaryRefill: {
      label: "Capillary Refill Time",
      unit: "seconds",
      series: crtSeries,
      type: "higherIsWorse" as const,
      color: "text-orange-600",
      bg: "bg-orange-50",
      normalRange: "≤ 2.0 seconds",
      description: "Microvascular perfusion index; progressive prolongation indicates worsening tissue hypoperfusion."
    },
    lactate: {
      label: "Serum Lactate",
      unit: "mmol/L",
      series: lactateSeries,
      type: "higherIsWorse" as const,
      color: "text-purple-600",
      bg: "bg-purple-50",
      normalRange: "0.5–2.0 mmol/L",
      description: "Cellular hypoxia and anaerobic metabolism marker; doubling indicates acute metabolic strain."
    },
    respiratoryRate: {
      label: "Respiratory Rate",
      unit: "breaths/min",
      series: rrSeries,
      type: "higherIsWorse" as const,
      color: "text-sky-600",
      bg: "bg-sky-50",
      normalRange: "20–30 /min (3yo)",
      description: "Tachypnea compensating for metabolic acidosis and localized lung consolidation."
    },
    systolicBP: {
      label: "Systolic Blood Pressure",
      unit: "mmHg",
      series: sbpSeries,
      type: "higherIsBetter" as const,
      color: "text-amber-600",
      bg: "bg-amber-50",
      normalRange: "> 76 mmHg (5th percentile 3yo)",
      description: "Downward progression from compensated to decompensated hypotensive shock."
    }
  };

  const currentActiveMetric = metricConfigs[selectedMetric];

  return (
    <div className="space-y-4">
      {/* Header & Clinical Safety Note on Trends */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-teal-700" /> Longitudinal Physiological Trend Analysis
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tracks sequential observations to distinguish worsening, stable, and improving trajectories.
            </p>
          </div>
          <button
            onClick={onOpenReassessmentModal}
            className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            Record Reassessment Finding
          </button>
        </div>

        {/* Non-Causal Attribution Warning */}
        <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 flex items-start space-x-2">
          <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <p>
            <strong>Causal Inference Restriction:</strong> The system does not infer direct causality between documented interventions and subsequent physiological changes based solely on temporal proximity. Clinicians must conduct bedside evaluations to verify patient response.
          </p>
        </div>

        {/* Key Trend Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {/* Heart Rate Progression */}
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-700">Heart Rate Progression</span>
              {trendBadge(evaluateTrendDirection(hrSeries), "higherIsWorse")}
            </div>
            <div className="font-mono text-sm font-bold text-slate-900">
              {hrSeries.length > 0 ? hrSeries.join(" → ") + " bpm" : "No trend history"}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Normal: 80–140 bpm</p>
          </div>

          {/* Capillary Refill Progression */}
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-700">Capillary Refill Progression</span>
              {trendBadge(evaluateTrendDirection(crtSeries), "higherIsWorse")}
            </div>
            <div className="font-mono text-sm font-bold text-slate-900">
              {crtSeries.length > 0 ? crtSeries.join(" → ") + " seconds" : "No trend history"}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Normal: ≤ 2.0 seconds</p>
          </div>

          {/* Lactate Progression */}
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-700">Serum Lactate Progression</span>
              {trendBadge(evaluateTrendDirection(lactateSeries), "higherIsWorse")}
            </div>
            <div className="font-mono text-sm font-bold text-slate-900">
              {lactateSeries.length > 0 ? lactateSeries.join(" → ") + " mmol/L" : "No trend history"}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Normal: 0.5–2.0 mmol/L</p>
          </div>
        </div>
      </div>

      {/* Interactive Trend Chart Inspector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Detailed Metric History</h4>
            <p className="text-xs text-slate-500">Select a physiological parameter to inspect historical timeline</p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {(Object.keys(metricConfigs) as (keyof typeof metricConfigs)[]).map(key => {
              const cfg = metricConfigs[key];
              const isSelected = selectedMetric === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedMetric(key)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-teal-700 text-white shadow-2xs font-semibold"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Metric Detail Header */}
        <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Parameter</span>
            <div className="flex items-baseline space-x-2">
              <h5 className="text-lg font-bold text-slate-900">{currentActiveMetric.label}</h5>
              <span className="text-xs text-slate-500 font-mono">Unit: {currentActiveMetric.unit}</span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">{currentActiveMetric.description}</p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-500">Expected Pediatric Normal:</span>
            <p className="text-xs font-bold text-slate-800">{currentActiveMetric.normalRange}</p>
          </div>
        </div>

        {/* Timeline Table / Visualization */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Timestamp / Interval</th>
                <th className="py-2.5 px-3">Observed Value</th>
                <th className="py-2.5 px-3">Reference Threshold</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Clinical Context / Event</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((point, index) => {
                const val = point[selectedMetric];
                const isAbnormal =
                  selectedMetric === "heartRate"
                    ? (val ?? 0) > 140
                    : selectedMetric === "capillaryRefill"
                    ? (val ?? 0) > 2
                    : selectedMetric === "lactate"
                    ? (val ?? 0) > 2.0
                    : selectedMetric === "respiratoryRate"
                    ? (val ?? 0) > 30
                    : (val ?? 99) <= 76;

                return (
                  <tr key={index} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {new Date(point.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 text-sm">
                      {val !== undefined ? `${val} ${currentActiveMetric.unit}` : "Not recorded"}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{currentActiveMetric.normalRange}</td>
                    <td className="py-2.5 px-3">
                      {val === undefined ? (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">Unrecorded</span>
                      ) : isAbnormal ? (
                        <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold border border-red-200">
                          Abnormal
                        </span>
                      ) : (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium">
                      {point.eventNote || "Routine bedside observation"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
