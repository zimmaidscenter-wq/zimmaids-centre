import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Camera,
  Maximize2
} from "lucide-react";

export interface LightboxImageItem {
  url: string;
  title?: string;
  subtitle?: string;
  category?: string;
  isVerified?: boolean;
  description?: string;
}

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: LightboxImageItem[];
  initialIndex?: number;
  onBack?: () => void;
  backLabel?: string;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  onBack,
  backLabel = "Back",
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Sync index when initialIndex changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, images.length - 1)));
      setZoomLevel(1);
    }
  }, [isOpen, initialIndex, images.length]);

  // Handle Browser Back Button (popstate) & Keyboard Escape/Arrows
  useEffect(() => {
    if (!isOpen) return;

    // Push state so clicking browser back button closes the image viewer
    const stateObj = { imageLightboxOpen: true, timestamp: Date.now() };
    window.history.pushState(stateObj, "");

    const handlePopState = () => {
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
        setZoomLevel(1);
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
        setZoomLevel(1);
      } else if (e.key === "+" || e.key === "=") {
        setZoomLevel((z) => Math.min(z + 0.25, 3));
      } else if (e.key === "-") {
        setZoomLevel((z) => Math.max(z - 0.25, 0.5));
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, images.length, onClose]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setZoomLevel(1);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setZoomLevel(1);
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Bar with Back Button & Controls */}
      <div
        className="flex items-center justify-between gap-4 z-10 bg-slate-900/80 p-3 sm:p-4 rounded-2xl border border-slate-800 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prominent Back Button */}
        <button
          type="button"
          onClick={handleBackClick}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          title="Return to previous view (or press Escape)"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{backLabel}</span>
        </button>

        {/* Title & Metadata */}
        <div className="text-center min-w-0 flex-1 px-2 hidden sm:block">
          <div className="flex items-center justify-center gap-2">
            <h4 className="text-white font-bold text-sm truncate">
              {currentImage.title || "Photo Viewer"}
            </h4>
            {currentImage.isVerified && (
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] rounded-full font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
          {currentImage.subtitle && (
            <p className="text-slate-400 text-xs truncate mt-0.5">
              {currentImage.subtitle}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom controls */}
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.5))}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(1)}
            className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl text-xs font-mono transition-all"
            title="Reset Zoom"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all"
            title="Close viewer (Escape)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Container */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden my-3 sm:my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-10 p-3 bg-slate-900/80 hover:bg-emerald-600 text-white rounded-full transition-all border border-slate-700 shadow-xl"
            title="Previous picture (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Current Image */}
        <div className="w-full h-full flex items-center justify-center p-2">
          <img
            src={currentImage.url}
            alt={currentImage.title || "Picture"}
            referrerPolicy="no-referrer"
            style={{
              transform: `scale(${zoomLevel})`,
              transition: "transform 0.2s ease-out",
            }}
            className="max-h-[70vh] sm:max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl select-none"
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-10 p-3 bg-slate-900/80 hover:bg-emerald-600 text-white rounded-full transition-all border border-slate-700 shadow-xl"
            title="Next picture (Right Arrow)"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Bottom Bar: Thumbnails, Counter & Description */}
      <div
        className="z-10 bg-slate-900/80 p-3 sm:p-4 rounded-2xl border border-slate-800 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Info */}
        <div className="sm:hidden text-center w-full">
          <div className="font-bold text-xs truncate text-slate-200">
            {currentImage.title || "Photo"}
          </div>
          {currentImage.subtitle && (
            <div className="text-[10px] text-slate-400 truncate">
              {currentImage.subtitle}
            </div>
          )}
        </div>

        {/* Thumbnails preview */}
        {images.length > 1 ? (
          <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  setZoomLevel(1);
                }}
                className={`relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  idx === currentIndex
                    ? "border-emerald-400 scale-105 shadow-md shadow-emerald-950"
                    : "border-slate-700 opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.title || `Thumb ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>High-Resolution Verified Photo</span>
          </div>
        )}

        {/* Counter & Back summary */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={handleBackClick}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};
