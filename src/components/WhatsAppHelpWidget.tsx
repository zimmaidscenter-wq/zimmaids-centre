import React, { useState } from "react";
import { PAYMENT_GATEWAY_ASSETS } from "./common/PaymentBadges";
import { ZMC_OFFICIAL_LOGO } from "./common/BrandLogo";
import {
  MessageCircle,
  PhoneCall,
  X,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Headphones,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export const WhatsAppHelpWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const rawPhone = "263785458828";
  const displayPhone = "+263785458828";
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
    "Hello Zimbabwe Maids Centre Support! I need assistance with worker vetting, hiring, or escrow payments."
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded Support Drawer */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-slate-900">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 p-4 text-white relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3.5 right-3.5 p-1.5 bg-emerald-950/60 hover:bg-emerald-950 rounded-full text-emerald-200 hover:text-white transition-colors"
              aria-label="Close Support"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400 bg-white shadow-md shrink-0">
                  <img
                    src={ZMC_OFFICIAL_LOGO}
                    alt="Zimbabwe Maids Centre"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-emerald-950 rounded-full"></span>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <span>Zimbabwe Maids Centre</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-wider rounded">
                    24/7 Live
                  </span>
                </h4>
                <p className="text-[11px] text-emerald-200/90 font-mono">
                  {displayPhone}
                </p>
              </div>
            </div>
          </div>

          {/* Body Options */}
          <div className="p-4 space-y-3 bg-slate-50/50">
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Need quick help with hiring, worker police clearance, or funding escrow via EcoCash, InnBucks, PayPal, or Visa?
            </p>

            {/* Direct WhatsApp Chat CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center space-x-2.5">
                <MessageCircle className="w-5 h-5 fill-white text-[#25D366] shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight">Chat on WhatsApp</div>
                  <div className="text-[10px] text-emerald-100 font-normal">Instant Help Desk • {displayPhone}</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-100 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Direct Call Button */}
            <a
              href={`tel:${displayPhone}`}
              className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-xs rounded-2xl shadow-sm flex items-center justify-between transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct Voice Call ({displayPhone})</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>

            {/* Supported Payment Gateways Notice */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3 text-[11px] space-y-2">
              <div className="flex items-center space-x-1.5 text-slate-700 font-bold">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supported Escrow Gateways</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-slate-50 text-slate-800 font-bold rounded-lg border border-slate-200">
                  <img
                    src={PAYMENT_GATEWAY_ASSETS.ecocash}
                    alt="EcoCash"
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 rounded object-cover"
                  />
                  <span>EcoCash</span>
                </div>
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-slate-50 text-slate-800 font-bold rounded-lg border border-slate-200">
                  <img
                    src={PAYMENT_GATEWAY_ASSETS.innbucks}
                    alt="InnBucks"
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 rounded object-cover"
                  />
                  <span>InnBucks</span>
                </div>
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-slate-50 text-slate-800 font-bold rounded-lg border border-slate-200">
                  <img
                    src={PAYMENT_GATEWAY_ASSETS.zimswitch}
                    alt="ZIPIT"
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 rounded object-cover"
                  />
                  <span>ZimSwitch</span>
                </div>
                <div className="flex items-center space-x-1.5 px-2 py-1 bg-slate-50 text-slate-800 font-bold rounded-lg border border-slate-200">
                  <img
                    src={PAYMENT_GATEWAY_ASSETS.visa}
                    alt="Visa / Mastercard"
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 rounded object-cover"
                  />
                  <span>Visa / MC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-slate-100 p-2.5 px-4 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Official Support Hotline</span>
            </span>
            <span className="font-mono font-bold text-slate-700">{displayPhone}</span>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative group bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl flex items-center space-x-2.5 transition-all duration-300 transform hover:scale-105 active:scale-95 ring-4 ring-emerald-500/30"
        aria-label="WhatsApp Support Help"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>

        <MessageCircle className="w-6 h-6 fill-white text-[#25D366] shrink-0" />

        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-black leading-tight tracking-tight">WhatsApp Help</span>
          <span className="text-[10px] font-medium text-emerald-100 font-mono">{displayPhone}</span>
        </div>
      </button>
    </div>
  );
};
