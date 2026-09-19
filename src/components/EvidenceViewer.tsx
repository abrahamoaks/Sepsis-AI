import React, { useState } from "react";
import {
  BookOpen,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Shield,
  FileText,
  Calendar,
  Layers,
  AlertCircle
} from "lucide-react";
import { KnowledgeDocument } from "../types/clinical";

interface EvidenceViewerProps {
  knowledgeDocuments: KnowledgeDocument[];
  onToggleDocumentActive: (id: string) => void;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({
  knowledgeDocuments,
  onToggleDocumentActive
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocId, setSelectedDocId] = useState<string>(knowledgeDocuments[0]?.id || "");

  const filteredDocs = knowledgeDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.issuingOrganization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.scope.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeDoc = knowledgeDocuments.find(d => d.id === selectedDocId) || knowledgeDocuments[0];

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-700" /> Evidence, Guideline & Protocol Knowledge Base
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Modular, versioned clinical guidance. Citations are verified against approved guidelines with exact section references.
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search guideline or topic..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-md border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-teal-700"
            />
          </div>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
          {/* Document Navigation (Left 4 cols) */}
          <div className="md:col-span-4 space-y-2 border-r border-slate-100 pr-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Active Knowledge Sources ({filteredDocs.length})
            </span>
            {filteredDocs.map(doc => (
              <button
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedDocId === doc.id
                    ? "bg-teal-50/70 border-teal-300 shadow-2xs"
                    : "bg-slate-50/50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {doc.version}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      doc.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {doc.isActive ? "Active Source" : "Inactive"}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                  {doc.title}
                </h5>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{doc.issuingOrganization}</p>
              </button>
            ))}
          </div>

          {/* Document Content View (Right 8 cols) */}
          <div className="md:col-span-8 space-y-4">
            {activeDoc ? (
              <div className="bg-slate-50/50 rounded-xl border border-slate-200 p-4 sm:p-5">
                {/* Header Information */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-200">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-teal-800 bg-teal-100/60 px-2 py-0.5 rounded">
                      {activeDoc.issuingOrganization}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">{activeDoc.title}</h4>
                    <p className="text-xs text-slate-600">Scope: {activeDoc.scope}</p>
                  </div>

                  {/* Toggle Active Switch */}
                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => onToggleDocumentActive(activeDoc.id)}
                      className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                        activeDoc.isActive
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "bg-slate-300 text-slate-700 hover:bg-slate-400"
                      }`}
                    >
                      {activeDoc.isActive ? "Source Active" : "Source Disabled"}
                    </button>
                  </div>
                </div>

                {/* Metadata badges */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 py-2.5">
                  <span>Version: <strong className="text-slate-800">{activeDoc.version}</strong></span>
                  <span>•</span>
                  <span>Published: <strong className="text-slate-800">{activeDoc.publicationDate}</strong></span>
                  <span>•</span>
                  <span>Last Reviewed: <strong className="text-slate-800">{activeDoc.reviewDate}</strong></span>
                </div>

                <p className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                  <strong>Clinical Summary:</strong> {activeDoc.summary}
                </p>

                {/* Sections & Key Excerpts */}
                <div className="space-y-3 mt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Approved Guideline Sections & Evidence Excerpts
                  </span>
                  {activeDoc.sections.map((sec, idx) => (
                    <div key={idx} className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-1.5 shadow-2xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-teal-700" />
                          {sec.sectionTitle}
                        </span>
                        {sec.pageOrParagraph && (
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {sec.pageOrParagraph}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 font-serif leading-relaxed italic bg-slate-50/50 p-2.5 rounded border border-slate-100">
                        "{sec.keyExcerpt}"
                      </p>
                      {sec.evidenceGrade && (
                        <span className="text-[10px] text-teal-800 font-semibold block pt-0.5">
                          Evidence Level: {sec.evidenceGrade}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                Select a clinical guideline document from the list to inspect approved evidence.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
