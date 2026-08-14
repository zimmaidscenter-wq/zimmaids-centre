import React, { useState } from "react";
import { Camera, Maximize2, ShieldCheck, User, Sparkles, CheckCircle2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { WorkerProfile } from "../../types/marketplace";

interface CandidatePhotoGalleryProps {
  worker: WorkerProfile;
  className?: string;
}

export const CandidatePhotoGallery: React.FC<CandidatePhotoGalleryProps> = ({
  worker,
  className = "",
}) => {
  const candidatePhotos = worker.candidatePhotos || {
    primaryProfilePhoto: worker.avatarUrl,
    fullLengthPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    workActionPhoto: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800",
  };

  const photoList = [
    {
      id: "primary",
      label: "Profile Headshot",
      sublabel: "Facial ID & Avatar",
      url: candidatePhotos.primaryProfilePhoto || worker.avatarUrl,
      description: "Frontal facial portrait for verification and identification.",
    },
    {
      id: "fullLength",
      label: "Full-Length Appearance",
      sublabel: "Standing Posture & Presence",
      url: candidatePhotos.fullLengthPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
      description: "Full body standing presentation showing professional posture and appearance.",
    },
    {
      id: "workAction",
      label: "Work Uniform / In-Action",
      sublabel: "On-Duty Attire & Readiness",
      url: candidatePhotos.workActionPhoto || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800",
      description: "Demonstrating domestic workwear, uniform readiness, and practical capability.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState<boolean>(false);

  const currentPhoto = photoList[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % photoList.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + photoList.length) % photoList.length);
  };

  return (
    <div className={`bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 ${className}`}>
      {/* Section Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-emerald-600" />
            <span>Candidate Appearance & Photos (3 Verified Views)</span>
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Examine facial portrait, full-length standing posture, and work attire.
          </p>
        </div>

        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          <span>Identity Confirmed</span>
        </span>
      </div>

      {/* Main Display Frame */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-4/3 sm:aspect-16/9 flex items-center justify-center group">
        <img
          src={currentPhoto.url}
          alt={currentPhoto.label}
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Gradient Overlay for labels */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

        {/* Top Floating Badge */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{currentPhoto.label}</span>
          </span>
          <span className="text-[10px] text-slate-300 font-mono bg-black/40 px-2 py-1 rounded-lg backdrop-blur-xs">
            {activeIndex + 1} of {photoList.length}
          </span>
        </div>

        {/* Top Right Maximize Button */}
        <button
          onClick={() => setIsFullscreenOpen(true)}
          className="absolute top-3 right-3 p-2 bg-slate-900/80 hover:bg-emerald-600 text-white rounded-xl backdrop-blur-md transition-all shadow-md"
          title="Full Resolution View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 shadow-md"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 shadow-md"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Bottom Description Bar */}
        <div className="absolute bottom-3 left-3 right-3 text-white text-left pointer-events-none">
          <p className="text-xs font-bold text-slate-100 drop-shadow-sm">{currentPhoto.sublabel}</p>
          <p className="text-[10px] text-slate-300 drop-shadow-sm line-clamp-1">{currentPhoto.description}</p>
        </div>
      </div>

      {/* 3 Thumbnail Switchers */}
      <div className="grid grid-cols-3 gap-2.5 pt-1">
        {photoList.map((photo, idx) => {
          const isSelected = activeIndex === idx;
          return (
            <button
              key={photo.id}
              onClick={() => setActiveIndex(idx)}
              className={`p-2 rounded-2xl border-2 text-left transition-all flex items-center space-x-2.5 ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-500/20"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/60"
              }`}
            >
              <img
                src={photo.url}
                alt={photo.label}
                className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-200"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-black text-slate-900 truncate leading-tight">
                  {photo.label.replace(/^\d+\.\s*/, "")}
                </div>
                <div className="text-[9px] text-slate-500 truncate mt-0.5">{photo.sublabel}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Fullscreen Lightbox */}
      {isFullscreenOpen && (
        <div
          onClick={() => setIsFullscreenOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-3 p-4 text-white"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h4 className="font-black text-sm">{worker.fullName} — {currentPhoto.label}</h4>
                <p className="text-xs text-slate-400">{currentPhoto.sublabel}</p>
              </div>
              <button
                onClick={() => setIsFullscreenOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] flex items-center justify-center bg-black/60 rounded-2xl p-2">
              <img
                src={currentPhoto.url}
                alt={currentPhoto.label}
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400 font-mono">
                View {activeIndex + 1} of {photoList.length}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handlePrev}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
                >
                  Previous View
                </button>
                <button
                  onClick={handleNext}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                >
                  Next View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
