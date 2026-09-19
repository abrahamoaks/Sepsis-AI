import React, { useState } from "react";
import {
  ShieldAlert,
  Clock,
  Filter,
  Search,
  CheckCircle,
  FileText,
  UserCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers
} from "lucide-react";
import { AuditEvent, AuditEventType } from "../types/clinical";

interface AuditTrailViewProps {
  auditEvents: AuditEvent[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ auditEvents }) => {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredEvents = auditEvents.filter(event => {
    const eType = event.eventType || (event.action as any) || "data_entered";
    const matchesFilter = filterType === "all" || eType === filterType;
    const matchesSearch =
      event.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.userRole || event.role || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      eType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getEventBadge = (type?: AuditEventType) => {
    switch (type) {
      case "weight_verified":
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">Weight Verified</span>;
      case "priority_completed":
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-300">Priority Actioned</span>;
      case "alert_triggered":
        return <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded border border-red-300">Safety Alert</span>;
      case "assistant_queried":
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-300">Assistant Query</span>;
      case "data_entered":
      case "data_modified":
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">Data Entry</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200">System Log</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-teal-700" /> Immutable Clinical Audit Log & Provenance
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            <strong>Append-only audit trail:</strong> Every clinical calculation, alert trigger, observation modification, and user query is permanently recorded for medico-legal accountability.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 rounded-md border border-slate-300 focus:ring-1 focus:ring-teal-700 w-40 sm:w-48"
            />
          </div>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-md border border-slate-300 bg-white text-slate-700 font-medium"
          >
            <option value="all">All Event Types</option>
            <option value="alert_triggered">Alerts Triggered</option>
            <option value="priority_completed">Priorities Actioned</option>
            <option value="weight_verified">Weight Verified</option>
            <option value="data_entered">Data Entered</option>
            <option value="data_modified">Data Modified</option>
            <option value="assistant_queried">Assistant Queried</option>
            <option value="why_seeing_this_opened">Why-Seeing-This Opened</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Clinician / Role</th>
              <th className="py-2.5 px-3">Event Type</th>
              <th className="py-2.5 px-3">Summary & Action</th>
              <th className="py-2.5 px-3">Previous vs New Values</th>
              <th className="py-2.5 px-3">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEvents.map(event => (
              <tr key={event.id} className="hover:bg-slate-50/70">
                <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap">
                  <div className="font-semibold text-slate-900">{event.userRole || event.role || "Attending Physician"}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{event.userId || event.actor || "Dr. S. Vance (MD)"}</div>
                </td>
                <td className="py-2.5 px-3 whitespace-nowrap">
                  {getEventBadge(event.eventType || (event.action as any))}
                </td>
                <td className="py-2.5 px-3 text-slate-800">
                  <p className="font-medium">{event.summary}</p>
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px]">
                  {event.previousValue && (
                    <span className="line-through text-slate-400 mr-2">{event.previousValue}</span>
                  )}
                  {event.newValue && (
                    <span className="text-slate-900 font-bold">{event.newValue}</span>
                  )}
                  {!event.previousValue && !event.newValue && (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="py-2.5 px-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {event.verificationState || "verified"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
