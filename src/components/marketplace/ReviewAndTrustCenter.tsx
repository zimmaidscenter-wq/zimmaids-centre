import React, { useState } from "react";
import {
  Star,
  ShieldCheck,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Filter,
  UserCheck,
  Building2,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ShieldAlert,
  Clock,
  Send,
  Loader2,
  Info,
  Scale,
  Lock,
  MessageCircle,
  Check,
  X,
  AlertCircle,
  TrendingUp,
  Fingerprint,
  FileCheck,
  Zap,
  ChevronDown
} from "lucide-react";

export interface ReviewItem {
  id: string;
  targetType: "Worker" | "Employer";
  targetName: string;
  targetRole: string;
  reviewerName: string;
  reviewerRole: string;
  rating: number; // 1-5
  categoryScores: {
    punctuality: number;
    qualityOrRespect: number;
    communication: number;
    safetyOrPay: number;
  };
  reviewText: string;
  date: string;
  contractRef: string;
  verifiedContract: boolean;
  authenticityScore: number; // 0-100 AI Fake Review Score
  status: "Approved" | "Flagged for Review" | "Rejected";
  aiFlagReason?: string;
  helpfulCount: number;
}

export interface ComplaintItem {
  id: string;
  complaintRef: string;
  complainantName: string;
  complainantRole: "Employer" | "Worker";
  respondentName: string;
  respondentRole: string;
  contractRef: string;
  category: "Non-Payment of USD Wage" | "Property Damage" | "Unannounced Departure" | "Contract Breach" | "Harassment/Unsafe Environment" | "Substandard Service";
  description: string;
  evidenceProvided: string;
  dateSubmitted: string;
  status: "Claim Submitted" | "Evidence Verification" | "Under Mediation" | "Escrow Refund Issued" | "Resolved";
  resolutionSummary?: string;
  priority: "High" | "Medium" | "Urgent";
}

export const ReviewAndTrustCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "worker-reviews" | "employer-reviews" | "trust-score" | "complaints" | "disputes" | "moderation" | "ai-scanner"
  >("worker-reviews");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState<number | "All">("All");

  // Sample Worker Reviews (left by Employers)
  const [workerReviews, setWorkerReviews] = useState<ReviewItem[]>([
    {
      id: "rev-w-1",
      targetType: "Worker",
      targetName: "Sizani Ndlovu",
      targetRole: "Nurse Aide / Elderly Caregiver",
      reviewerName: "Mrs. Margaret Chigumba",
      reviewerRole: "Employer (Borrowdale, Harare)",
      rating: 5,
      categoryScores: { punctuality: 5, qualityOrRespect: 5, communication: 5, safetyOrPay: 5 },
      reviewText: "Sizani took incredible care of my elderly father in Borrowdale for 6 months. Punctual, extremely gentle, and Red Cross certified. Highly recommend her to any Harare family!",
      date: "2026-08-08",
      contractRef: "ZMC-ESC-2026-88312",
      verifiedContract: true,
      authenticityScore: 98,
      status: "Approved",
      helpfulCount: 14,
    },
    {
      id: "rev-w-2",
      targetType: "Worker",
      targetName: "Blessing Chirwa",
      targetRole: "Class 1 Journeyman Electrician",
      reviewerName: "Tafadzwa Mutasa",
      reviewerRole: "Homeowner (Avondale, Harare)",
      rating: 5,
      categoryScores: { punctuality: 5, qualityOrRespect: 5, communication: 4, safetyOrPay: 5 },
      reviewText: "Blessing installed a 5kW solar inverter system at our Avondale residence. Tested solar geyser, tidy cabling, and strictly adhered to safety codes.",
      date: "2026-08-05",
      contractRef: "ZMC-ESC-2026-99420",
      verifiedContract: true,
      authenticityScore: 95,
      status: "Approved",
      helpfulCount: 9,
    },
    {
      id: "rev-w-3",
      targetType: "Worker",
      targetName: "Chipo Moyo",
      targetRole: "Live-In Nanny",
      reviewerName: "Dr. Nyasha Tagwirei",
      reviewerRole: "Employer (Highlands, Harare)",
      rating: 4.8,
      categoryScores: { punctuality: 5, qualityOrRespect: 5, communication: 4, safetyOrPay: 5 },
      reviewText: "Chipo is wonderful with our 2-year-old daughter. She prepares nutritious meals and keeps the nursery immaculate. ZRP clearance verified.",
      date: "2026-08-01",
      contractRef: "ZMC-ESC-2026-10492",
      verifiedContract: true,
      authenticityScore: 97,
      status: "Approved",
      helpfulCount: 22,
    },
  ]);

  // Sample Employer Reviews (left by Workers)
  const [employerReviews, setEmployerReviews] = useState<ReviewItem[]>([
    {
      id: "rev-e-1",
      targetType: "Employer",
      targetName: "Mrs. Margaret Chigumba",
      targetRole: "Household Employer (Borrowdale)",
      reviewerName: "Sizani Ndlovu",
      reviewerRole: "Nurse Aide",
      rating: 5,
      categoryScores: { punctuality: 5, qualityOrRespect: 5, communication: 5, safetyOrPay: 5 },
      reviewText: "Mrs. Chigumba is a very kind and respectful employer. She always paid my $360 USD monthly salary on time via EcoCash, provided a private room, and respected my weekend rest days.",
      date: "2026-08-09",
      contractRef: "ZMC-ESC-2026-88312",
      verifiedContract: true,
      authenticityScore: 99,
      status: "Approved",
      helpfulCount: 18,
    },
    {
      id: "rev-e-2",
      targetType: "Employer",
      targetName: "Tafadzwa Mutasa",
      targetRole: "Homeowner (Avondale)",
      reviewerName: "Blessing Chirwa",
      reviewerRole: "Solar Electrician",
      rating: 5,
      categoryScores: { punctuality: 5, qualityOrRespect: 5, communication: 5, safetyOrPay: 5 },
      reviewText: "Mr. Mutasa funded the InnBucks escrow immediately upon contract signing. Great communication and snacks provided during solar installation.",
      date: "2026-08-06",
      contractRef: "ZMC-ESC-2026-99420",
      verifiedContract: true,
      authenticityScore: 96,
      status: "Approved",
      helpfulCount: 7,
    },
  ]);

  // Sample Complaints & Disputes
  const [complaints, setComplaints] = useState<ComplaintItem[]>([
    {
      id: "cmp-001",
      complaintRef: "ZMC-CMP-2026-01",
      complainantName: "Farai Sibanda",
      complainantRole: "Worker",
      respondentName: "Kudzai Moyo",
      respondentRole: "Employer",
      contractRef: "ZMC-ESC-2026-55102",
      category: "Non-Payment of USD Wage",
      description: "Employer delayed final $90 USD escrow release after lawn maintenance work was completed.",
      evidenceProvided: "WhatsApp chat export showing photos of completed lawn work and agreed contract terms.",
      dateSubmitted: "2026-08-02",
      status: "Under Mediation",
      priority: "High",
    },
    {
      id: "cmp-002",
      complaintRef: "ZMC-CMP-2026-02",
      complainantName: "Simbarashe Zhou",
      complainantRole: "Employer",
      respondentName: "Kudakwashe Mapfumo",
      respondentRole: "Worker",
      contractRef: "ZMC-ESC-2026-33912",
      category: "Unannounced Departure",
      description: "Plumber arrived 4 hours late without notification and left pipe fittings unsealed.",
      evidenceProvided: "CCTV time-stamped video clip and photos of unsealed geyser pipe connection.",
      dateSubmitted: "2026-08-04",
      status: "Evidence Verification",
      priority: "Medium",
    },
  ]);

  // Form State for submitting a new Review
  const [newReviewTargetName, setNewReviewTargetName] = useState("");
  const [newReviewTargetType, setNewReviewTargetType] = useState<"Worker" | "Employer">("Worker");
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewContractRef, setNewReviewContractRef] = useState("ZMC-ESC-2026-");
  const [ratingStars, setRatingStars] = useState(5);
  const [scorePunctuality, setScorePunctuality] = useState(5);
  const [scoreQuality, setScoreQuality] = useState(5);
  const [scoreCommunication, setScoreCommunication] = useState(5);
  const [scoreSafety, setScoreSafety] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmittedSuccess, setReviewSubmittedSuccess] = useState(false);

  // AI Fake Review Scanner State
  const [scanReviewText, setScanReviewText] = useState(
    "Best maid ever in Harare! She works 24 hours non-stop without sleep and charges $10 USD for full month. Amazing!"
  );
  const [scanTargetName, setScanTargetName] = useState("Unverified Candidate");
  const [scanRating, setScanRating] = useState(5);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  // Form State for filing a Complaint
  const [cmpComplainantName, setCmpComplainantName] = useState("");
  const [cmpRespondentName, setCmpRespondentName] = useState("");
  const [cmpCategory, setCmpCategory] = useState<ComplaintItem["category"]>("Non-Payment of USD Wage");
  const [cmpDescription, setCmpDescription] = useState("");
  const [cmpEvidence, setCmpEvidence] = useState("");
  const [cmpContractRef, setCmpContractRef] = useState("ZMC-ESC-2026-");
  const [cmpSuccess, setCmpSuccess] = useState(false);

  // Trust Score Calculator Interactive State
  const [trustZrpCheck, setTrustZrpCheck] = useState(true);
  const [trustIdCheck, setTrustIdCheck] = useState(true);
  const [trustEscrowJobs, setTrustEscrowJobs] = useState(5); // number of completed escrow jobs
  const [trustPositiveReviews, setTrustPositiveReviews] = useState(8);
  const [trustRefChecked, setTrustRefChecked] = useState(true);

  // Calculate Trust Score (0-100)
  const calcScore = Math.min(
    100,
    (trustZrpCheck ? 30 : 0) +
      (trustIdCheck ? 15 : 0) +
      Math.min(25, trustEscrowJobs * 5) +
      Math.min(20, trustPositiveReviews * 2.5) +
      (trustRefChecked ? 10 : 0)
  );

  const getTrustTier = (score: number) => {
    if (score >= 90) return { name: "Gold Shield Verified", color: "text-amber-600 bg-amber-50 border-amber-300", icon: ShieldCheck };
    if (score >= 75) return { name: "Silver Trust Badge", color: "text-slate-700 bg-slate-100 border-slate-300", icon: Award };
    return { name: "Bronze Verification", color: "text-amber-800 bg-amber-100 border-amber-300", icon: ShieldAlert };
  };

  // Submit Review Handler with AI Audit
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewTargetName || !newReviewText) return;

    setIsSubmittingReview(true);

    try {
      const res = await fetch("/api/ai/review-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewText: newReviewText,
          rating: ratingStars,
          reviewerRole: newReviewTargetType === "Worker" ? "Employer" : "Worker",
          targetName: newReviewTargetName,
          contractRef: newReviewContractRef,
          categoryScores: {
            punctuality: scorePunctuality,
            qualityOrRespect: scoreQuality,
            communication: scoreCommunication,
            safetyOrPay: scoreSafety,
          },
        }),
      });

      const audit = await res.json();

      const newRev: ReviewItem = {
        id: `rev-${Date.now()}`,
        targetType: newReviewTargetType,
        targetName: newReviewTargetName,
        targetRole: newReviewTargetType === "Worker" ? "Domestic Specialist" : "Household Employer",
        reviewerName: "Logged-In User",
        reviewerRole: "Verified Member",
        rating: ratingStars,
        categoryScores: {
          punctuality: scorePunctuality,
          qualityOrRespect: scoreQuality,
          communication: scoreCommunication,
          safetyOrPay: scoreSafety,
        },
        reviewText: newReviewText,
        date: new Date().toISOString().split("T")[0],
        contractRef: newReviewContractRef,
        verifiedContract: newReviewContractRef.length > 10,
        authenticityScore: audit.authenticityScore || 92,
        status: audit.moderationRecommendation === "APPROVED" ? "Approved" : "Flagged for Review",
        aiFlagReason: audit.flagReason || undefined,
        helpfulCount: 1,
      };

      if (newReviewTargetType === "Worker") {
        setWorkerReviews((prev) => [newRev, ...prev]);
      } else {
        setEmployerReviews((prev) => [newRev, ...prev]);
      }

      setReviewSubmittedSuccess(true);
      setNewReviewText("");
      setNewReviewTargetName("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Run AI Fake Review Scanner
  const handleRunScanner = async () => {
    setIsScanning(true);
    try {
      const res = await fetch("/api/ai/review-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewText: scanReviewText,
          rating: scanRating,
          reviewerRole: "Employer",
          targetName: scanTargetName,
          contractRef: "UNVERIFIED-TEST",
        }),
      });
      const data = await res.json();
      setScanResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  // Submit Complaint Handler
  const handleFileComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmpComplainantName || !cmpDescription) return;

    const newCmp: ComplaintItem = {
      id: `cmp-${Date.now()}`,
      complaintRef: `ZMC-CMP-2026-${Math.floor(10 + Math.random() * 90)}`,
      complainantName: cmpComplainantName,
      complainantRole: "Employer",
      respondentName: cmpRespondentName || "Unassigned Respondent",
      respondentRole: "Worker",
      contractRef: cmpContractRef,
      category: cmpCategory,
      description: cmpDescription,
      evidenceProvided: cmpEvidence || "Textual grievance report submitted.",
      dateSubmitted: new Date().toISOString().split("T")[0],
      status: "Claim Submitted",
      priority: "High",
    };

    setComplaints((prev) => [newCmp, ...prev]);
    setCmpSuccess(true);
    setCmpDescription("");
    setCmpEvidence("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Main Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-emerald-950 to-slate-900 border border-teal-800/50 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-teal-800/80 rounded-full text-xs font-semibold text-teal-200 border border-teal-700/50">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Review Integrity & Dispute Resolution System</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Trust Score, Reviews & Grievance Resolution
          </h2>
          <p className="text-sm text-teal-100/80">
            Bi-directional ratings for domestic workers & employers in Zimbabwe, verified ZRP background checks, AI fake review detection, and escrow dispute mediation.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 bg-teal-900/90 text-teal-200 rounded-lg border border-teal-700/60 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Escrow Contract Reviews
            </span>
            <span className="px-3 py-1 bg-teal-900/90 text-amber-200 rounded-lg border border-teal-700/60 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI Spam & Fake Review Scanner
            </span>
            <span className="px-3 py-1 bg-teal-900/90 text-sky-200 rounded-lg border border-teal-700/60 font-semibold flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-sky-300" /> Escrow Dispute Resolution Hub
            </span>
          </div>
        </div>
      </div>

      {/* Subsystem Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("worker-reviews")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "worker-reviews"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Worker Reviews ({workerReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("employer-reviews")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "employer-reviews"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Employer Reviews ({employerReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("trust-score")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "trust-score"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Award className="w-4 h-4 text-amber-300" />
          <span>Trust Score Engine</span>
        </button>

        <button
          onClick={() => setActiveTab("complaints")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "complaints"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Complaint System</span>
        </button>

        <button
          onClick={() => setActiveTab("disputes")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "disputes"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Dispute Resolution</span>
        </button>

        <button
          onClick={() => setActiveTab("ai-scanner")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "ai-scanner"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>AI Fake Review Detector</span>
        </button>
      </div>

      {/* TAB 1: WORKER REVIEWS */}
      {activeTab === "worker-reviews" && (
        <div className="space-y-6">
          {/* Header & Submit Toggle */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  <span>Domestic Worker & Artisan Performance Reviews</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified employer feedback on punctuality, house hygiene, child care safety, and technical craftsmanship.
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-extrabold text-slate-900 text-sm">4.9 / 5.0</span>
                <span className="text-slate-400">• 1,240 Verified Worker Reviews</span>
              </div>
            </div>

            {/* Submit New Worker Review Form */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Submit Verified Contract Review</span>
              </h4>

              {reviewSubmittedSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-between">
                  <span>Your review was audited by AI, verified against contract logs, and published!</span>
                  <button onClick={() => setReviewSubmittedSuccess(false)} className="text-emerald-900 font-bold">
                    ✕
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sizani Ndlovu"
                      value={newReviewTargetName}
                      onChange={(e) => setNewReviewTargetName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Review Category</label>
                    <select
                      value={newReviewTargetType}
                      onChange={(e) => setNewReviewTargetType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                    >
                      <option value="Worker">Worker Review (by Employer)</option>
                      <option value="Employer">Employer Review (by Worker)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Escrow Contract Reference</label>
                    <input
                      type="text"
                      placeholder="ZMC-ESC-2026-XXXXX"
                      value={newReviewContractRef}
                      onChange={(e) => setNewReviewContractRef(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium"
                    />
                  </div>
                </div>

                {/* Rating Sliders */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-xl border border-slate-200/80 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block">Punctuality: {scorePunctuality}★</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={scorePunctuality}
                      onChange={(e) => setScorePunctuality(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block">Quality/Hygiene: {scoreQuality}★</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={scoreQuality}
                      onChange={(e) => setScoreQuality(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block">Communication: {scoreCommunication}★</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={scoreCommunication}
                      onChange={(e) => setScoreCommunication(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block">Safety/Trust: {scoreSafety}★</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={scoreSafety}
                      onChange={(e) => setScoreSafety(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Review Comments</label>
                  <textarea
                    rows={2}
                    placeholder="Describe worker punctuality, child care etiquette, or craftsmanship..."
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {isSubmittingReview ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Auditing via AI Anti-Fake Scanner...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Publish Verified Review</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* List of Worker Reviews */}
            <div className="space-y-4">
              {workerReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 hover:border-emerald-300 transition-all shadow-sm"
                >
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-extrabold text-slate-900 text-sm">{rev.targetName}</h4>
                        <span className="text-xs text-slate-500">({rev.targetRole})</span>
                        {rev.verifiedContract && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified Contract</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">Reviewed by: <strong className="text-slate-800">{rev.reviewerName}</strong> ({rev.reviewerRole})</p>
                    </div>

                    <div className="flex items-center space-x-3 text-xs">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(rev.rating) ? "fill-amber-400" : "text-slate-200"}`}
                          />
                        ))}
                      </div>
                      <span className="font-extrabold text-slate-900">{rev.rating} / 5.0</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                    "{rev.reviewText}"
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-slate-500">Contract Ref: {rev.contractRef}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">
                        AI Authenticity Score: {rev.authenticityScore}% (Genuine)
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-emerald-600" />
                        <span>Helpful ({rev.helpfulCount})</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EMPLOYER REVIEWS */}
      {activeTab === "employer-reviews" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>Employer Household Reviews (Worker Voice)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Feedback from domestic staff evaluating employer wage promptness, private room accommodation quality, safety, and workplace respect.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {employerReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 hover:border-emerald-300 transition-all shadow-sm"
              >
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-extrabold text-slate-900 text-sm">{rev.targetName}</h4>
                      <span className="text-xs text-slate-500">({rev.targetRole})</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Reviewed by Worker: <strong className="text-emerald-900 font-bold">{rev.reviewerName}</strong> ({rev.reviewerRole})
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-extrabold text-slate-900">{rev.rating} / 5.0</span>
                  </div>
                </div>

                <p className="text-xs text-slate-800 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/80 font-medium">
                  "{rev.reviewText}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="font-mono text-emerald-800 font-semibold">Verified Escrow: {rev.contractRef}</span>
                  <span className="text-emerald-700 font-bold">
                    🛡️ AI Authenticity: {rev.authenticityScore}% Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TRUST SCORE ENGINE */}
      {activeTab === "trust-score" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Interactive AI Trust Score Calculator</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulate how candidate background credentials, ZRP Police Clearances, and verified employer reviews build a 0-100 Trust Score.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calculator Controls */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-sm">Verification Factors</h4>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                  <span className="font-bold text-slate-800">1. ZRP Police Clearance Certificate (+30 Pts)</span>
                  <input
                    type="checkbox"
                    checked={trustZrpCheck}
                    onChange={(e) => setTrustZrpCheck(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                  <span className="font-bold text-slate-800">2. Zimbabwe National ID Checksum (+15 Pts)</span>
                  <input
                    type="checkbox"
                    checked={trustIdCheck}
                    onChange={(e) => setTrustIdCheck(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                </label>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>3. Completed Escrow Contracts:</span>
                    <span className="text-emerald-600">{trustEscrowJobs} Jobs (+{Math.min(25, trustEscrowJobs * 5)} Pts)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={trustEscrowJobs}
                    onChange={(e) => setTrustEscrowJobs(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>4. Positive Verified Reviews:</span>
                    <span className="text-emerald-600">{trustPositiveReviews} Reviews (+{Math.min(20, trustPositiveReviews * 2.5)} Pts)</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={trustPositiveReviews}
                    onChange={(e) => setTrustPositiveReviews(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                <label className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-pointer">
                  <span className="font-bold text-slate-800">5. Employer Reference Check (+10 Pts)</span>
                  <input
                    type="checkbox"
                    checked={trustRefChecked}
                    onChange={(e) => setTrustRefChecked(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                </label>
              </div>
            </div>

            {/* Score Badge Output */}
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4 text-center">
                <span className="px-3 py-1 bg-emerald-800/80 rounded-full text-xs font-bold text-emerald-200 border border-emerald-700/60 inline-block">
                  Calculated Candidate Trust Metric
                </span>

                <div className="relative w-36 h-36 mx-auto flex items-center justify-center rounded-full bg-emerald-900/40 border-4 border-amber-400 shadow-2xl">
                  <div className="text-center">
                    <div className="text-4xl font-extrabold text-amber-300 font-mono">{calcScore}</div>
                    <div className="text-[10px] uppercase tracking-widest text-emerald-200 font-bold">/ 100 Score</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-lg font-extrabold text-white flex items-center justify-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <span>{getTrustTier(calcScore).name}</span>
                  </div>
                  <p className="text-xs text-emerald-200/80 max-w-xs mx-auto">
                    {calcScore >= 90
                      ? "Top-tier candidate with full ZRP Clearance & verified employer history. Search priority #1."
                      : "Good trust score. Complete remaining checks to reach Gold Shield status."}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-800/60 text-xs text-emerald-300 flex justify-between">
                <span>ZRP Police Check: <strong className="text-white">{trustZrpCheck ? "Verified" : "Pending"}</strong></span>
                <span>Badge Tier: <strong className="text-amber-300 font-bold">{getTrustTier(calcScore).name}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPLAINT SYSTEM */}
      {activeTab === "complaints" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>Formal Complaint & Grievance Lodgement System</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Submit formal claims regarding unpaid USD wages, unannounced contract departures, or property damage for review by case officers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* File New Complaint */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>File a Formal Complaint</span>
              </h4>

              {cmpSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-between">
                  <span>Complaint ticket created and assigned to Escrow Officer!</span>
                  <button onClick={() => setCmpSuccess(false)} className="text-emerald-900 font-bold">✕</button>
                </div>
              )}

              <form onSubmit={handleFileComplaint} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Farai Sibanda"
                      value={cmpComplainantName}
                      onChange={(e) => setCmpComplainantName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Respondent Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Kudzai Moyo"
                      value={cmpRespondentName}
                      onChange={(e) => setCmpRespondentName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Complaint Category</label>
                    <select
                      value={cmpCategory}
                      onChange={(e) => setCmpCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                    >
                      <option value="Non-Payment of USD Wage">Non-Payment of USD Wage</option>
                      <option value="Property Damage">Property Damage</option>
                      <option value="Unannounced Departure">Unannounced Departure</option>
                      <option value="Contract Breach">Contract Breach</option>
                      <option value="Harassment/Unsafe Environment">Harassment / Unsafe Environment</option>
                      <option value="Substandard Service">Substandard Service</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Escrow Contract Reference</label>
                    <input
                      type="text"
                      value={cmpContractRef}
                      onChange={(e) => setCmpContractRef(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Grievance Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide specific details regarding the breach or dispute..."
                    value={cmpDescription}
                    onChange={(e) => setCmpDescription(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Evidence (WhatsApp chats, photos)</label>
                  <input
                    type="text"
                    placeholder="Paste link or text summary of evidence..."
                    value={cmpEvidence}
                    onChange={(e) => setCmpEvidence(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Submit Grievance to Case Manager</span>
                </button>
              </form>
            </div>

            {/* Existing Complaints Queue */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Active Complaints Queue ({complaints.length})
              </h4>

              {complaints.map((cmp) => (
                <div
                  key={cmp.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 hover:border-rose-300 transition-all"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      {cmp.complaintRef}
                    </span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[10px]">
                      {cmp.status}
                    </span>
                  </div>

                  <h5 className="font-extrabold text-slate-900 text-xs">{cmp.category}</h5>
                  <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/80">
                    {cmp.description}
                  </p>

                  <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                    <span>Complainant: <strong className="text-slate-800">{cmp.complainantName}</strong></span>
                    <span className="font-mono">Ref: {cmp.contractRef}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DISPUTE RESOLUTION */}
      {activeTab === "disputes" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-600" />
                <span>Escrow Dispute Mediation Workspace</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                4-Step dispute resolution timeline protecting escrow funds during contract conflicts.
              </p>
            </div>
          </div>

          {/* 4 Steps Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] mb-2">1</span>
              <h5 className="font-extrabold text-slate-900">Claim Lodged</h5>
              <p className="text-slate-500 text-[11px]">Grievance filed with contract ref and evidence attachment.</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] mb-2">2</span>
              <h5 className="font-extrabold text-slate-900">Evidence Audit</h5>
              <p className="text-slate-500 text-[11px]">WhatsApp exports, photos, and time logs verified by AI.</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] mb-2">3</span>
              <h5 className="font-extrabold text-slate-900">Case Manager Call</h5>
              <p className="text-slate-500 text-[11px]">Direct telephonic mediation via Zimbabwe support desk.</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] mb-2">4</span>
              <h5 className="font-extrabold text-slate-900">Escrow Settlement</h5>
              <p className="text-slate-500 text-[11px]">Binding payout or refund released back to EcoCash / Card.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AI FAKE REVIEW DETECTOR */}
      {activeTab === "ai-scanner" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>AI Anti-Spam & Fake Review Detection Tool</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Powered by Google Gemini 3.6 Flash. Tests review text for suspicious praise, duplicate bots, and unverified contract claims.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Test Review Content
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Name</label>
                  <input
                    type="text"
                    value={scanTargetName}
                    onChange={(e) => setScanTargetName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Review Text to Audit</label>
                  <textarea
                    rows={4}
                    value={scanReviewText}
                    onChange={(e) => setScanReviewText(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  onClick={handleRunScanner}
                  disabled={isScanning}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gemini AI Analyzing Linguistic Patterns...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Audit Review Authenticity</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Audit Result Output */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              {scanResult ? (
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <span className="font-extrabold text-amber-400 text-sm">AI Audit Analysis</span>
                    <span
                      className={`px-3 py-1 rounded-full font-extrabold text-[10px] ${
                        scanResult.isAuthentic
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      }`}
                    >
                      {scanResult.moderationRecommendation}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span>Authenticity Score:</span>
                      <strong className="text-amber-300 font-mono text-sm">{scanResult.authenticityScore}%</strong>
                    </div>

                    <div className="flex justify-between text-slate-300">
                      <span>Sentiment Classification:</span>
                      <strong className="text-emerald-400">{scanResult.sentiment}</strong>
                    </div>

                    {scanResult.flagReason && (
                      <div className="p-2.5 bg-rose-950/80 border border-rose-800 text-rose-200 rounded-xl">
                        <strong>Flag Reason:</strong> {scanResult.flagReason}
                      </div>
                    )}

                    <div className="p-3 bg-slate-800/80 rounded-xl text-slate-300 space-y-1">
                      <strong className="text-white block">Linguistic Analysis:</strong>
                      <p className="text-[11px] leading-relaxed">{scanResult.linguisticAnalysis}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-400 space-y-2 py-12">
                  <Fingerprint className="w-12 h-12 text-slate-700 mx-auto" />
                  <p className="text-xs">Enter review text on the left and click "Audit Review Authenticity".</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
