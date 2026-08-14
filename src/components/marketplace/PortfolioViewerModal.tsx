import React, { useState } from "react";
import { PortfolioItem, WorkerProfile } from "../../types/marketplace";
import {
  X,
  Image as ImageIcon,
  FileText,
  ShieldCheck,
  Download,
  Calendar,
  User,
  Star,
  CheckCircle2,
  Building,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  ExternalLink,
  Eye,
  Camera,
  Layers,
  Award
} from "lucide-react";

interface PortfolioViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PortfolioItem | null;
  workerName?: string;
  workerRole?: string;
}

export const PortfolioViewerModal: React.FC<PortfolioViewerModalProps> = ({
  isOpen,
  onClose,
  item,
  workerName,
  workerRole,
}) => {
  if (!isOpen || !item) return null;

  const isImage = item.fileType === "image" || (!item.url.endsWith(".pdf") && !item.category.includes("Document") && !item.category.includes("Letter") && !item.category.includes("Clearance"));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col relative my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white p-5 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
              {isImage ? <Camera className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-800/80 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-emerald-200 border border-emerald-700/60">
                  {item.category}
                </span>
                {item.isVerified && (
                  <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 rounded-full text-[10px] font-black flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>ZMC VERIFIED</span>
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                {item.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main Visual or Document View */}
          {isImage ? (
            <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 relative flex items-center justify-center min-h-[320px]">
              <img
                src={item.url}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="max-h-[500px] w-full object-contain rounded-2xl"
              />
            </div>
          ) : (
            /* Document / Reference Letter Viewer */
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 space-y-5">
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Official Document / Recommendation
                  </span>
                  <h4 className="text-lg font-black text-slate-900">
                    {item.title}
                  </h4>
                  {item.issuerOrEmployer && (
                    <p className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5" />
                      <span>Issued / Authored by: {item.issuerOrEmployer}</span>
                    </p>
                  )}
                </div>

                {item.rating && (
                  <div className="flex items-center text-amber-400 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                )}
              </div>

              {/* Letter Transcript or Content */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3 font-serif text-slate-800 text-sm leading-relaxed">
                <p className="italic text-slate-600 border-l-4 border-emerald-500 pl-3 py-1 font-sans text-xs">
                  "To Prospective Employers & Families — Verification Letter for {workerName || 'Candidate'}"
                </p>
                <div className="whitespace-pre-line text-xs sm:text-sm font-sans text-slate-700">
                  {item.documentContent || item.description || (
                    `This letter serves to confirm that ${workerName || "this candidate"} performed household duties with exceptional trustworthiness, attention to detail, and punctuality. All duties including deep cleaning, meal preparation, childcare, and laundry were executed with the highest standard of domestic care.`
                  )}
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-sans text-slate-500">
                  <span>Signatory: <strong>{item.issuerOrEmployer || "Former Employer / Issuing Authority"}</strong></span>
                  <span>Date: <strong>{item.uploadedAt}</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Details & Description Section */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Category</span>
                <span className="font-semibold text-slate-800">{item.category}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Uploaded Date</span>
                <span className="font-semibold text-slate-800">{item.uploadedAt}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Verification Status</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {item.isVerified ? "Audited & Authenticated" : "Candidate Self-Uploaded"}
                </span>
              </div>
            </div>

            {item.description && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Work Description / Context</span>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Candidate: <strong>{workerName || "Verified Professional"}</strong> {workerRole && `(${workerRole})`}
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition-colors"
          >
            Done Viewing
          </button>
        </div>
      </div>
    </div>
  );
};
