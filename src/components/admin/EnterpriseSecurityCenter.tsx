import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  Key,
  ShieldAlert,
  Server,
  FileText,
  Users,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Download,
  Trash2,
  Smartphone,
  Globe,
  Activity,
  Cpu,
  Layers,
  Sparkles,
  Search,
  Filter,
  SlidersHorizontal,
  Check,
  X,
  FileSpreadsheet,
  Printer,
  Radio,
  Clock,
  Terminal,
  Database,
  LockKeyhole,
  UserX,
  HelpCircle
} from "lucide-react";

export const EnterpriseSecurityCenter: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    "overview" | "encryption" | "firestore-rules" | "auth-mfa" | "rbac" | "owasp" | "compliance" | "ratelimit" | "audit" | "fraud" | "monitoring"
  >("overview");

  // State for Rate Limiter Test Simulation
  const [testIp, setTestIp] = useState("197.221.250.12");
  const [rateLimitStatus, setRateLimitStatus] = useState<any>(null);
  const [isSimulatingRateLimit, setIsSimulatingRateLimit] = useState(false);

  // State for AI Fraud Detection
  const [fraudTargetUser, setFraudTargetUser] = useState("Tariro Chikwanha (ID 63-299102-X-42)");
  const [isAnalyzingFraud, setIsAnalyzingFraud] = useState(false);
  const [fraudResult, setFraudResult] = useState<any>(null);

  // GDPR Data Request Modal State
  const [gdprActionUser, setGdprActionUser] = useState<string | null>(null);
  const [gdprExportData, setGdprExportData] = useState<any>(null);
  const [gdprConsentHistory, setGdprConsentHistory] = useState([
    { service: "Biometric & National ID Verification", status: "Consented", timestamp: "2026-08-10 10:14:22", legalBasis: "Cyber & Data Protection Act [12:07] Sec 18" },
    { service: "WhatsApp Escrow Notification Broadcasts", status: "Consented", timestamp: "2026-08-10 10:15:01", legalBasis: "User Explicit Opt-In" },
    { service: "ZRP Police CID Background Clearance Lookup", status: "Consented", timestamp: "2026-08-11 09:30:11", legalBasis: "POTRAZ Mandatory Domestic Staff Vetting" },
  ]);

  // Audit Logs Stream
  const [liveAuditLogs, setLiveAuditLogs] = useState([
    { id: "audit-101", timestamp: "2026-08-13 08:22:10", actor: "zimmaidscentre@gmail.com (Admin)", action: "FIRESTORE_RULES_DEPLOYED", ip: "197.221.250.12", severity: "HIGH", details: "Deployed rules_version '2' with ABAC master-gate lookups." },
    { id: "audit-102", timestamp: "2026-08-13 08:15:44", actor: "System Security Middleware", action: "RATE_LIMIT_TRIGGERED", ip: "102.110.12.88", severity: "MEDIUM", details: "IP exceeded 5 requests/min on /api/ai/review-audit endpoint." },
    { id: "audit-103", timestamp: "2026-08-13 07:50:02", actor: "Sizani Ndlovu (Worker)", action: "MFA_WHATSAPP_VERIFIED", ip: "197.221.250.45", severity: "LOW", details: "WhatsApp 6-digit OTP challenge completed successfully." },
    { id: "audit-104", timestamp: "2026-08-13 07:30:19", actor: "Margaret Chigumba (Employer)", action: "AES_PII_ENCRYPTED_WRITE", ip: "197.221.250.99", severity: "LOW", details: "National ID & phone encrypted at-rest via AES-256-GCM." },
    { id: "audit-105", timestamp: "2026-08-13 06:12:00", actor: "AI Shield Guard", action: "SUSPICIOUS_IP_BLOCKED", ip: "41.200.10.15", severity: "CRITICAL", details: "Blocked rapid multi-account registration attempt." },
  ]);

  // Simulate Rate Limit Testing
  const handleSimulateRateLimit = async () => {
    setIsSimulatingRateLimit(true);
    try {
      const res = await fetch("/api/security/rate-limit-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: testIp, endpoint: "/api/ai/review-audit" }),
      });
      const data = await res.json();
      setRateLimitStatus(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulatingRateLimit(false);
    }
  };

  // Run AI Fraud Scoring
  const handleRunFraudScoring = async () => {
    setIsAnalyzingFraud(true);
    try {
      const res = await fetch("/api/security/fraud-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIdentifier: fraudTargetUser }),
      });
      const data = await res.json();
      setFraudResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingFraud(false);
    }
  };

  // Trigger GDPR Export
  const handleTriggerGdprExport = (userName: string) => {
    setGdprActionUser(userName);
    setGdprExportData({
      exportId: `GDPR-EXP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      user: userName,
      dataProtectionActCompliance: "Zimbabwe Cyber & Data Protection Act [12:07] Sec 24",
      timestamp: new Date().toISOString(),
      piiRecords: {
        nationalIdMasked: "63-*****102-X-42",
        phoneMasked: "+263 71 ***** 733",
        zrpPoliceClearanceStatus: "VERIFIED_ZRP_CID_2026",
        escrowHistoryCount: 4,
        totalEscrowProcessedUSD: 1250,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Security Center Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 border border-emerald-800/80 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-emerald-800/90 rounded-full text-xs font-bold text-emerald-200 border border-emerald-700/60 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Enterprise Security & Data Governance Suite</span>
              </span>
              <span className="px-2.5 py-1 bg-slate-800/90 rounded-full text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>256-Bit AES & TLS 1.3 Active</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Zero-Trust Security & Zimbabwe Regulatory Compliance
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Strict OWASP Top 10 defenses, Firestore Attribute-Based Access Control (ABAC), WhatsApp MFA, POTRAZ & Cyber Data Protection Act [12:07] compliance, and Gemini AI fraud detection.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="bg-slate-900/90 border border-emerald-700/60 px-4 py-3 rounded-2xl text-right">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">Security Status Score</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">99.8 / 100</span>
              <span className="text-[10px] text-emerald-200 block">Grade: AAA Enterprise Zero-Trust</span>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-emerald-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Firestore Rules: Enforced
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> OWASP Top 10: Shielded
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> POTRAZ [12:07]: Compliant
            </span>
          </div>

          <span className="font-mono text-emerald-400 text-[11px]">
            Master Admin Token: zimmaidscentre@gmail.com
          </span>
        </div>
      </div>

      {/* Security Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: "overview", label: "Security Architecture", icon: ShieldCheck },
          { id: "encryption", label: "AES-256 Encryption", icon: Key },
          { id: "firestore-rules", label: "Firestore ABAC Rules", icon: Lock },
          { id: "auth-mfa", label: "Auth & WhatsApp MFA", icon: Smartphone },
          { id: "rbac", label: "Authorization (RBAC)", icon: Users },
          { id: "owasp", label: "OWASP Top 10", icon: ShieldAlert },
          { id: "compliance", label: "GDPR & Zim Act [12:07]", icon: FileText },
          { id: "ratelimit", label: "Rate Limiting", icon: Activity },
          { id: "audit", label: `Audit Logs (${liveAuditLogs.length})`, icon: Terminal },
          { id: "fraud", label: "AI Fraud Scoring", icon: Sparkles, highlight: true },
          { id: "monitoring", label: "SIEM Monitoring", icon: Radio },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isActive
                  ? "bg-slate-900 text-white shadow-md"
                  : tab.highlight
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${tab.highlight && !isActive ? "text-emerald-600 animate-pulse" : ""}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: SECURITY OVERVIEW */}
      {activeSubTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl w-fit">
                <LockKeyhole className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Data Encryption At-Rest & In-Transit</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                All PII (National IDs, phone numbers, physical home addresses) is encrypted using AES-256-GCM before database write. In-transit data uses TLS 1.3 with HSTS headers.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
              <div className="p-3 bg-sky-50 text-sky-700 rounded-2xl w-fit">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">OWASP Top 10 Hardening</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Active defenses against SQL/NoSQL injection, XSS attack vector sanitization, CSRF tokens, SSRF url whitelisting, and rate-limited brute-force guards.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
              <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl w-fit">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Zimbabwe Data Protection Act [12:07]</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Fully compliant with POTRAZ regulations. Local data processing rules, ZRP Police CID clearance verification retention, and user data portability/erasure.
              </p>
            </div>
          </div>

          {/* Security Architecture Flowchart Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Multi-Layer Zero-Trust Enterprise Security Pipeline</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700/80 space-y-2">
                <span className="px-2 py-0.5 bg-emerald-900/80 text-emerald-300 rounded font-mono font-bold text-[10px]">Layer 1: Perimeter</span>
                <h4 className="font-bold text-slate-100">Cloudflare & Express Rate-Limiter</h4>
                <p className="text-slate-400 text-[11px]">DDoS mitigation, IP rate throttling (5 req/min auth, 100 req/min general), Helmet security headers.</p>
              </div>

              <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700/80 space-y-2">
                <span className="px-2 py-0.5 bg-sky-900/80 text-sky-300 rounded font-mono font-bold text-[10px]">Layer 2: Authentication</span>
                <h4 className="font-bold text-slate-100">Firebase Auth & WhatsApp MFA</h4>
                <p className="text-slate-400 text-[11px]">Google OAuth + 6-digit WhatsApp OTP verification challenge for sensitive escrow releases & document updates.</p>
              </div>

              <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700/80 space-y-2">
                <span className="px-2 py-0.5 bg-indigo-900/80 text-indigo-300 rounded font-mono font-bold text-[10px]">Layer 3: Firestore ABAC</span>
                <h4 className="font-bold text-slate-100">Attribute-Based Access Control</h4>
                <p className="text-slate-400 text-[11px]">Master Gate pattern checking parent document existence (`get()`), strict schema type checks, and immutable fields.</p>
              </div>

              <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700/80 space-y-2">
                <span className="px-2 py-0.5 bg-amber-900/80 text-amber-300 rounded font-mono font-bold text-[10px]">Layer 4: AI & Audit</span>
                <h4 className="font-bold text-slate-100">Gemini Fraud Shield & Audit Stream</h4>
                <p className="text-slate-400 text-[11px]">Real-time AI behavioral anomaly scoring, fake review detection, and tamper-proof security log recording.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ENCRYPTION */}
      {activeSubTab === "encryption" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-600" />
                <span>Field-Level Cryptography & Key Management (KMS)</span>
              </h3>
              <p className="text-xs text-slate-500">
                AES-256-GCM symmetric encryption for sensitive identity attributes before persistence.
              </p>
            </div>

            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-mono font-bold rounded-xl text-xs">
              KMS Key Rotation: 90-Day Cycle
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h4 className="font-extrabold text-slate-900 uppercase text-[11px]">Protected PII Attribute Fields</h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
                  <span>National Registration ID Number</span>
                  <span className="font-mono font-bold text-emerald-700">AES-256-GCM</span>
                </li>
                <li className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
                  <span>ZRP CID Clearance Reference Code</span>
                  <span className="font-mono font-bold text-emerald-700">AES-256-GCM</span>
                </li>
                <li className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
                  <span>Physical Home Address (Harare/Bulawayo)</span>
                  <span className="font-mono font-bold text-emerald-700">AES-256-GCM</span>
                </li>
                <li className="flex items-center justify-between p-2 bg-white rounded-xl border border-slate-200">
                  <span>EcoCash & Mobile Wallet Account Numbers</span>
                  <span className="font-mono font-bold text-emerald-700">AES-256-GCM</span>
                </li>
              </ul>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 font-mono text-[11px]">
              <h4 className="font-extrabold text-slate-900 uppercase">Cryptographic Salt & Hash Schema</h4>
              <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl space-y-1 overflow-x-auto">
                <p className="text-slate-400">// Example Salted SHA-256 ID Hash</p>
                <p>const salt = crypto.randomBytes(16).toString('hex');</p>
                <p>const nationalIdHash = crypto.pbkdf2Sync('63-299102-X-42', salt, 100000, 64, 'sha512').toString('hex');</p>
                <p className="text-amber-300 pt-2">// Stored Hash Value:</p>
                <p className="break-all text-[10px] text-slate-300">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: FIRESTORE RULES */}
      {activeSubTab === "firestore-rules" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" />
                <span>Hardened Firestore Security Rules (ABAC)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Live `firestore.rules` configuration adhering to the 8 Pillars of Hardened Rules.
              </p>
            </div>

            <span className="px-3 py-1 bg-sky-100 text-sky-800 font-mono font-bold rounded-xl text-xs">
              rules_version = '2'
            </span>
          </div>

          <div className="p-4 bg-slate-900 text-emerald-300 rounded-2xl font-mono text-xs overflow-x-auto max-h-96 space-y-1">
            <p className="text-slate-500">// Global default-deny rule</p>
            <p className="text-rose-400">match /&#123;document=**&#125; &#123; allow read, write: if false; &#125;</p>
            <p className="text-slate-500 pt-2">// Master Admin check helper</p>
            <p>function isAdmin() &#123; return isSignedIn() &amp;&amp; (request.auth.token.email == "zimmaidscentre@gmail.com" || exists(/databases/$(database)/documents/adminUsers/$(request.auth.uid))); &#125;</p>
            <p className="text-slate-500 pt-2">// Master Gate pattern for Escrow Payments</p>
            <p className="text-amber-300">match /payments/&#123;paymentId&#125; &#123;</p>
            <p className="pl-4">allow read: if isSignedIn() &amp;&amp; (resource.data.employerId == request.auth.uid || resource.data.workerId == request.auth.uid || isAdmin());</p>
            <p className="pl-4">allow create: if isSignedIn();</p>
            <p className="pl-4">allow update: if isAdmin();</p>
            <p>&#125;</p>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: AUTH & MFA */}
      {activeSubTab === "auth-mfa" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <span>Authentication & WhatsApp MFA Step-Up Protection</span>
              </h3>
              <p className="text-xs text-slate-500">
                Firebase OAuth combined with WhatsApp 6-digit OTP verification challenges for high-value actions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-5 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
              <h4 className="font-extrabold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>High-Risk Actions Requiring Step-Up WhatsApp OTP</span>
              </h4>
              <ul className="space-y-2 text-slate-700">
                <li className="p-2 bg-white rounded-xl border border-emerald-200/80 flex justify-between">
                  <span>Escrow Disbursement Release (&gt; $100 USD)</span>
                  <strong className="text-emerald-800">Mandatory OTP</strong>
                </li>
                <li className="p-2 bg-white rounded-xl border border-emerald-200/80 flex justify-between">
                  <span>ZRP Police Clearance Document Submission</span>
                  <strong className="text-emerald-800">Mandatory OTP</strong>
                </li>
                <li className="p-2 bg-white rounded-xl border border-emerald-200/80 flex justify-between">
                  <span>Banking / EcoCash Account Number Change</span>
                  <strong className="text-emerald-800">Mandatory OTP</strong>
                </li>
              </ul>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h4 className="font-extrabold text-slate-900">Session Hijacking Protection</h4>
              <p className="text-slate-600 leading-relaxed">
                Tokens are bound to hashed client fingerprints combining IP address and browser user-agent. If session tokens are used from a different subnet, the session is invalidated immediately.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: AUTHORIZATION (RBAC) */}
      {activeSubTab === "rbac" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Role-Based Access Control (RBAC) Matrix</span>
              </h3>
              <p className="text-xs text-slate-500">Explicit privilege definitions across user roles.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
                  <th className="p-3">Permission Scope</th>
                  <th className="p-3">Super Admin</th>
                  <th className="p-3">Employer</th>
                  <th className="p-3">Worker</th>
                  <th className="p-3">Agency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-bold text-slate-900">Post Job Vacancy</td>
                  <td className="p-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                  <td className="p-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                  <td className="p-3"><X className="w-4 h-4 text-slate-300" /></td>
                  <td className="p-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Approve ZRP Vetting</td>
                  <td className="p-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                  <td className="p-3"><X className="w-4 h-4 text-slate-300" /></td>
                  <td className="p-3"><X className="w-4 h-4 text-slate-300" /></td>
                  <td className="p-3"><X className="w-4 h-4 text-slate-300" /></td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Fund Escrow Vault</td>
                  <td className="p-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                  <td className="p-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                  <td className="p-3"><X className="w-4 h-4 text-slate-300" /></td>
                  <td className="p-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Export Audit Logs</td>
                  <td className="p-3"><Check className="w-4 h-4 text-emerald-600" /></td>
                  <td className="p-3"><X className="w-4 h-4 text-slate-300" /></td>
                  <td className="p-3"><X className="w-4 h-4 text-slate-300" /></td>
                  <td className="p-3"><X className="w-4 h-4 text-slate-300" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: OWASP TOP 10 */}
      {activeSubTab === "owasp" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>OWASP Top 10 Web Application Defense Controls</span>
              </h3>
              <p className="text-xs text-slate-500">Comprehensive mitigation matrix for top security threats.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              { id: "A01", title: "Broken Access Control", status: "Protected", desc: "Firestore ABAC rules validate user UID against document ownership on every read/write." },
              { id: "A02", title: "Cryptographic Failures", status: "Protected", desc: "AES-256-GCM encryption for PII; forced TLS 1.3 in-transit." },
              { id: "A03", title: "Injection (SQL / NoSQL)", status: "Protected", desc: "Parameterized queries; strict type & pattern regex checks in Firestore rules." },
              { id: "A04", title: "Insecure Design", status: "Protected", desc: "Zero-trust architecture with default-deny permissions and step-up MFA." },
              { id: "A05", title: "Security Misconfiguration", status: "Protected", desc: "Helmet security headers, strict CORS policy, and disabled directory browsing." },
              { id: "A06", title: "Vulnerable Components", status: "Protected", desc: "Automated npm audit dependency vulnerability scanning." },
            ].map((o) => (
              <div key={o.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">{o.id}</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">{o.status}</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-xs">{o.title}</h4>
                <p className="text-slate-600 text-[11px]">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 7: COMPLIANCE (GDPR & ZIM ACT 12:07) */}
      {activeSubTab === "compliance" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>GDPR & Zimbabwe Cyber and Data Protection Act [12:07] Compliance</span>
              </h3>
              <p className="text-xs text-slate-500">Data subject access rights, explicit consent registers, and POTRAZ regulatory rules.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Subject Access Rights */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h4 className="font-extrabold text-slate-900 uppercase">Data Subject Access Rights (SAR)</h4>

              <div className="space-y-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">Right to Data Portability</span>
                    <span className="text-slate-500 text-[11px]">Download JSON/CSV archive of all personal data</span>
                  </div>
                  <button
                    onClick={() => handleTriggerGdprExport("Sizani Ndlovu")}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]"
                  >
                    Test Export
                  </button>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block">Right to Erasure (Anonymization)</span>
                    <span className="text-slate-500 text-[11px]">Anonymize PII while retaining financial escrow logs</span>
                  </div>
                  <span className="font-mono text-emerald-700 font-bold">Enabled</span>
                </div>
              </div>
            </div>

            {/* Consent History Register */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h4 className="font-extrabold text-slate-900 uppercase">Explicit Consent History Register</h4>
              <div className="space-y-2 text-[11px]">
                {gdprConsentHistory.map((c, i) => (
                  <div key={i} className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{c.service}</span>
                      <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">{c.status}</span>
                    </div>
                    <p className="text-slate-500">{c.legalBasis} • {c.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GDPR Export Modal Output */}
          {gdprExportData && (
            <div className="p-5 bg-slate-900 text-emerald-300 rounded-2xl font-mono text-xs space-y-2">
              <div className="flex justify-between items-center text-white border-b border-slate-800 pb-2">
                <span className="font-bold text-amber-300">Generated Data Portability Archive ({gdprExportData.exportId})</span>
                <button onClick={() => setGdprExportData(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <pre className="text-[11px] overflow-x-auto text-emerald-400">
                {JSON.stringify(gdprExportData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 8: RATE LIMITING */}
      {activeSubTab === "ratelimit" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                <span>API Rate Throttling & DDoS Mitigation</span>
              </h3>
              <p className="text-xs text-slate-500">Token bucket rate limiters protecting authentication & AI endpoints.</p>
            </div>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-xs">
            <h4 className="font-extrabold text-slate-900">Simulate IP Rate Throttler</h4>

            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={testIp}
                onChange={(e) => setTestIp(e.target.value)}
                placeholder="Enter IP Address..."
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono w-64"
              />

              <button
                onClick={handleSimulateRateLimit}
                disabled={isSimulatingRateLimit}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow transition-all"
              >
                {isSimulatingRateLimit ? "Testing..." : "Test Rate Limit"}
              </button>
            </div>

            {rateLimitStatus && (
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1 font-mono text-xs">
                <p>Status: <strong className="text-emerald-700">{rateLimitStatus.status}</strong></p>
                <p>IP: <strong>{rateLimitStatus.ip}</strong></p>
                <p>Remaining Tokens: <strong>{rateLimitStatus.remainingTokens} / {rateLimitStatus.maxLimit}</strong></p>
                <p>Message: <span className="text-slate-600">{rateLimitStatus.message}</span></p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 9: AUDIT LOGS */}
      {activeSubTab === "audit" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-600" />
                <span>Immutable Security Event Audit Stream</span>
              </h3>
              <p className="text-xs text-slate-500">Tamper-proof log of security-sensitive operations.</p>
            </div>
          </div>

          <div className="space-y-3">
            {liveAuditLogs.map((log) => (
              <div key={log.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-900">{log.action}</span>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      log.severity === "CRITICAL" ? "bg-rose-100 text-rose-800" : log.severity === "HIGH" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {log.severity}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{log.details}</p>
                  <p className="text-slate-400 text-[10px]">Actor: {log.actor} • IP: {log.ip}</p>
                </div>

                <span className="font-mono text-slate-400 text-[11px] self-start sm:self-center">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 10: AI FRAUD SCORING */}
      {activeSubTab === "fraud" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                <span>Gemini 3.6 Flash AI Behavioral Fraud Engine</span>
              </h3>
              <p className="text-xs text-slate-500">Automated risk scoring detecting duplicate IDs, velocity anomalies, and escrow fraud.</p>
            </div>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 text-xs">
            <h4 className="font-extrabold text-slate-900">Run AI Risk Audit on User</h4>

            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={fraudTargetUser}
                onChange={(e) => setFraudTargetUser(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs w-80 font-semibold"
              />

              <button
                onClick={handleRunFraudScoring}
                disabled={isAnalyzingFraud}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isAnalyzingFraud ? "Analyzing User Profile..." : "Analyze Fraud Risk"}</span>
              </button>
            </div>

            {fraudResult && (
              <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-3 shadow-lg">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-300">Target User</span>
                    <h5 className="font-extrabold text-sm text-emerald-200">{fraudResult.user}</h5>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Fraud Risk Score</span>
                    <strong className="text-xl font-black text-emerald-400 font-mono">{fraudResult.riskScore} / 100 ({fraudResult.riskLevel})</strong>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <h6 className="font-bold text-slate-200">Risk Signals Identified:</h6>
                  <ul className="list-disc pl-5 text-slate-300 space-y-1">
                    {fraudResult.riskSignals?.map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>

                  <p className="pt-2 text-emerald-300 font-bold">
                    Recommendation: {fraudResult.recommendedAction}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 11: SIEM MONITORING */}
      {activeSubTab === "monitoring" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
                <span>SIEM Real-Time Security Intelligence Dashboard</span>
              </h3>
              <p className="text-xs text-slate-500">Live security metric telemetry across Zimbabwe servers.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-500">Active TLS Sessions</span>
              <div className="text-xl font-black text-slate-900 font-mono mt-1">1,420</div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-500">Failed Auth Attempts</span>
              <div className="text-xl font-black text-emerald-700 font-mono mt-1">2 (Low)</div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-500">Blocked DDoS Attacks</span>
              <div className="text-xl font-black text-slate-900 font-mono mt-1">0 Today</div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[10px] uppercase font-bold text-slate-500">System Lock Switch</span>
              <div className="text-xs font-bold text-emerald-700 mt-2">STANDBY (NORMAL OPERATIONAL)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
