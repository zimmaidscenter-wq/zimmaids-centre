import React, { useState, useRef } from "react";
import { PortfolioItem } from "../../types/marketplace";
import {
  FileText,
  Image as ImageIcon,
  Plus,
  Eye,
  Download,
  Trash2,
  CheckCircle2,
  ExternalLink,
  X,
  Upload,
  AlertCircle,
  FileCheck,
  Award,
  Sparkles,
  Search
} from "lucide-react";

interface PortfolioGalleryProps {
  portfolio?: PortfolioItem[];
  workerName: string;
  workerRole: string;
  isEditable?: boolean;
  onUpdatePortfolio?: (updatedPortfolio: PortfolioItem[]) => void;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
  portfolio = [],
  workerName,
  workerRole,
  isEditable = true,
  onUpdatePortfolio,
}) => {
  const [activeFilter, setActiveFilter] = useState<"All" | "Work Photo" | "Reference Letter" | "Certificate" | "Document">("All");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<PortfolioItem["category"]>("Work Photo");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadFile, setUploadFile] = useState<{
    fileType: "image" | "pdf";
    url: string;
    fileName: string;
    fileSize: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const items = portfolio || [];

  const filteredItems = items.filter((item) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Work Photo") return item.category === "Work Photo";
    if (activeFilter === "Reference Letter") return item.category === "Reference Letter";
    if (activeFilter === "Certificate") return item.category === "Certificate";
    if (activeFilter === "Document") return item.category !== "Work Photo";
    return true;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isImg = file.type.startsWith("image/") || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);

    if (!isPdf && !isImg) {
      setErrorMsg("Please select a valid image (PNG, JPG, WebP) or a PDF document.");
      return;
    }

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const sizeStr = file.size > 1024 * 1024 ? `${sizeInMB} MB` : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadFile({
        fileType: isPdf ? "pdf" : "image",
        url: result,
        fileName: file.name,
        fileSize: sizeStr,
      });

      if (!uploadTitle) {
        // Auto-generate title from filename
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setUploadTitle(cleanName);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveUpload = () => {
    if (!uploadFile) {
      setErrorMsg("Please select or drop a file first.");
      return;
    }
    if (!uploadTitle.trim()) {
      setErrorMsg("Please provide a title for this portfolio item.");
      return;
    }

    const newItem: PortfolioItem = {
      id: `port-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: uploadTitle.trim(),
      category: uploadCategory,
      fileType: uploadFile.fileType,
      url: uploadFile.url,
      description: uploadDesc.trim() || `${uploadCategory} uploaded for client review.`,
      uploadedAt: new Date().toISOString().split("T")[0],
      fileSize: uploadFile.fileSize,
      isVerified: true,
    };

    const updated = [newItem, ...items];
    if (onUpdatePortfolio) {
      onUpdatePortfolio(updated);
    }

    // Reset upload state
    setIsUploading(false);
    setUploadFile(null);
    setUploadTitle("");
    setUploadDesc("");
    setErrorMsg(null);
  };

  const handleDeleteItem = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to remove this item from the portfolio?")) {
      const updated = items.filter((i) => i.id !== itemId);
      if (onUpdatePortfolio) {
        onUpdatePortfolio(updated);
      }
      if (selectedItem?.id === itemId) {
        setSelectedItem(null);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Portfolio, Reference Letters & Work Samples
            </h3>
            <span className="px-2 py-0.5 bg-emerald-900/80 text-emerald-300 border border-emerald-600/60 rounded-full text-[10px] font-mono font-bold">
              {items.length} Attached
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Clients can view work photos (cooking, caregiving, housekeeping) and inspect verified PDF reference letters.
          </p>
        </div>

        {isEditable && (
          <button
            onClick={() => setIsUploading(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-950/30 hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Photo / PDF Document</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { label: "All Items", key: "All", count: items.length },
          { label: "Work Photos", key: "Work Photo", count: items.filter((i) => i.category === "Work Photo").length },
          { label: "Reference Letters", key: "Reference Letter", count: items.filter((i) => i.category === "Reference Letter").length },
          { label: "Certificates", key: "Certificate", count: items.filter((i) => i.category === "Certificate").length },
          { label: "All Documents (PDF)", key: "Document", count: items.filter((i) => i.fileType === "pdf").length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key as any)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeFilter === tab.key
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeFilter === tab.key ? "bg-emerald-800 text-emerald-100" : "bg-slate-200 text-slate-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <FileCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-800">No Portfolio Items in this category</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Add work sample pictures (cooking, childcare setup, housekeeping) or upload reference letters & certificates to boost client trust.
            </p>
          </div>
          {isEditable && (
            <button
              onClick={() => setIsUploading(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Portfolio Item</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer flex flex-col"
            >
              {/* Media Thumbnail */}
              <div className="h-36 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
                {item.fileType === "image" ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-50 to-orange-50 flex flex-col items-center justify-center p-4 text-center group-hover:scale-105 transition-transform">
                    <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shadow-sm mb-1.5">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-black text-red-700 font-mono uppercase tracking-wider">
                      PDF DOCUMENT
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {item.fileSize || "Official Attachment"}
                    </span>
                  </div>
                )}

                {/* Badges Over Thumbnail */}
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <span className="px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-white rounded-md text-[10px] font-bold">
                    {item.category}
                  </span>
                  {item.isVerified && (
                    <span className="px-1.5 py-0.5 bg-emerald-600/90 text-white rounded-md text-[9px] font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                {/* Overlay Action Button */}
                <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-slate-900 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span>View Full {item.fileType === "pdf" ? "Document" : "Photo"}</span>
                  </span>
                </div>
              </div>

              {/* Item Info */}
              <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h5 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h5>
                  {item.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-medium">Uploaded {item.uploadedAt}</span>
                  {isEditable && (
                    <button
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      title="Delete Item"
                      className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal Drawer */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden space-y-4">
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Upload Portfolio Item / Document</h4>
                  <p className="text-[11px] text-slate-300">
                    Add to {workerName}'s portfolio for employer verification
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsUploading(false);
                  setUploadFile(null);
                  setErrorMsg(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-5 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* File Dropzone */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Select Image or PDF Document *
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*,application/pdf"
                  className="hidden"
                />

                {!uploadFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition-all space-y-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-800">Click to browse or drop file here</p>
                      <p className="text-[11px] text-slate-500">
                        Supports PDF (Reference Letters, Police Clearance, Certificates) & Images (PNG, JPG)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-white border border-emerald-300 flex items-center justify-center shrink-0 overflow-hidden">
                        {uploadFile.fileType === "image" ? (
                          <img
                            src={uploadFile.url}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-slate-900 truncate text-xs">{uploadFile.fileName}</p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {uploadFile.fileType.toUpperCase()} • {uploadFile.fileSize}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setUploadFile(null)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Document / Photo Category *
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Work Photo">Work Photo (Cooking, Housekeeping, Childcare, Landscaping)</option>
                  <option value="Reference Letter">Employer Reference Letter (PDF / Scan)</option>
                  <option value="Certificate">Certificate / Qualification / Diploma</option>
                  <option value="Police Clearance">ZRP Police Clearance Certificate</option>
                  <option value="Medical Report">Medical Fitness / Health Report</option>
                  <option value="National ID">Zimbabwe National ID Copy</option>
                  <option value="Other Document">Other Supporting Document</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Title / Label *
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g., Reference from Borrowdale Employer 2024"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Description / Context (Optional)
                </label>
                <textarea
                  rows={2}
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  placeholder="e.g., Work sample showing meal prep and table arrangement."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setIsUploading(false);
                  setUploadFile(null);
                  setErrorMsg(null);
                }}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUpload}
                disabled={!uploadFile}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save to Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Document Reader Viewer Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-3xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
                  {selectedItem.fileType === "image" ? (
                    <ImageIcon className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm sm:text-base text-white">{selectedItem.title}</h4>
                    <span className="px-2 py-0.5 bg-emerald-900 text-emerald-300 border border-emerald-700 rounded-md text-[10px] font-bold">
                      {selectedItem.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Uploaded on {selectedItem.uploadedAt} • {workerName} ({workerRole})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={selectedItem.url}
                  download={selectedItem.title}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs flex items-center gap-1 font-bold border border-slate-700 transition-colors"
                  title="Open / Download"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </a>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document / Image Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 flex flex-col items-center justify-center min-h-[300px]">
              {selectedItem.fileType === "image" ? (
                <div className="max-h-[60vh] rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.title}
                    referrerPolicy="no-referrer"
                    className="max-h-[60vh] w-auto object-contain"
                  />
                </div>
              ) : (
                <div className="w-full bg-white rounded-2xl p-6 sm:p-8 text-slate-900 shadow-2xl max-w-xl border border-slate-200 space-y-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-lg font-black text-slate-900">{selectedItem.title}</h5>
                    <p className="text-xs text-slate-600">
                      Official verified PDF Document ({selectedItem.fileSize || "Verified Attachment"}).
                    </p>
                    {selectedItem.description && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 text-left">
                        {selectedItem.description}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <a
                      href={selectedItem.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md inline-flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open PDF in Document Viewer</span>
                    </a>
                    <a
                      href={selectedItem.url}
                      download={selectedItem.title}
                      className="px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs inline-flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>Save / Download</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {selectedItem.description && selectedItem.fileType === "image" && (
              <div className="p-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-300">
                <p className="leading-relaxed">
                  <strong className="text-white">Note:</strong> {selectedItem.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
