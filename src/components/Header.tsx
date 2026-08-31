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
  ChevronRight,
  User,
  ShieldAlert,
  CheckCircle2,
  Gift,
  Bell,
  Settings,
  HelpCircle,
} from "lucide-react";
import { UserRole, CityLocation } from "../types/marketplace";
import { ALL_ZIMBABWE_CITIES } from "../data/zimbabweLocations";
import { useAuth } from "../context/AuthContext";
import { useCategories } from "../context/CategoryContext";
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
  onOpenNotifications?: () => void;
  onOpenLegalCompliance?: (tab?: any) => void;
  onOpenAccessibility?: () => void;
  onOpenMarketingHub?: () => void;
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
  onOpenNotifications,
  onOpenLegalCompliance,
  onOpenAccessibility,
  onOpenMarketingHub,
}) => {
  const { currentUser, setIsAuthModalOpen, setIsEditProfileModalOpen, setAuthModalTab, logout, switchDemoUser } = useAuth();
  const { publicCategories } = useCategories();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const dynamicRoleOptions = [
    ...publicCategories.map((c) => c.name),
    "Employer",
    "Agency",
    "Admin",
  ];

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

          {/* Persona Filter - Hide for Worker, keep for Employer/Admin/Guest */}
          {currentUser?.role !== "Worker" ? (
            <div className="hidden lg:flex items-center space-x-1 text-xs text-emerald-200 bg-emerald-900/40 px-2 py-0.5 rounded-lg border border-emerald-800/50">
              <Users className="w-3 h-3 text-teal-400 shrink-0" />
              <span className="text-[10px] text-emerald-400/80">Role:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="bg-transparent text-teal-100 font-medium text-[11px] focus:outline-none cursor-pointer max-w-[130px] truncate"
              >
                {dynamicRoleOptions.map((role) => (
                  <option key={role} value={role} className="bg-slate-900 text-white">
                    {role}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="hidden lg:flex items-center space-x-1.5 text-xs text-emerald-200 bg-emerald-900/40 px-2.5 py-0.5 rounded-lg border border-emerald-700/50">
              <UserCheck className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="text-[10px] text-emerald-300 font-bold">Category:</span>
              <span className="text-[11px] font-bold text-amber-300 truncate max-w-[140px]">
                {currentUser.specificProfession || currentUser.role}
              </span>
            </div>
          )}

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
        <div className="flex items-center space-x-3 cursor-pointer group shrink-0" onClick={() => setActiveTab("landing")}>
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

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-emerald-900/50 p-1 rounded-xl border border-emerald-800/60 overflow-x-auto max-w-3xl">
          {/* Home */}
          <button
            onClick={() => setActiveTab("landing")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "landing"
                ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
                : "text-emerald-200 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          {/* Find Maids & Staff - ONLY for Non-Workers (Employers, Admins, Guests) */}
          {currentUser?.role !== "Worker" && (
            <button
              onClick={() => setActiveTab("marketplace")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "marketplace"
                  ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
                  : "text-emerald-200 hover:bg-emerald-800/50 hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Find Maids</span>
            </button>
          )}

          {/* Browse Jobs - For all users, especially Workers */}
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "jobs"
                ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
                : "text-emerald-200 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>{currentUser?.role === "Worker" ? "Find Jobs & Vacancies" : "Browse Jobs"}</span>
          </button>

          {/* Agencies - ONLY for Non-Workers */}
          {currentUser?.role !== "Worker" && (
            <button
              onClick={() => setActiveTab("agency")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "agency"
                  ? "bg-teal-400 text-slate-950 shadow-md font-extrabold"
                  : "text-teal-200 hover:bg-emerald-800/50 hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Agencies</span>
            </button>
          )}

          {/* Worker Dashboard Tab - Dedicated for logged-in Worker */}
          {currentUser?.role === "Worker" && (
            <button
              onClick={() => setActiveTab("maid" as any)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "maid" || activeTab === "worker"
                  ? "bg-amber-400 text-slate-950 shadow-md font-black"
                  : "text-amber-300 hover:bg-emerald-800/50 hover:text-white"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>My Worker Dashboard</span>
            </button>
          )}

          {/* Reviews & How it works */}
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "reviews"
                ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
                : "text-emerald-200 hover:bg-emerald-800/50 hover:text-white"
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Reviews</span>
          </button>

          {/* User-Specific Active Portal for Employer */}
          {currentUser?.role === "Employer" && (
            <button
              onClick={() => setActiveTab("employer" as any)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "employer"
                  ? "bg-amber-400 text-slate-950 shadow-md font-black"
                  : "text-amber-300 hover:bg-emerald-800/50 hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Employer Portal</span>
            </button>
          )}

          {/* Admin Center - ONLY for Admin */}
          {currentUser?.role === "Admin" && (
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "admin"
                  ? "bg-amber-400 text-slate-950 shadow-md font-black"
                  : "text-amber-200 hover:bg-emerald-800/50 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Admin Center</span>
            </button>
          )}
        </nav>

        {/* RIGHT SIDE: Dedicated Sign In, Referral Program, Notifications & User Portal */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Notification Center Trigger */}
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="relative p-2 bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600/50 rounded-xl text-emerald-300 hover:text-white transition-all shadow-sm active:scale-95"
              title="View Notifications & Live Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center border border-emerald-950">
                3
              </span>
            </button>
          )}

          {/* Marketing & Knowledge Hub Trigger */}
          {onOpenMarketingHub && (
            <button
              onClick={onOpenMarketingHub}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600/40 text-emerald-200 hover:text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              title="Featured workers, Blog tips, and FAQs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Marketing Hub</span>
            </button>
          )}

          {currentUser ? (
            /* Logged-in User Profile Dropdown (Facebook Style) */
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 p-1 sm:px-2.5 sm:py-1.5 bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-600/50 rounded-full sm:rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                title="Account menu"
              >
                <div className="w-7 h-7 rounded-full ring-2 ring-emerald-400 overflow-hidden bg-emerald-700 flex items-center justify-center font-black text-xs text-white shrink-0">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{currentUser.fullName.charAt(0)}</span>
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-white text-xs font-bold leading-tight max-w-[100px] truncate">{currentUser.fullName}</div>
                  <div className="text-[9px] text-emerald-300 font-semibold uppercase">{currentUser.role}</div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-emerald-300 ml-0.5 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-84 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 text-white rounded-2xl shadow-2xl p-2.5 z-50 space-y-1.5 animate-fadeIn text-xs">
                  {/* Top Facebook Profile Card */}
                  <div
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsEditProfileModalOpen(true);
                    }}
                    className="p-3 bg-slate-800/90 hover:bg-slate-800 rounded-xl border border-slate-700/60 transition-all flex items-center space-x-3 cursor-pointer group shadow-xs"
                  >
                    <div className="w-12 h-12 rounded-full ring-2 ring-emerald-500 overflow-hidden bg-slate-700 shrink-0">
                      {currentUser.avatarUrl ? (
                        <img
                          src={currentUser.avatarUrl}
                          alt={currentUser.fullName}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-base text-white bg-gradient-to-br from-emerald-600 to-teal-700">
                          {currentUser.fullName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-sm text-white group-hover:text-emerald-300 transition-colors leading-tight truncate">
                        {currentUser.fullName}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate leading-tight mt-0.5">
                        {currentUser.email}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50">
                          {currentUser.role}
                        </span>
                        {currentUser.specificProfession && (
                          <span className="text-[10px] text-slate-400 truncate">
                            {currentUser.specificProfession}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </div>

                  <div className="h-px bg-slate-800/80 my-1"></div>

                  {/* ONLY ADMIN SEES THE DASHBOARD LINK */}
                  {currentUser.role === "Admin" && (
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setActiveTab("admin");
                        }}
                        className="w-full text-left p-2 hover:bg-slate-800 rounded-xl transition-colors flex items-center space-x-3 group cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 group-hover:bg-amber-500/30 transition-colors">
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white group-hover:text-amber-300">
                              Admin Dashboard
                            </span>
                            <span className="text-[9px] bg-amber-400/20 text-amber-300 font-extrabold px-1.5 py-0.2 rounded">
                              Superuser
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">
                            Vetting, user approvals & Paynow audit
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0" />
                      </button>

                      {/* Admin Quick Role Simulation Options */}
                      <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                          Admin Preview Modes
                        </span>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            onClick={() => {
                              switchDemoUser("Employer");
                              setIsProfileMenuOpen(false);
                              setActiveTab("employer" as any);
                            }}
                            className="py-1 px-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[10px] font-bold rounded-lg text-center truncate cursor-pointer transition-colors"
                          >
                            Employer View
                          </button>
                          <button
                            onClick={() => {
                              switchDemoUser("Worker");
                              setIsProfileMenuOpen(false);
                              setActiveTab("maid" as any);
                            }}
                            className="py-1 px-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 text-[10px] font-bold rounded-lg text-center truncate cursor-pointer transition-colors"
                          >
                            Worker View
                          </button>
                          <button
                            onClick={() => {
                              switchDemoUser("Agency");
                              setIsProfileMenuOpen(false);
                              setActiveTab("agency");
                            }}
                            className="py-1 px-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 text-[10px] font-bold rounded-lg text-center truncate cursor-pointer transition-colors"
                          >
                            Agency View
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Standard Facebook-Style Navigation List (For all users) */}
                  <div className="space-y-0.5">
                    {/* Settings & Privacy -> Edit Profile */}
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setIsEditProfileModalOpen(true);
                      }}
                      className="w-full text-left p-2 hover:bg-slate-800 rounded-xl transition-colors flex items-center space-x-3 group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 group-hover:bg-slate-700 group-hover:text-white transition-colors">
                        <Settings className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs text-white group-hover:text-emerald-300">
                          Settings & Profile
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          National ID, contact numbers & account info
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0" />
                    </button>

                    {/* 24/7 Help & WhatsApp Support */}
                    <a
                      href="https://wa.me/263785458828?text=Hello%20Zimbabwe%20Maid%20Center%20Support"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="w-full text-left p-2 hover:bg-slate-800 rounded-xl transition-colors flex items-center space-x-3 group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-full bg-slate-800 text-[#25D366] flex items-center justify-center shrink-0 group-hover:bg-[#25D366]/20 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-xs text-white group-hover:text-[#25D366]">
                            Help & Support
                          </p>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1 rounded">
                            24/7 Live
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">
                          WhatsApp Concierge (+263 785 458 828)
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 shrink-0" />
                    </a>
                  </div>

                  <div className="h-px bg-slate-800/80 my-1"></div>

                  {/* Log Out */}
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left p-2 hover:bg-rose-950/40 rounded-xl transition-colors flex items-center space-x-3 group cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 group-hover:bg-rose-500/30 transition-colors">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-rose-400 group-hover:text-rose-300">
                        Log Out
                      </p>
                      <p className="text-[10px] text-rose-400/60 truncate">
                        End session on this device
                      </p>
                    </div>
                  </button>
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
                  setAuthModalTab("signup");
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
            activeTab === "landing" ? "bg-emerald-400 text-slate-950 font-bold" : "text-emerald-200"
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab("marketplace")}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
            activeTab === "marketplace" ? "bg-emerald-500 text-slate-950 font-bold" : "text-emerald-200"
          }`}
        >
          <Users className="w-3 h-3" />
          <span>Find Maids</span>
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
          onClick={() => setActiveTab("agency")}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
            activeTab === "agency" ? "bg-teal-400 text-slate-950 font-bold" : "text-teal-200"
          }`}
        >
          <Building2 className="w-3 h-3" />
          <span>Agencies</span>
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
            activeTab === "reviews" ? "bg-emerald-500 text-slate-950 font-bold" : "text-emerald-200"
          }`}
        >
          <Star className="w-3 h-3" />
          <span>Reviews</span>
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
