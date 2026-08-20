import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PlatformProvider } from "./context/PlatformContext";
import { AuthModal } from "./components/auth/AuthModal";
import { Header } from "./components/Header";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { Footer } from "./components/Footer";
import { LandingShowcase } from "./components/landing/LandingShowcase";
import { ArchitectureView } from "./components/architecture/ArchitectureView";
import { WorkerDirectory } from "./components/marketplace/WorkerDirectory";
import { AIVettingStudio } from "./components/marketplace/AIVettingStudio";
import { PaymentsLedger } from "./components/marketplace/PaymentsLedger";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { PlatformAdminDashboard } from "./components/admin/PlatformAdminDashboard";
import { EmployerDashboard } from "./components/employer/EmployerDashboard";
import { MaidDashboard } from "./components/maid/MaidDashboard";
import { WorkerModule } from "./components/worker/WorkerModule";
import { JobManagementModule } from "./components/jobs/JobManagementModule";
import { EnterpriseSearchEngine } from "./components/search/EnterpriseSearchEngine";
import { WhatsAppMessagingSystem } from "./components/chat/WhatsAppMessagingSystem";
import { WhatsAppIngestionPortal } from "./components/chat/WhatsAppIngestionPortal";
import { AgencyDashboard } from "./components/agency/AgencyDashboard";
import { AgencyRegistrationModal } from "./components/agency/AgencyRegistrationModal";
import { PlacementFeeModal } from "./components/marketplace/PlacementFeeModal";
import { ReferralProgramModal } from "./components/referral/ReferralProgramModal";
import { PremiumAccessModal } from "./components/marketplace/PremiumAccessModal";
import { ChatModal } from "./components/marketplace/ChatModal";
import { WhatsAppHelpWidget } from "./components/WhatsAppHelpWidget";
import { ReviewAndTrustCenter } from "./components/marketplace/ReviewAndTrustCenter";
import { PerformanceReportsModule } from "./components/admin/PerformanceReportsModule";
import { NotificationCenterModal } from "./components/common/NotificationCenterModal";
import { LegalComplianceModal } from "./components/common/LegalComplianceModal";
import { AccessibilitySettingsModal } from "./components/common/AccessibilitySettingsModal";
import { MarketingHubModal } from "./components/marketing/MarketingHubModal";
import { UserRole, CityLocation, WorkerProfile, PlacementFeeRecord } from "./types/marketplace";

function AppContent() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "landing" | "architecture" | "employer" | "maid" | "marketplace" | "worker" | "agency" | "jobs" | "search" | "whatsapp" | "whatsapp-upload" | "ai-studio" | "payments" | "admin" | "reviews" | "reports"
  >("landing");

  const [selectedRole, setSelectedRole] = useState<UserRole>("Domestic worker");
  const [selectedCity, setSelectedCity] = useState<CityLocation>("Harare");
  const [currency, setCurrency] = useState<"USD" | "ZWG">("USD");

  // Premium Access & Placement States
  const [isPremiumEmployer, setIsPremiumEmployer] = useState<boolean>(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState<boolean>(false);
  const [premiumTargetWorker, setPremiumTargetWorker] = useState<WorkerProfile | null>(null);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState<boolean>(false);
  const [isAgencyRegistrationModalOpen, setIsAgencyRegistrationModalOpen] = useState<boolean>(false);
  const [placementWorker, setPlacementWorker] = useState<WorkerProfile | null>(null);
  const [chatWorker, setChatWorker] = useState<WorkerProfile | null>(null);
  const [placementRecords, setPlacementRecords] = useState<PlacementFeeRecord[]>([]);

  // New Global Modals: Notifications, Legal, Accessibility, Marketing
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [legalInitialTab, setLegalInitialTab] = useState<"privacy" | "terms" | "placement" | "guidelines" | "cookies" | "deletion">("privacy");
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState<boolean>(false);
  const [isMarketingHubOpen, setIsMarketingHubOpen] = useState<boolean>(false);

  // Role-based view sync: When user role is Worker -> show Jobs / Maid; when Employer -> show Marketplace / Employer
  React.useEffect(() => {
    if (currentUser?.role === "Worker") {
      if (activeTab === "employer") {
        setActiveTab("jobs");
      }
    } else if (currentUser?.role === "Employer") {
      if (activeTab === "maid" || activeTab === "worker") {
        setActiveTab("marketplace");
      }
    }
  }, [currentUser?.role]);

  const handleOpenLegal = (tab?: "privacy" | "terms" | "placement" | "guidelines" | "cookies" | "deletion") => {
    if (tab) setLegalInitialTab(tab);
    setIsLegalModalOpen(true);
  };

  const handleRecordPlacementSuccess = (newRecord: PlacementFeeRecord) => {
    setPlacementRecords((prev) => [newRecord, ...prev]);
    setPlacementWorker(null);
    setActiveTab("payments");
  };

  const handleActivatePremiumSuccess = () => {
    setIsPremiumEmployer(true);
    setIsPremiumModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          currency={currency}
          setCurrency={setCurrency}
          onOpenAgencyRegister={() => setIsAgencyRegistrationModalOpen(true)}
          onOpenReferralProgram={() => setIsReferralModalOpen(true)}
          onOpenNotifications={() => setIsNotificationCenterOpen(true)}
          onOpenLegalCompliance={handleOpenLegal}
          onOpenAccessibility={() => setIsAccessibilityModalOpen(true)}
          onOpenMarketingHub={() => setIsMarketingHubOpen(true)}
        />

        {/* View Switcher */}
        <main className="pb-16">
          {activeTab === "landing" && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
              <LandingShowcase onNavigateToTab={(tab) => setActiveTab(tab as any)} />
            </div>
          )}
          {activeTab === "employer" && <EmployerDashboard />}
          {activeTab === "maid" && <MaidDashboard />}
          {activeTab === "architecture" && <ArchitectureView />}
          {activeTab === "marketplace" && (
            <WorkerDirectory
              selectedRole={selectedRole}
              selectedCity={selectedCity}
              currency={currency}
              isPremiumEmployer={isPremiumEmployer}
              onNavigateToJobs={() => setActiveTab("jobs")}
              onOpenPremiumModal={(w) => {
                setPremiumTargetWorker(w || null);
                setIsPremiumModalOpen(true);
              }}
              onOpenHirePlacement={(w) => setPlacementWorker(w)}
              onOpenChat={(w) => setChatWorker(w)}
            />
          )}
          {activeTab === "worker" && <MaidDashboard />}
          {activeTab === "agency" && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
              <AgencyDashboard />
            </div>
          )}
          {activeTab === "jobs" && (
            <JobManagementModule
              currency={currency}
              onNavigateToMarketplace={() => setActiveTab("marketplace")}
            />
          )}
          {activeTab === "search" && <EnterpriseSearchEngine currency={currency} />}
          {activeTab === "whatsapp" && <WhatsAppMessagingSystem />}
          {activeTab === "whatsapp-upload" && (
            <WhatsAppIngestionPortal
              onNavigateToMarketplace={() => setActiveTab("marketplace")}
            />
          )}
          {activeTab === "ai-studio" && <AIVettingStudio />}
          {activeTab === "payments" && (
            <PaymentsLedger
              currency={currency}
              placementList={placementRecords}
              isPremiumEmployer={isPremiumEmployer}
              onActivatePremium={() => {
                setPremiumTargetWorker(null);
                setIsPremiumModalOpen(true);
              }}
            />
          )}
          {activeTab === "reviews" && <ReviewAndTrustCenter />}
          {activeTab === "reports" && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
              <PerformanceReportsModule />
            </div>
          )}
          {activeTab === "admin" && <PlatformAdminDashboard />}
        </main>
      </div>

      {/* Global Modals & Floating Tools */}
      <AuthModal />

      <AgencyRegistrationModal
        isOpen={isAgencyRegistrationModalOpen}
        onClose={() => setIsAgencyRegistrationModalOpen(false)}
        onSuccess={() => setActiveTab("agency")}
      />

      <PlacementFeeModal
        worker={placementWorker}
        onClose={() => setPlacementWorker(null)}
        currency={currency}
        onRecordPlacementSuccess={handleRecordPlacementSuccess}
        onOpenReferralProgram={() => setIsReferralModalOpen(true)}
      />

      <ReferralProgramModal
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
        currency={currency}
      />

      <PremiumAccessModal
        isOpen={isPremiumModalOpen}
        onClose={() => {
          setIsPremiumModalOpen(false);
          setPremiumTargetWorker(null);
        }}
        currency={currency}
        targetWorkerName={premiumTargetWorker?.fullName}
        targetWorkerId={premiumTargetWorker?.id}
        onActivateSuccess={handleActivatePremiumSuccess}
      />

      <ChatModal worker={chatWorker} onClose={() => setChatWorker(null)} />

      <WhatsAppHelpWidget />

      {/* Global Notifications Hub Modal */}
      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        onNavigateToTab={(tab) => {
          if (tab === "jobs" || tab === "marketplace" || tab === "payments" || tab === "whatsapp" || tab === "worker" || tab === "agency") {
            setActiveTab(tab as any);
          }
        }}
      />

      {/* Legal & Statutory Compliance Modal */}
      <LegalComplianceModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalInitialTab}
      />

      {/* Accessibility & Low-Data Mode Settings Modal */}
      <AccessibilitySettingsModal
        isOpen={isAccessibilityModalOpen}
        onClose={() => setIsAccessibilityModalOpen(false)}
      />

      {/* Marketing Hub, Spotlight & Live Support Chat Modal */}
      <MarketingHubModal
        isOpen={isMarketingHubOpen}
        onClose={() => setIsMarketingHubOpen(false)}
        currency={currency}
        onNavigateToTab={(tab) => {
          if (tab === "marketplace" || tab === "jobs" || tab === "payments") {
            setActiveTab(tab as any);
          }
        }}
      />

      {/* Sticky Mobile & Tablet Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        currency={currency}
        setCurrency={setCurrency}
      />

      {/* Footer */}
      <Footer
        onOpenLegalCompliance={handleOpenLegal}
        onOpenAccessibility={() => setIsAccessibilityModalOpen(true)}
        onOpenMarketingHub={() => setIsMarketingHubOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PlatformProvider>
        <AppContent />
      </PlatformProvider>
    </AuthProvider>
  );
}
