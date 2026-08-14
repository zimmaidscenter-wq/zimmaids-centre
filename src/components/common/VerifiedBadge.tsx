import React from "react";
import { ShieldCheck, CheckCircle2, Award, Sparkles } from "lucide-react";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg" | "badge-card";
  showText?: boolean;
  className?: string;
  subtext?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  size = "md",
  showText = true,
  className = "",
  subtext = "Background & Police Checked",
}) => {
  if (size === "sm") {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-[10px] font-black shadow-xs border border-emerald-400/40 ${className}`}
        title="Verified & Background Checked"
      >
        <ShieldCheck className="w-3 h-3 text-emerald-200 fill-emerald-400" />
        {showText && <span>VERIFIED</span>}
      </span>
    );
  }

  if (size === "badge-card") {
    return (
      <div className={`flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-2xl border border-emerald-500/40 shadow-lg ${className}`}>
        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-400 fill-emerald-500/20" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-3 h-3 text-slate-950 font-bold" />
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-white text-xs tracking-wide">VERIFIED CANDIDATE</span>
            <span className="px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-black text-[9px] rounded uppercase">
              Official
            </span>
          </div>
          <p className="text-[11px] text-emerald-200/90 font-medium leading-tight">
            {subtext}
          </p>
        </div>
      </div>
    );
  }

  if (size === "lg") {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-900 to-teal-950 text-emerald-100 border border-emerald-500/50 shadow-md ${className}`}>
        <div className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xs">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-left">
          <div className="text-[11px] font-black text-white flex items-center gap-1">
            <span>VERIFIED CREDENTIALS</span>
            <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
          </div>
          <div className="text-[9px] text-emerald-300 font-medium">ID & Criminal Record Cleared</div>
        </div>
      </div>
    );
  }

  // Default "md" size
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-950 text-xs font-black border border-emerald-300 shadow-xs ${className}`}
      title="Verified & Background Checked"
    >
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 fill-emerald-600/30" />
      {showText && <span>Verified & Cleared</span>}
    </span>
  );
};
