import React, { useState } from "react";
import { WorkerProfile, PlacementFeeRecord } from "../../types/marketplace";
import { PAYMENT_GATEWAY_ASSETS } from "../common/PaymentBadges";
import { VerifiedBadge } from "../common/VerifiedBadge";
import {
  ShieldCheck,
  DollarSign,
  Smartphone,
  Copy,
  Check,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  Gift,
  Tag
} from "lucide-react";

interface PlacementFeeModalProps {
  worker: WorkerProfile | null;
  onClose: () => void;
  currency: "USD" | "ZWG";
  onRecordPlacementSuccess: (placementRecord: PlacementFeeRecord) => void;
  onOpenReferralProgram?: () => void;
}

export const PlacementFeeModal: React.FC<PlacementFeeModalProps> = ({
  worker,
  onClose,
  currency,
  onRecordPlacementSuccess,
  onOpenReferralProgram,
}) => {
  const [agreedSalary, setAgreedSalary] = useState<number>(worker ? worker.monthlyRateUSD : 250);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [proofFileName, setProofFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [employerNameInput, setEmployerNameInput] = useState("Mr. Tafadzwa Tagwirei");
  const [ecoCashUsedInput, setEcoCashUsedInput] = useState("+263 77 123 4567");

  // Referral Discount State
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [appliedDiscountUSD, setAppliedDiscountUSD] = useState(0);
  const [appliedCodeLabel, setAppliedCodeLabel] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);

  if (!worker) return null;

  // Placement fee is strictly 30% of agreed salary
  const basePlacementFeeUSD = Math.round(agreedSalary * 0.3);
  const finalPlacementFeeUSD = Math.max(0, basePlacementFeeUSD - appliedDiscountUSD);

  const handleApplyReferralCode = () => {
    setCodeError(null);
    const code = referralCodeInput.trim().toUpperCase();
    if (!code) return;

    if (code.includes("REF") || code.includes("ZMC") || code.includes("INVITE") || code.includes("VIP")) {
      // Valid referral discount code ($20 off or custom)
      const discount = 20;
      setAppliedDiscountUSD(discount);
      setAppliedCodeLabel(code);
      setCodeError(null);
    } else {
      setCodeError("Invalid referral voucher code. Please check your invite code.");
    }
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText("+263785458828");
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFileName(file.name);
    }
  };

  const handleConfirmPlacement = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newRecord: PlacementFeeRecord = {
      id: `place-${Date.now()}`,
      workerId: worker.id,
      workerName: worker.fullName,
      employerName: employerNameInput || "Logged-In Employer",
      jobTitle: `${worker.role} Placement`,
      agreedSalaryUSD: agreedSalary,
      placementFeeUSD: finalPlacementFeeUSD,
      status: proofFileName ? "Under Review" : "Pending",
      placementDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      proofFileName: proofFileName || undefined,
      paymentMethod: "EcoCash",
      ecoCashNumberUsed: ecoCashUsedInput,
      notes: appliedCodeLabel ? `30% Placement Fee with Referral Discount ${appliedCodeLabel} (-$${appliedDiscountUSD} USD)` : "30% Placement Fee agreed as per platform terms.",
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        onRecordPlacementSuccess(newRecord);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-emerald-950/60 hover:bg-emerald-950 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-300 mb-1">
            <VerifiedBadge size="sm" showText={true} />
            <span>30% Placement Fee Policy</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">
            Record Placement for {worker.fullName}
          </h3>
          <p className="text-xs text-emerald-200 mt-1">
            A one-time 30% placement fee of the agreed first month's salary is due upon placement confirmation.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-900">Placement Recorded!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Placement Fee of <span className="font-bold text-slate-900">${finalPlacementFeeUSD} USD</span> recorded.
                Status is now updated in the Placement Fee Ledger.
              </p>
            </div>
          ) : (
            <form onSubmit={handleConfirmPlacement} className="space-y-4">
              {/* Agreed Salary Input & Auto-30% Fee Calculation */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  1. Agreed First Month's Salary (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-extrabold text-slate-400 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min="50"
                    max="5000"
                    value={agreedSalary}
                    onChange={(e) => setAgreedSalary(Number(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Referral Discount Voucher Section */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5 text-amber-600" />
                      <span>Have a Referral Discount Code?</span>
                    </span>
                    {onOpenReferralProgram && (
                      <button
                        type="button"
                        onClick={onOpenReferralProgram}
                        className="text-[10px] text-emerald-700 font-bold hover:underline"
                      >
                        Get referral code
                      </button>
                    )}
                  </div>

                  {appliedCodeLabel ? (
                    <div className="flex items-center justify-between p-2 bg-emerald-100/80 border border-emerald-300 rounded-lg text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                        <Tag className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Code Applied: {appliedCodeLabel} (-${appliedDiscountUSD} USD)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedDiscountUSD(0);
                          setAppliedCodeLabel(null);
                        }}
                        className="text-[10px] text-rose-600 font-bold hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. ZMC-REF-TAFADZWA26"
                        value={referralCodeInput}
                        onChange={(e) => setReferralCodeInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplyReferralCode}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {codeError && (
                    <p className="text-[10px] font-bold text-rose-600">{codeError}</p>
                  )}
                </div>

                {/* Calculation Breakdown */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>First Month Agreed Salary:</span>
                    <span className="font-bold text-slate-900">${agreedSalary} USD</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Platform Placement Fee Rate:</span>
                    <span className="font-bold text-emerald-700">30% One-Time</span>
                  </div>
                  {appliedDiscountUSD > 0 && (
                    <div className="flex justify-between text-amber-800 font-bold">
                      <span>Referral Program Discount:</span>
                      <span>-${appliedDiscountUSD} USD</span>
                    </div>
                  )}
                  <hr className="border-emerald-200 my-1" />
                  <div className="flex justify-between text-sm font-black text-emerald-950 pt-0.5">
                    <span>Placement Fee Due:</span>
                    <span className="text-emerald-700 font-mono text-base">${finalPlacementFeeUSD} USD</span>
                  </div>
                </div>
              </div>

              {/* Payment Details Card */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={PAYMENT_GATEWAY_ASSETS.ecocash}
                      alt="EcoCash"
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded object-cover"
                    />
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      EcoCash Payment Details
                    </span>
                  </div>
                  <span className="text-[10px] bg-blue-900/60 text-blue-200 border border-blue-700/50 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    EcoCash USD / ZWG
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <div className="flex items-center space-x-2">
                    <img
                      src={PAYMENT_GATEWAY_ASSETS.ecocash}
                      alt="EcoCash"
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-lg object-cover border border-blue-500/40 shrink-0"
                    />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Gateway</span>
                      <span className="font-bold text-white">EcoCash Mobile</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Official Recipient</span>
                    <span className="font-bold text-emerald-400">Chenjerai</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">EcoCash Number</span>
                      <span className="font-mono text-sm font-bold text-amber-300">+263 785 458 828</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyNumber}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs flex items-center space-x-1"
                    >
                      {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNumber ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                {/* Upload Proof */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Upload Proof of Payment (Optional Now, can be uploaded later):
                  </label>
                  <label className="cursor-pointer block bg-slate-800 hover:bg-slate-700 border border-slate-600 border-dashed rounded-xl p-2.5 text-center transition-colors">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center space-x-2 text-xs text-slate-300">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span className="font-medium">{proofFileName || "Choose screenshot or EcoCash SMS receipt"}</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? "Recording..." : "Confirm Placement"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

