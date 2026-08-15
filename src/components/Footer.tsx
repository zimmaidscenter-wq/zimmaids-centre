import React from "react";
import { PAYMENT_GATEWAY_ASSETS } from "./common/PaymentBadges";
import { ZMC_OFFICIAL_LOGO } from "./common/BrandLogo";
import {
  ShieldCheck,
  PhoneCall,
  MessageCircle,
  Smartphone,
  CreditCard,
  Building2,
  Lock,
  Globe,
  Award,
  CheckCircle2,
  Heart
} from "lucide-react";

interface FooterProps {
  onOpenLegalCompliance?: (tab?: "privacy" | "terms" | "placement" | "guidelines" | "cookies" | "deletion") => void;
  onOpenAccessibility?: () => void;
  onOpenMarketingHub?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegalCompliance,
  onOpenAccessibility,
  onOpenMarketingHub,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-emerald-900/60 text-xs py-10 pb-24 xl:pb-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Subtle Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Top Row: Brand & Helpline & Contact Protection Notice */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start border-b border-slate-800 pb-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400/80 bg-white shadow-md shadow-emerald-950/40 shrink-0">
                <img
                  src={ZMC_OFFICIAL_LOGO}
                  alt="Zimbabwe Maids Centre Official Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-base font-extrabold text-white tracking-tight block">
                  Zimbabwe Maids Centre
                </span>
                <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
                  Your #1 Online Placement Agency
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zimbabwe's largest verified marketplace for domestic workers, housekeepers, nannies, nurse aides, and home artisans. Connecting verified professionals with homeowners and employers nationwide.
            </p>
          </div>

          {/* Col 2: Policy & Protection Summary */}
          <div className="space-y-2 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Contact Protection & Policy</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Contact details are protected and available via Premium Employer Access ($30 USD / 30 Days). Free job postings for employers & 100% free candidate profile creation.
            </p>
          </div>

          {/* Col 3: Customer Hotline */}
          <div className="space-y-2.5 md:text-right">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Official Helpline & Support
            </div>
            <div className="flex flex-col md:items-end space-y-1 text-xs">
              <a
                href="tel:+263785458828"
                className="font-mono font-black text-amber-300 text-sm hover:underline inline-flex items-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>+263 785 458 828</span>
              </a>
              <a
                href="https://wa.me/263785458828?text=Hello%20Zimbabwe%20Maids%20Centre%20Support"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] hover:text-white font-bold inline-flex items-center gap-1.5 text-xs"
              >
                <MessageCircle className="w-4 h-4 fill-[#25D366] text-[#25D366]" />
                <span>WhatsApp Support: +263 785 458 828</span>
              </a>
              <div className="text-[10px] text-slate-400">
                EcoCash Recipient Name: <span className="text-emerald-400 font-bold">Chenjerai</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Row: Accepted Payment Badges Section */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
                Official Accepted Payment Gateways & Badges
              </h4>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
              Direct Bank & Mobile Money Clearing
            </span>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {/* 1. EcoCash Badge */}
            <div className="bg-gradient-to-br from-blue-950 to-slate-900 border border-blue-500/60 rounded-xl p-3 text-center shadow-md hover:border-blue-400 transition-all group">
              <div className="w-12 h-12 rounded-xl overflow-hidden mx-auto mb-2 border border-blue-400/40 shadow-inner bg-slate-950 p-0.5 group-hover:scale-105 transition-transform">
                <img
                  src={PAYMENT_GATEWAY_ASSETS.ecocash}
                  alt="EcoCash"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="font-extrabold text-white text-xs">EcoCash</div>
              <div className="text-[9px] text-blue-300 font-medium mt-0.5">USD & ZWG Mobile</div>
            </div>

            {/* 2. InnBucks Badge */}
            <div className="bg-gradient-to-br from-amber-950 to-slate-900 border border-amber-500/60 rounded-xl p-3 text-center shadow-md hover:border-amber-400 transition-all group">
              <div className="w-12 h-12 rounded-xl overflow-hidden mx-auto mb-2 border border-amber-400/40 shadow-inner bg-slate-950 p-0.5 group-hover:scale-105 transition-transform">
                <img
                  src={PAYMENT_GATEWAY_ASSETS.innbucks}
                  alt="InnBucks"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="font-extrabold text-white text-xs">InnBucks</div>
              <div className="text-[9px] text-amber-300 font-medium mt-0.5">Simbisa Mobile Wallet</div>
            </div>

            {/* 3. ZimSwitch / ZIPIT Badge */}
            <div className="bg-gradient-to-br from-sky-950 to-slate-900 border border-sky-500/60 rounded-xl p-3 text-center shadow-md hover:border-sky-400 transition-all group">
              <div className="w-12 h-12 rounded-xl overflow-hidden mx-auto mb-2 border border-sky-400/40 shadow-inner bg-slate-950 p-0.5 group-hover:scale-105 transition-transform">
                <img
                  src={PAYMENT_GATEWAY_ASSETS.zimswitch}
                  alt="ZimSwitch"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="font-extrabold text-white text-xs">ZimSwitch</div>
              <div className="text-[9px] text-sky-300 font-medium mt-0.5">ZIPIT & Local Banks</div>
            </div>

            {/* 4. Visa & Mastercard Badge */}
            <div className="bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/60 rounded-xl p-3 text-center shadow-md hover:border-indigo-400 transition-all group">
              <div className="w-12 h-12 rounded-xl overflow-hidden mx-auto mb-2 border border-indigo-400/40 shadow-inner bg-slate-950 p-0.5 group-hover:scale-105 transition-transform">
                <img
                  src={PAYMENT_GATEWAY_ASSETS.visa}
                  alt="Visa & Mastercard"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="font-extrabold text-white text-xs">Visa / Mastercard</div>
              <div className="text-[9px] text-indigo-300 font-medium mt-0.5">International Cards</div>
            </div>

            {/* 5. Mukuru Remittance Badge */}
            <div className="bg-gradient-to-br from-orange-950 to-slate-900 border border-orange-500/60 rounded-xl p-3 text-center shadow-md hover:border-orange-400 transition-all group">
              <div className="w-12 h-12 rounded-xl overflow-hidden mx-auto mb-2 border border-orange-400/40 shadow-inner bg-slate-950 p-0.5 group-hover:scale-105 transition-transform">
                <img
                  src={PAYMENT_GATEWAY_ASSETS.mukuru}
                  alt="Mukuru"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="font-extrabold text-white text-xs">Mukuru</div>
              <div className="text-[9px] text-orange-300 font-medium mt-0.5">Cross-Border Remit</div>
            </div>

            {/* 6. OneMoney Mobile Badge */}
            <div className="bg-gradient-to-br from-emerald-950 to-slate-900 border border-emerald-500/60 rounded-xl p-3 text-center shadow-md hover:border-emerald-400 transition-all group">
              <div className="w-12 h-12 rounded-xl overflow-hidden mx-auto mb-2 border border-emerald-400/40 shadow-inner bg-slate-950 p-0.5 group-hover:scale-105 transition-transform">
                <img
                  src={PAYMENT_GATEWAY_ASSETS.onemoney}
                  alt="OneMoney"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="font-extrabold text-white text-xs">OneMoney</div>
              <div className="text-[9px] text-emerald-300 font-medium mt-0.5">NetOne Mobile</div>
            </div>
          </div>
        </div>

        {/* Legal, Statutory Compliance & Accessibility Links */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-400 font-medium">
            <button
              onClick={() => onOpenLegalCompliance && onOpenLegalCompliance("privacy")}
              className="hover:text-emerald-400 transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenLegalCompliance && onOpenLegalCompliance("terms")}
              className="hover:text-emerald-400 transition-colors"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenLegalCompliance && onOpenLegalCompliance("placement")}
              className="hover:text-emerald-400 transition-colors"
            >
              Placement Fee Agreement
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenLegalCompliance && onOpenLegalCompliance("guidelines")}
              className="hover:text-emerald-400 transition-colors"
            >
              Community Guidelines
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenLegalCompliance && onOpenLegalCompliance("cookies")}
              className="hover:text-emerald-400 transition-colors"
            >
              Cookie Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onOpenLegalCompliance && onOpenLegalCompliance("deletion")}
              className="text-rose-400 hover:text-rose-300 transition-colors font-semibold"
            >
              Data Deletion Request
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {onOpenAccessibility && (
              <button
                onClick={onOpenAccessibility}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
              >
                ♿ Accessibility & Speed
              </button>
            )}
            {onOpenMarketingHub && (
              <button
                onClick={onOpenMarketingHub}
                className="px-3 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
              >
                ✨ Marketing & FAQs
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Copyright & Disclaimers */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 pt-2 gap-2 text-center sm:text-left">
          <div>
            © 2026 Zimbabwe Maids Centre Enterprise Platform. Regulated under Zimbabwe Cyber & Data Protection Act [Chapter 12:07].
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Free Worker Profiles</span>
            <span>•</span>
            <span>Free Job Posting</span>
            <span>•</span>
            <span>$30 Employer Pass</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
