import React, { useState } from "react";
import { SAMPLE_WORKERS, SAMPLE_JOBS } from "../../data/mockData";
import { WorkerProfile, JobPosting, UserRole, CityLocation, EmployerHiringRequest } from "../../types/marketplace";
import { WorkerProfileModal } from "./WorkerProfileModal";
import { EmployerHiringModal } from "../jobs/EmployerHiringModal";
import { ALL_ZIMBABWE_CITIES, getSuburbsForCity } from "../../data/zimbabweLocations";
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

const CATEGORY_TABS: UserRole[] = [
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
];

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
  const [activeCategory, setActiveCategory] = useState<UserRole | "All">("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [cityFilter, setCityFilter] = useState<string>(selectedCity || "Harare");
  const [suburbFilter, setSuburbFilter] = useState<string>("All Suburbs");
  const [verifiedOnlyFilter, setVerifiedOnlyFilter] = useState<boolean>(false);
  const [isHiringModalOpen, setIsHiringModalOpen] = useState<boolean>(false);

  const suburbs = getSuburbsForCity(cityFilter);

  const handleCityChange = (newCity: string) => {
    setCityFilter(newCity);
    setSuburbFilter("All Suburbs");
  };

  const filteredWorkers = SAMPLE_WORKERS.filter((worker) => {
    // Exclude blacklisted/restricted candidates from public search
    if (worker.isRestricted) return false;

    const matchesVerified = !verifiedOnlyFilter || worker.isVerified;
    const matchesCategory = activeCategory === "All" || worker.role === activeCategory;
    const matchesCity = !cityFilter || worker.city.toLowerCase() === cityFilter.toLowerCase() || cityFilter === "All Cities";
    const matchesSuburb = suburbFilter === "All Suburbs" || worker.suburb.toLowerCase() === suburbFilter.toLowerCase();
    const matchesSearch =
      worker.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      worker.suburb.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesCity && matchesSuburb && matchesSearch && matchesVerified;
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

      {/* Category Pills Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <span className="px-3.5 py-1.5 bg-emerald-900 text-white rounded-xl text-xs font-black flex items-center space-x-1.5">
            <Users className="w-4 h-4 text-emerald-300" />
            <span>Verified Candidates ({filteredWorkers.length})</span>
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === "All"
                ? "bg-emerald-800 text-white shadow"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Roles
          </button>
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-emerald-800 text-white shadow"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
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
              className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative"
            >
              <div>
                {/* Top Header Card */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={worker.avatarUrl}
                        alt={worker.fullName}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-md shadow">
                        <ShieldCheck className="w-3 h-3" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                        {worker.fullName}
                      </h3>
                      <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[11px] font-semibold rounded-md border border-emerald-200/60 mt-0.5">
                        {worker.role}
                      </span>
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
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3 pb-3 border-b border-slate-100">
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

                {/* Bio Summary */}
                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">{worker.bio}</p>

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
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Estimated Rate</div>
                  <div className="text-sm font-black text-emerald-800 font-mono">{priceLabel}</div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedWorker(worker)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => onOpenHirePlacement(worker)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
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
    </div>
  );
};
