import React, { useState } from "react";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Sparkles,
  MapPin,
  Clock,
  DollarSign,
  Star,
  CheckCircle2,
  AlertCircle,
  Calculator,
  FileText,
  Bookmark,
  Share2,
  Calendar,
  Flame,
  Compass,
  History,
  Save,
  Check,
  X,
  ChevronRight,
  Zap,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building,
  UserCheck,
  RefreshCw,
  Home,
  Users,
  Bed,
  Dog,
  HeartHandshake,
  Send,
  MessageSquare
} from "lucide-react";
import { JobPosting, UserRole, CityLocation, HelperType, PrimaryFocusRole, EmployerHiringRequest } from "../../types/marketplace";
import { SAMPLE_JOBS } from "../../data/mockData";
import { ALL_ZIMBABWE_CITIES, getSuburbsForCity } from "../../data/zimbabweLocations";
import { EmployerHiringModal } from "./EmployerHiringModal";
import { usePlatform } from "../../context/PlatformContext";
import { useAuth } from "../../context/AuthContext";
import { useCategories } from "../../context/CategoryContext";

interface JobManagementModuleProps {
  currency?: "USD" | "ZWG";
  onNavigateToMarketplace?: () => void;
}

// Initial Expanded Job Data
const INITIAL_JOBS: JobPosting[] = [
  ...SAMPLE_JOBS,
  {
    id: "j4",
    title: "Executive Private Chef for Borrowdale Estate",
    roleNeeded: "Chef",
    employerName: "Chigumba Family Estate",
    city: "Harare",
    suburb: "Borrowdale Brooke",
    offeredSalaryUSD: 450,
    payFrequency: "Monthly",
    workType: "Full-Time",
    description: "Seeking a qualified chef with 5+ years experience in European and traditional Zimbabwean culinary preparations for a private residence.",
    requiredSkills: ["Continental Cuisine", "Traditional Dishes", "Special Diets", "Baking"],
    postedDate: "2026-08-01",
    applicantCount: 19,
    status: "Open",
    urgent: true,
    isFeatured: true,
  },
  {
    id: "j5",
    title: "Part-Time Weekend Gardener & Pool Care",
    roleNeeded: "Gardener",
    employerName: "Highlands Residence",
    city: "Harare",
    suburb: "Highlands",
    offeredSalaryUSD: 120,
    payFrequency: "Monthly",
    workType: "Part-Time",
    description: "Weekend lawn mowing, hedge trimming, and swimming pool chemical treatment. 2 days per week (Saturdays & Sundays).",
    requiredSkills: ["Lawn Maintenance", "Pool Chemical Care", "Hedge Trimming"],
    postedDate: "2026-08-03",
    applicantCount: 6,
    status: "Open",
    urgent: false,
    isFeatured: false,
  },
  {
    id: "j6",
    title: "Temporary Borehole Pump Repair & Plumbing",
    roleNeeded: "Plumber",
    employerName: "Gweru Commercial Farm",
    city: "Gweru",
    suburb: "Daylesford",
    offeredSalaryUSD: 180,
    payFrequency: "One-Time Task",
    workType: "One-Time Task",
    description: "Submersible borehole pump electrical fault finding and pressure tank installation. Immediate start.",
    requiredSkills: ["Borehole Pumps", "Pipe Fitting", "Pressure Tanks"],
    postedDate: "2026-07-28",
    applicantCount: 4,
    status: "Expired",
    urgent: false,
    expiryDate: "2026-08-05",
  },
  {
    id: "j7",
    title: "Draft: Live-Out Housekeeper for Mt Pleasant",
    roleNeeded: "Housekeeper",
    employerName: "Tagwirei Household",
    city: "Harare",
    suburb: "Mount Pleasant",
    offeredSalaryUSD: 210,
    payFrequency: "Monthly",
    workType: "Full-Time",
    description: "Daily housekeeping, laundry, steam ironing, and meal preparation for a family of 4.",
    requiredSkills: ["Deep Cleaning", "Steam Ironing", "Meal Prep"],
    postedDate: "2026-08-10",
    applicantCount: 0,
    status: "Draft",
    urgent: false,
  }
];

// Preset Job Templates
const JOB_TEMPLATES = [
  {
    title: "Live-In Nanny & Housekeeper",
    roleNeeded: "Nanny" as UserRole,
    salaryUSD: 280,
    workType: "Live-In" as const,
    description: "Full-time live-in nanny and housekeeper responsible for child care, cooking, laundry, and maintaining home hygiene in a low-density household.",
    skills: ["Infant Care", "First Aid Certified", "Healthy Meal Prep", "Laundry & Ironing"]
  },
  {
    title: "Executive Private Chef",
    roleNeeded: "Chef" as UserRole,
    salaryUSD: 420,
    workType: "Full-Time" as const,
    description: "Professional private chef for family meals, dinner parties, dietary management, and daily grocery sourcing.",
    skills: ["Traditional Zim Cuisine", "Continental Cooking", "Baking", "Hygiene Standard"]
  },
  {
    title: "Solar System Journeyman Electrician",
    roleNeeded: "Electrician" as UserRole,
    salaryUSD: 300,
    workType: "One-Time Task" as const,
    description: "Installation and wiring of residential solar inverter, lithium batteries, and rooftop PV array with DB board certificate.",
    skills: ["Class 1 Journeyman", "Inverter Wiring", "Solar PV Installation", "DB Certificate"]
  },
  {
    title: "Full-Time Elderly Care Nurse Aide",
    roleNeeded: "Nurse aide" as UserRole,
    salaryUSD: 350,
    workType: "Full-Time" as const,
    description: "Compassionate certified nurse aide to assist elderly family member with vitals monitoring, medication, and daily mobility.",
    skills: ["Red Cross Nurse Aide", "Elderly Care", "Vital Signs", "First Aid"]
  },
  {
    title: "Class 2 Chauffeur & Executive Driver",
    roleNeeded: "Driver" as UserRole,
    salaryUSD: 320,
    workType: "Full-Time" as const,
    description: "Punctual executive driver for daily school runs, corporate errands, and family transport with clean Class 2 license.",
    skills: ["Defensive Driving Cert", "Class 2 License", "School Runs", "Vehicle Maintenance"]
  }
];

export const JobManagementModule: React.FC<JobManagementModuleProps> = ({ currency = "USD", onNavigateToMarketplace }) => {
  const { recordHiringNotification } = usePlatform();
  const { currentUser } = useAuth();
  const { publicCategories, categories, allJobs } = useCategories();
  const [jobsList, setJobsList] = useState<JobPosting[]>(allJobs && allJobs.length > 0 ? allJobs : INITIAL_JOBS);
  const [activeTab, setActiveTab] = useState<
    "all" | "featured" | "recommended" | "nearby" | "expired" | "drafts" | "calculator" | "templates"
  >("all");

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [selectedWorkType, setSelectedWorkType] = useState<string>("All");
  const [maxSalary, setMaxSalary] = useState<number>(600);

  // Modals State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isEmployerHiringModalOpen, setIsEmployerHiringModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Worker Application State
  const [applyingJob, setApplyingJob] = useState<JobPosting | null>(null);
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [applicantForm, setApplicantForm] = useState({
    fullName: "",
    phone: "+263",
    location: "Harare",
    experienceYears: "3",
    skills: "Deep Cleaning, Cooking, Child Care",
    message: "I am experienced, have verified references and a valid police clearance, and I am available immediately.",
    hasPoliceClearance: true,
    hasReferences: true,
  });

  const handleApplyJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;
    setIsSubmittingApp(true);
    setTimeout(() => {
      setIsSubmittingApp(false);
      setJobsList((prev) =>
        prev.map((j) => (j.id === applyingJob.id ? { ...j, applicantCount: j.applicantCount + 1 } : j))
      );
      const appliedTitle = applyingJob.title;
      const workerName = applicantForm.fullName || currentUser?.fullName || "Domestic Worker";
      recordHiringNotification(workerName, appliedTitle);
      setApplyingJob(null);
      showToast(`✅ Application submitted for "${appliedTitle}"! The employer will review your profile.`);
    }, 800);
  };

  const handleWhatsAppApply = (job: JobPosting) => {
    const text = encodeURIComponent(
      `Hello! I saw your job vacancy on VerifiedMaids Zimbabwe for "${job.title}" (${job.roleNeeded}) in ${job.suburb}, ${job.city} offering $${job.offeredSalaryUSD} USD. I would like to apply. My name is: `
    );
    window.open(`https://wa.me/263771234567?text=${text}`, "_blank");
  };

  // Form State for Create / Edit
  const [formData, setFormData] = useState({
    title: "",
    roleNeeded: "Domestic worker" as UserRole,
    employerName: "",
    city: "Harare" as CityLocation,
    suburb: "Borrowdale",
    offeredSalaryUSD: 240,
    payFrequency: "Monthly" as const,
    workType: "Full-Time" as const,
    helperType: "Live-In" as HelperType,
    primaryFocus: "Housekeeping" as PrimaryFocusRole,
    preferredAges: "25 - 45 years",
    numKids: 2,
    numAdults: 2,
    numBedrooms: 3,
    pets: "1 Dog (Friendly)",
    specialNeeds: "",
    proposedOffDays: "Alternate Weekends (Saturday afternoon to Sunday evening)",
    staffAccommodation: "Own en-suite bedroom with private bathroom and solar power backup",
    description: "",
    requiredSkills: "Deep Cleaning, First Aid, Laundry",
    urgent: false,
    isFeatured: false,
  });

  // Salary Calculator State
  const [calcRoleCategory, setCalcRoleCategory] = useState<"unskilled" | "skilled_housekeeper" | "nanny_caregiver" | "artisan">("skilled_housekeeper");
  const [calcWorkMode, setCalcWorkMode] = useState<"live_in" | "live_out">("live_in");
  const [calcHoursPerWeek, setCalcHoursPerWeek] = useState<number>(45);
  const [calcLocationTier, setCalcLocationTier] = useState<"low_density" | "medium_density" | "high_density">("low_density");

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Salary Calculator Computation based on Zimbabwe Statutory Standards & Market Rates
  const computeSalaryGuidance = () => {
    let baseRateUSD = 180;
    if (calcRoleCategory === "unskilled") baseRateUSD = 150;
    if (calcRoleCategory === "skilled_housekeeper") baseRateUSD = 220;
    if (calcRoleCategory === "nanny_caregiver") baseRateUSD = 270;
    if (calcRoleCategory === "artisan") baseRateUSD = 400;

    // Housing & Food allowance adjustment
    const housingAllowance = calcWorkMode === "live_out" ? 40 : 0;
    const locationBonus = calcLocationTier === "low_density" ? 30 : calcLocationTier === "medium_density" ? 10 : 0;
    const overtimeBonus = calcHoursPerWeek > 40 ? (calcHoursPerWeek - 40) * 4 : 0;

    const netRecommendedUSD = baseRateUSD + locationBonus + overtimeBonus;
    const statutoryMinUSD = Math.round(netRecommendedUSD * 0.75);
    const employerTotalCostUSD = netRecommendedUSD + housingAllowance + 25; // includes ZMC escrow & medical trust

    return {
      netRecommendedUSD,
      statutoryMinUSD,
      housingAllowance,
      employerTotalCostUSD,
      netRecommendedZWG: Math.round(netRecommendedUSD * 26.5), // official exchange rate approx
    };
  };

  const calcResult = computeSalaryGuidance();

  // Populate Create Modal from Template
  const handleApplyTemplate = (tmpl: typeof JOB_TEMPLATES[0]) => {
    setFormData({
      title: tmpl.title,
      roleNeeded: tmpl.roleNeeded,
      employerName: "Your Household Name",
      city: "Harare",
      suburb: "Borrowdale",
      offeredSalaryUSD: tmpl.salaryUSD,
      payFrequency: tmpl.workType === "One-Time Task" ? "One-Time Task" : "Monthly",
      workType: tmpl.workType,
      description: tmpl.description,
      requiredSkills: tmpl.skills.join(", "),
      urgent: false,
      isFeatured: false,
    });
    setShowCreateModal(true);
    showToast(`Loaded "${tmpl.title}" template into job creator!`);
  };

  // Save Job (Create or Edit)
  const handleSaveJob = (statusOverride?: "Draft" | "Open") => {
    const skillsArray = formData.requiredSkills.split(",").map(s => s.trim()).filter(Boolean);
    const finalStatus = statusOverride || (editingJob ? editingJob.status : "Open");

    if (editingJob) {
      // Edit existing
      setJobsList(prev =>
        prev.map(j =>
          j.id === editingJob.id
            ? {
                ...j,
                title: formData.title,
                roleNeeded: formData.roleNeeded,
                employerName: formData.employerName,
                city: formData.city,
                suburb: formData.suburb,
                offeredSalaryUSD: Number(formData.offeredSalaryUSD),
                payFrequency: formData.payFrequency,
                workType: formData.workType,
                helperType: formData.helperType,
                primaryFocus: formData.primaryFocus,
                preferredAges: formData.preferredAges,
                householdDetails: {
                  kids: formData.numKids,
                  adults: formData.numAdults,
                  bedrooms: formData.numBedrooms,
                  pets: formData.pets,
                },
                specialNeeds: formData.specialNeeds,
                proposedOffDays: formData.proposedOffDays,
                staffAccommodation: formData.staffAccommodation,
                description: formData.description,
                requiredSkills: skillsArray,
                urgent: formData.urgent,
                isFeatured: formData.isFeatured,
                status: finalStatus,
              }
            : j
        )
      );
      showToast(`Job "${formData.title}" updated successfully!`);
    } else {
      // Create new
      const newJob: JobPosting = {
        id: `j-${Date.now()}`,
        title: formData.title || `${formData.helperType} ${formData.primaryFocus} in ${formData.suburb}, ${formData.city}`,
        roleNeeded: formData.roleNeeded,
        employerName: formData.employerName || "Private Employer",
        city: formData.city,
        suburb: formData.suburb || "Central",
        offeredSalaryUSD: Number(formData.offeredSalaryUSD),
        payFrequency: formData.payFrequency,
        workType: formData.workType,
        helperType: formData.helperType,
        primaryFocus: formData.primaryFocus,
        preferredAges: formData.preferredAges,
        householdDetails: {
          numberOfKids: formData.numKids,
          numberOfAdults: formData.numAdults,
          numberOfBedrooms: formData.numBedrooms,
          pets: formData.pets,
        },
        specialNeeds: formData.specialNeeds,
        proposedOffDays: formData.proposedOffDays,
        staffAccommodation: formData.staffAccommodation,
        description: formData.description,
        requiredSkills: skillsArray,
        postedDate: new Date().toISOString().split("T")[0],
        applicantCount: 0,
        status: finalStatus,
        urgent: formData.urgent,
        isFeatured: formData.isFeatured,
      };
      setJobsList(prev => [newJob, ...prev]);
      showToast(`Job "${newJob.title}" ${finalStatus === "Draft" ? "saved as draft" : "published live"}!`);
    }

    setShowCreateModal(false);
    setEditingJob(null);
  };

  // Handle direct submission from EmployerHiringModal
  const handleEmployerHiringSuccess = (req: EmployerHiringRequest) => {
    const newJob: JobPosting = {
      id: `hiring-${Date.now()}`,
      title: `${req.helperType} ${req.primaryFocus} needed in ${req.physicalAddress.suburb}, ${req.physicalAddress.city}`,
      roleNeeded: req.primaryFocus === "Nanny" ? "Nanny" : req.primaryFocus === "Chef" ? "Chef" : req.primaryFocus === "Gardener" ? "Gardener" : "Housekeeper",
      employerName: req.fullName,
      city: req.physicalAddress.city as CityLocation,
      suburb: req.physicalAddress.suburb,
      offeredSalaryUSD: req.offeredSalaryUSD || 240,
      payFrequency: "Monthly",
      workType: req.helperType === "Live-In" ? "Live-In" : "Full-Time",
      helperType: req.helperType,
      primaryFocus: req.primaryFocus,
      preferredAges: req.preferredAges,
      householdDetails: {
        numberOfKids: req.householdDetails.numberOfKids,
        numberOfAdults: req.householdDetails.numberOfAdults,
        numberOfBedrooms: req.householdDetails.numberOfBedrooms,
        pets: req.householdDetails.pets,
      },
      specialNeeds: req.specialNeeds,
      proposedOffDays: req.proposedOffDays,
      staffAccommodation: req.staffAccommodation,
      description: `Employer ${req.fullName} is hiring a ${req.helperType} helper with primary focus on ${req.primaryFocus}. Household has ${req.householdDetails.numberOfKids} kids, ${req.householdDetails.numberOfAdults} adults, ${req.householdDetails.numberOfBedrooms} bedrooms, and pets: "${req.householdDetails.pets}". Special needs: ${req.specialNeeds || "None specified"}. Accommodation: ${req.staffAccommodation}. Off-days: ${req.proposedOffDays}.`,
      requiredSkills: [req.primaryFocus, "Honest & Reliable", "Zimbabwe References", "Police Clearance"],
      postedDate: new Date().toISOString().split("T")[0],
      applicantCount: 0,
      status: "Open",
      urgent: true,
      isFeatured: true,
    };

    setJobsList(prev => [newJob, ...prev]);
    setIsEmployerHiringModalOpen(false);
    showToast(`Employer Hiring Request for ${req.fullName} published to Job Marketplace!`);
  };

  // Delete Job
  const handleDeleteJob = (id: string) => {
    setJobsList(prev => prev.filter(j => j.id !== id));
    setDeletingJobId(null);
    showToast("Job vacancy deleted from listing.");
  };

  // Publish Draft
  const handlePublishDraft = (id: string) => {
    setJobsList(prev =>
      prev.map(j => (j.id === id ? { ...j, status: "Open" as const, postedDate: new Date().toISOString().split("T")[0] } : j))
    );
    showToast("Draft job successfully published to the public marketplace!");
  };

  // Renew Expired Job
  const handleRenewJob = (id: string) => {
    setJobsList(prev =>
      prev.map(j => (j.id === id ? { ...j, status: "Open" as const, postedDate: new Date().toISOString().split("T")[0] } : j))
    );
    showToast("Expired job renewed for an additional 30 days!");
  };

  // Filter Jobs Logic
  const filteredJobs = jobsList.filter(job => {
    // Tab filter
    if (activeTab === "featured" && !job.isFeatured) return false;
    if (activeTab === "drafts" && job.status !== "Draft") return false;
    if (activeTab === "expired" && job.status !== "Expired") return false;
    if (activeTab === "all" && (job.status === "Draft" || job.status === "Expired")) return false;
    if (activeTab === "recommended" && (job.status === "Draft" || job.status === "Expired")) return false;
    if (activeTab === "nearby" && (job.status === "Draft" || job.status === "Expired")) return false;

    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        job.title.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.suburb.toLowerCase().includes(q) ||
        job.employerName.toLowerCase().includes(q) ||
        job.requiredSkills.some(s => s.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Role filter
    if (selectedRole !== "All" && job.roleNeeded !== selectedRole) return false;

    // City filter
    if (selectedCity !== "All" && job.city !== selectedCity) return false;

    // Work Type filter
    if (selectedWorkType !== "All" && job.workType !== selectedWorkType) return false;

    // Salary filter
    if (job.offeredSalaryUSD > maxSalary) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Toast Notification Banner */}
      {notificationMsg && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-950 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Module Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-800/60 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-black shadow-sm">
                <Briefcase className="w-3.5 h-3.5" />
                <span>WORKER VIEW • JOBS POSTED BY EMPLOYERS</span>
              </div>
              <div className="inline-flex items-center space-x-1 px-2.5 py-1 bg-teal-800/80 rounded-full text-[11px] font-semibold text-teal-200 border border-teal-700/50">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
                <span>Verified Household Openings</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Household & Domestic Jobs in Zimbabwe
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              For Maids, Housekeepers, Nannies, Caregivers, Cooks, Gardeners & Artisans. Browse open household positions posted by families across Harare, Bulawayo, Mutare & other cities. Apply directly or contact employers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onNavigateToMarketplace && (
              <button
                onClick={onNavigateToMarketplace}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center space-x-1.5 active:scale-95 border border-emerald-300/40"
              >
                <Users className="w-4 h-4 text-slate-950" />
                <span>Looking to Hire? Browse Maids →</span>
              </button>
            )}

            <button
              onClick={() => setIsEmployerHiringModalOpen(true)}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>Post Employer Vacancy</span>
            </button>

            <button
              onClick={() => setActiveTab("calculator")}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-emerald-300 border border-slate-700 font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Salary Calculator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex flex-wrap items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "all" ? "bg-emerald-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Search className="w-3.5 h-3.5 text-emerald-400" />
          <span>All Open Vacancies ({jobsList.filter(j => j.status !== "Draft" && j.status !== "Expired").length})</span>
        </button>

        <button
          onClick={() => setActiveTab("featured")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "featured" ? "bg-amber-500 text-slate-950 shadow-md" : "text-slate-700 hover:bg-amber-50"
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-900" />
          <span>Featured & Urgent ({jobsList.filter(j => j.isFeatured).length})</span>
        </button>

        <button
          onClick={() => setActiveTab("recommended")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "recommended" ? "bg-emerald-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>AI Recommended</span>
        </button>

        <button
          onClick={() => setActiveTab("nearby")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "nearby" ? "bg-emerald-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Nearby Suburbs</span>
        </button>

        <button
          onClick={() => setActiveTab("drafts")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "drafts" ? "bg-emerald-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
          <span>Draft Jobs ({jobsList.filter(j => j.status === "Draft").length})</span>
        </button>

        <button
          onClick={() => setActiveTab("expired")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "expired" ? "bg-emerald-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <History className="w-3.5 h-3.5 text-emerald-400" />
          <span>Expired / Archived ({jobsList.filter(j => j.status === "Expired").length})</span>
        </button>

        <button
          onClick={() => setActiveTab("templates")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "templates" ? "bg-emerald-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>Job Templates</span>
        </button>

        <button
          onClick={() => setActiveTab("calculator")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "calculator" ? "bg-emerald-900 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Calculator className="w-3.5 h-3.5 text-emerald-400" />
          <span>Salary Calculator</span>
        </button>
      </div>

      {/* SEARCH & FILTERS BAR (For Listing Tabs) */}
      {["all", "featured", "recommended", "nearby", "drafts", "expired"].includes(activeTab) && (
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search jobs by title, skills, suburb, or employer..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Active Categories ({publicCategories.length})</option>
                {publicCategories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.activeJobCount} Openings)
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <select
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Cities & Towns</option>
                {ALL_ZIMBABWE_CITIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-emerald-600" />
                <span>Work Mode:</span>
              </span>
              {["All", "Full-Time", "Live-In", "Part-Time", "One-Time Task"].map(mode => (
                <button
                  key={mode}
                  onClick={() => setSelectedWorkType(mode)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                    selectedWorkType === mode
                      ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 text-slate-500">
              <span>Max Offer: <strong>${maxSalary} USD</strong></span>
              <input
                type="range"
                min="100"
                max="800"
                step="25"
                value={maxSalary}
                onChange={e => setMaxSalary(Number(e.target.value))}
                className="w-24 accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* JOB LISTINGS GRID */}
      {["all", "featured", "recommended", "nearby", "drafts", "expired"].includes(activeTab) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>Showing <strong>{filteredJobs.length}</strong> vacancies</span>
            {activeTab === "recommended" && (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 95%+ Skill & Location Match Algorithm
              </span>
            )}
            {activeTab === "nearby" && (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Borrowdale, Avondale, Mt Pleasant Radius (&lt; 5km)
              </span>
            )}
          </div>

          {filteredJobs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">No vacancies match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try resetting your search filter, adjusting salary range, or browsing preset job templates.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRole("All");
                  setSelectedCity("All");
                  setSelectedWorkType("All");
                  setMaxSalary(800);
                }}
                className="px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-xl"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map(job => (
                <div
                  key={job.id}
                  className={`bg-white border rounded-3xl p-5 shadow-sm space-y-4 transition-all hover:shadow-md relative ${
                    job.isFeatured ? "border-amber-300 ring-1 ring-amber-200/80 bg-gradient-to-b from-amber-50/30 to-white" : "border-slate-200"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-extrabold rounded-md uppercase">
                          {job.roleNeeded}
                        </span>
                        {job.urgent && (
                          <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded uppercase tracking-wider flex items-center gap-1">
                            <Flame className="w-3 h-3" /> URGENT
                          </span>
                        )}
                        {job.isFeatured && (
                          <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-extrabold rounded flex items-center gap-1">
                            <Star className="w-3 h-3 fill-slate-950" /> FEATURED
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug">{job.title}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.employerName}</span>
                        <span>•</span>
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{job.suburb}, {job.city}</span>
                      </p>
                    </div>

                    {/* Salary Tag */}
                    <div className="text-right shrink-0">
                      <div className="text-lg font-black text-emerald-800 font-mono">
                        ${job.offeredSalaryUSD} <span className="text-[10px] text-slate-500 font-normal">USD</span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">{job.payFrequency}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{job.description}</p>

                  {/* Structured Employer Hiring Spec / Household Badges */}
                  {(job.helperType || job.primaryFocus || job.householdDetails || job.staffAccommodation || job.specialNeeds) && (
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 space-y-2 text-[11px]">
                      <div className="flex flex-wrap items-center gap-1.5 font-bold">
                        {job.helperType && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-md flex items-center gap-1">
                            <Home className="w-3 h-3 text-emerald-700" />
                            <span>{job.helperType}</span>
                          </span>
                        )}
                        {job.primaryFocus && (
                          <span className="px-2 py-0.5 bg-teal-100 text-teal-900 rounded-md flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-teal-700" />
                            <span>Focus: {job.primaryFocus}</span>
                          </span>
                        )}
                        {job.preferredAges && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md">
                            Age: {job.preferredAges}
                          </span>
                        )}
                      </div>

                      {job.householdDetails && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-slate-600">
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 text-[10px]">
                            <Users className="w-3 h-3 text-slate-400" />
                            <span><strong>{job.householdDetails.numberOfKids}</strong> Kids</span>
                          </div>
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 text-[10px]">
                            <Users className="w-3 h-3 text-slate-400" />
                            <span><strong>{job.householdDetails.numberOfAdults}</strong> Adults</span>
                          </div>
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 text-[10px]">
                            <Bed className="w-3 h-3 text-slate-400" />
                            <span><strong>{job.householdDetails.numberOfBedrooms}</strong> Beds</span>
                          </div>
                          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 text-[10px] truncate">
                            <Dog className="w-3 h-3 text-slate-400" />
                            <span className="truncate">{job.householdDetails.pets || "No Pets"}</span>
                          </div>
                        </div>
                      )}

                      {job.specialNeeds && (
                        <div className="text-[10px] text-amber-900 bg-amber-50/80 px-2 py-1 rounded-lg border border-amber-200/60 font-medium">
                          <strong>Special Needs:</strong> {job.specialNeeds}
                        </div>
                      )}

                      {(job.proposedOffDays || job.staffAccommodation) && (
                        <div className="text-[10px] text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
                          {job.proposedOffDays && (
                            <span>🗓️ <strong>Off-Days:</strong> {job.proposedOffDays}</span>
                          )}
                          {job.staffAccommodation && (
                            <span>🏡 <strong>Accommodation:</strong> {job.staffAccommodation}</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Required Skills Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.requiredSkills.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-medium rounded-md">
                        {sk}
                      </span>
                    ))}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Posted {job.postedDate}</span>
                      <span>•</span>
                      <UserCheck className="w-3 h-3 text-emerald-600" />
                      <span>{job.applicantCount} Applicants</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {job.status === "Draft" ? (
                        <button
                          onClick={() => handlePublishDraft(job.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all"
                        >
                          Publish Live
                        </button>
                      ) : job.status === "Expired" ? (
                        <button
                          onClick={() => handleRenewJob(job.id)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center space-x-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Renew 30 Days</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => setApplyingJob(job)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-1 active:scale-95"
                          >
                            <Send className="w-3 h-3" />
                            <span>Apply for Job</span>
                          </button>
                          <button
                            onClick={() => handleWhatsAppApply(job)}
                            className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs rounded-xl border border-teal-200 transition-all flex items-center space-x-1"
                            title="Apply via WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setEditingJob(job);
                          setFormData({
                            title: job.title,
                            roleNeeded: job.roleNeeded,
                            employerName: job.employerName,
                            city: job.city,
                            suburb: job.suburb,
                            offeredSalaryUSD: job.offeredSalaryUSD,
                            payFrequency: job.payFrequency as any,
                            workType: job.workType as any,
                            description: job.description,
                            requiredSkills: job.requiredSkills.join(", "),
                            urgent: job.urgent,
                            isFeatured: !!job.isFeatured,
                          });
                          setShowCreateModal(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                        title="Edit Vacancy"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeletingJobId(job.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Delete Vacancy"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* JOB TEMPLATES TAB */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-2">
            <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>Standard Domestic & Household Job Templates</span>
            </h2>
            <p className="text-xs text-slate-600">
              Select a pre-configured template tailored to standard Zimbabwean household roles to quickly publish a vacancy with pre-written duties and salary guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {JOB_TEMPLATES.map((tmpl, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-200 text-[10px] font-extrabold rounded-md uppercase">
                    {tmpl.roleNeeded}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{tmpl.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{tmpl.description}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {tmpl.skills.map((sk, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-medium rounded">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="font-mono font-bold text-emerald-800 text-xs">${tmpl.salaryUSD} USD/mo</span>
                  <button
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center space-x-1"
                  >
                    <span>Use Template</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SALARY CALCULATOR TAB */}
      {activeTab === "calculator" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Calculator className="w-6 h-6 text-emerald-600" />
                <span>Zimbabwe Domestic & Skilled Worker Salary Calculator</span>
              </h2>
              <p className="text-xs text-slate-500">
                Calculates legal statutory minimum guidelines (Zim Labour Act) & competitive market rates across Harare, Bulawayo & regional tiers.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-mono font-bold text-xs rounded-xl border border-emerald-200">
              Rates for August 2026
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Controls */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Role & Skill Classification</label>
                <select
                  value={calcRoleCategory}
                  onChange={e => setCalcRoleCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="unskilled">General Cleaner / Yard Worker (Unskilled)</option>
                  <option value="skilled_housekeeper">Skilled Housekeeper & Cook (Grade 2)</option>
                  <option value="nanny_caregiver">Certified Nanny & Nurse Aide (Grade 3)</option>
                  <option value="artisan">Certified Journeyman Artisan / Chef (Grade 4)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Accommodation Arrangement</label>
                  <select
                    value={calcWorkMode}
                    onChange={e => setCalcWorkMode(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="live_in">Live-In (Housing & Meals Provided)</option>
                    <option value="live_out">Live-Out (Commuter Allowance Added)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Location Suburb Tier</label>
                  <select
                    value={calcLocationTier}
                    onChange={e => setCalcLocationTier(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="low_density">Harare Low Density (Borrowdale, Mt Pleasant)</option>
                    <option value="medium_density">Harare Medium Density (Avondale, Greendale)</option>
                    <option value="high_density">High Density & Outlying Towns</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800">Working Hours Per Week</label>
                  <span className="font-mono font-bold text-emerald-800">{calcHoursPerWeek} Hours</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="60"
                  step="5"
                  value={calcHoursPerWeek}
                  onChange={e => setCalcHoursPerWeek(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Results Box */}
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <span className="text-xs text-amber-300 font-mono font-bold uppercase">Calculated Wage Breakdown</span>
                <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-black rounded">STATUTORY COMPLIANT</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Recommended Net Monthly Take-Home:</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-400 font-mono">${calcResult.netRecommendedUSD} USD</span>
                    <div className="text-[10px] text-slate-400 font-mono">≈ {calcResult.netRecommendedZWG.toLocaleString()} ZWG</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Statutory Minimum Guideline:</span>
                    <span className="font-mono font-bold text-slate-200">${calcResult.statutoryMinUSD} USD</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Commuter/Transport Allowance:</span>
                    <span className="font-mono font-bold text-slate-200">${calcResult.housingAllowance} USD</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Estimated Employer Budget (incl. Escrow):</span>
                    <span className="font-mono font-bold text-emerald-300">${calcResult.employerTotalCostUSD} USD</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    offeredSalaryUSD: calcResult.netRecommendedUSD,
                    workType: calcWorkMode === "live_in" ? "Live-In" : "Full-Time",
                  }));
                  setShowCreateModal(true);
                  showToast(`Applied calculated wage $${calcResult.netRecommendedUSD} USD to new job form!`);
                }}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Apply Calculated Rate to New Job Vacancy</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT JOB MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <span>{editingJob ? "Edit Job Vacancy" : "Create New Job Vacancy"}</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Vacancy Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Live-In Nanny & Housekeeper in Borrowdale"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role / Category Needed</label>
                  <select
                    value={formData.roleNeeded}
                    onChange={e => setFormData({ ...formData, roleNeeded: e.target.value as UserRole })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  >
                    {categories
                      .filter((c) => c.status === "Active")
                      .map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.type})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Employer / Household Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Tagwirei Residence"
                    value={formData.employerName}
                    onChange={e => setFormData({ ...formData, employerName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City Location</label>
                  <select
                    value={formData.city}
                    onChange={e => {
                      const newCity = e.target.value as CityLocation;
                      const citySuburbs = getSuburbsForCity(newCity);
                      setFormData({
                        ...formData,
                        city: newCity,
                        suburb: citySuburbs.length > 1 ? citySuburbs[1] : citySuburbs[0]
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {ALL_ZIMBABWE_CITIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Suburb / Area</label>
                  <select
                    value={formData.suburb}
                    onChange={e => setFormData({ ...formData, suburb: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {getSuburbsForCity(formData.city).map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Offered Salary ($ USD)</label>
                  <input
                    type="number"
                    value={formData.offeredSalaryUSD}
                    onChange={e => setFormData({ ...formData, offeredSalaryUSD: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pay Frequency</label>
                  <select
                    value={formData.payFrequency}
                    onChange={e => setFormData({ ...formData, payFrequency: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Daily">Daily</option>
                    <option value="One-Time Task">One-Time Task</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Work Arrangement</label>
                  <select
                    value={formData.workType}
                    onChange={e => setFormData({ ...formData, workType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Live-In">Live-In</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="One-Time Task">One-Time Task</option>
                  </select>
                </div>
              </div>

              {/* Helper Type & Primary Focus */}
              <div className="grid grid-cols-2 gap-2 bg-emerald-50/60 p-2.5 rounded-2xl border border-emerald-200/60">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Helper Type</label>
                  <select
                    value={formData.helperType}
                    onChange={e => setFormData({ ...formData, helperType: e.target.value as HelperType })}
                    className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  >
                    <option value="Live-In">Live-In</option>
                    <option value="Live-Out/Day Worker">Live-Out / Day Worker</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Primary Focus</label>
                  <select
                    value={formData.primaryFocus}
                    onChange={e => setFormData({ ...formData, primaryFocus: e.target.value as PrimaryFocusRole })}
                    className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  >
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Nanny">Nanny</option>
                    <option value="Elderly Care">Elderly Care</option>
                    <option value="Chef">Chef</option>
                    <option value="Gardener">Gardener</option>
                    <option value="Maid">Maid</option>
                  </select>
                </div>
              </div>

              {/* Household Specs */}
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800">Household Details</span>
                  <span className="text-[10px] text-slate-500">For accurate candidate matching</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Kids Count</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.numKids}
                      onChange={e => setFormData({ ...formData, numKids: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Adults Count</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.numAdults}
                      onChange={e => setFormData({ ...formData, numAdults: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Bedrooms</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.numBedrooms}
                      onChange={e => setFormData({ ...formData, numBedrooms: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Pets Info</label>
                    <input
                      type="text"
                      placeholder="e.g. 2 Dogs"
                      value={formData.pets}
                      onChange={e => setFormData({ ...formData, pets: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Preferred Helper Ages</label>
                    <input
                      type="text"
                      placeholder="e.g. 25 - 45 years"
                      value={formData.preferredAges}
                      onChange={e => setFormData({ ...formData, preferredAges: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Proposed Off Days</label>
                    <input
                      type="text"
                      placeholder="e.g. Alternate weekends / Every Sunday"
                      value={formData.proposedOffDays}
                      onChange={e => setFormData({ ...formData, proposedOffDays: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">Staff Accommodation</label>
                  <input
                    type="text"
                    placeholder="e.g. Own en-suite bedroom with solar power & WiFi"
                    value={formData.staffAccommodation}
                    onChange={e => setFormData({ ...formData, staffAccommodation: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Special Needs Blank Space */}
              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center justify-between">
                  <span>Special Needs & Requests (Blank space for employer requirements)</span>
                  <span className="text-[10px] text-emerald-600 font-normal">Optional</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Specify any dietary requirements, medical support, infant experience, swimming skills, solar handling..."
                  value={formData.specialNeeds}
                  onChange={e => setFormData({ ...formData, specialNeeds: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Job Description & Duties</label>
                <textarea
                  rows={2}
                  placeholder="Describe household duties, working hours, and expectations..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="First Aid, Deep Cleaning, Cooking, English Fluent"
                  value={formData.requiredSkills}
                  onChange={e => setFormData({ ...formData, requiredSkills: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center space-x-6 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.urgent}
                    onChange={e => setFormData({ ...formData, urgent: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Mark as Urgent Hiring</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Feature Listing ($5 USD)</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleSaveJob("Draft")}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveJob("Open")}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
                >
                  {editingJob ? "Save Changes" : "Publish Vacancy Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Employer Hiring Form Modal */}
      <EmployerHiringModal
        isOpen={isEmployerHiringModalOpen}
        onClose={() => setIsEmployerHiringModalOpen(false)}
        onSubmitSuccess={handleEmployerHiringSuccess}
      />

      {/* JOB APPLICATION MODAL (FOR DOMESTIC WORKERS) */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 border border-slate-200 relative my-8 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setApplyingJob(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full text-xs font-black uppercase mb-2">
                <Send className="w-3.5 h-3.5" />
                <span>Worker Job Application</span>
              </div>
              <h2 className="text-xl font-black text-slate-900">{applyingJob.title}</h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                <span className="font-semibold text-emerald-800">{applyingJob.employerName}</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {applyingJob.suburb}, {applyingJob.city}
                  </span>
                </span>
                <span>•</span>
                <span className="font-bold text-slate-900">${applyingJob.offeredSalaryUSD} USD/mo</span>
              </div>
            </div>

            <form onSubmit={handleApplyJob} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Memory Moyo"
                  value={applicantForm.fullName}
                  onChange={(e) => setApplicantForm({ ...applicantForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+263 77..."
                    value={applicantForm.phone}
                    onChange={(e) => setApplicantForm({ ...applicantForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Years of Experience</label>
                  <select
                    value={applicantForm.experienceYears}
                    onChange={(e) => setApplicantForm({ ...applicantForm, experienceYears: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3-5 Years</option>
                    <option value="6+">6+ Years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Your Key Skills</label>
                <input
                  type="text"
                  value={applicantForm.skills}
                  onChange={(e) => setApplicantForm({ ...applicantForm, skills: e.target.value })}
                  placeholder="e.g. Ironing, Cooking, Child Care, Baking"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">Introduction Note for Employer</label>
                <textarea
                  rows={3}
                  value={applicantForm.message}
                  onChange={(e) => setApplicantForm({ ...applicantForm, message: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/80 text-xs">
                <label className="flex items-center space-x-2.5 cursor-pointer font-bold text-emerald-950">
                  <input
                    type="checkbox"
                    checked={applicantForm.hasPoliceClearance}
                    onChange={(e) => setApplicantForm({ ...applicantForm, hasPoliceClearance: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>I have or can obtain a valid ZRP Police Clearance</span>
                </label>
                <label className="flex items-center space-x-2.5 cursor-pointer font-bold text-emerald-950">
                  <input
                    type="checkbox"
                    checked={applicantForm.hasReferences}
                    onChange={(e) => setApplicantForm({ ...applicantForm, hasReferences: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>I have reachable contact references from previous households</span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingApp}
                  className="w-full sm:flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmittingApp ? "Submitting..." : "Submit Application"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleWhatsAppApply(applyingJob)}
                  className="w-full sm:w-auto px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Apply via WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingJobId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Delete Job Vacancy?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to remove this vacancy listing? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center space-x-2 pt-2">
              <button
                onClick={() => setDeletingJobId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(deletingJobId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
