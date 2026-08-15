import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Sparkles,
  Building2,
  Briefcase,
  MessageCircle,
  Menu,
  X,
  UserCheck,
  Search,
  CreditCard,
  Star,
  TrendingUp,
  ShieldCheck,
  Cpu,
  MapPin,
  Users,
  PhoneCall,
  LogIn,
  LogOut,
} from "lucide-react";
import { UserRole, CityLocation } from "../types/marketplace";
import { ALL_ZIMBABWE_CITIES } from "../data/zimbabweLocations";

interface MobileBottomNavProps {
  activeTab: "landing" | "architecture" | "employer" | "maid" | "marketplace" | "worker" | "jobs" | "search" | "whatsapp" | "whatsapp-upload" | "ai-studio" | "payments" | "admin" | "reviews" | "reports";
  setActiveTab: (tab: any) => void;
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

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  selectedRole,
  setSelectedRole,
  selectedCity,
  setSelectedCity,
  currency,
  setCurrency,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleTabClick = (tab: MobileBottomNavProps["activeTab"]) => {
    setActiveTab(tab);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 xl:hidden animate-in fade-in duration-200"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="fixed bottom-16 inset-x-0 bg-emerald-950 border-t border-emerald-800 text-white rounded-t-3xl p-6 space-y-6 max-h-[80vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Close button */}
            <div className="flex items-center justify-between pb-4 border-b border-emerald-800/80">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h3 className="font-extrabold text-base text-white">Navigation & Platform Controls</h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 bg-emerald-900/80 hover:bg-emerald-800 rounded-full text-emerald-200"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Filters */}
            <div className="grid grid-cols-2 gap-3 bg-emerald-900/40 p-3 rounded-2xl border border-emerald-800/60">
              {/* City */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" /> City
                </span>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value as CityLocation)}
                  className="w-full bg-emerald-950 border border-emerald-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white font-medium focus:outline-none"
                >
                  {ZIM_CITIES.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Currency */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                  Currency
                </span>
                <div className="flex bg-emerald-950 p-1 rounded-xl border border-emerald-700/80">
                  <button
                    onClick={() => setCurrency("USD")}
                    className={`flex-1 py-1 rounded-lg text-xs font-extrabold transition-all ${
                      currency === "USD" ? "bg-emerald-500 text-slate-950" : "text-emerald-300"
                    }`}
                  >
                    USD
                  </button>
                  <button
                    onClick={() => setCurrency("ZWG")}
                    className={`flex-1 py-1 rounded-lg text-xs font-extrabold transition-all ${
                      currency === "ZWG" ? "bg-emerald-500 text-slate-950" : "text-emerald-300"
                    }`}
                  >
                    ZWG
                  </button>
                </div>
              </div>
            </div>

            {/* Role Filter */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3 h-3 text-teal-400" /> Service Role Category
              </span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full bg-emerald-950 border border-emerald-700/80 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none"
              >
                {ALL_ROLES.map((role) => (
                  <option key={role} value={role} className="bg-slate-900 text-white">
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* All Sections Links */}
            <div className="space-y-2 pt-2 border-t border-emerald-800/80">
              <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider block mb-2">
                All App Modules
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => handleTabClick("landing")}
                  className={`p-3 rounded-2xl text-left text-xs font-bold flex items-center space-x-3 transition-all ${
                    activeTab === "landing"
                      ? "bg-amber-400 text-slate-950 shadow-lg"
                      : "bg-emerald-900/40 text-emerald-100 hover:bg-emerald-900"
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Brand Showcase</span>
                </button>

                <button
                  onClick={() => handleTabClick("marketplace")}
                  className={`p-3 rounded-2xl text-left text-xs font-bold flex items-center space-x-3 transition-all ${
                    activeTab === "marketplace"
                      ? "bg-emerald-500 text-slate-950 shadow-lg"
                      : "bg-emerald-900/40 text-emerald-100 hover:bg-emerald-900"
                  }`}
                >
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>Service Directory</span>
                </button>

                <button
                  onClick={() => handleTabClick("jobs")}
                  className={`p-3 rounded-2xl text-left text-xs font-bold flex items-center space-x-3 transition-all ${
                    activeTab === "jobs"
                      ? "bg-emerald-500 text-slate-950 shadow-lg"
                      : "bg-emerald-900/40 text-emerald-100 hover:bg-emerald-900"
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-amber-300" />
                  <span>Job Hub</span>
                </button>

                <button
                  onClick={() => handleTabClick("whatsapp")}
                  className={`p-3 rounded-2xl text-left text-xs font-bold flex items-center space-x-3 transition-all ${
                    activeTab === "whatsapp"
                      ? "bg-[#25D366] text-slate-950 shadow-lg"
                      : "bg-emerald-900/40 text-emerald-100 hover:bg-emerald-900"
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp Messaging</span>
                </button>

                <button
                  onClick={() => handleTabClick("whatsapp-upload")}
                  className={`p-3 rounded-2xl text-left text-xs font-bold flex items-center space-x-3 transition-all ${
                    activeTab === "whatsapp-upload"
                      ? "bg-amber-400 text-slate-950 shadow-lg"
                      : "bg-emerald-900/40 text-amber-200 hover:bg-emerald-900"
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>WhatsApp Ingestion Portal</span>
                </button>

                <button
                  onClick={() => handleTabClick("worker")}
                  className={`p-3 rounded-2xl text-left text-xs font-bold flex items-center space-x-3 transition-all ${
                    activeTab === "worker"
                      ? "bg-emerald-500 text-slate-950 shadow-lg"
                      : "bg-emerald-900/40 text-emerald-100 hover:bg-emerald-900"
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Worker Portal</span>
                </button>

                <button
                  onClick={() => handleTabClick("search")}
                  className={`p-3 rounded-2xl text-left text-xs font-bold flex items-center space-x-3 transition-all ${
                    activeTab === "search"
                      ? "bg-emerald-500 text-slate-950 shadow-lg"
                      : "bg-emerald-900/40 text-emerald-100 hover:bg-emerald-900"
                  }`}
                >
                  <Search className="w-4 h-4 text-emerald-300" />
                  <span>Search Engine</span>
                </button>

                <button
                  onClick={() => handleTabClick("ai-studio")}
                  className={`p-3 rounded-2xl text-left text-xs font-bold flex items-center space-x-3 transition-all ${
                    activeTab === "ai-studio"
                      ? "bg-emerald-500 text-slate-950 shadow-lg"
                      : "bg-emerald-900/40 text-emerald-100 hover:bg-emerald-900"
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>AI Vetting Studio</span>
                </button>

                <button
                  onClick={() => handleTabClick("payments")}
                  className={`p-3 rounded-2xl text-left text-xs font-bold flex items-center space-x-3 transition-all ${
                    activeTab === "payments"
                      ? "bg-emerald-500 text-slate-950 shadow-lg"
                      : "bg-emerald-900/40 text-emerald-100 hover:bg-emerald-900"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Escrow Ledger</span>
                </button>

                <button
                  onClick={() => handleTabClick("reviews")}
                  className={`p-3 rounded-2xl text-left text-xs font-bold flex items-center space-x-3 transition-all ${
                    activeTab === "reviews"
                      ? "bg-emerald-500 text-slate-950 shadow-lg"
                      : "bg-emerald-900/40 text-emerald-100 hover:bg-emerald-900"
                  }`}
                >
                  <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Reviews & Trust</span>
                </button>

                <button
                  onClick={() => handleTabClick("reports")}
                  className={`p-3 rounded-2xl text-left text-xs font-bold flex items-center space-x-3 transition-all ${
                    activeTab === "reports"
                      ? "bg-emerald-500 text-slate-950 shadow-lg"
                      : "bg-emerald-900/40 text-emerald-100 hover:bg-emerald-900"
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-amber-300" />
                  <span>Performance Reports</span>
                </button>

                <button
                  onClick={() => handleTabClick("architecture")}
                  className={`p-3 rounded-2xl text-left text-xs font-bold flex items-center space-x-3 transition-all ${
                    activeTab === "architecture"
                      ? "bg-emerald-500 text-slate-950 shadow-lg"
                      : "bg-emerald-900/40 text-emerald-100 hover:bg-emerald-900"
                  }`}
                >
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>Architecture Specification</span>
                </button>

                <button
                  onClick={() => handleTabClick("admin")}
                  className={`p-3 rounded-2xl text-left text-xs font-bold flex items-center space-x-3 transition-all ${
                    activeTab === "admin"
                      ? "bg-emerald-500 text-slate-950 shadow-lg"
                      : "bg-emerald-900/40 text-emerald-100 hover:bg-emerald-900"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Admin Center</span>
                </button>
              </div>
            </div>

            {/* Direct Support Button */}
            <div className="pt-2">
              <a
                href="tel:+263785458828"
                className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 border border-emerald-600"
              >
                <PhoneCall className="w-4 h-4 text-emerald-300" />
                <span>Call Hotline: +263785458828</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Nav Bar for Mobile & Tablet */}
      <div className="fixed bottom-0 inset-x-0 bg-emerald-950/95 backdrop-blur-lg border-t border-emerald-800/80 z-40 xl:hidden px-2 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab("landing")}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === "landing" ? "text-amber-400 font-extrabold" : "text-emerald-200/80 hover:text-white"
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Showcase</span>
        </button>

        <button
          onClick={() => setActiveTab("marketplace")}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === "marketplace" ? "text-emerald-400 font-extrabold" : "text-emerald-200/80 hover:text-white"
          }`}
        >
          <Building2 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Directory</span>
        </button>

        <button
          onClick={() => setActiveTab("jobs")}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === "jobs" ? "text-emerald-400 font-extrabold" : "text-emerald-200/80 hover:text-white"
          }`}
        >
          <Briefcase className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Jobs</span>
        </button>

        <button
          onClick={() => setActiveTab("whatsapp")}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            activeTab === "whatsapp" ? "text-[#25D366] font-extrabold" : "text-emerald-200/80 hover:text-white"
          }`}
        >
          <MessageCircle className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">WhatsApp</span>
        </button>

        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            isDrawerOpen ? "text-amber-400 font-extrabold bg-emerald-900/60" : "text-emerald-200/80 hover:text-white"
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">More</span>
        </button>
      </div>
    </>
  );
};
