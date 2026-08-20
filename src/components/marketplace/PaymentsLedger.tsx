import React, { useState } from "react";
import { PlacementFeeRecord, PremiumSubscription } from "../../types/marketplace";
import { PAYMENT_GATEWAY_ASSETS } from "../common/PaymentBadges";
import { usePlatform } from "../../context/PlatformContext";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  MessageCircle,
  PhoneCall,
  Smartphone,
  Copy,
  Check,
  Upload,
  Sparkles,
  Search,
  Filter,
  UserX,
  AlertTriangle,
  RefreshCw,
  Building2,
  Globe,
  ExternalLink,
  Zap,
  ArrowRight
} from "lucide-react";

interface PaymentsLedgerProps {
  currency: "USD" | "ZWG";
  placementList?: PlacementFeeRecord[];
  isPremiumEmployer?: boolean;
  onActivatePremium?: () => void;
}

export const PaymentsLedger: React.FC<PaymentsLedgerProps> = ({
  currency,
  placementList,
  isPremiumEmployer = false,
  onActivatePremium,
}) => {
  const { createPaynowDeposit, verifyPaynowPayment, subscribeEmployer } = usePlatform();

  const [activeTab, setActiveTab] = useState<
    "placement-fees" | "premium-access" | "payment-instructions" | "blacklisting-policy"
  >("placement-fees");

  const [calcSalary, setCalcSalary] = useState<number>(300);
  const [proofFile, setProofFile] = useState<string | null>(null);
  const [uploadedProofRecordId, setUploadedProofRecordId] = useState<string | null>(null);

  // Paynow Gateway Checkout State for Placement Fees / Subscriptions
  const [isProcessingPaynow, setIsProcessingPaynow] = useState(false);
  const [paynowTx, setPaynowTx] = useState<{
    transactionId: string;
    paynowReference: string;
    pollUrl: string;
    checkoutUrl: string;
    amount: number;
    description: string;
    recordId?: string;
  } | null>(null);
  const [isVerifyingPaynow, setIsVerifyingPaynow] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  // Initial Sample Placement Fees
  const [feesList, setFeesList] = useState<PlacementFeeRecord[]>(
    placementList || [
      {
        id: "place-101",
        workerId: "w-maid-1",
        workerName: "Rudo Dube",
        employerName: "Mrs. Farai Mutasa",
        jobTitle: "Full-Time Maid Placement",
        agreedSalaryUSD: 200,
        placementFeeUSD: 60, // 30%
        status: "Paid",
        placementDate: "2026-08-01",
        dueDate: "2026-08-15",
        paymentMethod: "EcoCash",
        ecoCashNumberUsed: "+263 77 123 4567",
      },
      {
        id: "place-102",
        workerId: "w1",
        workerName: "Tendai Mukamuri",
        employerName: "Dr. Nyasha Tagwirei",
        jobTitle: "Domestic Housekeeper Placement",
        agreedSalaryUSD: 220,
        placementFeeUSD: 66, // 30%
        status: "Pending",
        placementDate: "2026-08-08",
        dueDate: "2026-08-22",
        paymentMethod: "EcoCash",
      },
      {
        id: "place-103",
        workerId: "w2",
        workerName: "Chipo Moyo",
        employerName: "Mrs. Margaret Chigumba",
        jobTitle: "Live-In Nanny Placement",
        agreedSalaryUSD: 260,
        placementFeeUSD: 78, // 30%
        status: "Under Review",
        placementDate: "2026-08-10",
        dueDate: "2026-08-24",
        proofFileName: "EcoCash_Receipt_Chipo_Placement.png",
        paymentMethod: "EcoCash",
      },
      {
        id: "place-104",
        workerId: "w4",
        workerName: "Blessing Chirwa",
        employerName: "Tafadzwa Mutasa",
        jobTitle: "Class 1 Electrician Contract",
        agreedSalaryUSD: 600,
        placementFeeUSD: 180, // 30%
        status: "Overdue",
        placementDate: "2026-07-20",
        dueDate: "2026-08-03",
        paymentMethod: "EcoCash",
        notes: "Payment overdue. Account restricted as per terms.",
      },
    ]
  );

  const calcPlacementFeeUSD = Math.round(calcSalary * 0.3);

  const handleInitiatePaynowForRecord = async (record: PlacementFeeRecord) => {
    setIsProcessingPaynow(true);
    setStatusFeedback(null);
    try {
      const res = await createPaynowDeposit(record.placementFeeUSD, "Paynow");
      if (res.success) {
        setPaynowTx({
          transactionId: res.transactionId,
          paynowReference: res.paynowReference,
          pollUrl: res.pollUrl,
          checkoutUrl: res.checkoutUrl,
          amount: record.placementFeeUSD,
          description: `30% Placement Fee: ${record.workerName} (${record.jobTitle})`,
          recordId: record.id,
        });
      } else {
        setStatusFeedback("Could not connect to Paynow Zimbabwe. Please try again.");
      }
    } catch (e) {
      setStatusFeedback("Error initiating payment gateway.");
    } finally {
      setIsProcessingPaynow(false);
    }
  };

  const handleVerifyCurrentPaynowTx = async () => {
    if (!paynowTx) return;
    setIsVerifyingPaynow(true);
    setStatusFeedback(null);
    try {
      const res = await verifyPaynowPayment(paynowTx.transactionId, paynowTx.paynowReference);
      if (res.verified) {
        if (paynowTx.recordId) {
          setFeesList((prev) =>
            prev.map((rec) =>
              rec.id === paynowTx.recordId ? { ...rec, status: "Paid", paymentMethod: "EcoCash" } : rec
            )
          );
        }
        setStatusFeedback(`✅ Payment verified successfully with Paynow! Status: PAID.`);
        setTimeout(() => {
          setPaynowTx(null);
          setStatusFeedback(null);
        }, 3000);
      } else {
        setStatusFeedback(`Status: ${res.message || "Awaiting confirmation from Paynow."}`);
      }
    } catch (e) {
      setStatusFeedback("Failed to verify transaction status. Please check again in a few seconds.");
    } finally {
      setIsVerifyingPaynow(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-emerald-800/40 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-800/80 rounded-full text-xs font-semibold text-emerald-200 border border-emerald-600/40">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Placement Fee Policy & Premium Employer Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Zimbabwe Maids Centre Financial Ledger
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
            Transparent revenue structure: Free job postings, 100% free candidate profile creation, USD $30 / 30-day Premium Employer Access, and a one-time 30% placement fee upon successful candidate placement.
          </p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("placement-fees")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === "placement-fees"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>30% Placement Fee Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab("premium-access")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === "premium-access"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>$30 Premium Employer Access</span>
        </button>

        <button
          onClick={() => setActiveTab("payment-instructions")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === "payment-instructions"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <CreditCard className="w-4 h-4 text-emerald-400" />
          <span>Paynow Payment Gateway</span>
        </button>

        <button
          onClick={() => setActiveTab("blacklisting-policy")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
            activeTab === "blacklisting-policy"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Blacklisting & Protection Policy</span>
        </button>
      </div>

      {/* Active Paynow Transaction Modal / Overlay for PaymentsLedger */}
      {paynowTx && (
        <div className="bg-slate-900 border-2 border-emerald-500 rounded-3xl p-6 text-white shadow-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-emerald-500/20 rounded-xl">
                <Zap className="w-5 h-5 text-emerald-400 animate-pulse" />
              </span>
              <div>
                <h4 className="font-extrabold text-sm text-white">Paynow Zimbabwe Checkout Active</h4>
                <p className="text-xs text-slate-300">{paynowTx.description}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-amber-300">${paynowTx.amount}.00 USD</span>
              <span className="block text-[10px] text-slate-400">Ref: {paynowTx.paynowReference}</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <a
              href={paynowTx.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Open Paynow Gateway Checkout</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={handleVerifyCurrentPaynowTx}
              disabled={isVerifyingPaynow}
              className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isVerifyingPaynow ? "animate-spin text-emerald-400" : ""}`} />
              <span>{isVerifyingPaynow ? "Verifying with Paynow..." : "I've Paid — Verify Payment"}</span>
            </button>

            <button
              onClick={() => setPaynowTx(null)}
              className="text-xs text-slate-400 hover:text-white underline px-2"
            >
              Close
            </button>
          </div>

          {statusFeedback && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-600/50 rounded-xl text-xs text-emerald-200 font-semibold">
              {statusFeedback}
            </div>
          )}
        </div>
      )}

      {/* Tab 1: 30% Placement Fee Ledger */}
      {activeTab === "placement-fees" && (
        <div className="space-y-6">
          {/* Quick Interactive 30% Calculator & Info Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Calculator Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>30% Placement Fee Calculator</span>
              </h3>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Agreed First Month's Salary:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    value={calcSalary}
                    onChange={(e) => setCalcSalary(Number(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Agreed Salary:</span>
                  <span className="font-bold text-slate-900">${calcSalary} USD</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Placement Fee (30%):</span>
                  <span className="font-black text-emerald-700 text-sm">${calcPlacementFeeUSD} USD</span>
                </div>
              </div>
            </div>

            {/* Official Paynow Gateway Mini Box */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 md:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={PAYMENT_GATEWAY_ASSETS.paynow}
                    alt="Paynow"
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded object-contain bg-white p-0.5"
                  />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Paynow Zimbabwe Certified Payment Gateway
                  </h3>
                </div>
                <span className="text-[10px] bg-emerald-900/80 text-emerald-200 border border-emerald-600/50 font-bold px-2 py-0.5 rounded-full">
                  Automated Gateway
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-800 p-3 rounded-xl border border-slate-700">
                <div className="flex items-center space-x-2">
                  <img
                    src={PAYMENT_GATEWAY_ASSETS.ecocash}
                    alt="EcoCash"
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-lg object-cover border border-blue-500/40 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Mobile Money</span>
                    <span className="font-bold text-white">EcoCash & OneMoney</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <img
                    src={PAYMENT_GATEWAY_ASSETS.visaMastercard}
                    alt="Cards"
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-lg object-cover border border-emerald-500/40 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Card Payments</span>
                    <span className="font-bold text-white">Visa & Mastercard</span>
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
                    <span className="text-[10px] text-slate-400 uppercase block">Instant Cash</span>
                    <span className="font-bold text-amber-300">InnBucks & Zimswitch</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                All placement fees and subscriptions are processed securely through the certified Paynow Zimbabwe Gateway with real-time server-side verification and instant status update.
              </p>
            </div>
          </div>

          {/* Placement Fee Records Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Placement Fee Records</h3>
                <p className="text-xs text-slate-500">
                  Tracking 30% placement fees for confirmed domestic worker & artisan job placements.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="p-3.5">Candidate / Employer</th>
                    <th className="p-3.5">Job Title</th>
                    <th className="p-3.5">Agreed Salary</th>
                    <th className="p-3.5">30% Placement Fee</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Due Date</th>
                    <th className="p-3.5 text-right">Action / Gateway</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {feesList.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{rec.workerName}</div>
                        <div className="text-[11px] text-slate-500">Employer: {rec.employerName}</div>
                      </td>
                      <td className="p-3.5 font-medium">{rec.jobTitle}</td>
                      <td className="p-3.5 font-bold text-slate-900">${rec.agreedSalaryUSD} USD</td>
                      <td className="p-3.5 font-extrabold text-emerald-700">${rec.placementFeeUSD} USD</td>
                      <td className="p-3.5">
                        {rec.status === "Paid" && (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Paid</span>
                          </span>
                        )}
                        {rec.status === "Pending" && (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending</span>
                          </span>
                        )}
                        {rec.status === "Under Review" && (
                          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Under Review</span>
                          </span>
                        )}
                        {rec.status === "Overdue" && (
                          <span className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-full font-bold text-[10px] inline-flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Overdue (Restricted)</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-600 font-mono text-[11px]">{rec.dueDate}</td>
                      <td className="p-3.5 text-right">
                        {rec.status === "Paid" ? (
                          <span className="text-[11px] text-emerald-700 font-semibold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Settled via Paynow</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleInitiatePaynowForRecord(rec)}
                            disabled={isProcessingPaynow}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay via Paynow (${rec.placementFeeUSD})</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Premium Employer Access ($30 USD / 30 Days) */}
      {activeTab === "premium-access" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span>Employer Subscription Plan</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              Premium Employer Access ($30 USD / 30 Days)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Employers can unlock direct protected candidate contact details (Phone numbers, WhatsApp, Email, Physical addresses) via the Paynow payment gateway.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Card */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-500 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Your Subscription Status</span>
                {isPremiumEmployer ? (
                  <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-black rounded-full shadow">
                    Active (30-Day Pass)
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-full">
                    Free Unsubscribed
                  </span>
                )}
              </div>

              <div className="text-3xl font-black text-slate-900">
                $30 <span className="text-sm font-semibold text-slate-500">USD / 30 Days</span>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited access to verified & vetted candidate contact details</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Priority 24/7 dedicated customer support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Advanced search filters & verified-workers-only filter</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Saved candidate lists & fast shortlist manager</span>
                </div>
              </div>

              {onActivatePremium && !isPremiumEmployer && (
                <button
                  onClick={onActivatePremium}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95"
                >
                  <CreditCard className="w-4 h-4 text-white" />
                  <span>Pay $30 USD via Paynow Gateway</span>
                </button>
              )}
            </div>

            {/* Paynow Zimbabwe Gateway Box */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <img
                    src={PAYMENT_GATEWAY_ASSETS.paynow}
                    alt="Paynow"
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded object-contain bg-white p-0.5"
                  />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Direct Payment Gateway Integration
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  All subscriptions are processed automatically via the <strong>Paynow Zimbabwe Payment Gateway</strong>. No manual receipts or delay required.
                </p>

                <div className="space-y-2 text-xs bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Gateway:</span>
                    <span className="font-bold text-emerald-400">Paynow Zimbabwe</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Supported Methods:</span>
                    <span className="font-semibold text-white">EcoCash, OneMoney, Visa, MasterCard, InnBucks</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                    <span className="text-slate-400">Processing Time:</span>
                    <span className="font-bold text-amber-300">Instant Automated Verification</span>
                  </div>
                </div>
              </div>

              {onActivatePremium && !isPremiumEmployer && (
                <button
                  onClick={onActivatePremium}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Launch Paynow Checkout ($30)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Official Paynow Gateway Overview */}
      {activeTab === "payment-instructions" && (
        <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="max-w-2xl space-y-2">
            <span className="px-3 py-1 bg-emerald-800/80 text-emerald-200 text-xs font-bold rounded-full">
              Automated Online Settlement
            </span>
            <h3 className="text-2xl font-black text-white">Paynow Zimbabwe Payment Gateway</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              All transactions on Zimbabwe Maids Centre — including Premium Employer subscriptions, worker wallet deposits, and 30% placement fees — are routed securely through Paynow Zimbabwe.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2.5">
                <img
                  src={PAYMENT_GATEWAY_ASSETS.ecocash}
                  alt="EcoCash"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover border border-blue-500/40 shrink-0"
                />
                <div>
                  <h4 className="font-extrabold text-white text-xs">EcoCash Mobile</h4>
                  <span className="text-[10px] text-blue-300">USD & ZWG Mobile Money</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Direct USSD push or Paynow web prompt. Instant verification upon entering your PIN.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2.5">
                <img
                  src={PAYMENT_GATEWAY_ASSETS.visaMastercard}
                  alt="Cards"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover border border-emerald-500/40 shrink-0"
                />
                <div>
                  <h4 className="font-extrabold text-white text-xs">Visa & MasterCard</h4>
                  <span className="text-[10px] text-emerald-300">International & Local Cards</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Secure 3D-Secure debit/credit card clearance for diaspora and domestic clients.
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2.5">
                <img
                  src={PAYMENT_GATEWAY_ASSETS.innbucks}
                  alt="InnBucks"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover border border-amber-500/40 shrink-0"
                />
                <div>
                  <h4 className="font-extrabold text-white text-xs">InnBucks & Zimswitch</h4>
                  <span className="text-[10px] text-amber-300">Fast Retail & Bank Clearing</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Fast cash deposits via Simbisa outlets & Zimswitch online bank direct debits.
              </p>
            </div>
          </div>

          <div className="p-4 bg-emerald-950/60 border border-emerald-800/60 rounded-2xl text-xs text-emerald-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>All payments are SSL encrypted and protected by Paynow Zimbabwe merchant escrow.</span>
            </div>
            {onActivatePremium && !isPremiumEmployer && (
              <button
                onClick={onActivatePremium}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shrink-0 ml-3"
              >
                Pay via Gateway →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Blacklisting & Protection Policy */}
      {activeTab === "blacklisting-policy" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-rose-100 text-rose-900 rounded-full text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Platform Terms & Protection</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              Placement Fee Non-Payment & Blacklisting Policy
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If a worker or service provider fails to pay the agreed 30% placement fee after a successful placement, account restrictions apply strictly in accordance with platform policies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>1. Automated Reminders</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Automated SMS and email reminders are dispatched upon placement confirmation and 3 days prior to due date.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>2. Proof Upload & Dispute Review</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Users can upload proof of payment screenshots or submit disputes to admin before any account action is taken.
              </p>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1.5 sm:col-span-2">
              <div className="font-bold text-rose-900 flex items-center gap-1.5">
                <UserX className="w-4 h-4 text-rose-600" />
                <span>3. Account Restriction & Public Search Hide</span>
              </div>
              <p className="text-rose-800 text-[11px] leading-relaxed">
                Unresolved non-payment results in account restriction following administrative review. Restricted accounts are automatically prevented from appearing in public candidate searches until resolved.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
