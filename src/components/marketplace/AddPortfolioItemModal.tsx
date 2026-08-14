import React, { useState } from "react";
import { PortfolioItem } from "../../types/marketplace";
import {
  X,
  Upload,
  Image as ImageIcon,
  FileText,
  ShieldCheck,
  Check,
  Sparkles,
  Camera,
  Star,
  Building,
  Plus
} from "lucide-react";

interface AddPortfolioItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: PortfolioItem) => void;
  workerName?: string;
}

export const AddPortfolioItemModal: React.FC<AddPortfolioItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
  workerName,
}) => {
  const [category, setCategory] = useState<PortfolioItem["category"]>("Work Photo");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [issuerOrEmployer, setIssuerOrEmployer] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [documentContent, setDocumentContent] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [fileType, setFileType] = useState<"image" | "pdf">("image");
  const [fileSize, setFileSize] = useState<string>("1.4 MB");

  if (!isOpen) return null;

  // Sample quick presets
  const PHOTO_PRESETS = [
    {
      title: "Pristine Kitchen & Deep Cleaning",
      category: "Cleaning / Ironing Proof" as const,
      url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800",
      description: "Kitchen counter deep sanitization, oven cleaning, and dish organization completed for household.",
    },
    {
      title: "Steam Ironed & Wardrobe Folded Clothes",
      category: "Cleaning / Ironing Proof" as const,
      url: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&q=80&w=800",
      description: "Delicate garment steam ironing, school uniform pressing, and organized linen closet.",
    },
    {
      title: "Traditional Sadza, Beef Stew & Veggies Meal",
      category: "Cooking / Meal Sample" as const,
      url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
      description: "Fresh family dinner preparation: tender braised beef, covo greens, and smooth sadza.",
    },
    {
      title: "Child Activity & Playroom Setup",
      category: "Childcare / Nursery Setup" as const,
      url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800",
      description: "Supervised toddler educational play, safe toy sanitization, and structured bedtime routine.",
    },
    {
      title: "Landscaped Garden & Lawn Edging",
      category: "Work Photo" as const,
      url: "https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&q=80&w=800",
      description: "Mowed lawn, manicured rose bushes, hedge trimming, and weeded flower beds in Borrowdale.",
    }
  ];

  const DOC_PRESETS = [
    {
      title: "Recommendation Letter — Mrs. Sarah Jenkins (Borrowdale)",
      category: "Reference Letter" as const,
      issuer: "Mrs. Sarah Jenkins (Borrowdale, Harare)",
      rating: 5,
      content: "Chipo worked for our family for 3 years taking care of our 2 children and general housekeeping. She is exceptionally honest, never misses a day, and cooks delicious meals. We highly recommend her to any prospective employer without reservation.",
      url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600",
      description: "Official signed employer recommendation letter verifying 3 years of trustworthy service.",
    },
    {
      title: "ZRP CID Criminal Record Clearance Certificate",
      category: "Police Clearance" as const,
      issuer: "Zimbabwe Republic Police (CID Headquarters, Harare)",
      rating: 5,
      content: "Certified clean criminal record and biometric fingerprint vetting completed at ZRP CID Morris Depot. Valid through 2026.",
      url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600",
      description: "Official ZRP CID police fingerprint vetting certificate with official stamp.",
    },
    {
      title: "Zimbabwe Red Cross First Aid & CPR Certificate",
      category: "Certificate" as const,
      issuer: "Zimbabwe Red Cross Society",
      rating: 5,
      content: "Awarded Certificate of Competence in Infant & Child First Aid, Choking Rescue, and Emergency CPR.",
      url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600",
      description: "Accredited First Aid qualification for infant and household care.",
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf");
    setFileType(isPdf ? "pdf" : "image");
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ""));

    if (!isPdf) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl("https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600");
    }
  };

  const handleApplyPreset = (preset: any) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setPreviewUrl(preset.url);
    setDescription(preset.description || "");
    if (preset.issuer) setIssuerOrEmployer(preset.issuer);
    if (preset.rating) setRating(preset.rating);
    if (preset.content) setDocumentContent(preset.content);
    setFileType(preset.category.includes("Letter") || preset.category.includes("Certificate") || preset.category.includes("Clearance") ? "pdf" : "image");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem: PortfolioItem = {
      id: `port-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: title.trim(),
      category: category,
      fileType: fileType,
      url: previewUrl || "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800",
      description: description.trim() || `Portfolio proof added for ${category}`,
      uploadedAt: new Date().toISOString().split("T")[0],
      fileSize: fileSize,
      isVerified: true,
      issuerOrEmployer: issuerOrEmployer.trim() || undefined,
      rating: rating,
      documentContent: documentContent.trim() || undefined,
      verifiedBy: "Zimbabwe Maids Centre Audit",
    };

    onAddItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in zoom-in-95">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col relative my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white p-5 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Add Portfolio Item or Work Proof
              </h3>
              <p className="text-xs text-emerald-200">
                Attach work sample photos, employer reference letters, or trade certificates for {workerName || "Candidate Profile"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Portfolio Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
            >
              <option value="Work Photo">Work Photo (General Proof)</option>
              <option value="Cleaning / Ironing Proof">Cleaning & Ironing Proof</option>
              <option value="Cooking / Meal Sample">Cooking & Meal Sample</option>
              <option value="Childcare / Nursery Setup">Childcare & Nursery Setup</option>
              <option value="Reference Letter">Employer Reference Letter</option>
              <option value="Police Clearance">Police Clearance (ZRP CID)</option>
              <option value="Certificate">Trade / First Aid Certificate</option>
              <option value="National ID">National ID Document</option>
              <option value="Medical Report">Medical Fitness Report</option>
              <option value="Other Document">Other Work Document</option>
            </select>
          </div>

          {/* Quick Presets row */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-3.5 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Or Choose Verified Preset Samples (Instant Load):</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PHOTO_PRESETS.slice(0, 3).map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100/70 border border-emerald-300 text-emerald-950 font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1"
                >
                  <Camera className="w-3 h-3 text-emerald-600" />
                  <span>{p.title.split("&")[0].trim()}</span>
                </button>
              ))}
              {DOC_PRESETS.map((d, idx) => (
                <button
                  key={`doc-${idx}`}
                  type="button"
                  onClick={() => handleApplyPreset(d)}
                  className="px-2.5 py-1 bg-white hover:bg-teal-100/70 border border-teal-300 text-teal-950 font-bold text-[10px] rounded-lg transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3 h-3 text-teal-600" />
                  <span>{d.title.split("—")[0].trim()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload Dropzone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Upload File (Photo or PDF Document)
            </label>
            <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30 rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 group">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Click to browse or drop photo / PDF here
                </p>
                <p className="text-[10px] text-slate-500">
                  Supports JPG, PNG, WEBP, PDF (Max 10MB)
                </p>
              </div>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Title & Preview Image */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Title / Document Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Bedroom & Wardrobe Deep Clean, or Reference Letter from Mrs. Jenkins"
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          {/* Employer / Issuer (If Reference Letter or Certificate) */}
          {(category.includes("Letter") || category.includes("Certificate") || category.includes("Clearance")) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Former Employer / Issuing Body
                </label>
                <input
                  type="text"
                  value={issuerOrEmployer}
                  onChange={(e) => setIssuerOrEmployer(e.target.value)}
                  placeholder="e.g. Mrs. Sarah Jenkins (Borrowdale)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Employer Recommendation Rating
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value, 10))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Exceptional)</option>
                  <option value={4}>⭐⭐⭐⭐ 4 Stars (Very Good)</option>
                  <option value={3}>⭐⭐⭐ 3 Stars (Satisfactory)</option>
                </select>
              </div>
            </div>
          )}

          {/* Reference Letter text transcript */}
          {category === "Reference Letter" && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Reference Letter Text / Transcript (Optional)
              </label>
              <textarea
                rows={3}
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
                placeholder="Paste the written recommendation from the past employer..."
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-sans"
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Work Description / Context Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what work was performed, techniques used, or equipment operated..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
            />
          </div>

          {/* Preview Thumbnail if available */}
          {previewUrl && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-300">
                <img
                  src={previewUrl}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900 truncate max-w-sm">{title || "Attached Media"}</p>
                <p className="text-[10px] text-slate-500">{category} • {fileSize}</p>
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3" /> Ready to attach to portfolio
                </span>
              </div>
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!title.trim()}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Attach & Save to Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
