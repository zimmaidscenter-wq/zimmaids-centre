import React from "react";
import logoImg from "../../assets/images/zimbabwe_maids_centre_logo_1786650700176.jpg";

export const ZMC_OFFICIAL_LOGO = logoImg;

interface BrandLogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  showText?: boolean;
  alt?: string;
  onClick?: () => void;
}

const sizeClasses = {
  xs: "w-6 h-6",
  sm: "w-8 h-8",
  md: "w-11 h-11",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
  "2xl": "w-36 h-36",
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  size = "md",
  showText = false,
  alt = "Zimbabwe Maids Centre Official Logo",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 ${onClick ? "cursor-pointer select-none" : ""} ${className}`}
    >
      <div
        className={`${sizeClasses[size]} relative rounded-full overflow-hidden shrink-0 border-2 border-emerald-500/80 bg-white shadow-md shadow-emerald-950/20 hover:scale-105 transition-transform duration-200`}
      >
        <img
          src={ZMC_OFFICIAL_LOGO}
          alt={alt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white tracking-tight leading-none text-base sm:text-lg">
              Zimbabwe Maids Centre
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 bg-emerald-800 text-emerald-200 border border-emerald-600/60 rounded-full">
              Verified
            </span>
          </div>
          <span className="text-[11px] text-emerald-300 font-medium">
            Your #1 Online Placement Agency • +263 785 458 828
          </span>
        </div>
      )}
    </div>
  );
};
