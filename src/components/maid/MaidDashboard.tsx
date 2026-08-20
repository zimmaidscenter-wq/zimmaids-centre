import React, { useState, useRef, useEffect } from "react";
import { usePlatform } from "../../context/PlatformContext";
import { JobRecord, calculateAge } from "../../types/platform";
import { ALL_ZIMBABWE_CITIES, getSuburbsForCity } from "../../data/zimbabweLocations";
import { MediaUploadComponent } from "../media/MediaUploadComponent";
import { ImageLightboxModal, LightboxImageItem } from "../common/ImageLightboxModal";
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
  X,
  ArrowLeft,
  Wallet,
  CreditCard,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  ShieldAlert,
  Award,
  FileCheck,
  ChevronRight
} from "lucide-react";

export const MaidDashboard: React.FC = () => {
  const {
    currentUser,
    currentMaidProfile,
    updateMaidProfile,
    submitMaidProfileForApproval,
    uploadWorkerDocument,
    deleteWorkerDocument,
    allJobs,
    maidApplications,
    applyForJob,
    currentWallet,
    createPaynowDeposit,
    verifyPaynowPayment,
    pricingSettings,
    uploadProfilePhoto,
    uploadAdditionalPhoto,
    removeAdditionalPhoto,
    getProfileCompletion,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<
    "profile" | "photos" | "documents" | "browse-jobs" | "my-applications" | "wallet"
  >("profile");

  // Profile Edit State
  const [firstName, setFirstName] = useState(currentMaidProfile?.firstName || "Sizani");
  const [surname, setSurname] = useState(currentMaidProfile?.surname || "Ndlovu");
  const [dateOfBirth, setDateOfBirth] = useState(currentMaidProfile?.dateOfBirth || "1994-04-15");
  const [gender, setGender] = useState<"Female" | "Male">(currentMaidProfile?.gender || "Female");
  const [numberOfChildren, setNumberOfChildren] = useState<number>(currentMaidProfile?.numberOfChildren || 2);
  const [location, setLocation] = useState(currentMaidProfile?.location || "Harare");
  const [residentialAddress, setResidentialAddress] = useState(
    currentMaidProfile?.residentialAddress || "Stand 412, Unit K, Chitungwiza, Harare"
  );
  const [phoneNumber, setPhoneNumber] = useState(currentMaidProfile?.phoneNumber || "+263 771 902 441");
  const [whatsappNumber, setWhatsappNumber] = useState(currentMaidProfile?.whatsappNumber || "+263 771 902 441");
  const [nationalIdNumber, setNationalIdNumber] = useState(currentMaidProfile?.nationalIdNumber || "63-208941-K-44");
  const [expectedSalary, setExpectedSalary] = useState<number>(currentMaidProfile?.expectedSalary || 280);
  const [availability, setAvailability] = useState<any>(currentMaidProfile?.availability || "Available immediately");
  const [preferredLocation, setPreferredLocation] = useState(
    currentMaidProfile?.preferredWorkLocation || "Harare (Northern Suburbs)"
  );
  const [willingToLiveIn, setWillingToLiveIn] = useState(currentMaidProfile?.willingToLiveIn ?? true);
  const [willingToLiveOut, setWillingToLiveOut] = useState(currentMaidProfile?.willingToLiveOut ?? true);
  const [experienceYears, setExperienceYears] = useState(currentMaidProfile?.experienceYears || 7);
  const [workExperience, setWorkExperience] = useState(
    currentMaidProfile?.workExperience ||
      "7 years of extensive household management in Borrowdale and Highlands. Expert in infant & toddler care, meal preparation, deep cleaning, and steam pressing."
  );
  const [shortAboutMe, setShortAboutMe] = useState(
    currentMaidProfile?.shortAboutMe ||
      "Trustworthy, punctual, and child-loving housekeeper with certified Red Cross First Aid training."
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    currentMaidProfile?.skills || ["Childcare", "Toddler Care", "Cooking", "Baking", "Laundry & Steam Ironing", "First Aid"]
  );

  // Status feedback
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);
  const [approvalFeedback, setApprovalFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Document Upload Form State
  const [newDocType, setNewDocType] = useState<"National ID" | "Certificate" | "Reference" | "Police Clearance">("National ID");
  const [newDocTitle, setNewDocTitle] = useState("Zimbabwe National ID Card");
  const [newDocNumber, setNewDocNumber] = useState("");
  const [newDocUrl, setNewDocUrl] = useState("");
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [docUploadFeedback, setDocUploadFeedback] = useState<string | null>(null);

  // 3 Photos Specific State
  const [additionalPhoto1Title, setAdditionalPhoto1Title] = useState(
    currentMaidProfile?.additionalPhoto1Title || "Work Uniform & Professional Attire"
  );
  const [additionalPhoto2Title, setAdditionalPhoto2Title] = useState(
    currentMaidProfile?.additionalPhoto2Title || "Skill Demonstration (Cooking & Childcare)"
  );
  const [photoFeedback, setPhotoFeedback] = useState<string | null>(null);

  // Job Search Filters
  const [jobCityFilter, setJobCityFilter] = useState("All");
  const [jobAccommodationFilter, setJobAccommodationFilter] = useState("All");
  const [jobSearchQuery, setJobSearchQuery] = useState("");

  // Job Application Modal
  const [selectedJobToApply, setSelectedJobToApply] = useState<JobRecord | null>(null);
  const [applicationCoverNote, setApplicationCoverNote] = useState("");
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [appFeedback, setAppFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Worker Paynow Wallet Deposit Modal
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(20);
  const [paymentMethod, setPaymentMethod] = useState<string>("EcoCash");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paynowCheckoutState, setPaynowCheckoutState] = useState<{
    transactionId: string;
    paynowReference: string;
    pollUrl: string;
    checkoutUrl: string;
  } | null>(null);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);

  // Lightbox for Maid's photos and certificates
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<LightboxImageItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Browser Back Button & Escape key support for Maid Modals & Lightbox
  useEffect(() => {
    if (!selectedJobToApply && !isAddFundsOpen) return;

    const stateObj = {
      maidModalOpen: true,
      selectedJobId: selectedJobToApply?.id,
      isAddFundsOpen,
    };
    window.history.pushState(stateObj, "");

    const handlePopState = () => {
      if (isLightboxOpen) {
        setIsLightboxOpen(false);
      } else if (selectedJobToApply) {
        setSelectedJobToApply(null);
      } else if (isAddFundsOpen) {
        setIsAddFundsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else if (selectedJobToApply) {
          setSelectedJobToApply(null);
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
  }, [selectedJobToApply, isAddFundsOpen, isLightboxOpen]);

  const openDocLightbox = (images: LightboxImageItem[], index = 0) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // Available skills catalogue
  const ALL_SKILLS = [
    "Childcare",
    "Toddler Care",
    "Infant Care",
    "Elderly Care",
    "Cooking",
    "Baking",
    "Traditional Dishes (Sadza, Stews)",
    "Western Cuisine",
    "Laundry & Steam Ironing",
    "Deep House Cleaning",
    "First Aid",
    "Pet Care",
    "Gardening & Yard Maintenance",
    "Driver License",
  ];

  // Computed Age dynamically
  const calculatedAge = calculateAge(dateOfBirth);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

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
      nationalIdNumber,
      expectedSalary,
      availability,
      preferredWorkLocation: preferredLocation,
      willingToLiveIn,
      willingToLiveOut,
      experienceYears,
      workExperience,
      shortAboutMe,
      skills: selectedSkills,
      additionalPhoto1Title,
      additionalPhoto2Title,
    });
    setSaveSuccessMsg("Worker profile details saved successfully!");
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Submit profile to admin for posting approval
  const handleSubmitForAdminApproval = async () => {
    setIsSubmittingApproval(true);
    setApprovalFeedback(null);
    try {
      const res = await submitMaidProfileForApproval();
      if (res.success) {
        setApprovalFeedback({
          type: "success",
          text: res.message || "Your profile has been submitted to the Admin team for review and approval!",
        });
      } else {
        setApprovalFeedback({
          type: "error",
          text: res.message || "Failed to submit profile for approval.",
        });
      }
    } catch (err: any) {
      setApprovalFeedback({
        type: "error",
        text: err?.message || "An unexpected error occurred during submission.",
      });
    } finally {
      setIsSubmittingApproval(false);
    }
  };

  // Handle uploading document
  const handleUploadDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle) return;
    setIsUploadingDoc(true);
    setDocUploadFeedback(null);

    const docUrlToUse =
      newDocUrl.trim() ||
      (newDocType === "National ID"
        ? "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600"
        : newDocType === "Police Clearance"
        ? "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600"
        : "https://images.unsplash.com/photo-1589330694653-dad6ef019d19?auto=format&fit=crop&q=80&w=600");

    const res = await uploadWorkerDocument({
      type: newDocType,
      title: newDocTitle,
      documentNumber: newDocNumber || undefined,
      fileUrl: docUrlToUse,
      fileType: "image",
      fileSize: "1.4 MB",
    });

    setIsUploadingDoc(false);
    if (res.success) {
      setDocUploadFeedback("Document uploaded successfully! It is now pending administrator verification.");
      setNewDocTitle("");
      setNewDocNumber("");
      setNewDocUrl("");
      setTimeout(() => setDocUploadFeedback(null), 3500);
    }
  };

  // Handle Paynow deposit
  const handleInitiatePaynow = async () => {
    setIsProcessingPayment(true);
    setPaymentSuccessMessage(null);

    try {
      const res = await createPaynowDeposit(depositAmount, paymentMethod);
      setIsProcessingPayment(false);

      if (res.success) {
        setPaynowCheckoutState({
          transactionId: res.transactionId,
          paynowReference: res.paynowReference,
          pollUrl: res.pollUrl,
          checkoutUrl: res.checkoutUrl,
        });
        if (res.checkoutUrl) {
          try {
            window.location.href = res.checkoutUrl;
          } catch (e) {
            console.warn("Same-window redirect notice:", e);
          }
        }
      }
    } catch (e) {
      setIsProcessingPayment(false);
    }
  };

  // Verify Paynow payment
  const handleCheckPaynowStatus = async () => {
    if (!paynowCheckoutState) return;
    setIsProcessingPayment(true);

    const res = await verifyPaynowPayment(
      paynowCheckoutState.transactionId,
      paynowCheckoutState.paynowReference
    );
    setIsProcessingPayment(false);

    if (res.verified) {
      setPaymentSuccessMessage(`Payment confirmed! Added $${depositAmount}.00 USD to your worker wallet.`);
      setPaynowCheckoutState(null);
    }
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

  const statusPillClass =
    currentMaidProfile?.verificationStatus === "Approved"
      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
      : currentMaidProfile?.verificationStatus === "Rejected"
      ? "bg-rose-100 text-rose-800 border-rose-300"
      : "bg-amber-100 text-amber-800 border-amber-300";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                currentMaidProfile?.profilePhoto ||
                "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400"
              }
              alt="Worker Profile"
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
            />
            {currentMaidProfile?.verificationStatus === "Approved" && (
              <span
                className="absolute -bottom-1.5 -right-1.5 p-1 bg-emerald-600 text-white rounded-full border-2 border-white shadow-sm"
                title="Verified Domestic Worker"
              >
                <ShieldCheck className="w-4 h-4" />
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                <User className="w-3.5 h-3.5" />
                Domestic Worker Dashboard
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-black rounded-full border ${statusPillClass}`}
              >
                {currentMaidProfile?.verificationStatus === "Approved" ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Live on Directory
                  </>
                ) : currentMaidProfile?.verificationStatus === "Rejected" ? (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5" /> Re-submission Required
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5" /> Pending Admin Approval
                  </>
                )}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {currentMaidProfile ? `${currentMaidProfile.firstName} ${currentMaidProfile.surname}` : currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {location} • Expected: <strong>${expectedSalary} USD/mo</strong> • {experienceYears} Years Experience
            </p>
          </div>
        </div>

        {/* Worker Wallet & Admin Submission CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between sm:justify-start gap-4">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Worker Wallet</div>
              <div className="text-xl font-black text-white flex items-baseline gap-1">
                <span>${currentWallet.balance.toFixed(2)}</span>
                <span className="text-[10px] text-emerald-400 font-bold">USD</span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsAddFundsOpen(true);
                setPaynowCheckoutState(null);
              }}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Top Up
            </button>
          </div>
        </div>
      </div>

      {/* Admin Approval Notice Banner */}
      <div
        className={`p-5 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm transition-all ${
          currentMaidProfile?.verificationStatus === "Approved"
            ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
            : currentMaidProfile?.verificationStatus === "Rejected"
            ? "bg-rose-50 border-rose-200 text-rose-950"
            : "bg-amber-50/80 border-amber-200 text-amber-950"
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`p-3 rounded-2xl flex-shrink-0 ${
              currentMaidProfile?.verificationStatus === "Approved"
                ? "bg-emerald-600 text-white"
                : currentMaidProfile?.verificationStatus === "Rejected"
                ? "bg-rose-600 text-white"
                : "bg-amber-600 text-white"
            }`}
          >
            {currentMaidProfile?.verificationStatus === "Approved" ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : currentMaidProfile?.verificationStatus === "Rejected" ? (
              <ShieldAlert className="w-6 h-6" />
            ) : (
              <Sparkles className="w-6 h-6" />
            )}
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-sm tracking-tight">
              {currentMaidProfile?.verificationStatus === "Approved"
                ? "Profile Verified & Approved by ZMC Admin"
                : currentMaidProfile?.verificationStatus === "Rejected"
                ? "Profile Rejected / Updates Needed"
                : "Profile Status: Pending Admin Posting Approval"}
            </h3>
            <p className="text-xs opacity-90 max-w-2xl leading-relaxed">
              {currentMaidProfile?.verificationStatus === "Approved"
                ? "Your full profile, 3 photos, National ID, and certificates have been vetted. Subscribed employers across Zimbabwe can now discover and contact you."
                : currentMaidProfile?.verificationStatus === "Rejected"
                ? `Admin feedback: ${
                    (currentMaidProfile as any)?.rejectionReason ||
                    "Please re-upload a clear copy of your National ID and valid police clearance to proceed."
                  }`
                : "Maid profiles require administrative vetting before appearing publicly. Click below to submit or re-submit your updated details, photos, and ID to the admin queue."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleSubmitForAdminApproval}
            disabled={isSubmittingApproval}
            className={`px-5 py-2.5 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap ${
              currentMaidProfile?.verificationStatus === "Approved"
                ? "bg-slate-900 hover:bg-slate-800 text-white"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            <Send className="w-4 h-4" />
            {isSubmittingApproval
              ? "Submitting..."
              : currentMaidProfile?.verificationStatus === "Approved"
              ? "Re-Submit for Re-Approval"
              : "Send to Admin for Posting Approval"}
          </button>
        </div>
      </div>

      {approvalFeedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
            approvalFeedback.type === "success"
              ? "bg-emerald-100 border border-emerald-300 text-emerald-900"
              : "bg-rose-100 border border-rose-300 text-rose-900"
          }`}
        >
          {approvalFeedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          {approvalFeedback.text}
        </div>
      )}

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
          My Profile & Details
        </button>

        <button
          onClick={() => setActiveTab("photos")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "photos"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Camera className="w-4 h-4 text-emerald-500" />
          3 Photos & Portfolio
        </button>

        <button
          onClick={() => setActiveTab("documents")}
          className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "documents"
              ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <FileCheck className="w-4 h-4 text-emerald-600" />
          National ID & Certificates ({currentMaidProfile?.privateDocuments?.length || 0})
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
          My Applications ({maidApplications.length})
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
          Worker Wallet (Paynow)
        </button>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          {saveSuccessMsg}
        </div>
      )}

      {/* TAB 1: MY PROFILE */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Update Domestic Worker Profile</h2>
            <p className="text-xs text-slate-500">
              Ensure your identity, location, salary requirement, and experience are accurate for admin approval.
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
                  Date of Birth (Age: <strong className="text-emerald-700">{calculatedAge}</strong>)
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                  required
                />
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
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Zimbabwe National ID Number</label>
                <input
                  type="text"
                  value={nationalIdNumber}
                  onChange={(e) => setNationalIdNumber(e.target.value)}
                  placeholder="e.g. 63-208941-K-44"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                  required
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">Kept encrypted and private for admin verification.</span>
              </div>
            </div>

            {/* Location & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">City / Town</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  {ALL_ZIMBABWE_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">WhatsApp Number</label>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Expected Monthly Salary (USD)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-xs">$</span>
                  <input
                    type="number"
                    min="100"
                    max="1000"
                    step="10"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3.5 py-2.5 text-xs text-slate-900 font-black focus:bg-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2 md:col-span-4">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Residential Address (Zimbabwe)</label>
                <input
                  type="text"
                  value={residentialAddress}
                  onChange={(e) => setResidentialAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Work Preferences & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Availability Status</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Available immediately">Available immediately</option>
                  <option value="Available in 2 weeks">Available in 2 weeks</option>
                  <option value="Available next month">Available next month</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Years of Experience</label>
                <input
                  type="number"
                  min="0"
                  max="35"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Preferred Work Suburbs</label>
                <input
                  type="text"
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. Borrowdale, Avondale, Mount Pleasant"
                />
              </div>
            </div>

            {/* Live-in / Live-out Checkboxes */}
            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={willingToLiveIn}
                  onChange={(e) => setWillingToLiveIn(e.target.checked)}
                  className="accent-emerald-600 w-4 h-4 rounded"
                />
                Willing to take Live-in Accommodation
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  checked={willingToLiveOut}
                  onChange={(e) => setWillingToLiveOut(e.target.checked)}
                  className="accent-emerald-600 w-4 h-4 rounded"
                />
                Willing to work Live-out (Commuting)
              </label>
            </div>

            {/* Skills selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Specialized Skills & Certifications ({selectedSkills.length} Selected)
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map((skill) => {
                  const isSel = selectedSkills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSel
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {isSel && "✓ "}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bio & Work Experience */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Short Bio / Headline</label>
                <input
                  type="text"
                  value={shortAboutMe}
                  onChange={(e) => setShortAboutMe(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  placeholder="e.g. Trustworthy, punctual, and child-loving housekeeper with Red Cross certification."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Detailed Work Experience & References</label>
                <textarea
                  rows={4}
                  value={workExperience}
                  onChange={(e) => setWorkExperience(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none leading-relaxed"
                  placeholder="Describe your previous household employers, duties performed, child ages cared for, and cooking experience..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: 3 PHOTOS & WORK PORTFOLIO */}
      {activeTab === "photos" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                <Camera className="w-3.5 h-3.5" />
                Worker Photo Showcase (3 Required Photos)
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Upload Your 3 Profile Photos</h2>
              <p className="text-xs text-slate-500 max-w-2xl">
                Upload your main portrait, an attire/uniform photo, and an active skill demonstration photo (e.g., cooking or childcare) to build trust with employers.
              </p>
            </div>

            {/* 3 Photos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Photo 1: Main Avatar */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Photo 1: Profile Avatar
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                      Primary
                    </span>
                  </div>
                  <div
                    onClick={() =>
                      openDocLightbox([
                        {
                          url:
                            currentMaidProfile?.profilePhoto ||
                            "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
                          title: "Primary Profile Avatar",
                          subtitle: `${currentMaidProfile?.firstName || firstName} ${currentMaidProfile?.surname || surname}`,
                          isVerified: currentMaidProfile?.isVerified,
                        },
                      ])
                    }
                    className="relative h-48 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 cursor-pointer group"
                    title="Click to view full image"
                  >
                    <img
                      src={
                        currentMaidProfile?.profilePhoto ||
                        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400"
                      }
                      alt="Avatar"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Eye className="w-6 h-6 text-white drop-shadow-md" />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Clear headshot looking directly at the camera with good lighting.
                  </p>
                </div>
                <div className="pt-2">
                  <label className="block w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-center text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all">
                    <span>Upload New Avatar</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === "string") {
                              uploadProfilePhoto(reader.result);
                              setPhotoFeedback("Primary photo updated!");
                              setTimeout(() => setPhotoFeedback(null), 3000);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Photo 2: Additional Photo 1 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Photo 2: Work Attire / Setting
                    </span>
                    {currentMaidProfile?.additionalPhoto1 ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                        Uploaded
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-full">
                        Optional
                      </span>
                    )}
                  </div>
                  <div
                    onClick={() => {
                      if (currentMaidProfile?.additionalPhoto1) {
                        openDocLightbox([
                          {
                            url: currentMaidProfile.additionalPhoto1,
                            title: additionalPhoto1Title || "Work Attire & Uniform",
                            subtitle: "Professional Work Setting",
                            isVerified: true,
                          },
                        ]);
                      }
                    }}
                    className={`relative h-48 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center ${
                      currentMaidProfile?.additionalPhoto1 ? "cursor-pointer group" : ""
                    }`}
                  >
                    {currentMaidProfile?.additionalPhoto1 ? (
                      <>
                        <img
                          src={currentMaidProfile.additionalPhoto1}
                          alt="Photo 2"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Eye className="w-6 h-6 text-white drop-shadow-md" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4 space-y-1">
                        <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                        <span className="text-xs text-slate-500 font-bold block">No Uniform Photo</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={additionalPhoto1Title}
                      onChange={(e) => setAdditionalPhoto1Title(e.target.value)}
                      placeholder="e.g. Work Uniform / Apron"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <label className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-center text-xs font-bold rounded-xl cursor-pointer transition-all">
                    <span>{currentMaidProfile?.additionalPhoto1 ? "Replace Photo" : "Upload Photo 2"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === "string") {
                              uploadAdditionalPhoto(1, reader.result, additionalPhoto1Title);
                              setPhotoFeedback("Photo 2 updated!");
                              setTimeout(() => setPhotoFeedback(null), 3000);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {currentMaidProfile?.additionalPhoto1 && (
                    <button
                      onClick={() => removeAdditionalPhoto(1)}
                      className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Photo 3: Additional Photo 2 */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Photo 3: Skill Demonstration
                    </span>
                    {currentMaidProfile?.additionalPhoto2 ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                        Uploaded
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded-full">
                        Optional
                      </span>
                    )}
                  </div>
                  <div
                    onClick={() => {
                      if (currentMaidProfile?.additionalPhoto2) {
                        openDocLightbox([
                          {
                            url: currentMaidProfile.additionalPhoto2,
                            title: additionalPhoto2Title || "Skill Demonstration",
                            subtitle: "Domestic & Childcare Expertise",
                            isVerified: true,
                          },
                        ]);
                      }
                    }}
                    className={`relative h-48 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center ${
                      currentMaidProfile?.additionalPhoto2 ? "cursor-pointer group" : ""
                    }`}
                  >
                    {currentMaidProfile?.additionalPhoto2 ? (
                      <>
                        <img
                          src={currentMaidProfile.additionalPhoto2}
                          alt="Photo 3"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Eye className="w-6 h-6 text-white drop-shadow-md" />
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4 space-y-1">
                        <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                        <span className="text-xs text-slate-500 font-bold block">No Cooking/Skill Photo</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={additionalPhoto2Title}
                      onChange={(e) => setAdditionalPhoto2Title(e.target.value)}
                      placeholder="e.g. Cooking, Baking, or Childcare"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <label className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-center text-xs font-bold rounded-xl cursor-pointer transition-all">
                    <span>{currentMaidProfile?.additionalPhoto2 ? "Replace Photo" : "Upload Photo 3"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === "string") {
                              uploadAdditionalPhoto(2, reader.result, additionalPhoto2Title);
                              setPhotoFeedback("Photo 3 updated!");
                              setTimeout(() => setPhotoFeedback(null), 3000);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {currentMaidProfile?.additionalPhoto2 && (
                    <button
                      onClick={() => removeAdditionalPhoto(2)}
                      className="p-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-xl"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {photoFeedback && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {photoFeedback}
              </div>
            )}
          </div>

          {/* Full Work Portfolio Component */}
          <MediaUploadComponent mode="maid-only" />
        </div>
      )}

      {/* TAB 3: NATIONAL ID & CERTIFICATES */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Secure Document Management
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              National ID & Professional Certificates Vault
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl">
              Upload your Zimbabwe National ID, CID Police Clearance, Red Cross certifications, and employer reference letters. Stored in encrypted storage and reviewed only by authorized ZMC administrators.
            </p>
          </div>

          {/* Upload New Document Form */}
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              Upload New Document or Certificate
            </h3>

            {docUploadFeedback && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {docUploadFeedback}
              </div>
            )}

            <form onSubmit={handleUploadDocumentSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Category</label>
                <select
                  value={newDocType}
                  onChange={(e) => {
                    const t = e.target.value as any;
                    setNewDocType(t);
                    if (t === "National ID") setNewDocTitle("Zimbabwe National ID Card");
                    else if (t === "Police Clearance") setNewDocTitle("ZRP Criminal Record Clearance");
                    else if (t === "Certificate") setNewDocTitle("First Aid / Housekeeping Certificate");
                    else setNewDocTitle("Employer Reference Letter");
                  }}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none"
                >
                  <option value="National ID">Zimbabwe National ID</option>
                  <option value="Police Clearance">Police Clearance (ZRP)</option>
                  <option value="Certificate">Certificate (First Aid, Childcare, Baking)</option>
                  <option value="Reference">Employer Reference Letter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Title / Label</label>
                <input
                  type="text"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="e.g. Red Cross First Aid"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document / Serial Number</label>
                <input
                  type="text"
                  value={newDocNumber}
                  onChange={(e) => setNewDocNumber(e.target.value)}
                  placeholder="e.g. 63-208941-K-44 or CID-9921"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isUploadingDoc}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {isUploadingDoc ? "Uploading..." : "Upload to Vault"}
                </button>
              </div>
            </form>
          </div>

          {/* Uploaded Documents List */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-900">Your Secure Document Records</h3>
            {currentMaidProfile?.privateDocuments && currentMaidProfile.privateDocuments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentMaidProfile.privateDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                          {doc.documentType}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                            doc.verificationStatus === "Verified"
                              ? "bg-emerald-100 text-emerald-800"
                              : doc.verificationStatus === "Rejected"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {doc.verificationStatus === "Verified" ? "✓ Verified" : doc.verificationStatus}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-xs truncate">{doc.documentTitle || doc.documentType}</h4>
                      <p className="text-[11px] text-slate-500 font-mono truncate">
                        {doc.documentNumber ? `No: ${doc.documentNumber}` : `Doc ID: ${doc.id}`}
                      </p>
                      <span className="text-[10px] text-slate-400 block">Uploaded: {doc.uploadedAt}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                      <button
                        type="button"
                        onClick={() =>
                          openDocLightbox([
                            {
                              url: doc.fileUrl,
                              title: doc.documentTitle || doc.documentType,
                              subtitle: `Document Type: ${doc.documentType} • Status: ${doc.verificationStatus}`,
                              isVerified: doc.verificationStatus === "Verified",
                            },
                          ])
                        }
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Document
                      </button>
                      <button
                        onClick={() => deleteWorkerDocument(doc.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-bold">No documents uploaded yet.</p>
                <p className="text-[11px] text-slate-400">Upload your National ID to get vetted by the Admin team.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: BROWSE EMPLOYER JOBS */}
      {activeTab === "browse-jobs" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Employer Household Jobs</h2>
              <p className="text-xs text-slate-500">
                Explore vetted household vacancies across Zimbabwe and apply directly with your verified profile.
              </p>
            </div>
          </div>

          {/* Job Search & Filter Toolbar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search job title, suburb, skill..."
                  value={jobSearchQuery}
                  onChange={(e) => setJobSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <select
                  value={jobCityFilter}
                  onChange={(e) => setJobCityFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none"
                >
                  <option value="All">All Zimbabwe Cities</option>
                  {ALL_ZIMBABWE_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={jobAccommodationFilter}
                  onChange={(e) => setJobAccommodationFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none"
                >
                  <option value="All">Any Accommodation (Live-in / Live-out)</option>
                  <option value="Live-in">Live-in Only</option>
                  <option value="Live-out">Live-out Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        {job.location} ({job.suburb})
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-1">{job.title}</h3>
                      <div className="text-xs text-slate-500 font-medium">
                        Employer: <strong>{job.employerTitleSurname}</strong>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-slate-900">${job.salary}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">USD / {job.salaryPeriod}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {job.description || "Looking for an experienced and reliable domestic worker for general housekeeping."}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      <Home className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{job.accommodation}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{job.daysOff}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {job.requiredSkills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Posted: {job.datePosted}</span>
                  <button
                    onClick={() => {
                      setSelectedJobToApply(job);
                      setAppFeedback(null);
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Apply for Vacancy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MY APPLICATIONS */}
      {activeTab === "my-applications" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Your Submitted Job Applications</h2>
            <p className="text-xs text-slate-500">Track responses and interview requests from prospective employers.</p>
          </div>

          {maidApplications.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <Send className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-bold">You have not submitted any applications yet.</p>
              <button
                onClick={() => setActiveTab("browse-jobs")}
                className="mt-3 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
              >
                Browse Available Vacancies
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {maidApplications.map((app) => (
                <div key={app.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{app.jobTitle}</h4>
                      <span className="text-[11px] text-slate-500">Applied on {app.appliedAt}</span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        app.status === "Shortlisted"
                          ? "bg-emerald-100 text-emerald-800"
                          : app.status === "Hired"
                          ? "bg-purple-100 text-purple-800"
                          : app.status === "Rejected"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  {app.coverNote && (
                    <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/80">
                      "{app.coverNote}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: WORKER WALLET & PAYNOW DEPOSITS */}
      {activeTab === "wallet" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Worker Wallet & Paynow Gateway</h2>
                <p className="text-xs text-slate-500">
                  Manage worker funds via Paynow (EcoCash, OneMoney, Visa/MasterCard, InnBucks) for profile boosts and job access.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAddFundsOpen(true);
                  setPaynowCheckoutState(null);
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Deposit Funds via Paynow
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Current Balance</span>
                <div className="text-2xl font-black text-emerald-400">${currentWallet.balance.toFixed(2)} USD</div>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Spent</span>
                <div className="text-2xl font-black text-slate-900">${currentWallet.totalSpent.toFixed(2)} USD</div>
              </div>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Payment Gateway</span>
                <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5 pt-1">
                  <CreditCard className="w-4 h-4 text-emerald-600" /> Paynow Zimbabwe
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JOB APPLICATION MODAL */}
      {selectedJobToApply && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedJobToApply(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all active:scale-95 border border-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedJobToApply(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
                title="Close (Escape)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-emerald-700 uppercase">Apply for Vacancy</div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{selectedJobToApply.title}</h2>
              <p className="text-xs text-slate-500">
                Employer: <strong>{selectedJobToApply.employerTitleSurname}</strong> • {selectedJobToApply.location} ($
                {selectedJobToApply.salary} USD/{selectedJobToApply.salaryPeriod})
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

      {/* WORKER PAYNOW ADD FUNDS MODAL */}
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
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Add Funds to Worker Wallet</h2>
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
                    {[10, 20, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDepositAmount(amt)}
                        className={`py-2.5 rounded-xl font-black text-xs transition-all ${
                          depositAmount === amt
                            ? "bg-slate-900 text-white shadow-md"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Or Custom Amount ($ USD)</label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-black focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["EcoCash", "OneMoney", "Visa / MasterCard", "InnBucks"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentMethod(m)}
                        className={`p-3 rounded-xl text-xs font-bold text-left transition-all border ${
                          paymentMethod === m
                            ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleInitiatePaynow}
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  {isProcessingPayment ? "Connecting to Paynow..." : `Pay $${depositAmount}.00 USD via Paynow`}
                </button>
              </div>
            ) : (
              <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-center space-y-1">
                  <div className="text-xs font-bold text-slate-500">Paynow Transaction Created</div>
                  <div className="font-mono text-sm font-black text-slate-900">{paynowCheckoutState.paynowReference}</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <p>A secure Paynow checkout has been initiated on Zimbabwe Maids Centre.</p>
                  <p className="text-[11px] text-slate-400 font-mono">ID: {paynowCheckoutState.transactionId}</p>
                </div>

                <div className="space-y-2">
                  <a
                    href={paynowCheckoutState.checkoutUrl}
                    target="_self"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Paynow Gateway (Same Window)
                  </a>

                  <button
                    type="button"
                    onClick={handleCheckPaynowStatus}
                    disabled={isProcessingPayment}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isProcessingPayment ? "animate-spin" : ""}`} />
                    {isProcessingPayment ? "Checking Server..." : "Verify Payment Status"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox for Maid's uploaded Photos and Documents */}
      <ImageLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={lightboxImages}
        initialIndex={lightboxIndex}
        backLabel="Back to Dashboard"
      />
    </div>
  );
};
