import React, { useState } from "react";
import { WorkerProfile } from "../../types/marketplace";
import {
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Phone,
  FileCheck2,
  Volume2,
  CheckCircle,
  X,
  CreditCard,
  MessageSquare,
  Award,
  Lock,
  Sparkles,
  ExternalLink,
  Mail,
  Smartphone
} from "lucide-react";

interface WorkerProfileModalProps {
  worker: WorkerProfile | null;
  onClose: () => void;
  currency: "USD" | "ZWG";
  onHireNow: (worker: WorkerProfile) => void;
  onContactWorker: (worker: WorkerProfile) => void;
  isPremiumEmployer?: boolean;
  onOpenPremiumModal?: () => void;
}

export const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({
  worker,
  onClose,
  currency,
  onHireNow,
  onContactWorker,
  isPremiumEmployer = false,
  onOpenPremiumModal,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!worker) return null;

  const rateUSD = worker.monthlyRateUSD;
  const rateDisplay =
    currency === "USD" ? `$${rateUSD} USD / month` : `${(rateUSD * 26.5).toLocaleString()} ZWG / month`;

  const phoneNum = worker.phoneNumber || "+263 78 545 8828";
  const whatsappNum = worker.whatsappNumber || "+263 78 545 8828";
  const emailAddr = worker.email || `${worker.fullName.toLowerCase().replace(/\s+/g, ".")}@zimmaids.co.zw`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200 my-8">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-emerald-950/60 hover:bg-emerald-950 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative">
              <img
                src={worker.avatarUrl}
                alt={worker.fullName}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-400/80 shadow-lg"
              />
              {worker.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-xl shadow-md flex items-center gap-1 text-[10px] font-black">
                  <ShieldCheck className="w-4 h-4" />
                  <span>VERIFIED</span>
                </div>
              )}
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 bg-emerald-800/80 rounded-full text-xs font-semibold text-emerald-200">
                <span>{worker.role}</span>
                {worker.agencyName && (
                  <>
                    <span>•</span>
                    <span>{worker.agencyName}</span>
                  </>
                )}
              </div>
              <h3 className="text-2xl font-extrabold text-white flex items-center justify-center sm:justify-start gap-2">
                <span>{worker.fullName}</span>
                {worker.isVerified && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] rounded-full font-bold">
                    Verified Candidate
                  </span>
                )}
              </h3>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 text-xs text-emerald-200">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {worker.suburb}, {worker.city}
                  </span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-white">{worker.rating}</span>
                  <span>({worker.reviewCount} reviews)</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Protected Contact Details Section */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Protected Candidate Contact Information</span>
              </h4>
              {isPremiumEmployer ? (
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-extrabold rounded-full">
                  Unlocked (Premium Active)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold rounded-full">
                  Locked (Subscription Required)
                </span>
              )}
            </div>

            {isPremiumEmployer ? (
              /* Premium Unlocked View */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Phone Contact</span>
                    <span className="font-mono text-sm font-bold text-emerald-300">{phoneNum}</span>
                  </div>
                  <a
                    href={`tel:${phoneNum}`}
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

                <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Direct WhatsApp</span>
                    <span className="font-mono text-sm font-bold text-[#25D366]">{whatsappNum}</span>
                  </div>
                  <a
                    href={`https://wa.me/${whatsappNum.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(worker.fullName)},%20I%20saw%20your%20profile%20on%20Zimbabwe%20Maids%20Centre`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                  </a>
                </div>

                <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 col-span-1 sm:col-span-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Verified Email & Address</span>
                    <span className="font-mono text-xs font-semibold text-slate-200">{emailAddr} • {worker.suburb}, {worker.city}</span>
                  </div>
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ) : (
              /* Protected / Hidden View */
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-3">
                <div className="text-xs text-amber-200/90 leading-relaxed font-medium">
                  "Contact details are protected. Upgrade to Premium Employer Access to unlock verified candidate contact information."
                </div>
                <div className="filter blur-sm select-none text-xs text-slate-500 font-mono py-1">
                  Phone: +263 77• ••• ••• • WhatsApp: +263 71• ••• •••
                </div>
                <button
                  type="button"
                  onClick={onOpenPremiumModal}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all inline-flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>Upgrade to Premium Employer Access ($30 USD / 30 Days)</span>
                </button>
              </div>
            )}
          </div>

          {/* Trust Score & Verification Card */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                {worker.aiTrustScore}%
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  AI Vetted Trust Score
                </div>
                <div className="text-xs text-slate-600">
                  Police Clearance • National ID • References Verified
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-800 hover:bg-emerald-100/50 transition-colors"
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? "animate-bounce text-emerald-600" : ""}`} />
              <span>{isPlayingAudio ? "Playing Audio Intro..." : "Listen Voice Intro"}</span>
            </button>
          </div>

          {/* Rate & Availability Box */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Agreed Monthly Rate
              </span>
              <span className="text-lg font-bold text-slate-900">{rateDisplay}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Availability
              </span>
              <span className="text-sm font-bold text-emerald-700">{worker.availability}</span>
            </div>
          </div>

          {/* Bio & Background */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Professional Summary
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              {worker.bio}
            </p>
          </div>

          {/* Skills & Experience */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Core Skills & Capabilities
            </h4>
            <div className="flex flex-wrap gap-2">
              {worker.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-lg text-xs font-medium text-emerald-900"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Verifications Checklist */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Background & Compliance Verifications
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-slate-700 block">National ID</span>
                <span className="text-[10px] text-emerald-600 font-bold">Verified</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-slate-700 block">Police Clearance</span>
                <span className="text-[10px] text-emerald-600 font-bold">Valid ({worker.policeClearanceDate})</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-slate-700 block">References</span>
                <span className="text-[10px] text-emerald-600 font-bold">3 Calls Verified</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                {worker.verifications.medicalCert ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                    <span className="text-[11px] font-semibold text-slate-700 block">Medical Cert</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Fit to Work</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                    <span className="text-[11px] font-semibold text-slate-500 block">Medical Cert</span>
                    <span className="text-[10px] text-slate-400">Optional</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onContactWorker(worker)}
            className="flex items-center space-x-2 px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Chat & Inquire</span>
          </button>

          <button
            onClick={() => onHireNow(worker)}
            className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Record Placement ({rateDisplay})</span>
          </button>
        </div>
      </div>
    </div>
  );
};

