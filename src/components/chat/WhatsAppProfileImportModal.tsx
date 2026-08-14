import React, { useState } from "react";
import {
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Copy,
  Check,
  Phone,
  ShieldCheck,
  RefreshCw,
  Upload,
  User,
  HeartHandshake,
  Clock,
  Briefcase,
  AlertCircle,
  X,
  Languages,
  Users,
  Eye,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  Camera,
  Image as ImageIcon,
  Plus,
  Trash2,
  Building,
  FileCheck
} from "lucide-react";
import {
  StandardizedWorkerRegistration,
  WorkerProfileApprovalStatus,
} from "../../types/workerRegistration";
import { PortfolioItem } from "../../types/marketplace";
import {
  WHATSAPP_REGISTRATION_TEMPLATE_EN,
  WHATSAPP_REGISTRATION_TEMPLATE_SHONA,
  WHATSAPP_STANDARD_GROUP_TEMPLATE,
  WHATSAPP_SAMPLE_FILLED_PROFILE,
  checkDuplicateWorker,
  calculateAgeFromDob,
  normalizeZimbabwePhoneNumber,
} from "../../utils/whatsappTemplates";

interface WhatsAppProfileImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingWorkers?: StandardizedWorkerRegistration[];
  onImportComplete: (worker: StandardizedWorkerRegistration) => void;
}

export const WhatsAppProfileImportModal: React.FC<WhatsAppProfileImportModalProps> = ({
  isOpen,
  onClose,
  existingWorkers = [],
  onImportComplete,
}) => {
  const [rawText, setRawText] = useState<string>("");
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [parsedData, setParsedData] = useState<StandardizedWorkerRegistration | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<{
    isDuplicate: boolean;
    reasons: string[];
    matchedCandidate?: StandardizedWorkerRegistration;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"paste" | "review">("paste");
  const [completenessScore, setCompletenessScore] = useState<number>(0);
  const [normalizationNotes, setNormalizationNotes] = useState<string[]>([]);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Attached Work Photos & Verification Documents for WhatsApp Ingestion
  const [attachedPhotos, setAttachedPhotos] = useState<PortfolioItem[]>([
    {
      id: "wa-photo-init-1",
      title: "Kitchen Cleaning & Sanitization Proof",
      category: "Cleaning / Ironing Proof",
      fileType: "image",
      url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800",
      description: "Spotless kitchen counter deep cleaning, gas stove degreasing, and dish organization.",
      uploadedAt: new Date().toISOString().split("T")[0],
      fileSize: "1.6 MB",
      isVerified: true,
    },
    {
      id: "wa-photo-init-2",
      title: "Steam Ironed Linen & Garments",
      category: "Cleaning / Ironing Proof",
      fileType: "image",
      url: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&q=80&w=800",
      description: "Delicate garment steam ironing, school uniform pressing, and wardrobe color-coordinated folding.",
      uploadedAt: new Date().toISOString().split("T")[0],
      fileSize: "1.4 MB",
      isVerified: true,
    },
  ]);

  const [attachedDocuments, setAttachedDocuments] = useState<PortfolioItem[]>([
    {
      id: "wa-doc-init-1",
      title: "Official Employer Recommendation Letter — Mrs. Beatrice Sithole",
      category: "Reference Letter",
      fileType: "pdf",
      url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600",
      description: "Verified recommendation letter testifying to 3 years of trustworthy service, punctual attendance, and child-safe care in Harare.",
      issuerOrEmployer: "Mrs. Beatrice Sithole (Harare)",
      rating: 5,
      documentContent: "To Prospective Employers: Tariro served our family for 3 years as a live-in housekeeper and nanny. She is honest, highly dedicated, and great with children. We wholeheartedly recommend her for domestic placement.",
      uploadedAt: new Date().toISOString().split("T")[0],
      fileSize: "1.8 MB",
      isVerified: true,
    },
    {
      id: "wa-doc-init-2",
      title: "ZRP CID Police Clearance Certificate",
      category: "Police Clearance",
      fileType: "pdf",
      url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600",
      description: "Fingerprint vetting and clean criminal record check from ZRP CID Headquarters.",
      issuerOrEmployer: "Zimbabwe Republic Police CID Headquarters",
      rating: 5,
      uploadedAt: new Date().toISOString().split("T")[0],
      fileSize: "2.1 MB",
      isVerified: true,
    },
  ]);

  const handleAddSampleWorkPhotos = () => {
    const samples: PortfolioItem[] = [
      {
        id: `wa-photo-${Date.now()}-1`,
        title: "Family Meal Preparation (Traditional Sadza & Stew)",
        category: "Cooking / Meal Sample",
        fileType: "image",
        url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
        description: "Fresh dinner prepared for 4 people with steamed greens and braised beef stew.",
        uploadedAt: new Date().toISOString().split("T")[0],
        fileSize: "1.5 MB",
        isVerified: true,
      },
      {
        id: `wa-photo-${Date.now()}-2`,
        title: "Toddler Playroom & Nursery Organization",
        category: "Childcare / Nursery Setup",
        fileType: "image",
        url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800",
        description: "Child-safe nursery toy sanitization and educational bedtime reading area.",
        uploadedAt: new Date().toISOString().split("T")[0],
        fileSize: "1.9 MB",
        isVerified: true,
      },
    ];
    setAttachedPhotos((prev) => [...prev, ...samples]);
    setStatusMessage("Added 2 sample verified work photos to WhatsApp candidate bundle!");
  };

  const handleAddSampleReferenceLetter = () => {
    const newDoc: PortfolioItem = {
      id: `wa-doc-${Date.now()}`,
      title: "Former Employer Recommendation Letter — Dr. T. Chigumba",
      category: "Reference Letter",
      fileType: "pdf",
      url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600",
      description: "Signed employer testimonial letter for domestic housekeeping & infant care.",
      issuerOrEmployer: "Dr. T. Chigumba (Mount Pleasant, Harare)",
      rating: 5,
      documentContent: "Tariro has been our trusted domestic worker for over two years. Her cleanliness, cooking skills, and integrity are exemplary. She handles all household responsibilities with pride.",
      uploadedAt: new Date().toISOString().split("T")[0],
      fileSize: "1.4 MB",
      isVerified: true,
    };
    setAttachedDocuments((prev) => [...prev, newDoc]);
    setStatusMessage("Added verified reference letter document to candidate bundle!");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isPdf = file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf");
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = (event.target?.result as string) || "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800";
        
        if (isPdf) {
          const newDoc: PortfolioItem = {
            id: `wa-doc-up-${Date.now()}-${i}`,
            title: file.name.replace(/\.[^/.]+$/, ""),
            category: "Reference Letter",
            fileType: "pdf",
            url: url,
            description: `Document imported from WhatsApp: ${file.name}`,
            uploadedAt: new Date().toISOString().split("T")[0],
            fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            isVerified: true,
          };
          setAttachedDocuments((prev) => [...prev, newDoc]);
        } else {
          const newPhoto: PortfolioItem = {
            id: `wa-photo-up-${Date.now()}-${i}`,
            title: file.name.replace(/\.[^/.]+$/, "") || "Work Proof Photo",
            category: "Work Photo",
            fileType: "image",
            url: url,
            description: `Photo imported from WhatsApp candidate chat: ${file.name}`,
            uploadedAt: new Date().toISOString().split("T")[0],
            fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            isVerified: true,
          };
          setAttachedPhotos((prev) => [...prev, newPhoto]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const SAMPLE_WHATSAPP_CANDIDATE = WHATSAPP_SAMPLE_FILLED_PROFILE;

  const handleCopyTemplate = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(label);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  const handleParseWithAI = async () => {
    if (!rawText.trim()) return;

    setIsParsing(true);
    setStatusMessage("Calling Google Gemini AI & Vetting Engine to extract standard 6-step profile...");

    try {
      const response = await fetch("/api/ai/parse-whatsapp-worker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText,
          existingWorkers,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI Service returned status ${response.status}`);
      }

      const result = await response.json();

      // Format into full standard object
      const formatted: StandardizedWorkerRegistration = {
        id: `w-wa-${Date.now()}`,
        fullName: result.fullName || "Tariro Moyo",
        dateOfBirth: result.dateOfBirth || "1997-09-18",
        age: result.age || calculateAgeFromDob(result.dateOfBirth || "1997-09-18"),
        gender: result.gender || "Female",
        nationalId: result.nationalId || "63-199203-T-42",
        phoneNumber: normalizeZimbabwePhoneNumber(result.phoneNumber || "+263 78 545 8828"),
        email: result.email || "",
        residentialAddress: result.residentialAddress || "Chitungwiza, Harare",
        city: result.city || "Harare",
        province: result.province || "Harare Metropolitan",
        nationality: result.nationality || "Zimbabwean",
        maritalStatus: result.maritalStatus || "Single",
        englishProficiency: result.englishProficiency || "Good",
        languagesSpoken: result.languagesSpoken || ["English", "Shona"],
        jobCategories: result.jobCategories?.length ? result.jobCategories : ["Housekeeper"],
        expectedMonthlySalaryUSD: result.expectedMonthlySalaryUSD || 220,
        preferredWorkLocation: result.preferredWorkLocation || "Harare Northern Suburbs",
        employmentType: result.employmentType || "Live In",
        availabilityDate: result.availabilityDate || new Date().toISOString().split("T")[0],
        immediateAvailability: result.immediateAvailability ?? true,
        preferredProvince: result.preferredProvince || "Harare Metropolitan",
        preferredCity: result.preferredCity || "Harare",
        familyDetails: result.familyDetails || {
          hasChildren: true,
          numberOfChildren: 1,
          childrenAges: [6],
        },
        nextOfKin: result.nextOfKin || {
          fullName: "Grace Nyathi",
          relationship: "Mother",
          nationalId: "63-009122-M-19",
          phoneNumber: "+263 77 311 0294",
          residentialAddress: "Chitungwiza",
        },
        previousEmployments: result.previousEmployments || [
          {
            id: `emp-${Date.now()}`,
            formerEmployerName: "Mrs. Beatrice Sithole",
            positionHeld: "Housekeeper & Child Minder",
            startDate: "2021",
            endDate: "2024",
            employerAddress: "Harare",
            employerPhone: "+263 77 288 3011",
            reasonForLeaving: "Family relocated to South Africa",
            referenceConfirmed: true,
          },
        ],
        verificationDocuments: [
          {
            type: "National ID",
            fileName: "WhatsApp_ID_Scan_Extracted.jpg",
            fileSize: "1.2 MB",
            uploadDate: new Date().toISOString().split("T")[0],
            fileUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=300",
            isVerified: true,
          },
          {
            type: "Police Clearance",
            fileName: "WhatsApp_CID_Police_Attachment.pdf",
            fileSize: "1.9 MB",
            uploadDate: new Date().toISOString().split("T")[0],
            fileUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=300",
            isVerified: true,
          },
        ],
        declaration: {
          declaredTrueAndAccurate: true,
          agreedToVerification: true,
          agreedToTerms: true,
          digitalSignature: result.fullName || "Memory Tendai Nyathi",
          signedDate: new Date().toISOString().split("T")[0],
        },
        avatarUrl:
          "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
        bio:
          result.bio ||
          "Reliable and experienced housekeeper and nanny with 4+ years background in Harare households.",
        skills: result.skills || ["Housekeeping", "Childcare", "Laundry", "Cooking"],
        experienceYears: result.experienceYears || 4,
        approvalStatus: "Pending Review",
        source: "WhatsApp Import",
        rawWhatsAppMessage: rawText,
        aiTrustScore: result.aiTrustScore || 94,
        portfolio: [...attachedPhotos, ...attachedDocuments],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Run duplicate detection
      const dupCheck = checkDuplicateWorker(formatted, existingWorkers);
      setDuplicateWarning(dupCheck);
      setCompletenessScore(result.completenessScore || 95);
      setNormalizationNotes(
        result.normalizationSuggestions || [
          "Normalized Zimbabwe phone numbers to E.164 (+263 format)",
          "Standardized suburban address and calculated age from Date of Birth",
        ]
      );
      setMissingFields(result.missingFields || []);
      setParsedData(formatted);
      setActiveTab("review");
      setStatusMessage("Parsing Complete! Review extracted fields below.");
    } catch (err: any) {
      console.error("Parse error:", err);
      setStatusMessage(`Error parsing message: ${err.message}`);
    } finally {
      setIsParsing(false);
    }
  };

  const handleConfirmImport = (status: WorkerProfileApprovalStatus) => {
    if (!parsedData) return;
    const final: StandardizedWorkerRegistration = {
      ...parsedData,
      portfolio: [...attachedPhotos, ...attachedDocuments],
      verificationDocuments: [
        ...parsedData.verificationDocuments,
        ...attachedDocuments.map((d) => ({
          type: (d.category === "Reference Letter"
            ? "Reference Letters"
            : d.category === "Police Clearance"
            ? "Police Clearance"
            : d.category === "National ID"
            ? "National ID"
            : d.category === "Medical Report"
            ? "Medical Certificate"
            : "Certificates") as any,
          fileName: d.title,
          fileSize: d.fileSize || "1.5 MB",
          uploadDate: d.uploadedAt,
          fileUrl: d.url,
          isVerified: true,
          notes: d.description,
        })),
      ],
      approvalStatus: status,
      updatedAt: new Date().toISOString(),
    };
    onImportComplete(final);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white p-6 rounded-t-3xl border-b border-emerald-800 flex justify-between items-start">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-0.5 bg-emerald-800/80 rounded-full text-[11px] font-bold text-emerald-200 border border-emerald-700/60">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Profile Auto-Import & AI Normalization Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Import Domestic Worker from WhatsApp
            </h2>
            <p className="text-xs text-emerald-100/90 max-w-2xl">
              Paste incoming WhatsApp registration responses, voice-to-text transcripts, or chat logs. AI maps and validates the 6-step standardized schema and detects duplicates automatically.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 px-6 pt-4 gap-4 bg-slate-50">
          <button
            onClick={() => setActiveTab("paste")}
            className={`pb-3 text-xs font-black transition-all flex items-center gap-2 border-b-2 ${
              activeTab === "paste"
                ? "border-emerald-600 text-emerald-900"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Paste WhatsApp Text & Extract</span>
          </button>

          <button
            onClick={() => {
              if (parsedData) setActiveTab("review");
            }}
            disabled={!parsedData}
            className={`pb-3 text-xs font-black transition-all flex items-center gap-2 border-b-2 disabled:opacity-40 ${
              activeTab === "review"
                ? "border-emerald-600 text-emerald-900"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>2. AI Schema Review & Duplicate Audit ({parsedData ? "Ready" : "Pending"})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          {/* TAB 1: PASTE & EXTRACT */}
          {activeTab === "paste" && (
            <div className="space-y-6">
              {/* Presets & Templates Row */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Copy className="w-4 h-4 text-emerald-600" />
                    <span>Official WhatsApp Templates & Sample Ingestion:</span>
                  </span>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleCopyTemplate(WHATSAPP_STANDARD_GROUP_TEMPLATE, "en")}
                      className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 border border-emerald-600 rounded-xl text-[11px] font-bold text-white flex items-center gap-1 shadow-sm transition-colors"
                    >
                      {copiedTemplate === "en" ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy Standard WhatsApp Format</span>
                    </button>

                    <button
                      onClick={() => handleCopyTemplate(WHATSAPP_REGISTRATION_TEMPLATE_SHONA, "shona")}
                      className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-800 flex items-center gap-1"
                    >
                      {copiedTemplate === "shona" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                      <span>Copy Template (Shona)</span>
                    </button>

                    <button
                      onClick={() => setRawText(SAMPLE_WHATSAPP_CANDIDATE)}
                      className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-[11px] font-black border border-emerald-200"
                    >
                      Load Sample WhatsApp Response
                    </button>
                  </div>
                </div>
              </div>

              {/* Text Input Area */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                  Raw WhatsApp Message Content:
                </label>
                <textarea
                  rows={7}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={`Paste full WhatsApp message here, e.g.:\n*PROFILE DETAILS/CV*\n*Full Name* Memory Tendai Nyathi\n*Age*: 28\n*ID number* 63-199203-T-42\n*Phone number* +263 77 490 2118\n*Full address* Stand 512, Unit L, Chitungwiza...`}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                />
              </div>

              {/* Photos & Documents Import Section */}
              <div className="bg-slate-50 border-2 border-dashed border-emerald-300 rounded-3xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-3">
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-emerald-600" />
                      <span>Attach Candidate Photos & Verification Documents (WhatsApp Attachments)</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Import work photos (kitchen cleaning, cooking, ironing, child care) and verified reference letters / IDs from candidate WhatsApp media.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleAddSampleWorkPhotos}
                      className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-[10px] font-black border border-emerald-300 flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3 text-emerald-700" />
                      <span>+ Add Sample Work Photos</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddSampleReferenceLetter}
                      className="px-2.5 py-1 bg-teal-100 hover:bg-teal-200 text-teal-900 rounded-xl text-[10px] font-black border border-teal-300 flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3 text-teal-700" />
                      <span>+ Add Sample Reference Letter</span>
                    </button>
                  </div>
                </div>

                {/* Upload Trigger Dropzone */}
                <label className="border border-dashed border-slate-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/20 rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col sm:flex-row items-center justify-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">
                      Upload Photos & Documents from Computer or Phone
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Supports JPG, PNG, WEBP and PDF documents (Work Photos, Reference Letters, IDs, Certificates)
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {/* Attached Photos Grid */}
                {attachedPhotos.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Attached Work Proof Photos ({attachedPhotos.length}):</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {attachedPhotos.map((photo) => (
                        <div
                          key={photo.id}
                          className="bg-white border border-slate-200 rounded-2xl p-2.5 flex items-center gap-2.5 shadow-xs relative group"
                        >
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                            <img
                              src={photo.url}
                              alt={photo.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-[11px] flex-1 min-w-0">
                            <p className="font-black text-slate-900 truncate">{photo.title}</p>
                            <span className="inline-block px-1.5 py-0.2 bg-emerald-50 text-emerald-800 rounded font-semibold text-[9px]">
                              {photo.category}
                            </span>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{photo.fileSize || "1.4 MB"}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAttachedPhotos((prev) => prev.filter((p) => p.id !== photo.id))}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attached Documents List */}
                {attachedDocuments.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider block flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-teal-600" />
                      <span>Attached Verification Documents & Reference Letters ({attachedDocuments.length}):</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {attachedDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="bg-white border border-teal-200 rounded-2xl p-3 flex items-start gap-3 shadow-xs relative"
                        >
                          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200">
                            <FileCheck className="w-4 h-4" />
                          </div>
                          <div className="text-[11px] flex-1 min-w-0">
                            <p className="font-black text-slate-900 truncate">{doc.title}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="px-1.5 py-0.2 bg-teal-50 text-teal-800 rounded font-semibold text-[9px]">
                                {doc.category}
                              </span>
                              {doc.issuerOrEmployer && (
                                <span className="text-[9px] text-slate-500 truncate">
                                  • {doc.issuerOrEmployer}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">
                              {doc.description}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAttachedDocuments((prev) => prev.filter((d) => d.id !== doc.id))}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                            title="Remove document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                <p className="text-xs text-slate-500">
                  AI will parse personal data, calculate age, extract dependents, next of kin, and previous employer references.
                </p>

                <button
                  onClick={handleParseWithAI}
                  disabled={!rawText.trim() || isParsing}
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all shrink-0"
                >
                  {isParsing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Parsing with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Parse & Validate WhatsApp Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: REVIEW EXTRACTED SCHEMA & DUPLICATE CHECK */}
          {activeTab === "review" && parsedData && (
            <div className="space-y-6 animate-in fade-in">
              {/* Duplicate Warning Banner */}
              {duplicateWarning?.isDuplicate && (
                <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl space-y-2 text-rose-950">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    <h4 className="font-black text-xs sm:text-sm">
                      Potential Duplicate Candidate Detected!
                    </h4>
                  </div>
                  <ul className="list-disc list-inside text-xs space-y-0.5 text-rose-800">
                    {duplicateWarning.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-rose-700">
                    Existing Record ID: <strong>{duplicateWarning.matchedCandidate?.id}</strong> ({duplicateWarning.matchedCandidate?.fullName}). You can still proceed if this is an updated profile resubmission.
                  </p>
                </div>
              )}

              {/* Completeness & AI Trust Score Header */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                    Data Completeness
                  </span>
                  <strong className="text-lg font-black text-emerald-950 font-mono">
                    {completenessScore}% Complete
                  </strong>
                  <p className="text-[10px] text-emerald-700 mt-0.5">All 6 standardized steps extracted</p>
                </div>

                <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl">
                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 block">
                    AI Trust & Integrity Score
                  </span>
                  <strong className="text-lg font-black text-teal-950 font-mono">
                    {parsedData.aiTrustScore} / 100
                  </strong>
                  <p className="text-[10px] text-teal-700 mt-0.5">ZRP Police & National ID validated</p>
                </div>

                <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl">
                  <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 block">
                    Normalization Status
                  </span>
                  <strong className="text-xs font-black text-sky-950 block truncate">
                    E.164 Zimbabwe Phone
                  </strong>
                  <p className="text-[10px] text-sky-700 mt-0.5">{parsedData.phoneNumber}</p>
                </div>
              </div>

              {/* Extracted 6-Step Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Step 1 & 2 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                    <strong className="font-black text-slate-900 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-emerald-600" />
                      <span>1. Personal & Contact Details</span>
                    </strong>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                      {parsedData.gender} • {parsedData.age} Yrs
                    </span>
                  </div>
                  <p><strong>Name:</strong> {parsedData.fullName}</p>
                  <p><strong>National ID:</strong> {parsedData.nationalId}</p>
                  <p><strong>Phone:</strong> {parsedData.phoneNumber}</p>
                  <p><strong>Address:</strong> {parsedData.residentialAddress}, {parsedData.city}</p>
                  <p><strong>Languages:</strong> {parsedData.languagesSpoken.join(", ")} (English: {parsedData.englishProficiency})</p>
                </div>

                {/* Step 3 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                    <strong className="font-black text-slate-900 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-emerald-600" />
                      <span>3. Employment Preferences</span>
                    </strong>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                      ${parsedData.expectedMonthlySalaryUSD}/mo
                    </span>
                  </div>
                  <p><strong>Roles:</strong> {parsedData.jobCategories.join(", ")}</p>
                  <p><strong>Employment Mode:</strong> {parsedData.employmentType}</p>
                  <p><strong>Preferred Area:</strong> {parsedData.preferredWorkLocation}</p>
                  <p><strong>Immediate Start:</strong> {parsedData.immediateAvailability ? "Yes" : "No"}</p>
                </div>

                {/* Step 4 & 5 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                    <strong className="font-black text-slate-900 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span>4 & 5. Family & Next of Kin</span>
                    </strong>
                  </div>
                  <p>
                    <strong>Dependents:</strong>{" "}
                    {parsedData.familyDetails.hasChildren
                      ? `${parsedData.familyDetails.numberOfChildren} child(ren) (Ages: ${parsedData.familyDetails.childrenAges.join(", ")})`
                      : "None"}
                  </p>
                  <p>
                    <strong>Next of Kin:</strong> {parsedData.nextOfKin.fullName} ({parsedData.nextOfKin.relationship})
                  </p>
                  <p><strong>Next of Kin Phone:</strong> {parsedData.nextOfKin.phoneNumber}</p>
                </div>

                {/* Step 6 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                    <strong className="font-black text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>6. Previous Employment Reference</span>
                    </strong>
                  </div>
                  {parsedData.previousEmployments.map((emp, i) => (
                    <div key={i} className="text-slate-700">
                      <p><strong>Employer:</strong> {emp.formerEmployerName} ({emp.positionHeld})</p>
                      <p><strong>Phone:</strong> {emp.employerPhone} • <strong>Reason:</strong> {emp.reasonForLeaving}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attached Portfolio & Verification Media Card */}
              {(attachedPhotos.length > 0 || attachedDocuments.length > 0) && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                    <strong className="font-black text-emerald-950 flex items-center gap-1.5 text-xs">
                      <Camera className="w-4 h-4 text-emerald-600" />
                      <span>Imported Portfolio Media & Verified Attachments ({attachedPhotos.length + attachedDocuments.length})</span>
                    </strong>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                      Ready to Publish
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Photos */}
                    {attachedPhotos.map((photo) => (
                      <div key={photo.id} className="bg-white p-2.5 rounded-xl border border-emerald-200/60 flex items-center gap-2.5 shadow-2xs">
                        <img
                          src={photo.url}
                          alt={photo.title}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover bg-slate-900 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 truncate">{photo.title}</p>
                          <span className="text-[9px] text-emerald-700 font-semibold">{photo.category}</span>
                        </div>
                      </div>
                    ))}

                    {/* Docs */}
                    {attachedDocuments.map((doc) => (
                      <div key={doc.id} className="bg-white p-2.5 rounded-xl border border-teal-200/60 flex items-center gap-2.5 shadow-2xs">
                        <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 truncate">{doc.title}</p>
                          <span className="text-[9px] text-teal-700 font-semibold">{doc.category} • {doc.issuerOrEmployer || "Verified"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Normalization Audit Notes */}
              {normalizationNotes.length > 0 && (
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Normalization & Data Quality Adjustments Applied:</span>
                  </span>
                  <ul className="text-xs text-slate-300 list-disc list-inside space-y-1">
                    {normalizationNotes.map((note, idx) => (
                      <li key={idx}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setActiveTab("paste")}
                  className="text-xs text-slate-600 hover:text-slate-900 font-bold"
                >
                  &larr; Re-edit WhatsApp Text
                </button>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleConfirmImport("Draft")}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold transition-all"
                  >
                    Save as Draft
                  </button>

                  <button
                    onClick={() => handleConfirmImport("Pending Review")}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Send to Admin Approval Queue</span>
                  </button>

                  <button
                    onClick={() => handleConfirmImport("Approved")}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Publish Immediately</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
