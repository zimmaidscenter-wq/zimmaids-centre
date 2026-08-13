import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  UserCheck,
  Calendar,
  Filter,
  Download,
  Printer,
  Sparkles,
  RefreshCw,
  MapPin,
  Briefcase,
  AlertTriangle,
  Award,
  Clock,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
  PieChart as PieChartIcon,
  ShieldAlert,
  Percent,
  Check
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ComposedChart
} from "recharts";

// 1. Successful Placements Monthly & Category Data
const PLACEMENT_TRENDS_DATA = [
  { month: "Jan 2026", domesticWorkers: 142, nannies: 98, caregivers: 64, housekeepers: 52, artisans: 38, total: 394, avgDaysToFill: 3.8 },
  { month: "Feb 2026", domesticWorkers: 158, nannies: 110, caregivers: 72, housekeepers: 59, artisans: 44, total: 443, avgDaysToFill: 3.5 },
  { month: "Mar 2026", domesticWorkers: 175, nannies: 125, caregivers: 85, housekeepers: 68, artisans: 51, total: 504, avgDaysToFill: 3.2 },
  { month: "Apr 2026", domesticWorkers: 190, nannies: 138, caregivers: 96, housekeepers: 74, artisans: 60, total: 558, avgDaysToFill: 2.9 },
  { month: "May 2026", domesticWorkers: 215, nannies: 155, caregivers: 112, housekeepers: 88, artisans: 72, total: 642, avgDaysToFill: 2.6 },
  { month: "Jun 2026", domesticWorkers: 240, nannies: 172, caregivers: 128, housekeepers: 98, artisans: 85, total: 723, avgDaysToFill: 2.4 },
  { month: "Jul 2026", domesticWorkers: 265, nannies: 195, caregivers: 145, housekeepers: 112, artisans: 96, total: 813, avgDaysToFill: 2.1 },
  { month: "Aug 2026", domesticWorkers: 298, nannies: 218, caregivers: 162, housekeepers: 126, artisans: 110, total: 914, avgDaysToFill: 1.9 },
];

const PLACEMENT_BY_REGION_DATA = [
  { region: "Harare", placements: 412, successRate: 96.4, avgWageUSD: 280 },
  { region: "Bulawayo", placements: 245, successRate: 94.8, avgWageUSD: 240 },
  { region: "Chitungwiza", placements: 128, successRate: 93.2, avgWageUSD: 210 },
  { region: "Mutare", placements: 86, successRate: 92.5, avgWageUSD: 220 },
  { region: "Gweru", placements: 64, successRate: 91.8, avgWageUSD: 200 },
];

const PLACEMENT_RETENTION_DATA = [
  { tenure: "1 Month Retention", rate: 98.2, count: 897, color: "#10b981" },
  { tenure: "3 Month Retention", rate: 94.5, count: 863, color: "#06b6d4" },
  { tenure: "6 Month Retention", rate: 89.1, count: 814, color: "#3b82f6" },
  { tenure: "12+ Month Long-Term", rate: 82.4, count: 753, color: "#6366f1" },
];

// 2. Active Escrow Volume Data
const ESCROW_VOLUME_DATA = [
  { month: "Jan 2026", heldUSD: 38500, disbursedUSD: 142000, disputedUSD: 1200, netFeeUSD: 14200 },
  { month: "Feb 2026", heldUSD: 44200, disbursedUSD: 165000, disputedUSD: 950, netFeeUSD: 16500 },
  { month: "Mar 2026", heldUSD: 52100, disbursedUSD: 198000, disputedUSD: 1100, netFeeUSD: 19800 },
  { month: "Apr 2026", heldUSD: 61800, disbursedUSD: 232000, disputedUSD: 800, netFeeUSD: 23200 },
  { month: "May 2026", heldUSD: 71200, disbursedUSD: 275000, disputedUSD: 1400, netFeeUSD: 27500 },
  { month: "Jun 2026", heldUSD: 79500, disbursedUSD: 318000, disputedUSD: 900, netFeeUSD: 31800 },
  { month: "Jul 2026", heldUSD: 84100, disbursedUSD: 362000, disputedUSD: 750, netFeeUSD: 36200 },
  { month: "Aug 2026", heldUSD: 89400, disbursedUSD: 415000, disputedUSD: 600, netFeeUSD: 41500 },
];

const ESCROW_PAYMENT_GATEWAY_DATA = [
  { name: "EcoCash USD", value: 48, amountUSD: 242400, color: "#10b981" },
  { name: "InnBucks USD", value: 24, amountUSD: 121200, color: "#0ea5e9" },
  { name: "ZIPIT / Bank Transfer", value: 14, amountUSD: 70700, color: "#8b5cf6" },
  { name: "Mukuru / Remittance", value: 8, amountUSD: 40400, color: "#f59e0b" },
  { name: "Visa / Mastercard", value: 6, amountUSD: 30300, color: "#ec4899" },
];

const ESCROW_STATUS_DISTRIBUTION = [
  { status: "Active Escrow Held", count: 218, totalUSD: 89400, color: "#059669" },
  { status: "Pending Employer Release", count: 64, totalUSD: 28200, color: "#0284c7" },
  { status: "Successfully Disbursed", count: 1240, totalUSD: 415000, color: "#10b981" },
  { status: "Under Dispute Resolution", count: 3, totalUSD: 600, color: "#e11d48" },
];

// 3. Worker Vetting Success Rate Data
const VETTING_PIPELINE_DATA = [
  { stage: "Registered Applicants", total: 1850, passed: 1850, passRate: 100 },
  { stage: "National ID & Bio Check", total: 1850, passed: 1720, passRate: 93.0 },
  { stage: "ZRP CID Police Clearance", total: 1720, passed: 1580, passRate: 91.8 },
  { stage: "Red Cross & Medical Check", total: 1580, passed: 1490, passRate: 94.3 },
  { stage: "Reference Verification", total: 1490, passed: 1410, passRate: 94.6 },
  { stage: "Verified Marketplace Ready", total: 1410, passed: 1410, passRate: 100 },
];

const VETTING_MONTHLY_RATES_DATA = [
  { month: "Jan 2026", idVerified: 92.1, zrpCidVerified: 86.4, healthVerified: 89.2, overallSuccess: 84.5 },
  { month: "Feb 2026", idVerified: 93.4, zrpCidVerified: 88.0, healthVerified: 90.5, overallSuccess: 86.2 },
  { month: "Mar 2026", idVerified: 94.2, zrpCidVerified: 89.5, healthVerified: 91.8, overallSuccess: 88.0 },
  { month: "Apr 2026", idVerified: 95.0, zrpCidVerified: 90.8, healthVerified: 92.5, overallSuccess: 89.5 },
  { month: "May 2026", idVerified: 95.8, zrpCidVerified: 91.5, healthVerified: 93.2, overallSuccess: 90.8 },
  { month: "Jun 2026", idVerified: 96.5, zrpCidVerified: 92.8, healthVerified: 94.1, overallSuccess: 92.1 },
  { month: "Jul 2026", idVerified: 97.1, zrpCidVerified: 93.6, healthVerified: 94.8, overallSuccess: 93.4 },
  { month: "Aug 2026", idVerified: 97.8, zrpCidVerified: 94.5, healthVerified: 95.6, overallSuccess: 94.2 },
];

const VETTING_REJECTION_REASONS = [
  { reason: "Invalid ZRP CID Reference Code", count: 180, percentage: 41.0 },
  { reason: "Unverifiable Previous Employer Reference", count: 125, percentage: 28.4 },
  { reason: "Expired / Unclear National ID Document", count: 85, percentage: 19.3 },
  { reason: "Medical Fitness Certificate Pending", count: 50, percentage: 11.3 },
];

export const PerformanceReportsModule: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"30d" | "90d" | "ytd" | "all">("all");
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "ZWG">("USD");
  const [selectedRegion, setSelectedRegion] = useState<string>("All Regions");
  const [activeReportTab, setActiveReportTab] = useState<"placements" | "escrow" | "vetting" | "summary">("summary");
  const [copiedNotification, setCopiedNotification] = useState(false);

  const currencyMultiplier = selectedCurrency === "ZWG" ? 26.5 : 1.0;
  const currencySymbol = selectedCurrency === "ZWG" ? "ZiG " : "$ ";

  const handleExportCSV = () => {
    const csvHeader = "Month,Total Placements,Active Escrow (USD),Disbursed Escrow (USD),Vetting Success Rate (%)\n";
    const csvRows = PLACEMENT_TRENDS_DATA.map((row, idx) => {
      const escrowRow = ESCROW_VOLUME_DATA[idx];
      const vettingRow = VETTING_MONTHLY_RATES_DATA[idx];
      return `${row.month},${row.total},${escrowRow.heldUSD},${escrowRow.disbursedUSD},${vettingRow.overallSuccess}%`;
    }).join("\n");

    const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ZMC_Performance_Report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Module Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 border border-emerald-800/80 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:bg-white print:text-slate-900 print:border-none print:shadow-none">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-emerald-800/90 rounded-full text-xs font-bold text-emerald-200 border border-emerald-700/60 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-amber-300" />
                <span>Executive Performance Reports Module</span>
              </span>
              <span className="px-2.5 py-1 bg-slate-800/90 rounded-full text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Real-Time Recharts Visual Analytics</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Placement Velocity, Escrow Ledger & Worker Vetting Analytics
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Interactive visual summaries tracking monthly hiring success, active escrow hold volumes, payment gateway breakdowns, and ZRP police clearance vetting success rates across Zimbabwe.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-700/60 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs print:hidden">
          <div className="flex flex-wrap items-center gap-3">
            {/* Time Range Selector */}
            <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 px-2 font-bold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-emerald-400" /> Timeframe:
              </span>
              {[
                { id: "30d", label: "30 Days" },
                { id: "90d", label: "90 Days" },
                { id: "ytd", label: "YTD 2026" },
                { id: "all", label: "All Time" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTimeRange(t.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    timeRange === t.id
                      ? "bg-emerald-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Currency Selector */}
            <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 px-2 font-bold">Currency:</span>
              <button
                onClick={() => setSelectedCurrency("USD")}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  selectedCurrency === "USD" ? "bg-emerald-600 text-white" : "text-slate-400"
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setSelectedCurrency("ZWG")}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  selectedCurrency === "ZWG" ? "bg-emerald-600 text-white" : "text-slate-400"
                }`}
              >
                ZiG (ZWG)
              </button>
            </div>

            {/* Region Filter */}
            <div className="flex items-center space-x-1 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-transparent font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="All Regions" className="bg-slate-900 text-white">All Regions (Zimbabwe)</option>
                <option value="Harare" className="bg-slate-900 text-white">Harare Metro</option>
                <option value="Bulawayo" className="bg-slate-900 text-white">Bulawayo Metro</option>
                <option value="Chitungwiza" className="bg-slate-900 text-white">Chitungwiza</option>
                <option value="Mutare" className="bg-slate-900 text-white">Mutare</option>
                <option value="Gweru" className="bg-slate-900 text-white">Gweru</option>
              </select>
            </div>
          </div>

          <span className="font-mono text-emerald-400 text-[11px]">
            Data Updated: Aug 13, 2026 • 100% Verified Telemetry
          </span>
        </div>
      </div>

      {/* KPI Top Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Successful Placements */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2 hover:border-emerald-300 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">Total Successful Placements</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">4,996</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +28.4% YoY
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Average time-to-fill: <strong className="text-slate-900 font-mono">1.9 Days</strong>
          </p>
        </div>

        {/* KPI 2: Active Escrow Volume */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2 hover:border-emerald-300 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">Active Escrow Volume</span>
            <div className="p-2 bg-sky-50 text-sky-700 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {currencySymbol}{(89400 * currencyMultiplier).toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +34.1% MoM
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Total Disbursed 2026: <strong className="text-slate-900 font-mono">{currencySymbol}{(415000 * currencyMultiplier).toLocaleString()}</strong>
          </p>
        </div>

        {/* KPI 3: Worker Vetting Success Rate */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2 hover:border-emerald-300 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">Vetting Pass Success Rate</span>
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">94.2%</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +9.7% vs 2025
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            ZRP Police CID verified: <strong className="text-slate-900 font-mono">1,580 Workers</strong>
          </p>
        </div>

        {/* KPI 4: 12-Month Placement Retention */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-2 hover:border-emerald-300 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider">Placement Retention Rate</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 font-mono">89.1%</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> High Satisfaction
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Employer re-hire rate: <strong className="text-slate-900 font-mono">78.5%</strong>
          </p>
        </div>
      </div>

      {/* Report Category Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 print:hidden">
        {[
          { id: "summary", label: "Comprehensive Dashboard", icon: BarChart3 },
          { id: "placements", label: "Successful Placements Analytics", icon: UserCheck },
          { id: "escrow", label: "Active Escrow Volume & Ledgers", icon: DollarSign },
          { id: "vetting", label: "Worker Vetting Success Rates", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReportTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className="w-4 h-4 text-emerald-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* REPORT SECTION 1: PLACEMENTS ANALYTICS */}
      {(activeReportTab === "summary" || activeReportTab === "placements") && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  <span>Successful Placements Trend & Time-to-Fill Speed</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Monthly breakdown of hired domestic workers, caregivers, nannies, and household artisans with average days required to fill vacancies.
                </p>
              </div>

              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold font-mono rounded-xl">
                2026 Growth: +132% Hires
              </span>
            </div>

            {/* Placements Multi-Bar & Line Composed Chart */}
            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={PLACEMENT_TRENDS_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" fontSize={11} tickLine={false} unit="d" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "16px", color: "#fff", border: "none", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Bar yAxisId="left" dataKey="domesticWorkers" name="Domestic Workers" stackId="a" fill="#10b981" />
                  <Bar yAxisId="left" dataKey="nannies" name="Nannies & Childcare" stackId="a" fill="#06b6d4" />
                  <Bar yAxisId="left" dataKey="caregivers" name="Caregivers & Nurse Aides" stackId="a" fill="#3b82f6" />
                  <Bar yAxisId="left" dataKey="housekeepers" name="Housekeepers & Cleaners" stackId="a" fill="#8b5cf6" />
                  <Bar yAxisId="left" dataKey="artisans" name="Artisans & Gardeners" stackId="a" fill="#f59e0b" />
                  <Line yAxisId="right" type="monotone" dataKey="avgDaysToFill" name="Avg Days to Fill (Speed)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Regional Placements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Placement Volume by Zimbabwean Region</h4>
                <div className="space-y-2">
                  {PLACEMENT_BY_REGION_DATA.map((reg) => (
                    <div key={reg.region} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center text-xs">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="font-bold text-slate-900 block">{reg.region}</span>
                          <span className="text-[10px] text-slate-500">Avg Monthly Wage: ${reg.avgWageUSD} USD</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <strong className="font-mono text-slate-900 block">{reg.placements} Hires</strong>
                        <span className="text-[10px] text-emerald-600 font-bold">{reg.successRate}% Success</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Job Tenure & Placement Retention Rate</h4>
                <div className="space-y-2">
                  {PLACEMENT_RETENTION_DATA.map((ret) => (
                    <div key={ret.tenure} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-900">{ret.tenure}</span>
                        <span className="font-mono text-emerald-700">{ret.rate}% ({ret.count} Hires)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${ret.rate}%`, backgroundColor: ret.color }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT SECTION 2: ACTIVE ESCROW VOLUME */}
      {(activeReportTab === "summary" || activeReportTab === "escrow") && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span>Active Escrow Volume & Disbursed Financial Ledgers</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Monthly growth of active escrow held vs total salary disbursements and 10% platform net revenue.
                </p>
              </div>

              <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-bold font-mono rounded-xl">
                Current Active Escrow: {currencySymbol}{(89400 * currencyMultiplier).toLocaleString()}
              </span>
            </div>

            {/* Escrow Volume Area Chart */}
            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ESCROW_VOLUME_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHeld" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorDisbursed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    formatter={(value: any) => [`${currencySymbol}${(Number(value) * currencyMultiplier).toLocaleString()}`, ""]}
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "16px", color: "#fff", border: "none", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Area type="monotone" dataKey="heldUSD" name="Active Escrow Vault ($ Held)" stroke="#10b981" fillOpacity={1} fill="url(#colorHeld)" />
                  <Area type="monotone" dataKey="disbursedUSD" name="Disbursed Payroll ($ Payouts)" stroke="#0284c7" fillOpacity={1} fill="url(#colorDisbursed)" />
                  <Line type="monotone" dataKey="netFeeUSD" name="ZMC 10% Platform Revenue" stroke="#f59e0b" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Payment Gateways Breakdown Pie Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Escrow Volume by Zimbabwe Payment Gateway</h4>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ESCROW_PAYMENT_GATEWAY_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {ESCROW_PAYMENT_GATEWAY_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any, name: any) => [`${value}% share`, name]}
                        contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", color: "#fff", border: "none", fontSize: "12px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Escrow Vault Status Distribution</h4>
                <div className="space-y-2.5">
                  {ESCROW_STATUS_DISTRIBUTION.map((st) => (
                    <div key={st.status} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: st.color }}></div>
                        <div>
                          <span className="font-bold text-slate-900 block">{st.status}</span>
                          <span className="text-[10px] text-slate-500">{st.count} Contracts</span>
                        </div>
                      </div>

                      <strong className="font-mono text-slate-900 text-sm">
                        {currencySymbol}{(st.totalUSD * currencyMultiplier).toLocaleString()}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT SECTION 3: WORKER VETTING SUCCESS RATES */}
      {(activeReportTab === "summary" || activeReportTab === "vetting") && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Worker Vetting Pipeline & ZRP Clearance Pass Rates</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Step-by-step verification funnel from initial registration to ZRP Police CID clearance and Red Cross health certification.
                </p>
              </div>

              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold font-mono rounded-xl">
                Overall Pass Rate: 94.2%
              </span>
            </div>

            {/* Vetting Monthly Pass Rates Line Chart */}
            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={VETTING_MONTHLY_RATES_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis domain={[80, 100]} stroke="#64748b" fontSize={11} tickLine={false} unit="%" />
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, "Pass Rate"]}
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "16px", color: "#fff", border: "none", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Line type="monotone" dataKey="idVerified" name="National ID Check Pass %" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="zrpCidVerified" name="ZRP CID Clearance Pass %" stroke="#0284c7" strokeWidth={2} />
                  <Line type="monotone" dataKey="healthVerified" name="Red Cross Health Pass %" stroke="#8b5cf6" strokeWidth={2} />
                  <Line type="monotone" dataKey="overallSuccess" name="Final Market Readiness Rate %" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Vetting Funnel & Rejection Reasons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Vetting Funnel Conversion Stages</h4>
                <div className="space-y-2">
                  {VETTING_PIPELINE_DATA.map((stage) => (
                    <div key={stage.stage} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 text-xs">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-900">{stage.stage}</span>
                        <span className="font-mono text-emerald-700">{stage.passed} / {stage.total} ({stage.passRate}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${stage.passRate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Vetting Failure / Rejection Breakdown</h4>
                <div className="space-y-2.5">
                  {VETTING_REJECTION_REASONS.map((rej) => (
                    <div key={rej.reason} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{rej.reason}</span>
                        <span className="text-[10px] text-slate-500">{rej.count} Rejections Total</span>
                      </div>
                      <span className="px-2.5 py-1 bg-rose-100 text-rose-800 font-mono font-bold rounded-xl text-xs">
                        {rej.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
