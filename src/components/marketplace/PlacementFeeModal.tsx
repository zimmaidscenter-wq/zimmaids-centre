import React, { useState } from "react";
import { WorkerProfile, PlacementFeeRecord } from "../../types/marketplace";
import { PAYMENT_GATEWAY_ASSETS } from "../common/PaymentBadges";
import { VerifiedBadge } from "../common/VerifiedBadge";
import { usePlatform } from "../../context/PlatformContext";
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
  Tag,
  CreditCard,
  Zap,
  ExternalLink,
  RefreshCw
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
  const { createPaynowDeposit, verifyPaynowPayment, currentUser } = usePlatform();

  const [agreedSalary, setAgreedSalary] = useState<number>(worker ? worker.monthlyRateUSD : 250);
  const [proofFileName, setProofFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [employerNameInput, setEmployerNameInput] = useState(currentUser ? currentUser.name : "Dr. Farai Mutasa");
  const [paymentMode, setPaymentMode] = useState<"paynow" | "later">("paynow");

  // Paynow direct flow
  const [isProcessingPaynow, setIsProcessingPaynow] = useState(false);
  const [paynowTx, setPaynowTx] = useState<{
    transactionId: string;
    paynowReference: string;
    pollUrl: string;
    checkoutUrl: string;
  } | null>(null);
  const [isVerifyingPaynow, setIsVerifyingPaynow] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

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
      const discount = 20;
      setAppliedDiscountUSD(discount);
      setAppliedCodeLabel(code);
      setCodeError(null);
    } else {
      setCodeError("Invalid referral voucher code. Please check your invite code.");
    }
  };

  const handleStartPaynow = async () => {
    setIsProcessingPaynow(true);
    setStatusFeedback(null);
    try {
      const res = await createPaynowDeposit(finalPlacementFeeUSD, "Paynow");
      if (res.success) {
        setPaynowTx({
          transactionId: res.transactionId,
          paynowReference: res.paynowReference,
          pollUrl: res.pollUrl,
          checkoutUrl: res.checkoutUrl,
        });
      } else {
        setStatusFeedback("Could not initialize Paynow gateway. Please try again.");
      }
    } catch (e) {
      setStatusFeedback("Payment gateway connection error.");
    } finally {
      setIsProcessingPaynow(false);
    }
  };

  const handleVerifyPaynowTx = async () => {
    if (!paynowTx) return;
    setIsVerifyingPaynow(true);
    setStatusFeedback(null);
    try {
      const res = await verifyPaynowPayment(paynowTx.transactionId, paynowTx.paynowReference);
      if (res.verified) {
        setStatusFeedback("✅ Placement fee verified & settled via Paynow!");
        const newRecord: PlacementFeeRecord = {
          id: `place-${Date.now()}`,
          workerId: worker.id,
          workerName: worker.fullName,
          employerName: employerNameInput || "Verified Employer",
          jobTitle: `${worker.role} Placement`,
          agreedSalaryUSD: agreedSalary,
          placementFeeUSD: finalPlacementFeeUSD,
          status: "Paid",
          placementDate: new Date().toISOString().split("T")[0],
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          paymentMethod: "EcoCash",
        };
        onRecordPlacementSuccess(newRecord);
        setIsSubmitted(true);
      } else {
        setStatusFeedback(`Status: ${res.message || "Awaiting confirmation from Paynow."}`);
      }
    } catch (e) {
      setStatusFeedback("Verification pending. Please verify after completing PIN prompt.");
    } finally {
      setIsVerifyingPaynow(false);
    }
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
      paymentMethod: "EcoCash",
      proofFileName: proofFileName || undefined,
      notes: appliedCodeLabel
        ? `30% Placement Fee with Referral Discount ${appliedCodeLabel} (-$${appliedDiscountUSD} USD)`
        : "30% Placement Fee agreed as per platform terms.",
    };

    setTimeout(() => {
      onRecordPlacementSuccess(newRecord);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
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

              {/* Paynow Zimbabwe Gateway Card */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={PAYMENT_GATEWAY_ASSETS.paynow}
                      alt="Paynow"
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded object-contain bg-white p-0.5"
                    />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Paynow Zimbabwe Payment Gateway
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-900/60 text-emerald-200 border border-emerald-700/50 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Instant Online Checkout
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs bg-slate-800 p-3 rounded-xl border border-slate-700">
                  <div className="flex items-center space-x-2">
                    <img
                      src={PAYMENT_GATEWAY_ASSETS.ecocash}
                      alt="EcoCash"
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-lg object-cover border border-blue-500/40 shrink-0"
                    />
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">Mobile</span>
                      <span className="font-bold text-white text-[11px]">EcoCash</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img
                      src={PAYMENT_GATEWAY_ASSETS.visaMastercard}
                      alt="Card"
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-lg object-cover border border-emerald-500/40 shrink-0"
                    />
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">Cards</span>
                      <span className="font-bold text-white text-[11px]">Visa / MC</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img
                      src={PAYMENT_GATEWAY_ASSETS.innbucks}
                      alt="InnBucks"
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-lg object-cover border border-amber-500/40 shrink-0"
                    />
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">Retail</span>
                      <span className="font-bold text-amber-300 text-[11px]">InnBucks</span>
                    </div>
                  </div>
                </div>

                {paynowTx ? (
                  <div className="p-3 bg-slate-950 rounded-xl border border-emerald-600/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-300 font-bold">Paynow Ref: {paynowTx.paynowReference}</span>
                      <span className="text-amber-300 font-bold">${finalPlacementFeeUSD} USD</span>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={paynowTx.checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-lg flex items-center justify-center gap-1"
                      >
                        <span>Open Gateway</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={handleVerifyPaynowTx}
                        disabled={isVerifyingPaynow}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg border border-slate-700 flex items-center gap-1"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingPaynow ? "animate-spin" : ""}`} />
                        <span>Verify</span>
                      </button>
                    </div>
                    {statusFeedback && (
                      <p className="text-[10px] text-emerald-300 font-semibold">{statusFeedback}</p>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleStartPaynow}
                    disabled={isProcessingPaynow}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow transition-all flex items-center justify-center space-x-1.5"
                  >
                    <Zap className="w-4 h-4" />
                    <span>{isProcessingPaynow ? "Opening Gateway..." : `Pay $${finalPlacementFeeUSD} USD via Paynow Gateway`}</span>
                  </button>
                )}
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
                  className="w-1/2 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs shadow transition-all flex items-center justify-center space-x-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isSubmitting ? "Recording..." : "Record Placement (Later)"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

