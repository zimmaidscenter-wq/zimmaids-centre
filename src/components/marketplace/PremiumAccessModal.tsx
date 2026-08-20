import React, { useState, useEffect } from "react";
import { usePlatform } from "../../context/PlatformContext";
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
  ExternalLink,
  Phone,
  MessageSquare,
  FileCheck2,
  Award,
  CreditCard,
  RefreshCw,
  AlertCircle,
  Clock,
  ArrowRight
} from "lucide-react";

interface PremiumAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency?: "USD" | "ZWG";
  onActivateSuccess?: () => void;
  onSubscribeSuccess?: () => void;
  targetWorkerName?: string;
  targetWorkerId?: string;
}

export const PremiumAccessModal: React.FC<PremiumAccessModalProps> = ({
  isOpen,
  onClose,
  currency = "USD",
  onActivateSuccess,
  onSubscribeSuccess,
  targetWorkerName,
  targetWorkerId,
}) => {
  const {
    currentUser,
    createPaynowDeposit,
    verifyPaynowPayment,
    subscribeEmployer,
    unlockMaidContact,
    currentWallet,
  } = usePlatform();

  const [paymentPlan, setPaymentPlan] = useState<"subscription" | "single_unlock">("subscription");
  const [paymentMethod, setPaymentMethod] = useState<"paynow_web" | "ecocash_mobile" | "onemoney_mobile">("paynow_web");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Paynow Active Transaction State
  const [paynowTx, setPaynowTx] = useState<{
    transactionId: string;
    paynowReference: string;
    pollUrl: string;
    checkoutUrl: string;
    amount: number;
    plan: "subscription" | "single_unlock";
  } | null>(null);

  const [isPolling, setIsPolling] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const planAmount = paymentPlan === "subscription" ? 30 : 5;

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

  const handleInitiatePaynowPayment = async () => {
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const amount = paymentPlan === "subscription" ? 30 : 5;
      const serviceName =
        paymentPlan === "subscription"
          ? "30-Day Unlimited Employer Access"
          : `Single Maid Unlock: ${targetWorkerName || "Domestic Worker"}`;

      let methodLabel = "Paynow Gateway";
      if (paymentMethod === "ecocash_mobile") methodLabel = "EcoCash Mobile Push";
      if (paymentMethod === "onemoney_mobile") methodLabel = "OneMoney Mobile Push";

      const res = await createPaynowDeposit(amount, methodLabel);

      if (res && res.success) {
        setPaynowTx({
          transactionId: res.transactionId,
          paynowReference: res.paynowReference,
          pollUrl: res.pollUrl,
          checkoutUrl: res.checkoutUrl,
          amount,
          plan: paymentPlan,
        });

        // Automatically open Paynow gateway in the same window if web checkout selected
        if (paymentMethod === "paynow_web" && res.checkoutUrl) {
          try {
            window.location.href = res.checkoutUrl;
          } catch (e) {
            console.warn("Same-window redirect notice:", e);
          }
        }
      } else {
        throw new Error("Unable to create Paynow transaction");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to initialize Paynow payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!paynowTx) return;
    setIsPolling(true);
    setErrorMsg(null);

    try {
      const verifyRes = await verifyPaynowPayment(paynowTx.transactionId, paynowTx.paynowReference);

      if (verifyRes.verified) {
        // Now finalize the subscription or unlock
        if (paynowTx.plan === "subscription") {
          await subscribeEmployer("30-Day Unlimited Access", 1);
          setSuccessMessage("Your 30-Day Unlimited Employer Subscription is now ACTIVE! You can view and contact all domestic workers.");
        } else if (targetWorkerId) {
          await unlockMaidContact(targetWorkerId);
          setSuccessMessage(`Contact details for ${targetWorkerName || "Worker"} have been unlocked!`);
        } else {
          setSuccessMessage(`Payment of $${paynowTx.amount} USD verified and credited to your wallet balance.`);
        }

        setPaymentSuccess(true);

        if (onActivateSuccess) onActivateSuccess();
        if (onSubscribeSuccess) onSubscribeSuccess();

        setTimeout(() => {
          onClose();
        }, 2500);
      } else {
        setErrorMsg("Payment not yet confirmed by Paynow. If you completed payment, please wait a moment and click Verify again.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Verification request failed. Please check your connection.");
    } finally {
      setIsPolling(false);
    }
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
              type="button"
              onClick={onClose}
              className="p-1.5 bg-emerald-950/60 hover:bg-emerald-950 text-white rounded-full transition-colors"
              title="Close (Escape)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 fill-slate-950" />
            <span>Paynow Zimbabwe Secure Checkout</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white">Unlock Candidate Contact Details</h3>
          <p className="text-xs text-emerald-200 mt-1">
            Official Paynow payment gateway for verified direct phone, WhatsApp, and private worker records.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {paymentSuccess ? (
            /* Success State */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-900">Payment Verified Successfully!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                {successMessage}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  Continue to Profile
                </button>
              </div>
            </div>
          ) : paynowTx ? (
            /* Active Paynow Transaction Redirection & Verification Screen */
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold uppercase tracking-wide text-amber-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                    <span>Paynow Transaction In Progress</span>
                  </span>
                  <span className="font-mono font-bold text-amber-900">${paynowTx.amount}.00 USD</span>
                </div>
                <div className="font-mono text-[11px] text-amber-800 bg-white/80 p-2 rounded-lg border border-amber-200/60">
                  Ref: <span className="font-bold">{paynowTx.paynowReference}</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Please complete authorization on the Paynow Zimbabwe secure page or your mobile phone. Once approved, click the button below to confirm.
                </p>
              </div>

              {/* Redirect to Paynow Button on Same Window */}
              <a
                href={paynowTx.checkoutUrl}
                target="_self"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 text-center"
              >
                <span>Open Paynow Gateway (Same Window)</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Server Verification Action */}
              <button
                type="button"
                onClick={handleVerifyPayment}
                disabled={isPolling}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isPolling ? "animate-spin text-emerald-400" : ""}`} />
                <span>{isPolling ? "Checking Paynow Status..." : "I Have Completed Payment — Verify Now"}</span>
              </button>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setPaynowTx(null)}
                className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 text-center"
              >
                Choose a different payment option
              </button>
            </div>
          ) : (
            /* Plan Selection & Payment Form */
            <>
              {/* Plan Choice Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Select Access Plan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentPlan("subscription")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      paymentPlan === "subscription"
                        ? "border-emerald-600 bg-emerald-50/70 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black uppercase text-emerald-900">30-Day Unlimited Pass</span>
                        <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[9px] font-black rounded-full uppercase">
                          Best Value
                        </span>
                      </div>
                      <div className="text-2xl font-black text-slate-900">$30 <span className="text-xs font-normal text-slate-500">USD</span></div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Unlimited phone numbers, WhatsApp, and background documents for ALL workers for 30 days.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentPlan("single_unlock")}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      paymentPlan === "single_unlock"
                        ? "border-emerald-600 bg-emerald-50/70 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black uppercase text-slate-900">Single Worker Unlock</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[9px] font-bold rounded-full">
                          1 Worker
                        </span>
                      </div>
                      <div className="text-2xl font-black text-slate-900">$5 <span className="text-xs font-normal text-slate-500">USD</span></div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Instant permanent contact details unlock for {targetWorkerName || "this selected worker"}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Select Payment Gateway
                </label>

                {/* Paynow Online Gateway Card */}
                <div
                  onClick={() => setPaymentMethod("paynow_web")}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === "paynow_web"
                      ? "border-emerald-600 bg-emerald-50/70"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={PAYMENT_GATEWAY_ASSETS.paynow}
                      alt="Paynow"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-contain border border-slate-200 p-1 bg-white shrink-0"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Paynow Zimbabwe (Instant Redirect)</span>
                        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-extrabold rounded">Instant</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        EcoCash, OneMoney, Visa, MasterCard, Zimswitch, InnBucks
                      </div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "paynow_web" ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300"}`}>
                    {paymentMethod === "paynow_web" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                {/* EcoCash Mobile USSD Push */}
                <div
                  onClick={() => setPaymentMethod("ecocash_mobile")}
                  className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    paymentMethod === "ecocash_mobile"
                      ? "border-emerald-600 bg-emerald-50/70"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={PAYMENT_GATEWAY_ASSETS.ecocash}
                      alt="EcoCash"
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-xl object-contain border border-slate-200 p-1 bg-white shrink-0"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">EcoCash Mobile USSD Push</div>
                      <div className="text-[10px] text-slate-500">Receive authorization prompt directly on your mobile phone</div>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "ecocash_mobile" ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300"}`}>
                    {paymentMethod === "ecocash_mobile" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
              </div>

              {/* Mobile Number Input for USSD Push */}
              {(paymentMethod === "ecocash_mobile" || paymentMethod === "onemoney_mobile") && (
                <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-700 block">
                    EcoCash / Mobile Number for PIN Prompt:
                  </label>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="e.g. 0772 345 678"
                      className="w-full bg-white border border-slate-300 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    A USSD prompt will be sent to your phone to approve the payment.
                  </p>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Paynow Redirect Submission Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleInitiatePaynowPayment}
                  disabled={isProcessing}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 active:scale-[0.99]"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {isProcessing
                      ? "Initiating Paynow Gateway..."
                      : `Redirect to Paynow to Pay $${planAmount}.00 USD`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Security & Verification Footer */}
              <div className="flex items-center justify-center space-x-4 text-[10px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted</span>
                </span>
                <span>•</span>
                <span>Paynow Zimbabwe Certified Gateway</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
