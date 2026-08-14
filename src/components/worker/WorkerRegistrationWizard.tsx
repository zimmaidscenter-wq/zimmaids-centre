import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Briefcase,
  Languages,
  Users,
  ShieldCheck,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Save,
  Check,
  FileCheck,
  Eye,
  Info,
  DollarSign,
  HeartHandshake,
  Clock,
  Home,
  X,
  FileUp,
  Award,
  Camera
} from "lucide-react";
import {
  StandardizedWorkerRegistration,
  EnglishProficiency,
  EmploymentTypePreference,
  MaritalStatus,
  PreviousEmploymentRecord,
  VerificationDocumentUpload,
} from "../../types/workerRegistration";
import { CityLocation } from "../../types/marketplace";
import {
  ZIMBABWE_PROVINCES,
  STANDARD_JOB_CATEGORIES,
  STANDARD_LANGUAGES,
  calculateAgeFromDob,
  normalizeZimbabwePhoneNumber,
} from "../../utils/whatsappTemplates";
import { ProfileCompletenessWidget } from "../common/ProfileCompletenessWidget";
import { CandidatePhotosManager, CandidatePhotosState } from "../marketplace/CandidatePhotosManager";

interface WorkerRegistrationWizardProps {
  initialData?: Partial<StandardizedWorkerRegistration>;
  onSubmitSuccess?: (registration: StandardizedWorkerRegistration) => void;
  onCancel?: () => void;
}

const STORAGE_KEY = "ZMC_WORKER_REGISTRATION_DRAFT_V2";

export const WorkerRegistrationWizard: React.FC<WorkerRegistrationWizardProps> = ({
  initialData,
  onSubmitSuccess,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [customLanguage, setCustomLanguage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Default initial registration state
  const [formData, setFormData] = useState<StandardizedWorkerRegistration>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && !initialData) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }

    return {
      id: initialData?.id || `w-reg-${Date.now()}`,
      fullName: initialData?.fullName || "",
      dateOfBirth: initialData?.dateOfBirth || "1998-05-14",
      age: initialData?.age || 28,
      gender: initialData?.gender || "Female",
      nationalId: initialData?.nationalId || "",
      phoneNumber: initialData?.phoneNumber || "+263 ",
      email: initialData?.email || "",
      residentialAddress: initialData?.residentialAddress || "",
      city: initialData?.city || "Harare",
      province: initialData?.province || "Harare Metropolitan",
      nationality: initialData?.nationality || "Zimbabwean",
      maritalStatus: initialData?.maritalStatus || "Single",

      // Step 2
      englishProficiency: initialData?.englishProficiency || "Good",
      languagesSpoken: initialData?.languagesSpoken?.length
        ? initialData.languagesSpoken
        : ["English", "Shona"],

      // Step 3
      jobCategories: initialData?.jobCategories?.length
        ? initialData.jobCategories
        : ["Housekeeper"],
      expectedMonthlySalaryUSD: initialData?.expectedMonthlySalaryUSD || 220,
      preferredWorkLocation: initialData?.preferredWorkLocation || "Harare (Northern Suburbs)",
      employmentType: initialData?.employmentType || "Live In",
      availabilityDate: initialData?.availabilityDate || new Date().toISOString().split("T")[0],
      immediateAvailability: initialData?.immediateAvailability ?? true,
      preferredProvince: initialData?.preferredProvince || "Harare Metropolitan",
      preferredCity: initialData?.preferredCity || "Harare",

      // Step 4
      familyDetails: initialData?.familyDetails || {
        hasChildren: false,
        numberOfChildren: 0,
        childrenAges: [],
      },

      // Step 5
      nextOfKin: initialData?.nextOfKin || {
        fullName: "",
        relationship: "Sister",
        nationalId: "",
        phoneNumber: "+263 ",
        residentialAddress: "",
      },

      // Step 6
      previousEmployments: initialData?.previousEmployments?.length
        ? initialData.previousEmployments
        : [
            {
              id: `emp-${Date.now()}`,
              formerEmployerName: "",
              positionHeld: "Housekeeper",
              startDate: "2022-01",
              endDate: "2024-12",
              employerAddress: "Avondale, Harare",
              employerPhone: "+263 ",
              reasonForLeaving: "Contract successfully completed",
              referenceConfirmed: true,
            },
          ],

      // Verification Uploads
      verificationDocuments: initialData?.verificationDocuments || [
        {
          type: "National ID",
          fileName: "National_ID_Front_Scan.jpg",
          fileSize: "1.4 MB",
          uploadDate: new Date().toISOString().split("T")[0],
          fileUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=300",
          isVerified: true,
        },
        {
          type: "Police Clearance",
          fileName: "ZRP_CID_Clearance_Certificate.pdf",
          fileSize: "2.1 MB",
          uploadDate: new Date().toISOString().split("T")[0],
          fileUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=300",
          isVerified: true,
        },
      ],

      // Declaration
      declaration: initialData?.declaration || {
        declaredTrueAndAccurate: true,
        agreedToVerification: true,
        agreedToTerms: true,
        digitalSignature: initialData?.fullName || "",
        signedDate: new Date().toISOString().split("T")[0],
      },

      candidatePhotos: initialData?.candidatePhotos || {
        primaryProfilePhoto: initialData?.avatarUrl || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
        fullLengthPhoto: initialData?.fullLengthPhotoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
        workActionPhoto: initialData?.workActionPhotoUrl || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800",
      },

      avatarUrl:
        initialData?.avatarUrl ||
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
      bio:
        initialData?.bio ||
        "Dedicated, honest, and experienced domestic specialist with verified ZRP police clearance and trustworthy employer references.",
      skills: initialData?.skills || ["Deep Cleaning", "Laundry & Steam Ironing", "Meal Preparation", "Child Care"],
      experienceYears: initialData?.experienceYears || 4,
      approvalStatus: initialData?.approvalStatus || "Pending Review",
      source: initialData?.source || "App Registration",
      aiTrustScore: initialData?.aiTrustScore || 95,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  // Calculate age when DOB changes
  useEffect(() => {
    if (formData.dateOfBirth) {
      const calculatedAge = calculateAgeFromDob(formData.dateOfBirth);
      setFormData((prev) => ({ ...prev, age: calculatedAge }));
    }
  }, [formData.dateOfBirth]);

  // Save draft helper
  const handleSaveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    setSaveSuccessNotice("Draft saved successfully! You can resume anytime.");
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // Validate current step
  const validateStep = (stepNumber: number): boolean => {
    const errors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.fullName.trim()) errors.fullName = "Full Name is required";
      if (!formData.nationalId.trim()) errors.nationalId = "National ID Number is required";
      if (!formData.phoneNumber.trim() || formData.phoneNumber.length < 8)
        errors.phoneNumber = "Valid Zimbabwean phone number is required (+263...)";
      if (!formData.residentialAddress.trim()) errors.residentialAddress = "Residential Address is required";
      if (formData.age < 18) errors.dateOfBirth = "Worker must be at least 18 years old";
    }

    if (stepNumber === 2) {
      if (formData.languagesSpoken.length === 0)
        errors.languagesSpoken = "Please select at least one language spoken";
    }

    if (stepNumber === 3) {
      if (formData.jobCategories.length === 0)
        errors.jobCategories = "Please select at least one primary job category";
      if (formData.expectedMonthlySalaryUSD <= 0)
        errors.expectedMonthlySalaryUSD = "Please provide expected monthly salary in USD";
    }

    if (stepNumber === 5) {
      if (!formData.nextOfKin.fullName.trim())
        errors.nextOfKinName = "Next of kin full name is required for emergency contact";
      if (!formData.nextOfKin.phoneNumber.trim())
        errors.nextOfKinPhone = "Next of kin phone number is required";
    }

    if (stepNumber === 7) {
      if (!formData.declaration.agreedToTerms)
        errors.agreedToTerms = "You must agree to the Terms & Conditions";
      if (!formData.declaration.declaredTrueAndAccurate)
        errors.declaredTrueAndAccurate = "You must declare that all provided information is accurate";
      if (!formData.declaration.digitalSignature.trim())
        errors.digitalSignature = "Please provide your digital signature";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setValidationErrors({});
      setCurrentStep((prev) => Math.min(prev + 1, 7));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setValidationErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 2: Language toggling
  const toggleLanguage = (lang: string) => {
    setFormData((prev) => {
      const exists = prev.languagesSpoken.includes(lang);
      return {
        ...prev,
        languagesSpoken: exists
          ? prev.languagesSpoken.filter((l) => l !== lang)
          : [...prev.languagesSpoken, lang],
      };
    });
  };

  const handleAddCustomLanguage = () => {
    if (customLanguage.trim() && !formData.languagesSpoken.includes(customLanguage.trim())) {
      setFormData((prev) => ({
        ...prev,
        languagesSpoken: [...prev.languagesSpoken, customLanguage.trim()],
      }));
      setCustomLanguage("");
    }
  };

  // Step 3: Job categories toggling
  const toggleJobCategory = (cat: string) => {
    setFormData((prev) => {
      const exists = prev.jobCategories.includes(cat);
      const updated = exists
        ? prev.jobCategories.filter((c) => c !== cat)
        : [...prev.jobCategories, cat];
      return {
        ...prev,
        jobCategories: updated.length > 0 ? updated : [cat],
      };
    });
  };

  // Step 4: Children management
  const handleSetHasChildren = (has: boolean) => {
    setFormData((prev) => ({
      ...prev,
      familyDetails: {
        hasChildren: has,
        numberOfChildren: has ? Math.max(1, prev.familyDetails.numberOfChildren) : 0,
        childrenAges: has && prev.familyDetails.childrenAges.length === 0 ? [5] : has ? prev.familyDetails.childrenAges : [],
      },
    }));
  };

  const handleUpdateChildrenCount = (count: number) => {
    const validCount = Math.max(0, count);
    const newAges = [...formData.familyDetails.childrenAges];
    while (newAges.length < validCount) newAges.push(5);
    while (newAges.length > validCount) newAges.pop();

    setFormData((prev) => ({
      ...prev,
      familyDetails: {
        hasChildren: validCount > 0,
        numberOfChildren: validCount,
        childrenAges: newAges,
      },
    }));
  };

  const handleUpdateChildAge = (index: number, age: number) => {
    const newAges = [...formData.familyDetails.childrenAges];
    newAges[index] = Math.max(0, Math.min(30, age));
    setFormData((prev) => ({
      ...prev,
      familyDetails: {
        ...prev.familyDetails,
        childrenAges: newAges,
      },
    }));
  };

  // Step 6: Previous Employment CRUD
  const handleAddPreviousEmployment = () => {
    const newRecord: PreviousEmploymentRecord = {
      id: `emp-${Date.now()}`,
      formerEmployerName: "",
      positionHeld: formData.jobCategories[0] || "Housekeeper",
      startDate: "2022-01",
      endDate: "2024-12",
      employerAddress: `${formData.city}, Zimbabwe`,
      employerPhone: "+263 ",
      reasonForLeaving: "Contract ended",
      referenceConfirmed: false,
    };
    setFormData((prev) => ({
      ...prev,
      previousEmployments: [...prev.previousEmployments, newRecord],
    }));
  };

  const handleUpdatePreviousEmployment = (
    index: number,
    field: keyof PreviousEmploymentRecord,
    val: any
  ) => {
    const updated = [...formData.previousEmployments];
    updated[index] = { ...updated[index], [field]: val };
    setFormData((prev) => ({ ...prev, previousEmployments: updated }));
  };

  const handleRemovePreviousEmployment = (index: number) => {
    if (formData.previousEmployments.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      previousEmployments: prev.previousEmployments.filter((_, i) => i !== index),
    }));
  };

  // Verification Document Mock Upload
  const handleSimulateDocumentUpload = (docType: VerificationDocumentUpload["type"]) => {
    const sampleNames: Record<string, string> = {
      "National ID": "National_ID_Zim_Scan.jpg",
      "Passport Photo": "Worker_Passport_Photo.png",
      "CV / Resume": "Worker_Curriculum_Vitae.pdf",
      "Certificates": "RedCross_FirstAid_Certificate.pdf",
      "Reference Letters": "Employer_Recommendation_Letter.pdf",
      "Police Clearance": "ZRP_CID_Police_Clearance_2026.pdf",
      "Medical Certificate": "Food_Handlers_Medical_Cert.pdf",
      "Proof of Address": "ZESA_Proof_Of_Residence.pdf",
    };

    const newDoc: VerificationDocumentUpload = {
      type: docType,
      fileName: sampleNames[docType] || `${docType.replace(/\s+/g, "_")}_Upload.pdf`,
      fileSize: "1.8 MB",
      uploadDate: new Date().toISOString().split("T")[0],
      fileUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=300",
      isVerified: true,
    };

    setFormData((prev) => {
      const filtered = prev.verificationDocuments.filter((d) => d.type !== docType);
      return {
        ...prev,
        verificationDocuments: [...filtered, newDoc],
      };
    });
  };

  const handleRemoveDocument = (docType: string) => {
    setFormData((prev) => ({
      ...prev,
      verificationDocuments: prev.verificationDocuments.filter((d) => d.type !== docType),
    }));
  };

  // Final Submission
  const handleSubmitRegistration = async () => {
    if (!validateStep(7)) return;

    setIsSubmitting(true);
    // Prepare completed submission
    const finalSubmission: StandardizedWorkerRegistration = {
      ...formData,
      phoneNumber: normalizeZimbabwePhoneNumber(formData.phoneNumber),
      approvalStatus: "Pending Review",
      updatedAt: new Date().toISOString(),
    };

    // Save to local storage cache & clear draft
    localStorage.removeItem(STORAGE_KEY);

    // Short processing delay for realistic UX
    setTimeout(() => {
      setIsSubmitting(false);
      if (onSubmitSuccess) {
        onSubmitSuccess(finalSubmission);
      }
    }, 1200);
  };

  const STEPS = [
    { id: 1, title: "Personal Details", icon: User, desc: "ID, Contact & Location" },
    { id: 2, title: "Language Skills", icon: Languages, desc: "Proficiency & Languages" },
    { id: 3, title: "Employment Preferences", icon: Briefcase, desc: "Roles, Salary & Mode" },
    { id: 4, title: "Family Details", icon: Users, desc: "Dependents & Ages" },
    { id: 5, title: "Next of Kin", icon: HeartHandshake, desc: "Emergency Contact" },
    { id: 6, title: "Previous Work", icon: Clock, desc: "Employment History" },
    { id: 7, title: "Docs & Sign", icon: FileCheck, desc: "Uploads & Declaration" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden mb-8 border border-emerald-800">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-800/80 rounded-full text-xs font-bold text-emerald-200 border border-emerald-700/60">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Domestic Worker Registration Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Domestic Worker Registration Wizard
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Standardized 6-step registration for household professionals across Zimbabwe. Your profile will be verified by the admin team and published across our marketplace directory.
          </p>
        </div>

        {/* Action badges & Save Draft */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-emerald-800/60 mt-4 relative z-10">
          <button
            onClick={handleSaveDraft}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20 backdrop-blur-sm"
          >
            <Save className="w-3.5 h-3.5 text-emerald-300" />
            <span>Save Progress Draft</span>
          </button>

          <button
            onClick={() => setShowPreviewModal(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 text-amber-300" />
            <span>Live Profile Preview</span>
          </button>

          {saveSuccessNotice && (
            <span className="text-xs text-emerald-300 font-bold animate-in fade-in flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{saveSuccessNotice}</span>
            </span>
          )}
        </div>
      </div>

      {/* Profile Completeness Visual Progress Bar */}
      <div className="mb-6">
        <ProfileCompletenessWidget
          profile={{
            fullName: formData.fullName,
            name: formData.fullName,
            bio: formData.bio,
            photoUrl: formData.candidatePhotos?.primaryProfilePhoto || formData.avatarUrl,
            candidatePhotos: formData.candidatePhotos,
            fullLengthPhotoUrl: formData.candidatePhotos?.fullLengthPhoto,
            workActionPhotoUrl: formData.candidatePhotos?.workActionPhoto,
            skills: formData.skills,
            rateUSD: formData.expectedMonthlySalaryUSD,
            policeVerified: formData.verificationDocuments.some((d) => d.type === "Police Clearance"),
            verifiedReferencesCount: formData.previousEmployments.length,
          }}
          portfolio={[]}
          variant="detailed"
        />
      </div>

      {/* Material Design 3 Progress Stepper */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between overflow-x-auto pb-2 gap-2">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <button
                key={step.id}
                onClick={() => {
                  if (isCompleted || isCurrent) setCurrentStep(step.id);
                }}
                className={`flex items-center space-x-3 p-2.5 rounded-2xl transition-all shrink-0 text-left ${
                  isCurrent
                    ? "bg-emerald-900 text-white shadow-md ring-2 ring-emerald-600/30"
                    : isCompleted
                    ? "bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                    : "bg-slate-50 text-slate-400 cursor-not-allowed opacity-75"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                    isCurrent
                      ? "bg-emerald-500 text-slate-950 shadow-inner"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-black leading-none">{step.title}</div>
                  <div
                    className={`text-[10px] mt-0.5 ${
                      isCurrent ? "text-emerald-200" : isCompleted ? "text-emerald-700" : "text-slate-400"
                    }`}
                  >
                    {step.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full transition-all duration-300"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Step Content Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
        {/* ================= STEP 1: PERSONAL DETAILS ================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                <span>Step 1: Personal Identification & Details</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your official details exactly as they appear on your Zimbabwe National Identity Card.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name (First & Surname) *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Tariro Sizani Moyo"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
                {validationErrors.fullName && (
                  <p className="text-[11px] text-rose-600 font-bold mt-1">{validationErrors.fullName}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Date of Birth (DD/MM/YYYY) *
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
                {validationErrors.dateOfBirth && (
                  <p className="text-[11px] text-rose-600 font-bold mt-1">{validationErrors.dateOfBirth}</p>
                )}
              </div>

              {/* Age (Auto-calculated) */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Age (Years, Auto-Calculated)
                </label>
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs sm:text-sm font-mono font-black text-emerald-900 flex items-center justify-between">
                  <span>{formData.age} Years Old</span>
                  <span className="text-[10px] text-emerald-700 uppercase font-sans font-bold">Auto-Computed</span>
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Marital Status */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Marital Status *
                </label>
                <select
                  value={formData.maritalStatus}
                  onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value as MaritalStatus })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
              </div>

              {/* National ID */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  National ID Number (Zimbabwe) *
                </label>
                <input
                  type="text"
                  value={formData.nationalId}
                  onChange={(e) => setFormData({ ...formData, nationalId: e.target.value.toUpperCase() })}
                  placeholder="e.g. 63-289410-F-42"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
                <p className="text-[10px] text-slate-400 mt-1">Format: District-Number-CheckLetter-DistrictCode</p>
                {validationErrors.nationalId && (
                  <p className="text-[11px] text-rose-600 font-bold mt-1">{validationErrors.nationalId}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  WhatsApp / Phone Number *
                </label>
                <input
                  type="text"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="e.g. +263 78 545 8828"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
                {validationErrors.phoneNumber && (
                  <p className="text-[11px] text-rose-600 font-bold mt-1">{validationErrors.phoneNumber}</p>
                )}
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. candidate@example.com"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>

              {/* Nationality */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nationality *
                </label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>

              {/* City / Town */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Current City / Town *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value as CityLocation })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                >
                  {["Harare", "Bulawayo", "Mutare", "Gweru", "Chinhoyi", "Kwekwe", "Masvingo", "Kadoma", "Marondera", "Victoria Falls"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Province */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Province *
                </label>
                <select
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                >
                  {ZIMBABWE_PROVINCES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Residential Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Physical Residential Address (House Number, Street, Suburb) *
                </label>
                <input
                  type="text"
                  value={formData.residentialAddress}
                  onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })}
                  placeholder="e.g. Stand 442, Glen View 3, Harare"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
                {validationErrors.residentialAddress && (
                  <p className="text-[11px] text-rose-600 font-bold mt-1">{validationErrors.residentialAddress}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: LANGUAGE PROFICIENCY ================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <Languages className="w-5 h-5 text-emerald-600" />
                <span>Step 2: Language Proficiency</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select your level of English and all languages you speak comfortably for household communication.
              </p>
            </div>

            {/* English Proficiency */}
            <div className="space-y-3">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                English Proficiency Level *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {(["Excellent", "Good", "Fair", "Basic", "None"] as EnglishProficiency[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, englishProficiency: level })}
                    className={`p-3.5 rounded-2xl font-black text-xs transition-all text-center border ${
                      formData.englishProficiency === level
                        ? "bg-emerald-900 text-white border-emerald-800 shadow-md ring-2 ring-emerald-500/30"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages Spoken */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Languages Spoken (Select All That Apply) *
              </label>
              <div className="flex flex-wrap gap-2.5">
                {STANDARD_LANGUAGES.map((lang) => {
                  const isSelected = formData.languagesSpoken.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all border ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 ${isSelected ? "opacity-100" : "opacity-0"}`} />
                      <span>{lang}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Language */}
              <div className="flex items-center gap-2 pt-2 max-w-md">
                <input
                  type="text"
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  placeholder="Add other language (e.g. Portuguese, French)"
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 flex-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomLanguage}
                  disabled={!customLanguage.trim()}
                  className="px-4 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {validationErrors.languagesSpoken && (
                <p className="text-[11px] text-rose-600 font-bold mt-1">{validationErrors.languagesSpoken}</p>
              )}
            </div>
          </div>
        )}

        {/* ================= STEP 3: EMPLOYMENT PREFERENCES ================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <span>Step 3: Employment Preferences & Salary</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select your preferred job roles, desired monthly salary in USD, and accommodation preferences.
              </p>
            </div>

            {/* Job Categories */}
            <div className="space-y-3">
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Job Categories (Select multiple if versatile) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {STANDARD_JOB_CATEGORIES.map((cat) => {
                  const isSelected = formData.jobCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleJobCategory(cat)}
                      className={`p-3 rounded-2xl text-xs font-bold text-left transition-all flex items-center justify-between border ${
                        isSelected
                          ? "bg-emerald-900 text-white border-emerald-800 shadow-sm ring-1 ring-emerald-500"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span>{cat}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
              {validationErrors.jobCategories && (
                <p className="text-[11px] text-rose-600 font-bold mt-1">{validationErrors.jobCategories}</p>
              )}
            </div>

            {/* Expected Salary USD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Expected Monthly Salary (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    min={100}
                    max={1500}
                    step={10}
                    value={formData.expectedMonthlySalaryUSD}
                    onChange={(e) => setFormData({ ...formData, expectedMonthlySalaryUSD: Number(e.target.value) })}
                    className="w-full pl-8 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs text-slate-400 font-bold">USD / Month</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                  <span>Market Avg: $180 - $280/mo</span>
                  <span>Minimum Guidance: $150</span>
                </div>
              </div>

              {/* Employment Type */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Employment Type *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Live In", "Live Out", "Either"] as EmploymentTypePreference[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, employmentType: type })}
                      className={`p-3 rounded-2xl font-bold text-xs border text-center transition-all ${
                        formData.employmentType === type
                          ? "bg-emerald-800 text-white border-emerald-700 shadow-sm"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Immediate Availability Toggle */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Immediate Availability
                </label>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                  <input
                    type="checkbox"
                    id="immediateAvail"
                    checked={formData.immediateAvailability}
                    onChange={(e) => setFormData({ ...formData, immediateAvailability: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="immediateAvail" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Available to start work immediately
                  </label>
                </div>
              </div>

              {/* Preferred City & Suburbs */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preferred Work Area / Suburbs
                </label>
                <input
                  type="text"
                  value={formData.preferredWorkLocation}
                  onChange={(e) => setFormData({ ...formData, preferredWorkLocation: e.target.value })}
                  placeholder="e.g. Borrowdale, Highlands, Avondale, Greendale"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 4: FAMILY DETAILS ================= */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Step 4: Family Details & Dependents</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Provide information regarding your children or dependents so employers understand your family background and scheduling flexibility.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  Do you have children? *
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => handleSetHasChildren(true)}
                    className={`px-6 py-3 rounded-2xl font-bold text-xs border transition-all ${
                      formData.familyDetails.hasChildren
                        ? "bg-emerald-900 text-white border-emerald-800 shadow-md"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Yes, I have children
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetHasChildren(false)}
                    className={`px-6 py-3 rounded-2xl font-bold text-xs border transition-all ${
                      !formData.familyDetails.hasChildren
                        ? "bg-emerald-900 text-white border-emerald-800 shadow-md"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    No children
                  </button>
                </div>
              </div>

              {formData.familyDetails.hasChildren && (
                <div className="p-5 bg-emerald-50/50 border border-emerald-200 rounded-3xl space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-xs text-emerald-950 uppercase tracking-wider">
                        Number of Children:
                      </h4>
                      <p className="text-[11px] text-emerald-800">Specify age for each dependent</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-emerald-200">
                      <button
                        type="button"
                        onClick={() => handleUpdateChildrenCount(formData.familyDetails.numberOfChildren - 1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-black text-xs text-slate-800"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono font-black text-xs text-emerald-950">
                        {formData.familyDetails.numberOfChildren}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateChildrenCount(formData.familyDetails.numberOfChildren + 1)}
                        className="w-7 h-7 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-black text-xs text-white"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {formData.familyDetails.childrenAges.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {formData.familyDetails.childrenAges.map((age, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-2xl border border-emerald-200 space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 block">
                            Child #{idx + 1} Age (Years)
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={30}
                            value={age}
                            onChange={(e) => handleUpdateChildAge(idx, parseInt(e.target.value, 10) || 0)}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= STEP 5: NEXT OF KIN ================= */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-emerald-600" />
                <span>Step 5: Next of Kin (Emergency Contact)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Provide contact details for your immediate family member or trusted relative in case of emergency.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Next of Kin Full Name *
                </label>
                <input
                  type="text"
                  value={formData.nextOfKin.fullName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nextOfKin: { ...formData.nextOfKin, fullName: e.target.value },
                    })
                  }
                  placeholder="e.g. Tendai Moyo"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
                {validationErrors.nextOfKinName && (
                  <p className="text-[11px] text-rose-600 font-bold mt-1">{validationErrors.nextOfKinName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Relationship *
                </label>
                <select
                  value={formData.nextOfKin.relationship}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nextOfKin: { ...formData.nextOfKin, relationship: e.target.value },
                    })
                  }
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Sister">Sister</option>
                  <option value="Brother">Brother</option>
                  <option value="Spouse">Spouse / Partner</option>
                  <option value="Aunt">Aunt</option>
                  <option value="Uncle">Uncle</option>
                  <option value="Cousin">Cousin</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Other">Other Relative</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Next of Kin Phone Number *
                </label>
                <input
                  type="text"
                  value={formData.nextOfKin.phoneNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nextOfKin: { ...formData.nextOfKin, phoneNumber: e.target.value },
                    })
                  }
                  placeholder="e.g. +263 77 345 8899"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
                {validationErrors.nextOfKinPhone && (
                  <p className="text-[11px] text-rose-600 font-bold mt-1">{validationErrors.nextOfKinPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  National ID (Optional)
                </label>
                <input
                  type="text"
                  value={formData.nextOfKin.nationalId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nextOfKin: { ...formData.nextOfKin, nationalId: e.target.value.toUpperCase() },
                    })
                  }
                  placeholder="e.g. 63-990123-K-19"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Next of Kin Residential Address
                </label>
                <input
                  type="text"
                  value={formData.nextOfKin.residentialAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nextOfKin: { ...formData.nextOfKin, residentialAddress: e.target.value },
                    })
                  }
                  placeholder="e.g. 12 Highfield Road, Harare"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 6: PREVIOUS EMPLOYMENT ================= */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <span>Step 6: Previous Employment & References</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  List your past domestic or artisan employers for reference verification.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddPreviousEmployment}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Employer</span>
              </button>
            </div>

            <div className="space-y-5">
              {formData.previousEmployments.map((record, index) => (
                <div
                  key={record.id}
                  className="bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 relative"
                >
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-xs font-black text-emerald-900 uppercase tracking-wider">
                      Employer #{index + 1} Record
                    </span>
                    {formData.previousEmployments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePreviousEmployment(index)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                        Former Employer Name *
                      </label>
                      <input
                        type="text"
                        value={record.formerEmployerName}
                        onChange={(e) => handleUpdatePreviousEmployment(index, "formerEmployerName", e.target.value)}
                        placeholder="e.g. Mrs. Margaret Chigumba"
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                        Position / Role Held *
                      </label>
                      <input
                        type="text"
                        value={record.positionHeld}
                        onChange={(e) => handleUpdatePreviousEmployment(index, "positionHeld", e.target.value)}
                        placeholder="e.g. Live-In Housekeeper & Nanny"
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                        Start Date - End Date
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={record.startDate}
                          onChange={(e) => handleUpdatePreviousEmployment(index, "startDate", e.target.value)}
                          placeholder="e.g. 2021"
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                        <input
                          type="text"
                          value={record.endDate}
                          onChange={(e) => handleUpdatePreviousEmployment(index, "endDate", e.target.value)}
                          placeholder="e.g. 2024"
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                        Employer Phone Number (For Reference) *
                      </label>
                      <input
                        type="text"
                        value={record.employerPhone}
                        onChange={(e) => handleUpdatePreviousEmployment(index, "employerPhone", e.target.value)}
                        placeholder="e.g. +263 77 234 5678"
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                        Reason for Leaving
                      </label>
                      <input
                        type="text"
                        value={record.reasonForLeaving}
                        onChange={(e) => handleUpdatePreviousEmployment(index, "reasonForLeaving", e.target.value)}
                        placeholder="e.g. Employer relocated overseas / Contract ended amicably"
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 7: DOCUMENTS & DECLARATION ================= */}
        {currentStep === 7 && (
          <div className="space-y-8">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <span>Step 7: Candidate Photos, Document Uploads & Declaration</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Upload your 3 appearance photos (Profile picture, Full-length photo, and Work-action photo), plus clear scans of your identification, CID Police Clearance, and certificates.
              </p>
            </div>

            {/* Candidate Appearance Photos (3 Required / Recommended Photos) */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Candidate Appearance Photos (Profile + 2 Full & Action Views)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Profiles with all 3 photos receive 3.8x more hire requests from Harare & Bulawayo employers.
                  </p>
                </div>
              </div>

              <CandidatePhotosManager
                photos={formData.candidatePhotos || {}}
                onChange={(updatedPhotos) => {
                  setFormData((prev) => ({
                    ...prev,
                    candidatePhotos: updatedPhotos,
                    avatarUrl: updatedPhotos.primaryProfilePhoto || prev.avatarUrl,
                  }));
                }}
              />
            </div>

            {/* Verification Documents Upload Grid */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileUp className="w-4 h-4 text-emerald-600" />
                <span>Verification Document Repository (8 Standard Categories)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "National ID",
                  "Passport Photo",
                  "CV / Resume",
                  "Certificates",
                  "Reference Letters",
                  "Police Clearance",
                  "Medical Certificate",
                  "Proof of Address",
                ].map((docType) => {
                  const uploaded = formData.verificationDocuments.find((d) => d.type === docType);

                  return (
                    <div
                      key={docType}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                        uploaded
                          ? "bg-emerald-50/60 border-emerald-300"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            uploaded ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs font-black text-slate-900 block">{docType}</strong>
                          {uploaded ? (
                            <span className="text-[10px] text-emerald-800 font-bold flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>{uploaded.fileName} ({uploaded.fileSize})</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Not uploaded</span>
                          )}
                        </div>
                      </div>

                      <div>
                        {uploaded ? (
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(docType)}
                            className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg text-xs"
                            title="Remove Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSimulateDocumentUpload(docType as any)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Upload</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legal Declaration & Digital Agreement */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800 shadow-xl">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h3 className="font-black text-sm text-white">
                    Official Legal Declaration & Consent Agreement
                  </h3>
                  <p className="text-xs text-slate-400">
                    Compliant with the Zimbabwe Cyber and Data Protection Act [Chapter 12:07]
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-300">
                <label className="flex items-start space-x-3 cursor-pointer p-3 bg-slate-950/60 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
                  <input
                    type="checkbox"
                    checked={formData.declaration.declaredTrueAndAccurate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        declaration: {
                          ...formData.declaration,
                          declaredTrueAndAccurate: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 mt-0.5 text-emerald-500 rounded focus:ring-emerald-400 shrink-0"
                  />
                  <span>
                    <strong>Truthfulness Declaration:</strong> I hereby declare that all personal details, employment history, qualifications, and references provided in this application are true, complete, and accurate.
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer p-3 bg-slate-950/60 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
                  <input
                    type="checkbox"
                    checked={formData.declaration.agreedToVerification}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        declaration: {
                          ...formData.declaration,
                          agreedToVerification: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 mt-0.5 text-emerald-500 rounded focus:ring-emerald-400 shrink-0"
                  />
                  <span>
                    <strong>Verification Consent:</strong> I authorize Zimbabwe Maids Centre to verify my references with former employers, inspect my ZRP CID police clearance, and conduct background vetting.
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer p-3 bg-slate-950/60 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
                  <input
                    type="checkbox"
                    checked={formData.declaration.agreedToTerms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        declaration: {
                          ...formData.declaration,
                          agreedToTerms: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 mt-0.5 text-emerald-500 rounded focus:ring-emerald-400 shrink-0"
                  />
                  <span>
                    <strong>Terms & Code of Conduct:</strong> I agree to the Zimbabwe Maids Centre Worker Code of Conduct, escrow payment terms, and platform dispute resolution guidelines.
                  </span>
                </label>
              </div>

              {/* Digital Signature */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                    Digital Signature (Type Full Legal Name) *
                  </label>
                  <input
                    type="text"
                    value={formData.declaration.digitalSignature}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        declaration: {
                          ...formData.declaration,
                          digitalSignature: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Tariro Sizani Moyo"
                    className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs sm:text-sm font-serif italic text-emerald-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                  />
                  {validationErrors.digitalSignature && (
                    <p className="text-[11px] text-rose-400 font-bold mt-1">{validationErrors.digitalSignature}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                    Date of Signature
                  </label>
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm font-mono text-slate-300">
                    {formData.declaration.signedDate} (UTC)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Step Navigation Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 text-slate-500 hover:text-slate-700 text-xs font-bold"
              >
                Cancel Registration
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-5 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Save className="w-3.5 h-3.5 text-slate-500" />
              <span>Save Draft</span>
            </button>

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitRegistration}
                disabled={isSubmitting}
                className="px-10 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-xl shadow-emerald-600/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                    <span>Submitting to Admin Queue...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Submit Official Registration</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live Profile Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base">
                  Standardized Worker Profile Live Preview
                </h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center space-x-4 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                <img
                  src={formData.avatarUrl}
                  alt={formData.fullName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                />
                <div>
                  <h4 className="text-base font-black text-slate-900">{formData.fullName || "Candidate Name"}</h4>
                  <p className="text-xs text-emerald-800 font-bold">
                    {formData.jobCategories.join(" • ")} ({formData.employmentType})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {formData.city}, {formData.province} • {formData.age} Years Old
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Expected Rate</span>
                  <strong className="text-emerald-700 font-mono text-sm">${formData.expectedMonthlySalaryUSD}/mo</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">English Level</span>
                  <strong className="text-slate-900 text-xs">{formData.englishProficiency}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Languages</span>
                  <strong className="text-slate-900 text-xs">{formData.languagesSpoken.join(", ")}</strong>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  Family & Emergency Contact:
                </span>
                <p className="text-slate-700">
                  <strong>Children:</strong> {formData.familyDetails.hasChildren ? `${formData.familyDetails.numberOfChildren} child(ren) (Ages: ${formData.familyDetails.childrenAges.join(", ")})` : "None"}
                </p>
                <p className="text-slate-700">
                  <strong>Next of Kin:</strong> {formData.nextOfKin.fullName || "N/A"} ({formData.nextOfKin.relationship}) • {formData.nextOfKin.phoneNumber}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  Previous Experience ({formData.previousEmployments.length} Record):
                </span>
                {formData.previousEmployments.map((emp, i) => (
                  <div key={i} className="text-slate-700 border-b border-slate-200 pb-2 last:border-b-0 last:pb-0">
                    <strong>{emp.formerEmployerName || "Former Employer"}</strong> — {emp.positionHeld} ({emp.startDate} to {emp.endDate})
                    <p className="text-[11px] text-slate-500">Ref: {emp.employerPhone} • Reason: {emp.reasonForLeaving}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-extrabold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
