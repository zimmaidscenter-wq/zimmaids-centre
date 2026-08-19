import React, { useState, useEffect } from "react";
import { PAYMENT_GATEWAY_ASSETS } from "../common/PaymentBadges";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  X,
  ArrowLeft,
  Smartphone,
  Copy,
  Check,
  Sparkles,
  Upload,
  Zap,
  Phone,
  MessageCircle,
  FileCheck2,
  Award
} from "lucide-react";

interface PremiumAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribeSuccess: () => void;
}

export const PremiumAccessModal: React.FC<PremiumAccessModalProps> = ({
  isOpen,
  onClose,
  onSubscribeSuccess,
}) => {
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [proofFileName, setProofFileName] = useState<string | null>(null);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [isActivatingDemo, setIsActivatingDemo] = useState(false);

  // Browser Back Button & Escape key support
  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ premiumModalOpen: true }, "");

    const handlePopState = () => {
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText("+263785458828");
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFileName(file.name);
      setIsUploadingProof(true);
      setTimeout(() => {
        setIsUploadingProof(false);
      }, 1000);
    }
  };

  const handleSubmitProof = () => {
    setPaymentSubmitted(true);
    setTimeout(() => {
      onSubscribeSuccess();
      onClose();
    }, 1500);
  };

  const handleInstantDemoActivate = () => {
    setIsActivatingDemo(true);
    setTimeout(() => {
      setIsActivatingDemo(false);
      onSubscribeSuccess();
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 relative">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-emerald-950/60 hover:bg-emerald-950 text-white rounded-full transition-colors"
              title="Close (Escape)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>Employer Contact Protection</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white">Premium Employer Access</h3>
          <p className="text-xs text-emerald-200 mt-1">
            Unlock direct phone, WhatsApp, and contact details for all verified domestic workers & artisans.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {paymentSubmitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-900">Proof Submitted & Activated!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your payment proof has been submitted to admin. Your 30-Day Premium Employer Access is now active!
              </p>
            </div>
          ) : (
            <>
              {/* Pricing Box */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-500/80 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    30-Day Unlimited Access Pass
                  </div>
                  <div className="text-3xl font-black text-slate-900 mt-1">
                    $30 <span className="text-sm font-bold text-slate-500">USD / 30 days</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Valid for 30 consecutive days from activation date.
                  </p>
                </div>
                <div className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center space-x-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Instant Unlocks</span>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Included Premium Employer Privileges
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-800">Unlimited direct phone & WhatsApp</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-800">Priority 24/7 customer support</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-800">Advanced search & suburb radius</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-800">Verified-Workers-Only filter</span>
                  </div>
                </div>
              </div>

              {/* Official Payment Instructions */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={PAYMENT_GATEWAY_ASSETS.ecocash}
                      alt="EcoCash"
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded object-cover"
                    />
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      Official EcoCash Payment Details
                    </span>
                  </div>
                  <span className="text-[10px] bg-blue-900/60 text-blue-200 border border-blue-700/50 font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    EcoCash USD / ZWG
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <div className="flex items-center space-x-2">
                    <img
                      src={PAYMENT_GATEWAY_ASSETS.ecocash}
                      alt="EcoCash"
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-lg object-cover border border-blue-500/40 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Payment Method</span>
                      <span className="font-bold text-white">EcoCash Mobile</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Recipient Name</span>
                    <span className="font-bold text-emerald-400">Chenjerai</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">EcoCash Number</span>
                      <span className="font-mono text-base font-extrabold text-amber-300">+263 785 458 828</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyNumber}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-xs font-semibold flex items-center space-x-1 transition-colors"
                    >
                      {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNumber ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                {/* Upload Proof of Payment Section */}
                <div className="pt-2">
                  <label className="text-xs font-semibold text-slate-200 block mb-1.5">
                    Upload Proof of Payment (Screenshot or EcoCash SMS):
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 border-dashed rounded-xl p-3 text-center transition-colors">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleProofUpload}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center space-x-2 text-xs text-slate-300">
                        <Upload className="w-4 h-4 text-emerald-400" />
                        <span className="font-semibold">
                          {proofFileName ? proofFileName : "Choose file or screenshot"}
                        </span>
                      </div>
                    </label>

                    {proofFileName && (
                      <button
                        type="button"
                        onClick={handleSubmitProof}
                        className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition-all"
                      >
                        Submit Proof
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Instant Simulation Action */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h5 className="text-xs font-bold text-emerald-950">Instant Employer Activation (Demo Mode)</h5>
                  <p className="text-[11px] text-emerald-800">
                    Activate 30-Day Premium Access instantly for testing worker contact unlocks.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleInstantDemoActivate}
                  disabled={isActivatingDemo}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 shrink-0"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>{isActivatingDemo ? "Activating..." : "Activate Premium $30 Now"}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
