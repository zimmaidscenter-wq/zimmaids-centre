import React, { useState, useRef } from "react";
import {
  Camera,
  Upload,
  User,
  Sparkles,
  CheckCircle2,
  Trash2,
  Eye,
  Info,
  Maximize2,
  X,
  RefreshCw,
  Plus
} from "lucide-react";

export interface CandidatePhotosState {
  primaryProfilePhoto: string;
  fullLengthPhoto?: string;
  workActionPhoto?: string;
}

interface CandidatePhotosManagerProps {
  photos: CandidatePhotosState;
  onUpdatePhotos: (updated: CandidatePhotosState) => void;
  candidateName?: string;
  isEditable?: boolean;
}

export const CandidatePhotosManager: React.FC<CandidatePhotosManagerProps> = ({
  photos,
  onUpdatePhotos,
  candidateName = "Candidate",
  isEditable = true,
}) => {
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<"primary" | "fullLength" | "workAction">("primary");
  const [uploadUrlInput, setUploadUrlInput] = useState<string>("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const photoSlots = [
    {
      id: "primary" as const,
      key: "primaryProfilePhoto" as const,
      label: "1. Profile Headshot",
      sublabel: "Clear facial portrait for ID & avatar",
      required: true,
      tip: "Clear, well-lit face portrait smiling against a neutral background.",
      value: photos.primaryProfilePhoto,
      defaultSample: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "fullLength" as const,
      key: "fullLengthPhoto" as const,
      label: "2. Full-Length Photo",
      sublabel: "Standing full body appearance",
      required: true,
      tip: "Full-body standing picture in neat, presentable attire showing posture & height.",
      value: photos.fullLengthPhoto,
      defaultSample: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "workAction" as const,
      key: "workActionPhoto" as const,
      label: "3. Work Appearance / In-Action",
      sublabel: "Uniform, apron, or on-duty look",
      required: true,
      tip: "Wearing practical domestic uniform, apron, or demonstrating neat work readiness.",
      value: photos.workActionPhoto,
      defaultSample: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const handleOpenUploadForSlot = (slotId: "primary" | "fullLength" | "workAction") => {
    setActiveSlot(slotId);
    setIsUploadModalOpen(true);
    setUploadUrlInput("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        applyPhotoToSlot(activeSlot, result);
        setIsUploadModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyPhotoToSlot = (slot: "primary" | "fullLength" | "workAction", url: string) => {
    if (!url.trim()) return;
    const updated = { ...photos };
    if (slot === "primary") updated.primaryProfilePhoto = url;
    if (slot === "fullLength") updated.fullLengthPhoto = url;
    if (slot === "workAction") updated.workActionPhoto = url;
    onUpdatePhotos(updated);
  };

  const handleApplyPreset = (sampleUrl: string) => {
    applyPhotoToSlot(activeSlot, sampleUrl);
    setIsUploadModalOpen(false);
  };

  const handleDeletePhoto = (slot: "primary" | "fullLength" | "workAction", e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...photos };
    if (slot === "primary") updated.primaryProfilePhoto = "";
    if (slot === "fullLength") delete updated.fullLengthPhoto;
    if (slot === "workAction") delete updated.workActionPhoto;
    onUpdatePhotos(updated);
  };

  const completedCount = [
    Boolean(photos.primaryProfilePhoto),
    Boolean(photos.fullLengthPhoto),
    Boolean(photos.workActionPhoto),
  ].filter(Boolean).length;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase rounded-md tracking-wider">
              Identity & Appearance
            </span>
            <span className="text-xs text-slate-500">• 3 Photos Required for Direct Bookings</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-600" />
            <span>Candidate Appearance Photos ({completedCount}/3)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Allow prospective employers and clients in Harare, Bulawayo and nationwide to clearly see your face, full body appearance, and work readiness.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            completedCount === 3
              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
              : "bg-amber-100 text-amber-900 border border-amber-300"
          }`}>
            {completedCount === 3 ? "✓ All 3 Photos Attached" : `${3 - completedCount} More Photo(s) Needed`}
          </span>
        </div>
      </div>

      {/* 3 Photo Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {photoSlots.map((slot) => {
          const hasPhoto = Boolean(slot.value);
          return (
            <div
              key={slot.id}
              className={`border-2 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between ${
                hasPhoto
                  ? "border-emerald-500/50 bg-emerald-50/10 shadow-sm"
                  : "border-dashed border-slate-300 bg-slate-50 hover:border-emerald-400"
              }`}
            >
              {/* Card Header Tag */}
              <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    {hasPhoto ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-400">
                        !
                      </div>
                    )}
                    <span>{slot.label}</span>
                  </h4>
                  <p className="text-[10px] text-slate-500">{slot.sublabel}</p>
                </div>

                {hasPhoto && (
                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                    Active
                  </span>
                )}
              </div>

              {/* Photo Area */}
              <div className="relative h-64 bg-slate-100 flex items-center justify-center overflow-hidden group">
                {hasPhoto ? (
                  <>
                    <img
                      src={slot.value}
                      alt={slot.label}
                      className="w-full h-full object-cover"
                    />

                    {/* Action Overlay */}
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                      <button
                        onClick={() => setSelectedPreview(slot.value!)}
                        className="px-3 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-md hover:bg-slate-100 flex items-center space-x-1.5"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Preview Full View</span>
                      </button>

                      {isEditable && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenUploadForSlot(slot.id)}
                            className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[11px] font-medium hover:bg-slate-800 flex items-center space-x-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Replace</span>
                          </button>
                          <button
                            onClick={(e) => handleDeletePhoto(slot.id, e)}
                            className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[11px] font-medium hover:bg-rose-700 flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100/60 text-emerald-700 flex items-center justify-center">
                      <Camera className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">No Photo Uploaded</p>
                      <p className="text-[10px] text-slate-400 max-w-[180px] mt-0.5">{slot.tip}</p>
                    </div>

                    {isEditable && (
                      <button
                        onClick={() => handleOpenUploadForSlot(slot.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Upload Photo</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Guidance */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 leading-tight">
                <span className="font-semibold text-slate-600">Client visibility:</span> {slot.tip}
              </div>
            </div>
          );
        })}
      </div>

      {/* Photo Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>Upload {photoSlots.find((s) => s.id === activeSlot)?.label}</span>
                </h4>
                <p className="text-xs text-slate-500">
                  {photoSlots.find((s) => s.id === activeSlot)?.sublabel}
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Option 1: Choose File from Device / Camera */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Option A: Choose File from Phone or Computer
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 border-2 border-dashed border-emerald-500/50 bg-emerald-50/20 hover:bg-emerald-50/50 rounded-2xl flex flex-col items-center justify-center space-y-1.5 transition-all text-emerald-800"
              >
                <Upload className="w-6 h-6 text-emerald-600" />
                <span className="text-xs font-bold">Tap to Browse Photos or Take Picture</span>
                <span className="text-[10px] text-slate-500">Supports JPG, PNG, WEBP (Max 10MB)</span>
              </button>
            </div>

            {/* Option 2: Enter Web / Cloud Image URL */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Option B: Paste Direct Image Web Link (URL)
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  placeholder="https://images.example.com/candidate-photo.jpg"
                  value={uploadUrlInput}
                  onChange={(e) => setUploadUrlInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button
                  onClick={() => {
                    if (uploadUrlInput) {
                      applyPhotoToSlot(activeSlot, uploadUrlInput);
                      setIsUploadModalOpen(false);
                    }
                  }}
                  disabled={!uploadUrlInput}
                  className="px-4 py-2 bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Option 3: Quick Zimbabwean Sample Portrait for testing */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                <span>Quick Demonstration Sample:</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={photoSlots.find((s) => s.id === activeSlot)?.defaultSample}
                    alt="Sample"
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-800">Use High-Resolution Studio Sample</div>
                    <div className="text-[10px] text-slate-500">Professional portrait specimen</div>
                  </div>
                </div>
                <button
                  onClick={() => handleApplyPreset(photoSlots.find((s) => s.id === activeSlot)?.defaultSample!)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-all"
                >
                  Use Sample
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Lightbox Preview Modal */}
      {selectedPreview && (
        <div
          onClick={() => setSelectedPreview(null)}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-3"
          >
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h4 className="font-bold text-sm">{candidateName} — Full Appearance View</h4>
              <button
                onClick={() => setSelectedPreview(null)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] flex items-center justify-center bg-slate-950 p-2">
              <img
                src={selectedPreview}
                alt="Full Preview"
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>
            <div className="p-4 bg-slate-50 text-right">
              <button
                onClick={() => setSelectedPreview(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
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
