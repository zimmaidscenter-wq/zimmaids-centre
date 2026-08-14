import React, { useState } from "react";
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
  LogIn,
  LogOut,
  ChevronDown,
  User,
  ShieldAlert,
  CheckCircle2,
  Gift,
} from "lucide-react";
import { UserRole, CityLocation } from "../types/marketplace";
import { ALL_ZIMBABWE_CITIES } from "../data/zimbabweLocations";
import { useAuth } from "../context/AuthContext";
import { ZMC_OFFICIAL_LOGO } from "./common/BrandLogo";

interface HeaderProps {
  activeTab: "landing" | "architecture" | "marketplace" | "worker" | "agency" | "jobs" | "search" | "whatsapp" | "whatsapp-upload" | "ai-studio" | "payments" | "admin" | "reviews" | "reports";
  setActiveTab: (tab: "landing" | "architecture" | "marketplace" | "worker" | "agency" | "jobs" | "search" | "whatsapp" | "whatsapp-upload" | "ai-studio" | "payments" | "admin" | "reviews" | "reports") => void;
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
  selectedCity: CityLocation;
  setSelectedCity: (city: CityLocation) => void;
  currency: "USD" | "ZWG";
  setCurrency: (c: "USD" | "ZWG") => void;
  onOpenAgencyRegister?: () => void;
  onOpenReferralProgram?: () => void;
}

const ALL_ROLES: UserRole[] = [
  "Domestic worker",
  "Maid",
  "Part-time maid",
  "Nanny",
  "Caregiver",
  "Housekeeper",
  "Shop assistant",
  "General hand",
  "Caretaker",
  "Doctor",
  "General cleaner",
  "Mobile carwasher",
  "Appliance repairer",
  "Locksmith",
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
  onOpenAgencyRegister,
  onOpenReferralProgram,
}) => {
  const { currentUser, setIsAuthModalOpen, setAuthModalTab, logout, switchDemoUser } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-emerald-950/95 backdrop-blur-md border-b border-emerald-800/40 text-white shadow-xl">
      {/* Top Utility Bar (Clean & Classy) */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-950 px-4 sm:px-6 py-1.5 text-xs border-b border-emerald-800/30 flex flex-wrap justify-between items-center gap-3">
        {/* Support & WhatsApp Direct Connect */}
        <div className="flex items-center space-x-3 text-emerald-200">
          <a
            href="tel:+263785458828"
            className="flex items-center space-x-1.5 text-emerald-200 hover:text-white text-[11px] font-medium transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Direct Line:</span>
            <span className="font-semibold">+263 785 458 828</span>
          </a>

          <span className="text-emerald-800 hidden sm:inline">•</span>

          <a
            href="https://wa.me/263785458828?text=Hello%20Zimbabwe%20Maids%20Centre%20Support"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 px-2.5 py-0.5 bg-[#25D366]/90 hover:bg-[#25D366] text-slate-950 font-bold text-[10px] rounded-full transition-all shadow-xs"
          >
            <MessageCircle className="w-3 h-3 fill-slate-950 text-[#25D366]" />
            <span>WhatsApp Support</span>
          </a>
        </div>

        {/* Global Controls: Location, Role & Currency */}
        <div className="flex items-center space-x-3">
          {/* City Location */}
          <div className="flex items-center space-x-1 text-xs text-emerald-200 bg-emerald-900/40 px-2 py-0.5 rounded-lg border border-emerald-800/50">
            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value as CityLocation)}
              className="bg-transparent text-emerald-100 font-medium text-[11px] focus:outline-none cursor-pointer"
            >
              {ZIM_CITIES.map((city) => (
                <option key={city} value={city} className="bg-slate-900 text-white">
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Persona Filter */}
          <div className="hidden lg:flex items-center space-x-1 text-xs text-emerald-200 bg-emerald-900/40 px-2 py-0.5 rounded-lg border border-emerald-800/50">
            <Users className="w-3 h-3 text-teal-400 shrink-0" />
            <span className="text-[10px] text-emerald-400/80">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="bg-transparent text-teal-100 font-medium text-[11px] focus:outline-none cursor-pointer max-w-[130px] truncate"
            >
              {ALL_ROLES.map((role) => (
                <option key={role} value={role} className="bg-slate-900 text-white">
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center bg-emerald-950/90 rounded-lg p-0.5 border border-emerald-700/50">
            <button
              onClick={() => setCurrency("USD")}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                currency === "USD" ? "bg-emerald-500 text-slate-950 shadow-xs" : "text-emerald-300 hover:text-white"
              }`}
            >
              USD $
            </button>
            <button
              onClick={() => setCurrency("ZWG")}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                currency === "ZWG" ? "bg-emerald-500 text-slate-950 shadow-xs" : "text-emerald-300 hover:text-white"
              }`}
            >
              ZWG (Gold)
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Row with Right-Aligned Sign In / Sign Up Portal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 cursor-pointer group shrink-0" onClick={() => setActiveTab("marketplace")}>
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-emerald-400/90 bg-white shadow-md shadow-emerald-950/40 shrink-0 group-hover:scale-105 transition-transform duration-200">
            <img
              src={ZMC_OFFICIAL_LOGO}
              alt="Zimbabwe Maids Centre Official Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              <span>Zimbabwe Maids Centre</span>
            </h1>
            <p className="text-[10px] sm:text-[11px] text-emerald-300/80 font-medium">
              Verified Domestic & Artisan Network
            </p>
          </div>
        </div>

        {/* Navigation Tabs Filtered by User Role */}
        <nav className="hidden md:flex items-center space-x-1 bg-emerald-900/50 p-1 rounded-xl border border-emerald-800/60 overflow-x-auto max-w-2xl">
          <button
            onClick={() => setActiveTab("landing")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "landing"
                ? "bg-amber-400 text-slate-950 font-bold shadow-md"
                : "text-amber-200 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Showcase</span>
          </button>

          {/* Client & Admin Relevant: Service Directory */}
          {(currentUser?.role === "Admin" || currentUser?.role === "Employer" || !currentUser) && (
            <button
              onClick={() => setActiveTab("marketplace")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "marketplace"
                  ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
                  : "text-emerald-200 hover:bg-emerald-800/50 hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Staff Directory</span>
            </button>
          )}

          {/* Worker & Admin Relevant: Worker Portal */}
          {(currentUser?.role === "Admin" || currentUser?.role === "Worker" || !currentUser) && (
            <button
              onClick={() => setActiveTab("worker")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "worker"
                  ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
                  : "text-emerald-200 hover:bg-emerald-800/50 hover:text-white"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Employee Portal</span>
            </button>
          )}

          {/* Placement Agency Portal */}
          {(currentUser?.role === "Admin" || currentUser?.role === "Agency" || !currentUser) && (
            <button
              onClick={() => setActiveTab("agency")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "agency"
                  ? "bg-teal-400 text-slate-950 shadow-md font-black"
                  : "text-teal-200 hover:bg-emerald-800/50 hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-teal-300" />
              <span>Agencies</span>
            </button>
          )}

          {/* Job Hub (All roles, adapted internally) */}
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "jobs"
                ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
                : "text-emerald-200 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-300" />
            <span>Job Hub</span>
          </button>

          {/* Search Engine */}
          <button
            onClick={() => setActiveTab("search")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "search"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-emerald-200 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <Search className="w-3.5 h-3.5 text-emerald-300" />
            <span>Search</span>
          </button>

          {/* WhatsApp Ingestion Portal */}
          {(currentUser?.role === "Admin" || currentUser?.role === "Employer") && (
            <button
              onClick={() => setActiveTab("whatsapp-upload")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "whatsapp-upload"
                  ? "bg-amber-400 text-slate-950 shadow-md font-bold"
                  : "text-amber-200 hover:bg-emerald-800/50 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>WhatsApp Ingestion</span>
            </button>
          )}

          {/* Escrow Ledger & Payments */}
          <button
            onClick={() => setActiveTab("payments")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === "payments"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-emerald-200 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payments</span>
          </button>

          {/* Admin Center ONLY for Admin */}
          {currentUser?.role === "Admin" && (
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === "admin"
                  ? "bg-amber-400 text-slate-950 shadow-md font-black"
                  : "bg-amber-400/20 text-amber-300 hover:bg-amber-400 hover:text-slate-950"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* RIGHT SIDE: Dedicated Sign In, Referral Program & User Portal */}
        <div className="flex items-center space-x-2 shrink-0">
          {onOpenReferralProgram && (
            <button
              onClick={onOpenReferralProgram}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md active:scale-95 border border-amber-300"
              title="Invite Friends & Earn $20 Placement Discount"
            >
              <Gift className="w-3.5 h-3.5 text-slate-950" />
              <span className="hidden sm:inline">Invite & Earn $20</span>
              <span className="sm:hidden">Earn $20</span>
            </button>
          )}

          {currentUser ? (
            /* Logged-in User Profile Dropdown */
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-600/50 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-xs">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-white text-xs font-bold leading-tight max-w-[110px] truncate">{currentUser.fullName}</div>
                  <div className="text-[9px] text-emerald-300 font-semibold uppercase">{currentUser.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-300 ml-0.5" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl p-3 z-50 space-y-2 animate-fadeIn text-xs">
                  <div className="p-2.5 bg-slate-800/90 rounded-xl space-y-1">
                    <p className="font-extrabold text-white text-xs">{currentUser.fullName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                    <p className="text-[10px] text-emerald-400 font-bold">
                      Role: {currentUser.role} {currentUser.specificProfession ? `(${currentUser.specificProfession})` : ""}
                    </p>
                  </div>

                  <div className="space-y-1 pt-1">
                    {onOpenReferralProgram && (
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onOpenReferralProgram();
                        }}
                        className="w-full text-left px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 rounded-lg text-[11px] font-black text-amber-300 flex items-center justify-between transition-colors mb-1.5"
                      >
                        <span className="flex items-center gap-1.5">
                          <Gift className="w-3.5 h-3.5 text-amber-400" />
                          <span>Refer Friends ($20 Credit)</span>
                        </span>
                        <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                      </button>
                    )}

                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Switch View Demo</p>
                    <button
                      onClick={() => {
                        switchDemoUser("Admin");
                        setIsProfileMenuOpen(false);
                        setActiveTab("admin");
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded-lg text-[11px] font-bold text-amber-300 flex items-center justify-between"
                    >
                      <span>👑 Master Admin View</span>
                      <ShieldCheck className="w-3 h-3 text-amber-400" />
                    </button>

                    <button
                      onClick={() => {
                        switchDemoUser("Employer");
                        setIsProfileMenuOpen(false);
                        setActiveTab("marketplace");
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded-lg text-[11px] font-bold text-emerald-300 flex items-center justify-between"
                    >
                      <span>🏠 Client / Employer View</span>
                      <Building2 className="w-3 h-3 text-emerald-400" />
                    </button>

                    <button
                      onClick={() => {
                        switchDemoUser("Worker");
                        setIsProfileMenuOpen(false);
                        setActiveTab("worker");
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded-lg text-[11px] font-bold text-sky-300 flex items-center justify-between"
                    >
                      <span>🧹 Employee / Worker View</span>
                      <UserCheck className="w-3 h-3 text-sky-400" />
                    </button>

                    <button
                      onClick={() => {
                        switchDemoUser("Agency");
                        setIsProfileMenuOpen(false);
                        setActiveTab("agency");
                      }}
                      className="w-full text-left px-2.5 py-1.5 hover:bg-slate-800 rounded-lg text-[11px] font-bold text-teal-300 flex items-center justify-between"
                    >
                      <span>🏢 Placement Agency View</span>
                      <Building2 className="w-3 h-3 text-teal-400" />
                    </button>
                  </div>

                  <div className="border-t border-slate-800 pt-2 flex justify-between items-center">
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="text-rose-400 hover:text-rose-300 font-bold text-[11px] flex items-center gap-1 w-full px-2 py-1 hover:bg-rose-950/30 rounded-lg transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Guest Sign In & Sign Up Controls on Right Side */
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setAuthModalTab("signin");
                  setIsAuthModalOpen(true);
                }}
                className="px-3.5 py-2 text-xs font-bold text-emerald-200 hover:text-white hover:bg-emerald-900/60 rounded-xl transition-all border border-emerald-700/40 active:scale-95"
              >
                Sign In
              </button>

              <button
                onClick={() => {
                  setAuthModalTab("register");
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md active:scale-95 border border-emerald-300/60"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Bar (Horizontal scroll on smaller devices) */}
      <div className="md:hidden flex items-center space-x-1 px-4 py-2 bg-emerald-950 border-t border-emerald-800/40 overflow-x-auto">
        <button
          onClick={() => setActiveTab("landing")}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
            activeTab === "landing" ? "bg-amber-400 text-slate-950 font-bold" : "text-amber-200"
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>Showcase</span>
        </button>

        <button
          onClick={() => setActiveTab("marketplace")}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
            activeTab === "marketplace" ? "bg-emerald-500 text-slate-950 font-bold" : "text-emerald-200"
          }`}
        >
          <Building2 className="w-3 h-3" />
          <span>Staff</span>
        </button>

        <button
          onClick={() => setActiveTab("worker")}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
            activeTab === "worker" ? "bg-emerald-500 text-slate-950 font-bold" : "text-emerald-200"
          }`}
        >
          <UserCheck className="w-3 h-3" />
          <span>Workers</span>
        </button>

        <button
          onClick={() => setActiveTab("agency")}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
            activeTab === "agency" ? "bg-teal-400 text-slate-950 font-bold" : "text-teal-200"
          }`}
        >
          <Building2 className="w-3 h-3" />
          <span>Agencies</span>
        </button>

        <button
          onClick={() => setActiveTab("jobs")}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
            activeTab === "jobs" ? "bg-emerald-500 text-slate-950 font-bold" : "text-emerald-200"
          }`}
        >
          <Briefcase className="w-3 h-3" />
          <span>Jobs</span>
        </button>

        <button
          onClick={() => setActiveTab("search")}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
            activeTab === "search" ? "bg-emerald-500 text-slate-950 font-bold" : "text-emerald-200"
          }`}
        >
          <Search className="w-3 h-3" />
          <span>Search</span>
        </button>

        <button
          onClick={() => setActiveTab("payments")}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
            activeTab === "payments" ? "bg-emerald-500 text-slate-950 font-bold" : "text-emerald-200"
          }`}
        >
          <CreditCard className="w-3 h-3" />
          <span>Payments</span>
        </button>

        {currentUser?.role === "Admin" && (
          <button
            onClick={() => setActiveTab("admin")}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === "admin" ? "bg-amber-400 text-slate-950 font-bold" : "text-amber-300"
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Admin</span>
          </button>
        )}
      </div>
    </header>
  );
};
