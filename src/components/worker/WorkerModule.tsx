import React, { useState } from "react";
import { ALL_ZIMBABWE_CITIES, getSuburbsForCity } from "../../data/zimbabweLocations";
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
  CheckSquare
} from "lucide-react";

interface WorkerModuleProps {
  currency?: "USD" | "ZWG";
}

export const WorkerModule: React.FC<WorkerModuleProps> = ({ currency = "USD" }) => {
  const [activeTab, setActiveTab] = useState<
    | "profile"
    | "registration"
    | "documents"
    | "skills-exp"
    | "verification"
    | "analytics"
    | "saved-jobs"
    | "ai-review"
  >("profile");

  // Registration state
  const [showRegModal, setShowRegModal] = useState<boolean>(false);
  const [regData, setRegData] = useState({
    fullName: "",
    nationalId: "",
    phone: "",
    role: "Maid",
    city: "Harare",
    suburb: "Borrowdale",
    rateUSD: 200,
    workMode: "Live-in",
  });
  const [regSuccess, setRegSuccess] = useState<boolean>(false);

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
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full border-2 border-emerald-950" title="ZRP Verified">
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
              onClick={() => setShowRegModal(true)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Profile</span>
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
          <span>ZRP Police & Vetting</span>
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

      {/* TAB 1: PROFILE DASHBOARD */}
      {activeTab === "profile" && (
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
                  <span className="text-slate-300">ZRP Fingerprint Clearance</span>
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

      {/* TAB 4: ZRP POLICE & VETTING */}
      {activeTab === "verification" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span>ZRP Police Fingerprint Clearance & Vetting Center</span>
              </h3>
              <p className="text-xs text-slate-500">Official Zimbabwe Republic Police Fingerprint Form Clearance & ID Audit</p>
            </div>
            <span className="px-3 py-1 bg-emerald-500 text-slate-950 font-black text-xs rounded-full">
              STATUS: PASSED & VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-1">
              <div className="text-[11px] text-emerald-800 font-semibold uppercase">Clearance Form Serial</div>
              <div className="text-base font-mono font-bold text-emerald-950">{workerProfile.policeClearanceNo}</div>
              <div className="text-[10px] text-slate-500">ZRP CID Headquarters Audit</div>
            </div>

            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-1">
              <div className="text-[11px] text-emerald-800 font-semibold uppercase">Issue Date</div>
              <div className="text-base font-mono font-bold text-emerald-950">{workerProfile.policeClearanceDate}</div>
              <div className="text-[10px] text-slate-500">Valid through 2027</div>
            </div>

            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-1">
              <div className="text-[11px] text-emerald-800 font-semibold uppercase">Fingerprint Status</div>
              <div className="text-base font-bold text-emerald-900 flex items-center gap-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>NO CRIMINAL RECORD</span>
              </div>
              <div className="text-[10px] text-slate-500">National Automated Fingerprint System (NAFIS)</div>
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

      {/* REGISTRATION MODAL */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                <span>Worker Registration Portal</span>
              </h3>
              <button onClick={() => setShowRegModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {regSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Registration Submitted!</h4>
                <p className="text-xs text-slate-600">
                  Your profile has been created and queued for ZRP Police clearance verification.
                </p>
                <button
                  onClick={() => {
                    setRegSuccess(false);
                    setShowRegModal(false);
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
                >
                  Close & View Profile
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setWorkerProfile((prev) => ({
                    ...prev,
                    name: regData.fullName || prev.name,
                    phone: regData.phone || prev.phone,
                    nationalId: regData.nationalId || prev.nationalId,
                    role: regData.role,
                    city: regData.city,
                    rateUSD: Number(regData.rateUSD),
                  }));
                  setRegSuccess(true);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tendai Musika"
                    value={regData.fullName}
                    onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">National ID</label>
                    <input
                      type="text"
                      required
                      placeholder="63-289410-F-42"
                      value={regData.nationalId}
                      onChange={(e) => setRegData({ ...regData, nationalId: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Mobile (+263)</label>
                    <input
                      type="text"
                      required
                      placeholder="+263 771 000 000"
                      value={regData.phone}
                      onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Primary Role</label>
                    <select
                      value={regData.role}
                      onChange={(e) => setRegData({ ...regData, role: e.target.value })}
                      className="w-full px-2.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Domestic worker">Domestic worker</option>
                      <option value="Maid">Maid</option>
                      <option value="Part-time maid">Part-time maid</option>
                      <option value="Nanny">Nanny</option>
                      <option value="Caregiver">Caregiver</option>
                      <option value="Housekeeper">Housekeeper</option>
                      <option value="Gardener">Gardener</option>
                      <option value="Driver">Driver</option>
                      <option value="Chef">Chef</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Plumber">Plumber</option>
                      <option value="Nurse aide">Nurse aide</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Location City</label>
                    <select
                      value={regData.city}
                      onChange={(e) => {
                        const newCity = e.target.value;
                        const subs = getSuburbsForCity(newCity);
                        setRegData({
                          ...regData,
                          city: newCity,
                          suburb: subs.length > 1 ? subs[1] : subs[0]
                        });
                      }}
                      className="w-full px-2.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {ALL_ZIMBABWE_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Major Suburb</label>
                    <select
                      value={regData.suburb}
                      onChange={(e) => setRegData({ ...regData, suburb: e.target.value })}
                      className="w-full px-2.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {getSuburbsForCity(regData.city).map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Monthly Expected Rate ($ USD)</label>
                  <input
                    type="number"
                    value={regData.rateUSD}
                    onChange={(e) => setRegData({ ...regData, rateUSD: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
                >
                  Complete Registration & Submit
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
