import React, { useState } from "react";
import { WorkerProfile, JobPosting, UserRole, CityLocation, EmployerHiringRequest } from "../../types/marketplace";
import { WorkerProfileModal } from "./WorkerProfileModal";
import { EmployerHiringModal } from "../jobs/EmployerHiringModal";
import { ALL_ZIMBABWE_CITIES, getSuburbsForCity } from "../../data/zimbabweLocations";
import { PaynowModal, PaynowPaymentDetails, PaynowReceipt } from "../payment/PaynowModal";
import { useAuth } from "../../context/AuthContext";
import { useCategories } from "../../context/CategoryContext";
import {
  Search,
  Filter,
  ShieldCheck,
  Star,
  MapPin,
  Briefcase,
  PlusCircle,
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  Building,
  Award,
  Lock,
  UserCheck
} from "lucide-react";

interface WorkerDirectoryProps {
  selectedRole: UserRole;
  selectedCity: CityLocation;
  currency: "USD" | "ZWG";
  onOpenHirePlacement: (worker: WorkerProfile) => void;
  onOpenChat: (worker: WorkerProfile) => void;
  isPremiumEmployer?: boolean;
  onOpenPremiumModal?: (worker?: WorkerProfile) => void;
  onNavigateToJobs?: () => void;
}

export const WorkerDirectory: React.FC<WorkerDirectoryProps> = ({
  selectedRole,
  selectedCity,
  currency,
  onOpenHirePlacement,
  onOpenChat,
  isPremiumEmployer = false,
  onOpenPremiumModal,
  onNavigateToJobs,
}) => {
  const { currentUser, setIsEditProfileModalOpen } = useAuth();
  const { publicCategories, allWorkers, initiateFeaturedPayment, confirmFeaturedPayment, updateWorkerProfile } = useCategories();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [cityFilter, setCityFilter] = useState<string>(selectedCity || "Harare");
  const [suburbFilter, setSuburbFilter] = useState<string>("All Suburbs");
  const [verifiedOnlyFilter, setVerifiedOnlyFilter] = useState<boolean>(true); // Default to verified screened candidates
  const [featuredOnlyFilter, setFeaturedOnlyFilter] = useState<boolean>(false);
  const [screeningFilter, setScreeningFilter] = useState<"all" | "police" | "references">("all");
  const [isHiringModalOpen, setIsHiringModalOpen] = useState<boolean>(false);

  // Paynow boosting state
  const [isPaynowOpen, setIsPaynowOpen] = useState(false);
  const [paynowDetails, setPaynowDetails] = useState<PaynowPaymentDetails | null>(null);
  const [targetWorkerToFeature, setTargetWorkerToFeature] = useState<WorkerProfile | null>(null);
  const [pendingPaymentRef, setPendingPaymentRef] = useState<string | null>(null);

  const suburbs = getSuburbsForCity(cityFilter);

  const handleCityChange = (newCity: string) => {
    setCityFilter(newCity);
    setSuburbFilter("All Suburbs");
  };

  const handleTriggerCardFeature = (worker: WorkerProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    setTargetWorkerToFeature(worker);
    const res = initiateFeaturedPayment(worker.id, worker.fullName, worker.role, "Paynow USD");
    setPendingPaymentRef(res.payment.paymentReference);
    setPaynowDetails({
      title: `⭐ Place ${worker.fullName} on Featured Maid List (30 Days)`,
      amountUSD: 3.0,
      serviceType: "featured_maid",
      targetId: worker.id,
      targetName: worker.fullName,
      customReference: res.payment.paymentReference,
    });
    setIsPaynowOpen(true);
  };

  const handlePaynowFeatureSuccess = (receipt: PaynowReceipt) => {
    const ref = receipt.paynowReference || receipt.transactionReference;
    if (pendingPaymentRef) {
      confirmFeaturedPayment(pendingPaymentRef, ref);
    } else if (targetWorkerToFeature) {
      const res = initiateFeaturedPayment(targetWorkerToFeature.id, targetWorkerToFeature.fullName, targetWorkerToFeature.role, "Paynow USD");
      confirmFeaturedPayment(res.payment.paymentReference, ref);
    }
    if (targetWorkerToFeature) {
      const updatedWorker: WorkerProfile = {
        ...targetWorkerToFeature,
        isFeatured: true,
        featuredExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      };
      updateWorkerProfile(updatedWorker.id, updatedWorker);
      if (selectedWorker && selectedWorker.id === targetWorkerToFeature.id) {
        setSelectedWorker(updatedWorker);
      }
    }
  };

  const handleUpdateWorker = (updated: WorkerProfile) => {
    updateWorkerProfile(updated.id, updated);
    if (selectedWorker && selectedWorker.id === updated.id) {
      setSelectedWorker(updated);
    }
  };

  // If currentUser is a Worker, strictly restrict them from browsing other candidates
  if (currentUser?.role === "Worker") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-10 h-10 text-emerald-700" />
          </div>
          <div className="space-y-3 max-w-xl mx-auto">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-black rounded-full uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Worker Privacy & Screening Shield</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Candidate Directory is Restricted for Job Seekers
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To protect the privacy and personal contact details of all domestic workers and candidates, job seekers cannot browse other workers.
              Please use your <strong>Worker Dashboard</strong> to complete your background screening (National ID & Police Clearance) or apply directly to verified employer vacancies.
            </p>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-lg mx-auto text-left space-y-2 text-xs text-emerald-950">
            <div className="font-black text-emerald-900 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Your Candidate Next Steps:</span>
            </div>
            <p>1. Keep your National ID and Police Clearance certificates uploaded.</p>
            <p>2. Set your available locations and expected monthly salary.</p>
            <p>3. Browse and apply to live jobs posted by families in Zimbabwe.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {onNavigateToJobs && (
              <button
                onClick={onNavigateToJobs}
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Briefcase className="w-4 h-4" />
                <span>Find Jobs & Vacancies</span>
              </button>
            )}
            <button
              onClick={() => setIsEditProfileModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl shadow transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Edit My Profile & Documents</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredWorkers = allWorkers
    .filter((worker) => {
      // Exclude blacklisted/restricted candidates from public search
      if (worker.isRestricted) return false;

      // Only show verified screened candidates when verifiedOnlyFilter is on
      const matchesVerified = !verifiedOnlyFilter || worker.isVerified;
      const matchesFeatured = !featuredOnlyFilter || worker.isFeatured;
      
      // Screening sub-filter
      const matchesScreening =
        screeningFilter === "all" ||
        (screeningFilter === "police" && (worker.isVerified || worker.policeClearanceDocUrl)) ||
        (screeningFilter === "references" && (worker.verifications?.referenceVerified || worker.experienceYears >= 2));

      // Match category name flexibly against role
      const matchesCategory =
        activeCategory === "All" ||
        worker.role.toLowerCase().includes(activeCategory.toLowerCase()) ||
        activeCategory.toLowerCase().includes(worker.role.toLowerCase());

      const matchesCity = !cityFilter || worker.city.toLowerCase() === cityFilter.toLowerCase() || cityFilter === "All Cities";
      const matchesSuburb = suburbFilter === "All Suburbs" || worker.suburb.toLowerCase() === suburbFilter.toLowerCase();
      const matchesSearch =
        worker.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        worker.suburb.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (worker.qualifications && worker.qualifications.some((q) => q.toLowerCase().includes(searchTerm.toLowerCase())));
      return matchesCategory && matchesCity && matchesSuburb && matchesSearch && matchesVerified && matchesFeatured && matchesScreening;
    })
    .sort((a, b) => {
      // Featured maids always rank at the top
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return b.rating - a.rating;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Search & Hero Banner (For Employers) */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 border border-emerald-800/40 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-6 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-black shadow-sm">
              <Users className="w-3.5 h-3.5" />
              <span>EMPLOYER VIEW • HIRE VERIFIED MAIDS & STAFF</span>
            </div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-800/80 rounded-full text-xs font-semibold text-emerald-200 border border-emerald-700/50">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Police Verified & Reference Checked</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Browse Verified Maids, Nannies & Domestic Workers in {cityFilter}
          </h2>
          <p className="text-sm text-emerald-100/80">
            Find pre-screened housekeepers, nannies, caregivers, cooks, gardeners, electricians, and drivers with background clearance & escrow payment protection.
          </p>

          {/* City & Major Suburb Dynamic Selectors */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* City Selector */}
            <div className="bg-emerald-950/80 p-2.5 rounded-2xl border border-emerald-700/60">
              <label className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold block mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>Zimbabwe City / Town</span>
              </label>
              <select
                value={cityFilter}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full bg-slate-900 text-white text-xs font-semibold rounded-xl p-2 border border-emerald-800/80 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
              >
                <option value="All Cities">All Zimbabwe Cities & Towns</option>
                {ALL_ZIMBABWE_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Suburb Selector */}
            <div className="bg-emerald-950/80 p-2.5 rounded-2xl border border-emerald-700/60">
              <label className="text-[10px] uppercase tracking-wider text-teal-300 font-bold block mb-1 flex items-center gap-1">
                <Building className="w-3 h-3 text-teal-400" />
                <span>Major Suburb / Neighborhood ({cityFilter})</span>
              </label>
              <select
                value={suburbFilter}
                onChange={(e) => setSuburbFilter(e.target.value)}
                className="w-full bg-slate-900 text-white text-xs font-semibold rounded-xl p-2 border border-emerald-800/80 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
              >
                {suburbs.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, skill (e.g. Solar, Infant Care, Maid, Ironing)..."
                className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-md"
              />
            </div>
            <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl text-xs font-bold shadow-lg transition-all flex items-center justify-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Maids Available ({filteredWorkers.length})</span>
            </button>
            <button
              onClick={() => setIsHiringModalOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-2xl text-xs font-black shadow-lg transition-all flex items-center justify-center space-x-1.5 active:scale-95"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Looking for a Helper? Post Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role Pathway Alert Banner (For Domestic Workers looking for jobs) */}
      <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-teal-500/15 border border-amber-400/50 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm mb-6">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-amber-400 text-slate-950 rounded-2xl shrink-0 font-black shadow-sm">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-black text-slate-900">
                Are you a Domestic Worker or Artisan looking for employment?
              </h3>
              <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-black rounded-md uppercase">
                Worker Mode
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Browse full-time, live-in, and part-time jobs posted by verified employers across Harare, Bulawayo & Mutare.
            </p>
          </div>
        </div>
        {onNavigateToJobs && (
          <button
            onClick={onNavigateToJobs}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 shrink-0 whitespace-nowrap active:scale-95 border border-amber-300"
          >
            <Briefcase className="w-4 h-4" />
            <span>View Jobs Posted by Employers →</span>
          </button>
        )}
      </div>

      {/* Category Pills & Screening Header */}
      <div className="space-y-3 mb-6">
        {/* Screening Standards Alert Bar */}
        <div className="p-3 bg-emerald-900/90 text-white rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-md border border-emerald-700">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-bold">
              ZMC Candidate Screening Active: All candidates undergo National ID Verification, CID Zimbabwe Police Record Clearance, and Reference Checks.
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setScreeningFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                screeningFilter === "all" ? "bg-emerald-400 text-slate-950 font-black" : "bg-emerald-800 text-emerald-100 hover:bg-emerald-700"
              }`}
            >
              All Screened ({filteredWorkers.length})
            </button>
            <button
              onClick={() => setScreeningFilter("police")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                screeningFilter === "police" ? "bg-emerald-400 text-slate-950 font-black" : "bg-emerald-800 text-emerald-100 hover:bg-emerald-700"
              }`}
            >
              CID Police Cleared
            </button>
            <button
              onClick={() => setScreeningFilter("references")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                screeningFilter === "references" ? "bg-emerald-400 text-slate-950 font-black" : "bg-emerald-800 text-emerald-100 hover:bg-emerald-700"
              }`}
            >
              References Checked
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="px-3.5 py-1.5 bg-emerald-900 text-white rounded-xl text-xs font-black flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-emerald-300" />
              <span>Verified Candidates ({filteredWorkers.length})</span>
            </span>
          </div>

          {/* Category Pills & Filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => {
                setActiveCategory("All");
                setFeaturedOnlyFilter(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === "All" && !featuredOnlyFilter
                  ? "bg-emerald-800 text-white shadow"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              All Roles
            </button>

            {/* Featured Maid Special Filter Tab */}
            <button
              onClick={() => setFeaturedOnlyFilter(!featuredOnlyFilter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
                featuredOnlyFilter
                  ? "bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-400/80"
                  : "bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>⭐ Featured Maids ($3 Boosted)</span>
            </button>

            {publicCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.name);
                  setFeaturedOnlyFilter(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.name && !featuredOnlyFilter
                    ? "bg-emerald-800 text-white shadow"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workers Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkers.map((worker) => {
          const monthlyUSD = worker.monthlyRateUSD;
          const priceLabel =
            currency === "USD"
              ? `$${monthlyUSD} USD / mo`
              : `${(monthlyUSD * 26.5).toLocaleString()} ZWG / mo`;

          return (
            <div
              key={worker.id}
              className={`rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative ${
                worker.isFeatured
                  ? "bg-gradient-to-b from-amber-50/40 via-white to-white border-2 border-amber-300 ring-2 ring-amber-400/30"
                  : "bg-white border border-slate-200"
              }`}
            >
              <div>
                {/* Featured Ribbon */}
                {worker.isFeatured && (
                  <div className="mb-3 -mt-2 -mx-2 flex items-center justify-between px-3 py-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 text-slate-950 rounded-xl text-[10px] font-black shadow-xs">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-slate-950" />
                      <span>⭐ FEATURED CANDIDATE • VERIFIED PRIORITY</span>
                    </span>
                    <span className="text-[9px] opacity-80">Paid via Paynow ($3)</span>
                  </div>
                )}

                {/* Top Header Card */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={worker.avatarUrl}
                        alt={worker.fullName}
                        className={`w-14 h-14 rounded-2xl object-cover border ${
                          worker.isFeatured ? "border-amber-300 ring-2 ring-amber-400/50" : "border-slate-200"
                        }`}
                      />
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-md shadow">
                        <ShieldCheck className="w-3 h-3" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                          {worker.fullName}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[11px] font-semibold rounded-md border border-emerald-200/60">
                          {worker.role}
                        </span>
                        {worker.isFeatured && (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 text-[9px] font-black rounded border border-amber-300">
                            ★ TOP
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-1 text-xs font-bold text-slate-900">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{worker.rating}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">({worker.reviewCount} reviews)</span>
                  </div>
                </div>

                {/* Location & Availability */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2.5 pb-2.5 border-b border-slate-100">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {worker.suburb}, {worker.city}
                    </span>
                  </span>
                  <span className="flex items-center space-x-1 text-emerald-600 font-semibold">
                    <Clock className="w-3 h-3" />
                    <span>{worker.availability}</span>
                  </span>
                </div>

                {/* Candidate Screening & Vetting Status Banner */}
                <div className="mb-3 px-2.5 py-1.5 bg-emerald-50/90 border border-emerald-200/80 rounded-xl flex items-center justify-between text-[10px] text-emerald-950">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>CID Police Checked • ID Verified</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-emerald-200 text-emerald-900 font-extrabold rounded text-[9px]">
                    ✓ Screened
                  </span>
                </div>

                {/* Bio Summary */}
                <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">{worker.bio}</p>

                {/* Qualifications & Certifications */}
                {worker.qualifications && worker.qualifications.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1">
                    {worker.qualifications.slice(0, 2).map((qual, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-200/80 rounded-md text-[10px] font-bold flex items-center gap-1"
                      >
                        <Award className="w-2.5 h-2.5 text-emerald-600" />
                        <span className="truncate max-w-[130px]">{qual}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Skills Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {worker.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-medium rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                  {worker.skills.length > 3 && (
                    <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 text-[10px] rounded">
                      +{worker.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Primary CTA */}
              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Estimated Rate</div>
                    <div className="text-sm font-black text-emerald-800 font-mono">{priceLabel}</div>
                  </div>

                  {!worker.isFeatured && (
                    <button
                      onClick={(e) => handleTriggerCardFeature(worker, e)}
                      className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[10px] font-black flex items-center gap-1 transition-colors cursor-pointer"
                      title="Promote to Featured Maid List ($3 via Paynow)"
                    >
                      <Sparkles className="w-3 h-3 text-amber-600 fill-amber-600" />
                      <span>Feature ($3)</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setSelectedWorker(worker)}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm text-center"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => onOpenHirePlacement(worker)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 text-center"
                  >
                    Hire Candidate
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Detail Modal */}
      <WorkerProfileModal
        worker={selectedWorker}
        onClose={() => setSelectedWorker(null)}
        currency={currency}
        isPremiumEmployer={isPremiumEmployer}
        onOpenPremiumModal={() => onOpenPremiumModal?.(selectedWorker || undefined)}
        onUpdateWorker={handleUpdateWorker}
        onOpenEditProfile={() => setIsEditProfileModalOpen(true)}
        onHireNow={(w) => {
          setSelectedWorker(null);
          onOpenHirePlacement(w);
        }}
        onContactWorker={(w) => {
          setSelectedWorker(null);
          onOpenChat(w);
        }}
      />

      {/* Employer Hiring Form Modal */}
      <EmployerHiringModal
        isOpen={isHiringModalOpen}
        onClose={() => setIsHiringModalOpen(false)}
        onSubmitSuccess={() => {
          setIsHiringModalOpen(false);
          onNavigateToJobs?.();
        }}
      />

      {/* Quick Paynow Modal for Worker Boost */}
      <PaynowModal
        isOpen={isPaynowOpen}
        onClose={() => setIsPaynowOpen(false)}
        details={paynowDetails}
        onSuccess={handlePaynowFeatureSuccess}
      />
    </div>
  );
};
