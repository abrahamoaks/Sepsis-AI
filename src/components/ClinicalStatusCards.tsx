import React from "react";
import {
  Heart,
  Activity,
  Wind,
  Brain,
  Thermometer,
  AlertTriangle,
  HelpCircle,
  FileQuestion,
  ChevronRight,
  Clock,
  Droplets
} from "lucide-react";
import { PatientRecord } from "../types/clinical";
import { PediatricVitalThresholds } from "../rules/pediatricEngine";

interface ClinicalStatusCardsProps {
  patient: PatientRecord;
  thresholds: PediatricVitalThresholds;
  onOpenWhySeeingThis: (title: string, data: any) => void;
  onOpenDataEntry: () => void;
}

export const ClinicalStatusCards: React.FC<ClinicalStatusCardsProps> = ({
  patient,
  thresholds,
  onOpenWhySeeingThis,
  onOpenDataEntry
}) => {
  const { vitals, labs } = patient;

  // Helpers to categorize status
  const hrVal = vitals.heartRate.value;
  const isHrAbnormal = hrVal !== null && (hrVal > thresholds.hrNormalMax || hrVal < thresholds.hrNormalMin);

  const crtVal = vitals.capillaryRefill.value;
  const isCrtAbnormal = crtVal !== null && crtVal > 2;

  const sbpVal = vitals.systolicBP.value;
  const isBpAbnormal = sbpVal !== null && sbpVal <= thresholds.hypotensionThreshold;

  const periphVal = vitals.peripheralTemp.value;
  const isPeriphAbnormal = periphVal === "cold" || periphVal === "cool" || periphVal === "mottled";

  const rrVal = vitals.respiratoryRate.value;
  const isRrAbnormal = rrVal !== null && rrVal > thresholds.rrNormalMax;

  const spo2Val = vitals.spO2.value;
  const isSpo2Abnormal = spo2Val !== null && spo2Val < 92;

  const mentalVal = vitals.mentalStatus.value;
  const isMentalAbnormal = mentalVal !== null && mentalVal !== "alert";

  const lactateVal = labs.lactate.value;
  const isLactateCritical = lactateVal !== null && lactateVal >= 4.0;
  const isLactateElevated = lactateVal !== null && lactateVal > 2.0 && lactateVal < 4.0;

  const glucoseVal = labs.glucose.value;
  const isGlucoseLow = glucoseVal !== null && glucoseVal < 3.3;

  const tempVal = vitals.temperature.value;
  const isTempAbnormal = tempVal !== null && (tempVal >= 38.5 || tempVal < 36.0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-teal-700" /> Current Physiological Systems & Findings
        </h3>
        <span className="text-[11px] text-slate-500">
          Age reference: {thresholds.ageGroupLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: Circulation & Perfusion */}
        <div className={`rounded-xl border p-4 transition-all flex flex-col justify-between ${
          isHrAbnormal || isCrtAbnormal || isBpAbnormal || isPeriphAbnormal
            ? "bg-red-50/70 border-red-200"
            : hrVal === null || sbpVal === null || crtVal === null
            ? "bg-amber-50/50 border-amber-200"
            : "bg-white border-slate-200"
        }`}>
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
              <div className="flex items-center space-x-1.5 text-slate-800">
                <Heart className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Circulation & Perfusion</span>
              </div>
              {isHrAbnormal || isCrtAbnormal || isBpAbnormal ? (
                <span className="text-[10px] font-bold uppercase bg-red-100 text-red-800 px-2 py-0.5 rounded border border-red-300">
                  Abnormal Finding
                </span>
              ) : hrVal === null || sbpVal === null ? (
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                  Insufficient Info
                </span>
              ) : (
                <span className="text-[10px] font-semibold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Within Limits
                </span>
              )}
            </div>

            <div className="mt-3 space-y-2 text-xs">
              {/* Heart Rate */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Heart Rate:</span>
                {hrVal !== null ? (
                  <span className={`font-mono font-bold ${isHrAbnormal ? "text-red-700 text-sm" : "text-slate-900"}`}>
                    {hrVal} bpm {isHrAbnormal && `(> ${thresholds.hrNormalMax} max)`}
                  </span>
                ) : (
                  <span className="text-amber-800 font-semibold italic">Missing Observation</span>
                )}
              </div>

              {/* Capillary Refill */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Capillary Refill:</span>
                {crtVal !== null ? (
                  <span className={`font-mono font-bold ${isCrtAbnormal ? "text-red-700" : "text-slate-900"}`}>
                    {crtVal} sec {isCrtAbnormal && "(> 2s prolonged)"}
                  </span>
                ) : (
                  <span className="text-amber-800 font-semibold italic">Missing Observation</span>
                )}
              </div>

              {/* Blood Pressure */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Blood Pressure:</span>
                {sbpVal !== null ? (
                  <span className={`font-mono font-bold ${isBpAbnormal ? "text-red-700 text-sm" : "text-slate-900"}`}>
                    {sbpVal}/{vitals.diastolicBP.value ?? "?"} mmHg {isBpAbnormal && `(≤ ${thresholds.hypotensionThreshold} hypotensive)`}
                  </span>
                ) : (
                  <span className="text-amber-800 font-semibold italic">Missing Observation</span>
                )}
              </div>

              {/* Peripheral Temp */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Peripheries:</span>
                {periphVal ? (
                  <span className={`font-semibold capitalize ${isPeriphAbnormal ? "text-red-700" : "text-slate-800"}`}>
                    {periphVal}
                  </span>
                ) : (
                  <span className="text-amber-800 font-semibold italic">Not Documented</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono">
              Src: {vitals.heartRate.sourceLabel ? "Multi-source" : "Manual"}
            </span>
            <button
              onClick={() => onOpenWhySeeingThis("Circulation & Perfusion Assessment", { hrVal, crtVal, sbpVal, periphVal })}
              className="text-[11px] text-teal-800 hover:text-teal-900 font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              Why this alert? <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* CARD 2: Respiratory Status */}
        <div className={`rounded-xl border p-4 transition-all flex flex-col justify-between ${
          isRrAbnormal || isSpo2Abnormal
            ? "bg-red-50/70 border-red-200"
            : rrVal === null || spo2Val === null
            ? "bg-amber-50/50 border-amber-200"
            : "bg-white border-slate-200"
        }`}>
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
              <div className="flex items-center space-x-1.5 text-slate-800">
                <Wind className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Respiratory Status</span>
              </div>
              {isRrAbnormal || isSpo2Abnormal ? (
                <span className="text-[10px] font-bold uppercase bg-red-100 text-red-800 px-2 py-0.5 rounded border border-red-300">
                  Abnormal Finding
                </span>
              ) : rrVal === null || spo2Val === null ? (
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                  Insufficient Info
                </span>
              ) : (
                <span className="text-[10px] font-semibold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  No Configured Alert
                </span>
              )}
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Respiratory Rate:</span>
                {rrVal !== null ? (
                  <span className={`font-mono font-bold ${isRrAbnormal ? "text-red-700 text-sm" : "text-slate-900"}`}>
                    {rrVal} /min {isRrAbnormal && `(> ${thresholds.rrNormalMax} tachypneic)`}
                  </span>
                ) : (
                  <span className="text-amber-800 font-semibold italic">Missing Observation</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Oxygen Saturation:</span>
                {spo2Val !== null ? (
                  <span className={`font-mono font-bold ${isSpo2Abnormal ? "text-red-700 text-sm" : "text-slate-900"}`}>
                    {spo2Val}% {isSpo2Abnormal && "(< 92% hypoxemia)"}
                  </span>
                ) : (
                  <span className="text-amber-800 font-semibold italic">Missing Observation</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Oxygen Delivery:</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {patient.respiratorySupport.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono">Work of Breathing: High</span>
            <button
              onClick={() => onOpenWhySeeingThis("Respiratory Status Criteria", { rrVal, spo2Val, support: patient.respiratorySupport })}
              className="text-[11px] text-teal-800 hover:text-teal-900 font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              Why this alert? <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* CARD 3: Neurological & Perfusion */}
        <div className={`rounded-xl border p-4 transition-all flex flex-col justify-between ${
          isMentalAbnormal
            ? "bg-red-50/70 border-red-200"
            : mentalVal === null
            ? "bg-amber-50/50 border-amber-200"
            : "bg-white border-slate-200"
        }`}>
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
              <div className="flex items-center space-x-1.5 text-slate-800">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Neurological Status</span>
              </div>
              {isMentalAbnormal ? (
                <span className="text-[10px] font-bold uppercase bg-red-100 text-red-800 px-2 py-0.5 rounded border border-red-300">
                  Abnormal Finding
                </span>
              ) : mentalVal === null ? (
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                  Requires Reassessment
                </span>
              ) : (
                <span className="text-[10px] font-semibold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Alert
                </span>
              )}
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Mental Status:</span>
                {mentalVal ? (
                  <span className={`font-bold uppercase ${isMentalAbnormal ? "text-red-700 text-sm" : "text-slate-900"}`}>
                    {mentalVal}
                  </span>
                ) : (
                  <span className="text-amber-800 font-semibold italic">Missing Observation</span>
                )}
              </div>

              <p className="text-[11px] text-slate-600 leading-tight">
                {isMentalAbnormal
                  ? "Altered responsiveness reflects impaired cerebral perfusion in pediatric sepsis."
                  : "Normal interaction with parents and examiners."}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Pupillary / Tone:</span>
                <span className="font-medium text-slate-700">Hypotonic upon exam</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono">AVPU: {mentalVal?.toUpperCase()}</span>
            <button
              onClick={() => onOpenWhySeeingThis("Neurological Dysfunction Criteria", { mentalVal })}
              className="text-[11px] text-teal-800 hover:text-teal-900 font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              Why this alert? <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* CARD 4: Labs & Metabolic Status */}
        <div className={`rounded-xl border p-4 transition-all flex flex-col justify-between ${
          isLactateCritical || isGlucoseLow
            ? "bg-red-50/70 border-red-200"
            : isLactateElevated || isTempAbnormal
            ? "bg-amber-50/70 border-amber-200"
            : lactateVal === null
            ? "bg-amber-50/50 border-amber-200"
            : "bg-white border-slate-200"
        }`}>
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
              <div className="flex items-center space-x-1.5 text-slate-800">
                <Thermometer className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Infection & Labs</span>
              </div>
              {isLactateCritical ? (
                <span className="text-[10px] font-bold uppercase bg-red-100 text-red-800 px-2 py-0.5 rounded border border-red-300">
                  Critical Hyperlactatemia
                </span>
              ) : isLactateElevated ? (
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                  Elevated Lactate
                </span>
              ) : lactateVal === null ? (
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                  Lactate Missing
                </span>
              ) : (
                <span className="text-[10px] font-semibold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  Labs Recorded
                </span>
              )}
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Serum Lactate:</span>
                {lactateVal !== null ? (
                  <span className={`font-mono font-bold ${isLactateCritical ? "text-red-700 text-sm" : isLactateElevated ? "text-amber-800" : "text-slate-900"}`}>
                    {lactateVal} mmol/L {isLactateCritical && "(≥ 4.0 critical)"}
                  </span>
                ) : (
                  <span className="text-amber-800 font-semibold italic">Lab Pending / Missing</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Blood Glucose:</span>
                {glucoseVal !== null ? (
                  <span className={`font-mono font-bold ${isGlucoseLow ? "text-red-700" : "text-slate-900"}`}>
                    {glucoseVal} mmol/L {isGlucoseLow && "(< 3.3 hypoglycemia)"}
                  </span>
                ) : (
                  <span className="text-amber-800 font-semibold italic">Not Checked</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">Core Temp:</span>
                {tempVal !== null ? (
                  <span className={`font-mono font-bold ${isTempAbnormal ? "text-amber-800" : "text-slate-900"}`}>
                    {tempVal} °C
                  </span>
                ) : (
                  <span className="text-amber-800 font-semibold italic">Unrecorded</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-600">WBC Count:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {labs.whiteBloodCellCount?.value ? `${labs.whiteBloodCellCount.value} ×10⁹/L` : "Pending"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono">Source: {patient.suspectedInfectionSource}</span>
            <button
              onClick={() => onOpenWhySeeingThis("Metabolic & Sepsis Biomarker Criteria", { lactateVal, glucoseVal, tempVal })}
              className="text-[11px] text-teal-800 hover:text-teal-900 font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              Why this alert? <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
