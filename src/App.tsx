import React, { useState } from "react";
import { Header } from "./components/Header";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { Footer } from "./components/Footer";
import { LandingShowcase } from "./components/landing/LandingShowcase";
import { ArchitectureView } from "./components/architecture/ArchitectureView";
import { WorkerDirectory } from "./components/marketplace/WorkerDirectory";
import { AIVettingStudio } from "./components/marketplace/AIVettingStudio";
import { PaymentsLedger } from "./components/marketplace/PaymentsLedger";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { WorkerModule } from "./components/worker/WorkerModule";
import { JobManagementModule } from "./components/jobs/JobManagementModule";
import { EnterpriseSearchEngine } from "./components/search/EnterpriseSearchEngine";
import { WhatsAppMessagingSystem } from "./components/chat/WhatsAppMessagingSystem";
import { WhatsAppIngestionPortal } from "./components/chat/WhatsAppIngestionPortal";
import { PlacementFeeModal } from "./components/marketplace/PlacementFeeModal";
import { PremiumAccessModal } from "./components/marketplace/PremiumAccessModal";
import { ChatModal } from "./components/marketplace/ChatModal";
import { WhatsAppHelpWidget } from "./components/WhatsAppHelpWidget";
import { ReviewAndTrustCenter } from "./components/marketplace/ReviewAndTrustCenter";
import { PerformanceReportsModule } from "./components/admin/PerformanceReportsModule";
import { UserRole, CityLocation, WorkerProfile, PlacementFeeRecord } from "./types/marketplace";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "landing" | "architecture" | "marketplace" | "worker" | "jobs" | "search" | "whatsapp" | "whatsapp-upload" | "ai-studio" | "payments" | "admin" | "reviews" | "reports"
  >("landing");

  const [selectedRole, setSelectedRole] = useState<UserRole>("Domestic worker");
  const [selectedCity, setSelectedCity] = useState<CityLocation>("Harare");
  const [currency, setCurrency] = useState<"USD" | "ZWG">("USD");

  // Premium Access & Placement States
  const [isPremiumEmployer, setIsPremiumEmployer] = useState<boolean>(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState<boolean>(false);
  const [placementWorker, setPlacementWorker] = useState<WorkerProfile | null>(null);
  const [chatWorker, setChatWorker] = useState<WorkerProfile | null>(null);
  const [placementRecords, setPlacementRecords] = useState<PlacementFeeRecord[]>([]);

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
        />

        {/* View Switcher */}
        <main className="pb-16">
          {activeTab === "landing" && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
              <LandingShowcase onNavigateToTab={(tab) => setActiveTab(tab as any)} />
            </div>
          )}
          {activeTab === "architecture" && <ArchitectureView />}
          {activeTab === "marketplace" && (
            <WorkerDirectory
              selectedRole={selectedRole}
              selectedCity={selectedCity}
              currency={currency}
              isPremiumEmployer={isPremiumEmployer}
              onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
              onOpenHirePlacement={(w) => setPlacementWorker(w)}
              onOpenChat={(w) => setChatWorker(w)}
            />
          )}
          {activeTab === "worker" && <WorkerModule currency={currency} />}
          {activeTab === "jobs" && <JobManagementModule currency={currency} />}
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
              onActivatePremium={() => setIsPremiumModalOpen(true)}
            />
          )}
          {activeTab === "reviews" && <ReviewAndTrustCenter />}
          {activeTab === "reports" && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
              <PerformanceReportsModule />
            </div>
          )}
          {activeTab === "admin" && <AdminDashboard />}
        </main>
      </div>

      {/* Global Modals & Floating Tools */}
      <PlacementFeeModal
        worker={placementWorker}
        onClose={() => setPlacementWorker(null)}
        currency={currency}
        onRecordPlacementSuccess={handleRecordPlacementSuccess}
      />

      <PremiumAccessModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        currency={currency}
        onActivateSuccess={handleActivatePremiumSuccess}
      />

      <ChatModal worker={chatWorker} onClose={() => setChatWorker(null)} />

      <WhatsAppHelpWidget />

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
      <Footer />
    </div>
  );
}
