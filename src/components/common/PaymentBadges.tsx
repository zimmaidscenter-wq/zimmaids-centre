import React from "react";

// Payment Gateway Image Assets
import ecocashImg from "../../assets/images/ecocash_badge_1786649492737.jpg";
import innbucksImg from "../../assets/images/innbucks_badge_1786649506054.jpg";
import zimswitchImg from "../../assets/images/zimswitch_badge_1786649517552.jpg";
import visaCardImg from "../../assets/images/visa_card_badge_1786649530230.jpg";
import mukuruImg from "../../assets/images/mukuru_badge_1786649543782.jpg";
import onemoneyImg from "../../assets/images/onemoney_badge_1786649559613.jpg";

export interface GatewayInfo {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  image: string;
  badgeBg: string;
  borderColor: string;
  tagColor: string;
  type: string;
}

export const PAYMENT_GATEWAY_ASSETS = {
  paynow: zimswitchImg,
  ecocash: ecocashImg,
  innbucks: innbucksImg,
  zimswitch: zimswitchImg,
  zipit: zimswitchImg,
  visa: visaCardImg,
  mastercard: visaCardImg,
  visaMastercard: visaCardImg,
  mukuru: mukuruImg,
  onemoney: onemoneyImg,
};

export const PAYMENT_GATEWAYS_LIST: GatewayInfo[] = [
  {
    id: "ecocash",
    name: "EcoCash",
    shortName: "EcoCash",
    subtitle: "USD & ZWG Mobile Money",
    image: ecocashImg,
    badgeBg: "from-blue-950/90 to-slate-900",
    borderColor: "border-blue-500/50 hover:border-blue-400",
    tagColor: "text-blue-400",
    type: "Mobile Money",
  },
  {
    id: "innbucks",
    name: "InnBucks",
    shortName: "InnBucks",
    subtitle: "Simbisa Mobile Wallet",
    image: innbucksImg,
    badgeBg: "from-amber-950/90 to-slate-900",
    borderColor: "border-amber-500/50 hover:border-amber-400",
    tagColor: "text-amber-400",
    type: "Digital Wallet",
  },
  {
    id: "zimswitch",
    name: "ZimSwitch / ZIPIT",
    shortName: "ZimSwitch",
    subtitle: "Instant Bank Clearing",
    image: zimswitchImg,
    badgeBg: "from-sky-950/90 to-slate-900",
    borderColor: "border-sky-500/50 hover:border-sky-400",
    tagColor: "text-sky-400",
    type: "Bank Switch",
  },
  {
    id: "visa",
    name: "Visa & Mastercard",
    shortName: "Cards",
    subtitle: "International Credit & Debit",
    image: visaCardImg,
    badgeBg: "from-indigo-950/90 to-slate-900",
    borderColor: "border-indigo-500/50 hover:border-indigo-400",
    tagColor: "text-indigo-400",
    type: "Card Gateway",
  },
  {
    id: "mukuru",
    name: "Mukuru",
    shortName: "Mukuru",
    subtitle: "Cross-Border Remittance",
    image: mukuruImg,
    badgeBg: "from-orange-950/90 to-slate-900",
    borderColor: "border-orange-500/50 hover:border-orange-400",
    tagColor: "text-orange-400",
    type: "Remittance",
  },
  {
    id: "onemoney",
    name: "OneMoney",
    shortName: "OneMoney",
    subtitle: "NetOne Mobile Cash",
    image: onemoneyImg,
    badgeBg: "from-orange-950/90 to-slate-900",
    borderColor: "border-orange-500/50 hover:border-orange-400",
    tagColor: "text-orange-400",
    type: "Mobile Money",
  },
];

/**
 * Single compact payment badge with picture logo
 */
export const PaymentBadge: React.FC<{
  gateway: "ecocash" | "innbucks" | "zimswitch" | "visa" | "mukuru" | "onemoney";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}> = ({ gateway, size = "md", showLabel = true, className = "" }) => {
  const info =
    PAYMENT_GATEWAYS_LIST.find((g) => g.id === gateway) ||
    PAYMENT_GATEWAYS_LIST[0];

  const sizeStyles = {
    sm: "w-6 h-6 rounded-lg",
    md: "w-8 h-8 rounded-xl",
    lg: "w-11 h-11 rounded-2xl",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-2 py-1 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-sm ${className}`}
    >
      <img
        src={info.image}
        alt={`${info.name} logo`}
        referrerPolicy="no-referrer"
        className={`${sizeStyles[size]} object-cover shadow-sm shrink-0 border border-white/20`}
      />
      {showLabel && (
        <div className="text-left">
          <div className="text-xs font-bold text-white leading-tight">
            {info.name}
          </div>
          <div className="text-[9px] text-slate-400 font-medium">
            {info.subtitle}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * EcoCash Official Verification Badge with picture
 */
export const EcoCashOfficialBadge: React.FC<{
  className?: string;
  variant?: "dark" | "light" | "colored";
}> = ({ className = "", variant = "dark" }) => {
  if (variant === "light") {
    return (
      <div
        className={`inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 text-blue-950 px-3 py-1.5 rounded-xl shadow-xs ${className}`}
      >
        <img
          src={ecocashImg}
          alt="EcoCash Official"
          referrerPolicy="no-referrer"
          className="w-6 h-6 rounded-md object-cover border border-blue-300 shadow-xs shrink-0"
        />
        <div className="text-left">
          <div className="text-xs font-extrabold text-blue-900 flex items-center gap-1">
            EcoCash Verified
          </div>
          <div className="text-[10px] text-blue-700 font-medium">
            USD & ZWG Mobile Money
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center space-x-2.5 bg-gradient-to-r from-blue-950 to-slate-900 border border-blue-500/60 text-white px-3 py-1.5 rounded-xl shadow-md ${className}`}
    >
      <img
        src={ecocashImg}
        alt="EcoCash Official"
        referrerPolicy="no-referrer"
        className="w-7 h-7 rounded-lg object-cover border border-blue-400/40 shadow-sm shrink-0"
      />
      <div className="text-left">
        <div className="text-xs font-black text-white flex items-center gap-1">
          <span>EcoCash Mobile</span>
          <span className="bg-blue-500/30 text-blue-300 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
            Official
          </span>
        </div>
        <div className="text-[10px] text-blue-300 font-medium">
          Paynow Automated Gateway Settlement
        </div>
      </div>
    </div>
  );
};
