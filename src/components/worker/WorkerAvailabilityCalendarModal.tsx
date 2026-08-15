import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle,
  X,
  Save,
  Sun,
  Moon,
  Info,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { AvailabilityStatusType, WorkerProfile } from "../../types/marketplace";

interface WorkerAvailabilityCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: WorkerProfile;
  onSaveAvailability: (updatedData: {
    availabilityStatus: AvailabilityStatusType;
    availableFromDate?: string;
    noticePeriod?: "Immediate" | "1 Week Notice" | "2 Weeks Notice" | "1 Month Notice";
    availabilitySchedule?: Record<string, boolean>;
  }) => void;
}

export const WorkerAvailabilityCalendarModal: React.FC<WorkerAvailabilityCalendarModalProps> = ({
  isOpen,
  onClose,
  worker,
  onSaveAvailability,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<AvailabilityStatusType>(
    worker.availabilityStatus || "available_immediately"
  );
  const [futureDate, setFutureDate] = useState<string>(
    worker.availableFromDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [noticePeriod, setNoticePeriod] = useState<"Immediate" | "1 Week Notice" | "2 Weeks Notice" | "1 Month Notice">(
    worker.noticePeriod || "Immediate"
  );

  const [weeklySchedule, setWeeklySchedule] = useState<{ [key: string]: boolean }>(
    worker.availabilitySchedule || {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    }
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleSave = () => {
    onSaveAvailability({
      availabilityStatus: selectedStatus,
      availableFromDate: selectedStatus === "available_future_date" ? futureDate : undefined,
      noticePeriod,
      availabilitySchedule: weeklySchedule,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const STATUS_OPTIONS = [
    {
      id: "available_immediately" as AvailabilityStatusType,
      title: "Available immediately",
      desc: "Ready to start work today or within 24–48 hours for full-time or day placements.",
      color: "border-emerald-500 bg-emerald-950/40 text-emerald-300",
      badgeColor: "bg-emerald-500 text-slate-950",
      icon: CheckCircle2,
    },
    {
      id: "available_future_date" as AvailabilityStatusType,
      title: "Available from a future date",
      desc: "Completing current notice or contract; ready to start on a designated upcoming calendar date.",
      color: "border-blue-500 bg-blue-950/40 text-blue-300",
      badgeColor: "bg-blue-500 text-slate-950",
      icon: CalendarIcon,
    },
    {
      id: "already_employed" as AvailabilityStatusType,
      title: "Already employed",
      desc: "Currently placed with an active employer in Zimbabwe. Profile will be paused for new hires.",
      color: "border-amber-500 bg-amber-950/40 text-amber-300",
      badgeColor: "bg-amber-500 text-slate-950",
      icon: Briefcase,
    },
    {
      id: "temporarily_unavailable" as AvailabilityStatusType,
      title: "Temporarily unavailable",
      desc: "On personal leave, exams, family obligation, or medical rest. Not taking job offers right now.",
      color: "border-rose-500 bg-rose-950/40 text-rose-300",
      badgeColor: "bg-rose-500 text-white",
      icon: AlertCircle,
    },
  ];

  const DAYS = [
    { key: "monday", label: "Mon" },
    { key: "tuesday", label: "Tue" },
    { key: "wednesday", label: "Wed" },
    { key: "thursday", label: "Thu" },
    { key: "friday", label: "Fri" },
    { key: "saturday", label: "Sat" },
    { key: "sunday", label: "Sun" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Worker Availability Calendar
              </h2>
              <p className="text-xs text-slate-400">
                Manage live hiring availability status for <span className="text-emerald-400 font-semibold">{worker.fullName}</span>
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
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {savedSuccess && (
            <div className="p-4 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-2xl flex items-center space-x-3 text-sm animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Availability settings saved successfully! Your directory badge has been updated.</span>
            </div>
          )}

          {/* Section 1: Availability Status Radio Cards */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-3">
              1. Select Current Availability Status
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STATUS_OPTIONS.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = selectedStatus === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedStatus(opt.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? opt.color + " ring-2 ring-emerald-500/20"
                        : "border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="w-4 h-4 shrink-0" />
                          <span className="font-bold text-sm text-white">{opt.title}</span>
                        </div>
                        {isSelected && (
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${opt.badgeColor}`}>
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed opacity-90">{opt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Future Date Picker if Available from Future Date */}
          {selectedStatus === "available_future_date" && (
            <div className="p-5 bg-blue-950/30 border border-blue-800/50 rounded-2xl space-y-3 animate-fade-in">
              <div className="flex items-center space-x-2 text-blue-400">
                <CalendarIcon className="w-5 h-5" />
                <h4 className="font-bold text-sm text-white">Designate Future Start Date</h4>
              </div>
              <p className="text-xs text-slate-300">
                Employers searching for upcoming positions will see that you are open to contracts starting from this date:
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="date"
                  value={futureDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setFutureDate(e.target.value)}
                  className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-medium text-sm focus:outline-none focus:border-blue-500"
                />
                <span className="text-xs text-blue-300 font-semibold">
                  (Ready to start on {new Date(futureDate).toLocaleDateString("en-ZW", { month: "short", day: "numeric", year: "numeric" })})
                </span>
              </div>
            </div>
          )}

          {/* Section 3: Notice Period */}
          <div className="p-5 bg-slate-800/50 border border-slate-700/80 rounded-2xl space-y-3">
            <label className="block text-sm font-semibold text-slate-200">
              2. Notice Period / Handover Requirement
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["Immediate", "1 Week Notice", "2 Weeks Notice", "1 Month Notice"] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setNoticePeriod(period)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
                    noticePeriod === period
                      ? "bg-emerald-500 text-slate-950 border-emerald-400"
                      : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Weekly Working Days Availability */}
          <div className="p-5 bg-slate-800/50 border border-slate-700/80 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-200">
                3. Weekly Working Days Matrix
              </label>
              <span className="text-xs text-emerald-400 font-medium">
                {Object.values(weeklySchedule).filter(Boolean).length} days / week
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Click to toggle days you are available for work (especially for Day Workers & Part-Time Helpers):
            </p>
            <div className="grid grid-cols-7 gap-1.5">
              {DAYS.map((day) => {
                const isActive = weeklySchedule[day.key];
                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => toggleDay(day.key)}
                    className={`py-3 rounded-xl flex flex-col items-center justify-center transition-all border ${
                      isActive
                        ? "bg-emerald-600/90 text-white border-emerald-500 font-bold shadow-md shadow-emerald-950/50"
                        : "bg-slate-900/80 text-slate-500 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-xs">{day.label}</span>
                    <span className="text-[10px] mt-1 opacity-80">{isActive ? "ON" : "OFF"}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-xs text-slate-400">Directory Badge Preview:</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {selectedStatus === "available_immediately" && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Available Immediately
                    </span>
                  )}
                  {selectedStatus === "available_future_date" && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      Available from {futureDate}
                    </span>
                  )}
                  {selectedStatus === "already_employed" && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Already Employed
                    </span>
                  )}
                  {selectedStatus === "temporarily_unavailable" && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      Temporarily Unavailable
                    </span>
                  )}
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-500">Auto-synced</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Availability</span>
          </button>
        </div>
      </div>
    </div>
  );
};
