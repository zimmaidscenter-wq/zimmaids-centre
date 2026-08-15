import React, { useState } from "react";
import {
  FileText,
  ShieldCheck,
  Lock,
  Download,
  Eye,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
  FileCheck,
  Plus,
  Trash2,
  Sparkles,
  Printer,
  Calendar,
  UserCheck,
  Award,
  HeartPulse,
  Scale
} from "lucide-react";
import { VaultDocument, WorkerProfile } from "../../types/marketplace";

interface DocumentVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker?: WorkerProfile | null;
  currency?: "USD" | "ZWG";
}

export const DocumentVaultModal: React.FC<DocumentVaultModalProps> = ({
  isOpen,
  onClose,
  worker,
  currency = "USD",
}) => {
  const [activeTab, setActiveTab] = useState<
    "all" | "id" | "certificates" | "police" | "medical" | "references" | "contracts"
  >("all");

  const [previewDoc, setPreviewDoc] = useState<VaultDocument | null>(null);
  const [isContractGeneratorOpen, setIsContractGeneratorOpen] = useState(false);
  const [contractEmployerName, setContractEmployerName] = useState("Mr. Farai Mutasa");
  const [contractSalary, setContractSalary] = useState(worker?.monthlyRateUSD || 220);
  const [contractWorkType, setContractWorkType] = useState<"Live-In" | "Day Worker" | "Part-Time">("Live-In");
  const [contractOffDays, setContractOffDays] = useState("Every alternate weekend (Sat-Sun)");
  const [contractSigned, setContractSigned] = useState(false);

  // Initial Sample Documents in Secure Storage
  const [documents, setDocuments] = useState<VaultDocument[]>([
    {
      id: "doc-id-1",
      type: "National ID",
      title: "Republic of Zimbabwe National Identity Card",
      issuerOrAuthority: "Registrar General Department (Harare Central)",
      dateIssued: "2020-04-12",
      verificationStatus: "Verified",
      documentUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
      fileSize: "2.4 MB",
      fileType: "image",
      notes: "Biometric and photo verified against national registration database.",
      isEncrypted: true,
    },
    {
      id: "doc-cert-1",
      type: "Certificate",
      title: "Infant First Aid & CPR Certification",
      issuerOrAuthority: "Zimbabwe Red Cross Society (Harare Chapter)",
      dateIssued: "2024-08-10",
      expiryDate: "2027-08-10",
      verificationStatus: "Verified",
      documentUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=800",
      fileSize: "1.8 MB",
      fileType: "pdf",
      notes: "Covers emergency infant choking response, burn care, and first aid.",
      isEncrypted: true,
    },
    {
      id: "doc-cert-2",
      type: "Certificate",
      title: "Early Childhood Development & House Management Certificate",
      issuerOrAuthority: "Speciss College Vocational Institute",
      dateIssued: "2023-11-20",
      verificationStatus: "Verified",
      documentUrl: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&q=80&w=800",
      fileSize: "3.1 MB",
      fileType: "pdf",
      notes: "Graduated with Distinction in Child Nutrition & Home Safety.",
      isEncrypted: true,
    },
    {
      id: "doc-pol-1",
      type: "Police Clearance",
      title: "ZRP Criminal Record & Fingerprint Clearance Certificate",
      issuerOrAuthority: "Zimbabwe Republic Police CID Headquarters (Morris Depot)",
      dateIssued: "2026-03-01",
      expiryDate: "2027-03-01",
      verificationStatus: "Verified",
      documentUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800",
      fileSize: "1.9 MB",
      fileType: "pdf",
      notes: "Clean criminal record certificate with verified 10-digit fingerprint analysis.",
      isEncrypted: true,
    },
    {
      id: "doc-med-1",
      type: "Medical Certificate",
      title: "Food Handler's & Infectious Disease Medical Clearance",
      issuerOrAuthority: "City of Harare Health Department (Rowan Martin)",
      dateIssued: "2026-01-15",
      expiryDate: "2027-01-15",
      verificationStatus: "Verified",
      documentUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
      fileSize: "1.4 MB",
      fileType: "pdf",
      notes: "Passed medical fitness examination, chest X-Ray (TB negative), and Hepatitis B clearance.",
      isEncrypted: true,
    },
    {
      id: "doc-ref-1",
      type: "Reference Letter",
      title: "Employer Recommendation Letter — Borrowdale Residence",
      issuerOrAuthority: "Mrs. Sarah Jenkins (Borrowdale Brooke)",
      dateIssued: "2025-12-05",
      verificationStatus: "Verified",
      documentUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
      fileSize: "1.2 MB",
      fileType: "pdf",
      notes: "Verified by phone on 2026-01-10. Recommended as honest, punctual, and child-loving.",
      isEncrypted: true,
    },
    {
      id: "doc-con-1",
      type: "Employment Contract",
      title: "Standard Domestic Worker Employment Contract (Zimbabwe Labour Act 28:01)",
      issuerOrAuthority: "Zimbabwe Maids Centre Legal Portal",
      dateIssued: "2026-03-10",
      verificationStatus: "Verified",
      documentUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800",
      fileSize: "850 KB",
      fileType: "pdf",
      notes: "Signed tripartite placement contract specifying $220/month, lodging, and alternate weekend off-days.",
      isEncrypted: true,
      contractDetails: {
        employerName: "Mr. Farai Mutasa (Borrowdale)",
        workerName: worker?.fullName || "Tendai Mukamuri",
        agreedSalaryUSD: 220,
        startDate: "2026-04-01",
        workType: "Live-In",
        offDays: "Every alternate weekend (Sat 1pm to Sun 6pm)",
        signedByWorker: true,
        signedByEmployer: true,
        signedDate: "2026-03-10",
      },
    },
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [newDocType, setNewDocType] = useState<VaultDocument["type"]>("Certificate");
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocAuthority, setNewDocAuthority] = useState("");

  if (!isOpen) return null;

  const filteredDocs = documents.filter((doc) => {
    if (activeTab === "all") return true;
    if (activeTab === "id") return doc.type === "National ID";
    if (activeTab === "certificates") return doc.type === "Certificate";
    if (activeTab === "police") return doc.type === "Police Clearance";
    if (activeTab === "medical") return doc.type === "Medical Certificate";
    if (activeTab === "references") return doc.type === "Reference Letter";
    if (activeTab === "contracts") return doc.type === "Employment Contract";
    return true;
  });

  const handleUploadNewDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle) return;

    const newDoc: VaultDocument = {
      id: `doc-${Date.now()}`,
      type: newDocType,
      title: newDocTitle,
      issuerOrAuthority: newDocAuthority || "Self-Declared / Pending Audit",
      dateIssued: new Date().toISOString().split("T")[0],
      verificationStatus: "Pending Review",
      documentUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
      fileSize: "1.6 MB",
      fileType: "pdf",
      notes: "Document uploaded to encrypted cloud vault. Awaiting Admin & KYC verification.",
      isEncrypted: true,
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setIsUploading(false);
    setNewDocTitle("");
    setNewDocAuthority("");
  };

  const handleGenerateContract = () => {
    const newContract: VaultDocument = {
      id: `contract-${Date.now()}`,
      type: "Employment Contract",
      title: `Domestic Worker Contract — ${worker?.fullName || "Candidate"} & ${contractEmployerName}`,
      issuerOrAuthority: "Zimbabwe Maids Centre Digital Legal Suite",
      dateIssued: new Date().toISOString().split("T")[0],
      verificationStatus: "Verified",
      documentUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800",
      fileSize: "780 KB",
      fileType: "pdf",
      isEncrypted: true,
      notes: "Complies with Statutory Instrument 103/2021 & Zimbabwe Labour Act.",
      contractDetails: {
        employerName: contractEmployerName,
        workerName: worker?.fullName || "Tendai Mukamuri",
        agreedSalaryUSD: Number(contractSalary),
        startDate: "2026-04-01",
        workType: contractWorkType,
        offDays: contractOffDays,
        signedByWorker: true,
        signedByEmployer: contractSigned,
        signedDate: new Date().toISOString().split("T")[0],
      },
    };

    setDocuments((prev) => [newContract, ...prev]);
    setIsContractGeneratorOpen(false);
    setActiveTab("contracts");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">Document Management Vault</h2>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  AES-256 ENCRYPTED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Secure cloud repository for ID, Certificates, Police clearance, Medical records & Employment contracts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar & Category Tabs */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
            {[
              { id: "all", label: "All Docs", count: documents.length },
              { id: "id", label: "National ID", count: documents.filter((d) => d.type === "National ID").length },
              { id: "certificates", label: "Certificates", count: documents.filter((d) => d.type === "Certificate").length },
              { id: "police", label: "Police Clearance", count: documents.filter((d) => d.type === "Police Clearance").length },
              { id: "medical", label: "Medical", count: documents.filter((d) => d.type === "Medical Certificate").length },
              { id: "references", label: "References", count: documents.filter((d) => d.type === "Reference Letter").length },
              { id: "contracts", label: "Contracts", count: documents.filter((d) => d.type === "Employment Contract").length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  activeTab === tab.id
                    ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === tab.id ? "bg-slate-950/20 text-slate-950" : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsContractGeneratorOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600/90 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Draft Legal Contract</span>
            </button>
            <button
              onClick={() => setIsUploading(true)}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {/* Upload Form Drawer */}
          {isUploading && (
            <form
              onSubmit={handleUploadNewDoc}
              className="p-5 bg-slate-800/90 border border-emerald-500/50 rounded-2xl space-y-4 animate-fade-in shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Upload className="w-4 h-4" />
                  <h4 className="font-bold text-sm text-white">Upload New Document to Encrypted Vault</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Document Category</label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="National ID">National ID</option>
                    <option value="Certificate">Certificate / Vocational</option>
                    <option value="Police Clearance">Police Clearance Certificate</option>
                    <option value="Medical Certificate">Medical Examination Report</option>
                    <option value="Reference Letter">Reference Letter</option>
                    <option value="Employment Contract">Employment Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Document Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Red Cross First Aid Badge"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">Issuing Authority / Employer</label>
                  <input
                    type="text"
                    placeholder="e.g. Red Cross / City Health / ZRP"
                    value={newDocAuthority}
                    onChange={(e) => setNewDocAuthority(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-900/50">
                <FileCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-200">
                  Click to select file or drag-and-drop PDF / PNG / JPEG
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Files are automatically encrypted with AES-256 before storage
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md"
                >
                  Confirm & Encrypt Upload
                </button>
              </div>
            </form>
          )}

          {/* Legal Contract Generator Modal / Drawer */}
          {isContractGeneratorOpen && (
            <div className="p-5 bg-slate-800/95 border border-blue-500/50 rounded-2xl space-y-4 animate-fade-in shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div className="flex items-center space-x-2 text-blue-400">
                  <Scale className="w-4 h-4" />
                  <h4 className="font-bold text-sm text-white">
                    Generate Zimbabwe Standard Domestic Employment Contract
                  </h4>
                </div>
                <button
                  onClick={() => setIsContractGeneratorOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300">
                Standard legal employment contract complying with Statutory Instrument 103 of 2021 & the Zimbabwe Labour Act [Chapter 28:01]:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Employer Full Name</label>
                  <input
                    type="text"
                    value={contractEmployerName}
                    onChange={(e) => setContractEmployerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Agreed Monthly Salary (USD)</label>
                  <input
                    type="number"
                    value={contractSalary}
                    onChange={(e) => setContractSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Living Arrangement</label>
                  <select
                    value={contractWorkType}
                    onChange={(e) => setContractWorkType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="Live-In">Live-In (Accommodation & Meals provided)</option>
                    <option value="Day Worker">Day Worker / Live-Out (8am - 4:30pm)</option>
                    <option value="Part-Time">Part-Time (2-3 days/week)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Off-Day Agreement</label>
                  <input
                    type="text"
                    value={contractOffDays}
                    onChange={(e) => setContractOffDays(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl text-xs space-y-2 text-slate-300">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sign_agree"
                    checked={contractSigned}
                    onChange={(e) => setContractSigned(e.target.checked)}
                    className="rounded text-emerald-500 focus:ring-emerald-500 h-4 w-4 bg-slate-800 border-slate-700"
                  />
                  <label htmlFor="sign_agree" className="font-semibold text-slate-200 cursor-pointer">
                    I agree to the statutory domestic worker minimum rest periods, paid sick leave, and 14-day termination notice.
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsContractGeneratorOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGenerateContract}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Generate & Sign Contract</span>
                </button>
              </div>
            </div>
          )}

          {/* Document Cards List */}
          {filteredDocs.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <FileText className="w-12 h-12 mx-auto text-slate-600" />
              <p className="text-sm font-semibold text-slate-400">No documents found in this folder</p>
              <p className="text-xs">Upload your credentials or draft a contract to store them safely.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 hover:border-emerald-500/40 transition-all flex flex-col justify-between group relative shadow-md"
                >
                  <div>
                    {/* Top Row: Type & Verification Status */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-slate-900 text-emerald-400 border border-slate-700">
                        {doc.type}
                      </span>
                      {doc.verificationStatus === "Verified" ? (
                        <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                          <Clock className="w-3 h-3" />
                          <span>Pending Review</span>
                        </span>
                      )}
                    </div>

                    {/* Title & Authority */}
                    <h4 className="font-bold text-white text-sm leading-snug group-hover:text-emerald-300 transition-colors">
                      {doc.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                      <span>{doc.issuerOrAuthority}</span>
                    </p>

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-slate-400">
                      <span className="bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-800">
                        Issued: {doc.dateIssued}
                      </span>
                      {doc.expiryDate && (
                        <span className="bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-800 text-slate-300">
                          Expires: {doc.expiryDate}
                        </span>
                      )}
                      <span className="bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-800">
                        {doc.fileSize}
                      </span>
                    </div>

                    {/* Contract Details preview if contract */}
                    {doc.contractDetails && (
                      <div className="mt-3 p-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs space-y-1">
                        <div className="flex justify-between text-slate-300">
                          <span>Employer:</span>
                          <span className="font-semibold text-white">{doc.contractDetails.employerName}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Agreed Rate:</span>
                          <span className="font-bold text-emerald-400">${doc.contractDetails.agreedSalaryUSD}/mo</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>Off-Days:</span>
                          <span className="text-slate-200">{doc.contractDetails.offDays}</span>
                        </div>
                      </div>
                    )}

                    {doc.notes && (
                      <p className="text-[11px] text-slate-400 mt-2.5 italic leading-relaxed line-clamp-2">
                        "{doc.notes}"
                      </p>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400/80 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      Encrypted Cloud Copy
                    </span>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => setPreviewDoc(doc)}
                        className="p-1.5 bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                        title="Preview Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={doc.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-xs"
                        title="Download Copy"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Document Viewer Modal Overlay */}
        {previewDoc && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-white text-base">{previewDoc.title}</h3>
                </div>
                <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-center">
                <img
                  src={previewDoc.documentUrl}
                  alt={previewDoc.title}
                  className="max-h-72 w-auto mx-auto rounded-xl object-contain shadow-md"
                />
                <div className="mt-3 text-left bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                  <p className="text-slate-400">
                    Authority: <span className="text-white font-semibold">{previewDoc.issuerOrAuthority}</span>
                  </p>
                  <p className="text-slate-400">
                    Verification: <span className="text-emerald-400 font-bold">{previewDoc.verificationStatus}</span>
                  </p>
                  {previewDoc.notes && <p className="text-slate-300 italic">{previewDoc.notes}</p>}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  Cryptographically hashed & timestamped
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print
                  </button>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Compliant with Zimbabwe Cyber & Data Protection Act [Chapter 12:07]</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
