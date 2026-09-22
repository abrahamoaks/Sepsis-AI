import React from "react";
import {
  Heart,
  Activity,
  Wind,
  Brain,
  Thermometer,
  ChevronRight,
  Droplets,
  AlertTriangle
} from "lucide-react";
import { motion } from "motion/react";
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
    <div className="space-y-2.5">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-700" />
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">
            Vital Signs & Perfusion Systems
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          Ref: {thresholds.ageGroupLabel}
        </span>
      </div>

      {/* Grid of 4 Cards: Appear on Scroll */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* CARD 1: Circulation & Perfusion */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className={`rounded-2xl border p-4 transition-all flex flex-col justify-between shadow-2xs ${
            isHrAbnormal || isCrtAbnormal || isBpAbnormal || isPeriphAbnormal
              ? "bg-rose-50/60 border-rose-200"
              : "bg-white border-slate-200/80"
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                <Heart className="w-4 h-4 text-rose-600" />
                <span>Circulation & Shock</span>
              </div>
              {isHrAbnormal || isCrtAbnormal || isBpAbnormal ? (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-200">
                  Critical
                </span>
              ) : (
                <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                  Normal
                </span>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="bg-white/80 p-2 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium block">Heart Rate</span>
                <span className={`text-lg font-black font-mono leading-tight ${isHrAbnormal ? "text-rose-700" : "text-slate-900"}`}>
                  {hrVal ?? "--"} <span className="text-[11px] font-normal text-slate-500">bpm</span>
                </span>
                <span className="text-[9px] block text-slate-400 mt-0.5">{`Max ${thresholds.hrNormalMax}`}</span>
              </div>

              <div className="bg-white/80 p-2 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium block">Cap Refill</span>
                <span className={`text-lg font-black font-mono leading-tight ${isCrtAbnormal ? "text-rose-700" : "text-slate-900"}`}>
                  {crtVal !== null ? `${crtVal}s` : "--"}
                </span>
                <span className="text-[9px] block text-slate-400 mt-0.5">&gt; 2s prolonged</span>
              </div>

              <div className="bg-white/80 p-2 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium block">Blood Pressure</span>
                <span className={`text-base font-black font-mono leading-tight ${isBpAbnormal ? "text-rose-700" : "text-slate-900"}`}>
                  {sbpVal !== null ? `${sbpVal}/${vitals.diastolicBP.value ?? "-"}` : "--"}
                </span>
                <span className="text-[9px] block text-slate-400 mt-0.5">{`Hypo ≤${thresholds.hypotensionThreshold}`}</span>
              </div>

              <div className="bg-white/80 p-2 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium block">Peripheries</span>
                <span className={`text-xs font-bold capitalize block truncate mt-1 ${isPeriphAbnormal ? "text-rose-700" : "text-slate-800"}`}>
                  {periphVal || "Normal"}
                </span>
                <span className="text-[9px] block text-slate-400 mt-0.5">Pulses / Temp</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Exam: Bedside</span>
            <button
              onClick={() => onOpenWhySeeingThis("Circulation & Shock Alert", { hrVal, crtVal, sbpVal, periphVal })}
              className="text-[11px] text-teal-800 hover:text-teal-900 font-bold flex items-center gap-0.5 cursor-pointer"
            >
              Details <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {/* CARD 2: Respiratory & Gas Exchange */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className={`rounded-2xl border p-4 transition-all flex flex-col justify-between shadow-2xs ${
            isRrAbnormal || isSpo2Abnormal
              ? "bg-amber-50/60 border-amber-200"
              : "bg-white border-slate-200/80"
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                <Wind className="w-4 h-4 text-sky-600" />
                <span>Respiration & O2</span>
              </div>
              {isRrAbnormal || isSpo2Abnormal ? (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                  Tachypneic
                </span>
              ) : (
                <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                  Adequate
                </span>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="bg-white/80 p-2 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium block">Resp Rate</span>
                <span className={`text-lg font-black font-mono leading-tight ${isRrAbnormal ? "text-amber-800" : "text-slate-900"}`}>
                  {rrVal ?? "--"} <span className="text-[11px] font-normal text-slate-500">/min</span>
                </span>
                <span className="text-[9px] block text-slate-400 mt-0.5">{`Max ${thresholds.rrNormalMax}`}</span>
              </div>

              <div className="bg-white/80 p-2 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium block">SpO2</span>
                <span className={`text-lg font-black font-mono leading-tight ${isSpo2Abnormal ? "text-rose-700" : "text-slate-900"}`}>
                  {spo2Val !== null ? `${spo2Val}%` : "--"}
                </span>
                <span className="text-[9px] block text-slate-400 mt-0.5">&lt; 92% alert</span>
              </div>

              <div className="col-span-2 bg-white/80 p-2 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">Oxygen Device</span>
                  <span className="text-xs font-bold text-slate-800 capitalize">
                    {patient.respiratorySupport.replace(/_/g, " ")}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {isSpo2Abnormal ? "High Flow Req." : "Target ≥94%"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Airway: Patent</span>
            <button
              onClick={() => onOpenWhySeeingThis("Respiratory Assessment", { rrVal, spo2Val, support: patient.respiratorySupport })}
              className="text-[11px] text-teal-800 hover:text-teal-900 font-bold flex items-center gap-0.5 cursor-pointer"
            >
              Details <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {/* CARD 3: Neurologic Status */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className={`rounded-2xl border p-4 transition-all flex flex-col justify-between shadow-2xs ${
            isMentalAbnormal
              ? "bg-purple-50/60 border-purple-200"
              : "bg-white border-slate-200/80"
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                <Brain className="w-4 h-4 text-purple-600" />
                <span>Neurologic (AVPU)</span>
              </div>
              {isMentalAbnormal ? (
                <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded border border-purple-200">
                  Altered
                </span>
              ) : (
                <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                  Alert
                </span>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="mt-3 space-y-2">
              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block">Mental Status</span>
                  <span className={`text-base font-black uppercase ${isMentalAbnormal ? "text-purple-900" : "text-slate-900"}`}>
                    {mentalVal || "Unrecorded"}
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                  {mentalVal === "alert" ? "A" : mentalVal === "verbal" ? "V" : mentalVal === "pain" ? "P" : "U"}
                </span>
              </div>

              <div className="bg-white/80 p-2 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium block">Pupils & Tone</span>
                <span className="text-xs font-semibold text-slate-700 block mt-0.5">
                  Equal, reactive • Hypotonic
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Exam: Bedside</span>
            <button
              onClick={() => onOpenWhySeeingThis("Neurologic / AVPU Assessment", { mentalVal })}
              className="text-[11px] text-teal-800 hover:text-teal-900 font-bold flex items-center gap-0.5 cursor-pointer"
            >
              Details <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>

        {/* CARD 4: Metabolic & Lactate */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className={`rounded-2xl border p-4 transition-all flex flex-col justify-between shadow-2xs ${
            isLactateCritical || isGlucoseLow
              ? "bg-rose-50/60 border-rose-200"
              : isLactateElevated || isTempAbnormal
              ? "bg-amber-50/60 border-amber-200"
              : "bg-white border-slate-200/80"
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                <Thermometer className="w-4 h-4 text-amber-600" />
                <span>Metabolic & Labs</span>
              </div>
              {isLactateCritical ? (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-200">
                  Critical Lactate
                </span>
              ) : isLactateElevated ? (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                  Elevated
                </span>
              ) : (
                <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                  Stable
                </span>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="bg-white/80 p-2 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium block">Serum Lactate</span>
                <span className={`text-lg font-black font-mono leading-tight ${isLactateCritical ? "text-rose-700" : isLactateElevated ? "text-amber-800" : "text-slate-900"}`}>
                  {lactateVal !== null ? `${lactateVal}` : "--"} <span className="text-[10px] font-normal text-slate-500">mM</span>
                </span>
                <span className="text-[9px] block text-slate-400 mt-0.5">Crit ≥ 4.0</span>
              </div>

              <div className="bg-white/80 p-2 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium block">Temperature</span>
                <span className={`text-lg font-black font-mono leading-tight ${isTempAbnormal ? "text-amber-800" : "text-slate-900"}`}>
                  {tempVal !== null ? `${tempVal}°C` : "--"}
                </span>
                <span className="text-[9px] block text-slate-400 mt-0.5">Fever &gt; 38.5</span>
              </div>

              <div className="bg-white/80 p-2 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium block">POC Glucose</span>
                <span className={`text-base font-black font-mono leading-tight ${isGlucoseLow ? "text-rose-700" : "text-slate-900"}`}>
                  {glucoseVal !== null ? `${glucoseVal}` : "--"} <span className="text-[10px] font-normal text-slate-500">mM</span>
                </span>
                <span className="text-[9px] block text-slate-400 mt-0.5">Min 3.3 mM</span>
              </div>

              <div className="bg-white/80 p-2 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium block">WBC Count</span>
                <span className="text-base font-black font-mono leading-tight text-slate-900">
                  {labs.whiteBloodCellCount?.value ? `${labs.whiteBloodCellCount.value}` : "--"}
                </span>
                <span className="text-[9px] block text-slate-400 mt-0.5">×10⁹/L</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Labs: Point-of-care</span>
            <button
              onClick={() => onOpenWhySeeingThis("Metabolic & Biomarkers", { lactateVal, glucoseVal, tempVal })}
              className="text-[11px] text-teal-800 hover:text-teal-900 font-bold flex items-center gap-0.5 cursor-pointer"
            >
              Details <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
