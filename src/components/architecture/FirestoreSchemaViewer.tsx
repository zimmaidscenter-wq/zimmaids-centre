import React, { useState } from "react";
import { COMPLETE_FIRESTORE_SCHEMA, FirestoreCollectionSpec } from "../../data/firestoreSchemaData";
import {
  Database,
  Search,
  Key,
  FolderTree,
  ShieldAlert,
  Sliders,
  Sparkles,
  Layers,
  Code2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Tag,
  Share2
} from "lucide-react";

export const FirestoreSchemaViewer: React.FC = () => {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("users");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"fields" | "subcollections" | "relationships" | "indexing" | "security">("fields");

  const categories = ["All", "Identity & RBAC", "Core Marketplace", "Engagement & Chat", "Financials & Trust", "Operations & Content"];

  const filteredCollections = COMPLETE_FIRESTORE_SCHEMA.filter((col) => {
    const matchesCategory = categoryFilter === "All" || col.category === categoryFilter;
    const matchesSearch =
      col.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      col.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      col.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      col.fields.some((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const selectedCol =
    COMPLETE_FIRESTORE_SCHEMA.find((c) => c.id === selectedCollectionId) ||
    filteredCollections[0] ||
    COMPLETE_FIRESTORE_SCHEMA[0];

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedCol, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/40 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-900/70 border border-emerald-700/60 rounded-full text-xs text-emerald-300 font-semibold mb-2">
              <Database className="w-3.5 h-3.5 text-amber-300" />
              <span>Full Cloud Firestore Database Architecture • 18 Collections</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Zimbabwe Maids Centre • Complete Firestore Schema & Subcollections
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Exhaustive database design including all document fields, relationships, subcollections, compound & geospatial index recommendations, and security policies.
            </p>
          </div>

          <button
            onClick={handleCopyJSON}
            className="self-start md:self-center inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "JSON Copied!" : "Export Selected Collection JSON"}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? "bg-emerald-900 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search fields, paths, collections..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Collection Selector Sidebar */}
        <div className="lg:col-span-4 space-y-2 max-h-[700px] overflow-y-auto pr-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1 mb-2">
            Database Collections ({filteredCollections.length})
          </div>
          {filteredCollections.map((col) => {
            const isSelected = col.id === selectedCol.id;
            return (
              <button
                key={col.id}
                onClick={() => setSelectedCollectionId(col.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between group ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-800 shadow-md ring-2 ring-emerald-500/50"
                    : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        isSelected ? "bg-emerald-800 text-emerald-200" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {col.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{col.fields.length} Fields</span>
                  </div>
                  <h4 className="text-xs font-extrabold">{col.name}</h4>
                  <div className="text-[11px] font-mono text-emerald-400/90 truncate mt-0.5">
                    {col.path}
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 mt-2 transition-transform ${
                    isSelected ? "text-emerald-400 translate-x-1" : "text-slate-300"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Collection Detail Viewer */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            {/* Header info */}
            <div className="border-b border-slate-100 pb-5 mb-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {selectedCol.category}
                </span>
                <span className="text-xs font-mono text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  Path: {selectedCol.path}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{selectedCol.name}</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{selectedCol.summary}</p>
            </div>

            {/* Sub-tabs for Collection Detail */}
            <div className="flex border-b border-slate-200 mb-6 gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab("fields")}
                className={`pb-3 text-xs font-bold border-b-2 transition-all px-2 whitespace-nowrap ${
                  activeTab === "fields"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Document Fields ({selectedCol.fields.length})
              </button>
              <button
                onClick={() => setActiveTab("subcollections")}
                className={`pb-3 text-xs font-bold border-b-2 transition-all px-2 whitespace-nowrap ${
                  activeTab === "subcollections"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Subcollections ({selectedCol.subcollections.length})
              </button>
              <button
                onClick={() => setActiveTab("relationships")}
                className={`pb-3 text-xs font-bold border-b-2 transition-all px-2 whitespace-nowrap ${
                  activeTab === "relationships"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Relationships ({selectedCol.relationships.length})
              </button>
              <button
                onClick={() => setActiveTab("indexing")}
                className={`pb-3 text-xs font-bold border-b-2 transition-all px-2 whitespace-nowrap ${
                  activeTab === "indexing"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Indexes ({selectedCol.indexing.length})
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`pb-3 text-xs font-bold border-b-2 transition-all px-2 whitespace-nowrap ${
                  activeTab === "security"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Security Policy
              </button>
            </div>

            {/* TAB 1: Document Fields */}
            {activeTab === "fields" && (
              <div className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                        <th className="py-2.5 px-3">Field Name</th>
                        <th className="py-2.5 px-3">Data Type</th>
                        <th className="py-2.5 px-3">Required</th>
                        <th className="py-2.5 px-3">FK Reference</th>
                        <th className="py-2.5 px-3">Description & Enums</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedCol.fields.map((f, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                            {f.name}
                          </td>
                          <td className="py-3 px-3 font-mono text-emerald-700 font-semibold">
                            {f.type}
                          </td>
                          <td className="py-3 px-3">
                            {f.required ? (
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                                REQUIRED
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px]">
                                OPTIONAL
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                            {f.fk ? (
                              <span className="inline-flex items-center space-x-1 text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 font-semibold">
                                <Key className="w-3 h-3 text-teal-600" />
                                <span>{f.fk}</span>
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-700 leading-snug">
                            <p>{f.description}</p>
                            {f.enumValue && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {f.enumValue.map((ev) => (
                                  <span
                                    key={ev}
                                    className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded text-[10px] font-mono"
                                  >
                                    '{ev}'
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: Subcollections */}
            {activeTab === "subcollections" && (
              <div className="space-y-4">
                {selectedCol.subcollections.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
                    This collection operates as a flat top-level document structure with no nested subcollections.
                  </div>
                ) : (
                  selectedCol.subcollections.map((sub, sIdx) => (
                    <div key={sIdx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                          <FolderTree className="w-4 h-4 text-emerald-600" />
                          <span>{sub.name} Subcollection</span>
                        </h4>
                        <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Path: {sub.path}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-3">{sub.description}</p>

                      <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold">
                              <th className="py-2 px-3">Field</th>
                              <th className="py-2 px-3">Type</th>
                              <th className="py-2 px-3">Required</th>
                              <th className="py-2 px-3">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {sub.fields.map((sf, sfIdx) => (
                              <tr key={sfIdx}>
                                <td className="py-2 px-3 font-mono font-bold text-slate-800">{sf.name}</td>
                                <td className="py-2 px-3 font-mono text-emerald-700">{sf.type}</td>
                                <td className="py-2 px-3">
                                  {sf.required ? (
                                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                                      YES
                                    </span>
                                  ) : (
                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                      NO
                                    </span>
                                  )}
                                </td>
                                <td className="py-2 px-3 text-slate-600">{sf.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: Relationships */}
            {activeTab === "relationships" && (
              <div className="space-y-3">
                {selectedCol.relationships.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
                    No explicit foreign key relationships bound to other collections.
                  </div>
                ) : (
                  selectedCol.relationships.map((rel, rIdx) => (
                    <div
                      key={rIdx}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 bg-emerald-900 text-white rounded text-[10px] font-bold">
                            {rel.type}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            Target: {rel.targetCollection}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-slate-700 font-semibold mt-1">
                          Link: {rel.foreignKey}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{rel.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 4: Indexing Recommendations */}
            {activeTab === "indexing" && (
              <div className="space-y-3">
                {selectedCol.indexing.map((idx, iIdx) => (
                  <div key={iIdx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                        {idx.type} Index
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {idx.fields.map((f, fIdx) => (
                        <div
                          key={fIdx}
                          className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-900 text-white rounded-xl text-xs font-mono"
                        >
                          <span>{f.name}</span>
                          <span className="text-amber-400 font-bold text-[10px]">({f.mode})</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-slate-600 italic mt-1">
                      Query Purpose: {idx.queryPurpose}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: Security Policy */}
            {activeTab === "security" && (
              <div className="p-5 bg-gradient-to-br from-slate-900 to-emerald-950 border border-emerald-800/40 rounded-2xl text-white space-y-3">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Firestore Security Rule Policy</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedCol.securitySummary}
                </p>
                <div className="pt-2 border-t border-emerald-800/50 text-[11px] text-emerald-300/80">
                  Enforced at backend layer via <code className="text-amber-300">firestore.rules</code> with strict key allowlisting and UID authorization checks.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
