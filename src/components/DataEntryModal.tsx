import React, { useState } from "react";
import {
  X,
  Save,
  AlertTriangle,
  Scale,
  ShieldCheck,
  ShieldAlert,
  Info,
  Clock,
  UserCheck
} from "lucide-react";
import {
  PatientRecord,
  DataSourceType,
  MentalStatus,
  PeripheralTemperature
} from "../types/clinical";

interface DataEntryModalProps {
  patient: PatientRecord;
  onClose: () => void;
  onSavePatientData: (updatedPatient: PatientRecord, changeSummary: string) => void;
}

export const DataEntryModal: React.FC<DataEntryModalProps> = ({
  patient,
  onClose,
  onSavePatientData
}) => {
  // Form state
  const [weightKg, setWeightKg] = useState<string>(patient.weightKg !== null ? String(patient.weightKg) : "");
  const [weightVerified, setWeightVerified] = useState<boolean>(patient.weightVerified);
  const [suspectedSource, setSuspectedSource] = useState<string>(patient.suspectedInfectionSource);

  // Vitals
  const [hr, setHr] = useState<string>(patient.vitals.heartRate.value !== null ? String(patient.vitals.heartRate.value) : "");
  const [rr, setRr] = useState<string>(patient.vitals.respiratoryRate.value !== null ? String(patient.vitals.respiratoryRate.value) : "");
  const [sbp, setSbp] = useState<string>(patient.vitals.systolicBP.value !== null ? String(patient.vitals.systolicBP.value) : "");
  const [dbp, setDbp] = useState<string>(patient.vitals.diastolicBP.value !== null ? String(patient.vitals.diastolicBP.value) : "");
  const [spo2, setSpo2] = useState<string>(patient.vitals.spO2.value !== null ? String(patient.vitals.spO2.value) : "");
  const [temp, setTemp] = useState<string>(patient.vitals.temperature.value !== null ? String(patient.vitals.temperature.value) : "");
  const [crt, setCrt] = useState<string>(patient.vitals.capillaryRefill.value !== null ? String(patient.vitals.capillaryRefill.value) : "");
  const [mentalStatus, setMentalStatus] = useState<MentalStatus>(patient.vitals.mentalStatus.value || "altered");
  const [peripheralTemp, setPeripheralTemp] = useState<PeripheralTemperature>(patient.vitals.peripheralTemp.value || "cold");

  // Labs
  const [lactate, setLactate] = useState<string>(patient.labs.lactate.value !== null ? String(patient.labs.lactate.value) : "");
  const [glucose, setGlucose] = useState<string>(patient.labs.glucose.value !== null ? String(patient.labs.glucose.value) : "");
  const [wbc, setWbc] = useState<string>(patient.labs.whiteBloodCellCount?.value ? String(patient.labs.whiteBloodCellCount.value) : "");

  // Audit reason / notes
  const [changeNote, setChangeNote] = useState<string>("");
  const [confirmedByClinician, setConfirmedByClinician] = useState<boolean>(false);

  // Consequential changes warning
  const isHighDelta =
    (parseFloat(hr) || 0) < 100 ||
    (parseFloat(crt) || 0) <= 2 ||
    (parseFloat(lactate) || 0) < 2.0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timestamp = new Date().toISOString();
    const parseNum = (val: string) => (val.trim() === "" ? null : Number(val));

    const updatedPatient: PatientRecord = {
      ...patient,
      weightKg: parseNum(weightKg),
      weightVerified: weightVerified,
      weightMeasurementTime: weightVerified ? timestamp : patient.weightMeasurementTime,
      suspectedInfectionSource: suspectedSource,
      lastUpdated: timestamp,
      vitals: {
        ...patient.vitals,
        heartRate: {
          value: parseNum(hr),
          unit: "bpm",
          timestamp,
          source: "clinician_entered",
          sourceLabel: "Clinician Bedside Form Entry"
        },
        respiratoryRate: {
          value: parseNum(rr),
          unit: "breaths/min",
          timestamp,
          source: "clinician_entered",
          sourceLabel: "Clinician Bedside Form Entry"
        },
        systolicBP: {
          value: parseNum(sbp),
          unit: "mmHg",
          timestamp,
          source: "clinician_entered",
          sourceLabel: "Clinician Bedside Form Entry",
          isStale: false
        },
        diastolicBP: {
          value: parseNum(dbp),
          unit: "mmHg",
          timestamp,
          source: "clinician_entered",
          sourceLabel: "Clinician Bedside Form Entry",
          isStale: false
        },
        spO2: {
          value: parseNum(spo2),
          unit: "%",
          timestamp,
          source: "clinician_entered",
          sourceLabel: "Clinician Bedside Form Entry"
        },
        temperature: {
          value: parseNum(temp),
          unit: "°C",
          timestamp,
          source: "clinician_entered",
          sourceLabel: "Clinician Bedside Form Entry"
        },
        capillaryRefill: {
          value: parseNum(crt),
          unit: "seconds",
          timestamp,
          source: "clinician_entered",
          sourceLabel: "Clinician Bedside Exam"
        },
        mentalStatus: {
          value: mentalStatus,
          unit: "clinical_scale",
          timestamp,
          source: "clinician_entered",
          sourceLabel: "Clinician Bedside Exam"
        },
        peripheralTemp: {
          value: peripheralTemp,
          unit: "exam_finding",
          timestamp,
          source: "clinician_entered",
          sourceLabel: "Clinician Bedside Exam"
        }
      },
      labs: {
        ...patient.labs,
        lactate: {
          value: parseNum(lactate),
          unit: "mmol/L",
          timestamp,
          source: "clinician_entered",
          sourceLabel: "Lab Result Entry"
        },
        glucose: {
          value: parseNum(glucose),
          unit: "mmol/L",
          timestamp,
          source: "clinician_entered",
          sourceLabel: "Glucostrip Entry"
        },
        whiteBloodCellCount: {
          value: parseNum(wbc),
          unit: "x10^9/L",
          timestamp,
          source: "clinician_entered",
          sourceLabel: "Lab Result Entry"
        }
      }
    };

    const summary = changeNote || "Clinician updated clinical observations and vital signs via bedside entry form.";
    onSavePatientData(updatedPatient, summary);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-teal-700" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Clinical Data Entry & Verification</h3>
              <p className="text-xs text-slate-500">
                Update patient observations, verify weight, or correct erroneous records
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Section 1: Demographics & Weight */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
              1. Demographics & Weight Safety
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Weight (kg):</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weightKg}
                  onChange={e => setWeightKg(e.target.value)}
                  className="w-full bg-white p-2 rounded border border-slate-300 font-mono font-bold text-sm"
                  placeholder="e.g. 14.0"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-semibold mb-1">Weight Verification Status:</label>
                <div className="flex items-center space-x-3 pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={weightVerified}
                      onChange={e => setWeightVerified(e.target.checked)}
                      className="rounded border-slate-300 text-teal-700 focus:ring-teal-700 w-4 h-4"
                    />
                    <span className="text-slate-800">
                      Confirmed on Calibrated Bedside Scale / Length Tape
                    </span>
                  </label>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  If unchecked, weight-based calculations remain strictly blocked by deterministic safety engine.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Suspected Infection Source:</label>
              <input
                type="text"
                value={suspectedSource}
                onChange={e => setSuspectedSource(e.target.value)}
                className="w-full bg-white p-2 rounded border border-slate-300 text-xs font-medium"
                placeholder="e.g. Pneumonia, Urinary tract, Intra-abdominal, Meningitis..."
              />
            </div>
          </div>

          {/* Section 2: Vital Signs & Perfusion */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
              2. Hemodynamics, Respiration & Perfusion
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Heart Rate (bpm):</label>
                <input
                  type="number"
                  value={hr}
                  onChange={e => setHr(e.target.value)}
                  className="w-full bg-white p-2 rounded border border-slate-300 font-mono font-bold"
                  placeholder="bpm"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Resp Rate (/min):</label>
                <input
                  type="number"
                  value={rr}
                  onChange={e => setRr(e.target.value)}
                  className="w-full bg-white p-2 rounded border border-slate-300 font-mono font-bold"
                  placeholder="/min"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Systolic BP (mmHg):</label>
                <input
                  type="number"
                  value={sbp}
                  onChange={e => setSbp(e.target.value)}
                  className="w-full bg-white p-2 rounded border border-slate-300 font-mono font-bold"
                  placeholder="SBP"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Diastolic BP (mmHg):</label>
                <input
                  type="number"
                  value={dbp}
                  onChange={e => setDbp(e.target.value)}
                  className="w-full bg-white p-2 rounded border border-slate-300 font-mono font-bold"
                  placeholder="DBP"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">SpO₂ (%):</label>
                <input
                  type="number"
                  value={spo2}
                  onChange={e => setSpo2(e.target.value)}
                  className="w-full bg-white p-2 rounded border border-slate-300 font-mono font-bold"
                  placeholder="%"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Core Temp (°C):</label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={e => setTemp(e.target.value)}
                  className="w-full bg-white p-2 rounded border border-slate-300 font-mono font-bold"
                  placeholder="°C"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Capillary Refill (sec):</label>
                <input
                  type="number"
                  step="0.5"
                  value={crt}
                  onChange={e => setCrt(e.target.value)}
                  className="w-full bg-white p-2 rounded border border-slate-300 font-mono font-bold"
                  placeholder="sec"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Peripheries:</label>
                <select
                  value={peripheralTemp}
                  onChange={e => setPeripheralTemp(e.target.value as any)}
                  className="w-full bg-white p-2 rounded border border-slate-300 font-medium"
                >
                  <option value="warm">Warm & Pink</option>
                  <option value="cool">Cool</option>
                  <option value="cold">Cold</option>
                  <option value="mottled">Mottled</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Mental Status / Neurological Assessment:</label>
              <select
                value={mentalStatus}
                onChange={e => setMentalStatus(e.target.value as any)}
                className="w-full bg-white p-2 rounded border border-slate-300 font-medium"
              >
                <option value="alert">Alert (Normal interaction, consolable)</option>
                <option value="altered">Altered (Irritable, crying inconsolably)</option>
                <option value="lethargic">Lethargic (Drowsy, responds slowly to stimulus)</option>
                <option value="pain">Responsive only to painful stimulus</option>
                <option value="unresponsive">Unresponsive / Comatose</option>
              </select>
            </div>
          </div>

          {/* Section 3: Laboratory Investigations */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
              3. Laboratory Investigations
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Serum Lactate (mmol/L):</label>
                <input
                  type="number"
                  step="0.1"
                  value={lactate}
                  onChange={e => setLactate(e.target.value)}
                  className="w-full bg-white p-2 rounded border border-slate-300 font-mono font-bold"
                  placeholder="mmol/L"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Blood Glucose (mmol/L):</label>
                <input
                  type="number"
                  step="0.1"
                  value={glucose}
                  onChange={e => setGlucose(e.target.value)}
                  className="w-full bg-white p-2 rounded border border-slate-300 font-mono font-bold"
                  placeholder="mmol/L"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">WBC Count (×10⁹/L):</label>
                <input
                  type="number"
                  step="0.1"
                  value={wbc}
                  onChange={e => setWbc(e.target.value)}
                  className="w-full bg-white p-2 rounded border border-slate-300 font-mono font-bold"
                  placeholder="×10⁹/L"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Audit Reason & Consequential Confirmation */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-2">
            <label className="block text-slate-700 font-bold mb-1">
              Clinical Change Rationale & Audit Note:
            </label>
            <input
              type="text"
              required
              value={changeNote}
              onChange={e => setChangeNote(e.target.value)}
              placeholder="State clinical reason for updating observations (e.g. Bedside reassessment post-bolus, repeat cuff check)"
              className="w-full bg-slate-50 p-2 rounded border border-slate-300 text-xs"
            />

            <div className="pt-2 flex items-start space-x-2">
              <input
                type="checkbox"
                id="confirm-cb"
                required
                checked={confirmedByClinician}
                onChange={e => setConfirmedByClinician(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-teal-700 focus:ring-teal-700 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="confirm-cb" className="text-slate-700 cursor-pointer text-[11px] leading-tight font-medium">
                I confirm that these entered observations reflect the bedside clinical evaluation. An append-only record of this update will be recorded in the transparency audit trail.
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!confirmedByClinician}
              className="px-5 py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold rounded shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Engine</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
