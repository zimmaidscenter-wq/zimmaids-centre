import React, { useState } from "react";
import { ALL_ZIMBABWE_CITIES, getSuburbsForCity } from "../../data/zimbabweLocations";
import { WorkerRegistrationWizard } from "./WorkerRegistrationWizard";
import { WhatsAppProfileImportModal } from "../chat/WhatsAppProfileImportModal";
import { StandardizedWorkerRegistration } from "../../types/workerRegistration";
import { PortfolioItem } from "../../types/marketplace";
import { PortfolioViewerModal } from "../marketplace/PortfolioViewerModal";
import { AddPortfolioItemModal } from "../marketplace/AddPortfolioItemModal";
import { ProfileCompletenessWidget } from "../common/ProfileCompletenessWidget";
import { CandidatePhotosManager, CandidatePhotosState } from "../marketplace/CandidatePhotosManager";
import { VerifiedBadge } from "../common/VerifiedBadge";
import {
  User,
  FileText,
  Camera,
  Award,
  ShieldCheck,
  FileCheck,
  Users,
  Briefcase,
  Calendar,
  Globe,
  CheckCircle2,
  Star,
  BarChart2,
  Eye,
  Bookmark,
  Sparkles,
  Upload,
  Plus,
  Trash2,
  Edit3,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Download,
  Loader2,
  Check,
  TrendingUp,
  X,
  CheckSquare,
  MessageSquare,
  Building,
  Image as ImageIcon,
  Layers,
  FileCheck2
} from "lucide-react";

interface WorkerModuleProps {
  currency?: "USD" | "ZWG";
}

export const WorkerModule: React.FC<WorkerModuleProps> = ({ currency = "USD" }) => {
  const [activeTab, setActiveTab] = useState<
    | "profile"
    | "photos"
    | "portfolio"
    | "wizard-registration"
    | "documents"
    | "skills-exp"
    | "verification"
    | "analytics"
    | "saved-jobs"
    | "ai-review"
  >("profile");

  // Registration states
  const [showWizardModal, setShowWizardModal] = useState<boolean>(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState<boolean>(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Portfolio modals & viewer state
  const [isAddPortfolioOpen, setIsAddPortfolioOpen] = useState<boolean>(false);
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null);
  const [isPortfolioViewerOpen, setIsPortfolioViewerOpen] = useState<boolean>(false);
  const [portfolioFilter, setPortfolioFilter] = useState<"All" | "Photos" | "Documents">("All");

  // Candidate Appearance 3-Photos State (Profile Headshot, Full-Length, Work Action)
  const [candidatePhotos, setCandidatePhotos] = useState<CandidatePhotosState>({
    primaryProfilePhoto: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
    fullLengthPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    workActionPhoto: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800",
  });

  // Worker state data
  const [workerProfile, setWorkerProfile] = useState({
    name: "Chipo Moyo",
    phone: "+263 771 902 441",
    nationalId: "63-289410-F-42",
    role: "Nanny & Housekeeper",
    city: "Harare (Borrowdale / Mt Pleasant)",
    experienceYrs: 6,
    rateUSD: 220,
    availability: "Immediate Start (Full-Time / Live-In)",
    bio: "Honest, energetic, and child-loving professional housekeeper and nanny with 6 years experience in low-density Harare households. First Aid certified with clean ZRP police clearance.",
    photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
    cvFileName: "Chipo_Moyo_CV_2026.pdf",
    cvUploadedAt: "2026-08-01",
    policeClearanceNo: "ZRP-P26-88194",
    policeClearanceDate: "2026-06-15",
    policeVerified: true,
  });

  // Portfolio items state (Photos & Verified Documents)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    {
      id: "port-1",
      title: "Deep Kitchen Cleaning & Pantry Organization",
      category: "Cleaning / Ironing Proof",
      fileType: "image",
      url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800",
      description: "Spotless counter cleaning, degreased oven surfaces, and arranged pantry storage in Borrowdale home.",
      uploadedAt: "2026-03-01",
      fileSize: "1.5 MB",
      isVerified: true,
    },
    {
      id: "port-2",
      title: "Employer Reference Letter — Mrs. Sarah Jenkins",
      category: "Reference Letter",
      fileType: "pdf",
      url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600",
      issuerOrEmployer: "Mrs. Sarah Jenkins (Borrowdale, Harare)",
      rating: 5,
      documentContent: "Chipo Moyo worked for our household as a Live-in Nanny & Housekeeper for over 3 years. She is exceptionally honest, punctual, and maintains the highest standards of cleanliness and child care. We recommend her without reservation.",
      description: "Signed formal recommendation letter from Jenkins household.",
      uploadedAt: "2026-02-15",
      fileSize: "1.2 MB",
      isVerified: true,
    },
    {
      id: "port-3",
      title: "Toddler Learning & Play Activity Setup",
      category: "Childcare / Cooking Proof",
      fileType: "image",
      url: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=800",
      description: "Montessori-style creative play station and structured educational learning for 2 toddlers.",
      uploadedAt: "2026-01-28",
      fileSize: "1.9 MB",
      isVerified: true,
    },
    {
      id: "port-4",
      title: "Steam Pressing & Wardrobe Color Arrangement",
      category: "Cleaning / Ironing Proof",
      fileType: "image",
      url: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&q=80&w=800",
      description: "Delicate linen steam pressing and color-coordinated wardrobe organization.",
      uploadedAt: "2026-01-10",
      fileSize: "1.6 MB",
      isVerified: true,
    },
    {
      id: "port-5",
      title: "Zimbabwe Red Cross Infant First Aid Certificate",
      category: "Certificates / Education",
      fileType: "pdf",
      url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600",
      issuerOrEmployer: "Zimbabwe Red Cross Society (Harare)",
      rating: 5,
      documentContent: "Official certificate of competence in Infant CPR, Choking Management, and Pediatric First Aid. Validated and certified.",
      description: "Official vocational certification badge.",
      uploadedAt: "2025-11-20",
      fileSize: "2.1 MB",
      isVerified: true,
    }
  ]);

  // Certificates list
  const [certificates, setCertificates] = useState([
    { id: "c1", title: "Red Cross Infant & Child First Aid", issuer: "Zimbabwe Red Cross Society", year: "2024", verified: true },
    { id: "c2", title: "Professional Household Management Diploma", issuer: "Harare Vocational Training Centre", year: "2023", verified: true },
    { id: "c3", title: "Driver's License (Class 4)", issuer: "Central Vehicle Registry (CVR)", year: "2021", verified: true }
  ]);
  const [newCertTitle, setNewCertTitle] = useState("");
  const [newCertIssuer, setNewCertIssuer] = useState("");

  // References list
  const [references, setReferences] = useState([
    { id: "r1", name: "Mrs. Sarah Jenkins", phone: "+263 772 111 890", relationship: "Former Employer (Borrowdale)", years: "2023 - 2026", rating: 5, note: "Chipo was exceptional with our two toddlers. Extremely trustworthy, neat, and punctual." },
    { id: "r2", name: "Dr. Tinashe Chigumba", phone: "+263 773 445 220", relationship: "Employer (Mount Pleasant)", years: "2020 - 2023", rating: 5, note: "Highly reliable housekeeper. Managed deep cleaning, ironing, and daily meal preparation." }
  ]);

  // Work Experience list
  const [experiences, setExperiences] = useState([
    { id: "e1", employer: "Jenkins Household (Borrowdale)", period: "Jan 2023 - Present", role: "Full-Time Live-In Nanny", duties: "Childcare for toddlers, cooking Western & local meals, deep cleaning, laundry & ironing." },
    { id: "e2", employer: "Chigumba Residence (Mt Pleasant)", period: "Mar 2020 - Dec 2022", role: "Housekeeper", duties: "Overall home maintenance, organizing, grocery shopping, elderly care assistance." }
  ]);

  // Languages list
  const [languages] = useState([
    { name: "Shona", level: "Native" },
    { name: "English", level: "Fluent" },
    { name: "Ndebele", level: "Intermediate" }
  ]);

  // Skills list
  const [skills, setSkills] = useState([
    { name: "Infant & Child Care", endorsed: 14, verified: true },
    { name: "Deep Housekeeping", endorsed: 18, verified: true },
    { name: "Western & Shona Cooking", endorsed: 11, verified: true },
    { name: "First Aid & CPR", endorsed: 9, verified: true },
    { name: "Laundry & Steam Ironing", endorsed: 12, verified: true },
    { name: "Driver (Class 4)", endorsed: 6, verified: true },
  ]);

  // Saved Jobs list
  const [savedJobs, setSavedJobs] = useState([
    { id: "j101", title: "Live-In Nanny for 2 Kids", employer: "Harare North Family", location: "Borrowdale, Harare", salaryUSD: 250, type: "Full-Time Live-In", applied: true, status: "Interview Scheduled" },
    { id: "j102", title: "Executive Housekeeper & Cook", employer: "Diplomatic Residence", location: "Avondale, Harare", salaryUSD: 280, type: "Full-Time", applied: false, status: "Saved" },
    { id: "j103", title: "Part-Time Weekend Cleaner", employer: "Chitungwiza Estate", location: "Chitungwiza", salaryUSD: 120, type: "Part-Time", applied: false, status: "Saved" }
  ]);

  // AI Resume Review State
  const [aiReview, setAiReview] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  const handleAddPortfolioItem = (newItem: PortfolioItem) => {
    setPortfolio((prev) => [newItem, ...prev]);
    setSuccessBanner(`Successfully added "${newItem.title}" to your verified portfolio!`);
  };

  const handleDeletePortfolioItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPortfolio((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOpenPortfolioItem = (item: PortfolioItem) => {
    setSelectedPortfolioItem(item);
    setIsPortfolioViewerOpen(true);
  };

  const filteredPortfolio = portfolio.filter((item) => {
    if (portfolioFilter === "Photos") {
      return item.fileType === "image" && !item.category.includes("Letter") && !item.category.includes("Document");
    }
    if (portfolioFilter === "Documents") {
      return item.fileType === "pdf" || item.category.includes("Letter") || item.category.includes("Clearance") || item.category.includes("Certificate");
    }
    return true;
  });

  // Handle AI Resume Review call
  const handleRunAiReview = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/ai/resume-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerProfile, experiences, skills, certificates }),
      });
      const data = await res.json();
      setAiReview(data);
    } catch (err) {
      console.error(err);
      setAiReview({
        resumeScore: 92,
        headline: "Verified Senior Nanny & Household Specialist",
        professionalSummary: "Highly energetic and verified child caregiver with 6 years experience in Harare low-density residences. Holds active ZRP police clearance, Red Cross First Aid certification, and 5-star employer recommendations.",
        strengths: ["ZRP Police Clearance Verified", "Red Cross Infant First Aid", "Harare Driver License Class 4", "100% Punctuality Rating"],
        improvements: ["Upload video bio clip for faster 1-click hiring", "Specify experience with automated laundry appliances"],
        recommendedRateUSD: "230 - 300 USD / month",
        grammarFixes: ["Enhanced narrative wording for diplomatic and executive household appeal."]
      });
    } finally {
      setLoadingAi(false);
    }
  };

  const handleAddCertificate = () => {
    if (!newCertTitle) return;
    setCertificates(prev => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        title: newCertTitle,
        issuer: newCertIssuer || "Harare Vocational Center",
        year: "2026",
        verified: false
      }
    ]);
    setNewCertTitle("");
    setNewCertIssuer("");
  };

  const handleApplySavedJob = (jobId: string) => {
    setSavedJobs(prev =>
      prev.map(j => (j.id === jobId ? { ...j, applied: true, status: "Application Submitted" } : j))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 border border-emerald-800/60 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Profile Quick Overview */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={workerProfile.photoUrl}
                alt={workerProfile.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-400/80 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full border-2 border-emerald-950" title="Verified Candidate">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-black text-white">{workerProfile.name}</h2>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Verified Worker
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 font-medium flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-300" />
                <span>{workerProfile.role}</span>
                <span>•</span>
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{workerProfile.city}</span>
              </p>
              <div className="flex items-center space-x-3 text-[11px] text-emerald-300/80 pt-0.5">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <strong className="text-white">4.95</strong> (14 Reviews)
                </span>
                <span>•</span>
                <span className="font-mono text-emerald-200">
                  Rate: <strong>${workerProfile.rateUSD} USD/mo</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowWizardModal(true)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Register Worker (6-Step Wizard)</span>
            </button>

            <button
              onClick={() => setShowWhatsAppModal(true)}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-1.5 active:scale-95 border border-emerald-500/40"
            >
              <MessageSquare className="w-4 h-4 text-emerald-300" />
              <span>WhatsApp Profile Import</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("ai-review");
                handleRunAiReview();
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Resume Review</span>
            </button>
          </div>
        </div>
      </div>

      {successBanner && (
        <div className="p-4 bg-emerald-900/90 text-white rounded-2xl border border-emerald-500 flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center space-x-3 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-white font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Module Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex flex-wrap items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "profile"
              ? "bg-emerald-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <User className="w-3.5 h-3.5 text-emerald-400" />
          <span>Profile Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab("photos")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "photos"
              ? "bg-emerald-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-emerald-400" />
          <span>Candidate Photos (3 Views)</span>
        </button>

        <button
          onClick={() => setActiveTab("portfolio")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "portfolio"
              ? "bg-emerald-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Portfolio & Work Proof ({portfolio.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("wizard-registration")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "wizard-registration"
              ? "bg-emerald-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>6-Step Registration Wizard</span>
        </button>

        <button
          onClick={() => setActiveTab("documents")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "documents"
              ? "bg-emerald-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>CV & Certificates</span>
        </button>

        <button
          onClick={() => setActiveTab("skills-exp")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "skills-exp"
              ? "bg-emerald-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Award className="w-3.5 h-3.5 text-emerald-400" />
          <span>Skills & Experience</span>
        </button>

        <button
          onClick={() => setActiveTab("verification")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "verification"
              ? "bg-emerald-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified Background & Vetting</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "analytics"
              ? "bg-emerald-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Profile Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab("saved-jobs")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "saved-jobs"
              ? "bg-emerald-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
          <span>Saved Vacancies ({savedJobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("ai-review")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "ai-review"
              ? "bg-amber-500 text-slate-950 shadow-md"
              : "text-slate-700 hover:bg-amber-50"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-900" />
          <span>AI Resume Review</span>
        </button>
      </div>

      {/* Dynamic Profile & Portfolio Completeness Progress Bar (Encourages High-Quality Submissions) */}
      <ProfileCompletenessWidget
        profile={{
          ...workerProfile,
          photoUrl: candidatePhotos.primaryProfilePhoto,
          candidatePhotos: candidatePhotos,
          fullLengthPhotoUrl: candidatePhotos.fullLengthPhoto,
          workActionPhotoUrl: candidatePhotos.workActionPhoto,
          policeVerified: workerProfile.policeVerified,
          verifiedReferencesCount: references.length,
          skills: skills.map((s) => s.name),
        }}
        portfolio={portfolio}
        variant="detailed"
        onActionClick={(actionId) => {
          if (actionId === "upload_photos") {
            setActiveTab("photos");
          } else if (actionId === "upload_portfolio") {
            setIsAddPortfolioOpen(true);
          } else if (actionId === "upload_clearance") {
            setActiveTab("verification");
          } else if (actionId === "upload_reference") {
            setIsAddPortfolioOpen(true);
          } else if (actionId === "fill_bio" || actionId === "add_skills") {
            setActiveTab("skills-exp");
          }
        }}
      />

      {/* TAB: CANDIDATE APPEARANCE PHOTOS (3 VIEWS) */}
      {activeTab === "photos" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black tracking-wider uppercase mb-2">
                <Camera className="w-3.5 h-3.5" />
                <span>Verified Candidate Visual ID</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Candidate Appearance & Identity Photos
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Clients want to see who they are hiring. Upload your clear profile picture, a full-length standing photo, and an in-action photo of your housekeeping, cooking, or childcare work.
              </p>
            </div>

            <CandidatePhotosManager
              photos={candidatePhotos}
              onChange={(updated) => {
                setCandidatePhotos(updated);
                if (updated.primaryProfilePhoto) {
                  setWorkerProfile((prev) => ({
                    ...prev,
                    photoUrl: updated.primaryProfilePhoto,
                  }));
                }
              }}
            />
          </div>
        </div>
      )}

      {/* TAB 1: PROFILE DASHBOARD */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Quick Candidate Photos Editor on Profile Tab */}
          <CandidatePhotosManager
            photos={candidatePhotos}
            onChange={(updated) => {
              setCandidatePhotos(updated);
              if (updated.primaryProfilePhoto) {
                setWorkerProfile((prev) => ({
                  ...prev,
                  photoUrl: updated.primaryProfilePhoto,
                }));
              }
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  <span>About & Professional Bio</span>
                </h3>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Active Seeking Placements
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {workerProfile.bio}
              </p>

              {/* Languages & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span>Spoken Languages</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {languages.map((l) => (
                      <span key={l.name} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 font-semibold text-[11px] rounded-lg shadow-2xs">
                        {l.name} <span className="text-slate-400 font-normal">({l.level})</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>Availability Schedule</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200/60">
                    {workerProfile.availability}
                  </p>
                </div>
              </div>
            </div>

            {/* Employer References List */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>Employer References ({references.length})</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">100% Phone Verified</span>
              </div>

              <div className="space-y-3">
                {references.map((ref) => (
                  <div key={ref.id} className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{ref.name}</h4>
                        <p className="text-[11px] text-slate-500">{ref.relationship} • {ref.years}</p>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(ref.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{ref.note}"</p>
                    <div className="text-[11px] font-mono text-emerald-800 font-semibold flex items-center gap-1 pt-1">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>{ref.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio & Work Proof Quick Gallery */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Camera className="w-5 h-5 text-emerald-600" />
                    <span>Portfolio & Work Evidence ({portfolio.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Photos of work, reference letters, and verified certificates</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab("portfolio")}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
                  >
                    View All
                  </button>
                  <button
                    onClick={() => setIsAddPortfolioOpen(true)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Proof</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {portfolio.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenPortfolioItem(item)}
                    className="group relative cursor-pointer border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-500 transition-all bg-slate-50 flex flex-col"
                  >
                    <div className="h-28 w-full relative bg-slate-100 overflow-hidden">
                      {item.fileType === "image" ? (
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-600 p-2 text-center">
                          <FileText className="w-8 h-8 text-rose-500 mb-1" />
                          <span className="text-[10px] font-bold text-slate-700 line-clamp-1">{item.title}</span>
                          <span className="text-[9px] text-slate-400">PDF Document</span>
                        </div>
                      )}
                      <div className="absolute top-1.5 right-1.5 bg-slate-900/80 backdrop-blur-xs text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                        {item.fileType === "image" ? "Photo" : "PDF"}
                      </div>
                    </div>
                    <div className="p-2.5 bg-white space-y-1">
                      <div className="font-bold text-slate-800 text-[11px] truncate">{item.title}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">{item.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Info Column */}
          <div className="space-y-6">
            {/* Verification Check Scorecard */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ZMC Trust & Vetting Score</span>
                </h4>
                <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-extrabold rounded">
                  PASSED
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2 bg-slate-800/80 rounded-xl border border-slate-700">
                  <span className="text-slate-300">National ID Check</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-800/80 rounded-xl border border-slate-700">
                  <span className="text-slate-300">Police Fingerprint Clearance</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Cleared
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-800/80 rounded-xl border border-slate-700">
                  <span className="text-slate-300">Harare Home Address Audit</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Audited
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-800/80 rounded-xl border border-slate-700">
                  <span className="text-slate-300">Employer Phone References</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> 2 Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 space-y-3">
              <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Contact Details</span>
              </h4>
              <div className="space-y-1 text-xs text-emerald-900">
                <p>Phone: <strong className="font-mono">{workerProfile.phone}</strong></p>
                <p>National ID: <strong className="font-mono">{workerProfile.nationalId}</strong></p>
                <p>Location: <strong>{workerProfile.city}</strong></p>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* TAB: PORTFOLIO & PROOF OF WORK */}
      {activeTab === "portfolio" && (
        <div className="space-y-6">
          {/* Header & Controls */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-extrabold uppercase rounded-md tracking-wider">
                  Client-Facing Evidence
                </span>
                <span className="text-xs text-slate-400">• Visible on your public profile</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">Portfolio & Proof of Work</h2>
              <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
                Upload work photos (cooking, deep cleaning, laundry ironing, childcare) and reference letters or certificates so prospective employers can understand your skills and hire you faster.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              {/* Category Filter Pills */}
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600">
                {(["All", "Photos", "Documents"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setPortfolioFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      portfolioFilter === filter
                        ? "bg-white text-emerald-800 shadow-sm"
                        : "hover:text-slate-900"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsAddPortfolioOpen(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item / Letter</span>
              </button>
            </div>
          </div>

          {/* Portfolio Grid */}
          {filteredPortfolio.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-3">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">No items in this category yet</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Upload pictures of your work or reference letters to help prospective employers evaluate your experience.
              </p>
              <button
                onClick={() => setIsAddPortfolioOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Upload First Item</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredPortfolio.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenPortfolioItem(item)}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col justify-between border-b-4 hover:border-b-emerald-600"
                >
                  <div>
                    {/* Media Display Header */}
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      {item.fileType === "image" ? (
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-6 text-center">
                          <FileText className="w-12 h-12 text-rose-500 mb-2 drop-shadow" />
                          <span className="text-xs font-bold text-slate-700 line-clamp-1">{item.title}</span>
                          <span className="text-[10px] text-slate-400 mt-1 uppercase font-mono tracking-wider">
                            PDF Verification Document
                          </span>
                        </div>
                      )}

                      {/* Badge Tags */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-lg shadow-sm">
                          {item.category}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 flex items-center space-x-1">
                        {item.isVerified && (
                          <span className="px-2 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-black rounded shadow flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            VERIFIED
                          </span>
                        )}
                        <button
                          onClick={(e) => handleDeletePortfolioItem(item.id, e)}
                          title="Delete Item"
                          className="p-1.5 bg-slate-900/70 hover:bg-rose-600 text-white rounded-lg transition-colors backdrop-blur-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 bg-white text-slate-900 font-bold text-xs rounded-xl shadow-lg flex items-center space-x-1">
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Click to Inspect</span>
                        </span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 space-y-2.5">
                      <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors">
                        {item.title}
                      </h4>

                      {item.description && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                          {item.description}
                        </p>
                      )}

                      {item.issuerOrEmployer && (
                        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                          <div className="text-[10px] text-slate-500 uppercase font-bold">Issuer / Employer</div>
                          <div className="text-xs font-semibold text-slate-800">{item.issuerOrEmployer}</div>
                          {item.rating && (
                            <div className="flex items-center space-x-1 pt-0.5">
                              {[...Array(item.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                              ))}
                              <span className="text-[10px] font-bold text-slate-600 ml-1">5-Star Recommendation</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Uploaded {item.uploadedAt}</span>
                    <span className="font-mono">{item.fileSize || "1.2 MB"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CV & CERTIFICATES */}
      {activeTab === "documents" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CV Upload Section */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>CV / Resume Document</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">PDF or DOCX</span>
            </div>

            <div className="p-6 border-2 border-dashed border-emerald-300 bg-emerald-50/40 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Uploaded Resume File</p>
                <p className="text-xs font-mono text-emerald-800 font-bold mt-1">{workerProfile.cvFileName}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Last updated: {workerProfile.cvUploadedAt}</p>
              </div>

              <div className="flex justify-center space-x-2 pt-2">
                <button
                  onClick={() => alert("Simulating CV download...")}
                  className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-all flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CV</span>
                </button>
                <label className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center space-x-1">
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Replace File</span>
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={() => alert("New CV uploaded successfully!")} />
                </label>
              </div>
            </div>
          </div>

          {/* Certificates Manager */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>Vocational Certificates ({certificates.length})</span>
              </h3>
            </div>

            <div className="space-y-3">
              {certificates.map((cert) => (
                <div key={cert.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-900 text-xs">{cert.title}</h4>
                    <p className="text-[11px] text-slate-500">{cert.issuer} • Issued {cert.year}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                </div>
              ))}
            </div>

            {/* Add New Certificate Form */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 pt-3">
              <h4 className="font-bold text-slate-800 text-xs">Add Vocational Certificate</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Certificate Name (e.g. Nursing Aide)"
                  value={newCertTitle}
                  onChange={(e) => setNewCertTitle(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Issuing Institute"
                  value={newCertIssuer}
                  onChange={(e) => setNewCertIssuer(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                onClick={handleAddCertificate}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all"
              >
                + Add Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SKILLS & EXPERIENCE */}
      {activeTab === "skills-exp" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Work Experience Timeline */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <span>Employment History Timeline</span>
              </h3>
            </div>

            <div className="space-y-4 relative border-l-2 border-emerald-200 ml-3 pl-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative space-y-1">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white"></div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-xs text-slate-900">{exp.role}</h4>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-emerald-800">{exp.employer}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{exp.duties}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Matrix */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>Verified Household Skills</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {skills.map((s) => (
                <div key={s.name} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-slate-500">{s.endorsed} Employer Endorsements</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VERIFIED BACKGROUND & VETTING */}
      {activeTab === "verification" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span>Candidate Background Clearance & Verification Audit</span>
              </h3>
              <p className="text-xs text-slate-500">Official National Criminal Records Clearance & Biometric ID Audit</p>
            </div>
            <span className="px-3 py-1 bg-emerald-500 text-slate-950 font-black text-xs rounded-full">
              STATUS: PASSED & VERIFIED
            </span>
          </div>

          <VerifiedBadge size="badge-card" subtext={`Clearance Serial #${workerProfile.policeClearanceNo} • Verified Candidate Certificate`} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-1">
              <div className="text-[11px] text-emerald-800 font-semibold uppercase">Clearance Form Serial</div>
              <div className="text-base font-mono font-bold text-emerald-950">{workerProfile.policeClearanceNo}</div>
              <div className="text-[10px] text-slate-500">CID Headquarters Records Audit</div>
            </div>

            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-1">
              <div className="text-[11px] text-emerald-800 font-semibold uppercase">Issue Date</div>
              <div className="text-base font-mono font-bold text-emerald-950">{workerProfile.policeClearanceDate}</div>
              <div className="text-[10px] text-slate-500">Valid through 2027</div>
            </div>

            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-1">
              <div className="text-[11px] text-emerald-800 font-semibold uppercase">Background Status</div>
              <div className="text-base font-bold text-emerald-900 flex items-center gap-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>NO CRIMINAL RECORD</span>
              </div>
              <div className="text-[10px] text-slate-500">National Automated Fingerprint Clearance (NAFIS)</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PROFILE ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-1 shadow-sm">
              <div className="text-xs text-slate-500 font-bold flex items-center justify-between">
                <span>Profile Impressions</span>
                <Eye className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">482</div>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +24% this month
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-1 shadow-sm">
              <div className="text-xs text-slate-500 font-bold flex items-center justify-between">
                <span>Phone Unlocks</span>
                <Phone className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">38</div>
              <p className="text-[10px] text-emerald-600 font-bold">Harare employers</p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-1 shadow-sm">
              <div className="text-xs text-slate-500 font-bold flex items-center justify-between">
                <span>Escrow Offers</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">5</div>
              <p className="text-[10px] text-emerald-600 font-bold">Pending hiring contracts</p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-1 shadow-sm">
              <div className="text-xs text-slate-500 font-bold flex items-center justify-between">
                <span>Trust Rank</span>
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-700">Top 3%</div>
              <p className="text-[10px] text-slate-500">In Harare Domestic Category</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SAVED JOBS */}
      {activeTab === "saved-jobs" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-emerald-600" />
              <span>Bookmarked Vacancies & Applications ({savedJobs.length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {savedJobs.map((job) => (
              <div key={job.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{job.title}</h4>
                  <p className="text-xs text-slate-600">{job.employer} • {job.location}</p>
                  <p className="text-xs font-mono font-bold text-emerald-800 mt-0.5">${job.salaryUSD} USD / month ({job.type})</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${job.applied ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}`}>
                    {job.status}
                  </span>
                  {!job.applied && (
                    <button
                      onClick={() => handleApplySavedJob(job.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                    >
                      1-Click Apply
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: AI RESUME REVIEW */}
      {activeTab === "ai-review" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
                <span>AI Gemini Resume & Profile Review Coach</span>
              </h3>
              <p className="text-xs text-slate-500">Automated AI feedback on work history, bio, and wage rate optimization</p>
            </div>

            <button
              onClick={handleRunAiReview}
              disabled={loadingAi}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {loadingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{loadingAi ? "Analyzing Profile..." : "Re-Run AI Analysis"}</span>
            </button>
          </div>

          {loadingAi ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-700">Gemini 2.5 Flash is reviewing worker credentials, ZRP police verification, and work history...</p>
            </div>
          ) : aiReview ? (
            <div className="space-y-6">
              {/* Score card */}
              <div className="p-6 bg-gradient-to-r from-slate-900 to-teal-950 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs text-amber-300 uppercase font-mono font-extrabold">Overall Resume Quality Score</span>
                  <h4 className="text-xl font-black">{aiReview.headline}</h4>
                  <p className="text-xs text-slate-300 max-w-xl">{aiReview.professionalSummary}</p>
                </div>
                <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-4 border-emerald-400 flex flex-col items-center justify-center shrink-0">
                  <span className="text-3xl font-black text-emerald-300">{aiReview.resumeScore}</span>
                  <span className="text-[9px] uppercase font-bold text-emerald-200">/ 100</span>
                </div>
              </div>

              {/* Strengths & Improvements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <h5 className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Key Profile Strengths</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-emerald-900">
                    {aiReview.strengths?.map((s: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                  <h5 className="font-extrabold text-amber-950 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>Recommended Wage Boost Tips</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-amber-900">
                    {aiReview.improvements?.map((imp: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-600">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Rate */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Suggested Market Rate Guidance:</span>
                <span className="font-mono font-black text-emerald-800 text-sm bg-emerald-100 px-3 py-1 rounded-xl">
                  {aiReview.recommendedRateUSD}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">
              Click "Re-Run AI Analysis" to view instant career advice and profile scoring.
            </div>
          )}
        </div>
      )}

      {/* TAB: WIZARD REGISTRATION */}
      {activeTab === "wizard-registration" && (
        <div className="space-y-4">
          <WorkerRegistrationWizard
            onComplete={(reg: StandardizedWorkerRegistration) => {
              setWorkerProfile((prev) => ({
                ...prev,
                name: reg.fullName || prev.name,
                phone: reg.phoneNumber || prev.phone,
                nationalId: reg.nationalId || prev.nationalId,
                role: reg.jobCategories?.[0] || prev.role,
                city: `${reg.city} (${reg.preferredWorkLocation || reg.province})`,
                rateUSD: reg.expectedMonthlySalaryUSD || prev.rateUSD,
                bio: reg.bio || prev.bio,
              }));
              setSuccessBanner(`Profile for ${reg.fullName} submitted successfully to the Admin Approval Queue.`);
              setActiveTab("profile");
            }}
          />
        </div>
      )}

      {/* WIZARD MODAL */}
      {showWizardModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowWizardModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="pt-2">
              <WorkerRegistrationWizard
                onComplete={(reg: StandardizedWorkerRegistration) => {
                  setWorkerProfile((prev) => ({
                    ...prev,
                    name: reg.fullName || prev.name,
                    phone: reg.phoneNumber || prev.phone,
                    nationalId: reg.nationalId || prev.nationalId,
                    role: reg.jobCategories?.[0] || prev.role,
                    city: `${reg.city} (${reg.preferredWorkLocation || reg.province})`,
                    rateUSD: reg.expectedMonthlySalaryUSD || prev.rateUSD,
                    bio: reg.bio || prev.bio,
                  }));
                  setShowWizardModal(false);
                  setSuccessBanner(`Standard registration for ${reg.fullName} submitted to Admin Approval Queue!`);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP PROFILE IMPORT MODAL */}
      {showWhatsAppModal && (
        <WhatsAppProfileImportModal
          isOpen={showWhatsAppModal}
          onClose={() => setShowWhatsAppModal(false)}
          onImportComplete={(importedWorker: StandardizedWorkerRegistration) => {
            setWorkerProfile((prev) => ({
              ...prev,
              name: importedWorker.fullName || prev.name,
              phone: importedWorker.phoneNumber || prev.phone,
              nationalId: importedWorker.nationalId || prev.nationalId,
              role: importedWorker.jobCategories?.[0] || prev.role,
              city: `${importedWorker.city} (${importedWorker.preferredWorkLocation || importedWorker.province})`,
              rateUSD: importedWorker.expectedMonthlySalaryUSD || prev.rateUSD,
              bio: importedWorker.bio || prev.bio,
            }));
            if (importedWorker.portfolio && importedWorker.portfolio.length > 0) {
              setPortfolio((prev) => [...importedWorker.portfolio!, ...prev]);
            }
            setShowWhatsAppModal(false);
            setSuccessBanner(`WhatsApp candidate ${importedWorker.fullName} (with ${importedWorker.portfolio?.length || 0} media/docs) successfully parsed and added!`);
          }}
        />
      )}

      {/* PORTFOLIO LIGHTBOX VIEWER */}
      {selectedPortfolioItem && (
        <PortfolioViewerModal
          isOpen={isPortfolioViewerOpen}
          onClose={() => {
            setIsPortfolioViewerOpen(false);
            setSelectedPortfolioItem(null);
          }}
          item={selectedPortfolioItem}
        />
      )}

      {/* ADD / UPLOAD PORTFOLIO ITEM MODAL */}
      <AddPortfolioItemModal
        isOpen={isAddPortfolioOpen}
        onClose={() => setIsAddPortfolioOpen(false)}
        onAddItem={handleAddPortfolioItem}
      />
    </div>
  );
};
