import React from "react";
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

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-emerald-900/60 text-xs py-10 pb-24 xl:pb-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Subtle Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Top Row: Brand & Helpline & Contact Protection Notice */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start border-b border-slate-800 pb-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">
                Zimbabwe Maids Centre
              </span>
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
            <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 border border-emerald-500/60 rounded-xl p-3 text-center shadow-md hover:border-emerald-400 transition-all">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-1.5">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="font-extrabold text-white text-xs">EcoCash</div>
              <div className="text-[9px] text-emerald-300 font-medium mt-0.5">USD & ZWG Mobile</div>
            </div>

            {/* 2. InnBucks Badge */}
            <div className="bg-gradient-to-br from-amber-950 to-yellow-900/40 border border-amber-500/60 rounded-xl p-3 text-center shadow-md hover:border-amber-400 transition-all">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-1.5">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="font-extrabold text-white text-xs">InnBucks</div>
              <div className="text-[9px] text-amber-300 font-medium mt-0.5">Simbisa Mobile Wallet</div>
            </div>

            {/* 3. ZimSwitch / ZIPIT Badge */}
            <div className="bg-gradient-to-br from-sky-950 to-blue-900/40 border border-sky-500/60 rounded-xl p-3 text-center shadow-md hover:border-sky-400 transition-all">
              <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-1.5">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="font-extrabold text-white text-xs">ZimSwitch</div>
              <div className="text-[9px] text-sky-300 font-medium mt-0.5">ZIPIT & Local Banks</div>
            </div>

            {/* 4. Visa & Mastercard Badge */}
            <div className="bg-gradient-to-br from-indigo-950 to-purple-900/40 border border-indigo-500/60 rounded-xl p-3 text-center shadow-md hover:border-indigo-400 transition-all">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-1.5">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="font-extrabold text-white text-xs">Visa / Mastercard</div>
              <div className="text-[9px] text-indigo-300 font-medium mt-0.5">International Cards</div>
            </div>

            {/* 5. Mukuru Remittance Badge */}
            <div className="bg-gradient-to-br from-orange-950 to-amber-950/40 border border-orange-500/60 rounded-xl p-3 text-center shadow-md hover:border-orange-400 transition-all">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-1.5">
                <Globe className="w-4 h-4" />
              </div>
              <div className="font-extrabold text-white text-xs">Mukuru</div>
              <div className="text-[9px] text-orange-300 font-medium mt-0.5">Cross-Border Remit</div>
            </div>

            {/* 6. Cash USD Badge */}
            <div className="bg-gradient-to-br from-teal-950 to-emerald-950/40 border border-teal-500/60 rounded-xl p-3 text-center shadow-md hover:border-teal-400 transition-all">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-1.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="font-extrabold text-white text-xs">Cash USD</div>
              <div className="text-[9px] text-teal-300 font-medium mt-0.5">Direct Placement</div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Copyright & Disclaimers */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 pt-2 gap-2 text-center sm:text-left">
          <div>
            © 2026 Zimbabwe Maids Centre Enterprise Platform. All rights reserved.
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
