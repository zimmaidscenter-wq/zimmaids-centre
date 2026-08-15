import React, { useState, useEffect } from "react";
import {
  Eye,
  Type,
  Sun,
  Moon,
  Zap,
  Wifi,
  WifiOff,
  Save,
  CheckCircle2,
  X,
  Sparkles,
  Volume2,
  Gauge
} from "lucide-react";

interface AccessibilitySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilitySettingsModal: React.FC<AccessibilitySettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [textSize, setTextSize] = useState<"normal" | "medium" | "large" | "xlarge">("normal");
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isDataSaver, setIsDataSaver] = useState(false);
  const [isScreenReaderOptimized, setIsScreenReaderOptimized] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // Read saved preferences
    const savedSize = localStorage.getItem("zmc_text_size") as any;
    const savedContrast = localStorage.getItem("zmc_high_contrast") === "true";
    const savedDataSaver = localStorage.getItem("zmc_data_saver") === "true";
    if (savedSize) setTextSize(savedSize);
    if (savedContrast) setIsHighContrast(savedContrast);
    if (savedDataSaver) setIsDataSaver(savedDataSaver);
  }, []);

  if (!isOpen) return null;

  const handleApplySettings = () => {
    localStorage.setItem("zmc_text_size", textSize);
    localStorage.setItem("zmc_high_contrast", isHighContrast ? "true" : "false");
    localStorage.setItem("zmc_data_saver", isDataSaver ? "true" : "false");

    // Apply root classes
    const root = document.documentElement;
    if (isHighContrast) {
      root.classList.add("high-contrast-mode");
    } else {
      root.classList.remove("high-contrast-mode");
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Accessibility & Performance
              </h2>
              <p className="text-xs text-slate-400">
                Optimize readability, network speed & offline draft persistence.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {savedSuccess && (
            <div className="p-3.5 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-2xl flex items-center space-x-2 text-xs font-semibold animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Accessibility and speed preferences applied successfully!</span>
            </div>
          )}

          {/* Text Scaler */}
          <div className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Type className="w-4 h-4 text-emerald-400" />
                Text Sizing & Hierarchy
              </label>
              <span className="text-[10px] text-emerald-400 uppercase font-extrabold">{textSize}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "normal", label: "A (100%)", desc: "Default" },
                { id: "medium", label: "A+ (115%)", desc: "Comfortable" },
                { id: "large", label: "A++ (130%)", desc: "Large" },
                { id: "xlarge", label: "A+++ (150%)", desc: "High Legibility" },
              ].map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setTextSize(size.id as any)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    textSize === size.id
                      ? "bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold shadow-md"
                      : "bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  <div className="text-xs font-bold">{size.label}</div>
                  <div className="text-[9px] opacity-80 mt-0.5">{size.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast Mode Toggle */}
          <div className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-400" />
                High Contrast Sunlight Mode
              </h4>
              <p className="text-[11px] text-slate-400">
                Enhances text contrast and borders for optimal viewing in bright sunlight on mobile devices.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsHighContrast(!isHighContrast)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                isHighContrast ? "bg-emerald-500" : "bg-slate-700"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isHighContrast ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Low Data / Econet 3G Lite Mode */}
          <div className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-blue-400" />
                Slow Network / Data Saver Mode
              </h4>
              <p className="text-[11px] text-slate-400">
                Compresses image previews and pauses background polling on mobile 2G/3G connections.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsDataSaver(!isDataSaver)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                isDataSaver ? "bg-blue-500" : "bg-slate-700"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isDataSaver ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Offline Draft Protection Info */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
              <Wifi className="w-4 h-4" />
              <span>Offline Draft Autosave Active</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Job applications, hiring inquiries, and profile draft edits are automatically cached to local browser storage so your work is never lost if your mobile connection drops.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplySettings}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center space-x-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Apply Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
