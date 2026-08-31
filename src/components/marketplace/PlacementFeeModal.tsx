import React, { useState } from "react";
import { WorkerProfile, PlacementFeeRecord } from "../../types/marketplace";
import { PAYMENT_GATEWAY_ASSETS } from "../common/PaymentBadges";
import { VerifiedBadge } from "../common/VerifiedBadge";
import { usePlatform } from "../../context/PlatformContext";
import { useAuth } from "../../context/AuthContext";
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
  CreditCard,
  Zap,
  ExternalLink,
  RefreshCw,
  Wallet
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
}) => {
  const { createPaynowDeposit, verifyPaynowPayment, currentUser: platformUser, recordHiringNotification, currentWallet } = usePlatform();
  const { currentUser: authUser, updateUserWalletBalance } = useAuth();

  const [agreedSalary, setAgreedSalary] = useState<number>(worker ? worker.monthlyRateUSD : 250);
  const [proofFileName, setProofFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [employerNameInput, setEmployerNameInput] = useState(authUser?.fullName || platformUser?.name || "Verified Employer");

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

  if (!worker) return null;

  // Placement fee is strictly 30% of agreed salary
  const basePlacementFeeUSD = Math.round(agreedSalary * 0.3);
  const finalPlacementFeeUSD = basePlacementFeeUSD;
  const availableBalance = authUser?.walletBalanceUSD ?? currentWallet.balance ?? 0;
  const hasSufficientFunds = availableBalance >= finalPlacementFeeUSD;

  // Pay using account funds
  const handlePayFromAccountFunds = async () => {
    if (!hasSufficientFunds) {
      setStatusFeedback(`Insufficient account balance ($${availableBalance.toFixed(2)} USD). Please add funds via Paynow below.`);
      return;
    }
    setIsSubmitting(true);
    setStatusFeedback(null);
    try {
      const newBalance = availableBalance - finalPlacementFeeUSD;
      if (updateUserWalletBalance) {
        await updateUserWalletBalance(newBalance);
      }
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
        paymentMethod: "Account Balance",
      };
      onRecordPlacementSuccess(newRecord);
      recordHiringNotification(worker.fullName, worker.role);
      setIsSubmitted(true);
    } catch (e: any) {
      setStatusFeedback("Error deducting from account balance: " + (e?.message || "Please try again."));
    } finally {
      setIsSubmitting(false);
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
        if (res.checkoutUrl) {
          try {
            window.location.href = res.checkoutUrl;
          } catch (e) {
            console.warn("Same-window redirect notice:", e);
          }
        }
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
        recordHiringNotification(worker.fullName, worker.role);
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

  const handleConfirmPlacement = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasSufficientFunds) {
      handlePayFromAccountFunds();
      return;
    }
    handleStartPaynow();
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
            <span>Placement & Direct Contacts Unlock</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">
            Place {worker.fullName}
          </h3>
          <p className="text-xs text-emerald-200 mt-1">
            Place candidate and unlock direct phone numbers, WhatsApp, and verified IDs.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-900">Placement Confirmed & Contacts Unlocked!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Candidate contact details for <strong>{worker.fullName}</strong> are now available in your employer dashboard.
              </p>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-left space-y-1 text-xs">
                <p className="font-bold text-emerald-900">Direct Contacts:</p>
                <p className="text-slate-700">Phone: {worker.phoneNumber || "+263 771 902 441"}</p>
                <p className="text-slate-700">WhatsApp: {worker.whatsappNumber || "+263 771 902 441"}</p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-500"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleConfirmPlacement} className="space-y-4">
              {/* Account Balance Widget */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Your Account Balance</span>
                    <span className="text-lg font-black text-white">${availableBalance.toFixed(2)} USD</span>
                  </div>
                </div>
                {hasSufficientFunds ? (
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-lg border border-emerald-500/30">
                    Ready to place
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-lg border border-amber-500/30">
                    Top-up needed
                  </span>
                )}
              </div>

              {/* Agreed Salary Input */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Agreed First Month's Salary (USD)
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
                  <hr className="border-emerald-200 my-1" />
                  <div className="flex justify-between text-sm font-black text-emerald-950 pt-0.5">
                    <span>Placement Fee Due:</span>
                    <span className="text-emerald-700 font-mono text-base">${finalPlacementFeeUSD} USD</span>
                  </div>
                </div>
              </div>

              {statusFeedback && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs font-medium text-amber-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{statusFeedback}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {hasSufficientFunds ? (
                  <button
                    type="button"
                    onClick={handlePayFromAccountFunds}
                    disabled={isSubmitting}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? "Processing Placement..."
                        : `Place Worker using Account Funds ($${finalPlacementFeeUSD} USD)`}
                    </span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleStartPaynow}
                      disabled={isProcessingPaynow}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>
                        {isProcessingPaynow
                          ? "Connecting to Paynow..."
                          : `Pay $${finalPlacementFeeUSD} USD via Paynow & Unlock Contacts`}
                      </span>
                    </button>

                    {paynowTx && (
                      <button
                        type="button"
                        onClick={handleVerifyPaynowTx}
                        disabled={isVerifyingPaynow}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingPaynow ? "animate-spin" : ""}`} />
                        <span>Confirm Paynow Payment Status</span>
                      </button>
                    )}
                  </>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

