import React, { useState, useEffect } from "react";
import { usePlatform } from "../../context/PlatformContext";
import { PublicMaidProfile, JobRecord, calculateAge } from "../../types/platform";
import { ALL_ZIMBABWE_CITIES, getSuburbsForCity } from "../../data/zimbabweLocations";
import { MediaUploadComponent } from "../media/MediaUploadComponent";
import { ImageLightboxModal, LightboxImageItem } from "../common/ImageLightboxModal";
import {
  Wallet,
  PlusCircle,
  Search,
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  MapPin,
  DollarSign,
  Lock,
  Unlock,
  Phone,
  MessageSquare,
  Mail,
  ShieldCheck,
  AlertCircle,
  Filter,
  Sparkles,
  Calendar,
  Eye,
  FileText,
  Star,
  Check,
  X,
  ArrowLeft,
  CreditCard,
  Building,
  Home,
  UserCheck,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  Camera,
  Image as ImageIcon
} from "lucide-react";

export const EmployerDashboard: React.FC = () => {
  const {
    currentUser,
    currentEmployerProfile,
    currentWallet,
    transactions,
    publicMaids,
    employerJobs,
    employerApplications,
    createJobPosting,
    closeJobPosting,
    featureJobPosting,
    unlockMaidContact,
    subscribeEmployer,
    updateApplicationStatus,
    createPaynowDeposit,
    verifyPaynowPayment,
    pricingSettings,
    getProfileCompletion,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<"search-maids" | "my-jobs" | "post-job" | "applications" | "wallet" | "profile-media">("search-maids");

  // Maid Search Filters
  const [searchLocation, setSearchLocation] = useState<string>("All");
  const [searchMinAge, setSearchMinAge] = useState<number>(18);
  const [searchMaxAge, setSearchMaxAge] = useState<number>(60);
  const [searchMaxChildren, setSearchMaxChildren] = useState<string>("All");
  const [searchMinExp, setSearchMinExp] = useState<number>(0);
  const [searchSkill, setSearchSkill] = useState<string>("All");
  const [searchMaxSalary, setSearchMaxSalary] = useState<number>(500);
  const [searchAccommodation, setSearchAccommodation] = useState<string>("All");
  const [searchAvailability, setSearchAvailability] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Selected Maid for Profile View / Unlock Modal
  const [selectedMaid, setSelectedMaid] = useState<PublicMaidProfile | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockMessage, setUnlockMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Lightbox for Maid and Candidate Photos
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<LightboxImageItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Add Funds Modal State (Paynow Integration)
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(50);
  const [paymentMethod, setPaymentMethod] = useState<string>("EcoCash");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paynowCheckoutState, setPaynowCheckoutState] = useState<{
    transactionId: string;
    paynowReference: string;
    pollUrl: string;
    checkoutUrl: string;
  } | null>(null);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);

  // Browser Back Button & Escape key support for Maid Profile & Add Funds Modals
  useEffect(() => {
    if (!selectedMaid && !isAddFundsOpen) return;

    const stateObj = {
      employerModalOpen: true,
      selectedMaidId: selectedMaid?.id,
      isAddFundsOpen,
    };
    window.history.pushState(stateObj, "");

    const handlePopState = () => {
      if (isLightboxOpen) {
        setIsLightboxOpen(false);
      } else if (selectedMaid) {
        setSelectedMaid(null);
      } else if (isAddFundsOpen) {
        setIsAddFundsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else if (selectedMaid) {
          setSelectedMaid(null);
        } else if (isAddFundsOpen) {
          setIsAddFundsOpen(false);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMaid, isAddFundsOpen, isLightboxOpen]);

  const openMaidLightbox = (images: LightboxImageItem[], index = 0) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // Job Creation Form State
  const [jobTitle, setJobTitle] = useState("House Maid & Live-in Nanny");
  const [jobDescription, setJobDescription] = useState("");
  const [jobSalary, setJobSalary] = useState<number>(280);
  const [jobSalaryPeriod, setJobSalaryPeriod] = useState<"monthly" | "weekly">("monthly");
  const [jobLocation, setJobLocation] = useState<string>("Harare");
  const [jobSuburb, setJobSuburb] = useState<string>("Borrowdale");
  const [jobDaysOff, setJobDaysOff] = useState<any>("Sunday Off");
  const [jobWorkingHours, setJobWorkingHours] = useState("07:00 - 17:00");
  const [jobAccommodation, setJobAccommodation] = useState<"Live-in" | "Live-out">("Live-in");
  const [jobMinExp, setJobMinExp] = useState<number>(2);
  const [jobSkills, setJobSkills] = useState<string[]>(["Childcare", "Cooking", "Steam Ironing"]);
  const [jobNotes, setJobNotes] = useState("");
  const [jobMakeFeatured, setJobMakeFeatured] = useState<boolean>(false);
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);
  const [jobFormError, setJobFormError] = useState<string | null>(null);
  const [jobSuccessBanner, setJobSuccessBanner] = useState<string | null>(null);

  // Available skills list
  const ALL_SKILLS = [
    "Childcare",
    "Toddler Care",
    "Elderly Care",
    "Cooking",
    "Baking",
    "Laundry & Steam Ironing",
    "Deep Cleaning",
    "First Aid",
    "Pet Care",
    "Gardening",
    "Housekeeping",
  ];

  // Filtered Maids
  const filteredMaids = publicMaids.filter((maid) => {
    if (searchLocation !== "All" && !maid.location.toLowerCase().includes(searchLocation.toLowerCase())) return false;
    if (maid.age < searchMinAge || maid.age > searchMaxAge) return false;
    if (searchMaxChildren !== "All") {
      const maxC = parseInt(searchMaxChildren);
      if (maid.numberOfChildren > maxC) return false;
    }
    if (maid.experienceYears < searchMinExp) return false;
    if (searchSkill !== "All" && !maid.skills.some((s) => s.toLowerCase().includes(searchSkill.toLowerCase()))) return false;
    if (maid.expectedSalary > searchMaxSalary) return false;
    if (searchAccommodation === "Live-in" && !maid.willingToLiveIn) return false;
    if (searchAccommodation === "Live-out" && !maid.willingToLiveOut) return false;
    if (searchAvailability !== "All" && !maid.availability.toLowerCase().includes(searchAvailability.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = maid.fullName.toLowerCase().includes(q);
      const matchSkill = maid.skills.some((s) => s.toLowerCase().includes(q));
      const matchBio = maid.shortAboutMe.toLowerCase().includes(q);
      if (!matchName && !matchSkill && !matchBio) return false;
    }
    return true;
  });

  // Handle Paynow Add Funds Submit
  const handleInitiateDeposit = async () => {
    if (depositAmount <= 0) return;
    setIsProcessingPayment(true);
    try {
      const res = await createPaynowDeposit(depositAmount, paymentMethod);
      setPaynowCheckoutState(res);
      if (res.checkoutUrl) {
        try {
          window.location.href = res.checkoutUrl;
        } catch (e) {
          console.warn("Same-window redirect notice:", e);
        }
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle Server Verification of Paynow
  const handleVerifyDeposit = async () => {
    if (!paynowCheckoutState) return;
    setIsProcessingPayment(true);
    try {
      const res = await verifyPaynowPayment(
        paynowCheckoutState.transactionId,
        paynowCheckoutState.paynowReference
      );
      if (res.verified) {
        setPaymentSuccessMessage(`Payment of $${depositAmount}.00 USD verified! Available balance is now $${res.balance.toFixed(2)} USD.`);
        setPaynowCheckoutState(null);
        setTimeout(() => {
          setIsAddFundsOpen(false);
          setPaymentSuccessMessage(null);
        }, 2000);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle Maid Contact Unlock
  const handleUnlockContact = async (maidId: string) => {
    setIsUnlocking(true);
    setUnlockMessage(null);
    const res = await unlockMaidContact(maidId);
    setIsUnlocking(false);
    if (res.success) {
      setUnlockMessage({
        type: "success",
        text: "Contact details and verified document records successfully unlocked!",
      });
      // refresh selected maid
      const updated = publicMaids.find((m) => m.id === maidId);
      if (updated) setSelectedMaid(updated);
    } else {
      setUnlockMessage({
        type: "error",
        text: res.error || "Failed to unlock contact. Please check your wallet balance.",
      });
    }
  };

  // Handle Employer Monthly Subscription
  const handleSubscribeEmployer = async () => {
    setIsSubscribing(true);
    setSubscriptionMessage(null);
    const res = await subscribeEmployer("Monthly Unlimited", 1);
    setIsSubscribing(false);
    if (res.success) {
      setSubscriptionMessage({
        type: "success",
        text: "Employer Subscription Activated! You now have unlimited access to direct phone, WhatsApp, and documents for all domestic workers.",
      });
      setTimeout(() => setSubscriptionMessage(null), 5000);
    } else {
      setSubscriptionMessage({
        type: "error",
        text: res.error || "Failed to activate subscription. Please add funds to your wallet via Paynow.",
      });
    }
  };

  // Handle Job Post Submit
  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobDescription.trim()) {
      setJobFormError("Please fill in Job Title and Description.");
      return;
    }
    setJobFormError(null);
    setIsSubmittingJob(true);

    const res = await createJobPosting({
      title: jobTitle,
      description: jobDescription,
      salary: jobSalary,
      salaryPeriod: jobSalaryPeriod,
      location: jobLocation,
      suburb: jobSuburb,
      daysOff: jobDaysOff,
      workingHours: jobWorkingHours,
      accommodation: jobAccommodation,
      requirements: {
        experienceYears: jobMinExp,
        skills: jobSkills,
        otherNotes: jobNotes,
      },
      status: "Approved",
      isFeatured: jobMakeFeatured,
      makeFeatured: jobMakeFeatured,
    });

    setIsSubmittingJob(false);

    if (res.success) {
      setJobSuccessBanner(`Job '${jobTitle}' posted successfully and is now active for workers to apply!`);
      setActiveTab("my-jobs");
      // Reset form
      setJobDescription("");
      setJobNotes("");
    } else {
      setJobFormError(res.error || "Failed to create job posting.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
            <Building className="w-3.5 h-3.5" />
            Employer / Client Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome, {currentEmployerProfile ? `${currentEmployerProfile.title} ${currentEmployerProfile.surname}` : currentUser.name}
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Search vetted domestic workers, create jobs, review applications, and manage your hiring wallet with verified Paynow integration.
          </p>
        </div>

        {/* Wallet Balance Display */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-[280px]">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <Wallet className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Employer Wallet Balance
            </div>
            <div className="text-2xl font-black text-white flex items-baseline gap-1">
              <span>${currentWallet.balance.toFixed(2)}</span>
              <span className="text-xs text-emerald-400 font-bold">USD</span>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAddFundsOpen(true);
              setPaynowCheckoutState(null);
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Add Funds
          </button>
        </div>
      </div>

      {/* Subscription Status & Activation Banner */}
      <div
        className={`p-5 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm transition-all ${
          currentEmployerProfile?.isSubscribed
            ? "bg-emerald-50/90 border-emerald-200 text-emerald-950"
            : "bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 border-amber-200 text-slate-900"
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`p-3 rounded-2xl flex-shrink-0 ${
              currentEmployerProfile?.isSubscribed ? "bg-emerald-600 text-white" : "bg-amber-600 text-white"
            }`}
          >
            {currentEmployerProfile?.isSubscribed ? <ShieldCheck className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm tracking-tight">
                {currentEmployerProfile?.isSubscribed
                  ? "Unlimited Employer Subscription Active"
                  : "Employer Subscription: Unlimited Domestic Worker Contact Access"}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  currentEmployerProfile?.isSubscribed
                    ? "bg-emerald-200/70 text-emerald-900"
                    : "bg-amber-200/80 text-amber-950"
                }`}
              >
                {currentEmployerProfile?.isSubscribed ? "Subscribed Member" : `Plan: $${pricingSettings.employerSubscriptionUSD || 25}.00 USD/mo`}
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              {currentEmployerProfile?.isSubscribed
                ? `Your subscription is active (Plan: ${currentEmployerProfile.subscriptionPlan || "Monthly Unlimited"}${
                    currentEmployerProfile.subscriptionExpiryDate ? ` • Valid until ${currentEmployerProfile.subscriptionExpiryDate}` : ""
                  }). You have unlocked full phone numbers, WhatsApp lines, and verified background documents for all domestic workers.`
                : "Only subscribed employers can directly call and WhatsApp domestic workers across Zimbabwe. Subscribe for unlimited monthly access or unlock individual candidates from your wallet balance."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {!currentEmployerProfile?.isSubscribed ? (
            <button
              onClick={handleSubscribeEmployer}
              disabled={isSubscribing}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              <CreditCard className="w-4 h-4" />
              {isSubscribing ? "Subscribing..." : `Subscribe Now ($${pricingSettings.employerSubscriptionUSD || 25}.00 USD)`}
            </button>
          ) : (
            <div className="px-4 py-2 bg-emerald-100/80 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              All Contacts Unlocked
            </div>
          )}
        </div>
      </div>

      {subscriptionMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
            subscriptionMessage.type === "success"
              ? "bg-emerald-100 border border-emerald-300 text-emerald-900"
              : "bg-rose-100 border border-rose-300 text-rose-900"
          }`}
        >
          {subscriptionMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          {subscriptionMessage.text}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab("search-maids")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "search-maids"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Search className="w-4 h-4" />
          Search Maids ({publicMaids.length})
        </button>

        <button
          onClick={() => setActiveTab("my-jobs")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "my-jobs"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          My Posted Jobs ({employerJobs.length})
        </button>

        <button
          onClick={() => setActiveTab("post-job")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "post-job"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          Post a New Job
        </button>

        <button
          onClick={() => setActiveTab("applications")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "applications"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Users className="w-4 h-4" />
          Applications Received ({employerApplications.length})
        </button>

        <button
          onClick={() => setActiveTab("wallet")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "wallet"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Wallet className="w-4 h-4" />
          Wallet & Paynow History
        </button>

        <button
          onClick={() => setActiveTab("profile-media")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "profile-media"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Camera className="w-4 h-4 text-emerald-500" />
          Profile & Residence Photos
        </button>
      </div>

      {/* Success Notification Banner */}
      {jobSuccessBanner && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm font-semibold">{jobSuccessBanner}</span>
          </div>
          <button onClick={() => setJobSuccessBanner(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: SEARCH MAIDS & FILTER */}
      {activeTab === "search-maids" && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Filter className="w-5 h-5 text-emerald-600" />
                Filter Available Maids & Domestic Staff
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Showing <strong className="text-slate-900">{filteredMaids.length}</strong> available workers
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Search Keywords */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Search Name / Skill</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Nanny, Sizani, Ironing..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Location / City</label>
                <select
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="All">All Zimbabwe Cities</option>
                  {ALL_ZIMBABWE_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Age Range */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Age: {searchMinAge} - {searchMaxAge} yrs
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="18"
                    max="65"
                    value={searchMaxAge}
                    onChange={(e) => setSearchMaxAge(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <span className="text-xs font-bold text-slate-700 min-w-[32px]">{searchMaxAge}</span>
                </div>
              </div>

              {/* Number of Children */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Number of Children</label>
                <select
                  value={searchMaxChildren}
                  onChange={(e) => setSearchMaxChildren(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="All">Any Number</option>
                  <option value="0">0 Children (No dependents)</option>
                  <option value="1">Max 1 Child</option>
                  <option value="2">Max 2 Children</option>
                  <option value="3">3+ Children</option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Min Experience</label>
                <select
                  value={searchMinExp}
                  onChange={(e) => setSearchMinExp(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="0">Any Experience</option>
                  <option value="2">2+ Years Experience</option>
                  <option value="5">5+ Years Experience</option>
                  <option value="8">8+ Years Experience</option>
                </select>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary Skill</label>
                <select
                  value={searchSkill}
                  onChange={(e) => setSearchSkill(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="All">All Skills</option>
                  {ALL_SKILLS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Accommodation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Accommodation</label>
                <select
                  value={searchAccommodation}
                  onChange={(e) => setSearchAccommodation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="All">Live-in or Live-out</option>
                  <option value="Live-in">Live-in Preferred</option>
                  <option value="Live-out">Live-out Preferred</option>
                </select>
              </div>

              {/* Max Expected Salary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Max Salary: ${searchMaxSalary} USD</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="150"
                    max="600"
                    step="10"
                    value={searchMaxSalary}
                    onChange={(e) => setSearchMaxSalary(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <span className="text-xs font-bold text-slate-700 min-w-[40px]">${searchMaxSalary}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Maids Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaids.map((maid) => (
              <div
                key={maid.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Header */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={maid.profilePhoto}
                      alt={maid.fullName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    {/* Featured & Verified Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {maid.isVerified && (
                        <span className="px-2.5 py-1 bg-emerald-500/90 backdrop-blur-md text-slate-950 text-[11px] font-black rounded-full flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      )}
                      {maid.isFeatured && (
                        <span className="px-2.5 py-1 bg-amber-500 text-slate-950 text-[11px] font-black rounded-full flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Salary Tag */}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-md text-slate-900 font-black text-sm">
                      ${maid.expectedSalary} <span className="text-[10px] font-bold text-slate-500">/mo</span>
                    </div>

                    {/* Name & Age Overlay */}
                    <div className="absolute bottom-3 left-3 text-white">
                      <h3 className="font-black text-lg tracking-tight leading-tight">
                        {maid.fullName}
                      </h3>
                      <div className="text-xs text-slate-200 font-medium flex items-center gap-2">
                        <span>Age: <strong>{maid.age}</strong></span>
                        <span>•</span>
                        <span>{maid.numberOfChildren} {maid.numberOfChildren === 1 ? "Child" : "Children"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4">
                    {/* Key Attributes */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-2 rounded-xl">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{maid.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 p-2 rounded-xl">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{maid.experienceYears} Yrs Experience</span>
                      </div>
                    </div>

                    {/* Availability Tag */}
                    <div className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {maid.availability}
                    </div>

                    {/* Skills Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {maid.skills.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[11px] font-semibold rounded-md border border-emerald-100"
                        >
                          {s}
                        </span>
                      ))}
                      {maid.skills.length > 3 && (
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">
                          +{maid.skills.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Short About Me */}
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      "{maid.shortAboutMe}"
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedMaid(maid);
                      setUnlockMessage(null);
                    }}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View Full Profile
                  </button>

                  {maid.isUnlockedForCurrentEmployer ? (
                    <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl flex-shrink-0" title="Contact Details Unlocked">
                      <Unlock className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="p-2 bg-slate-100 text-slate-400 rounded-xl flex-shrink-0" title="Contact Details Protected">
                      <Lock className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MY POSTED JOBS */}
      {activeTab === "my-jobs" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Your Posted Vacancies</h2>
              <p className="text-xs text-slate-500">Manage your active household job posts and view applicants</p>
            </div>
            <button
              onClick={() => setActiveTab("post-job")}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Post Another Job
            </button>
          </div>

          {employerJobs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No Job Postings Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Create a job posting specifying salary, location, days off, and accommodation to attract top vetted maids.
              </p>
              <button
                onClick={() => setActiveTab("post-job")}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Post Your First Job ($5 USD)
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {employerJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
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
                          {job.isFeatured && (
                            <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" /> Featured
                            </span>
                          )}
                        </div>
                        <h3 className="font-black text-lg text-slate-900 tracking-tight leading-snug">
                          {job.title}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          {job.location} ({job.suburb})
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-slate-900">
                          ${job.salary}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">
                          {job.salaryPeriod}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Attributes Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-700 bg-slate-50 p-3 rounded-2xl">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Accommodation</span>
                        <strong>{job.accommodation}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Days Off</span>
                        <strong>{job.daysOff}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Applicants</span>
                        <strong className="text-emerald-600">{job.applicantCount} Candidates</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setActiveTab("applications")}
                      className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5" />
                      View Applicants ({job.applicantCount})
                    </button>

                    <div className="flex items-center gap-2">
                      {!job.isFeatured && job.status === "Approved" && (
                        <button
                          onClick={() => featureJobPosting(job.id)}
                          className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl transition-all"
                        >
                          Feature ($10 USD)
                        </button>
                      )}
                      {job.status !== "Closed" && (
                        <button
                          onClick={() => closeJobPosting(job.id)}
                          className="px-3 py-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl transition-all"
                        >
                          Close Vacancy
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: POST A NEW JOB */}
      {activeTab === "post-job" && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Domestic Job Vacancy</h2>
            <p className="text-xs text-slate-500">
              Provide complete job specifications. Standard posting fee is <strong>${pricingSettings.jobPostingFeeUSD}.00 USD</strong> deducted from your wallet.
            </p>
          </div>

          {jobFormError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {jobFormError}
            </div>
          )}

          <form onSubmit={handleCreateJob} className="space-y-5">
            {/* Job Title */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Job Title</label>
              <select
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="House Maid">House Maid</option>
                <option value="House Maid & Live-in Nanny">House Maid & Live-in Nanny</option>
                <option value="Nanny & Child Minder">Nanny & Child Minder</option>
                <option value="Elderly Caregiver & Nurse Aide">Elderly Caregiver & Nurse Aide</option>
                <option value="Housekeeper & Cook">Housekeeper & Cook</option>
                <option value="Gardener & General Hand">Gardener & General Hand</option>
                <option value="Cleaner / Domestic Worker">Cleaner / Domestic Worker</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Job Description & Household Duties</label>
              <textarea
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Describe daily duties (e.g. cleaning 3-bedroom house, laundry, cooking dinner for family of 4, supervising toddlers)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                required
              />
            </div>

            {/* Salary & Period */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Offered Salary (USD)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    min="50"
                    max="2000"
                    value={jobSalary}
                    onChange={(e) => setJobSalary(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-800 font-bold focus:bg-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Payment Frequency</label>
                <select
                  value={jobSalaryPeriod}
                  onChange={(e) => setJobSalaryPeriod(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="monthly">Monthly Salary</option>
                  <option value="weekly">Weekly Salary</option>
                </select>
              </div>
            </div>

            {/* Location & Suburb */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">City</label>
                <select
                  value={jobLocation}
                  onChange={(e) => {
                    setJobLocation(e.target.value);
                    const subs = getSuburbsForCity(e.target.value);
                    if (subs.length > 0) setJobSuburb(subs[0]);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  {ALL_ZIMBABWE_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Residential Suburb</label>
                <input
                  type="text"
                  value={jobSuburb}
                  onChange={(e) => setJobSuburb(e.target.value)}
                  placeholder="e.g. Borrowdale, Avondale, Hillside..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Days Off & Hours & Accommodation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Days Off</label>
                <select
                  value={jobDaysOff}
                  onChange={(e) => setJobDaysOff(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Sunday Off">Sunday Off (1 Day)</option>
                  <option value="Saturday Off">Saturday Off (1 Day)</option>
                  <option value="Weekends">Weekends Off (2 Days)</option>
                  <option value="1 day per week">1 Day Per Week (Flexible)</option>
                  <option value="Specific Days (Negotiable)">Negotiable</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Working Hours</label>
                <input
                  type="text"
                  value={jobWorkingHours}
                  onChange={(e) => setJobWorkingHours(e.target.value)}
                  placeholder="e.g. 07:00 - 17:00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Accommodation</label>
                <select
                  value={jobAccommodation}
                  onChange={(e) => setJobAccommodation(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Live-in">Live-in (Staff Quarters)</option>
                  <option value="Live-out">Live-out (Commuting)</option>
                </select>
              </div>
            </div>

            {/* Special Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Additional Requirements / Perks</label>
              <input
                type="text"
                value={jobNotes}
                onChange={(e) => setJobNotes(e.target.value)}
                placeholder="e.g. Private cottage with solar power, food provided, must love pets..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Make Featured Checkbox */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  Make this a Featured Job Listing
                </div>
                <p className="text-[11px] text-slate-600">
                  Highlight your vacancy at the top of worker search feeds for 30 days (+${pricingSettings.featuredJobFeeUSD}.00 USD)
                </p>
              </div>
              <input
                type="checkbox"
                checked={jobMakeFeatured}
                onChange={(e) => setJobMakeFeatured(e.target.checked)}
                className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            {/* Pricing Summary & Submit */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500 font-medium">Total Fee to Deduct:</div>
                <div className="text-xl font-black text-slate-900">
                  ${pricingSettings.jobPostingFeeUSD + (jobMakeFeatured ? pricingSettings.featuredJobFeeUSD : 0)}.00 USD
                </div>
                <div className="text-[11px] text-slate-400">
                  Current Wallet Balance: <strong>${currentWallet.balance.toFixed(2)} USD</strong>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("my-jobs")}
                  className="px-4 py-2.5 text-slate-600 hover:text-slate-900 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingJob}
                  className="flex-1 sm:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {isSubmittingJob ? "Publishing Job..." : "Publish Job Vacancy"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: APPLICATIONS RECEIVED */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Applications Received</h2>
            <p className="text-xs text-slate-500">Review candidates who applied for your posted jobs</p>
          </div>

          {employerApplications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Applications Received Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                When maids apply for your vacancies, their profiles, age, cover notes, and contact options will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {employerApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={app.maidPhoto}
                      alt={app.maidName}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-base text-slate-900">{app.maidName}</h3>
                        <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg">
                          Age: {app.maidAge}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            app.status === "Shortlisted"
                              ? "bg-amber-100 text-amber-800"
                              : app.status === "Approved" || app.status === "Hired"
                              ? "bg-emerald-100 text-emerald-800"
                              : app.status === "Rejected"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          Status: {app.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-semibold">
                        Applied for: <strong className="text-slate-800">{app.jobTitle}</strong> ({app.jobLocation})
                      </div>
                      {app.coverNote && (
                        <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl max-w-xl">
                          "{app.coverNote}"
                        </p>
                      )}
                      <div className="text-[10px] text-slate-400">Applied on {app.appliedDate}</div>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
                    {app.status === "Pending" && (
                      <>
                        <button
                          onClick={() => updateApplicationStatus(app.id, "Shortlisted")}
                          className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(app.id, "Approved")}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(app.id, "Rejected")}
                          className="px-3 py-2 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl transition-all"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {app.status === "Shortlisted" && (
                      <>
                        <button
                          onClick={() => updateApplicationStatus(app.id, "Hired")}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all"
                        >
                          Mark as Hired
                        </button>
                        <button
                          onClick={() => updateApplicationStatus(app.id, "Rejected")}
                          className="px-3 py-2 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {app.status === "Hired" && (
                      <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Hired Placed Candidate
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: WALLET & PAYNOW TRANSACTION HISTORY */}
      {activeTab === "wallet" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Available Balance</div>
              <div className="text-3xl font-black text-emerald-600">${currentWallet.balance.toFixed(2)} USD</div>
              <div className="text-[11px] text-slate-500">Ready for job posts & profile unlocks</div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Deposited</div>
              <div className="text-3xl font-black text-slate-900">${currentWallet.totalDeposited.toFixed(2)} USD</div>
              <div className="text-[11px] text-slate-500">Verified Paynow deposits</div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Spent</div>
              <div className="text-3xl font-black text-slate-700">${currentWallet.totalSpent.toFixed(2)} USD</div>
              <div className="text-[11px] text-slate-500">On job postings & premium access</div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Paynow & Wallet Transaction History</h3>
                <p className="text-xs text-slate-500">Server-verified audit trail for your account</p>
              </div>
              <button
                onClick={() => {
                  setIsAddFundsOpen(true);
                  setPaynowCheckoutState(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Add Funds with Paynow
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-3">Transaction ID</th>
                    <th className="py-3 px-3">Service</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Paynow Reference</th>
                    <th className="py-3 px-3">Payment Method</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {transactions
                    .filter((t) => t.userId === currentUser.id)
                    .map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3 font-mono text-[11px] text-slate-500">{tx.id}</td>
                        <td className="py-3.5 px-3 font-bold text-slate-900">{tx.service}</td>
                        <td className="py-3.5 px-3 font-black text-slate-900">${tx.amount.toFixed(2)} USD</td>
                        <td className="py-3.5 px-3 font-mono text-[10px] text-emerald-700 bg-emerald-50/50 rounded">{tx.paynowReference}</td>
                        <td className="py-3.5 px-3">{tx.paymentMethod}</td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tx.status === "Paid"
                                ? "bg-emerald-100 text-emerald-800"
                                : tx.status === "Pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {tx.status} {tx.isVerified && "✓"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-400 text-[11px]">{tx.date}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PROFILE & RESIDENCE PHOTOS */}
      {activeTab === "profile-media" && (
        <div className="space-y-6">
          <MediaUploadComponent mode="all" />
        </div>
      )}

      {/* MODAL 1: VIEW FULL MAID PROFILE & UNLOCK CONTACT */}
      {selectedMaid && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 space-y-6">
            {/* Top Bar with Back Button & Close */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedMaid(null)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all active:scale-95 border border-slate-200"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600" />
                <span>Back to Maids</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMaid(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
                title="Close (Escape)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Header */}
            <div className="flex items-start gap-4">
              <div
                className="relative cursor-pointer group flex-shrink-0"
                onClick={() =>
                  openMaidLightbox([
                    {
                      url: selectedMaid.profilePhoto,
                      title: `${selectedMaid.fullName} — Facial Portrait`,
                      subtitle: `${selectedMaid.location} • ${selectedMaid.age} yrs old`,
                      isVerified: selectedMaid.isVerified,
                    },
                    ...(selectedMaid.additionalPhoto1
                      ? [
                          {
                            url: selectedMaid.additionalPhoto1,
                            title: `${selectedMaid.fullName} — Work Uniform`,
                            subtitle: "Work Attire & Uniform Readiness",
                            isVerified: true,
                          },
                        ]
                      : []),
                    ...(selectedMaid.additionalPhoto2
                      ? [
                          {
                            url: selectedMaid.additionalPhoto2,
                            title: `${selectedMaid.fullName} — Demonstration`,
                            subtitle: "Practical Housekeeping Demonstration",
                            isVerified: true,
                          },
                        ]
                      : []),
                  ])
                }
                title="Click to view full photo"
              >
                <img
                  src={selectedMaid.profilePhoto}
                  alt={selectedMaid.fullName}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center transition-opacity">
                  <Camera className="w-5 h-5 text-white drop-shadow-sm" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">{selectedMaid.fullName}</h2>
                  {selectedMaid.isVerified && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Worker
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-600 font-semibold flex items-center gap-3">
                  <span>Age: <strong>{selectedMaid.age}</strong></span>
                  <span>•</span>
                  <span>{selectedMaid.numberOfChildren} Children</span>
                  <span>•</span>
                  <span>{selectedMaid.location}</span>
                </div>
                <div className="text-sm font-black text-emerald-700">
                  Expected Salary: ${selectedMaid.expectedSalary} USD / month
                </div>
              </div>
            </div>

            {/* Feedback Message */}
            {unlockMessage && (
              <div
                className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                  unlockMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                    : "bg-rose-50 text-rose-900 border border-rose-200"
                }`}
              >
                {unlockMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                )}
                {unlockMessage.text}
              </div>
            )}

            {/* Candidate Work Portfolio Gallery (if available) */}
            {((selectedMaid.portfolio && selectedMaid.portfolio.length > 0) || selectedMaid.additionalPhoto1 || selectedMaid.additionalPhoto2) && (
              <div className="space-y-2.5 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Work Portfolio & Demonstration Photos (Click to View)
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                    {(selectedMaid.portfolio?.length || 0) + (selectedMaid.additionalPhoto1 ? 1 : 0) + (selectedMaid.additionalPhoto2 ? 1 : 0)} Photos
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  {selectedMaid.portfolio?.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        openMaidLightbox([
                          {
                            url: item.imageUrl,
                            title: item.title,
                            subtitle: `${selectedMaid.fullName} • ${item.category}`,
                            isVerified: true,
                          },
                        ])
                      }
                      className="relative rounded-xl overflow-hidden group bg-white border border-emerald-100 shadow-sm cursor-pointer hover:ring-2 hover:ring-emerald-500"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="p-1.5 bg-white">
                        <div className="text-[11px] font-bold text-slate-900 truncate">{item.title}</div>
                        <div className="text-[9px] text-emerald-700 font-semibold">{item.category}</div>
                      </div>
                    </div>
                  ))}

                  {selectedMaid.additionalPhoto1 && (
                    <div
                      onClick={() =>
                        openMaidLightbox([
                          {
                            url: selectedMaid.additionalPhoto1!,
                            title: `${selectedMaid.fullName} — Work Uniform`,
                            subtitle: "Work Attire & Professional Uniform",
                            isVerified: true,
                          },
                        ])
                      }
                      className="relative rounded-xl overflow-hidden group bg-white border border-emerald-100 shadow-sm cursor-pointer hover:ring-2 hover:ring-emerald-500"
                    >
                      <img
                        src={selectedMaid.additionalPhoto1}
                        alt="Work Uniform"
                        className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="p-1.5 bg-white">
                        <div className="text-[11px] font-bold text-slate-900 truncate">
                          {selectedMaid.additionalPhoto1Title || "Work Uniform"}
                        </div>
                        <div className="text-[9px] text-emerald-700 font-semibold">Attire</div>
                      </div>
                    </div>
                  )}

                  {selectedMaid.additionalPhoto2 && (
                    <div
                      onClick={() =>
                        openMaidLightbox([
                          {
                            url: selectedMaid.additionalPhoto2!,
                            title: `${selectedMaid.fullName} — Skill Demonstration`,
                            subtitle: "Practical Domestic Demonstration",
                            isVerified: true,
                          },
                        ])
                      }
                      className="relative rounded-xl overflow-hidden group bg-white border border-emerald-100 shadow-sm cursor-pointer hover:ring-2 hover:ring-emerald-500"
                    >
                      <img
                        src={selectedMaid.additionalPhoto2}
                        alt="Skill in Action"
                        className="w-full h-24 object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="p-1.5 bg-white">
                        <div className="text-[11px] font-bold text-slate-900 truncate">
                          {selectedMaid.additionalPhoto2Title || "Skill Demonstration"}
                        </div>
                        <div className="text-[9px] text-emerald-700 font-semibold">Work Photo</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* About Me & Experience */}
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About Candidate</h4>
                <p className="text-xs text-slate-700 leading-relaxed mt-1">
                  {selectedMaid.shortAboutMe}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Work Experience</h4>
                <p className="text-xs text-slate-700 leading-relaxed mt-1">
                  {selectedMaid.workExperience}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skills & Capabilities</h4>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedMaid.skills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sensitive Private Contact & Document Vault Area */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  {selectedMaid.isUnlockedForCurrentEmployer ? (
                    <>
                      <Unlock className="w-4 h-4 text-emerald-600" />
                      Direct Candidate Contact & Verified Documents Unlocked
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-slate-500" />
                      Direct Phone, WhatsApp & Documents Protected
                    </>
                  )}
                </div>
                {!selectedMaid.isUnlockedForCurrentEmployer && (
                  <span className="text-[11px] font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                    Fee: ${pricingSettings.premiumMaidAccessFeeUSD}.00 USD
                  </span>
                )}
              </div>

              {selectedMaid.isUnlockedForCurrentEmployer ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-600" /> Phone Number
                    </span>
                    <a href={`tel:${selectedMaid.unlockedPhone}`} className="font-bold text-emerald-700 hover:underline">
                      {selectedMaid.unlockedPhone}
                    </a>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-emerald-600" /> WhatsApp
                    </span>
                    <a
                      href={`https://wa.me/${selectedMaid.unlockedWhatsApp?.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-700 hover:underline"
                    >
                      {selectedMaid.unlockedWhatsApp}
                    </a>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 sm:col-span-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Home className="w-3 h-3 text-emerald-600" /> Residential Address
                    </span>
                    <span className="font-medium text-slate-800">
                      {selectedMaid.unlockedResidentialAddress || "Harare, Zimbabwe"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    Candidate phone numbers, WhatsApp lines, residential address, and ID verification records are kept private until unlocked.
                  </p>
                  <button
                    onClick={() => handleUnlockContact(selectedMaid.id)}
                    disabled={isUnlocking}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Unlock className="w-4 h-4" />
                    {isUnlocking ? "Unlocking Access..." : `Unlock Contact & Documents for $${pricingSettings.premiumMaidAccessFeeUSD}.00 USD`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD FUNDS / PAYNOW SIMULATOR & GATEWAY CHECKOUT */}
      {isAddFundsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddFundsOpen(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all active:scale-95 border border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddFundsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
                title="Close (Escape)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">
                <CreditCard className="w-3 h-3" /> Paynow Zimbabwe Gateway
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Add Funds to Employer Wallet</h2>
              <p className="text-xs text-slate-500">
                Deposit USD via Paynow (EcoCash, OneMoney, Visa/MasterCard, InnBucks) with automatic server verification.
              </p>
            </div>

            {paymentSuccessMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                {paymentSuccessMessage}
              </div>
            )}

            {!paynowCheckoutState ? (
              <div className="space-y-5">
                {/* Preset Amount Chips */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Select Deposit Amount (USD)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[20, 50, 100, 200].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDepositAmount(amt)}
                        className={`py-2.5 rounded-xl font-black text-xs transition-all ${
                          depositAmount === amt
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Or Custom Amount ($ USD)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">$</span>
                    <input
                      type="number"
                      min="5"
                      max="5000"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-900 font-black focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Payment Gateway */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span>Paynow Zimbabwe Gateway</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Direct Clearing
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Official secure payment gateway for Zimbabwe Maids Centre.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleInitiateDeposit}
                  disabled={isProcessingPayment || depositAmount <= 0}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessingPayment ? "Connecting to Paynow..." : `Proceed to Paynow ($${depositAmount}.00 USD)`}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                  <div className="text-[10px] uppercase font-bold text-emerald-400">Paynow Transaction Initialized</div>
                  <div className="text-lg font-black">${depositAmount}.00 USD</div>
                  <div className="text-xs font-mono text-slate-300">Ref: {paynowCheckoutState.paynowReference}</div>
                </div>

                <a
                  href={paynowCheckoutState.checkoutUrl}
                  target="_self"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Paynow Payment Gateway (Same Window)</span>
                </a>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 space-y-1">
                  <p className="font-bold">Server-Side Payment Verification:</p>
                  <p className="text-[11px] leading-relaxed">
                    Once you complete payment on the Paynow secure gateway or your phone, click below to confirm receipt.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyDeposit}
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? "Verifying with Paynow..." : "Verify & Credit Wallet Now"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox for Maid and Candidate Photos */}
      <ImageLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={lightboxImages}
        initialIndex={lightboxIndex}
        backLabel="Back to Profile"
      />
    </div>
  );
};
