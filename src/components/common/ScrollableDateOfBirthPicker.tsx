import React, { useState, useEffect } from "react";
import { Calendar, ChevronDown } from "lucide-react";

interface ScrollableDateOfBirthPickerProps {
  value: string; // Format "YYYY-MM-DD"
  onChange: (dateStr: string) => void;
  required?: boolean;
  minAge?: number;
  maxAge?: number;
}

const MONTHS = [
  { value: "01", label: "January (01)" },
  { value: "02", label: "February (02)" },
  { value: "03", label: "March (03)" },
  { value: "04", label: "April (04)" },
  { value: "05", label: "May (05)" },
  { value: "06", label: "June (06)" },
  { value: "07", label: "July (07)" },
  { value: "08", label: "August (08)" },
  { value: "09", label: "September (09)" },
  { value: "10", label: "October (10)" },
  { value: "11", label: "November (11)" },
  { value: "12", label: "December (12)" },
];

export const ScrollableDateOfBirthPicker: React.FC<ScrollableDateOfBirthPickerProps> = ({
  value,
  onChange,
  required = true,
  minAge = 18,
  maxAge = 75,
}) => {
  const currentYear = new Date().getFullYear();
  const maxYear = currentYear - minAge;
  const minYear = currentYear - maxAge;

  // Generate years list descending (e.g. 2008 -> 1950)
  const years: number[] = [];
  for (let y = maxYear; y >= minYear; y--) {
    years.push(y);
  }

  // Generate days 01 to 31
  const days: string[] = [];
  for (let d = 1; d <= 31; d++) {
    days.push(d < 10 ? `0${d}` : `${d}`);
  }

  // Parse initial value
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");

  useEffect(() => {
    if (value && value.includes("-")) {
      const parts = value.split("-");
      if (parts.length === 3) {
        setSelectedYear(parts[0]);
        setSelectedMonth(parts[1]);
        setSelectedDay(parts[2]);
      }
    } else {
      // Default to 25 years old if not set
      const defaultYear = (currentYear - 25).toString();
      setSelectedYear(defaultYear);
      setSelectedMonth("01");
      setSelectedDay("15");
      onChange(`${defaultYear}-01-15`);
    }
  }, [value]);

  const handleYearChange = (newYear: string) => {
    setSelectedYear(newYear);
    updateDate(newYear, selectedMonth || "01", selectedDay || "01");
  };

  const handleMonthChange = (newMonth: string) => {
    setSelectedMonth(newMonth);
    updateDate(selectedYear || maxYear.toString(), newMonth, selectedDay || "01");
  };

  const handleDayChange = (newDay: string) => {
    setSelectedDay(newDay);
    updateDate(selectedYear || maxYear.toString(), selectedMonth || "01", newDay);
  };

  const updateDate = (y: string, m: string, d: string) => {
    if (y && m && d) {
      onChange(`${y}-${m}-${d}`);
    }
  };

  // Calculate age
  const calculateAge = () => {
    if (!selectedYear) return null;
    const birthYear = parseInt(selectedYear, 10);
    const age = currentYear - birthYear;
    return age > 0 ? age : null;
  };

  const age = calculateAge();

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="font-bold text-slate-700 text-xs flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>Date of Birth (DOB) *</span>
        </label>
        {age && (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            {age} Years Old
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200">
        {/* Day Column with scroll */}
        <div className="relative">
          <label className="text-[9px] font-black uppercase text-slate-500 block px-1 mb-0.5">Day</label>
          <select
            value={selectedDay}
            onChange={(e) => handleDayChange(e.target.value)}
            required={required}
            className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer max-h-48 overflow-y-auto"
          >
            <option value="" disabled>Day</option>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Month Column with scroll */}
        <div className="relative">
          <label className="text-[9px] font-black uppercase text-slate-500 block px-1 mb-0.5">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => handleMonthChange(e.target.value)}
            required={required}
            className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer max-h-48 overflow-y-auto"
          >
            <option value="" disabled>Month</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year Column with scroll */}
        <div className="relative">
          <label className="text-[9px] font-black uppercase text-slate-500 block px-1 mb-0.5">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => handleYearChange(e.target.value)}
            required={required}
            className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer max-h-48 overflow-y-auto"
          >
            <option value="" disabled>Year</option>
            {years.map((y) => (
              <option key={y} value={y.toString()}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
