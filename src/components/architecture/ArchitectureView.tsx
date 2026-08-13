import React, { useState } from "react";
import { ARCHITECTURE_SECTIONS, ArchSection } from "../../types/architecture";
import { MermaidDiagram } from "../MermaidDiagram";
import { FirestoreSchemaViewer } from "./FirestoreSchemaViewer";
import { RbacPermissionViewer } from "./RbacPermissionViewer";
import { NavigationFlowViewer } from "./NavigationFlowViewer";
import {
  Cpu,
  ShieldCheck,
  Database,
  Layers,
  Sparkles,
  Zap,
  Globe,
  Lock,
  WifiOff,
  Server,
  FileCheck,
  ChevronRight,
  CheckCircle2,
  Share2,
  Key,
  Compass
} from "lucide-react";

export const ArchitectureView: React.FC = () => {
  const [viewMode, setViewMode] = useState<"system" | "firestore-schema" | "rbac-matrix" | "navigation-flow">("navigation-flow");
  const [selectedSectionId, setSelectedSectionId] = useState<string>("database-erd");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const activeSection =
    ARCHITECTURE_SECTIONS.find((s) => s.id === selectedSectionId) || ARCHITECTURE_SECTIONS[0];

  const filteredSections = ARCHITECTURE_SECTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Blueprint Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-900/60 border border-emerald-700/50 rounded-full text-xs text-emerald-300 font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Google Cloud Architecture Blueprint • Designed for 10M+ Users</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Zimbabwe Maids Centre • Production Architecture Specification
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Enterprise-grade system design combining Flutter cross-platform apps, Cloud Firestore multi-region database, Firebase Authentication, EcoCash/InnBucks payment escrow, and Google Gemini 2.5 AI verification.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full sm:w-auto">
            <div className="bg-slate-950/80 border border-emerald-800/50 p-3 rounded-2xl text-center">
              <div className="text-emerald-400 font-bold text-lg">99.99%</div>
              <div className="text-[11px] text-slate-400">Target SLA</div>
            </div>
            <div className="bg-slate-950/80 border border-emerald-800/50 p-3 rounded-2xl text-center">
              <div className="text-teal-400 font-bold text-lg">&lt; 150ms</div>
              <div className="text-[11px] text-slate-400">Latency</div>
            </div>
            <div className="bg-slate-950/80 border border-emerald-800/50 p-3 rounded-2xl text-center col-span-2 sm:col-span-1">
              <div className="text-amber-400 font-bold text-lg">10M+</div>
              <div className="text-[11px] text-slate-400">Capacity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 mb-8 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setViewMode("navigation-flow")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              viewMode === "navigation-flow"
                ? "bg-teal-900 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Compass className="w-4 h-4 text-teal-300" />
            <span>Navigation Flow & Graph</span>
          </button>

          <button
            onClick={() => setViewMode("rbac-matrix")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              viewMode === "rbac-matrix"
                ? "bg-purple-900 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Key className="w-4 h-4 text-purple-300" />
            <span>9-Role Permission Matrix (RBAC)</span>
          </button>

          <button
            onClick={() => setViewMode("firestore-schema")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              viewMode === "firestore-schema"
                ? "bg-emerald-900 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Firestore Database (18 Collections)</span>
          </button>

          <button
            onClick={() => setViewMode("system")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              viewMode === "system"
                ? "bg-emerald-900 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Cpu className="w-4 h-4 text-teal-400" />
            <span>System Architecture</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium pr-2 hidden sm:block">
          {viewMode === "navigation-flow"
            ? "Navigation Graph • Bottom Nav • Drawer • Deep Linking • Back Stack • Role Guards • State Rehydration"
            : viewMode === "rbac-matrix"
            ? "Guest • Worker • Employer • Admin • Super Admin • Moderator • Support Staff • Verification Officer • Finance Officer"
            : viewMode === "firestore-schema"
            ? "18 Collections • Document Fields • Relationships • Indexes"
            : "Multi-Tier Cloud Blueprint"}
        </div>
      </div>

      {/* Conditional View Rendering */}
      {viewMode === "navigation-flow" ? (
        <NavigationFlowViewer />
      ) : viewMode === "rbac-matrix" ? (
        <RbacPermissionViewer />
      ) : viewMode === "firestore-schema" ? (
        <FirestoreSchemaViewer />
      ) : (
        /* Main Content Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="mb-3">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Search Specification Modules
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search database, AI, payments..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
            </div>

            <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredSections.map((sec) => {
                const isSelected = sec.id === selectedSectionId;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setSelectedSectionId(sec.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between ${
                      isSelected
                        ? "bg-emerald-900 text-white border-emerald-800 shadow-md"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80"
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                            isSelected ? "bg-emerald-800 text-emerald-200" : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {sec.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold leading-snug">{sec.title}</h4>
                      <p
                        className={`text-[11px] line-clamp-1 mt-0.5 ${
                          isSelected ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        {sec.summary}
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 ml-2 mt-1 ${
                        isSelected ? "text-emerald-400" : "text-slate-400"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Architecture Section Display */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            {/* Header */}
            <div className="border-b border-slate-100 pb-5 mb-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {activeSection.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Spec ID: ZMC-ARCH-{activeSection.id.toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                {activeSection.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {activeSection.summary}
              </p>
            </div>

            {/* Mermaid Architecture Diagram */}
            {activeSection.mermaidDiagram && (
              <div className="mb-6">
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  <span>Interactive Architecture Diagram</span>
                </h4>
                <MermaidDiagram chart={activeSection.mermaidDiagram} id={activeSection.id} />
              </div>
            )}

            {/* Technical Highlights */}
            <div className="mb-6">
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Key Architectural Guarantees</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeSection.keyHighlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-2.5 p-3 bg-slate-50 border border-slate-200/80 rounded-xl"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                    <span className="text-xs text-slate-800 font-medium leading-normal">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics & Spec Specs */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Performance & Operational Benchmarks</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeSection.specs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-br from-slate-900 to-emerald-950 border border-emerald-800/40 rounded-2xl text-white shadow-sm"
                  >
                    <div className="text-[11px] text-emerald-400 uppercase font-semibold tracking-wider">
                      {spec.label}
                    </div>
                    <div className="text-lg font-bold text-white mt-1 mb-1">
                      {spec.value}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {spec.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
