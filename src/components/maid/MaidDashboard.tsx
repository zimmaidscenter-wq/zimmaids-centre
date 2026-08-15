import React, { useState } from "react";
import { usePlatform } from "../../context/PlatformContext";
import { JobRecord, calculateAge } from "../../types/platform";
import { ALL_ZIMBABWE_CITIES } from "../../data/zimbabweLocations";
import { MediaUploadComponent } from "../media/MediaUploadComponent";
import {
  User,
  Briefcase,
  FileText,
  ShieldCheck,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle2,
  Calendar,
  Lock,
  Upload,
  Phone,
  MessageSquare,
  Mail,
  Home,
  Plus,
  Trash2,
  Edit3,
  Check,
  AlertCircle,
  Eye,
  Search,
  Filter,
  Send,
  Building,
  Star,
  Camera,
  Sparkles,
  X
} from "lucide-react";

export const MaidDashboard: React.FC = () => {
  const {
    currentUser,
    currentMaidProfile,
    updateMaidProfile,
    allJobs,
    maidApplications,
    applyForJob,
    notifications,
    getProfileCompletion,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<"profile" | "media-portfolio" | "browse-jobs" | "my-applications" | "documents">("profile");

  // Profile Edit State
  const [firstName, setFirstName] = useState(currentMaidProfile?.firstName || "Sizani");
  const [surname, setSurname] = useState(currentMaidProfile?.surname || "Ndlovu");
  const [dateOfBirth, setDateOfBirth] = useState(currentMaidProfile?.dateOfBirth || "1994-04-15");
  const [gender, setGender] = useState<"Female" | "Male">(currentMaidProfile?.gender || "Female");
  const [numberOfChildren, setNumberOfChildren] = useState<number>(currentMaidProfile?.numberOfChildren || 2);
  const [location, setLocation] = useState(currentMaidProfile?.location || "Harare");
  const [residentialAddress, setResidentialAddress] = useState(currentMaidProfile?.residentialAddress || "Stand 412, Unit K, Chitungwiza, Harare");
  const [phoneNumber, setPhoneNumber] = useState(currentMaidProfile?.phoneNumber || "+263 771 902 441");
  const [whatsappNumber, setWhatsappNumber] = useState(currentMaidProfile?.whatsappNumber || "+263 771 902 441");
  const [expectedSalary, setExpectedSalary] = useState<number>(currentMaidProfile?.expectedSalary || 280);
  const [availability, setAvailability] = useState<any>(currentMaidProfile?.availability || "Available immediately");
  const [preferredLocation, setPreferredLocation] = useState(currentMaidProfile?.preferredWorkLocation || "Harare (Northern Suburbs)");
  const [willingToLiveIn, setWillingToLiveIn] = useState(currentMaidProfile?.willingToLiveIn ?? true);
  const [willingToLiveOut, setWillingToLiveOut] = useState(currentMaidProfile?.willingToLiveOut ?? true);
  const [experienceYears, setExperienceYears] = useState(currentMaidProfile?.experienceYears || 7);
  const [workExperience, setWorkExperience] = useState(currentMaidProfile?.workExperience || "7 years of extensive household management in Borrowdale and Highlands. Expert in infant & toddler care, meal preparation, deep cleaning, and steam pressing.");
  const [shortAboutMe, setShortAboutMe] = useState(currentMaidProfile?.shortAboutMe || "Trustworthy, punctual, and child-loving housekeeper with certified Red Cross First Aid training.");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Job Search Filters
  const [jobCityFilter, setJobCityFilter] = useState("All");
  const [jobAccommodationFilter, setJobAccommodationFilter] = useState("All");
  const [jobSearchQuery, setJobSearchQuery] = useState("");

  // Job Application Modal
  const [selectedJobToApply, setSelectedJobToApply] = useState<JobRecord | null>(null);
  const [applicationCoverNote, setApplicationCoverNote] = useState("");
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [appFeedback, setAppFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Computed Age dynamically
  const calculatedAge = calculateAge(dateOfBirth);

  // Save profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateMaidProfile({
      firstName,
      surname,
      dateOfBirth,
      gender,
      numberOfChildren,
      location,
      residentialAddress,
      phoneNumber,
      whatsappNumber,
      expectedSalary,
      availability,
      preferredWorkLocation: preferredLocation,
      willingToLiveIn,
      willingToLiveOut,
      experienceYears,
      workExperience,
      shortAboutMe,
    });
    setSaveSuccessMsg("Your worker profile has been updated and synchronized!");
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Filtered Jobs
  const availableJobs = allJobs.filter((job) => {
    if (job.status !== "Approved") return false;
    if (jobCityFilter !== "All" && !job.location.toLowerCase().includes(jobCityFilter.toLowerCase())) return false;
    if (jobAccommodationFilter !== "All" && job.accommodation !== jobAccommodationFilter) return false;
    if (jobSearchQuery.trim()) {
      const q = jobSearchQuery.toLowerCase();
      const matchTitle = job.title.toLowerCase().includes(q);
      const matchDesc = job.description.toLowerCase().includes(q);
      const matchLocation = job.location.toLowerCase().includes(q) || job.suburb.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLocation) return false;
    }
    return true;
  });

  // Handle Apply for Job
  const handleApply = async () => {
    if (!selectedJobToApply) return;
    setIsSubmittingApp(true);
    setAppFeedback(null);

    const res = await applyForJob(selectedJobToApply.id, applicationCoverNote);
    setIsSubmittingApp(false);

    if (res.success) {
      setAppFeedback({
        type: "success",
        text: `Application submitted successfully to ${selectedJobToApply.employerTitleSurname}!`,
      });
      setTimeout(() => {
        setSelectedJobToApply(null);
        setAppFeedback(null);
        setActiveTab("my-applications");
      }, 1500);
    } else {
      setAppFeedback({
        type: "error",
        text: res.error || "Failed to submit application.",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentMaidProfile?.profilePhoto || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400"}
            alt={firstName}
            referrerPolicy="no-referrer"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
          />
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Maid Account
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {firstName} {surname}
            </h1>
            <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
              <span>Age: <strong className="text-slate-800">{calculatedAge} Years</strong></span>
              <span>•</span>
              <span>{numberOfChildren} Children</span>
              <span>•</span>
              <span>{location}</span>
            </div>
          </div>
        </div>

        {/* Verification Status Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1 min-w-[240px]">
          <div className="font-bold text-slate-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Profile & Documents Status
          </div>
          <div className="text-emerald-700 font-black text-sm">
            {currentMaidProfile?.verificationStatus || "Approved"}
          </div>
          <div className="text-[11px] text-slate-500">
            ZRP Police Clearance & National ID on file
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "profile"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <User className="w-4 h-4" />
          My Profile & Experience
        </button>

        <button
          onClick={() => setActiveTab("media-portfolio")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "media-portfolio"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Camera className="w-4 h-4 text-emerald-500" />
          Photos & Work Portfolio
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
            {currentMaidProfile?.portfolio?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("browse-jobs")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "browse-jobs"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Browse Employer Jobs ({availableJobs.length})
        </button>

        <button
          onClick={() => setActiveTab("my-applications")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "my-applications"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Send className="w-4 h-4" />
          My Job Applications ({maidApplications.length})
        </button>

        <button
          onClick={() => setActiveTab("documents")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "documents"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Lock className="w-4 h-4" />
          Private Document Vault
        </button>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          {saveSuccessMsg}
        </div>
      )}

      {/* TAB 1: MY PROFILE & EXPERIENCE */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Quick Media Prompt Banner */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 border border-emerald-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <Camera className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span>Profile Picture & Work Gallery</span>
                  <span className="text-[10px] uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full font-black">
                    High Impact
                  </span>
                </h4>
                <p className="text-xs text-slate-600">
                  Workers with 3+ portfolio work photos receive 4.8x more verified employer inquiries.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("media-portfolio")}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5" />
              Manage Photos & Portfolio
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Edit Worker Profile</h2>
              <p className="text-xs text-slate-500">
                Keep your work history, skills, salary expectations, and availability updated for prospective employers.
              </p>
            </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Surname</label>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Date of Birth (Calculated Age: <strong className="text-emerald-700">{calculatedAge}</strong>)
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                  required
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Stored securely. Only age is displayed publicly.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Number of Children</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={numberOfChildren}
                  onChange={(e) => setNumberOfChildren(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Location / City</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  {ALL_ZIMBABWE_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Private Contact Fields (Marked with Lock) */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Lock className="w-4 h-4 text-emerald-600" />
                Private Contact & Residence Details (Hidden from Public Search)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">WhatsApp Number</label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Residential Suburb / Stand</label>
                  <input
                    type="text"
                    value={residentialAddress}
                    onChange={(e) => setResidentialAddress(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Salary, Availability & Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Expected Monthly Salary (USD)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    min="100"
                    max="1000"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Availability Status</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Available immediately">Available immediately</option>
                  <option value="Available from a future date">Available from a future date</option>
                  <option value="Already employed">Already employed</option>
                  <option value="Temporarily unavailable">Temporarily unavailable</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Preferred Work Suburbs</label>
                <input
                  type="text"
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  placeholder="e.g. Borrowdale, Mt Pleasant, Avondale"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Accommodation Preferences */}
            <div className="flex items-center gap-6 text-xs font-bold text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={willingToLiveIn}
                  onChange={(e) => setWillingToLiveIn(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                Willing to Live-In (Staff Quarters)
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={willingToLiveOut}
                  onChange={(e) => setWillingToLiveOut(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                Willing to Live-Out (Daily Commute)
              </label>
            </div>

            {/* Work Experience & Bio */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Detailed Work Experience</label>
                <textarea
                  rows={3}
                  value={workExperience}
                  onChange={(e) => setWorkExperience(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">About Me (Short Bio)</label>
                <textarea
                  rows={2}
                  value={shortAboutMe}
                  onChange={(e) => setShortAboutMe(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20"
              >
                Save & Update Worker Profile
              </button>
            </div>
          </form>
        </div>
      </div>
      )}

      {/* TAB: PHOTOS & WORK PORTFOLIO */}
      {activeTab === "media-portfolio" && (
        <div className="space-y-6">
          <MediaUploadComponent mode="all" />
        </div>
      )}

      {/* TAB 2: BROWSE EMPLOYER JOBS */}
      {activeTab === "browse-jobs" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-lg font-black text-slate-900">Browse Available Household Jobs</h2>
              <div className="text-xs text-slate-500">
                Found <strong className="text-slate-900">{availableJobs.length}</strong> active job vacancies
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Search Keywords</label>
                <div className="relative">
                  <input
                    type="text"
                    value={jobSearchQuery}
                    onChange={(e) => setJobSearchQuery(e.target.value)}
                    placeholder="e.g. Nanny, Borrowdale, Cook..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">City</label>
                <select
                  value={jobCityFilter}
                  onChange={(e) => setJobCityFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="All">All Cities</option>
                  {ALL_ZIMBABWE_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Accommodation</label>
                <select
                  value={jobAccommodationFilter}
                  onChange={(e) => setJobAccommodationFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="All">Any (Live-in or Live-out)</option>
                  <option value="Live-in">Live-in Only</option>
                  <option value="Live-out">Live-out Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Job Postings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableJobs.map((job) => {
              const alreadyApplied = maidApplications.some((a) => a.jobId === job.id);

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {job.isFeatured && (
                          <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full inline-flex items-center gap-1 mb-1.5">
                            <Star className="w-3 h-3 fill-current" /> Featured Job
                          </span>
                        )}
                        <h3 className="font-black text-lg text-slate-900 tracking-tight">{job.title}</h3>
                        <p className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                          <span>Employer: <strong>{job.employerTitleSurname}</strong></span>
                          <span>•</span>
                          <span className="text-emerald-700 flex items-center gap-0.5">
                            <MapPin className="w-3 h-3" /> {job.location} ({job.suburb})
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-black text-emerald-600">${job.salary}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">{job.salaryPeriod}</div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {job.description}
                    </p>

                    {/* Job Details Chips */}
                    <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-50 p-3 rounded-2xl text-slate-700">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Accommodation</span>
                        <strong>{job.accommodation}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Days Off</span>
                        <strong>{job.daysOff}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Hours</span>
                        <strong className="truncate block">{job.workingHours}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                    <span className="text-[11px] text-slate-400">Posted on {job.datePosted}</span>
                    {alreadyApplied ? (
                      <span className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedJobToApply(job);
                          setApplicationCoverNote(`I would like to apply for the ${job.title} vacancy in ${job.location}. I have ${experienceYears} years experience and am available immediately.`);
                        }}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                      >
                        Apply for Job
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MY APPLICATIONS */}
      {activeTab === "my-applications" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">My Submitted Job Applications</h2>
            <p className="text-xs text-slate-500">Track application status and responses from verified employers</p>
          </div>

          {maidApplications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Applications Submitted</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Browse employer vacancies in your area and apply with your verified maid profile.
              </p>
              <button
                onClick={() => setActiveTab("browse-jobs")}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Browse Available Jobs
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {maidApplications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-base text-slate-900">{app.jobTitle}</h3>
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
                        {app.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-semibold">
                      Employer: <strong className="text-slate-900">{app.employerTitleSurname}</strong> • {app.jobLocation} • ${app.jobSalary} USD/mo
                    </div>
                    {app.coverNote && (
                      <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl max-w-xl">
                        "{app.coverNote}"
                      </p>
                    )}
                    <div className="text-[10px] text-slate-400">Applied on {app.appliedDate}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    {app.status === "Approved" || app.status === "Hired" ? (
                      <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Employer Accepted Application
                      </div>
                    ) : app.status === "Shortlisted" ? (
                      <div className="p-3 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200 text-xs font-bold">
                        Shortlisted by Employer
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 font-medium">
                        Under Review by Employer
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PRIVATE DOCUMENT VAULT */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Secure Document Management
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Private Identity & Verification Vault</h2>
            <p className="text-xs text-slate-500 max-w-2xl">
              All documents are stored privately in encrypted storage. National ID numbers, IDs, and certificates are NEVER publicly accessible through search or public profiles. Only authorized administrators and employers who unlock verified access can view verification records.
            </p>
          </div>

          {/* Document Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-slate-700">National ID Document</div>
              <div className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md inline-block">
                ✓ Verified
              </div>
              <p className="text-[11px] text-slate-500">Government ID vetted</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-slate-700">ZRP Police Clearance</div>
              <div className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md inline-block">
                ✓ Verified
              </div>
              <p className="text-[11px] text-slate-500">CID clearance record</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-slate-700">Professional Certificates</div>
              <div className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md inline-block">
                ✓ Verified
              </div>
              <p className="text-[11px] text-slate-500">First aid & childcare</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-slate-700">Employer References</div>
              <div className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md inline-block">
                ✓ Verified
              </div>
              <p className="text-[11px] text-slate-500">Past household reference</p>
            </div>
          </div>

          {/* Upload New Document Box */}
          <div className="p-6 border-2 border-dashed border-slate-200 rounded-3xl text-center space-y-3 bg-slate-50/50">
            <Upload className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-xs font-bold text-slate-700">Upload Additional Document or Certificate</div>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              PDF or JPG copies of updated police clearance, medical certificates, or employer reference letters.
            </p>
            <button className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm">
              Select Document to Upload
            </button>
          </div>
        </div>
      )}

      {/* JOB APPLICATION MODAL */}
      {selectedJobToApply && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 space-y-6">
            <button
              onClick={() => setSelectedJobToApply(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="text-xs font-bold text-emerald-700 uppercase">Apply for Vacancy</div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{selectedJobToApply.title}</h2>
              <p className="text-xs text-slate-500">
                Employer: <strong>{selectedJobToApply.employerTitleSurname}</strong> • {selectedJobToApply.location} (${selectedJobToApply.salary} USD/{selectedJobToApply.salaryPeriod})
              </p>
            </div>

            {appFeedback && (
              <div
                className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                  appFeedback.type === "success"
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                    : "bg-rose-50 text-rose-900 border border-rose-200"
                }`}
              >
                {appFeedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                )}
                {appFeedback.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Application Note to Employer</label>
                <textarea
                  rows={4}
                  value={applicationCoverNote}
                  onChange={(e) => setApplicationCoverNote(e.target.value)}
                  placeholder="Introduce yourself and explain why you are suitable for this household..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-800">Your profile summary will be attached:</span>
                <p className="text-[11px]">
                  Name: {firstName} {surname} (Age {calculatedAge}) • {experienceYears} Yrs Experience • Verified Badge
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedJobToApply(null)}
                  className="px-4 py-2.5 text-slate-600 hover:text-slate-900 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={isSubmittingApp}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmittingApp ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
