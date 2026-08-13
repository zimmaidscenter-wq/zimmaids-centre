import React, { useState } from "react";
import { MermaidDiagram } from "../MermaidDiagram";
import {
  Compass,
  Navigation,
  Smartphone,
  Menu,
  Link,
  ArrowLeft,
  ShieldCheck,
  RotateCcw,
  Copy,
  Check,
  Layers,
  Sparkles,
  Users,
  Eye,
  UserCheck,
  Briefcase,
  Headphones,
  Award,
  DollarSign,
  Crown,
  Lock,
  ExternalLink,
  LayoutGrid,
  ChevronRight
} from "lucide-react";

export const NavigationFlowViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "graph" | "bottom-nav" | "drawer" | "deep-linking" | "back-nav" | "rbac-routes" | "state-preservation"
  >("graph");

  const [copied, setCopied] = useState(false);

  // Mermaid Navigation Graph Chart
  const mainNavigationGraphChart = `
graph TD
  %% Entry & Onboarding Stack
  Splash[Splash Screen\n/splash] --> Onboarding[Onboarding Carousel\n/onboarding]
  Onboarding --> AuthChoice{Authenticated?}
  AuthChoice -- No --> Login[Login / Phone OTP\n/login]
  Login --> Register[Registration & Persona Select\n/register]
  
  %% Role Based Guard Engine
  AuthChoice -- Yes --> RouteGuard{RBAC Guard Check}
  Register --> RouteGuard
  
  %% Role Routes Routing
  RouteGuard -- Role: Guest --> GuestHome[Guest Directory\n/guest/explore]
  RouteGuard -- Role: Worker --> WorkerTabs[Worker Bottom Nav Shell]
  RouteGuard -- Role: Employer --> EmployerTabs[Employer Bottom Nav Shell]
  RouteGuard -- Role: Admin / Staff --> StaffTabs[Staff Operations Portal Shell]
  
  %% Worker Shell Screens
  subgraph Worker_Bottom_Nav [Worker App Shell]
    WorkerTabs --> W1[Jobs Search\n/worker/jobs]
    WorkerTabs --> W2[My Applications\n/worker/applications]
    WorkerTabs --> W3[Wallet & Escrow\n/worker/wallet]
    WorkerTabs --> W4[Chat Threads\n/worker/messages]
    WorkerTabs --> W5[Profile & ID Vetting\n/worker/profile]
  end
  
  %% Employer Shell Screens
  subgraph Employer_Bottom_Nav [Employer App Shell]
    EmployerTabs --> E1[Directory & Hire\n/employer/search]
    EmployerTabs --> E2[My Postings\n/employer/vacancies]
    EmployerTabs --> E3[Escrow Ledger\n/employer/escrow]
    EmployerTabs --> E4[Candidate Chats\n/employer/messages]
    EmployerTabs --> E5[Household Profile\n/employer/profile]
  end
  
  %% Staff Operations Shell Screens
  subgraph Staff_Bottom_Nav [Staff Admin Shell]
    StaffTabs --> S1[Admin Overview\n/admin/overview]
    StaffTabs --> S2[Verification Queue\n/admin/verifications]
    StaffTabs --> S3[Escrow Finance\n/admin/finance]
    StaffTabs --> S4[Disputes & Tickets\n/admin/disputes]
    StaffTabs --> S5[RBAC Permissions\n/admin/rbac]
  end

  %% Deep Links & Modals Overlays
  subgraph Deep_Link_Modals [Deep Link Intercepts & Overlays]
    DeepLinkJob[zmc://job/:jobId] -. Deferred Auth .-> W1
    DeepLinkWorker[zmc://worker/:workerId] -. Direct Route .-> E1
    DeepLinkEscrow[zmc://escrow/:escrowId] -. Guarded Route .-> E3
    EscrowModal[Escrow Deposit Modal] -. Overlay .-> E3
    ChatModal[Live Chat Window] -. Overlay .-> W4
  end

  %% Drawer Overlay Stack
  Drawer[Navigation Drawer] -. Menu Toggle .-> WorkerTabs
  Drawer -. Menu Toggle .-> EmployerTabs
  Drawer -. Menu Toggle .-> StaffTabs
  Drawer --> Settings[Account Settings\n/settings]
  Drawer --> Help[WhatsApp Support +236713933733\n/help]
  Drawer --> Training[Vocational Academy\n/training]
`;

  // Deep Linking Flow Chart
  const deepLinkingChart = `
sequenceDiagram
  autonumber
  actor User as Web / SMS Visitor
  participant App as Flutter / Web App Runtime
  participant Guard as DeepLink & Auth Guard
  participant Router as State Preservation Router
  participant Screen as Target Destination Screen

  User->>App: Clicks URL (e.g. zmc://job/job-102 or https://zimmaidscentre.co.zw/worker/w-88)
  App->>Guard: Parse Incoming URI & Extract Query Params
  
  alt User is Authenticated
    Guard->>Router: Route Validated -> Push Screen
    Router->>Screen: Render Target (e.g. Job Details)
  else Unauthenticated & Public Route
    Guard->>Router: Allow Public View Mode
    Router->>Screen: Render Worker Card / Job Preview
  else Unauthenticated & Protected Route
    Guard->>Router: Cache Target Route in Session Storage
    Router->>App: Redirect to Login Screen (/login?redirect=...)
    User->>App: Complete Phone OTP Verification
    App->>Router: Auth Succeeded -> Restore Cached Route
    Router->>Screen: Push Target Destination (/escrow/esc-903)
  end
`;

  // Back Stack & State Preservation Chart
  const statePreservationChart = `
stateDiagram-v2
  [*] --> ActiveSession: App Launch
  
  state ActiveSession {
    [*] --> ScreenRendered
    ScreenRendered --> UserTyping: Input Form Entry
    UserTyping --> LocalDraftState: Auto-Save State to Storage
    
    state MemoryEvictionScenario {
      LocalDraftState --> AppBackgrounded: OS System Eviction
      AppBackgrounded --> AppRecreated: User Restores App
      AppRecreated --> LocalDraftState: Rehydrate State Keys
    }
  }

  state StackManagement {
    LoginScreen --> MainTabs: Successful Login
    MainTabs --> LoginScreen: Clear Back Stack on Logout (popUntilRoot)
    ModalSheet --> MainTabs: System Back / Edge Swipe Dismiss
  }
`;

  const handleCopyJSON = () => {
    const navSpec = {
      scheme: "zmc://",
      domain: "https://zimmaidscentre.co.zw",
      routesCount: 18,
      rolesSupported: 9,
      deepLinks: [
        { path: "zmc://job/:jobId", description: "Direct job vacancy detail card" },
        { path: "zmc://worker/:workerId", description: "Worker public profile and audio bio" },
        { path: "zmc://escrow/:escrowId", description: "Escrow payment vault deposit" },
        { path: "zmc://chat/:threadId", description: "Direct messaging thread" },
        { path: "zmc://verify/:docId", description: "Verification officer audit panel" }
      ],
      bottomNavItems: {
        worker: ["Jobs", "Applications", "Wallet", "Messages", "Profile"],
        employer: ["Directory", "Vacancies", "Escrow", "Messages", "Household"],
        staff: ["Overview", "Queue", "Finance", "Disputes", "RBAC"]
      }
    };
    navigator.clipboard.writeText(JSON.stringify(navSpec, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-800/40 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-teal-900/80 border border-teal-700/60 rounded-full text-xs text-teal-200 font-semibold mb-2">
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>Material Design 3 App Navigation & Deep Link Flow</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Zimbabwe Maids Centre • Complete Navigation Architecture
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Complete navigation specification featuring Graph Flow, Bottom Navigation Bars, Side Drawer, Deep Link Resolver, Back Stack Rules, Role Guards, and State Rehydration.
            </p>
          </div>

          <button
            onClick={handleCopyJSON}
            className="self-start md:self-center inline-flex items-center space-x-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Nav Spec Copied!" : "Export Navigation JSON"}</span>
          </button>
        </div>
      </div>

      {/* Interactive Spec Sub-Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex flex-wrap items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab("graph")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "graph"
              ? "bg-teal-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-teal-300" />
          <span>Navigation Graph (Mermaid)</span>
        </button>

        <button
          onClick={() => setActiveTab("bottom-nav")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "bottom-nav"
              ? "bg-teal-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-teal-300" />
          <span>Bottom Navigation Spec</span>
        </button>

        <button
          onClick={() => setActiveTab("drawer")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "drawer"
              ? "bg-teal-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Menu className="w-3.5 h-3.5 text-teal-300" />
          <span>Navigation Drawer</span>
        </button>

        <button
          onClick={() => setActiveTab("deep-linking")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "deep-linking"
              ? "bg-teal-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Link className="w-3.5 h-3.5 text-teal-300" />
          <span>Deep Linking Engine</span>
        </button>

        <button
          onClick={() => setActiveTab("back-nav")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "back-nav"
              ? "bg-teal-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5 text-teal-300" />
          <span>Back Stack Rules</span>
        </button>

        <button
          onClick={() => setActiveTab("rbac-routes")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "rbac-routes"
              ? "bg-teal-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
          <span>Role-Based Guards</span>
        </button>

        <button
          onClick={() => setActiveTab("state-preservation")}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 ${
            activeTab === "state-preservation"
              ? "bg-teal-900 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5 text-teal-300" />
          <span>State Preservation</span>
        </button>
      </div>

      {/* TAB CONTENT: NAVIGATION GRAPH */}
      {activeTab === "graph" && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-teal-600" />
                  <span>Master App Navigation Graph</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Visual representation of entry flow, role-based shell switching, modal overlays, and deep-link interrupts.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold rounded-lg font-mono">
                Material 3 • Stateful Shell Routing
              </span>
            </div>

            <MermaidDiagram chart={mainNavigationGraphChart} id="nav-graph-diagram" />
          </div>
        </div>
      )}

      {/* TAB CONTENT: BOTTOM NAVIGATION SPEC */}
      {activeTab === "bottom-nav" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Worker Bottom Nav Spec */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Worker Bottom Navigation</h4>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                  Role: Worker
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>1. Explore Vacancies</span>
                  <span className="font-mono text-[10px] text-slate-500">/worker/jobs</span>
                </div>
                <p className="text-slate-600 text-[11px]">Proximity filter, salary ranges, and quick apply CTA.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>2. My Applications</span>
                  <span className="font-mono text-[10px] text-slate-500">/worker/applications</span>
                </div>
                <p className="text-slate-600 text-[11px]">Real-time applicant status (Shortlisted, Interview, Offered).</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>3. Escrow Wallet</span>
                  <span className="font-mono text-[10px] text-slate-500">/worker/wallet</span>
                </div>
                <p className="text-slate-600 text-[11px]">Held escrow balance, EcoCash/InnBucks payout withdrawals.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>4. Chat Threads</span>
                  <span className="font-mono text-[10px] text-slate-500">/worker/messages</span>
                </div>
                <p className="text-slate-600 text-[11px]">Employer messages & voice note attachments.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>5. Profile & ID Vetting</span>
                  <span className="font-mono text-[10px] text-slate-500">/worker/profile</span>
                </div>
                <p className="text-slate-600 text-[11px]">Upload ZRP police clearance & record audio bio.</p>
              </div>
            </div>
          </div>

          {/* Employer Bottom Nav Spec */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Briefcase className="w-5 h-5 text-teal-600" />
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Employer Bottom Navigation</h4>
                <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">
                  Role: Employer
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>1. Hire Directory</span>
                  <span className="font-mono text-[10px] text-slate-500">/employer/search</span>
                </div>
                <p className="text-slate-600 text-[11px]">Browse domestic workers, listen to voice bios, review trust index.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>2. My Job Vacancies</span>
                  <span className="font-mono text-[10px] text-slate-500">/employer/vacancies</span>
                </div>
                <p className="text-slate-600 text-[11px]">Publish vacancies, review incoming candidate applications.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>3. Escrow Vault</span>
                  <span className="font-mono text-[10px] text-slate-500">/employer/escrow</span>
                </div>
                <p className="text-slate-600 text-[11px]">Fund wages via EcoCash, InnBucks, PayPal, or Visa.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>4. Candidate Chats</span>
                  <span className="font-mono text-[10px] text-slate-500">/employer/messages</span>
                </div>
                <p className="text-slate-600 text-[11px]">Real-time chat with shortlisted candidates.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>5. Household Profile</span>
                  <span className="font-mono text-[10px] text-slate-500">/employer/profile</span>
                </div>
                <p className="text-slate-600 text-[11px]">Manage family size, estate location, and subscription tier.</p>
              </div>
            </div>
          </div>

          {/* Admin / Staff Bottom Nav Spec */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Crown className="w-5 h-5 text-purple-600" />
              <div>
                <h4 className="font-extrabold text-sm text-slate-900">Staff Operations Navigation</h4>
                <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-bold">
                  Role: Admin / Staff
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>1. Command Overview</span>
                  <span className="font-mono text-[10px] text-slate-500">/admin/overview</span>
                </div>
                <p className="text-slate-600 text-[11px]">Platform health metrics, active jobs, gross volume.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>2. Verification Queue</span>
                  <span className="font-mono text-[10px] text-slate-500">/admin/verifications</span>
                </div>
                <p className="text-slate-600 text-[11px]">ZRP clearance & National ID Gemini OCR review.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>3. Escrow Ledger</span>
                  <span className="font-mono text-[10px] text-slate-500">/admin/finance</span>
                </div>
                <p className="text-slate-600 text-[11px]">Audit mobile gateway deposits & manual release overrides.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>4. Helpdesk & Disputes</span>
                  <span className="font-mono text-[10px] text-slate-500">/admin/disputes</span>
                </div>
                <p className="text-slate-600 text-[11px]">Process user grievance tickets and arbitration.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>5. RBAC & Security</span>
                  <span className="font-mono text-[10px] text-slate-500">/admin/rbac</span>
                </div>
                <p className="text-slate-600 text-[11px]">Inspect 9-role permission specs and system logs.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: NAVIGATION DRAWER */}
      {activeTab === "drawer" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Menu className="w-5 h-5 text-teal-600" />
              <span>Material 3 Side Navigation Drawer Specification</span>
            </h4>
            <p className="text-xs text-slate-500">
              Persistent slide-over navigation drawer accessible from top app bar across all roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="text-xs font-mono text-teal-400 uppercase font-bold border-b border-slate-800 pb-2">
                Drawer Layout Header
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
                    CM
                  </div>
                  <div>
                    <div className="text-xs font-bold">Chipo Moyo</div>
                    <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>ZRP Police Clearance Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs font-mono text-teal-400 uppercase font-bold border-b border-slate-800 pb-2 pt-2">
                Drawer Menu Destinations
              </div>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center justify-between p-2 rounded hover:bg-slate-800 cursor-pointer text-slate-200">
                  <span>Account & Phone Number Settings</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </li>
                <li className="flex items-center justify-between p-2 rounded hover:bg-slate-800 cursor-pointer text-slate-200">
                  <span>WhatsApp Support Hotline (+236713933733)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                </li>
                <li className="flex items-center justify-between p-2 rounded hover:bg-slate-800 cursor-pointer text-slate-200">
                  <span>Vocational Training Academy</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">Free</span>
                </li>
                <li className="flex items-center justify-between p-2 rounded hover:bg-slate-800 cursor-pointer text-slate-200">
                  <span>Zimbabwe Labour Act Legal Guide</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </li>
                <li className="flex items-center justify-between p-2 rounded hover:bg-slate-800 cursor-pointer text-slate-200">
                  <span>Switch Role Persona</span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-bold">Demo Mode</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-slate-800 space-y-2">
                <h5 className="font-bold text-teal-950 text-sm">Gesture & Modal Behavior</h5>
                <p className="text-slate-600 leading-relaxed">
                  The Navigation Drawer uses standard Material Design 3 modal drawer behavior. On mobile screens (&lt; 768px), it slides from left with scrim overlay and dismisses via tap outside or left-swipe gesture. On desktop (&gt; 1024px), it optionally pins as a permanent vertical navigation rail.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 space-y-2">
                <h5 className="font-bold text-slate-900 text-sm">State & Badge Integration</h5>
                <p className="text-slate-600 leading-relaxed">
                  Drawer badges sync dynamically with live state (e.g. unread WhatsApp support messages, pending document verification alerts, and new escrow wage deposits).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: DEEP LINKING ENGINE */}
      {activeTab === "deep-linking" && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="mb-4">
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Link className="w-5 h-5 text-teal-600" />
                <span>Universal Deep Link Resolver Architecture</span>
              </h4>
              <p className="text-xs text-slate-500">
                Supports custom URIs (`zmc://`) and HTTPS Universal Links (`https://zimmaidscentre.co.zw`) with deferred auth resolution.
              </p>
            </div>

            <MermaidDiagram chart={deepLinkingChart} id="deep-link-diagram" />

            {/* Deep Link Route Mapping Table */}
            <div className="mt-6 border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="p-3 font-bold">URL Pattern</th>
                    <th className="p-3 font-bold">Target Screen</th>
                    <th className="p-3 font-bold">Auth Requirement</th>
                    <th className="p-3 font-bold">Parameters Passed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-teal-800">zmc://job/:jobId</td>
                    <td className="p-3 font-bold">Job Vacancy Detail Card</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Public Read</span></td>
                    <td className="p-3 font-mono text-[11px]">jobId (string)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-teal-800">zmc://worker/:workerId</td>
                    <td className="p-3 font-bold">Worker Public Profile & Audio Bio</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">Public Read</span></td>
                    <td className="p-3 font-mono text-[11px]">workerId (string)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-teal-800">zmc://escrow/:escrowId</td>
                    <td className="p-3 font-bold">Escrow Vault Deposit Modal</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-bold text-[10px]">Employer Auth Guard</span></td>
                    <td className="p-3 font-mono text-[11px]">escrowId (string)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-teal-800">zmc://chat/:threadId</td>
                    <td className="p-3 font-bold">Live Candidate Messaging Thread</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-bold text-[10px]">Participant Guard</span></td>
                    <td className="p-3 font-mono text-[11px]">threadId (string)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: BACK STACK RULES */}
      {activeTab === "back-nav" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ArrowLeft className="w-5 h-5 text-teal-600" />
              <span>Back Navigation & Stack Management Rules</span>
            </h4>
            <p className="text-xs text-slate-500">
              Defines predictive back gesture behavior, modal pop handling, and route history clearing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-emerald-600" />
                <span>Stack Clearing After Authentication</span>
              </h5>
              <p className="text-slate-600 leading-relaxed">
                When a user completes phone OTP registration or login, the navigation stack executes <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">popUntilRoot()</code>. This prevents pressing system back button from taking the user back into the registration/login flow once logged in.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <h5 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>Predictive Back & Modal Sheet Dismissal</span>
              </h5>
              <p className="text-slate-600 leading-relaxed">
                Modal bottom sheets (e.g. Escrow Payment Modal or Audio Bio recorder) intercept the back gesture first. A back event dismisses the topmost modal overlay before popping screen routes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ROLE-BASED ROUTE GUARDS */}
      {activeTab === "rbac-routes" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <span>Role-Based Route Guards (RBAC Engine)</span>
            </h4>
            <p className="text-xs text-slate-500">
              Guards protect sensitive routes (Admin Portal, Escrow Release, Verification Queue) based on user credentials.
            </p>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-2xl font-mono text-xs space-y-2 overflow-x-auto">
            <div className="text-emerald-400 font-bold">// TypeScript / Flutter Navigation Guard Middleware</div>
            <pre className="text-slate-300 text-[11px] leading-relaxed">
{`export function handleRouteNavigation(targetPath: string, userRole: UserRole): RouteDecision {
  const protectedRoutes = {
    "/admin": ["admin", "super_admin", "verification_officer", "finance_officer"],
    "/employer/escrow": ["employer", "admin", "finance_officer"],
    "/worker/wallet": ["worker", "admin", "finance_officer"]
  };

  const allowedRoles = protectedRoutes[targetPath];
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return { status: "UNAUTHORIZED", fallbackPath: "/403-unauthorized" };
  }
  return { status: "ALLOWED", destination: targetPath };
}`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB CONTENT: STATE PRESERVATION */}
      {activeTab === "state-preservation" && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="mb-4">
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-teal-600" />
                <span>State Preservation & Restoration System</span>
              </h4>
              <p className="text-xs text-slate-500">
                Protects user input drafts (job descriptions, voice profile records, search filters) across OS memory evictions and app reboots.
              </p>
            </div>

            <MermaidDiagram chart={statePreservationChart} id="state-preservation-diagram" />
          </div>
        </div>
      )}
    </div>
  );
};
