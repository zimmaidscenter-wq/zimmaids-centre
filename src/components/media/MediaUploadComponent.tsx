import React, { useState, useRef } from "react";
import {
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Eye,
  Plus,
  Sparkles,
  ShieldCheck,
  X,
  Sliders,
  Crop,
  Layers,
  ArrowRight,
  Info,
  Calendar,
  Tag,
  Check,
} from "lucide-react";
import { usePlatform } from "../../context/PlatformContext";
import { PortfolioItem, PortfolioCategoryType } from "../../types/platform";

interface MediaUploadComponentProps {
  mode?: "all" | "profile" | "additional" | "portfolio";
  userId?: string;
  readOnly?: boolean;
  className?: string;
}

const PORTFOLIO_CATEGORIES: PortfolioCategoryType[] = [
  "House Cleaning",
  "Cooking & Meal Prep",
  "Childcare & Infant Care",
  "Gardening & Landscaping",
  "Laundry & Ironing",
  "Elderly & Patient Care",
  "General Maintenance",
  "Residence & Accommodation",
];

const PRESET_SAMPLE_PHOTOS = [
  {
    title: "Deep Clean Kitchen & Polished Countertops",
    category: "House Cleaning" as PortfolioCategoryType,
    url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    description: "Thorough degreasing of stove, oven, extraction hood, and tile scrubbing.",
  },
  {
    title: "Manicured Lawn & Flowerbeds in Highlands",
    category: "Gardening & Landscaping" as PortfolioCategoryType,
    url: "https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&q=80&w=800",
    description: "Hedge trimming, lawn edging, rose bush pruning, and organic compost application.",
  },
  {
    title: "Traditional Sadza, Beef Stew & Fresh Relish",
    category: "Cooking & Meal Prep" as PortfolioCategoryType,
    url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
    description: "Nutritious balanced family dinner prepared according to dietary preferences.",
  },
  {
    title: "Steam-Pressed Business Shirts & Linens",
    category: "Laundry & Ironing" as PortfolioCategoryType,
    url: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&q=80&w=800",
    description: "Delicate garment care, crisp folding, and organized wardrobe stocking.",
  },
  {
    title: "Montessori Play & Reading Station",
    category: "Childcare & Infant Care" as PortfolioCategoryType,
    url: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&q=80&w=800",
    description: "Safe, stimulating early childhood learning corner with educational games.",
  },
];

export const MediaUploadComponent: React.FC<MediaUploadComponentProps> = ({
  mode = "all",
  readOnly = false,
  className = "",
}) => {
  const {
    currentUser,
    currentMaidProfile,
    currentEmployerProfile,
    uploadProfilePhoto,
    removeProfilePhoto,
    uploadAdditionalPhoto,
    removeAdditionalPhoto,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    getProfileCompletion,
  } = usePlatform();

  // Active sub-tab when mode === 'all'
  const [activeTab, setActiveTab] = useState<"profile" | "additional" | "portfolio">(
    mode === "all" ? "profile" : (mode as "profile" | "additional" | "portfolio")
  );

  // Cropper / Editor State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [cropperTarget, setCropperTarget] = useState<"profile" | "additional1" | "additional2" | "portfolio">("profile");
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  // New Portfolio Item Modal State
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [newPortfolioTitle, setNewPortfolioTitle] = useState("");
  const [newPortfolioCategory, setNewPortfolioCategory] = useState<PortfolioCategoryType>("House Cleaning");
  const [newPortfolioDesc, setNewPortfolioDesc] = useState("");
  const [newPortfolioImage, setNewPortfolioImage] = useState("");
  const [newPortfolioDate, setNewPortfolioDate] = useState(new Date().toISOString().split("T")[0]);
  const [isBeforeAfter, setIsBeforeAfter] = useState(false);

  // Lightbox Modal
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);

  // File Inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Profile data
  const isMaid = currentUser.role === "maid";
  const profilePhoto = isMaid
    ? currentMaidProfile?.profilePhoto || currentUser.avatarUrl
    : currentEmployerProfile?.profilePhoto || currentUser.avatarUrl;

  const additional1 = isMaid ? currentMaidProfile?.additionalPhoto1 : currentEmployerProfile?.additionalPhoto1;
  const additional1Title = isMaid ? currentMaidProfile?.additionalPhoto1Title : currentEmployerProfile?.additionalPhoto1Title;
  const additional2 = isMaid ? currentMaidProfile?.additionalPhoto2 : currentEmployerProfile?.additionalPhoto2;
  const additional2Title = isMaid ? currentMaidProfile?.additionalPhoto2Title : currentEmployerProfile?.additionalPhoto2Title;

  const portfolioList: PortfolioItem[] = (
    isMaid ? currentMaidProfile?.portfolio : currentEmployerProfile?.portfolio
  ) || [];

  const completion = getProfileCompletion(currentUser.id);

  // -------------------------------------------------------------
  // File Handler
  // -------------------------------------------------------------
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, target: "profile" | "additional1" | "additional2" | "portfolio") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size exceeds 10MB limit. Please select a smaller photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setRawImageSrc(result);
      setCropperTarget(target);
      setZoomLevel(1);
      setPanPosition({ x: 0, y: 0 });
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = "";
  };

  // -------------------------------------------------------------
  // Save from Cropper
  // -------------------------------------------------------------
  const applyCropAndSave = async () => {
    if (!rawImageSrc) return;
    setIsProcessing(true);

    try {
      // Simulate client-side canvas compression & cropping
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = rawImageSrc;
      });

      // Target dimensions based on crop target
      const size = cropperTarget === "profile" ? 600 : 900;
      canvas.width = size;
      canvas.height = cropperTarget === "profile" ? size : Math.round(size * 0.75);

      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Apply zoom and pan
        const drawWidth = canvas.width * zoomLevel;
        const drawHeight = (canvas.width * (img.height / img.width)) * zoomLevel;
        const drawX = (canvas.width - drawWidth) / 2 + panPosition.x;
        const drawY = (canvas.height - drawHeight) / 2 + panPosition.y;

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      }

      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
      const estKB = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

      if (cropperTarget === "profile") {
        await uploadProfilePhoto(compressedDataUrl, estKB);
        setUploadSuccessMessage("Profile portrait saved and published!");
      } else if (cropperTarget === "additional1") {
        await uploadAdditionalPhoto(1, compressedDataUrl, isMaid ? "Work Uniform & Attire" : "Household Overview", estKB);
        setUploadSuccessMessage("Additional photo #1 updated!");
      } else if (cropperTarget === "additional2") {
        await uploadAdditionalPhoto(2, compressedDataUrl, isMaid ? "Skill in Action" : "Work Area & Facilities", estKB);
        setUploadSuccessMessage("Additional photo #2 updated!");
      } else if (cropperTarget === "portfolio") {
        setNewPortfolioImage(compressedDataUrl);
        setPortfolioModalOpen(true);
      }

      setCropperOpen(false);
      setTimeout(() => setUploadSuccessMessage(null), 4000);
    } catch (err) {
      console.error("Error cropping image:", err);
      alert("Failed to process image. Please try another file.");
    } finally {
      setIsProcessing(false);
    }
  };

  // -------------------------------------------------------------
  // Portfolio Submission
  // -------------------------------------------------------------
  const handleSavePortfolioItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortfolioTitle || !newPortfolioImage) {
      alert("Please provide a title and image for this portfolio entry.");
      return;
    }

    setIsProcessing(true);
    try {
      if (editingPortfolioId) {
        await updatePortfolioItem(editingPortfolioId, {
          title: newPortfolioTitle,
          category: newPortfolioCategory,
          description: newPortfolioDesc,
          imageUrl: newPortfolioImage,
          dateCompleted: newPortfolioDate,
          isBeforeAfter,
        });
        setUploadSuccessMessage("Portfolio showcase updated successfully!");
      } else {
        await addPortfolioItem({
          title: newPortfolioTitle,
          category: newPortfolioCategory,
          description: newPortfolioDesc,
          imageUrl: newPortfolioImage,
          dateCompleted: newPortfolioDate,
          isBeforeAfter,
        });
        setUploadSuccessMessage("New work showcase added to your public portfolio!");
      }

      // Reset modal
      setPortfolioModalOpen(false);
      setEditingPortfolioId(null);
      setNewPortfolioTitle("");
      setNewPortfolioDesc("");
      setNewPortfolioImage("");
      setIsBeforeAfter(false);
      setTimeout(() => setUploadSuccessMessage(null), 4000);
    } catch (err) {
      console.error(err);
      alert("Failed to save portfolio item.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyPreset = (preset: (typeof PRESET_SAMPLE_PHOTOS)[0]) => {
    setNewPortfolioTitle(preset.title);
    setNewPortfolioCategory(preset.category);
    setNewPortfolioDesc(preset.description);
    setNewPortfolioImage(preset.url);
    setPortfolioModalOpen(true);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Hidden File Selectors */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={(e) => handleFileSelect(e, cropperTarget)}
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileSelect(e, cropperTarget)}
      />

      {/* Success Banner */}
      {uploadSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-sm font-medium">{uploadSuccessMessage}</span>
          </div>
          <button
            onClick={() => setUploadSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Profile Completion Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold">Profile Strength & Trust Score</h3>
              <span className="bg-emerald-500/30 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-400/40">
                {completion.score}% Complete
              </span>
            </div>
            <p className="text-sm text-emerald-200 max-w-xl">
              Profiles with a clear portrait and active portfolio gallery receive up to{" "}
              <strong className="text-white">4.8x more interview requests</strong> from verified employers across Zimbabwe.
            </p>
          </div>

          <div className="w-full md:w-56 bg-emerald-950/60 p-3 rounded-xl border border-emerald-700/50 flex flex-col justify-center">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Trust Index</span>
              <span>{completion.score}%</span>
            </div>
            <div className="w-full bg-emerald-900 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${completion.score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Missing items pill checklist */}
        {completion.missingRequirements.length > 0 && (
          <div className="mt-4 pt-4 border-t border-emerald-700/40 flex flex-wrap items-center gap-2">
            <span className="text-xs text-emerald-300 font-medium">Recommended next steps:</span>
            {completion.missingRequirements.slice(0, 3).map((req, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-white/10 text-emerald-100 text-xs px-2.5 py-1 rounded-lg border border-white/10"
              >
                <Plus className="w-3 h-3 text-emerald-300" />
                {req}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs Header (When in 'all' mode) */}
      {mode === "all" && (
        <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-2 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "profile"
                ? "border-emerald-600 text-emerald-800 bg-emerald-50/60 rounded-t-lg"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Camera className="w-4 h-4" />
            Main Profile Photo
          </button>
          <button
            onClick={() => setActiveTab("additional")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "additional"
                ? "border-emerald-600 text-emerald-800 bg-emerald-50/60 rounded-t-lg"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Layers className="w-4 h-4" />
            Supporting Work Photos (2 Slots)
          </button>
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "portfolio"
                ? "border-emerald-600 text-emerald-800 bg-emerald-50/60 rounded-t-lg"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Portfolio & Work Gallery
            <span className="ml-1 px-2 py-0.5 text-xs bg-emerald-100 text-emerald-800 rounded-full font-bold">
              {portfolioList.length}
            </span>
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. PRIMARY PROFILE PICTURE SECTION */}
      {/* ========================================================= */}
      {(mode === "profile" || (mode === "all" && activeTab === "profile")) && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900">Official Profile Portrait</h4>
              <p className="text-sm text-gray-500">
                This is your primary identity image displayed in employer searches and candidate cards.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Format (JPG, PNG, WebP)
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar Preview Display */}
            <div className="relative group">
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-4 border-emerald-100 shadow-lg bg-gray-100 flex items-center justify-center relative">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                    <Camera className="w-12 h-12 mb-2 text-gray-300" />
                    <span className="text-xs font-medium">No photo uploaded</span>
                  </div>
                )}

                {/* Status Overlay */}
                {profilePhoto && (
                  <div className="absolute bottom-2 right-2 bg-emerald-600 text-white p-1.5 rounded-lg shadow">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Remove Photo Trigger */}
              {!readOnly && profilePhoto && (
                <button
                  type="button"
                  onClick={removeProfilePhoto}
                  className="mt-3 w-full py-1.5 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-semibold flex items-center justify-center gap-1 transition-colors border border-transparent hover:border-red-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove Picture
                </button>
              )}
            </div>

            {/* Action Buttons & Guidance */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="space-y-2">
                <h5 className="font-semibold text-gray-900 text-base">
                  Upload or Take a High-Resolution Photo
                </h5>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Take a clear portrait photo in good daylight. Wear clean domestic work attire or professional clothing. Ensure your face is centered and clearly visible without sunglasses or dark hats.
                </p>
              </div>

              {!readOnly && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCropperTarget("profile");
                      fileInputRef.current?.click();
                    }}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95"
                  >
                    <Upload className="w-4 h-4" />
                    Upload from Gallery / PC
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCropperTarget("profile");
                      cameraInputRef.current?.click();
                    }}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all active:scale-95 border border-gray-200"
                  >
                    <Camera className="w-4 h-4 text-emerald-700" />
                    Take Photo with Camera
                  </button>
                </div>
              )}

              {/* Guidelines Bullet points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4 border-t border-gray-100">
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Square 1:1 format automatically cropped</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Max file size: 10MB (Auto-compressed)</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Automatic domestic safety verification</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>Optimized for fast mobile loading in Zimbabwe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. SUPPORTING ADDITIONAL WORK PHOTOS (2 SLOTS) */}
      {/* ========================================================= */}
      {(mode === "additional" || (mode === "all" && activeTab === "additional")) && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900">
                {isMaid ? "Additional Work & Attire Photos" : "Estate & Environment Photos"}
              </h4>
              <p className="text-sm text-gray-500">
                {isMaid
                  ? "Upload up to 2 additional photos showing your uniform, work gear, or active household assistance."
                  : "Upload photos of your household, living quarters, or work environment."}
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              2 Maximum Slots
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Slot 1 */}
            <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    Slot 1: {additional1Title || (isMaid ? "Work Uniform" : "Residence View")}
                  </span>
                  {additional1 && (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Published
                    </span>
                  )}
                </div>

                <div className="w-full h-52 rounded-xl overflow-hidden bg-white border-2 border-dashed border-gray-300 flex items-center justify-center relative group">
                  {additional1 ? (
                    <>
                      <img
                        src={additional1}
                        alt="Slot 1"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setLightboxItem({
                              id: "slot1",
                              userId: currentUser.id,
                              userRole: currentUser.role,
                              userFullName: currentUser.name,
                              title: additional1Title || "Work Photo 1",
                              category: "House Cleaning",
                              imageUrl: additional1,
                              status: "Approved",
                              createdAt: "",
                              updatedAt: "",
                            })
                          }
                          className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!readOnly && (
                          <button
                            type="button"
                            onClick={() => removeAdditionalPhoto(1)}
                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 text-center p-4">
                      <ImageIcon className="w-10 h-10 mb-2 text-gray-300" />
                      <span className="text-xs font-medium text-gray-500">Slot 1 Empty</span>
                      <span className="text-[11px] text-gray-400">
                        {isMaid ? "e.g. Uniform or formal outfit" : "e.g. Living room or kitchen"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {!readOnly && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCropperTarget("additional1");
                      fileInputRef.current?.click();
                    }}
                    className="flex-1 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-700" />
                    {additional1 ? "Replace Photo" : "Upload Photo"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCropperTarget("additional1");
                      cameraInputRef.current?.click();
                    }}
                    className="p-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl text-xs font-semibold"
                  >
                    <Camera className="w-4 h-4 text-emerald-700" />
                  </button>
                </div>
              )}
            </div>

            {/* Slot 2 */}
            <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                    Slot 2: {additional2Title || (isMaid ? "Skill in Action" : "Facilities View")}
                  </span>
                  {additional2 && (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Published
                    </span>
                  )}
                </div>

                <div className="w-full h-52 rounded-xl overflow-hidden bg-white border-2 border-dashed border-gray-300 flex items-center justify-center relative group">
                  {additional2 ? (
                    <>
                      <img
                        src={additional2}
                        alt="Slot 2"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setLightboxItem({
                              id: "slot2",
                              userId: currentUser.id,
                              userRole: currentUser.role,
                              userFullName: currentUser.name,
                              title: additional2Title || "Work Photo 2",
                              category: "Cooking & Meal Prep",
                              imageUrl: additional2,
                              status: "Approved",
                              createdAt: "",
                              updatedAt: "",
                            })
                          }
                          className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!readOnly && (
                          <button
                            type="button"
                            onClick={() => removeAdditionalPhoto(2)}
                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 text-center p-4">
                      <ImageIcon className="w-10 h-10 mb-2 text-gray-300" />
                      <span className="text-xs font-medium text-gray-500">Slot 2 Empty</span>
                      <span className="text-[11px] text-gray-400">
                        {isMaid ? "e.g. Cooking, ironing or gardening" : "e.g. Garden or worker room"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {!readOnly && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCropperTarget("additional2");
                      fileInputRef.current?.click();
                    }}
                    className="flex-1 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-700" />
                    {additional2 ? "Replace Photo" : "Upload Photo"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCropperTarget("additional2");
                      cameraInputRef.current?.click();
                    }}
                    className="p-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl text-xs font-semibold"
                  >
                    <Camera className="w-4 h-4 text-emerald-700" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. PORTFOLIO & WORK GALLERY */}
      {/* ========================================================= */}
      {(mode === "portfolio" || (mode === "all" && activeTab === "portfolio")) && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h4 className="text-lg font-bold text-gray-900">Work Showcase & Portfolio Gallery</h4>
              <p className="text-sm text-gray-500">
                Display your verified skills, completed domestic projects, gardening results, cooking, and childcare setup.
              </p>
            </div>

            {!readOnly && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPortfolioId(null);
                    setNewPortfolioTitle("");
                    setNewPortfolioDesc("");
                    setNewPortfolioImage("");
                    setCropperTarget("portfolio");
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Upload Portfolio Item
                </button>
              </div>
            )}
          </div>

          {/* Quick Presets for Easy First Uploads */}
          {!readOnly && portfolioList.length === 0 && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Quick Sample Presets (Click to test with real sample domestic work):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {PRESET_SAMPLE_PHOTOS.slice(0, 3).map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-3 bg-white hover:bg-emerald-50 text-left rounded-xl border border-emerald-100 shadow-sm hover:border-emerald-300 transition-all flex items-center gap-3 group"
                  >
                    <img
                      src={preset.url}
                      alt={preset.title}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-gray-900 group-hover:text-emerald-800 truncate">
                        {preset.title}
                      </div>
                      <div className="text-[11px] text-emerald-600 font-medium">
                        {preset.category}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio Grid */}
          {portfolioList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {portfolioList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="relative">
                    <div className="h-48 overflow-hidden bg-gray-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                      {item.category}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`absolute top-3 right-3 text-[11px] font-bold px-2 py-0.5 rounded-full shadow ${
                        item.status === "Approved"
                          ? "bg-emerald-600 text-white"
                          : item.status === "Flagged"
                          ? "bg-amber-500 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {item.status}
                    </span>

                    {/* Lightbox Trigger Overlay */}
                    <button
                      type="button"
                      onClick={() => setLightboxItem(item)}
                      className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-full hover:scale-110 transition-transform">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </button>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h5 className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</h5>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                        {item.description || "Verified work demonstration photo."}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {item.dateCompleted || item.createdAt}
                      </span>

                      {!readOnly && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPortfolioId(item.id);
                              setNewPortfolioTitle(item.title);
                              setNewPortfolioCategory(item.category);
                              setNewPortfolioDesc(item.description || "");
                              setNewPortfolioImage(item.imageUrl);
                              setNewPortfolioDate(item.dateCompleted || new Date().toISOString().split("T")[0]);
                              setIsBeforeAfter(!!item.isBeforeAfter);
                              setPortfolioModalOpen(true);
                            }}
                            className="p-1 text-gray-500 hover:text-emerald-700"
                            title="Edit Details"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this portfolio photo?")) {
                                deletePortfolioItem(item.id);
                              }
                            }}
                            className="p-1 text-gray-500 hover:text-red-600"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl space-y-3 bg-gray-50/50">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <ImageIcon className="w-7 h-7" />
              </div>
              <h5 className="font-bold text-gray-900 text-base">No Portfolio Items Yet</h5>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Upload photos of your previous housekeeping, sparkling clean bathrooms, cooking, baby care, or gardening work to showcase your skill to employers.
              </p>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingPortfolioId(null);
                    setNewPortfolioTitle("");
                    setNewPortfolioDesc("");
                    setNewPortfolioImage("");
                    setCropperTarget("portfolio");
                    fileInputRef.current?.click();
                  }}
                  className="mt-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-sm transition-all"
                >
                  <Upload className="w-4 h-4" />
                  Upload First Photo
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. MODAL: IMAGE CROPPER & ROTATOR */}
      {/* ========================================================= */}
      {cropperOpen && rawImageSrc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-fadeIn space-y-0">
            {/* Header */}
            <div className="p-5 bg-gray-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crop className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-base">
                  {cropperTarget === "profile"
                    ? "Crop Profile Portrait (1:1)"
                    : cropperTarget.startsWith("additional")
                    ? "Adjust Work Photo"
                    : "Position Portfolio Image"}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setCropperOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Canvas Preview Area */}
            <div className="p-6 bg-gray-950 flex flex-col items-center justify-center">
              <div
                className={`relative overflow-hidden bg-gray-900 border-2 border-emerald-500/80 shadow-2xl flex items-center justify-center ${
                  cropperTarget === "profile" ? "w-64 h-64 rounded-full" : "w-80 h-56 rounded-2xl"
                }`}
              >
                <img
                  src={rawImageSrc}
                  alt="Crop preview"
                  className="max-w-none transition-transform duration-75 select-none"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${
                      panPosition.y / zoomLevel
                    }px)`,
                  }}
                  draggable={false}
                />
              </div>
              <span className="text-xs text-gray-400 mt-3 font-medium">
                Drag slider below to zoom & position your photo perfectly
              </span>
            </div>

            {/* Controls */}
            <div className="p-6 space-y-5 bg-gray-50 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                  <span className="flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5 text-emerald-700" />
                    Zoom & Scale
                  </span>
                  <span>{Math.round(zoomLevel * 100)}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <ZoomOut className="w-4 h-4 text-gray-400" />
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
                  />
                  <ZoomIn className="w-4 h-4 text-emerald-700" />
                </div>
              </div>

              {/* Offset Buttons */}
              <div className="flex items-center justify-between text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-200">
                <span className="font-semibold">Pan / Center:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPanPosition((p) => ({ ...p, x: p.x - 20 }))}
                    className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200 font-bold"
                  >
                    ← Left
                  </button>
                  <button
                    type="button"
                    onClick={() => setPanPosition((p) => ({ ...p, x: p.x + 20 }))}
                    className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200 font-bold"
                  >
                    Right →
                  </button>
                  <button
                    type="button"
                    onClick={() => setPanPosition({ x: 0, y: 0 })}
                    className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs hover:bg-emerald-200 font-bold"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCropperOpen(false)}
                  className="flex-1 py-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-xl font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={applyCropAndSave}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? "Processing..." : "Save & Publish Photo"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. MODAL: PORTFOLIO ENTRY FORM */}
      {/* ========================================================= */}
      {portfolioModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-fadeIn">
            <div className="p-5 bg-emerald-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-base">
                  {editingPortfolioId ? "Edit Showcase Item" : "Add Portfolio Work Photo"}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setPortfolioModalOpen(false)}
                className="text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePortfolioItem} className="p-6 space-y-4">
              {/* Image Preview */}
              <div className="relative h-44 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                {newPortfolioImage ? (
                  <img
                    src={newPortfolioImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <ImageIcon className="w-8 h-8 mb-1 text-gray-300" />
                    <span className="text-xs">No image selected</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setCropperTarget("portfolio");
                    fileInputRef.current?.click();
                  }}
                  className="absolute bottom-2 right-2 px-3 py-1.5 bg-black/70 hover:bg-black text-white text-xs font-bold rounded-lg backdrop-blur-sm flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Change Photo
                </button>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Project / Work Title *</label>
                <input
                  type="text"
                  required
                  value={newPortfolioTitle}
                  onChange={(e) => setNewPortfolioTitle(e.target.value)}
                  placeholder="e.g. Master Bedroom Deep Clean & Window Polishing"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Category *</label>
                <select
                  value={newPortfolioCategory}
                  onChange={(e) => setNewPortfolioCategory(e.target.value as PortfolioCategoryType)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                >
                  {PORTFOLIO_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Description of Work</label>
                <textarea
                  rows={3}
                  value={newPortfolioDesc}
                  onChange={(e) => setNewPortfolioDesc(e.target.value)}
                  placeholder="Describe your approach, tools used, results achieved, or specific tasks completed..."
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Date & Tag */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Date Completed</label>
                  <input
                    type="date"
                    value={newPortfolioDate}
                    onChange={(e) => setNewPortfolioDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="beforeAfterCheck"
                    checked={isBeforeAfter}
                    onChange={(e) => setIsBeforeAfter(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <label htmlFor="beforeAfterCheck" className="text-xs font-semibold text-gray-700 cursor-pointer">
                    Before / After Result
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setPortfolioModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm shadow-md transition-all"
                >
                  {isProcessing ? "Saving..." : editingPortfolioId ? "Update Showcase" : "Publish to Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. MODAL: LIGHTBOX FULLSCREEN PREVIEW */}
      {/* ========================================================= */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-gray-900 text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 bg-black/40 flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-emerald-700 text-xs font-bold rounded-full">
                  {lightboxItem.category}
                </span>
                <h4 className="font-bold text-sm text-white truncate max-w-md">
                  {lightboxItem.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black">
              <img
                src={lightboxItem.imageUrl}
                alt={lightboxItem.title}
                className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-5 bg-gray-900 border-t border-gray-800 space-y-2">
              <p className="text-sm text-gray-300 leading-relaxed">
                {lightboxItem.description || "High resolution verified domestic project showcase photograph."}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                <span>By: {lightboxItem.userFullName || "Verified Professional"}</span>
                <span>Date: {lightboxItem.dateCompleted || lightboxItem.createdAt}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
