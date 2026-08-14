import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Camera,
  FileCheck2,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from "lucide-react";
import { calculateProfileCompleteness, CompletenessResult } from "../../utils/profileCompleteness";
import { WorkerProfile, PortfolioItem } from "../../types/marketplace";
import { StandardizedWorkerRegistration } from "../../types/workerRegistration";

interface ProfileCompletenessWidgetProps {
  profile: Partial<WorkerProfile> | Partial<StandardizedWorkerRegistration> | null | undefined;
  portfolio?: PortfolioItem[];
  variant?: "detailed" | "compact" | "employer-view";
  onActionClick?: (actionKey: string) => void;
  className?: string;
}

export const ProfileCompletenessWidget: React.FC<ProfileCompletenessWidgetProps> = ({
  profile,
  portfolio,
  variant = "detailed",
  onActionClick,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(variant === "detailed");
  const completeness: CompletenessResult = calculateProfileCompleteness(profile, portfolio);

  const getProgressColor = (pct: number) => {
    if (pct >= 90) return "from-emerald-500 to-teal-600";
    if (pct >= 70) return "from-teal-500 to-emerald-600";
    if (pct >= 45) return "from-amber-500 to-amber-600";
    return "from-slate-400 to-slate-600";
  };

  const getTrackBg = (pct: number) => {
    if (pct >= 70) return "bg-emerald-100";
    if (pct >= 45) return "bg-amber-100";
    return "bg-slate-200";
  };

  // Employer View Variant (Compact, Trust-Focused)
  if (variant === "employer-view") {
    return (
      <div className={`bg-emerald-950/5 border border-emerald-900/15 rounded-2xl p-3.5 space-y-2.5 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600/10 text-emerald-700 flex items-center justify-center font-black text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900">Portfolio & Profile Quality</span>
              <span className="text-[10px] text-slate-500 block">Verified documentation & work proof</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${completeness.levelBadge}`}>
              {completeness.level}
            </span>
            <span className="text-sm font-black text-slate-900">{completeness.totalPercentage}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(completeness.totalPercentage)} transition-all duration-700 shadow-sm`}
            style={{ width: `${Math.max(5, completeness.totalPercentage)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-600 pt-0.5">
          <span>{completeness.categories.filter((c) => c.isComplete).length} of {completeness.categories.length} quality milestones verified</span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-emerald-700 font-bold hover:underline flex items-center space-x-0.5"
          >
            <span>{isExpanded ? "Hide Details" : "View Breakdown"}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {isExpanded && (
          <div className="pt-2 border-t border-slate-200/60 space-y-1.5 animate-fadeIn">
            {completeness.categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-1.5 text-slate-700 font-medium">
                  {cat.isComplete ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  )}
                  <span>{cat.name}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500">{cat.statusLabel}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Compact Candidate View
  if (variant === "compact") {
    return (
      <div className={`bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Profile Quality Score</h4>
              <p className="text-[11px] text-slate-500">{completeness.totalPercentage}% Completed • {completeness.level}</p>
            </div>
          </div>
          <span className="text-base font-black text-emerald-700">{completeness.totalPercentage}%</span>
        </div>

        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(completeness.totalPercentage)} transition-all duration-700`}
            style={{ width: `${Math.max(5, completeness.totalPercentage)}%` }}
          />
        </div>
      </div>
    );
  }

  // Detailed Candidate View (Dashboard / Profile Tab)
  return (
    <div className={`bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 ${className}`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border uppercase tracking-wider ${completeness.levelBadge}`}>
              {completeness.level} Profile
            </span>
            <span className="text-xs text-slate-500 font-medium">
              • Direct Employer Visibility Tier
            </span>
          </div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>Profile & Portfolio Completeness</span>
          </h3>
          <p className="text-xs text-slate-600 max-w-xl">
            {completeness.summaryText} High quality profiles with photos, work proof, and reference letters get hired 4x faster.
          </p>
        </div>

        {/* Large Score Indicator */}
        <div className="flex items-center space-x-4 shrink-0 bg-white border border-slate-200/80 px-4 py-3 rounded-2xl shadow-xs">
          <div className="text-right">
            <div className="text-2xl font-black text-slate-900 leading-none">
              {completeness.totalPercentage}
              <span className="text-base font-bold text-emerald-600">%</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mt-0.5">
              Completed
            </div>
          </div>

          <div className="w-12 h-12 relative flex items-center justify-center">
            {/* Circular SVG Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 transition-all duration-1000 ease-out"
                strokeDasharray={`${completeness.totalPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <Award className="w-5 h-5 text-emerald-600 absolute" />
          </div>
        </div>
      </div>

      {/* Main Gradient Progress Bar */}
      <div className="space-y-2">
        <div className={`w-full ${getTrackBg(completeness.totalPercentage)} h-3.5 rounded-full overflow-hidden p-0.5 shadow-inner`}>
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(completeness.totalPercentage)} transition-all duration-1000 ease-out shadow-sm`}
            style={{ width: `${Math.max(4, completeness.totalPercentage)}%` }}
          />
        </div>

        {/* Milestone Marks */}
        <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1">
          <span>0% Starter</span>
          <span>45% Standard</span>
          <span>70% High Quality</span>
          <span className="text-emerald-700 font-extrabold">100% All-Star ⭐</span>
        </div>
      </div>

      {/* Missing Quick Action Items (if any) */}
      {completeness.missingActionItems.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Recommended Next Actions to Boost Your Profile:</span>
            </span>
            <span className="text-[11px] font-bold text-amber-800">
              +{completeness.missingActionItems.reduce((acc, item) => acc + item.points, 0)}% available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {completeness.missingActionItems.map((action) => (
              <button
                key={action.id}
                onClick={() => onActionClick?.(action.actionKey)}
                className="text-left bg-white hover:bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 flex items-center justify-between group transition-all shadow-xs"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px]">
                    +{action.points}%
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-amber-900">
                    {action.label}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Breakdown Details Toggle */}
      <div className="border-t border-slate-200 pt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-xs font-bold text-slate-700 hover:text-emerald-800 transition-colors"
        >
          <span className="flex items-center space-x-1.5">
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <span>Profile Quality Milestones ({completeness.categories.filter((c) => c.isComplete).length}/{completeness.categories.length} Complete)</span>
          </span>
          <span className="flex items-center space-x-1 text-emerald-700 font-extrabold">
            <span>{isExpanded ? "Collapse Details" : "Expand Full Breakdown"}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </button>

        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 animate-fadeIn">
            {completeness.categories.map((cat) => (
              <div
                key={cat.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  cat.isComplete
                    ? "bg-emerald-50/50 border-emerald-200"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    {cat.isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span className="text-xs font-bold text-slate-900">{cat.name}</span>
                  </div>
                  <span className="text-[11px] font-black text-slate-700">
                    {cat.score}/{cat.weight}%
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${
                      cat.isComplete ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${(cat.score / cat.weight) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium truncate max-w-[200px]">{cat.statusLabel}</span>
                  {cat.isComplete ? (
                    <span className="text-emerald-700 font-black text-[10px] uppercase">Verified ✓</span>
                  ) : (
                    <span className="text-amber-700 font-bold text-[10px]">Action needed</span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 mt-1 italic leading-tight">
                  {cat.recommendation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
