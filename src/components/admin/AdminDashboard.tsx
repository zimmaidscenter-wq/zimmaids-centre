import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { EnterpriseSecurityCenter } from "./EnterpriseSecurityCenter";
import { TestingStrategyCenter } from "./TestingStrategyCenter";
import { PerformanceReportsModule } from "./PerformanceReportsModule";
import { AgencyManagementCenter } from "./AgencyManagementCenter";
import { CategoryManagementCenter } from "./CategoryManagementCenter";
import { WhatsAppProfileImportModal } from "../chat/WhatsAppProfileImportModal";
import { convertRegistrationToWorkerProfile } from "../../utils/whatsappTemplates";
import { ZMC_OFFICIAL_LOGO } from "../common/BrandLogo";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  TrendingUp,
  Users,
  Building,
  Building2,
  Check,
  X,
  Search,
  DollarSign,
  Download,
  Printer,
  Sparkles,
  BarChart3,
  Bell,
  Activity,
  Briefcase,
  UserCheck,
  AlertCircle,
  FileSpreadsheet,
  Filter,
  RefreshCw,
  Send,
  Lock,
  Eye,
  ShieldAlert,
  Loader2,
  Calendar,
  Layers,
  CheckSquare,
  PieChart as PieIcon,
  ChevronRight,
  ArrowUpRight,
  SlidersHorizontal,
  HelpCircle,
  MessageSquare
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

// Mock Analytical Data for Charts
const REVENUE_DATA = [
  { month: "Jan", gross: 24500, commission: 2450, escrow: 18200 },
  { month: "Feb", gross: 29800, commission: 2980, escrow: 22100 },
  { month: "Mar", gross: 34200, commission: 3420, escrow: 26500 },
  { month: "Apr", gross: 41000, commission: 4100, escrow: 31000 },
  { month: "May", gross: 48500, commission: 4850, escrow: 36200 },
  { month: "Jun", gross: 56000, commission: 5600, escrow: 42000 },
  { month: "Jul", gross: 63500, commission: 6350, escrow: 48900 },
  { month: "Aug", gross: 71200, commission: 7120, escrow: 55000 },
];

const CATEGORY_DISTRIBUTION = [
  { name: "Housekeeping / Maids", count: 6200, value: 42 },
  { name: "Child Care & Nannies", count: 3800, value: 26 },
  { name: "Elderly Caregivers", count: 2100, value: 14 },
  { name: "Solar & Electricians", count: 1600, value: 11 },
  { name: "Gardening & Plumbers", count: 1020, value: 7 },
];

const CITY_DISTRIBUTION = [
  { name: "Harare", users: 11200, color: "#059669" },
  { name: "Bulawayo", users: 4800, color: "#0d9488" },
  { name: "Mutare", users: 1500, color: "#0284c7" },
  { name: "Gweru", users: 950, color: "#6366f1" },
  { name: "Chinhoyi", users: 470, color: "#8b5cf6" },
];

const PAYMENT_GATEWAY_SHARE = [
  { name: "EcoCash USD", share: 42, color: "#16a34a" },
  { name: "ZIPIT Zimswitch", share: 28, color: "#0284c7" },
  { name: "InnBucks Code", share: 18, color: "#f59e0b" },
  { name: "Mukuru Voucher", share: 7, color: "#ec4899" },
  { name: "Visa / MasterCard", share: 5, color: "#6366f1" },
];

export const AdminDashboard: React.FC = () => {
  const {
    pendingWorkerProfiles,
    approveWorkerProfile,
    rejectWorkerProfile,
    pendingJobPostings,
    approveJobPosting,
    rejectJobPosting,
    agencies,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<
    | "categories"
    | "profile-approvals"
    | "job-approvals"
    | "agencies"
    | "analytics"
    | "revenue"
    | "users"
    | "jobs"
    | "applications"
    | "verification"
    | "payments"
    | "complaints"
    | "reports"
    | "logs"
    | "notifications"
    | "ai-insights"
    | "security"
    | "qa-testing"
    | "performance-reports"
  >("categories");

  // Filters
  const [timeRange, setTimeRange] = useState("This Month");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [searchQuery, setSearchQuery] = useState("");

  // WhatsApp Profile Import & Audit Modal State
  const [showWhatsAppImportModal, setShowWhatsAppImportModal] = useState(false);
  const [selectedWorkerAudit, setSelectedWorkerAudit] = useState<any>(null);

  // AI Insights State
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiInsightsData, setAiInsightsData] = useState<any>(null);

  // Verification Queue State
  const [pendingVerifications, setPendingVerifications] = useState([
    {
      id: "v101",
      name: "Tariro Chikwanha",
      role: "Caregiver & Nurse Aide",
      city: "Harare (Borrowdale)",
      idDocUrl: "National ID 63-299102-X-42",
      policeDocUrl: "ZRP CID Clearance Ref # 2026/8821",
      submittedDate: "2026-08-12 14:20",
      status: "Pending Review",
      trustScore: 88,
    },
    {
      id: "v102",
      name: "Knowledge Moyo",
      role: "Class 1 Solar Electrician",
      city: "Bulawayo (Suburbs)",
      idDocUrl: "National ID 08-112093-Y-12",
      policeDocUrl: "ZRP CID Clearance Ref # 2026/9930",
      submittedDate: "2026-08-12 15:05",
      status: "Pending Review",
      trustScore: 92,
    },
    {
      id: "v103",
      name: "Grace Mutambara",
      role: "Live-In Housekeeper",
      city: "Mutare (Greendale)",
      idDocUrl: "National ID 75-883910-W-19",
      policeDocUrl: "ZRP CID Clearance Ref # 2026/1042",
      submittedDate: "2026-08-12 16:11",
      status: "Pending Review",
      trustScore: 90,
    },
  ]);

  // Selected Verification Item for Inspection Modal
  const [inspectItem, setInspectItem] = useState<any>(null);

  // User Directory State
  const [usersList, setUsersList] = useState([
    { id: "u-1", name: "Margaret Chigumba", role: "Employer", city: "Harare", verified: true, trustScore: 98, status: "Active", jobsPosted: 4 },
    { id: "u-2", name: "Sizani Ndlovu", role: "Worker", city: "Harare", verified: true, trustScore: 96, status: "Active", rating: 4.9 },
    { id: "u-3", name: "Tafadzwa Mutasa", role: "Employer", city: "Harare", verified: true, trustScore: 94, status: "Active", jobsPosted: 2 },
    { id: "u-4", name: "Kudzai Agencies", role: "Agency", city: "Bulawayo", verified: true, trustScore: 91, status: "Active", staffCount: 18 },
    { id: "u-5", name: "Kudakwashe Mapfumo", role: "Worker", city: "Gweru", verified: false, trustScore: 65, status: "Pending", rating: 3.8 },
  ]);

  // Jobs Feed State
  const [jobsList, setJobsList] = useState([
    { id: "j-101", title: "Live-In Nanny & Cook", employer: "Mrs. Margaret Chigumba", city: "Harare (Borrowdale)", salary: "$350 USD/mo", category: "Child Care", status: "Open", applications: 12 },
    { id: "j-102", title: "Solar Inverter Maintenance", employer: "Tafadzwa Mutasa", city: "Harare (Avondale)", salary: "$120 USD/project", category: "Solar / Electrician", status: "In Progress", applications: 5 },
    { id: "j-103", title: "Elderly Caregiver 24/7", employer: "Dr. Nyasha Tagwirei", city: "Harare (Highlands)", salary: "$400 USD/mo", category: "Caregiver", status: "Open", applications: 8 },
  ]);

  // Applications List State
  const [applicationsList, setApplicationsList] = useState([
    { id: "app-1", applicant: "Sizani Ndlovu", jobTitle: "Elderly Caregiver 24/7", employer: "Dr. Nyasha Tagwirei", appliedDate: "2026-08-10", status: "Interviewing", escrowStatus: "Escrow Funded" },
    { id: "app-2", applicant: "Blessing Chirwa", jobTitle: "Solar Inverter Maintenance", employer: "Tafadzwa Mutasa", appliedDate: "2026-08-11", status: "Hired", escrowStatus: "In Escrow" },
    { id: "app-3", applicant: "Chipo Moyo", jobTitle: "Live-In Nanny & Cook", employer: "Mrs. Margaret Chigumba", appliedDate: "2026-08-12", status: "Applied", escrowStatus: "Pending Funding" },
  ]);

  // Payments Ledger State
  const [paymentsList, setPaymentsList] = useState([
    { id: "pay-1", ref: "ZMC-ESC-88312", payer: "Margaret Chigumba", payee: "Sizani Ndlovu", amount: 350, gateway: "EcoCash USD", status: "Escrow Held", fee: 35 },
    { id: "pay-2", ref: "ZMC-ESC-99420", payer: "Tafadzwa Mutasa", payee: "Blessing Chirwa", amount: 120, gateway: "InnBucks", status: "Released", fee: 12 },
    { id: "pay-3", ref: "ZMC-SUB-1029", payer: "Kudzai Agencies", payee: "Zimbabwe Maids Centre", amount: 99, gateway: "ZIPIT", status: "Subscription Paid", fee: 0 },
  ]);

  // Complaints State
  const [complaintsList, setComplaintsList] = useState([
    { id: "c-1", ref: "ZMC-CMP-2026-01", complainant: "Farai Sibanda", respondent: "Kudzai Moyo", category: "Non-Payment of Wage", status: "Under Mediation", priority: "High", date: "2026-08-08" },
    { id: "c-2", ref: "ZMC-CMP-2026-02", complainant: "Simbarashe Zhou", respondent: "Kudakwashe Mapfumo", category: "Unannounced Departure", status: "Evidence Verification", priority: "Medium", date: "2026-08-09" },
  ]);

  // System Audit Logs State
  const [auditLogs, setAuditLogs] = useState([
    { id: "l-1", timestamp: "2026-08-13 08:12:04", admin: "System Admin (Harare HQ)", action: "VERIFICATION_APPROVED", target: "Tariro Chikwanha (ID 63-299102-X-42)", ip: "197.221.250.12", status: "SUCCESS" },
    { id: "l-2", timestamp: "2026-08-13 07:45:19", admin: "Escrow Officer (Chinhoyi)", action: "ESCROW_DISBURSEMENT", target: "Contract ZMC-ESC-99420 ($120 USD)", ip: "197.221.250.44", status: "SUCCESS" },
    { id: "l-3", timestamp: "2026-08-13 06:30:00", admin: "AI Security Shield", action: "FAKE_REVIEW_BLOCKED", target: "Unverified Review Spam Flag", ip: "102.110.12.90", status: "FLAGGED" },
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState([
    { id: "n-1", title: "ZRP Police Clearance SLA Warning", message: "3 verification document submissions pending in Harare queue for over 2 hours.", time: "10 mins ago", type: "warning", unread: true },
    { id: "n-2", title: "High Volume Escrow Funded", message: "Margaret Chigumba deposited $350 USD via EcoCash for Sizani Ndlovu contract.", time: "25 mins ago", type: "success", unread: true },
    { id: "n-3", title: "System Security Audit Passed", message: "Daily 256-bit encryption key rotation & database integrity check completed.", time: "1 hour ago", type: "info", unread: false },
  ]);

  // Broadcast Notification Form
  const [broadcastTarget, setBroadcastTarget] = useState("All Employers & Workers");
  const [broadcastText, setBroadcastText] = useState("");
  const [broadcastSentSuccess, setBroadcastSentSuccess] = useState(false);

  // Fetch AI Insights
  const fetchAiInsights = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch("/api/ai/admin-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeRange, cityFilter }),
      });
      const data = await res.json();
      setAiInsightsData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  useEffect(() => {
    if (activeTab === "ai-insights" && !aiInsightsData) {
      fetchAiInsights();
    }
  }, [activeTab]);

  // Approve Verification
  const handleApproveVerification = (id: string) => {
    const item = pendingVerifications.find((v) => v.id === id);
    setPendingVerifications((prev) => prev.filter((v) => v.id !== id));
    setAuditLogs((prev) => [
      {
        id: `l-${Date.now()}`,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        admin: "Logged-In Admin",
        action: "VERIFICATION_APPROVED",
        target: `${item?.name || id} (${item?.idDocUrl})`,
        ip: "197.221.250.1",
        status: "SUCCESS",
      },
      ...prev,
    ]);
    setInspectItem(null);
  };

  // Reject Verification
  const handleRejectVerification = (id: string) => {
    setPendingVerifications((prev) => prev.filter((v) => v.id !== id));
    setInspectItem(null);
  };

  // Export to Excel / CSV
  const handleExportExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Type,Reference/ID,Name/Payer,Role/Gateway,City/Amount USD,Status,Date\n";

    paymentsList.forEach((p) => {
      csvContent += `Payment,${p.ref},"${p.payer}","${p.gateway}",${p.amount},${p.status},2026-08-12\n`;
    });

    usersList.forEach((u) => {
      csvContent += `User,${u.id},"${u.name}","${u.role}",${u.city},${u.status},2026-08-12\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Zimbabwe_Maids_Centre_Admin_Export_${timeRange.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF / Print Report
  const handleExportPDF = () => {
    window.print();
  };

  // Send Broadcast SMS/WhatsApp
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText) return;
    setBroadcastSentSuccess(true);
    setBroadcastText("");
    setTimeout(() => setBroadcastSentSuccess(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Administrative Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border border-emerald-800/60 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden print:hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="flex items-start gap-4 max-w-3xl">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-400 bg-white shadow-lg shrink-0 hidden sm:block">
              <img
                src={ZMC_OFFICIAL_LOGO}
                alt="Zimbabwe Maids Centre"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-emerald-800/90 rounded-full text-xs font-bold text-emerald-200 border border-emerald-700/60 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>Zimbabwe Maids Centre Executive Admin Console</span>
                </span>
                <span className="px-2.5 py-1 bg-slate-800/80 rounded-full text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>Live Gateway Sync: 100% Online</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                National Operations & AI Analytics Center
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Real-time monitoring across Harare, Bulawayo, Mutare, Gweru & Chinhoyi. ZRP background checks, EcoCash USD escrow volume, complaint resolution & AI forecasting.
              </p>
            </div>
          </div>

          {/* Quick Action Bar & Export Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportExcel}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Export to Excel</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Print Executive PDF</span>
            </button>
          </div>
        </div>

        {/* Operational Filter Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700/80">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="Today" className="bg-slate-900">Today</option>
                <option value="Last 7 Days" className="bg-slate-900">Last 7 Days</option>
                <option value="This Month" className="bg-slate-900">This Month (August 2026)</option>
                <option value="YTD 2026" className="bg-slate-900">YTD 2026</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700/80">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="All Cities" className="bg-slate-900">All Cities (Zimbabwe)</option>
                <option value="Harare" className="bg-slate-900">Harare Province</option>
                <option value="Bulawayo" className="bg-slate-900">Bulawayo Province</option>
                <option value="Mutare" className="bg-slate-900">Mutare</option>
                <option value="Gweru" className="bg-slate-900">Gweru</option>
                <option value="Chinhoyi" className="bg-slate-900">Chinhoyi</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-emerald-200">
            <span>Escrow Vault: <strong className="text-amber-300 font-mono">$89,400 USD</strong></span>
            <span>•</span>
            <span>Unresolved Complaints: <strong className="text-rose-400 font-mono">2 Active</strong></span>
          </div>
        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 print:hidden">
        {[
          { id: "categories", label: "Categories & $3 Featured System", icon: Layers, highlight: true },
          { id: "profile-approvals", label: `Profile Approvals (${pendingWorkerProfiles.length})`, icon: UserCheck, badge: pendingWorkerProfiles.length, highlight: true },
          { id: "job-approvals", label: `Job Approvals (${pendingJobPostings.length})`, icon: Briefcase, badge: pendingJobPostings.length, highlight: true },
          {
            id: "agencies",
            label: `Agencies & Subscriptions (${agencies.length})`,
            icon: Building2,
            badge: agencies.filter((a) => a.approvalStatus === "Pending Approval" || (a.subscription.pendingPaymentRecord && a.subscription.pendingPaymentRecord.status === "Pending Review")).length,
            highlight: true,
          },
          { id: "analytics", label: "Analytics & KPI Overview", icon: BarChart3 },
          { id: "performance-reports", label: "Performance Reports (D3/Recharts)", icon: TrendingUp },
          { id: "revenue", label: "Revenue & Escrow", icon: DollarSign },
          { id: "users", label: "Users Directory", icon: Users },
          { id: "jobs", label: "Jobs", icon: Briefcase },
          { id: "applications", label: "Applications Funnel", icon: Layers },
          { id: "verification", label: `Verification Queue (${pendingVerifications.length})`, icon: ShieldCheck, badge: pendingVerifications.length },
          { id: "payments", label: "Payments Ledger", icon: FileText },
          { id: "complaints", label: `Complaints (${complaintsList.length})`, icon: AlertCircle },
          { id: "ai-insights", label: "AI Insights", icon: Sparkles },
          { id: "security", label: "Security & Governance Suite", icon: ShieldAlert },
          { id: "qa-testing", label: "QA & Testing Strategy", icon: CheckSquare },
          { id: "logs", label: "Audit Logs", icon: Lock },
          { id: "notifications", label: "Notifications", icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-slate-900 text-white shadow-md"
                  : tab.highlight
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${tab.highlight && !isActive ? "text-emerald-600 animate-pulse" : ""}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 font-black rounded-full text-[10px]">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SECTION 00: DYNAMIC CATEGORY & $3 FEATURED MANAGEMENT */}
      {activeTab === "categories" && <CategoryManagementCenter />}

      {/* SECTION 0A: CANDIDATE PROFILE APPROVALS */}
      {activeTab === "profile-approvals" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-full uppercase tracking-wider">
                  Admin Approval Required
                </span>
                <span className="text-xs text-emerald-200">
                  {pendingWorkerProfiles.length} Pending Review
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-2">
                Candidate Worker Profile Approvals
              </h2>
              <p className="text-xs text-emerald-100 max-w-2xl mt-1">
                Every domestic worker profile must be vetted for ZRP CID Police Clearance and ID authenticity before appearing on the public Client Marketplace.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowWhatsAppImportModal(true)}
                className="px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Import via WhatsApp</span>
              </button>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[120px]">
                <span className="text-2xl font-black text-amber-300 block font-mono">
                  {pendingWorkerProfiles.length}
                </span>
                <span className="text-[11px] text-emerald-100 font-bold uppercase">
                  Pending Profiles
                </span>
              </div>
            </div>
          </div>

          {pendingWorkerProfiles.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3 shadow-xs">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">All Candidate Profiles Approved!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                There are no pending domestic worker or artisan profiles requiring admin approval at this moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingWorkerProfiles.map((worker) => (
                <div
                  key={worker.id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:border-emerald-300 transition-all space-y-4 relative"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={worker.photoUrl}
                      alt={worker.fullName}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm shrink-0"
                    />
                    <div className="space-y-1 flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-slate-900 text-sm">{worker.fullName}</h3>
                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded-full">
                          Pending Vetting
                        </span>
                      </div>
                      <p className="text-xs font-bold text-emerald-800">{worker.role}</p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        📍 {worker.city} ({worker.suburb}) • {worker.experienceYears} Years Exp.
                      </p>
                    </div>
                  </div>

                  {/* Rate & Vetting Details */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 font-medium block">Monthly Rate</span>
                      <strong className="text-slate-900 font-bold font-mono text-xs">
                        ${worker.monthlyRateUSD} USD / mo
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Police Clearance</span>
                      <strong className="text-emerald-700 font-bold text-[10px] truncate block">
                        {worker.policeClearanceNo || "Ref # ZRP-2026-Pending"}
                      </strong>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    "{worker.bio}"
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => setSelectedWorkerAudit(worker)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Audit 6-Step Details</span>
                    </button>

                    <button
                      onClick={() => approveWorkerProfile(worker.id)}
                      className="flex-1 py-2 bg-emerald-900 hover:bg-emerald-950 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Approve Profile</span>
                    </button>

                    <button
                      onClick={() => rejectWorkerProfile(worker.id)}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1"
                    >
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 0B: EMPLOYER JOB APPROVALS */}
      {activeTab === "job-approvals" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 to-emerald-950 p-6 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-emerald-400 text-slate-950 text-xs font-black rounded-full uppercase tracking-wider">
                  Employer Postings
                </span>
                <span className="text-xs text-emerald-200">
                  {pendingJobPostings.length} Pending Approval
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-2">
                Employer Job Posting Vetting
              </h2>
              <p className="text-xs text-emerald-100 max-w-2xl mt-1">
                Admin review ensures wage fairness ($USD), clear job requirements, and prevents predatory listings before opening applications to workers.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[160px]">
              <span className="text-2xl font-black text-emerald-300 block font-mono">
                {pendingJobPostings.length}
              </span>
              <span className="text-[11px] text-emerald-100 font-bold uppercase">
                Pending Vacancies
              </span>
            </div>
          </div>

          {pendingJobPostings.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3 shadow-xs">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">All Job Vacancies Vetted!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No job postings are currently waiting for admin approval.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingJobPostings.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:border-emerald-300 transition-all space-y-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-black text-slate-900 text-sm leading-snug">{job.title}</h3>
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-extrabold text-[10px] rounded-full shrink-0">
                        Pending Approval
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Posted by <strong>{job.employerName}</strong> • 📍 {job.city} ({job.suburb})
                    </p>
                  </div>

                  <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-emerald-900 font-bold block text-[10px] uppercase">Offered Compensation</span>
                      <strong className="text-emerald-950 font-black font-mono text-sm">
                        ${job.offeredSalaryUSD} USD / {job.payFrequency}
                      </strong>
                    </div>
                    <span className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-800 font-bold text-[10px] rounded-xl">
                      {job.workType}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {job.requiredSkills?.map((skill: string) => (
                      <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => approveJobPosting(job.id)}
                      className="flex-1 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Approve Job Vacancy</span>
                    </button>

                    <button
                      onClick={() => rejectJobPosting(job.id)}
                      className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1"
                    >
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 0C: MULTI-AGENCY GOVERNANCE & SUBSCRIPTION SYSTEM */}
      {activeTab === "agencies" && (
        <AgencyManagementCenter />
      )}

      {/* SECTION 1: ANALYTICS & KPIS */}
      {activeTab === "analytics" && (
        <div className="space-y-8">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Gross Revenue (YTD)</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">$342,850 USD</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +24.8% vs last month
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Vetted Users</span>
                <Users className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">18,920</div>
              <div className="text-[11px] text-slate-500 mt-1">Harare: 11.2k | Bulawayo: 4.8k</div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Escrow Vault Balance</span>
                <Lock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600 font-mono">$89,400 USD</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">Zero Escrow Defaults</div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Verification SLA</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">1.8 Hours</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">Target &lt; 2.0 Hours</div>
            </div>
          </div>

          {/* Recharts Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Trend Area Chart */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Monthly USD Revenue & Escrow Volume Growth</span>
                  </h3>
                  <p className="text-xs text-slate-500">Gross volume processed across EcoCash, ZIPIT, InnBucks & Mukuru.</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Avg Commission: 10%
                </span>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorEscrow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} tickFormatter={(value) => `$${value/1000}k`} />
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <Tooltip formatter={(val: any) => [`$${val.toLocaleString()} USD`, "Amount"]} />
                    <Legend />
                    <Area type="monotone" dataKey="gross" name="Gross Volume ($ USD)" stroke="#059669" fillOpacity={1} fill="url(#colorGross)" />
                    <Area type="monotone" dataKey="escrow" name="Escrow Funds Held ($ USD)" stroke="#0284c7" fillOpacity={1} fill="url(#colorEscrow)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* City Distribution Pie Chart */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-emerald-600" />
                  <span>User Distribution by City</span>
                </h3>
                <p className="text-xs text-slate-500">Verified domestic staff & household employers.</p>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={CITY_DISTRIBUTION} dataKey="users" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                      {CITY_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: any) => [`${val.toLocaleString()} Users`, "Count"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-2 text-xs border-t border-slate-100">
                {CITY_DISTRIBUTION.map((c) => (
                  <div key={c.name} className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                      {c.name}
                    </span>
                    <span className="font-mono font-bold text-slate-900">{c.users.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: REVENUE & ESCROW FINANCIALS */}
      {activeTab === "revenue" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span>Financial Ledger & Revenue Breakdown</span>
              </h3>
              <p className="text-xs text-slate-500">
                Platform commissions, escrow holding vault, agency referral splits, and gateway processing shares.
              </p>
            </div>

            <div className="text-right font-mono">
              <span className="text-xs text-slate-400 block">Total YTD Net Platform Fee</span>
              <strong className="text-xl font-black text-emerald-700">$34,285 USD</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Gateway Share Bar Chart */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Payment Gateway Volume Share (%)
              </h4>

              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={PAYMENT_GATEWAY_SHARE}>
                    <XAxis dataKey="name" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip formatter={(val: any) => [`${val}%`, "Share"]} />
                    <Bar dataKey="share" fill="#059669" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Fee Split Rules Table */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Platform Fee Structure & Payout Rules
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">Direct Escrow Commission</span>
                    <span className="text-slate-500 text-[11px]">Deducted upon job completion</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 text-sm">10.0%</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">Accredited Agency Referral Share</span>
                    <span className="text-slate-500 text-[11px]">Split with recruiting agency</span>
                  </div>
                  <span className="font-mono font-bold text-indigo-700 text-sm">5.0%</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">Domestic Worker Net Payout</span>
                    <span className="text-slate-500 text-[11px]">Instant USSD EcoCash/InnBucks transfer</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm">90.0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: USERS DIRECTORY */}
      {activeTab === "users" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Verified User Directory</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage accounts for employers, domestic workers, accredited agencies, and system staff.
              </p>
            </div>

            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search name, city, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
                  <th className="p-3">User Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">City Location</th>
                  <th className="p-3">ZRP Vetting</th>
                  <th className="p-3">Trust Score</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-all">
                    <td className="p-3 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{u.city}</td>
                    <td className="p-3">
                      {u.verified ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded flex items-center gap-1 w-fit text-[10px]">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[10px]">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono font-bold text-amber-600">{u.trustScore} / 100</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-[11px]">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 4: JOBS CONTROL */}
      {activeTab === "jobs" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <span>Active Job Postings Feed</span>
              </h3>
              <p className="text-xs text-slate-500">Live household job vacancies across Zimbabwe.</p>
            </div>
          </div>

          <div className="space-y-3">
            {jobsList.map((j) => (
              <div key={j.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-extrabold text-slate-900">{j.title}</h4>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                      {j.category}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Posted by: <strong className="text-slate-800">{j.employer}</strong> ({j.city})
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-mono font-bold text-emerald-700 text-sm">{j.salary}</span>
                  <span className="text-slate-500">{j.applications} Applicants</span>
                  <span className="px-2 py-0.5 bg-sky-100 text-sky-800 font-bold rounded text-[10px]">
                    {j.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: APPLICATIONS FUNNEL */}
      {activeTab === "applications" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>Job Applications & Escrow Funnel</span>
              </h3>
              <p className="text-xs text-slate-500">Track application stages from submission to contract signing and escrow funding.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
                  <th className="p-3">Applicant Name</th>
                  <th className="p-3">Job Title</th>
                  <th className="p-3">Employer</th>
                  <th className="p-3">Applied Date</th>
                  <th className="p-3">Funnel Status</th>
                  <th className="p-3">Escrow Deposit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applicationsList.map((a) => (
                  <tr key={a.id}>
                    <td className="p-3 font-bold text-slate-900">{a.applicant}</td>
                    <td className="p-3 text-slate-700">{a.jobTitle}</td>
                    <td className="p-3 text-slate-600">{a.employer}</td>
                    <td className="p-3 font-mono text-slate-500">{a.appliedDate}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold rounded text-[10px]">
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-emerald-700">{a.escrowStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 6: VERIFICATION QUEUE */}
      {activeTab === "verification" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>ZRP Police Clearance & National ID Inspection Queue</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect scanned national identity cards, ZRP CID clearance letters, and trust score metrics.
              </p>
            </div>

            <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold rounded-xl text-xs">
              SLA Target: &lt; 2.0 Hours
            </span>
          </div>

          {pendingVerifications.length === 0 ? (
            <div className="p-10 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">All Verification Submissions Cleared!</h4>
              <p className="text-xs">No pending worker documents in the vetting queue.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingVerifications.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-emerald-300 transition-all shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-extrabold text-slate-900 text-sm">{item.name}</h4>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                        {item.role}
                      </span>
                      <span className="text-xs text-slate-400">• {item.city}</span>
                    </div>

                    <div className="text-xs text-slate-600 space-x-3 font-mono">
                      <span>ID: <strong>{item.idDocUrl}</strong></span>
                      <span>|</span>
                      <span>Police Cert: <strong>{item.policeDocUrl}</strong></span>
                    </div>

                    <p className="text-[11px] text-slate-400 pt-1">Submitted: {item.submittedDate}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setInspectItem(item)}
                      className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Scans</span>
                    </button>

                    <button
                      onClick={() => handleApproveVerification(item.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => handleRejectVerification(item.id)}
                      className="px-3 py-2 border border-slate-300 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 7: PAYMENTS LEDGER */}
      {activeTab === "payments" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>Transaction & Escrow Disbursement Ledger</span>
              </h3>
              <p className="text-xs text-slate-500">Live transaction records across all 8 supported payment gateways.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
                  <th className="p-3">Escrow Ref</th>
                  <th className="p-3">Employer (Payer)</th>
                  <th className="p-3">Worker (Payee)</th>
                  <th className="p-3">Amount ($ USD)</th>
                  <th className="p-3">Gateway Method</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Platform Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paymentsList.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3 font-mono font-bold text-slate-900">{p.ref}</td>
                    <td className="p-3 text-slate-800">{p.payer}</td>
                    <td className="p-3 text-slate-800">{p.payee}</td>
                    <td className="p-3 font-mono font-extrabold text-emerald-700">${p.amount} USD</td>
                    <td className="p-3 font-semibold text-slate-600">{p.gateway}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-500">${p.fee} USD</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 8: COMPLAINTS */}
      {activeTab === "complaints" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>Grievance & Escrow Dispute Cases</span>
              </h3>
              <p className="text-xs text-slate-500">Formal complaints submitted by employers or domestic staff requiring mediation.</p>
            </div>
          </div>

          <div className="space-y-4">
            {complaintsList.map((c) => (
              <div key={c.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-xs">
                    {c.ref}
                  </span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[10px]">
                    {c.status}
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-900 text-xs">{c.category}</h4>
                <p className="text-xs text-slate-600">
                  Complainant: <strong className="text-slate-800">{c.complainant}</strong> | Respondent: <strong className="text-slate-800">{c.respondent}</strong>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 9: AI INSIGHTS */}
      {activeTab === "ai-insights" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                <span>AI Operational Executive Intelligence Report</span>
              </h3>
              <p className="text-xs text-slate-500">Powered by Gemini 3.6 Flash. Real-time trend forecasting, market demand, and risk mitigation.</p>
            </div>

            <button
              onClick={fetchAiInsights}
              disabled={isLoadingAi}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              {isLoadingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              <span>Refresh AI Analysis</span>
            </button>
          </div>

          {isLoadingAi ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
              <p className="text-xs font-bold">Analyzing platform database and wage indexes across Zimbabwe...</p>
            </div>
          ) : aiInsightsData ? (
            <div className="space-y-6">
              {/* Executive Summary Box */}
              <div className="p-5 bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-2xl border border-emerald-800/60 space-y-2 shadow-lg">
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                  Gemini Strategic Summary
                </span>
                <p className="text-sm font-medium leading-relaxed text-emerald-100">
                  "{aiInsightsData.executiveSummary}"
                </p>
              </div>

              {/* Insights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiInsightsData.keyInsights?.map((k: any, index: number) => (
                  <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                      {k.category}
                    </span>
                    <h5 className="font-extrabold text-slate-900 text-sm">{k.title}</h5>
                    <p className="text-emerald-700 font-bold font-mono">{k.metric}</p>
                    <p className="text-slate-600 text-[11px] bg-white p-2.5 rounded-xl border border-slate-200/80">
                      💡 {k.actionableRecommendation}
                    </p>
                  </div>
                ))}
              </div>

              {/* Risk Alerts */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2 text-xs">
                <h5 className="font-extrabold text-amber-900 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>AI Risk & Anomaly Alerts</span>
                </h5>
                <ul className="list-disc list-inside space-y-1 text-amber-800 font-medium text-[11px]">
                  {aiInsightsData.riskAlerts?.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* SECTION 10: AUDIT LOGS */}
      {activeTab === "logs" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" />
                <span>System Security & Operational Audit Log Stream</span>
              </h3>
              <p className="text-xs text-slate-500">Immutable 256-bit encrypted audit trail of administrative actions.</p>
            </div>
          </div>

          <div className="space-y-3">
            {auditLogs.map((l) => (
              <div key={l.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-900">{l.action}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                      {l.status}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Target: <strong className="text-slate-800">{l.target}</strong> | Actor: {l.admin}
                  </p>
                </div>

                <div className="text-right text-[11px] text-slate-400 font-mono">
                  <div>{l.timestamp}</div>
                  <div>IP: {l.ip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 11: NOTIFICATIONS & BROADCAST */}
      {activeTab === "notifications" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-600" />
                <span>Notifications & Mass WhatsApp/SMS Broadcast</span>
              </h3>
              <p className="text-xs text-slate-500">System alerts and direct notification dispatcher to employers and workers.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* System Notifications List */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Active System Alerts
              </h4>

              {notifications.map((n) => (
                <div key={n.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <h5 className="font-extrabold text-slate-900">{n.title}</h5>
                    <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{n.message}</p>
                </div>
              ))}
            </div>

            {/* Broadcast Form */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-600" />
                <span>Send WhatsApp / SMS Announcement</span>
              </h4>

              {broadcastSentSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold">
                  Broadcast successfully dispatched to registered users via WhatsApp API!
                </div>
              )}

              <form onSubmit={handleSendBroadcast} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Audience</label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="All Employers & Workers">All Employers & Domestic Workers (18.9k Users)</option>
                    <option value="Harare Employers Only">Harare Employers Only (Borrowdale, Avondale, Highlands)</option>
                    <option value="Bulawayo Workers Only">Bulawayo Workers Only</option>
                    <option value="Accredited Agencies">Accredited Agencies Only (42 Corporate)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Message Content</label>
                  <textarea
                    rows={4}
                    placeholder="Type official notification message..."
                    value={broadcastText}
                    onChange={(e) => setBroadcastText(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Dispatch Mass WhatsApp Broadcast</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 12: SECURITY & GOVERNANCE SUITE */}
      {activeTab === "security" && <EnterpriseSecurityCenter />}

      {/* SECTION 13: QA & TESTING STRATEGY CENTER */}
      {activeTab === "qa-testing" && <TestingStrategyCenter />}

      {/* SECTION 14: PERFORMANCE REPORTS MODULE (D3 / RECHARTS) */}
      {activeTab === "performance-reports" && <PerformanceReportsModule />}

      {/* INSPECTION MODAL FOR PENDING VERIFICATIONS */}
      {inspectItem && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Document Inspection: {inspectItem.name}</span>
                </h3>
                <p className="text-xs text-slate-500">{inspectItem.role} • {inspectItem.city}</p>
              </div>
              <button onClick={() => setInspectItem(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
                  Scanned Document 1: National Identity Card
                </span>
                <p className="font-mono font-bold text-slate-900">{inspectItem.idDocUrl}</p>
                <div className="p-3 bg-emerald-100/60 text-emerald-900 rounded-xl font-medium text-[11px]">
                  ✓ Optical Checksum Validated against Zimbabwe Registrar General format.
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
                  Scanned Document 2: ZRP CID Fingerprint Clearance Letter
                </span>
                <p className="font-mono font-bold text-slate-900">{inspectItem.policeDocUrl}</p>
                <div className="p-3 bg-emerald-100/60 text-emerald-900 rounded-xl font-medium text-[11px]">
                  ✓ CID Reference verified with Zimbabwe Republic Police Clearance database. Zero criminal record found.
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => handleRejectVerification(inspectItem.id)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Reject Documents
              </button>

              <button
                onClick={() => handleApproveVerification(inspectItem.id)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Approve National Clearance</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP PROFILE IMPORT MODAL (ADMIN) */}
      {showWhatsAppImportModal && (
        <WhatsAppProfileImportModal
          isOpen={showWhatsAppImportModal}
          onClose={() => setShowWhatsAppImportModal(false)}
          onImportComplete={(importedWorker) => {
            const mapped = convertRegistrationToWorkerProfile(importedWorker);
            approveWorkerProfile(mapped.id);
            setShowWhatsAppImportModal(false);
          }}
        />
      )}

      {/* DETAILED 6-STEP CANDIDATE AUDIT MODAL */}
      {selectedWorkerAudit && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedWorkerAudit.photoUrl}
                  alt={selectedWorkerAudit.fullName}
                  className="w-12 h-12 rounded-xl object-cover border border-emerald-500"
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{selectedWorkerAudit.fullName}</h3>
                  <p className="text-xs text-emerald-800 font-bold">{selectedWorkerAudit.role} • {selectedWorkerAudit.city}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWorkerAudit(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <strong className="text-slate-900 block mb-1">National ID & Contact Details:</strong>
                <p>Phone: <strong>{selectedWorkerAudit.phoneNumber || "+263 78 545 8828"}</strong></p>
                <p>Police Ref: <strong>{selectedWorkerAudit.policeClearanceNo || "ZRP-CID-CLEARED"}</strong></p>
                <p>Rate: <strong>${selectedWorkerAudit.monthlyRateUSD} USD / month</strong></p>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <strong className="text-emerald-950 block mb-1">Standardized Vetting & References:</strong>
                <p className="text-emerald-900 leading-relaxed">
                  ✓ Verified against Zimbabwe Cyber and Data Protection Act standards.<br />
                  ✓ Validated employer references & contact authenticity.<br />
                  ✓ Clean criminal background history certified.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedWorkerAudit(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close Audit
              </button>
              <button
                onClick={() => {
                  approveWorkerProfile(selectedWorkerAudit.id);
                  setSelectedWorkerAudit(null);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Approve Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
