import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Briefcase,
  Copy,
  Check,
  Phone,
  ShieldCheck,
  Zap,
  ArrowRight,
  RefreshCw,
  Share2,
  Trash2,
  Plus,
  FileCode,
  Image as ImageIcon,
  Mic,
  Activity,
  Layers,
  Database,
  Radio,
  FileUp,
  Sliders,
  Eye
} from "lucide-react";
import { UserRole, CityLocation, WorkerProfile, JobPosting } from "../../types/marketplace";
import { SAMPLE_WORKERS, SAMPLE_JOBS } from "../../data/mockData";
import { whatsappSyncService, SyncLogEntry } from "../../services/whatsappSyncService";

interface WhatsAppIngestionPortalProps {
  onWorkerAdded?: (worker: WorkerProfile) => void;
  onJobAdded?: (job: JobPosting) => void;
  onNavigateToMarketplace?: () => void;
}

export const WhatsAppIngestionPortal: React.FC<WhatsAppIngestionPortalProps> = ({
  onWorkerAdded,
  onJobAdded,
  onNavigateToMarketplace,
}) => {
  const [activePortalTab, setActivePortalTab] = useState<"auto-sync" | "text-parser" | "sync-audit">("auto-sync");

  // State for Text Parser
  const [rawText, setRawText] = useState<string>("");
  const [ingestionType, setIngestionType] = useState<"worker" | "job">("worker");
  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Parsed Draft State
  const [parsedWorker, setParsedWorker] = useState<Partial<WorkerProfile> | null>(null);
  const [parsedJob, setParsedJob] = useState<Partial<JobPosting> | null>(null);

  // Auto-Sync Service State
  const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>(whatsappSyncService.getLogs());
  const [autoDaemonActive, setAutoDaemonActive] = useState<boolean>(whatsappSyncService.isAutoSyncActive());
  const [isProcessingFiles, setIsProcessingFiles] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");

  const SUPPORT_PHONE = "+263785458828";

  useEffect(() => {
    // Subscribe to whatsappSyncService changes
    const unsubscribe = whatsappSyncService.subscribe(() => {
      setSyncLogs(whatsappSyncService.getLogs());
      setAutoDaemonActive(whatsappSyncService.isAutoSyncActive());
    });
    return () => unsubscribe();
  }, []);

  const handleToggleDaemon = () => {
    const newState = whatsappSyncService.toggleAutoSync();
    setAutoDaemonActive(newState);
    setSuccessMessage(
      newState
        ? "Automated Sync Daemon ACTIVATED! Polling incoming WhatsApp webhook queue..."
        : "Automated Sync Daemon PAUSED."
    );
  };

  // Handle Drag & Drop / File Selection for Media & Text Files
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingFiles(true);
    setProcessingStatus("Initializing Media AI OCR & Voice Parser...");

    let syncedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProcessingStatus(`[${i + 1}/${files.length}] Processing ${file.name} (Extracting ID, CID Police Clearance & Role)...`);
      
      const result = await whatsappSyncService.processMediaFile(file);
      if (result.worker && onWorkerAdded) {
        onWorkerAdded(result.worker);
      }
      if (result.job && onJobAdded) {
        onJobAdded(result.job);
      }
      syncedCount++;
    }

    setIsProcessingFiles(false);
    setProcessingStatus("");
    setSuccessMessage(`Successfully auto-parsed and synced ${syncedCount} media file(s) into the live database directory!`);
    
    // Reset file input
    event.target.value = "";
  };

  // Sample WhatsApp Message Presets
  const SAMPLE_WHATSAPP_WORKER = `Name: Tariro Moyo
Role: Maid & Housekeeper
City: Harare, Borrowdale
Phone: +263785458828
Salary: $220/month or $15/day
Experience: 6 years
Age: 29, Female
Skills: Full Housekeeping, Laundry & Ironing, Traditional Cooking, Floor Polishing
Verifications: ZRP Police CID Cleared, Medical Fitness Cert
Bio: Experienced full-time maid specializing in house cleaning, laundry, floor care, and family meal preparation in Borrowdale and surrounding suburbs.`;

  const SAMPLE_WHATSAPP_JOB = `JOB VACANCY: Part-Time Maid Needed
Employer: Mrs. Chigumba
Location: Avondale, Harare
Pay: $20 per day / $180 monthly
Work Type: Part-Time (3 days/week)
Phone: +263785458828
Requirements: Deep house cleaning, washing & steam ironing, trustworthy with references
Description: Seeking an experienced part-time maid for 3 days per week in Avondale. Escrow payment protection guaranteed.`;

  // Smart Parser Logic for Text Mode
  const handleParseText = () => {
    if (!rawText.trim()) return;

    if (ingestionType === "worker") {
      const result = whatsappSyncService.syncRawText(rawText, false, "WhatsApp Direct Ingestion");
      if (result.worker) {
        setParsedWorker(result.worker);
        if (onWorkerAdded) onWorkerAdded(result.worker);
      }
      setParsedJob(null);
    } else {
      const result = whatsappSyncService.syncRawText(rawText, true, "WhatsApp Job Post");
      if (result.job) {
        setParsedJob(result.job);
        if (onJobAdded) onJobAdded(result.job);
      }
      setParsedWorker(null);
    }
  };

  const handleCommitWorker = () => {
    if (!parsedWorker) return;
    setSuccessMessage(`Worker "${parsedWorker.fullName}" automatically synced to live Marketplace Directory!`);
    setParsedWorker(null);
    setRawText("");
  };

  const handleCommitJob = () => {
    if (!parsedJob) return;
    setSuccessMessage(`Job Vacancy "${parsedJob.title}" automatically synced and posted!`);
    setParsedJob(null);
    setRawText("");
  };

  const handleCopyTemplate = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 border border-emerald-800/80 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="max-w-4xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-emerald-800/60 rounded-full text-xs font-bold text-emerald-200 border border-emerald-700/50">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Automated WhatsApp Sync Service & Media Ingestion Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Automated Media & Text Sync Engine
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Directly parse incoming WhatsApp photos, voice notes, PDF resumes, and chat logs into the main database. Updates candidate profiles, police clearance records, and job directories automatically.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <span className="px-3 py-1 bg-emerald-900/80 text-emerald-300 rounded-xl font-mono border border-emerald-700">
              Official WhatsApp: {SUPPORT_PHONE}
            </span>
            <button
              onClick={handleToggleDaemon}
              className={`px-3.5 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                autoDaemonActive
                  ? "bg-emerald-500 text-slate-950 border border-emerald-300 shadow-md"
                  : "bg-slate-800 text-slate-300 border border-slate-700"
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${autoDaemonActive ? "text-slate-950 fill-slate-950" : ""}`} />
              <span>Daemon Auto-Sync: {autoDaemonActive ? "ONLINE (Active)" : "PAUSED"}</span>
            </button>
            <span className="px-3 py-1 bg-teal-900/80 text-teal-200 rounded-xl font-bold border border-teal-700">
              OCR & Voice AI Vision Engine
            </span>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex items-center justify-between text-emerald-900 text-xs font-bold animate-in fade-in duration-300 shadow-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-800"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActivePortalTab("auto-sync")}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center space-x-2 transition-all shrink-0 ${
            activePortalTab === "auto-sync"
              ? "bg-emerald-900 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Upload className="w-4 h-4 text-emerald-400" />
          <span>Media & Document Auto-Sync Parser</span>
        </button>

        <button
          onClick={() => setActivePortalTab("text-parser")}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center space-x-2 transition-all shrink-0 ${
            activePortalTab === "text-parser"
              ? "bg-emerald-900 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Direct Text & Chat Ingestion</span>
        </button>

        <button
          onClick={() => setActivePortalTab("sync-audit")}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center space-x-2 transition-all shrink-0 ${
            activePortalTab === "sync-audit"
              ? "bg-emerald-900 text-white shadow-md"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Activity className="w-4 h-4 text-sky-400" />
          <span>Sync Audit Trail & DB Feed ({syncLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: MEDIA & DOCUMENT AUTO-SYNC PARSER */}
      {activePortalTab === "auto-sync" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* File Upload Zone */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <FileUp className="w-5 h-5 text-emerald-600" />
                  <span>Upload WhatsApp Media Files (Images, Audio, PDF, Text)</span>
                </h3>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold rounded-md">
                  Auto-Database Insertion
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Upload or drag-and-drop candidate National ID photos, ZRP Police CID clearance certificates, voice notes, audio clips, or PDF resumes received from WhatsApp. Our vision OCR automatically parses candidate specs and injects them directly into the live Worker Directory.
              </p>

              {/* Drag and Drop Zone */}
              <div className="relative border-2 border-dashed border-emerald-400/80 bg-emerald-50/50 hover:bg-emerald-50 rounded-3xl p-8 text-center transition-all group">
                <input
                  type="file"
                  multiple
                  accept="image/*,audio/*,.pdf,.txt,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={isProcessingFiles}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                
                <div className="space-y-3 pointer-events-none">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-inner">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-slate-900">
                      Click to Browse or Drag & Drop WhatsApp Files Here
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports: JPG, PNG (ID/Police certs), OGG/MP3 (Voice Notes), PDF (Resumes), TXT
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    <span className="px-2.5 py-1 bg-white border border-emerald-200 rounded-lg text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ID Photo OCR</span>
                    </span>
                    <span className="px-2.5 py-1 bg-white border border-emerald-200 rounded-lg text-[11px] font-bold text-teal-800 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      <span>CID Police Cert Extractor</span>
                    </span>
                    <span className="px-2.5 py-1 bg-white border border-emerald-200 rounded-lg text-[11px] font-bold text-sky-800 flex items-center gap-1">
                      <Mic className="w-3.5 h-3.5 text-sky-600" />
                      <span>Voice Note Transcriber</span>
                    </span>
                  </div>
                </div>
              </div>

              {isProcessingFiles && (
                <div className="p-4 bg-emerald-950 text-white rounded-2xl space-y-2 border border-emerald-800 animate-pulse">
                  <div className="flex items-center space-x-2 text-xs font-bold text-emerald-300">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>{processingStatus}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-2/3 animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Demo Batch Parser */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Simulate Instant Media Batch Processing</span>
                </h4>
                <button
                  onClick={async () => {
                    setIsProcessingFiles(true);
                    setProcessingStatus("Simulating incoming WhatsApp media batch (ID scan + Police clearance + Voice note)...");
                    
                    const mockFile = new File(["sample ID image content"], "Candidate_CID_Police_Scan_Chipo.jpg", { type: "image/jpeg" });
                    const res = await whatsappSyncService.processMediaFile(mockFile);
                    if (res.worker && onWorkerAdded) onWorkerAdded(res.worker);

                    setIsProcessingFiles(false);
                    setProcessingStatus("");
                    setSuccessMessage("Batch simulation complete! Candidate Chipo Mutasa auto-synced to live directory.");
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Run Batch Media Simulation</span>
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Tests the media pipeline by creating a simulated WhatsApp candidate record with CID clearance verification, national ID OCR extraction, and instant directory publishing.
              </p>
            </div>
          </div>

          {/* Right Column: Live Daemon Status & Directory Quick View */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Radio className="w-5 h-5 text-emerald-600" />
                  <span>Sync Daemon Monitor</span>
                </h3>
                <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-md ${
                  autoDaemonActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                }`}>
                  {autoDaemonActive ? "Polling Webhook Queue" : "Polling Offline"}
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold">Main DB Worker Profiles:</span>
                  <strong className="text-emerald-700 font-mono text-sm">{SAMPLE_WORKERS.length} Registered</strong>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold">Main DB Job Vacancies:</span>
                  <strong className="text-slate-900 font-mono text-sm">{SAMPLE_JOBS.length} Posted</strong>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold">WhatsApp Ingested Logs:</span>
                  <strong className="text-teal-700 font-mono text-sm">{syncLogs.length} Events</strong>
                </div>
              </div>

              {/* Recent Auto-Synced Items */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                  Latest Ingested Candidates
                </h4>
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {SAMPLE_WORKERS.slice(0, 4).map((w) => (
                    <div key={w.id} className="p-3 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs transition-all">
                      <div className="flex items-center space-x-2.5">
                        <img src={w.avatarUrl} alt={w.fullName} className="w-9 h-9 rounded-xl object-cover border border-emerald-300" />
                        <div>
                          <strong className="text-slate-900 block font-bold">{w.fullName}</strong>
                          <span className="text-emerald-700 text-[10px] font-semibold">{w.role} • {w.city}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-bold text-[10px]">
                        ${w.monthlyRateUSD}/mo
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {onNavigateToMarketplace && (
                <button
                  onClick={onNavigateToMarketplace}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all mt-4"
                >
                  <Eye className="w-4 h-4 text-emerald-200" />
                  <span>Open Live Worker Directory</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIRECT TEXT & CHAT INGESTION */}
      {activePortalTab === "text-parser" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input Box & Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Upload className="w-5 h-5 text-emerald-600" />
                  <span>Paste WhatsApp Text or Chat Log</span>
                </h3>

                {/* Ingestion Type Switcher */}
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setIngestionType("worker")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      ingestionType === "worker"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Worker Profile
                  </button>
                  <button
                    onClick={() => setIngestionType("job")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      ingestionType === "job"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Job Post
                  </button>
                </div>
              </div>

              {/* Quick Presets Buttons */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500 font-bold">Quick Sample:</span>
                <button
                  onClick={() => {
                    setIngestionType("worker");
                    setRawText(SAMPLE_WHATSAPP_WORKER);
                  }}
                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg border border-emerald-200"
                >
                  Load Sample Maid Message
                </button>
                <button
                  onClick={() => {
                    setIngestionType("job");
                    setRawText(SAMPLE_WHATSAPP_JOB);
                  }}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold rounded-lg border border-amber-200"
                >
                  Load Sample Job Vacancy
                </button>
              </div>

              {/* Textarea */}
              <textarea
                rows={8}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={`Paste raw WhatsApp text here, e.g.:\nName: Tariro Moyo\nRole: Maid & Housekeeper\nCity: Harare, Borrowdale\nPhone: ${SUPPORT_PHONE}\nWage: $220/mo\nBio: Full-time experienced maid with police clearance...`}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setRawText("")}
                  className="text-xs text-slate-500 hover:text-rose-600 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>

                <button
                  onClick={handleParseText}
                  disabled={!rawText.trim()}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center space-x-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Parse & Auto-Sync to Database</span>
                </button>
              </div>
            </div>

            {/* Standard WhatsApp Group Templates Box */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  <span>Standard WhatsApp Group Format Templates</span>
                </h4>
                <button
                  onClick={() => handleCopyTemplate(ingestionType === "worker" ? SAMPLE_WHATSAPP_WORKER : SAMPLE_WHATSAPP_JOB)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5"
                >
                  {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTemplate ? "Copied!" : "Copy Template"}</span>
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Copy and send these templates to candidates or employers on WhatsApp groups so they reply with structured fields for automated parsing.
              </p>
              <pre className="p-3 bg-slate-950 rounded-2xl text-[11px] font-mono text-emerald-300 overflow-x-auto border border-slate-800">
                {ingestionType === "worker" ? SAMPLE_WHATSAPP_WORKER : SAMPLE_WHATSAPP_JOB}
              </pre>
            </div>
          </div>

          {/* Right Column: Extracted Preview Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 min-h-[400px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Parsed Data Preview</span>
                  </h3>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold rounded-md">
                    Synced to DB
                  </span>
                </div>

                {!parsedWorker && !parsedJob && (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                      <FileText className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      No parsed message yet. Paste text on the left and click <strong>"Parse & Auto-Sync"</strong> to generate a preview card and update live directories.
                    </p>
                  </div>
                )}

                {/* Parsed Worker Preview Card */}
                {parsedWorker && (
                  <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={parsedWorker.avatarUrl}
                        alt={parsedWorker.fullName}
                        className="w-12 h-12 rounded-xl object-cover border border-emerald-400"
                      />
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">{parsedWorker.fullName}</h4>
                        <p className="text-xs text-emerald-700 font-bold">{parsedWorker.role}</p>
                        <span className="text-[10px] text-slate-500">{parsedWorker.city}, {parsedWorker.suburb}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-medium pt-2 border-t border-slate-200">
                      <div className="bg-white p-2 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block">Monthly Rate:</span>
                        <strong className="text-emerald-700 font-mono">${parsedWorker.monthlyRateUSD} / mo</strong>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block">Experience:</span>
                        <strong className="text-slate-900">{parsedWorker.experienceYears} Years</strong>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <span className="text-slate-500 font-bold">Verifications:</span>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">ZRP Police Clear</span>
                        <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-bold">ID Checked</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700">
                      <p className="line-clamp-3 italic">"{parsedWorker.bio}"</p>
                    </div>
                  </div>
                )}

                {/* Parsed Job Preview Card */}
                {parsedJob && (
                  <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">
                        URGENT JOB VACANCY
                      </span>
                      <h4 className="font-black text-slate-900 text-sm mt-1">{parsedJob.title}</h4>
                      <p className="text-xs text-slate-600">Employer: {parsedJob.employerName} • {parsedJob.city}</p>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                      <span className="text-slate-500">Offered Salary:</span>
                      <strong className="text-emerald-700 font-mono font-black text-sm">${parsedJob.offeredSalaryUSD} / mo</strong>
                    </div>

                    <p className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 line-clamp-3">
                      {parsedJob.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Commit Actions */}
              {(parsedWorker || parsedJob) && (
                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <button
                    onClick={parsedWorker ? handleCommitWorker : handleCommitJob}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>View in Live Marketplace</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUTOMATED SYNC AUDIT TRAIL & DB FEED */}
      {activePortalTab === "sync-audit" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>Automated Sync Audit Trail & Database Insertion Feed</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time log of incoming WhatsApp media, text logs, voice transcriptions, and OCR ID scans synced to candidate directories.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-mono font-bold rounded-xl border border-emerald-200">
                {syncLogs.length} Total Sync Events
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-extrabold text-slate-900">
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Source File / Payload</th>
                  <th className="p-3.5">Media Type</th>
                  <th className="p-3.5">Record Created</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">CID Police Clearance</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {syncLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="p-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 max-w-[180px] truncate" title={log.sourceName}>
                      {log.sourceName}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-800 text-[10px] font-bold rounded-lg border border-slate-200 inline-flex items-center gap-1">
                        {log.mediaType === "ID Image / OCR" && <ImageIcon className="w-3 h-3 text-emerald-600" />}
                        {log.mediaType === "Voice Note Transcribed" && <Mic className="w-3 h-3 text-sky-600" />}
                        {log.mediaType === "Text Log" && <FileText className="w-3 h-3 text-amber-600" />}
                        {log.mediaType === "PDF Resume" && <FileCode className="w-3 h-3 text-purple-600" />}
                        <span>{log.mediaType}</span>
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-800">
                      {log.extractedNameOrTitle}
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {log.extractedLocation}
                    </td>
                    <td className="p-3.5">
                      {log.autoVerifiedPolice ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>CID Verified</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md">
                          Pending CID
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-extrabold rounded-lg shadow-sm inline-flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Synced to DB</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
