import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  CreditCard,
  Building,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  Printer,
  Download,
  Clock,
  RefreshCw,
} from "lucide-react";

export interface PaynowPaymentDetails {
  title: string;
  amountUSD: number;
  serviceType: "featured_maid" | "agency_subscription" | "contact_unlock" | "placement_escrow" | "wallet_deposit" | "urgent_fee" | "other";
  targetId?: string;
  targetName?: string;
  metadata?: Record<string, any>;
}

export interface PaynowReceipt {
  transactionReference: string;
  paynowReference: string;
  serviceTitle: string;
  amountUSD: number;
  amountZWG: number;
  paymentMethod: string;
  phoneNumber?: string;
  paidAt: string;
  status: "Completed" | "Verified";
  targetName?: string;
}

interface PaynowModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: PaynowPaymentDetails | null;
  onSuccess: (receipt: PaynowReceipt) => void;
}

export const PaynowModal: React.FC<PaynowModalProps> = ({
  isOpen,
  onClose,
  details,
  onSuccess,
}) => {
  const [step, setStep] = useState<"method" | "processing" | "success">("method");
  const [paymentMethod, setPaymentMethod] = useState<"ecocash" | "onemoney" | "card" | "innbucks">("ecocash");
  const [phoneNumber, setPhoneNumber] = useState("0785458828");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [currencyMode, setCurrencyMode] = useState<"USD" | "ZWG">("USD");
  const [countdown, setCountdown] = useState(15);
  const [errorMsg, setErrorMsg] = useState("");
  const [paynowRef, setPaynowRef] = useState("");
  const [completedReceipt, setCompletedReceipt] = useState<PaynowReceipt | null>(null);

  const ZWG_RATE = 28.5; // 1 USD = 28.50 ZWG

  useEffect(() => {
    if (isOpen && details) {
      setStep("method");
      setErrorMsg("");
      setCountdown(12);
      const generatedRef = `PAYNOW-ZMC-${Math.floor(100000 + Math.random() * 900000)}`;
      setPaynowRef(generatedRef);
    }
  }, [isOpen, details]);

  // Countdown timer for processing USSD Push simulation
  useEffect(() => {
    let timer: any;
    if (step === "processing") {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      } else {
        // Auto-complete simulation
        handlePaymentApproved();
      }
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  if (!isOpen || !details) return null;

  const amountUSD = details.amountUSD || 3.0;
  const amountZWG = Number((amountUSD * ZWG_RATE).toFixed(2));
  const displayAmount = currencyMode === "USD" ? `$${amountUSD.toFixed(2)} USD` : `${amountZWG.toFixed(2)} ZWG`;

  const handleInitiatePaynow = (e: React.FormEvent) => {
    e.preventDefault();
    if ((paymentMethod === "ecocash" || paymentMethod === "onemoney" || paymentMethod === "innbucks") && !phoneNumber.trim()) {
      setErrorMsg("Please enter your mobile phone number for the Paynow USSD prompt.");
      return;
    }
    setErrorMsg("");
    setStep("processing");
    setCountdown(10);
  };

  const handlePaymentApproved = () => {
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);
    const receipt: PaynowReceipt = {
      transactionReference: `TX-${Date.now()}`,
      paynowReference: paynowRef,
      serviceTitle: details.title,
      amountUSD,
      amountZWG,
      paymentMethod:
        paymentMethod === "ecocash"
          ? "EcoCash (USSD Direct)"
          : paymentMethod === "onemoney"
          ? "OneMoney (NetOne)"
          : paymentMethod === "innbucks"
          ? "InnBucks Pay"
          : "Visa / Mastercard Online",
      phoneNumber: phoneNumber || undefined,
      paidAt: now,
      status: "Completed",
      targetName: details.targetName,
    };
    setCompletedReceipt(receipt);
    setStep("success");
    onSuccess(receipt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Paynow Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-md">
              <span className="font-black text-emerald-700 text-xs tracking-tighter">paynow</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black tracking-tight">Paynow Zimbabwe Gateway</h3>
                <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-400/40 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> 256-Bit SSL
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                Official Secure Payment Clearing for Zimbabwe Maids Centre
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* STEP 1: Method & Phone Input */}
          {step === "method" && (
            <form onSubmit={handleInitiatePaynow} className="space-y-4">
              {/* Service Summary Card */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                    Payment For
                  </span>
                  <h4 className="text-sm font-black text-slate-900">{details.title}</h4>
                  {details.targetName && (
                    <p className="text-xs text-slate-600 font-medium">Candidate / Account: {details.targetName}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-emerald-700">{displayAmount}</div>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    {currencyMode === "USD" ? `≈ ${amountZWG.toFixed(2)} ZWG` : `≈ $${amountUSD.toFixed(2)} USD`}
                  </div>
                </div>
              </div>

              {/* Currency Toggle */}
              <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-xl text-xs font-bold">
                <span className="text-slate-600 text-[11px] px-2">Pay in:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrencyMode("USD")}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      currencyMode === "USD" ? "bg-white text-emerald-800 shadow-sm font-black" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    USD ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrencyMode("ZWG")}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      currencyMode === "ZWG" ? "bg-white text-emerald-800 shadow-sm font-black" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    ZWG (Gold)
                  </button>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Select Paynow Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("ecocash")}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center space-x-2.5 ${
                      paymentMethod === "ecocash"
                        ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      EC
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">EcoCash</div>
                      <div className="text-[10px] text-slate-500">USSD Direct Push</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("onemoney")}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center space-x-2.5 ${
                      paymentMethod === "onemoney"
                        ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-orange-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                      1M
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">OneMoney</div>
                      <div className="text-[10px] text-slate-500">NetOne Wallet</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("innbucks")}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center space-x-2.5 ${
                      paymentMethod === "innbucks"
                        ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-yellow-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                      IB
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">InnBucks</div>
                      <div className="text-[10px] text-slate-500">Simbisa Outlets</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center space-x-2.5 ${
                      paymentMethod === "card"
                        ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Visa / Mastercard</div>
                      <div className="text-[10px] text-slate-500">Zimswitch & Cards</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Mobile Phone / Account Details Input */}
              {paymentMethod !== "card" ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>
                      {paymentMethod === "ecocash" ? "EcoCash Registered Number" : paymentMethod === "onemoney" ? "NetOne Registered Number" : "InnBucks Mobile Number"}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Instant USSD PIN Prompt</span>
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 0771234567 or 0785458828"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    A secure pop-up PIN authorization prompt will be transmitted to this number via Paynow Zimbabwe.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4000 1234 5678 9010"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">CVV Security</label>
                      <input
                        type="password"
                        value={cardCVV}
                        onChange={(e) => setCardCVV(e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Pay {displayAmount} via Paynow</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: USSD Push Processing Simulation */}
          {step === "processing" && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center relative">
                <RefreshCw className="w-8 h-8 animate-spin" />
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-600 text-white text-[11px] font-black rounded-full flex items-center justify-center">
                  {countdown}s
                </span>
              </div>

              <div className="space-y-1 max-w-xs mx-auto">
                <h4 className="text-base font-black text-slate-900">USSD Push Sent to Your Phone</h4>
                <p className="text-xs text-slate-600 font-medium">
                  Please check phone <span className="font-bold text-slate-900">{phoneNumber}</span> and enter your {paymentMethod.toUpperCase()} PIN to approve <span className="font-black text-emerald-700">{displayAmount}</span>.
                </p>
              </div>

              <div className="bg-slate-100 rounded-2xl p-3 text-left space-y-1 text-xs text-slate-700 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-500">Paynow Ref:</span>
                  <span className="font-mono font-bold">{paynowRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Merchant:</span>
                  <span className="font-bold">Zimbabwe Maids Centre</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount:</span>
                  <span className="font-bold text-emerald-700">{displayAmount}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={handlePaymentApproved}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow transition-all"
                >
                  ✓ Simulate Instant Phone PIN Confirmation
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Completed Receipt */}
          {step === "success" && completedReceipt && (
            <div className="py-2 space-y-4">
              <div className="text-center space-y-1.5">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-slate-900">Payment Successfully Cleared!</h4>
                <p className="text-xs text-emerald-700 font-bold">
                  {details.title} has been activated via Paynow Zimbabwe.
                </p>
              </div>

              {/* Official Receipt Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="font-black text-slate-800">Paynow Receipt</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-black rounded-md text-[10px]">
                    VERIFIED & PAID
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Reference</span>
                    <span className="font-mono font-bold text-slate-800">{completedReceipt.paynowReference}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Date & Time</span>
                    <span className="font-semibold text-slate-800">{completedReceipt.paidAt}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Amount Paid</span>
                    <span className="font-black text-emerald-700 text-sm">
                      ${completedReceipt.amountUSD.toFixed(2)} USD
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Method</span>
                    <span className="font-semibold text-slate-800">{completedReceipt.paymentMethod}</span>
                  </div>
                </div>

                {completedReceipt.targetName && (
                  <div className="pt-1 border-t border-slate-200 text-[11px]">
                    <span className="text-slate-400 block text-[10px]">Beneficiary / Target</span>
                    <span className="font-bold text-slate-800">{completedReceipt.targetName}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow transition-all"
                >
                  <span>Done / Continue</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
