import React, { useState } from "react";
import {
  Building2,
  Users,
  Briefcase,
  CreditCard,
  UserPlus,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Upload,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Archive,
  RefreshCw,
  Copy,
  Check,
  Send,
  MessageSquare,
  Award,
  Phone,
  Mail,
  MapPin,
  Globe,
  ExternalLink,
  Lock,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  FileCheck,
  ChevronRight,
  Download,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { PAYMENT_GATEWAY_ASSETS } from "../common/PaymentBadges";
import { CityLocation, UserRole, WorkerProfile, JobPosting } from "../../types/marketplace";
import { AgencyProfile, AgencyPaymentRecord, AgencyStaffMember, AgencyPlacement } from "../../types/agency";
import { WhatsAppProfileImportModal } from "../chat/WhatsAppProfileImportModal";

const ZIM_CITIES: CityLocation[] = [
  "Harare",
  "Bulawayo",
  "Chitungwiza",
  "Mutare",
  "Gweru",
  "Kwekwe",
  "Kadoma",
  "Masvingo",
  "Chinhoyi",
  "Norton",
  "Marondera",
  "Ruwa",
  "Victoria Falls",
  "Hwange",
  "Zvishavane",
  "Beitbridge",
];

const WORKER_ROLES: UserRole[] = [
  "Maid",
  "Nanny",
  "Caregiver",
  "Cook",
  "Gardener",
  "Driver",
  "Housekeeper",
  "Cleaner",
  "Electrician",
  "Plumber",
];

export const AgencyDashboard: React.FC = () => {
  const {
    currentUser,
    currentAgency,
    agencies,
    submitAgencySubscriptionPayment,
    addAgencyWorker,
    updateAgencyWorker,
    archiveAgencyWorker,
    deleteAgencyWorker,
    addAgencyJob,
    closeAgencyJob,
    addAgencyStaff,
    updateAgencyProfileDetails,
    pendingWorkerProfiles,
    approvedWorkerProfiles,
  } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "workers" | "jobs" | "placements" | "subscription" | "staff" | "profile"
  >("overview");

  // Filter & Search states
  const [workerSearch, setWorkerSearch] = useState("");
  const [workerStatusFilter, setWorkerStatusFilter] = useState<"All" | "Active" | "Draft" | "Archived">("All");
  const [jobSearch, setJobSearch] = useState("");

  // Modals
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showWhatsAppImportModal, setShowWhatsAppImportModal] = useState(false);
  const [showPaymentProofModal, setShowPaymentProofModal] = useState(false);
  const [selectedWorkerDetail, setSelectedWorkerDetail] = useState<any>(null);
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Agency data resolution
  const agency: AgencyProfile = currentAgency || agencies[0];

  // Derive workers belonging to this agency
  const allWorkers = [...approvedWorkerProfiles, ...pendingWorkerProfiles];
  const agencyWorkers = allWorkers.filter(
    (w) => w.agencyId === agency.id || (w.agencyName && w.agencyName.toLowerCase().includes(agency.name.toLowerCase()))
  );

  // Subscription state checks
  const isSubscriptionActive = agency.subscription.status === "Active" || agency.subscription.status === "Expiring Soon";
  const isExpiringSoon = agency.subscription.status === "Expiring Soon";
  const isExpired = agency.subscription.status === "Expired";
  const isPendingVerification = agency.subscription.status === "Pending Verification";

  // EcoCash Payment form state
  const [paymentForm, setPaymentForm] = useState({
    senderPhone: agency.phone || "+263 772 450 119",
    transactionRef: "",
    notes: "Monthly subscription fee for " + agency.name,
    proofFileName: "EcoCash_Receipt_" + new Date().toISOString().split("T")[0] + ".png",
  });
  const [paymentSubmitSuccess, setPaymentSubmitSuccess] = useState(false);

  // New Worker Form state
  const [workerForm, setWorkerForm] = useState({
    fullName: "",
    role: "Housekeeper" as UserRole,
    city: agency.city,
    suburb: "Borrowdale",
    monthlyRateUSD: 230,
    hourlyRateUSD: 5,
    experienceYears: 4,
    age: 29,
    gender: "Female" as "Female" | "Male" | "Non-Binary",
    availability: "Full-Time" as "Full-Time" | "Part-Time" | "Live-In",
    willingToLiveIn: true,
    willingToLiveOut: true,
    languages: "English, Shona",
    skills: "Deep Cleaning, Laundry & Steam Ironing, Cooking",
    bio: "",
    policeClearanceNo: "ZRP CID Ref # 2026/Agency-Vetted",
    photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
  });

  // New Job Vacancy Form state
  const [jobForm, setJobForm] = useState({
    title: "",
    roleNeeded: "Housekeeper" as UserRole,
    city: agency.city,
    suburb: "Borrowdale",
    offeredSalaryUSD: 250,
    payFrequency: "Monthly" as const,
    workType: "Full-Time" as const,
    description: "",
    requiredSkills: "Punctual, Trustworthy, Experienced",
    urgent: false,
    isFeatured: false,
  });

  // New Staff Member Form state
  const [staffForm, setStaffForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Recruitment Manager" as AgencyStaffMember["role"],
  });

  // Handle Copy EcoCash
  const handleCopyEcoCash = () => {
    navigator.clipboard.writeText("+263785458828");
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  // Submit EcoCash payment
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitAgencySubscriptionPayment(agency.id, {
      senderPhoneNumber: paymentForm.senderPhone,
      transactionReference: paymentForm.transactionRef || `MP${Date.now()}`,
      proofFileName: paymentForm.proofFileName,
      notes: paymentForm.notes,
    });
    setPaymentSubmitSuccess(true);
    setTimeout(() => {
      setShowPaymentProofModal(false);
      setPaymentSubmitSuccess(false);
    }, 1500);
  };

  // Submit New Worker
  const handleAddWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAgencyWorker(agency.id, {
      ...workerForm,
      languages: workerForm.languages.split(",").map((s) => s.trim()),
      skills: workerForm.skills.split(",").map((s) => s.trim()),
    });
    setShowAddWorkerModal(false);
  };

  // Submit New Job Vacancy
  const handleAddJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAgencyJob(agency.id, {
      ...jobForm,
      requiredSkills: jobForm.requiredSkills.split(",").map((s) => s.trim()),
    });
    setShowAddJobModal(false);
  };

  // Submit New Staff
  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAgencyStaff(agency.id, {
      fullName: staffForm.fullName,
      email: staffForm.email,
      phone: staffForm.phone,
      role: staffForm.role,
      status: "Active",
    });
    setShowAddStaffModal(false);
    setStaffForm({ fullName: "", email: "", phone: "", role: "Recruitment Manager" });
  };

  // Filtered Workers list
  const filteredAgencyWorkers = agencyWorkers.filter((w) => {
    const matchesSearch =
      w.fullName.toLowerCase().includes(workerSearch.toLowerCase()) ||
      w.role.toLowerCase().includes(workerSearch.toLowerCase()) ||
      w.city.toLowerCase().includes(workerSearch.toLowerCase());
    const matchesStatus =
      workerStatusFilter === "All"
        ? true
        : workerStatusFilter === "Active"
        ? w.status !== "Archived" && w.status !== "Draft"
        : w.status === workerStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Agency Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center space-x-4">
            <img
              src={agency.logoUrl}
              alt={agency.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400/80 shadow-lg bg-white"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-extrabold uppercase rounded-full">
                  Licensed Agency
                </span>
                {agency.isVerified && (
                  <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase rounded-full flex items-center gap-1 shadow">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Agency
                  </span>
                )}
                <span className="text-xs text-emerald-200/80">
                  {agency.yearsInOperation} Years in Operation
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {agency.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200/80 pt-0.5">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{agency.physicalAddress}, {agency.city}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{agency.phone}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{agency.email}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Subscription Status Pill & Action */}
          <div className="bg-emerald-900/80 backdrop-blur-md border border-emerald-400/30 rounded-2xl p-4 sm:min-w-[260px] flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Monthly Subscription
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                  isSubscriptionActive
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                    : isPendingVerification
                    ? "bg-amber-500/20 text-amber-300 border border-amber-400/40"
                    : "bg-rose-500/20 text-rose-300 border border-rose-400/40"
                }`}
              >
                {agency.subscription.status}
              </span>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-white">$50 USD</span>
                <span className="text-xs text-emerald-300 font-semibold">/ Month</span>
              </div>
              <p className="text-[11px] text-emerald-200/80 mt-0.5">
                {isSubscriptionActive
                  ? `${agency.subscription.daysRemaining} days remaining (Expires: ${agency.subscription.currentPeriodEnd})`
                  : isPendingVerification
                  ? "EcoCash payment submitted. Awaiting Admin review."
                  : "Subscription expired. Renew to activate worker listings."}
              </p>
            </div>

            <button
              onClick={() => setShowPaymentProofModal(true)}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow transition-all flex items-center justify-center space-x-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{isSubscriptionActive ? "Renew / Pay $50 EcoCash" : "Pay & Reactivate Subscription"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Warning / Notice Banners */}
      {isExpired && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 flex items-start space-x-3 text-rose-900">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs space-y-1">
            <h4 className="font-extrabold text-sm text-rose-950">
              Subscription Inactive — Candidate Listings Hidden
            </h4>
            <p>
              Your monthly subscription of $50 USD has expired. While expired, your agency cannot publish new candidate profiles and existing workers are hidden from employer search results.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setShowPaymentProofModal(true)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow transition-all"
              >
                Submit EcoCash Payment & Reactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {isExpiringSoon && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start space-x-3 text-amber-900">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <span className="font-bold">Subscription Expiring in {agency.subscription.daysRemaining} Days:</span>{" "}
            Renew your $50 monthly subscription via EcoCash to avoid service interruption and ensure uninterrupted visibility for your candidates.
          </div>
        </div>
      )}

      {isPendingVerification && (
        <div className="bg-sky-50 border border-sky-300 rounded-2xl p-4 flex items-start space-x-3 text-sky-900">
          <Clock className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <span className="font-bold">EcoCash Payment Verification in Progress:</span>{" "}
            Our administrator team is currently verifying your submitted EcoCash proof of payment. Your subscription will be activated automatically once approved.
          </div>
        </div>
      )}

      {/* Agency Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: "overview", label: "Overview & Analytics", icon: TrendingUp },
          { id: "workers", label: `Workers (${agencyWorkers.length})`, icon: Users },
          { id: "jobs", label: `Vacancies (${agency.activeJobsCount})`, icon: Briefcase },
          { id: "placements", label: `Placements (${agency.placementsCount})`, icon: Award },
          { id: "subscription", label: "Subscription & EcoCash", icon: CreditCard },
          { id: "staff", label: `Team & Staff (${agency.staffMembers.length})`, icon: UserPlus },
          { id: "profile", label: "Agency Profile & Docs", icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center space-x-2 transition-all ${
                isActive
                  ? "bg-emerald-800 text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {/* ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Managed Workers</span>
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-slate-900">{agencyWorkers.length}</div>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Vetted & Vetting In Progress
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Active Vacancies</span>
                <Briefcase className="w-5 h-5 text-teal-600" />
              </div>
              <div className="text-3xl font-black text-slate-900">{agency.activeJobsCount}</div>
              <span className="text-[11px] text-slate-500 mt-1 block">Live on Marketplace</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Placements Made</span>
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-3xl font-black text-slate-900">{agency.placementsCount}</div>
              <span className="text-[11px] text-amber-700 font-semibold mt-1 block">Verified Client Contracts</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Monthly Plan</span>
                <CreditCard className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">$50 USD</div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                Status: {agency.subscription.status}
              </span>
            </div>
          </div>

          {/* Quick Action Center */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-400 mb-4">
              Agency Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setShowAddWorkerModal(true)}
                disabled={!isSubscriptionActive}
                className="p-4 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-2xl text-left transition-all group disabled:opacity-50"
              >
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl w-fit mb-3 group-hover:scale-105 transition-transform">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">Add New Candidate</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Upload vetted domestic worker, police clearance & skills.
                </p>
              </button>

              <button
                onClick={() => setShowWhatsAppImportModal(true)}
                disabled={!isSubscriptionActive}
                className="p-4 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-2xl text-left transition-all group disabled:opacity-50"
              >
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl w-fit mb-3 group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">Import from WhatsApp</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Extract worker data automatically from WhatsApp format.
                </p>
              </button>

              <button
                onClick={() => setShowAddJobModal(true)}
                disabled={!isSubscriptionActive}
                className="p-4 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-2xl text-left transition-all group disabled:opacity-50"
              >
                <div className="p-2 bg-teal-500/20 text-teal-400 rounded-xl w-fit mb-3 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">Post Vacancy</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Advertise live-in/live-out positions for your client families.
                </p>
              </button>

              <button
                onClick={() => setShowPaymentProofModal(true)}
                className="p-4 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-2xl text-left transition-all group"
              >
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl w-fit mb-3 group-hover:scale-105 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">EcoCash Subscription</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Submit monthly $50 proof of payment to Chenjerai.
                </p>
              </button>
            </div>
          </div>

          {/* Recent Candidates List Preview */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Agency Candidate Roster</h3>
                <p className="text-xs text-slate-500">
                  Workers managed and represented exclusively by {agency.name}
                </p>
              </div>
              <button
                onClick={() => setActiveTab("workers")}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
              >
                <span>View Full Roster</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agencyWorkers.slice(0, 3).map((worker) => (
                <div
                  key={worker.id}
                  className="p-4 border border-slate-200 rounded-2xl hover:border-emerald-600 transition-colors flex items-start space-x-3 bg-slate-50/50"
                >
                  <img
                    src={worker.photoUrl || worker.avatarUrl}
                    alt={worker.fullName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{worker.fullName}</h4>
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        ${worker.monthlyRateUSD}/mo
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-semibold">{worker.role}</p>
                    <div className="flex items-center space-x-2 mt-2 text-[10px] text-slate-400">
                      <span>{worker.city}</span>
                      <span>•</span>
                      <span>{worker.experienceYears}y exp</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">Managed by {agency.name.split(" ")[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: WORKER MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === "workers" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  Worker Profiles ({agencyWorkers.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Manage your agency workforce. Published profiles display the &quot;Managed by: {agency.name}&quot; badge to employers.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowWhatsAppImportModal(true)}
                  disabled={!isSubscriptionActive}
                  className="px-3.5 py-2 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Import WhatsApp</span>
                </button>

                <button
                  onClick={() => setShowAddWorkerModal(true)}
                  disabled={!isSubscriptionActive}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1.5 transition-all disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Worker</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={workerSearch}
                  onChange={(e) => setWorkerSearch(e.target.value)}
                  placeholder="Search agency candidates by name, profession, city..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="flex items-center space-x-1.5 self-start sm:self-auto">
                {(["All", "Active", "Draft", "Archived"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setWorkerStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      workerStatusFilter === st
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Workers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAgencyWorkers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={worker.photoUrl || worker.avatarUrl}
                        alt={worker.fullName}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {worker.fullName}
                        </h4>
                        <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-md border border-emerald-200 mt-0.5">
                          {worker.role}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-slate-900">${worker.monthlyRateUSD}</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">USD / mo</span>
                    </div>
                  </div>

                  {/* Managed By Badge */}
                  <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2 mb-3 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-900 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                      Managed by: {agency.name}
                    </span>
                    <span className="text-emerald-700 font-extrabold text-[10px]">VERIFIED</span>
                  </div>

                  {/* Location & Experience */}
                  <div className="text-xs text-slate-600 space-y-1 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Location:</span>
                      <span className="font-semibold text-slate-800">{worker.suburb}, {worker.city}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Experience:</span>
                      <span className="font-semibold text-slate-800">{worker.experienceYears} Years</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Clearance:</span>
                      <span className="font-semibold text-emerald-700 truncate max-w-[150px]">
                        {worker.policeClearanceNo || "Police Cleared"}
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  {worker.skills && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {worker.skills.slice(0, 3).map((sk: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      worker.status === "Archived"
                        ? "bg-slate-100 text-slate-600"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {worker.status || "Active"}
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => archiveAgencyWorker(agency.id, worker.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title={worker.status === "Archived" ? "Unarchive" : "Archive"}
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteAgencyWorker(agency.id, worker.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Candidate"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: JOB POSTINGS & VACANCIES */}
      {/* ========================================================================= */}
      {activeTab === "jobs" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Agency Job Openings</h3>
              <p className="text-xs text-slate-500">
                Advertise vacancies on behalf of your client employers across Zimbabwe.
              </p>
            </div>

            <button
              onClick={() => setShowAddJobModal(true)}
              disabled={!isSubscriptionActive}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1.5 transition-all disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Vacancy</span>
            </button>
          </div>

          <div className="space-y-4">
            {[
              {
                id: "j-ag-01",
                title: "Live-In Nanny for Diplomatic Family (Borrowdale)",
                roleNeeded: "Nanny",
                city: "Harare",
                suburb: "Borrowdale",
                salary: 280,
                workType: "Live-In",
                applicantCount: 8,
                status: "Open",
                postedDate: "2026-08-10",
              },
              {
                id: "j-ag-02",
                title: "Executive Housekeeper & Cook (Mount Pleasant)",
                roleNeeded: "Housekeeper",
                city: "Harare",
                suburb: "Mount Pleasant",
                salary: 250,
                workType: "Full-Time",
                applicantCount: 5,
                status: "Open",
                postedDate: "2026-08-11",
              },
            ].map((job) => (
              <div
                key={job.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded">
                      {job.roleNeeded}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">• {job.workType}</span>
                    <span className="text-xs text-slate-400 font-semibold">• Posted {job.postedDate}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{job.title}</h4>
                  <div className="flex items-center space-x-3 text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{job.suburb}, {job.city}</span>
                    </span>
                    <span>•</span>
                    <span className="font-bold text-emerald-800">${job.salary} USD / Month</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900">{job.applicantCount}</span>
                    <span className="text-[11px] text-slate-400 block font-semibold">Applicants</span>
                  </div>
                  <button
                    onClick={() => closeAgencyJob(agency.id, job.id)}
                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700"
                  >
                    Close Vacancy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PLACEMENTS & CONTRACTS */}
      {/* ========================================================================= */}
      {activeTab === "placements" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Domestic Staff Placements</h3>
              <p className="text-xs text-slate-500">
                Track active client employer contracts, probation periods, and placement history.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="pb-3">Candidate</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Client Employer</th>
                    <th className="pb-3">Agreed Salary</th>
                    <th className="pb-3">Contract Type</th>
                    <th className="pb-3">Placement Date</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    {
                      worker: "Ruvimbo Mupedziswa",
                      role: "Housekeeper",
                      employer: "Dr. Nyasha Tagwirei (Borrowdale)",
                      salary: "$230 USD/mo",
                      type: "Live-In",
                      date: "2026-08-01",
                      status: "Active",
                    },
                    {
                      worker: "Thandeka Khumalo",
                      role: "Nanny",
                      employer: "Mrs. Sarah Jenkins (Mount Pleasant)",
                      salary: "$270 USD/mo",
                      type: "Full-Time",
                      date: "2026-07-20",
                      status: "Active",
                    },
                    {
                      worker: "Kudakwashe Shumba",
                      role: "Chef",
                      employer: "Mr. Farai Mutasa (Highlands)",
                      salary: "$350 USD/mo",
                      type: "Full-Time",
                      date: "2026-07-10",
                      status: "Probation (30 Days)",
                    },
                  ].map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 font-bold text-slate-900">{p.worker}</td>
                      <td className="py-3 text-emerald-800 font-semibold">{p.role}</td>
                      <td className="py-3 text-slate-700">{p.employer}</td>
                      <td className="py-3 font-bold text-slate-900">{p.salary}</td>
                      <td className="py-3 text-slate-600">{p.type}</td>
                      <td className="py-3 text-slate-500">{p.date}</td>
                      <td className="py-3 text-right">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: SUBSCRIPTION & ECOCASH CENTER */}
      {/* ========================================================================= */}
      {activeTab === "subscription" && (
        <div className="space-y-6">
          {/* Subscription Status Card */}
          <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <span className="px-2.5 py-0.5 bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[10px] font-extrabold uppercase rounded-full">
                  Monthly Subscription Plan
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  $50 USD / Month
                </h3>
                <p className="text-xs text-emerald-200/90 mt-1 max-w-md">
                  Grants unlimited worker publishing, Verified Agency badge, priority search ranking, and direct employer inquiries.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-xs space-y-1.5 sm:min-w-[240px]">
                <div className="flex justify-between">
                  <span className="text-emerald-200">Current Status:</span>
                  <span className="font-extrabold text-emerald-300 uppercase">{agency.subscription.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-200">Period Start:</span>
                  <span className="font-bold text-white">{agency.subscription.currentPeriodStart}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-200">Period End:</span>
                  <span className="font-bold text-white">{agency.subscription.currentPeriodEnd}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-200">Grace Period:</span>
                  <span className="font-bold text-amber-300">{agency.subscription.gracePeriodEnd}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Official EcoCash Payment Details Box */}
          <div className="bg-gradient-to-br from-blue-950 to-slate-900 border-2 border-blue-500/60 rounded-3xl p-6 shadow-md space-y-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={PAYMENT_GATEWAY_ASSETS.ecocash}
                  alt="EcoCash"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border border-blue-400/40 shrink-0 shadow-sm"
                />
                <div>
                  <h4 className="text-base font-black text-white flex items-center gap-2">
                    Official EcoCash Payment Gateway
                    <span className="bg-blue-500/30 text-blue-300 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                      Active Rail
                    </span>
                  </h4>
                  <p className="text-xs text-blue-300">
                    Direct monthly subscription settlement & automated verification
                  </p>
                </div>
              </div>
              <span className="text-xs bg-blue-900/80 text-blue-200 border border-blue-600/60 font-bold px-3 py-1 rounded-full">
                $50 USD / Month
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-700">
              <div className="flex items-center space-x-2.5">
                <img
                  src={PAYMENT_GATEWAY_ASSETS.ecocash}
                  alt="EcoCash"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover border border-blue-500/40 shrink-0"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Method</span>
                  <span className="text-sm font-extrabold text-white">EcoCash USD / ZWG</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Recipient Name</span>
                <span className="text-sm font-extrabold text-emerald-400">Chenjerai</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">EcoCash Number</span>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-sm font-black text-amber-300 font-mono">+263 785 458 828</span>
                  <button
                    onClick={handleCopyEcoCash}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
                    title="Copy Number"
                  >
                    {copiedNumber ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-blue-200/90 leading-relaxed">
                Send <strong>$50 USD</strong> via EcoCash to <strong>Chenjerai (+263 785 458 828)</strong>, then submit your transaction reference number and proof of payment below.
              </p>
              <button
                onClick={() => setShowPaymentProofModal(true)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md shrink-0 flex items-center space-x-1.5 transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Submit Proof of Payment</span>
              </button>
            </div>
          </div>

          {/* Automated Reminder Schedule Info Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Automated Subscription Reminder & Grace Schedule
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { title: "7 Days Before", desc: "First renewal notification via WhatsApp & Email." },
                { title: "3 Days Before", desc: "Urgent reminder to prevent candidate delisting." },
                { title: "Expiry Date", desc: "Subscription lapses. 7-day grace period commences." },
                { title: "Grace Cutoff", desc: "Profiles hidden from employer search." },
              ].map((rem, i) => (
                <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl">
                  <span className="text-xs font-extrabold text-emerald-800 block">{rem.title}</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">{rem.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History Ledger */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-slate-900">Payment & Verification History</h4>

            {agency.subscription.paymentHistory.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No past verified payments recorded yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {agency.subscription.paymentHistory.map((rec) => (
                  <div key={rec.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900">${rec.amountUSD} USD</span>
                        <span className="text-[10px] text-slate-400 font-semibold">• EcoCash</span>
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          {rec.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Ref: <span className="font-bold text-slate-700">{rec.transactionReference}</span> • Sender: {rec.senderPhoneNumber}
                      </p>
                      <span className="text-[10px] text-slate-400 block">Submitted: {rec.submittedAt}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-slate-500 font-medium">
                        Verified by: {rec.verifiedBy || "Administrator"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: STAFF & TEAM */}
      {/* ========================================================================= */}
      {activeTab === "staff" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Agency Staff & Recruiters</h3>
              <p className="text-xs text-slate-500">
                Manage recruitment officers, placement managers, and administrative team members.
              </p>
            </div>

            <button
              onClick={() => setShowAddStaffModal(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Staff Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {agency.staffMembers.map((staff) => (
              <div
                key={staff.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded uppercase">
                    {staff.role}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">Joined {staff.joinedDate}</span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-900">{staff.fullName}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{staff.email}</p>
                  <p className="text-xs text-slate-500">{staff.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: AGENCY PROFILE & DOCUMENTS */}
      {/* ========================================================================= */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Company Profile & Verification Documents</h3>
              <p className="text-xs text-slate-500">
                Ensure your business credentials and company registration records remain up to date.
              </p>
            </div>

            {/* Document Compliance List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Uploaded Regulatory Documents
              </h4>
              <div className="space-y-2.5">
                {agency.verificationDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{doc.name}</span>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase">{doc.type}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        doc.isVerified
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {doc.isVerified ? "Verified by Admin" : "Pending Review"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SUBMIT ECOCASH PROOF OF PAYMENT */}
      {/* ========================================================================= */}
      {showPaymentProofModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <img
                  src={PAYMENT_GATEWAY_ASSETS.ecocash}
                  alt="EcoCash"
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-lg object-cover border border-blue-400/40 shrink-0"
                />
                <h3 className="font-black text-slate-900 text-base">Submit EcoCash Monthly Payment</h3>
              </div>
              <button
                onClick={() => setShowPaymentProofModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {paymentSubmitSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-base">Proof of Payment Received!</h4>
                <p className="text-xs text-slate-500">
                  Your $50 monthly subscription is now in <strong>Pending Verification</strong>. Administrator will approve shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="space-y-3.5">
                <div className="bg-gradient-to-r from-blue-950 to-slate-900 border border-blue-500/50 rounded-2xl p-3.5 text-xs text-white space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img
                        src={PAYMENT_GATEWAY_ASSETS.ecocash}
                        alt="EcoCash"
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded object-cover"
                      />
                      <span className="font-bold text-white">Payment Method: EcoCash</span>
                    </div>
                    <span className="font-extrabold text-amber-300 bg-blue-900/80 px-2 py-0.5 rounded border border-blue-700/50">
                      $50 USD / mo
                    </span>
                  </div>
                  <div className="text-blue-200 text-[11px] pt-0.5 border-t border-slate-700">
                    Recipient: <strong className="text-white">Chenjerai (+263 785 458 828)</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sender Phone Number <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={paymentForm.senderPhone}
                    onChange={(e) => setPaymentForm({ ...paymentForm, senderPhone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    EcoCash Transaction Reference Code <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentForm.transactionRef}
                    onChange={(e) => setPaymentForm({ ...paymentForm, transactionRef: e.target.value })}
                    placeholder="e.g. MP260813.1142.H89123"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Attached Receipt Proof
                  </label>
                  <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-between">
                    <span className="text-xs text-slate-700 font-semibold">{paymentForm.proofFileName}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                      Attached
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Notes (Optional)</label>
                  <input
                    type="text"
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPaymentProofModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow"
                  >
                    Submit Proof
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW WORKER */}
      {/* ========================================================================= */}
      {showAddWorkerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-emerald-700" />
                <h3 className="font-black text-slate-900 text-base">Register Agency Candidate</h3>
              </div>
              <button
                onClick={() => setShowAddWorkerModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddWorkerSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Candidate Full Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={workerForm.fullName}
                    onChange={(e) => setWorkerForm({ ...workerForm, fullName: e.target.value })}
                    placeholder="e.g. Memory Mutasa"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Primary Profession <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={workerForm.role}
                    onChange={(e) => setWorkerForm({ ...workerForm, role: e.target.value as UserRole })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    {WORKER_ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={workerForm.city}
                    onChange={(e) => setWorkerForm({ ...workerForm, city: e.target.value as CityLocation })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    {ZIM_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Suburb / Neighborhood
                  </label>
                  <input
                    type="text"
                    value={workerForm.suburb}
                    onChange={(e) => setWorkerForm({ ...workerForm, suburb: e.target.value })}
                    placeholder="e.g. Borrowdale"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Monthly Rate (USD) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={workerForm.monthlyRateUSD}
                    onChange={(e) => setWorkerForm({ ...workerForm, monthlyRateUSD: parseInt(e.target.value) || 200 })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    value={workerForm.experienceYears}
                    onChange={(e) => setWorkerForm({ ...workerForm, experienceYears: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={workerForm.skills}
                    onChange={(e) => setWorkerForm({ ...workerForm, skills: e.target.value })}
                    placeholder="e.g. Deep Cleaning, Laundry & Steam Ironing, Cooking"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Police Clearance / Verification Reference
                  </label>
                  <input
                    type="text"
                    value={workerForm.policeClearanceNo}
                    onChange={(e) => setWorkerForm({ ...workerForm, policeClearanceNo: e.target.value })}
                    placeholder="ZRP CID Clearance Ref # 2026/Agency-Vetted"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddWorkerModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow"
                >
                  Save & Publish Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: POST VACANCY */}
      {/* ========================================================================= */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-emerald-700" />
                <h3 className="font-black text-slate-900 text-base">Post Agency Vacancy</h3>
              </div>
              <button
                onClick={() => setShowAddJobModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddJobSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vacancy Title <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g. Live-In Nanny for Diplomats in Borrowdale"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role Needed</label>
                  <select
                    value={jobForm.roleNeeded}
                    onChange={(e) => setJobForm({ ...jobForm, roleNeeded: e.target.value as UserRole })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    {WORKER_ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Salary (USD)</label>
                  <input
                    type="number"
                    value={jobForm.offeredSalaryUSD}
                    onChange={(e) => setJobForm({ ...jobForm, offeredSalaryUSD: parseInt(e.target.value) || 250 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Describe client duties, schedule, live-in arrangements..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow"
                >
                  Publish Vacancy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD STAFF */}
      {/* ========================================================================= */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-emerald-700" />
                <h3 className="font-black text-slate-900 text-base">Add Staff Member</h3>
              </div>
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={staffForm.fullName}
                  onChange={(e) => setStaffForm({ ...staffForm, fullName: e.target.value })}
                  placeholder="e.g. Tariro Gumbo"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={staffForm.email}
                  onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                  placeholder="tariro@agency.co.zw"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={staffForm.phone}
                  onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                  placeholder="+263 775 882 109"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role & Permissions</label>
                <select
                  value={staffForm.role}
                  onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as any })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="Recruitment Manager">Recruitment Manager (Full Access)</option>
                  <option value="Placement Officer">Placement Officer (Candidate & Job Access)</option>
                  <option value="Staff">Staff (View Only)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Profile Import Modal Integration */}
      <WhatsAppProfileImportModal
        isOpen={showWhatsAppImportModal}
        onClose={() => setShowWhatsAppImportModal(false)}
        onSaveWorker={(importedWorker) => {
          addAgencyWorker(agency.id, {
            ...importedWorker,
            photoUrl: importedWorker.avatarUrl,
            agencyId: agency.id,
            agencyName: agency.name,
            isAgencyManaged: true,
          });
        }}
      />
    </div>
  );
};
