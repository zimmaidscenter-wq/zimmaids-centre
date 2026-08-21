import React, { useState, useEffect } from "react";
import { WorkerProfile, PortfolioItem } from "../../types/marketplace";
import {
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Phone,
  FileCheck2,
  Volume2,
  CheckCircle,
  X,
  ArrowLeft,
  CreditCard,
  MessageSquare,
  Award,
  Lock,
  Sparkles,
  ExternalLink,
  Mail,
  Smartphone,
  Camera,
  FileText,
  Plus,
  Eye,
  CheckCircle2,
  Building,
  Image as ImageIcon,
  Layers,
  Calendar,
  FolderLock,
  Edit3
} from "lucide-react";
import { PortfolioViewerModal } from "./PortfolioViewerModal";
import { AddPortfolioItemModal } from "./AddPortfolioItemModal";
import { ProfileCompletenessWidget } from "../common/ProfileCompletenessWidget";
import { CandidatePhotoGallery } from "./CandidatePhotoGallery";
import { VerifiedBadge } from "../common/VerifiedBadge";
import { WorkerAvailabilityCalendarModal } from "../worker/WorkerAvailabilityCalendarModal";
import { DocumentVaultModal } from "../common/DocumentVaultModal";
import { ImageLightboxModal, LightboxImageItem } from "../common/ImageLightboxModal";
import { PaynowModal, PaynowPaymentDetails, PaynowReceipt } from "../payment/PaynowModal";
import { useAuth } from "../../context/AuthContext";

interface WorkerProfileModalProps {
  worker: WorkerProfile | null;
  onClose: () => void;
  currency: "USD" | "ZWG";
  onHireNow: (worker: WorkerProfile) => void;
  onContactWorker: (worker: WorkerProfile) => void;
  isPremiumEmployer?: boolean;
  onOpenPremiumModal?: () => void;
  onUpdateWorker?: (updated: WorkerProfile) => void;
  onOpenEditProfile?: () => void;
}

export const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({
  worker,
  onClose,
  currency,
  onHireNow,
  onContactWorker,
  isPremiumEmployer = false,
  onOpenPremiumModal,
  onUpdateWorker,
  onOpenEditProfile,
}) => {
  const { currentUser, setIsEditProfileModalOpen } = useAuth();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState<PortfolioItem | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState<boolean>(false);
  const [isDocumentVaultModalOpen, setIsDocumentVaultModalOpen] = useState<boolean>(false);
  const [portfolioFilter, setPortfolioFilter] = useState<"All" | "Photos" | "Documents">("All");

  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxImages, setLightboxImages] = useState<LightboxImageItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  // Paynow State for $3 Featured Listing
  const [isPaynowOpen, setIsPaynowOpen] = useState(false);
  const [paynowDetails, setPaynowDetails] = useState<PaynowPaymentDetails | null>(null);

  const handleInitiateFeaturedPaynow = () => {
    setPaynowDetails({
      title: `⭐ Feature ${worker?.fullName} on Featured Maid List (30 Days)`,
      amountUSD: 3.0,
      serviceType: "featured_maid",
      targetId: worker?.id,
      targetName: worker?.fullName,
    });
    setIsPaynowOpen(true);
  };

  const handlePaynowSuccess = (receipt: PaynowReceipt) => {
    if (!worker) return;
    const updated: WorkerProfile = {
      ...worker,
      isFeatured: true,
      featuredExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    };
    if (onUpdateWorker) {
      onUpdateWorker(updated);
    }
  };

  // Universal Back Navigation (Browser Back Button & Escape Key)
  useEffect(() => {
    if (!worker) return;

    const stateObj = { workerProfileModalOpen: true, workerId: worker.id };
    window.history.pushState(stateObj, "");

    const handlePopState = () => {
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isViewerOpen && !isLightboxOpen && !isAddModalOpen && !isAvailabilityModalOpen && !isDocumentVaultModalOpen) {
        onClose();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [worker, onClose, isViewerOpen, isLightboxOpen, isAddModalOpen, isAvailabilityModalOpen, isDocumentVaultModalOpen]);

  if (!worker) return null;

  const openLightboxWithImages = (images: LightboxImageItem[], index = 0) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // Local portfolio list fallback or custom additions
  const portfolioItems: PortfolioItem[] = worker.portfolio && worker.portfolio.length > 0
    ? worker.portfolio
    : [
        {
          id: `wp-${worker.id}-1`,
          title: "Kitchen & Countertop Deep Clean",
          category: "Cleaning / Ironing Proof",
          fileType: "image",
          url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800",
          description: "Sparkling sanitized kitchen surfaces, degreased oven, and organized pantry.",
          uploadedAt: "2026-03-01",
          fileSize: "1.5 MB",
          isVerified: true,
        },
        {
          id: `wp-${worker.id}-2`,
          title: "Employer Reference Letter — Mrs. Jenkins (Borrowdale)",
          category: "Reference Letter",
          fileType: "pdf",
          url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600",
          issuerOrEmployer: "Mrs. Sarah Jenkins (Borrowdale, Harare)",
          rating: 5,
          documentContent: `${worker.fullName} worked for our household for over 2 years. She is exceptionally honest, punctual, and maintains the highest standards of cleanliness and care. We recommend her without reservation.`,
          description: "Signed employer recommendation verifying exemplary domestic service and childcare.",
          uploadedAt: "2026-02-15",
          fileSize: "1.2 MB",
          isVerified: true,
        },
        {
          id: `wp-${worker.id}-3`,
          title: "Steam Pressed Garments & Wardrobe Setup",
          category: "Cleaning / Ironing Proof",
          fileType: "image",
          url: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&q=80&w=800",
          description: "Steam pressing of linen, school uniforms, and garments arranged by color.",
          uploadedAt: "2026-01-20",
          fileSize: "1.8 MB",
          isVerified: true,
        },
        {
          id: `wp-${worker.id}-4`,
          title: "ZRP CID Criminal Record Clearance Certificate",
          category: "Police Clearance",
          fileType: "pdf",
          url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600",
          issuerOrEmployer: "Zimbabwe Republic Police CID Morris Depot",
          rating: 5,
          documentContent: `Official clearance confirming zero criminal convictions or pending court cases for ${worker.fullName}. Fingerprint biometric check verified clean.`,
          description: "Official ZRP CID police vetting certificate.",
          uploadedAt: worker.policeClearanceDate || "2026-03-05",
          fileSize: "2.0 MB",
          isVerified: true,
        },
      ];

  const filteredPortfolio = portfolioItems.filter((item) => {
    if (portfolioFilter === "Photos") {
      return item.fileType === "image" && !item.category.includes("Letter") && !item.category.includes("Document");
    }
    if (portfolioFilter === "Documents") {
      return item.fileType === "pdf" || item.category.includes("Letter") || item.category.includes("Clearance") || item.category.includes("Certificate");
    }
    return true;
  });

  const handleAddPortfolioItem = (newItem: PortfolioItem) => {
    const updatedPortfolio = [newItem, ...(worker.portfolio || portfolioItems)];
    worker.portfolio = updatedPortfolio;
    if (onUpdateWorker) {
      onUpdateWorker({
        ...worker,
        portfolio: updatedPortfolio,
      });
    }
  };

  const handleOpenItem = (item: PortfolioItem) => {
    setSelectedPortfolioItem(item);
    setIsViewerOpen(true);
  };

  const rateUSD = worker.monthlyRateUSD;
  const rateDisplay =
    currency === "USD" ? `$${rateUSD} USD / month` : `${(rateUSD * 26.5).toLocaleString()} ZWG / month`;

  const phoneNum = worker.phoneNumber || "+263 78 545 8828";
  const whatsappNum = worker.whatsappNumber || "+263 78 545 8828";
  const emailAddr = worker.email || `${worker.fullName.toLowerCase().replace(/\s+/g, ".")}@zimmaids.co.zw`;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200 my-8">
          {/* Top Header Banner with Back & Close Buttons */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 relative">
            <div className="flex items-center justify-between gap-3 mb-4 pb-2 border-b border-emerald-800/60">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all border border-emerald-700/60 active:scale-95 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-300" />
                <span>Back to Profiles</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 bg-emerald-950/60 hover:bg-emerald-950 text-emerald-200 hover:text-white rounded-full transition-colors"
                title="Close (Escape)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div
                className="relative cursor-pointer group"
                onClick={() =>
                  openLightboxWithImages([
                    {
                      url: worker.avatarUrl,
                      title: `${worker.fullName} — Profile Headshot`,
                      subtitle: `${worker.role} • ${worker.city}`,
                      isVerified: worker.isVerified,
                    },
                    ...(worker.candidatePhotos?.fullLengthPhoto
                      ? [
                          {
                            url: worker.candidatePhotos.fullLengthPhoto,
                            title: `${worker.fullName} — Full Length View`,
                            subtitle: "Standing Appearance & Posture",
                            isVerified: true,
                          },
                        ]
                      : []),
                    ...(worker.candidatePhotos?.workActionPhoto
                      ? [
                          {
                            url: worker.candidatePhotos.workActionPhoto,
                            title: `${worker.fullName} — Work Uniform / In-Action`,
                            subtitle: "On-Duty Attire & Readiness",
                            isVerified: true,
                          },
                        ]
                      : []),
                  ])
                }
                title="Click to view full-size photo"
              >
                <img
                  src={worker.avatarUrl}
                  alt={worker.fullName}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-400/80 shadow-lg group-hover:opacity-90 group-hover:scale-[1.02] transition-all"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center transition-opacity">
                  <Camera className="w-6 h-6 text-white drop-shadow-md" />
                </div>
                {worker.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-xl shadow-md flex items-center gap-1 text-[10px] font-black">
                    <ShieldCheck className="w-4 h-4" />
                    <span>VERIFIED</span>
                  </div>
                )}
              </div>

              <div className="text-center sm:text-left space-y-1">
                <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 bg-emerald-800/80 rounded-full text-xs font-semibold text-emerald-200">
                  <span>{worker.role}</span>
                  {worker.agencyName && (
                    <>
                      <span>•</span>
                      <span>{worker.agencyName}</span>
                    </>
                  )}
                </div>
                <h3 className="text-2xl font-extrabold text-white flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <span>{worker.fullName}</span>
                  {worker.isFeatured && (
                    <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-[10px] rounded-full font-black flex items-center gap-1 shadow-md animate-pulse">
                      <Sparkles className="w-3 h-3 fill-slate-950" />
                      <span>⭐ FEATURED MAID</span>
                    </span>
                  )}
                  {worker.isVerified && (
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] rounded-full font-bold">
                      Verified Candidate
                    </span>
                  )}
                </h3>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 text-xs text-emerald-200">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {worker.suburb}, {worker.city}
                    </span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-white">{worker.rating}</span>
                    <span>({worker.reviewCount} reviews)</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1 text-emerald-300 font-semibold">
                    <Camera className="w-3.5 h-3.5" />
                    <span>{portfolioItems.length} Portfolio & Proof Files</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
            {/* Visual Portfolio & Profile Completeness Progress Bar */}
            <ProfileCompletenessWidget
              profile={worker}
              portfolio={portfolioItems}
              variant="employer-view"
            />

            {/* Candidate Appearance 3-Photo Verified Gallery */}
            <CandidatePhotoGallery worker={worker} />

            {/* Protected Contact Details Section */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Protected Candidate Contact Information</span>
                </h4>
                {isPremiumEmployer ? (
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-extrabold rounded-full">
                    Unlocked (Premium Active)
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold rounded-full">
                    Locked (Subscription Required)
                  </span>
                )}
              </div>

              {isPremiumEmployer ? (
                /* Premium Unlocked View */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Phone Contact</span>
                      <span className="font-mono text-sm font-bold text-emerald-300">{phoneNum}</span>
                    </div>
                    <a
                      href={`tel:${phoneNum}`}
                      className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>

                  <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Direct WhatsApp</span>
                      <span className="font-mono text-sm font-bold text-[#25D366]">{whatsappNum}</span>
                    </div>
                    <a
                      href={`https://wa.me/${whatsappNum.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(worker.fullName)},%20I%20saw%20your%20profile%20on%20Zimbabwe%20Maids%20Centre`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg transition-colors"
                    >
                      <MessageSquare className="w-4 h-4 fill-white" />
                    </a>
                  </div>

                  <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 col-span-1 sm:col-span-2 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Verified Email & Address</span>
                      <span className="font-mono text-xs font-semibold text-slate-200">{emailAddr} • {worker.suburb}, {worker.city}</span>
                    </div>
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ) : (
                /* Protected / Hidden View */
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-3">
                  <div className="text-xs text-amber-200/90 leading-relaxed font-medium">
                    "Contact details are protected. Upgrade to Premium Employer Access to unlock verified candidate contact information."
                  </div>
                  <div className="filter blur-sm select-none text-xs text-slate-500 font-mono py-1">
                    Phone: +263 77• ••• ••• • WhatsApp: +263 71• ••• •••
                  </div>
                  <button
                    type="button"
                    onClick={onOpenPremiumModal}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all inline-flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                    <span>Upgrade to Premium Employer Access ($30 USD / 30 Days)</span>
                  </button>
                </div>
              )}
            </div>

            {/* PORTFOLIO & WORK EVIDENCE SECTION */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-emerald-600" />
                      <span>Portfolio & Proof of Work</span>
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-bold text-[10px] rounded-full">
                      {portfolioItems.length} Verified Evidence
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Photos of past work, signed reference letters, and verified certificates for client review.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-white border border-slate-200 rounded-xl p-1 flex gap-1 text-[10px] font-bold">
                    <button
                      onClick={() => setPortfolioFilter("All")}
                      className={`px-2 py-0.5 rounded-lg transition-colors ${
                        portfolioFilter === "All" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      All ({portfolioItems.length})
                    </button>
                    <button
                      onClick={() => setPortfolioFilter("Photos")}
                      className={`px-2 py-0.5 rounded-lg transition-colors ${
                        portfolioFilter === "Photos" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Photos
                    </button>
                    <button
                      onClick={() => setPortfolioFilter("Documents")}
                      className={`px-2 py-0.5 rounded-lg transition-colors ${
                        portfolioFilter === "Documents" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Documents
                    </button>
                  </div>

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-sm transition-all shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Proof</span>
                  </button>
                </div>
              </div>

              {/* Portfolio Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredPortfolio.map((item) => {
                  const isImage = item.fileType === "image" && !item.category.includes("Letter") && !item.category.includes("Document");
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleOpenItem(item)}
                      className="bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-3 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-2"
                    >
                      <div className="flex gap-3">
                        {isImage ? (
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 relative">
                            <img
                              src={item.url}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex flex-col items-center justify-center shrink-0">
                            <FileText className="w-6 h-6" />
                            <span className="text-[8px] font-extrabold uppercase mt-0.5">DOC</span>
                          </div>
                        )}

                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[9px] font-bold rounded">
                              {item.category}
                            </span>
                            {item.isVerified && (
                              <span className="text-[9px] font-black text-emerald-700 flex items-center gap-0.5">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                <span>Verified</span>
                              </span>
                            )}
                          </div>

                          <h5 className="font-bold text-slate-900 text-xs truncate group-hover:text-emerald-700 transition-colors">
                            {item.title}
                          </h5>

                          {item.issuerOrEmployer && (
                            <p className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                              <Building className="w-3 h-3 text-slate-400" />
                              <span>{item.issuerOrEmployer}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{item.uploadedAt}</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1 group-hover:underline">
                          <Eye className="w-3 h-3" />
                          <span>View Full Proof</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trust Score & Official Verification Seal Card */}
            <div className="space-y-3">
              <VerifiedBadge size="badge-card" subtext={`Clearance Serial #${worker.id.toUpperCase()} • National ID & Criminal Records Audit Verified`} />
              
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                    {worker.aiTrustScore}%
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      AI Vetted Trust Score
                    </div>
                    <div className="text-xs text-slate-600">
                      Police Clearance • National ID • References Verified
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-xs font-semibold text-emerald-800 hover:bg-emerald-100/50 transition-colors"
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingAudio ? "animate-bounce text-emerald-600" : ""}`} />
                  <span>{isPlayingAudio ? "Playing Audio Intro..." : "Listen Voice Intro"}</span>
                </button>
              </div>
            </div>

            {/* Rate & Availability Box with Live Calendar and Document Vault Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Agreed Monthly Rate
                  </span>
                  <span className="text-lg font-bold text-slate-900">{rateDisplay}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDocumentVaultModalOpen(true)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  title="View / Upload ID, Police Clearance, and Employment Contracts"
                >
                  <FolderLock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Docs Vault</span>
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Availability Status
                  </span>
                  <span className="text-xs font-bold text-emerald-700 block mt-0.5">
                    {worker.availabilityStatus || worker.availability || "Available Immediately"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAvailabilityModalOpen(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  title="View / Edit availability schedule and notice period"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Calendar</span>
                </button>
              </div>
            </div>

            {/* Bio & Background */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Professional Summary
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                {worker.bio}
              </p>
            </div>

            {/* Skills & Experience */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Core Skills & Capabilities
              </h4>
              <div className="flex flex-wrap gap-2">
                {worker.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-lg text-xs font-medium text-emerald-900"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Qualifications & Educational Background */}
            <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-3xl p-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Qualifications & Certifications</span>
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                    {(worker.qualifications || ["O-Level Certificate", "Red Cross First Aid Level 1"]).length} Certified
                  </span>
                </div>
                {onOpenEditProfile && (
                  <button
                    type="button"
                    onClick={onOpenEditProfile}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {(worker.qualifications && worker.qualifications.length > 0
                  ? worker.qualifications
                  : [
                      "O-Level Certificate (5 Passes)",
                      "Red Cross First Aid Level 1",
                      "Professional Housekeeping & Hospitality Certificate",
                    ]
                ).map((q, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-emerald-300 text-emerald-950 text-xs font-bold rounded-xl shadow-2xs"
                  >
                    <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{q}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  </div>
                ))}
              </div>
            </div>

            {/* National ID & Biometric Verification Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>National ID Verification Record</span>
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">
                  OFFICIALLY AUDITED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">National ID Number</span>
                    <span className="font-mono font-bold text-slate-900">
                      {worker.nationalIdNumber || "63-284918-B-42"}
                    </span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Government Document Scan</span>
                    <span className="font-semibold text-emerald-700">Verified ID Photo Uploaded</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDocumentVaultModalOpen(true)}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-bold transition-colors"
                  >
                    View in Vault
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Maid Spotlight Upgrade Banner ($3 Paynow) */}
            {!worker.isFeatured ? (
              <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/15 to-emerald-500/15 border border-amber-300 rounded-3xl p-5 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
                      <Sparkles className="w-5 h-5 fill-slate-950" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-black text-slate-900">Place on Featured Maid List</h4>
                        <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-black rounded-full">
                          $3.00 USD / 30 Days
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Top ranking in search results, gold verified spotlight badge, and instant Paynow clearing.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleInitiateFeaturedPaynow}
                    className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all shrink-0 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Feature Profile ($3 Paynow)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-600 fill-amber-600" />
                  <span className="font-bold text-amber-900">
                    ⭐ Currently Featured Candidate on Top Rankings (Active via Paynow)
                  </span>
                </div>
                <span className="text-[10px] font-black text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                  Expires {worker.featuredExpiresAt || "in 30 Days"}
                </span>
              </div>
            )}

            {/* Verifications Checklist */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Background & Compliance Verifications
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-slate-700 block">National ID</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Verified</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-slate-700 block">Police Clearance</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Valid ({worker.policeClearanceDate})</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span className="text-[11px] font-semibold text-slate-700 block">References</span>
                  <span className="text-[10px] text-emerald-600 font-bold">3 Calls Verified</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  {worker.verifications.medicalCert ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                      <span className="text-[11px] font-semibold text-slate-700 block">Medical Cert</span>
                      <span className="text-[10px] text-emerald-600 font-bold">Fit to Work</span>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                      <span className="text-[11px] font-semibold text-slate-500 block">Medical Cert</span>
                      <span className="text-[10px] text-slate-400">Optional</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Action Footer */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => onContactWorker(worker)}
              className="flex items-center space-x-2 px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Chat & Inquire</span>
            </button>

            <button
              onClick={() => onHireNow(worker)}
              className="flex items-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Record Placement ({rateDisplay})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Lightbox / Reference Letter Viewer Modal */}
      <PortfolioViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        item={selectedPortfolioItem}
        workerName={worker.fullName}
        workerRole={worker.role}
      />

      {/* Add Portfolio Item / Upload Proof Modal */}
      <AddPortfolioItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddItem={handleAddPortfolioItem}
        workerName={worker.fullName}
      />

      {/* Worker Availability Calendar Modal */}
      <WorkerAvailabilityCalendarModal
        isOpen={isAvailabilityModalOpen}
        onClose={() => setIsAvailabilityModalOpen(false)}
        worker={worker}
        onSaveAvailability={(updatedStatus, schedule, noticePeriod) => {
          if (onUpdateWorker) {
            onUpdateWorker({
              ...worker,
              availabilityStatus: updatedStatus,
              availability: updatedStatus,
              availabilitySchedule: schedule,
              noticePeriod,
            });
          }
        }}
      />

      {/* Secure Document Vault & Contract Storage Modal */}
      <DocumentVaultModal
        isOpen={isDocumentVaultModalOpen}
        onClose={() => setIsDocumentVaultModalOpen(false)}
        workerName={worker.fullName}
        workerRole={worker.role}
      />

      {/* Fullscreen Photo Lightbox Modal with Back Button */}
      <ImageLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={lightboxImages}
        initialIndex={lightboxIndex}
        backLabel="Back to Profile"
      />

      {/* Paynow Zimbabwe Gateway Pop-up Modal */}
      <PaynowModal
        isOpen={isPaynowOpen}
        onClose={() => setIsPaynowOpen(false)}
        details={paynowDetails}
        onSuccess={handlePaynowSuccess}
      />
    </>
  );
};


