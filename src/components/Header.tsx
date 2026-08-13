import React from "react";
import {
  ShieldCheck,
  Cpu,
  Users,
  CreditCard,
  Building2,
  Globe,
  MapPin,
  Sparkles,
  PhoneCall,
  MessageCircle,
  UserCheck,
  Briefcase,
  Search,
  Star,
  Award,
  TrendingUp,
} from "lucide-react";
import { UserRole, CityLocation } from "../types/marketplace";
import { ALL_ZIMBABWE_CITIES } from "../data/zimbabweLocations";

interface HeaderProps {
  activeTab: "landing" | "architecture" | "marketplace" | "worker" | "jobs" | "search" | "whatsapp" | "whatsapp-upload" | "ai-studio" | "payments" | "admin" | "reviews" | "reports";
  setActiveTab: (tab: "landing" | "architecture" | "marketplace" | "worker" | "jobs" | "search" | "whatsapp" | "whatsapp-upload" | "ai-studio" | "payments" | "admin" | "reviews" | "reports") => void;
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
  selectedCity: CityLocation;
  setSelectedCity: (city: CityLocation) => void;
  currency: "USD" | "ZWG";
  setCurrency: (c: "USD" | "ZWG") => void;
}

const ALL_ROLES: UserRole[] = [
  "Domestic worker",
  "Maid",
  "Part-time maid",
  "Nanny",
  "Caregiver",
  "Housekeeper",
  "Tree cutter",
  "Farm worker",
  "Cook",
  "Satellite dish installer",
  "Fumigation specialist",
  "Painter",
  "Curtain installer",
  "Interior designer",
  "Part-time laundry worker",
  "Sofa & carpet cleaner",
  "Pavement cleaner",
  "Gardener",
  "Driver",
  "Electrician",
  "Plumber",
  "Builder",
  "Carpenter",
  "Cleaner",
  "Chef",
  "Nurse aide",
  "Home owner",
  "Employer",
  "Agency",
  "Admin",
];

const ZIM_CITIES = ALL_ZIMBABWE_CITIES;

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedRole,
  setSelectedRole,
  selectedCity,
  setSelectedCity,
  currency,
  setCurrency,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-emerald-950/95 backdrop-blur-md border-b border-emerald-800/40 text-white shadow-xl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 px-4 py-1.5 text-xs border-b border-emerald-800/30 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center space-x-2 text-emerald-200 font-medium">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Zimbabwe's Largest Verified Domestic & Household Artisan Portal</span>
          <span className="hidden sm:inline text-emerald-400/60">•</span>
          <span className="hidden sm:inline text-emerald-300">
            Escrow Protected with EcoCash, InnBucks, PayPal & Visa
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Currency Toggle */}
          <div className="flex items-center bg-emerald-950/80 rounded-lg p-0.5 border border-emerald-700/50">
            <button
              onClick={() => setCurrency("USD")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                currency === "USD" ? "bg-emerald-500 text-slate-950 shadow" : "text-emerald-300 hover:text-white"
              }`}
            >
              USD $
            </button>
            <button
              onClick={() => setCurrency("ZWG")}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                currency === "ZWG" ? "bg-emerald-500 text-slate-950 shadow" : "text-emerald-300 hover:text-white"
              }`}
            >
              ZWG (Gold)
            </button>
          </div>

          <a
            href="tel:+263785458828"
            className="hidden md:flex items-center space-x-1 text-emerald-200 hover:text-white text-[11px] transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-emerald-400" />
            <span>Support: +263785458828</span>
          </a>

          <a
            href="https://wa.me/263785458828?text=Hello%20Zimbabwe%20Maids%20Centre%20Support"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 px-2 py-0.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-[10px] rounded-md transition-all shadow-sm"
          >
            <MessageCircle className="w-3 h-3 fill-white text-[#25D366]" />
            <span>WhatsApp Chat</span>
          </a>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("marketplace")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 shadow-lg shadow-emerald-900/30">
            <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>Zimbabwe Maids Centre</span>
              <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 bg-emerald-800/80 text-emerald-200 rounded-full border border-emerald-600/40">
                Enterprise
              </span>
            </h1>
            <p className="text-[11px] text-emerald-300/80">
              National Domestic & Artisan Service Network
            </p>
          </div>
        </div>

        {/* Global Controls: Role & City Selectors */}
        <div className="flex items-center space-x-2 bg-emerald-900/40 p-1.5 rounded-xl border border-emerald-800/50">
          {/* City Filter */}
          <div className="flex items-center space-x-1 px-2 text-xs text-emerald-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value as CityLocation)}
              className="bg-transparent text-emerald-100 font-medium focus:outline-none cursor-pointer"
            >
              {ZIM_CITIES.map((city) => (
                <option key={city} value={city} className="bg-slate-900 text-white">
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-emerald-700/50"></div>

          {/* Persona Filter */}
          <div className="flex items-center space-x-1 px-2 text-xs text-emerald-200">
            <Users className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-[11px] text-emerald-400/80 hidden lg:inline">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="bg-transparent text-teal-100 font-medium focus:outline-none cursor-pointer max-w-[140px] truncate"
            >
              {ALL_ROLES.map((role) => (
                <option key={role} value={role} className="bg-slate-900 text-white">
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 bg-emerald-900/60 p-1 rounded-xl border border-emerald-800/60 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab("landing")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "landing"
                ? "bg-amber-400 text-slate-950 font-bold shadow-md"
                : "text-amber-200 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Brand Showcase</span>
          </button>

          <button
            onClick={() => setActiveTab("architecture")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "architecture"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-emerald-200 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Architecture Specification</span>
          </button>

          <button
            onClick={() => setActiveTab("marketplace")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "marketplace"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-emerald-200 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Service Directory</span>
          </button>

          <button
            onClick={() => setActiveTab("worker")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "worker"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-emerald-200 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Worker Portal</span>
          </button>

          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "jobs"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-emerald-200 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-300" />
            <span>Job Hub</span>
          </button>

          <button
            onClick={() => setActiveTab("search")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "search"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-emerald-200 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <Search className="w-3.5 h-3.5 text-emerald-300" />
            <span>Search Engine</span>
          </button>

          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "whatsapp"
                ? "bg-[#25D366] text-slate-950 shadow-md font-bold"
                : "text-emerald-200 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]/30" />
            <span>WhatsApp Messaging</span>
          </button>

          <button
            onClick={() => setActiveTab("whatsapp-upload")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "whatsapp-upload"
                ? "bg-amber-400 text-slate-950 shadow-md font-bold"
                : "text-amber-200 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>WhatsApp Ingestion Portal</span>
          </button>

          <button
            onClick={() => setActiveTab("ai-studio")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "ai-studio"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-emerald-200 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>AI Vetting Studio</span>
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "payments"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-emerald-200 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Escrow Ledger</span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "reviews"
                ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                : "text-emerald-200 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300/40" />
            <span>Reviews & Trust</span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "reports"
                ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                : "text-emerald-200 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
            <span>Performance Reports</span>
          </button>

          <button
            onClick={() => setActiveTab("admin")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "admin"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-emerald-200 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Center</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
