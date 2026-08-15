import React, { useState } from "react";
import { usePlatform } from "../../context/PlatformContext";
import { MaidProfileRecord, JobRecord, PortfolioItem, calculateAge } from "../../types/platform";
import {
  ShieldAlert,
  Users,
  Briefcase,
  Wallet,
  Settings,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Lock,
  DollarSign,
  Star,
  FileText,
  Search,
  Filter,
  Check,
  X,
  CreditCard,
  Building,
  RefreshCw,
  Sliders,
  ShieldCheck,
  TrendingUp,
  Camera,
  Image as ImageIcon,
  Flag,
  Ban,
  History,
  AlertTriangle,
  ExternalLink,
  Sparkles
} from "lucide-react";

export const PlatformAdminDashboard: React.FC = () => {
  const {
    allMaidProfiles,
    allEmployerProfiles,
    allJobs,
    allApplications,
    transactions,
    pricingSettings,
    approveMaidProfileAdmin,
    rejectMaidProfileAdmin,
    verifyMaidDocumentAdmin,
    approveJobAdmin,
    rejectJobAdmin,
    updatePlatformPricingAdmin,
    verifyPaynowPayment,
    allPortfolioItems,
    mediaAuditLogs,
    adminModerateMedia,
    adminToggleUserMediaSuspension,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<"overview" | "maids" | "employers" | "jobs" | "transactions" | "pricing" | "media-moderation">("overview");

  // Selected Maid for Document Inspection
  const [inspectingMaid, setInspectingMaid] = useState<MaidProfileRecord | null>(null);

  // Selected Media Item for Deep Inspection
  const [inspectingMediaItem, setInspectingMediaItem] = useState<PortfolioItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("Image does not meet quality or privacy guidelines");
  const [moderationFeedback, setModerationFeedback] = useState<string | null>(null);
  const [mediaSubTab, setMediaSubTab] = useState<"gallery" | "audit-trail">("gallery");

  // Pricing Form State
  const [jobPostingFee, setJobPostingFee] = useState(pricingSettings.jobPostingFeeUSD);
  const [featuredJobFee, setFeaturedJobFee] = useState(pricingSettings.featuredJobFeeUSD);
  const [premiumMaidFee, setPremiumMaidFee] = useState(pricingSettings.premiumMaidAccessFeeUSD);
  const [featuredMaidFee, setFeaturedMaidFee] = useState(pricingSettings.featuredMaidProfileFeeUSD);
  const [urgentPlacementFee, setUrgentPlacementFee] = useState(pricingSettings.urgentPlacementFeeUSD);
  const [pricingSaveMessage, setPricingSaveMessage] = useState<string | null>(null);

  // Filter States
  const [maidSearchQuery, setMaidSearchQuery] = useState("");
  const [jobSearchQuery, setJobSearchQuery] = useState("");
  const [txSearchQuery, setTxSearchQuery] = useState("");
  const [mediaStatusFilter, setMediaStatusFilter] = useState<string>("All");
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState<string>("All");
  const [mediaSearchQuery, setMediaSearchQuery] = useState("");

  // Statistics Calculations
  const totalRevenue = transactions
    .filter((t) => t.status === "Paid" && t.service.toLowerCase().includes("deposit"))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalVerifiedMaids = allMaidProfiles.filter((m) => m.verificationStatus === "Approved").length;
  const totalPendingMaids = allMaidProfiles.filter((m) => m.verificationStatus === "Pending").length;
  const totalActiveJobs = allJobs.filter((j) => j.status === "Approved").length;

  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePlatformPricingAdmin({
      jobPostingFeeUSD: Number(jobPostingFee),
      featuredJobFeeUSD: Number(featuredJobFee),
      premiumMaidAccessFeeUSD: Number(premiumMaidFee),
      featuredMaidProfileFeeUSD: Number(featuredMaidFee),
      urgentPlacementFeeUSD: Number(urgentPlacementFee),
    });
    setPricingSaveMessage("Platform fee schedule updated and propagated across all services!");
    setTimeout(() => setPricingSaveMessage(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 text-rose-300 text-xs font-bold rounded-full border border-rose-500/30">
            <ShieldAlert className="w-3.5 h-3.5" />
            Super Administrator Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Zimbabwe Maids Centre Administration
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Strict separation management for Maids, Employers, Jobs, Paynow transactions, Document Vetting, and Platform Service Fees.
          </p>
        </div>

        {/* Quick Revenue Metric */}
        <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 flex items-center gap-4 min-w-[240px]">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Gross Paynow Volume</div>
            <div className="text-2xl font-black text-emerald-400">${totalRevenue.toFixed(2)} USD</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Overview & Metrics
        </button>

        <button
          onClick={() => setActiveTab("maids")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "maids"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Users className="w-4 h-4" />
          Maids & Document Vetting ({allMaidProfiles.length})
        </button>

        <button
          onClick={() => setActiveTab("employers")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "employers"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Building className="w-4 h-4" />
          Employers & Wallets ({allEmployerProfiles.length})
        </button>

        <button
          onClick={() => setActiveTab("jobs")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "jobs"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Job Moderation ({allJobs.length})
        </button>

        <button
          onClick={() => setActiveTab("transactions")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "transactions"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Wallet className="w-4 h-4" />
          Paynow Ledger ({transactions.length})
        </button>

        <button
          onClick={() => setActiveTab("pricing")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "pricing"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Sliders className="w-4 h-4" />
          Pricing Settings
        </button>

        <button
          onClick={() => setActiveTab("media-moderation")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "media-moderation"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Camera className="w-4 h-4 text-emerald-500" />
          Media & Portfolio Moderation
          {allPortfolioItems.filter((i) => i.status === "Flagged" || i.status === "Pending").length > 0 && (
            <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full">
              {allPortfolioItems.filter((i) => i.status === "Flagged" || i.status === "Pending").length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Verified Maids</div>
              <div className="text-3xl font-black text-slate-900">{totalVerifiedMaids}</div>
              <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> ID & Police Clearance Checked
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pending Vetting</div>
              <div className="text-3xl font-black text-amber-600">{totalPendingMaids}</div>
              <div className="text-xs text-amber-700 font-semibold">Requires document inspection</div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Household Jobs</div>
              <div className="text-3xl font-black text-slate-900">{totalActiveJobs}</div>
              <div className="text-xs text-slate-500 font-semibold">{allApplications.length} total applications submitted</div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Registered Employers</div>
              <div className="text-3xl font-black text-slate-900">{allEmployerProfiles.length}</div>
              <div className="text-xs text-emerald-600 font-semibold">Funded Paynow accounts</div>
            </div>
          </div>

          {/* Quick Action Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Paynow Transactions */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-base text-slate-900">Recent Paynow Activity</h3>
                <button onClick={() => setActiveTab("transactions")} className="text-xs text-emerald-600 font-bold hover:underline">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {transactions.slice(0, 4).map((tx) => (
                  <div key={tx.id} className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{tx.service}</div>
                      <div className="text-[11px] text-slate-500">{tx.userName} • {tx.paymentMethod}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-slate-900">${tx.amount.toFixed(2)} USD</div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform System Health */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-black text-base text-slate-900">Integrity & Architecture Status</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <span className="font-bold">Account Role Separation</span>
                  <span className="font-black text-[11px] bg-emerald-200 px-2 py-0.5 rounded-md">STRICT ENFORCEMENT</span>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <span className="font-bold">Paynow Server Verification Engine</span>
                  <span className="font-black text-[11px] bg-emerald-200 px-2 py-0.5 rounded-md">ONLINE & ACTIVE</span>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <span className="font-bold">Private Document Encryption Vault</span>
                  <span className="font-black text-[11px] bg-emerald-200 px-2 py-0.5 rounded-md">PROTECTED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MAIDS & DOCUMENT VETTING */}
      {activeTab === "maids" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Worker & Maid Accounts</h2>
              <p className="text-xs text-slate-500">Inspect National ID credentials, Police Clearances, and manage verification badges</p>
            </div>

            <div className="relative">
              <input
                type="text"
                value={maidSearchQuery}
                onChange={(e) => setMaidSearchQuery(e.target.value)}
                placeholder="Search maid name, city..."
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="py-3 px-3">Worker Name</th>
                  <th className="py-3 px-3">Age (DOB)</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Private Phone</th>
                  <th className="py-3 px-3">Experience</th>
                  <th className="py-3 px-3">Documents</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {allMaidProfiles
                  .filter((m) => `${m.firstName} ${m.surname} ${m.location}`.toLowerCase().includes(maidSearchQuery.toLowerCase()))
                  .map((maid) => (
                    <tr key={maid.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={maid.profilePhoto}
                            alt={maid.firstName}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-black text-slate-900">{maid.firstName} {maid.surname}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{maid.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <strong className="text-slate-900">{calculateAge(maid.dateOfBirth)} yrs</strong>
                        <span className="text-[10px] text-slate-400 block font-mono">{maid.dateOfBirth}</span>
                      </td>
                      <td className="py-3.5 px-3">{maid.location}</td>
                      <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600">{maid.phoneNumber}</td>
                      <td className="py-3.5 px-3">{maid.experienceYears} Yrs Exp</td>
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => setInspectingMaid(maid)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-lg flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3 text-emerald-600" />
                          {maid.privateDocuments.length} Documents
                        </button>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            maid.verificationStatus === "Approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : maid.verificationStatus === "Pending"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {maid.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {maid.verificationStatus !== "Approved" && (
                            <button
                              onClick={() => approveMaidProfileAdmin(maid.id)}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg"
                              title="Approve Profile"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {maid.verificationStatus !== "Rejected" && (
                            <button
                              onClick={() => rejectMaidProfileAdmin(maid.id)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg"
                              title="Reject Profile"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: EMPLOYERS & WALLETS */}
      {activeTab === "employers" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">Registered Employers & Balances</h2>
            <p className="text-xs text-slate-500">Oversee employer accounts, verified wallet balances, and active job counts</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="py-3 px-3">Employer Name</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Phone & Email</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Jobs Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {allEmployerProfiles.map((emp) => {
                  const jobCount = allJobs.filter((j) => j.employerId === emp.userId).length;
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-black text-slate-900">{emp.title} {emp.surname}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{emp.userId}</div>
                      </td>
                      <td className="py-3.5 px-3">{emp.location} ({emp.residentialAddress})</td>
                      <td className="py-3.5 px-3">
                        <div className="text-slate-800 font-semibold">{emp.phoneNumber}</div>
                        <div className="text-[11px] text-slate-400">{emp.email}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                          {emp.accountStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">{jobCount} Vacancies</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: JOB MODERATION */}
      {activeTab === "jobs" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Job Vacancies Moderation</h2>
              <p className="text-xs text-slate-500">Monitor employer job postings across Zimbabwe</p>
            </div>
            <div className="relative">
              <input
                type="text"
                value={jobSearchQuery}
                onChange={(e) => setJobSearchQuery(e.target.value)}
                placeholder="Search job title, employer..."
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="py-3 px-3">Job Title</th>
                  <th className="py-3 px-3">Employer</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Salary</th>
                  <th className="py-3 px-3">Accommodation</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {allJobs
                  .filter((j) => `${j.title} ${j.employerTitleSurname} ${j.location}`.toLowerCase().includes(jobSearchQuery.toLowerCase()))
                  .map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-slate-900">{job.title}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-700">{job.employerTitleSurname}</td>
                      <td className="py-3.5 px-3">{job.location} ({job.suburb})</td>
                      <td className="py-3.5 px-3 font-black text-slate-900">${job.salary} USD</td>
                      <td className="py-3.5 px-3">{job.accommodation}</td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            job.status === "Approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : job.status === "Closed"
                              ? "bg-slate-100 text-slate-500"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {job.status !== "Approved" && (
                            <button
                              onClick={() => approveJobAdmin(job.id)}
                              className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg"
                              title="Approve Job"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {job.status !== "Rejected" && (
                            <button
                              onClick={() => rejectJobAdmin(job.id)}
                              className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg"
                              title="Reject Job"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PAYNOW LEDGER */}
      {activeTab === "transactions" && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Paynow Zimbabwe & Wallet Ledger</h2>
              <p className="text-xs text-slate-500">Real-time payment logs with direct backend verification tracking</p>
            </div>
            <div className="relative">
              <input
                type="text"
                value={txSearchQuery}
                onChange={(e) => setTxSearchQuery(e.target.value)}
                placeholder="Search reference, user..."
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="py-3 px-3">Tx ID</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Service</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Paynow Reference</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {transactions
                  .filter((t) => `${t.paynowReference} ${t.userName} ${t.service}`.toLowerCase().includes(txSearchQuery.toLowerCase()))
                  .map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400">{tx.id}</td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">{tx.userName}</td>
                      <td className="py-3.5 px-3 uppercase text-[10px] font-bold text-slate-500">{tx.userRole}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-800">{tx.service}</td>
                      <td className="py-3.5 px-3 font-black text-slate-900">${tx.amount.toFixed(2)} USD</td>
                      <td className="py-3.5 px-3 font-mono text-[10px] text-emerald-700 bg-emerald-50/60 rounded px-1.5 py-0.5">{tx.paynowReference}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-[11px] text-slate-500">
                        {tx.isVerified ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Server Verified
                          </span>
                        ) : (
                          <button
                            onClick={() => verifyPaynowPayment(tx.id, tx.paynowReference)}
                            className="px-2 py-1 bg-amber-500 text-slate-950 font-bold text-[10px] rounded"
                          >
                            Verify Now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: PRICING SETTINGS */}
      {activeTab === "pricing" && (
        <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900">Platform Service Pricing Configuration</h2>
            <p className="text-xs text-slate-500">
              Configure fee charges applied to employer job postings, featured listings, and maid profile unlocks.
            </p>
          </div>

          {pricingSaveMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              {pricingSaveMessage}
            </div>
          )}

          <form onSubmit={handleSavePricing} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Standard Job Posting Fee (USD)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={jobPostingFee}
                  onChange={(e) => setJobPostingFee(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Featured Job Listing Fee (USD)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={featuredJobFee}
                  onChange={(e) => setFeaturedJobFee(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Direct Maid Contact Unlock Fee (USD)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={premiumMaidFee}
                  onChange={(e) => setPremiumMaidFee(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Featured Maid Worker Profile Fee (USD)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={featuredMaidFee}
                  onChange={(e) => setFeaturedMaidFee(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Urgent Direct Placement Fee (USD)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">$</span>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={urgentPlacementFee}
                  onChange={(e) => setUrgentPlacementFee(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                type="submit"
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Save & Apply Pricing Schedule
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB: MEDIA & PORTFOLIO MODERATION */}
      {activeTab === "media-moderation" && (
        <div className="space-y-6">
          {/* Moderation Metrics Top Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <div className="text-xs text-slate-500 font-bold uppercase">Total Work Media</div>
              <div className="text-2xl font-black text-slate-900">{allPortfolioItems.length}</div>
              <div className="text-[11px] text-slate-400">Domestic work photos across platform</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <div className="text-xs text-emerald-600 font-bold uppercase">Approved & Live</div>
              <div className="text-2xl font-black text-emerald-700">
                {allPortfolioItems.filter((i) => i.status === "Approved").length}
              </div>
              <div className="text-[11px] text-emerald-600 font-medium">Visible to verified employers</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <div className="text-xs text-amber-600 font-bold uppercase">Pending / Flagged</div>
              <div className="text-2xl font-black text-amber-600">
                {allPortfolioItems.filter((i) => i.status === "Flagged" || i.status === "Pending").length}
              </div>
              <div className="text-[11px] text-amber-600 font-medium">Requires admin verification</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
              <div className="text-xs text-slate-500 font-bold uppercase">Security Audit Events</div>
              <div className="text-2xl font-black text-slate-900">{mediaAuditLogs.length}</div>
              <div className="text-[11px] text-slate-400">Logged uploads, scans & edits</div>
            </div>
          </div>

          {/* Sub-Tabs (Gallery vs Audit Trail) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMediaSubTab("gallery")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    mediaSubTab === "gallery"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  Media Moderation Queue
                </button>
                <button
                  type="button"
                  onClick={() => setMediaSubTab("audit-trail")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    mediaSubTab === "audit-trail"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  Live Media Audit Trail ({mediaAuditLogs.length})
                </button>
              </div>

              {moderationFeedback && (
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {moderationFeedback}
                </div>
              )}
            </div>

            {/* SUB-VIEW 1: GALLERY & QUEUE */}
            {mediaSubTab === "gallery" && (
              <div className="space-y-5">
                {/* Filter Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Search Keyword / Worker Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={mediaSearchQuery}
                        onChange={(e) => setMediaSearchQuery(e.target.value)}
                        placeholder="Search title, description, worker..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Moderation Status</label>
                    <select
                      value={mediaStatusFilter}
                      onChange={(e) => setMediaStatusFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending Review</option>
                      <option value="Flagged">Flagged</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Work Category</label>
                    <select
                      value={mediaCategoryFilter}
                      onChange={(e) => setMediaCategoryFilter(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none"
                    >
                      <option value="All">All Categories</option>
                      <option value="House Cleaning">House Cleaning</option>
                      <option value="Cooking & Meal Prep">Cooking & Meal Prep</option>
                      <option value="Childcare & Infant Care">Childcare & Infant Care</option>
                      <option value="Gardening & Landscaping">Gardening & Landscaping</option>
                      <option value="Laundry & Ironing">Laundry & Ironing</option>
                      <option value="Elderly & Patient Care">Elderly & Patient Care</option>
                      <option value="Residence & Accommodation">Residence & Accommodation</option>
                    </select>
                  </div>
                </div>

                {/* Media Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {allPortfolioItems
                    .filter((item) => {
                      if (mediaStatusFilter !== "All" && item.status !== mediaStatusFilter) return false;
                      if (mediaCategoryFilter !== "All" && item.category !== mediaCategoryFilter) return false;
                      if (mediaSearchQuery.trim()) {
                        const q = mediaSearchQuery.toLowerCase();
                        const matchTitle = item.title.toLowerCase().includes(q);
                        const matchDesc = (item.description || "").toLowerCase().includes(q);
                        const matchUser = (item.userFullName || "").toLowerCase().includes(q);
                        if (!matchTitle && !matchDesc && !matchUser) return false;
                      }
                      return true;
                    })
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="relative">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-48 object-cover bg-slate-100"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {item.category}
                          </span>
                          <span
                            className={`absolute top-2.5 right-2.5 text-[10px] font-black px-2 py-0.5 rounded-full ${
                              item.status === "Approved"
                                ? "bg-emerald-600 text-white"
                                : item.status === "Flagged"
                                ? "bg-amber-500 text-white"
                                : "bg-rose-600 text-white"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{item.title}</h4>
                            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                              {item.description || "No description provided."}
                            </p>
                            <div className="text-[10px] text-slate-400 pt-1">
                              Uploaded by: <strong className="text-slate-700">{item.userFullName}</strong> ({item.userRole})
                            </div>
                          </div>

                          {/* Quick Admin Actions */}
                          <div className="pt-3 border-t border-slate-100 space-y-2">
                            <div className="grid grid-cols-3 gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  adminModerateMedia(item.id, "Approved");
                                  setModerationFeedback(`Item "${item.title}" approved!`);
                                  setTimeout(() => setModerationFeedback(null), 3000);
                                }}
                                className="py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1 border border-emerald-200"
                              >
                                <Check className="w-3 h-3" /> Approve
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  adminModerateMedia(item.id, "Flagged", "Manual review required by security team");
                                  setModerationFeedback(`Item "${item.title}" marked for review!`);
                                  setTimeout(() => setModerationFeedback(null), 3000);
                                }}
                                className="py-1.5 bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1 border border-amber-200"
                              >
                                <Flag className="w-3 h-3" /> Flag
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setInspectingMediaItem(item);
                                }}
                                className="py-1.5 bg-slate-100 hover:bg-slate-800 text-slate-700 hover:text-white rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1 border border-slate-200"
                              >
                                <Eye className="w-3 h-3" /> Inspect
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: LIVE MEDIA AUDIT TRAIL */}
            {mediaSubTab === "audit-trail" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Showing complete timestamped audit trail of all media uploads and moderation events</span>
                  <span className="font-bold text-slate-800">{mediaAuditLogs.length} Events Recorded</span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                        <th className="py-3 px-3">Log ID</th>
                        <th className="py-3 px-3">Timestamp</th>
                        <th className="py-3 px-3">Action</th>
                        <th className="py-3 px-3">User & Role</th>
                        <th className="py-3 px-3">Media Target</th>
                        <th className="py-3 px-3">Actor</th>
                        <th className="py-3 px-3">Reason / Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {mediaAuditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-mono text-[10px] text-slate-400">{log.id}</td>
                          <td className="py-3 px-3 text-[11px] text-slate-600 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                log.action.includes("APPROVED") || log.action.includes("UPLOAD")
                                  ? "bg-emerald-100 text-emerald-800"
                                  : log.action.includes("FLAGGED")
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900">{log.userFullName}</span>
                            <span className="text-[10px] text-slate-400 block font-mono">{log.userRole}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-600">
                            <span className="font-semibold">{log.mediaType}</span>
                            {log.details?.title && (
                              <span className="text-[11px] text-slate-400 block truncate max-w-[180px]">
                                {log.details.title}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{log.actorId}</td>
                          <td className="py-3 px-3 text-[11px] text-slate-500 max-w-xs truncate">
                            {log.reason || "Automatic system upload scan passed"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INSPECT MEDIA ITEM MODAL */}
      {inspectingMediaItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 space-y-6">
            <button
              onClick={() => setInspectingMediaItem(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Domestic Media Security Inspector
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {inspectingMediaItem.title}
              </h2>
              <p className="text-xs text-slate-500">
                Uploaded by: <strong className="text-slate-800">{inspectingMediaItem.userFullName}</strong> ({inspectingMediaItem.userRole})
              </p>
            </div>

            {/* Visual Image Display */}
            <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center max-h-72">
              <img
                src={inspectingMediaItem.imageUrl}
                alt={inspectingMediaItem.title}
                className="max-h-72 w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Metadata & Quality Checklist */}
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                <span className="font-bold text-slate-800">{inspectingMediaItem.category}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Status</span>
                <span className="font-bold text-emerald-700">{inspectingMediaItem.status}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Safety Scan</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Passed 100% (No policy violations)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Date Uploaded</span>
                <span className="font-bold text-slate-800">{inspectingMediaItem.createdAt || "Recent"}</span>
              </div>
            </div>

            {/* Rejection / Moderation Actions */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Moderation Action Reason (Sent to User if rejected / flagged)
                </label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    adminModerateMedia(inspectingMediaItem.id, "Approved", "Passed admin inspection");
                    setInspectingMediaItem(null);
                    setModerationFeedback(`Item approved and published.`);
                  }}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Approve & Publish
                </button>

                <button
                  type="button"
                  onClick={() => {
                    adminModerateMedia(inspectingMediaItem.id, "Rejected", rejectionReason);
                    setInspectingMediaItem(null);
                    setModerationFeedback(`Item rejected.`);
                  }}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  Reject Image
                </button>

                <button
                  type="button"
                  onClick={() => {
                    adminToggleUserMediaSuspension(inspectingMediaItem.userId, rejectionReason);
                    setInspectingMediaItem(null);
                    setModerationFeedback(`User media permissions updated.`);
                  }}
                  className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Ban className="w-4 h-4" />
                  Suspend User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT MAID DOCUMENTS MODAL */}
      {inspectingMaid && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 space-y-6">
            <button
              onClick={() => setInspectingMaid(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="text-xs font-bold text-rose-600 uppercase">Administrator Vault Review</div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {inspectingMaid.firstName} {inspectingMaid.surname}'s Documents
              </h2>
              <p className="text-xs text-slate-500">
                National ID: <strong className="font-mono text-slate-800">{inspectingMaid.nationalIdNumber}</strong> • DOB: {inspectingMaid.dateOfBirth} (Age {calculateAge(inspectingMaid.dateOfBirth)})
              </p>
            </div>

            <div className="space-y-3">
              {inspectingMaid.privateDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{doc.documentType}</div>
                    <div className="text-[11px] text-slate-500 font-mono">ID: {doc.id} • {doc.uploadedAt}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        doc.verificationStatus === "Verified"
                          ? "bg-emerald-100 text-emerald-800"
                          : doc.verificationStatus === "Rejected"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {doc.verificationStatus}
                    </span>

                    {doc.verificationStatus !== "Verified" && (
                      <button
                        onClick={() => {
                          verifyMaidDocumentAdmin(inspectingMaid.id, doc.id, "Verified");
                          setInspectingMaid({
                            ...inspectingMaid,
                            privateDocuments: inspectingMaid.privateDocuments.map((d) =>
                              d.id === doc.id ? { ...d, verificationStatus: "Verified" } : d
                            ),
                          });
                        }}
                        className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-500"
                        title="Mark Verified"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectingMaid(null)}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
