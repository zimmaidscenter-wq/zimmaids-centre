import React, { useState } from "react";
import { WorkerProfile } from "../../types/marketplace";
import {
  CreditCard,
  ShieldCheck,
  Smartphone,
  QrCode,
  Building2,
  CheckCircle2,
  X,
  Lock,
  ArrowRight,
  Loader2,
  Globe,
  MessageCircle,
  PhoneCall,
  Send,
  Building,
  DollarSign,
  Landmark,
  Zap,
  Receipt,
  Download
} from "lucide-react";

export type PaymentGatewayType =
  | "EcoCash"
  | "OneMoney"
  | "InnBucks"
  | "Mukuru"
  | "ZIPIT"
  | "Visa"
  | "MasterCard"
  | "Bank Transfer";

interface EscrowPaymentModalProps {
  worker: WorkerProfile | null;
  onClose: () => void;
  currency: "USD" | "ZWG";
  onPaymentSuccess: (escrowDetails: any) => void;
}

export const EscrowPaymentModal: React.FC<EscrowPaymentModalProps> = ({
  worker,
  onClose,
  currency,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentGatewayType>("EcoCash");
  const [phoneNumber, setPhoneNumber] = useState<string>("+263 771 234 567");
  const [oneMoneyPhone, setOneMoneyPhone] = useState<string>("+263 712 345 678");
  const [innbucksCode, setInnbucksCode] = useState<string>("IBX-984-210");
  const [mukuruVoucher, setMukuruVoucher] = useState<string>("MUK-HAR-88321");
  const [zipitAccount, setZipitAccount] = useState<string>("1002394812");
  const [zipitBank, setZipitBank] = useState<string>("CBZ Bank");
  const [cardNumber, setCardNumber] = useState<string>("4000 1234 5678 9010");
  const [cardExpiry, setCardExpiry] = useState<string>("12/28");
  const [cardCvv, setCardCvv] = useState<string>("882");
  const [selectedBank, setSelectedBank] = useState<string>("FBC Bank (USD Nostro)");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentDone, setPaymentDone] = useState<boolean>(false);

  if (!worker) return null;

  const baseUSD = worker.monthlyRateUSD;
  const platformFeeUSD = Math.round(baseUSD * 0.05); // 5% fee
  const totalUSD = baseUSD + platformFeeUSD;

  const totalDisplay =
    currency === "USD"
      ? `$${totalUSD} USD`
      : `${(totalUSD * 26.5).toLocaleString()} ZWG`;

  const handleProcessEscrow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentDone(true);
      setTimeout(() => {
        onPaymentSuccess({
          workerName: worker.fullName,
          amountUSD: totalUSD,
          paymentMethod,
          escrowRef: `ZMC-ESC-${Math.floor(100000 + Math.random() * 900000)}`,
        });
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative my-8 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-emerald-950/60 hover:bg-emerald-950 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-300 mb-1">
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span>Encrypted Escrow Vault Protection</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">
            Fund Escrow for {worker.fullName}
          </h3>
          <p className="text-xs text-emerald-200 mt-1">
            Funds are securely held in Zimbabwe Maids Centre Escrow until you confirm work completion.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {paymentDone ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">Escrow Successfully Funded!</h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Payment received via {paymentMethod}. Work booking is now active and protected by ZMC Escrow.
              </p>
            </div>
          ) : (
            <>
              {/* Summary Breakdown */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Monthly Rate ({worker.role})</span>
                  <span className="font-semibold text-slate-900">${baseUSD} USD</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ZMC Insurance & Escrow Fee (5%)</span>
                  <span className="font-semibold text-slate-900">${platformFeeUSD} USD</span>
                </div>
                <hr className="border-slate-200" />
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1">
                  <span>Total Escrow Deposit</span>
                  <span className="text-emerald-600">{totalDisplay}</span>
                </div>
              </div>

              {/* Select Gateway (All 8 Gateways) */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                  Select Payment Gateway (8 Options)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                  {/* 1. EcoCash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("EcoCash")}
                    className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                      paymentMethod === "EcoCash"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm ring-1 ring-emerald-500"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs">EcoCash</div>
                      <div className="text-[10px] text-slate-500 font-normal">Econet USSD</div>
                    </div>
                  </button>

                  {/* 2. OneMoney */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("OneMoney")}
                    className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                      paymentMethod === "OneMoney"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm ring-1 ring-emerald-500"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-orange-600 shrink-0" />
                    <div>
                      <div className="text-xs">OneMoney</div>
                      <div className="text-[10px] text-slate-500 font-normal">NetOne Mobile</div>
                    </div>
                  </button>

                  {/* 3. InnBucks */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("InnBucks")}
                    className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                      paymentMethod === "InnBucks"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm ring-1 ring-emerald-500"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-teal-600 shrink-0" />
                    <div>
                      <div className="text-xs">InnBucks</div>
                      <div className="text-[10px] text-slate-500 font-normal">Express Code</div>
                    </div>
                  </button>

                  {/* 4. Mukuru */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Mukuru")}
                    className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                      paymentMethod === "Mukuru"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm ring-1 ring-emerald-500"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Send className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="text-xs">Mukuru</div>
                      <div className="text-[10px] text-slate-500 font-normal">Cash Pickup</div>
                    </div>
                  </button>

                  {/* 5. ZIPIT */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("ZIPIT")}
                    className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                      paymentMethod === "ZIPIT"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm ring-1 ring-emerald-500"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Zap className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <div className="text-xs">ZIPIT</div>
                      <div className="text-[10px] text-slate-500 font-normal">Instant Zimswitch</div>
                    </div>
                  </button>

                  {/* 6. Visa */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Visa")}
                    className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                      paymentMethod === "Visa"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm ring-1 ring-emerald-500"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <div className="text-xs">Visa</div>
                      <div className="text-[10px] text-slate-500 font-normal">Card Checkout</div>
                    </div>
                  </button>

                  {/* 7. MasterCard */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("MasterCard")}
                    className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                      paymentMethod === "MasterCard"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm ring-1 ring-emerald-500"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-rose-600 shrink-0" />
                    <div>
                      <div className="text-xs">MasterCard</div>
                      <div className="text-[10px] text-slate-500 font-normal">Card Checkout</div>
                    </div>
                  </button>

                  {/* 8. Bank Transfer */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Bank Transfer")}
                    className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                      paymentMethod === "Bank Transfer"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm ring-1 ring-emerald-500"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Landmark className="w-4 h-4 text-slate-700 shrink-0" />
                    <div>
                      <div className="text-xs">Bank Transfer</div>
                      <div className="text-[10px] text-slate-500 font-normal">RTGS / Nostro IBAN</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Payment Specific Input Fields */}
              {paymentMethod === "EcoCash" && (
                <div className="space-y-2 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200">
                  <label className="text-xs font-semibold text-slate-700 block">
                    EcoCash Econet Mobile (+263)
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-500">
                    A USSD PIN prompt will be pushed to your Econet mobile handset automatically.
                  </p>
                </div>
              )}

              {paymentMethod === "OneMoney" && (
                <div className="space-y-2 bg-orange-50/50 p-3.5 rounded-2xl border border-orange-200">
                  <label className="text-xs font-semibold text-slate-700 block">
                    OneMoney NetOne Mobile (+263 71)
                  </label>
                  <input
                    type="text"
                    value={oneMoneyPhone}
                    onChange={(e) => setOneMoneyPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-[11px] text-slate-500">
                    Enter your OneMoney PIN when prompted on your NetOne handset.
                  </p>
                </div>
              )}

              {paymentMethod === "InnBucks" && (
                <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-teal-900">InnBucks Voucher Express Code</p>
                  <p className="text-[11px]">
                    Pay cash at any Simbisa / InnBucks counter or authorize in App using code:{" "}
                    <span className="font-mono font-bold text-slate-900 bg-teal-200 px-2 py-0.5 rounded">
                      {innbucksCode}
                    </span>
                  </p>
                </div>
              )}

              {paymentMethod === "Mukuru" && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-slate-700 space-y-1">
                  <p className="font-bold text-amber-900">Mukuru Remittance Voucher</p>
                  <p className="text-[11px]">
                    Reference Voucher Number:{" "}
                    <span className="font-mono font-bold text-slate-900 bg-amber-200 px-2 py-0.5 rounded">
                      {mukuruVoucher}
                    </span>{" "}
                    for instant payout at any Mukuru booth nationwide.
                  </p>
                </div>
              )}

              {paymentMethod === "ZIPIT" && (
                <div className="space-y-2 bg-blue-50/50 p-3.5 rounded-2xl border border-blue-200 text-xs">
                  <label className="font-semibold text-slate-700 block">Zimswitch ZIPIT Bank Transfer</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={zipitBank}
                      onChange={(e) => setZipitBank(e.target.value)}
                      placeholder="Bank Name"
                      className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      value={zipitAccount}
                      onChange={(e) => setZipitAccount(e.target.value)}
                      placeholder="Account Number"
                      className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">Instant ZIPIT clearance across all Zimbabwean banks.</p>
                </div>
              )}

              {(paymentMethod === "Visa" || paymentMethod === "MasterCard") && (
                <div className="space-y-2 bg-indigo-50/50 p-3.5 rounded-2xl border border-indigo-200 text-xs">
                  <label className="font-semibold text-slate-700 block">{paymentMethod} Card Details</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4000 0000 0000 0000"
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs"
                    />
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="CVV"
                      className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "Bank Transfer" && (
                <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
                  <label className="font-semibold text-slate-700 block">Select Receiving ZMC USD Nostro Bank Account</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl font-medium text-xs text-slate-900"
                  >
                    <option value="FBC Bank (USD Nostro)">FBC Bank • Nostro A/C: 1020492810291</option>
                    <option value="CBZ Bank (USD Nostro)">CBZ Bank • Nostro A/C: 0112948102830</option>
                    <option value="Stanbic Bank Zimbabwe">Stanbic Bank • Nostro A/C: 914002938102</option>
                    <option value="CABS Building Society">CABS • Nostro A/C: 1004928102</option>
                  </select>
                  <p className="text-[11px] text-slate-500">Upload your RTGS/Nostro transfer proof for instant verification.</p>
                </div>
              )}

              {/* Assistance Callout */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px]">
                <div className="flex items-center space-x-2 text-slate-700">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Payment Help: <strong className="font-mono">+236713933733</strong></span>
                </div>
                <a
                  href="https://wa.me/236713933733?text=Hello%20Zimbabwe%20Maids%20Centre!%20I%20have%20a%20payment%20query."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-lg text-[10px] flex items-center space-x-1"
                >
                  <MessageCircle className="w-3 h-3 fill-white text-[#25D366]" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Action Button */}
              <button
                onClick={handleProcessEscrow}
                disabled={isProcessing}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing via {paymentMethod}...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authorize Escrow Deposit ({totalDisplay})</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

