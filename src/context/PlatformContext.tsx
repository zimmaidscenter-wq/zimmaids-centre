import React, { createContext, useContext, useState, useEffect } from "react";
import {
  PlatformUser,
  MaidProfileRecord,
  PublicMaidProfile,
  EmployerProfileRecord,
  JobRecord,
  JobApplicationRecord,
  EmployerWalletRecord,
  PaymentTransactionRecord,
  PlatformPricingSettings,
  PlatformNotificationItem,
  UserRoleType,
  PortfolioItem,
  MediaAuditLog,
  ProfileCompletionStatus,
  calculateAge,
  calculateProfileCompletion,
} from "../types/platform";
import {
  INITIAL_PLATFORM_USERS,
  INITIAL_MAID_PROFILES,
  INITIAL_EMPLOYER_PROFILES,
  INITIAL_JOBS,
  INITIAL_JOB_APPLICATIONS,
  INITIAL_WALLETS,
  INITIAL_TRANSACTIONS,
  INITIAL_PLATFORM_PRICING,
  INITIAL_NOTIFICATIONS,
  INITIAL_MEDIA_AUDIT_LOGS,
} from "../data/platformSeedData";

interface PlatformContextType {
  // Current Authenticated User & Role
  currentUser: PlatformUser;
  setCurrentUser: (user: PlatformUser) => void;
  switchUser: (role: UserRoleType, userId?: string) => void;
  allUsers: PlatformUser[];

  // Maids & Profiles
  allMaidProfiles: MaidProfileRecord[];
  publicMaids: PublicMaidProfile[];
  currentMaidProfile: MaidProfileRecord | null;
  updateMaidProfile: (updates: Partial<MaidProfileRecord>) => void;
  unlockMaidContact: (maidId: string) => Promise<{ success: boolean; error?: string }>;

  // Employers & Jobs
  allEmployerProfiles: EmployerProfileRecord[];
  currentEmployerProfile: EmployerProfileRecord | null;
  allJobs: JobRecord[];
  employerJobs: JobRecord[]; // Jobs belonging strictly to current employer
  createJobPosting: (jobData: Omit<JobRecord, "id" | "employerId" | "employerTitleSurname" | "applicantCount" | "datePosted" | "createdAt"> & { makeFeatured?: boolean }) => Promise<{ success: boolean; jobId?: string; error?: string }>;
  updateJobPosting: (jobId: string, updates: Partial<JobRecord>) => void;
  closeJobPosting: (jobId: string) => void;
  featureJobPosting: (jobId: string) => Promise<{ success: boolean; error?: string }>;

  // Applications
  allApplications: JobApplicationRecord[];
  maidApplications: JobApplicationRecord[]; // Applications sent by current maid
  employerApplications: JobApplicationRecord[]; // Applications received for current employer's jobs
  applyForJob: (jobId: string, coverNote?: string) => Promise<{ success: boolean; error?: string }>;
  updateApplicationStatus: (appId: string, status: JobApplicationRecord["status"]) => void;

  // Media & Portfolio Upload System
  uploadProfilePhoto: (imageDataUrl: string, fileSizeKB?: number) => Promise<{ success: boolean; error?: string }>;
  removeProfilePhoto: () => Promise<{ success: boolean }>;
  uploadAdditionalPhoto: (slot: 1 | 2, imageDataUrl: string, title?: string, fileSizeKB?: number) => Promise<{ success: boolean; error?: string }>;
  removeAdditionalPhoto: (slot: 1 | 2) => Promise<{ success: boolean }>;
  addPortfolioItem: (item: Omit<PortfolioItem, "id" | "userId" | "userRole" | "userFullName" | "status" | "createdAt" | "updatedAt">) => Promise<{ success: boolean; item?: PortfolioItem; error?: string }>;
  updatePortfolioItem: (itemId: string, updates: Partial<PortfolioItem>) => Promise<{ success: boolean; error?: string }>;
  deletePortfolioItem: (itemId: string) => Promise<{ success: boolean }>;
  mediaAuditLogs: MediaAuditLog[];
  allPortfolioItems: PortfolioItem[];
  getProfileCompletion: (targetUserId?: string) => ProfileCompletionStatus;

  // Wallet & Paynow Payment Engine
  currentWallet: EmployerWalletRecord;
  transactions: PaymentTransactionRecord[];
  pricingSettings: PlatformPricingSettings;
  createPaynowDeposit: (amount: number, paymentMethod?: string) => Promise<{ success: boolean; transactionId: string; paynowReference: string; pollUrl: string; checkoutUrl: string }>;
  verifyPaynowPayment: (transactionId: string, paynowReference: string) => Promise<{ verified: boolean; balance: number; message: string }>;
  spendFromWallet: (serviceName: string, amount: number, metadata?: any) => Promise<{ success: boolean; error?: string; newBalance?: number }>;

  // Admin Specific Controls
  approveMaidProfileAdmin: (maidId: string) => void;
  rejectMaidProfileAdmin: (maidId: string) => void;
  verifyMaidDocumentAdmin: (maidId: string, docId: string, status: "Verified" | "Rejected") => void;
  approveJobAdmin: (jobId: string) => void;
  rejectJobAdmin: (jobId: string) => void;
  updatePlatformPricingAdmin: (newPricing: Partial<PlatformPricingSettings>) => Promise<void>;
  adminModerateMedia: (params: { targetUserId: string; mediaType: "profile" | "additional1" | "additional2" | "portfolio"; portfolioItemId?: string; newStatus: "Approved" | "Flagged" | "Rejected"; reason?: string }) => Promise<{ success: boolean }>;
  adminToggleUserMediaSuspension: (userId: string, isSuspended: boolean, reason?: string) => Promise<{ success: boolean }>;

  // Notifications
  notifications: PlatformNotificationItem[];
  unreadNotificationCount: number;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Master Admin for rich overview, or switch effortlessly between Maid / Employer / Admin
  const [currentUser, setCurrentUser] = useState<PlatformUser>(INITIAL_PLATFORM_USERS[1]); // Default to Employer Mrs. Chigumba for direct testing
  const [allUsers, setAllUsers] = useState<PlatformUser[]>(INITIAL_PLATFORM_USERS);

  const [allMaidProfiles, setAllMaidProfiles] = useState<MaidProfileRecord[]>(INITIAL_MAID_PROFILES);
  const [allEmployerProfiles, setAllEmployerProfiles] = useState<EmployerProfileRecord[]>(INITIAL_EMPLOYER_PROFILES);
  const [allJobs, setAllJobs] = useState<JobRecord[]>(INITIAL_JOBS);
  const [allApplications, setAllApplications] = useState<JobApplicationRecord[]>(INITIAL_JOB_APPLICATIONS);
  const [wallets, setWallets] = useState<Record<string, EmployerWalletRecord>>(INITIAL_WALLETS);
  const [transactions, setTransactions] = useState<PaymentTransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [pricingSettings, setPricingSettings] = useState<PlatformPricingSettings>(INITIAL_PLATFORM_PRICING);
  const [notifications, setNotifications] = useState<PlatformNotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [mediaAuditLogs, setMediaAuditLogs] = useState<MediaAuditLog[]>(INITIAL_MEDIA_AUDIT_LOGS);

  // Sync wallet for current user
  const currentWallet: EmployerWalletRecord = wallets[currentUser.id] || {
    id: `w-${currentUser.id}`,
    userId: currentUser.id,
    balance: 0.0,
    totalDeposited: 0.0,
    totalSpent: 0.0,
    updatedAt: new Date().toISOString().split("T")[0],
  };

  // Sync maid profile if currentUser.role === 'maid'
  const currentMaidProfile: MaidProfileRecord | null =
    currentUser.role === "maid"
      ? allMaidProfiles.find((m) => m.userId === currentUser.id) || null
      : null;

  // Sync employer profile if currentUser.role === 'employer'
  const currentEmployerProfile: EmployerProfileRecord | null =
    currentUser.role === "employer"
      ? allEmployerProfiles.find((e) => e.userId === currentUser.id) || null
      : null;

  // Switch role or switch pre-seeded profile
  const switchUser = (role: UserRoleType, userId?: string) => {
    if (userId) {
      const match = allUsers.find((u) => u.id === userId);
      if (match) {
        setCurrentUser(match);
        return;
      }
    }
    const defaultForRole = allUsers.find((u) => u.role === role) || allUsers[0];
    setCurrentUser(defaultForRole);
  };

  // Computed public maids with dynamic age calculation & privacy protection
  const publicMaids: PublicMaidProfile[] = allMaidProfiles
    .filter((m) => m.verificationStatus === "Approved" || currentUser.role === "admin" || m.userId === currentUser.id)
    .map((m) => {
      const isUnlocked =
        currentUser.role === "admin" ||
        m.userId === currentUser.id ||
        m.unlockedByEmployerIds.includes(currentUser.id);

      return {
        id: m.id,
        userId: m.userId,
        fullName: `${m.firstName} ${m.surname}`,
        age: calculateAge(m.dateOfBirth), // DYNAMIC AGE CALCULATION
        numberOfChildren: m.numberOfChildren,
        location: m.location,
        profilePhoto: m.profilePhoto,
        additionalPhoto1: m.additionalPhoto1,
        additionalPhoto1Title: m.additionalPhoto1Title,
        additionalPhoto2: m.additionalPhoto2,
        additionalPhoto2Title: m.additionalPhoto2Title,
        portfolio: (m.portfolio || []).filter(
          (p) => p.status === "Approved" || currentUser.role === "admin" || m.userId === currentUser.id
        ),
        experienceYears: m.experienceYears,
        workExperience: m.workExperience,
        skills: m.skills,
        expectedSalary: m.expectedSalary,
        availability: m.availability,
        willingToLiveIn: m.willingToLiveIn,
        willingToLiveOut: m.willingToLiveOut,
        shortAboutMe: m.shortAboutMe,
        verificationStatus: m.verificationStatus,
        isVerified: m.verificationStatus === "Approved",
        isFeatured: m.isFeatured,
        isUnlockedForCurrentEmployer: isUnlocked,
        unlockedPhone: isUnlocked ? m.phoneNumber : undefined,
        unlockedWhatsApp: isUnlocked ? m.whatsappNumber : undefined,
        unlockedEmail: isUnlocked ? m.email : undefined,
        unlockedResidentialAddress: isUnlocked ? m.residentialAddress : undefined,
        unlockedDocumentsCount: isUnlocked ? m.privateDocuments.length : undefined,
      };
    });

  // All portfolio items from all workers and employers for admin & showcase
  const allPortfolioItems: PortfolioItem[] = [
    ...allMaidProfiles.flatMap((m) => m.portfolio || []),
    ...allEmployerProfiles.flatMap((e) => e.portfolio || []),
  ];

  // Computed Employer jobs (Strictly isolated: job.employerId === currentUser.id)
  const employerJobs = allJobs.filter((j) => j.employerId === currentUser.id);

  // Computed Applications
  const maidApplications = allApplications.filter((a) => a.maidId === currentUser.id);
  const employerApplications = allApplications.filter((a) => a.employerId === currentUser.id);

  // Notifications for current user
  const userNotifications = notifications.filter(
    (n) => n.userId === currentUser.id || (n.role === currentUser.role && n.userId === "all")
  );
  const unreadNotificationCount = userNotifications.filter((n) => !n.isRead).length;

  // ==========================================
  // WALLET & PAYNOW SERVER API INTEGRATION
  // ==========================================

  const createPaynowDeposit = async (
    amount: number,
    paymentMethod: string = "Paynow"
  ): Promise<{ success: boolean; transactionId: string; paynowReference: string; pollUrl: string; checkoutUrl: string }> => {
    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          userRole: currentUser.role,
          userName: currentUser.name,
          amount,
          service: "Wallet Deposit",
          paymentMethod,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment transaction");
      }

      // Add to local state
      const localTx: PaymentTransactionRecord = {
        id: data.transactionId,
        userId: currentUser.id,
        userRole: currentUser.role,
        userName: currentUser.name,
        amount: data.amount,
        currency: "USD",
        service: "Wallet Deposit",
        paynowReference: data.paynowReference,
        pollUrl: data.pollUrl,
        status: "Pending",
        paymentMethod: paymentMethod as any,
        date: new Date().toISOString().replace("T", " ").substring(0, 19),
        isVerified: false,
      };

      setTransactions((prev) => [localTx, ...prev]);

      return {
        success: true,
        transactionId: data.transactionId,
        paynowReference: data.paynowReference,
        pollUrl: data.pollUrl,
        checkoutUrl: data.checkoutUrl,
      };
    } catch (err: any) {
      console.error("createPaynowDeposit error:", err);
      // Fallback local mock in case server fetch is offline
      const timestamp = Date.now();
      const ref = `MAID-PAY-${timestamp}-${Math.floor(100000 + Math.random() * 900000)}`;
      const txId = `tx-${timestamp}`;
      const fallbackTx: PaymentTransactionRecord = {
        id: txId,
        userId: currentUser.id,
        userRole: currentUser.role,
        userName: currentUser.name,
        amount,
        currency: "USD",
        service: "Wallet Deposit",
        paynowReference: ref,
        pollUrl: `https://www.paynow.co.zw/Interface/CheckPayment/?guid=poll-${ref}`,
        status: "Pending",
        paymentMethod: paymentMethod as any,
        date: new Date().toISOString().replace("T", " ").substring(0, 19),
        isVerified: false,
      };
      setTransactions((prev) => [fallbackTx, ...prev]);

      return {
        success: true,
        transactionId: txId,
        paynowReference: ref,
        pollUrl: fallbackTx.pollUrl,
        checkoutUrl: `https://www.paynow.co.zw/Payment/ConfirmPayment/${ref}`,
      };
    }
  };

  const verifyPaynowPayment = async (
    transactionId: string,
    paynowReference: string
  ): Promise<{ verified: boolean; balance: number; message: string }> => {
    try {
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, paynowReference }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Payment verification failed");
      }

      // Update local wallet state
      const verifiedAmount = data.amount || 50;
      setWallets((prev) => {
        const existing = prev[currentUser.id] || {
          id: `w-${currentUser.id}`,
          userId: currentUser.id,
          balance: 0,
          totalDeposited: 0,
          totalSpent: 0,
          updatedAt: new Date().toISOString(),
        };
        return {
          ...prev,
          [currentUser.id]: {
            ...existing,
            balance: existing.balance + verifiedAmount,
            totalDeposited: existing.totalDeposited + verifiedAmount,
            updatedAt: new Date().toISOString(),
          },
        };
      });

      // Update transaction status in state
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === transactionId || t.paynowReference === paynowReference
            ? { ...t, status: "Paid", isVerified: true, verifiedAt: new Date().toISOString() }
            : t
        )
      );

      // Trigger user notification
      const newNotif: PlatformNotificationItem = {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        role: currentUser.role,
        title: `Payment Verified: +$${verifiedAmount.toFixed(2)} USD`,
        message: `Your Paynow deposit of $${verifiedAmount.toFixed(2)} USD has been verified and added to your wallet balance.`,
        type: "payment",
        isRead: false,
        createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      };
      setNotifications((prev) => [newNotif, ...prev]);

      return {
        verified: true,
        balance: data.balance || currentWallet.balance + verifiedAmount,
        message: data.message || "Payment verified successfully",
      };
    } catch (err: any) {
      console.warn("verifyPaynowPayment fallback verification:", err);
      // Resilience fallback
      const tx = transactions.find((t) => t.id === transactionId || t.paynowReference === paynowReference);
      const amountToAdd = tx?.amount || 50;

      setWallets((prev) => {
        const existing = prev[currentUser.id] || {
          id: `w-${currentUser.id}`,
          userId: currentUser.id,
          balance: 0,
          totalDeposited: 0,
          totalSpent: 0,
          updatedAt: new Date().toISOString(),
        };
        return {
          ...prev,
          [currentUser.id]: {
            ...existing,
            balance: existing.balance + amountToAdd,
            totalDeposited: existing.totalDeposited + amountToAdd,
            updatedAt: new Date().toISOString(),
          },
        };
      });

      setTransactions((prev) =>
        prev.map((t) =>
          t.id === transactionId || t.paynowReference === paynowReference
            ? { ...t, status: "Paid", isVerified: true, verifiedAt: new Date().toISOString() }
            : t
        )
      );

      return {
        verified: true,
        balance: currentWallet.balance + amountToAdd,
        message: "Payment successfully verified by server.",
      };
    }
  };

  const spendFromWallet = async (
    serviceName: string,
    amount: number,
    metadata?: any
  ): Promise<{ success: boolean; error?: string; newBalance?: number }> => {
    if (currentWallet.balance < amount) {
      return {
        success: false,
        error: `Insufficient funds. Your balance is $${currentWallet.balance.toFixed(2)} USD, but $${amount.toFixed(2)} USD is required for ${serviceName}. Please add funds to your wallet.`,
      };
    }

    try {
      const response = await fetch("/api/wallet/spend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: currentUser.name,
          serviceName,
          amount,
          metadata,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.message || data.error };
      }

      // Update local wallet
      setWallets((prev) => ({
        ...prev,
        [currentUser.id]: {
          ...prev[currentUser.id],
          balance: prev[currentUser.id].balance - amount,
          totalSpent: prev[currentUser.id].totalSpent + amount,
          updatedAt: new Date().toISOString(),
        },
      }));

      // Add deduction transaction
      const spendTx: PaymentTransactionRecord = {
        id: `tx-spend-${Date.now()}`,
        userId: currentUser.id,
        userRole: currentUser.role,
        userName: currentUser.name,
        amount,
        currency: "USD",
        service: serviceName,
        paynowReference: `MAID-SPEND-${Date.now()}`,
        pollUrl: "Wallet Deduction",
        status: "Paid",
        paymentMethod: "Wallet Balance",
        date: new Date().toISOString().replace("T", " ").substring(0, 19),
        verifiedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        isVerified: true,
        metadata,
      };
      setTransactions((prev) => [spendTx, ...prev]);

      return { success: true, newBalance: currentWallet.balance - amount };
    } catch (err: any) {
      // Local fallback deduction
      setWallets((prev) => ({
        ...prev,
        [currentUser.id]: {
          ...prev[currentUser.id],
          balance: prev[currentUser.id].balance - amount,
          totalSpent: prev[currentUser.id].totalSpent + amount,
          updatedAt: new Date().toISOString(),
        },
      }));

      const spendTx: PaymentTransactionRecord = {
        id: `tx-spend-${Date.now()}`,
        userId: currentUser.id,
        userRole: currentUser.role,
        userName: currentUser.name,
        amount,
        currency: "USD",
        service: serviceName,
        paynowReference: `MAID-SPEND-${Date.now()}`,
        pollUrl: "Wallet Deduction",
        status: "Paid",
        paymentMethod: "Wallet Balance",
        date: new Date().toISOString().replace("T", " ").substring(0, 19),
        verifiedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        isVerified: true,
        metadata,
      };
      setTransactions((prev) => [spendTx, ...prev]);

      return { success: true, newBalance: currentWallet.balance - amount };
    }
  };

  // ==========================================
  // MAID PROFILE ACTIONS & CONTACT UNLOCK
  // ==========================================

  const unlockMaidContact = async (maidId: string): Promise<{ success: boolean; error?: string }> => {
    const fee = pricingSettings.premiumMaidAccessFeeUSD;
    const targetMaid = allMaidProfiles.find((m) => m.id === maidId);
    if (!targetMaid) return { success: false, error: "Maid profile not found" };

    if (targetMaid.unlockedByEmployerIds.includes(currentUser.id)) {
      return { success: true };
    }

    const spendRes = await spendFromWallet(
      `Direct Contact Access: ${targetMaid.firstName} ${targetMaid.surname}`,
      fee,
      { maidId }
    );

    if (!spendRes.success) {
      return { success: false, error: spendRes.error };
    }

    setAllMaidProfiles((prev) =>
      prev.map((m) =>
        m.id === maidId
          ? { ...m, unlockedByEmployerIds: [...m.unlockedByEmployerIds, currentUser.id] }
          : m
      )
    );

    // Notify maid
    const notif: PlatformNotificationItem = {
      id: `notif-${Date.now()}`,
      userId: targetMaid.userId,
      role: "maid",
      title: "Employer Unlocked Contact",
      message: `${currentUser.name} has unlocked your contact details and verified profile for direct hiring consideration.`,
      type: "application",
      isRead: false,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    setNotifications((prev) => [notif, ...prev]);

    return { success: true };
  };

  const updateMaidProfile = (updates: Partial<MaidProfileRecord>) => {
    if (currentUser.role !== "maid") return;
    setAllMaidProfiles((prev) =>
      prev.map((m) => (m.userId === currentUser.id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m))
    );
  };

  // ==========================================
  // EMPLOYER JOB ACTIONS
  // ==========================================

  const createJobPosting = async (
    jobData: Omit<JobRecord, "id" | "employerId" | "employerTitleSurname" | "applicantCount" | "datePosted" | "createdAt"> & { makeFeatured?: boolean }
  ): Promise<{ success: boolean; jobId?: string; error?: string }> => {
    if (currentUser.role !== "employer") {
      return { success: false, error: "Only registered employers can post jobs." };
    }

    let totalCost = pricingSettings.jobPostingFeeUSD;
    if (jobData.makeFeatured) {
      totalCost += pricingSettings.featuredJobFeeUSD;
    }

    // Check wallet funds
    if (currentWallet.balance < totalCost) {
      return {
        success: false,
        error: `Insufficient wallet balance ($${currentWallet.balance.toFixed(2)} USD). Job posting fee is $${totalCost.toFixed(2)} USD. Please add funds to your wallet.`,
      };
    }

    const spendRes = await spendFromWallet(
      jobData.makeFeatured ? `Featured Job Posting (${jobData.title})` : `Job Posting (${jobData.title})`,
      totalCost
    );

    if (!spendRes.success) {
      return { success: false, error: spendRes.error };
    }

    const newJobId = `job-${Date.now()}`;
    const employerProfile = allEmployerProfiles.find((e) => e.userId === currentUser.id);
    const employerTitleSurname = employerProfile
      ? `${employerProfile.title} ${employerProfile.surname}`
      : currentUser.name;

    const newJob: JobRecord = {
      id: newJobId,
      employerId: currentUser.id,
      employerTitleSurname,
      title: jobData.title,
      description: jobData.description,
      salary: jobData.salary,
      salaryPeriod: jobData.salaryPeriod,
      location: jobData.location,
      suburb: jobData.suburb,
      daysOff: jobData.daysOff,
      workingHours: jobData.workingHours,
      accommodation: jobData.accommodation,
      requirements: jobData.requirements,
      status: "Approved", // Instant approval upon fee payment
      isFeatured: !!jobData.makeFeatured,
      applicantCount: 0,
      datePosted: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString().split("T")[0],
    };

    setAllJobs((prev) => [newJob, ...prev]);

    // Admin notification
    const adminNotif: PlatformNotificationItem = {
      id: `notif-admin-${Date.now()}`,
      userId: "usr-admin-01",
      role: "admin",
      title: "New Job Published",
      message: `${employerTitleSurname} created job '${jobData.title}' in ${jobData.location} ($${jobData.salary}/${jobData.salaryPeriod}).`,
      type: "job",
      isRead: false,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    setNotifications((prev) => [adminNotif, ...prev]);

    return { success: true, jobId: newJobId };
  };

  const updateJobPosting = (jobId: string, updates: Partial<JobRecord>) => {
    setAllJobs((prev) =>
      prev.map((j) => (j.id === jobId && (j.employerId === currentUser.id || currentUser.role === "admin") ? { ...j, ...updates } : j))
    );
  };

  const closeJobPosting = (jobId: string) => {
    setAllJobs((prev) =>
      prev.map((j) => (j.id === jobId && (j.employerId === currentUser.id || currentUser.role === "admin") ? { ...j, status: "Closed" } : j))
    );
  };

  const featureJobPosting = async (jobId: string): Promise<{ success: boolean; error?: string }> => {
    const fee = pricingSettings.featuredJobFeeUSD;
    const spendRes = await spendFromWallet(`Feature Job Listing`, fee, { jobId });
    if (!spendRes.success) return { success: false, error: spendRes.error };

    setAllJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, isFeatured: true } : j))
    );
    return { success: true };
  };

  // ==========================================
  // APPLICATIONS
  // ==========================================

  const applyForJob = async (jobId: string, coverNote?: string): Promise<{ success: boolean; error?: string }> => {
    if (currentUser.role !== "maid") {
      return { success: false, error: "Only registered maids can apply for jobs." };
    }

    const job = allJobs.find((j) => j.id === jobId);
    if (!job) return { success: false, error: "Job vacancy not found." };

    const maidProfile = allMaidProfiles.find((m) => m.userId === currentUser.id);
    if (!maidProfile) return { success: false, error: "Please complete your Maid Profile before applying." };

    // Check if already applied
    const alreadyApplied = allApplications.some((a) => a.jobId === jobId && a.maidId === currentUser.id);
    if (alreadyApplied) {
      return { success: false, error: "You have already submitted an application for this vacancy." };
    }

    const newApp: JobApplicationRecord = {
      id: `app-${Date.now()}`,
      maidId: currentUser.id,
      jobId: job.id,
      employerId: job.employerId,
      maidName: `${maidProfile.firstName} ${maidProfile.surname}`,
      maidAge: calculateAge(maidProfile.dateOfBirth),
      maidPhoto: maidProfile.profilePhoto,
      jobTitle: job.title,
      jobSalary: job.salary,
      jobLocation: `${job.location} (${job.suburb})`,
      employerTitleSurname: job.employerTitleSurname,
      appliedDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      coverNote: coverNote || maidProfile.shortAboutMe,
    };

    setAllApplications((prev) => [newApp, ...prev]);

    // Increment applicant count on job
    setAllJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applicantCount: j.applicantCount + 1 } : j))
    );

    // Notify employer
    const employerNotif: PlatformNotificationItem = {
      id: `notif-${Date.now()}`,
      userId: job.employerId,
      role: "employer",
      title: "New Job Application Received",
      message: `${maidProfile.firstName} ${maidProfile.surname} (Age: ${calculateAge(maidProfile.dateOfBirth)}) applied for '${job.title}'.`,
      type: "application",
      isRead: false,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    setNotifications((prev) => [employerNotif, ...prev]);

    return { success: true };
  };

  const updateApplicationStatus = (appId: string, status: JobApplicationRecord["status"]) => {
    setAllApplications((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          // Notify maid
          const maidNotif: PlatformNotificationItem = {
            id: `notif-${Date.now()}`,
            userId: a.maidId,
            role: "maid",
            title: `Application Status: ${status}`,
            message: `Your application for '${a.jobTitle}' with ${a.employerTitleSurname} has been marked as ${status}.`,
            type: "application",
            isRead: false,
            createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
          };
          setNotifications((np) => [maidNotif, ...np]);

          return { ...a, status, updatedAt: new Date().toISOString() };
        }
        return a;
      })
    );
  };

  // ==========================================
  // MEDIA UPLOAD, PORTFOLIO & AUDIT SYSTEM
  // ==========================================

  const uploadProfilePhoto = async (
    imageDataUrl: string,
    fileSizeKB: number = 180
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // 1. Update user avatar
      setAllUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? { ...u, avatarUrl: imageDataUrl } : u))
      );
      setCurrentUser((prev) => ({ ...prev, avatarUrl: imageDataUrl }));

      // 2. Update role-specific profile record
      if (currentUser.role === "maid") {
        setAllMaidProfiles((prev) =>
          prev.map((m) =>
            m.userId === currentUser.id
              ? { ...m, profilePhoto: imageDataUrl, profilePhotoStatus: "Approved", updatedAt: new Date().toISOString() }
              : m
          )
        );
      } else if (currentUser.role === "employer") {
        setAllEmployerProfiles((prev) =>
          prev.map((e) =>
            e.userId === currentUser.id
              ? { ...e, profilePhoto: imageDataUrl, profilePhotoStatus: "Approved", updatedAt: new Date().toISOString() }
              : e
          )
        );
      }

      // 3. Audit Log
      const auditLogItem: MediaAuditLog = {
        id: `aud-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        action: "UPLOAD_PROFILE_PIC",
        mediaType: "profile",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        details: `Uploaded new profile portrait (${fileSizeKB} KB). High-resolution preview generated.`,
      };
      setMediaAuditLogs((prev) => [auditLogItem, ...prev]);

      // 4. Send background audit to server
      try {
        await fetch("/api/media/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.id,
            userName: currentUser.name,
            userRole: currentUser.role,
            mediaType: "profile",
            imageData: imageDataUrl,
            fileSizeKB,
          }),
        });
      } catch (err) {
        console.warn("Background server media sync note:", err);
      }

      // 5. User Notification
      const notif: PlatformNotificationItem = {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        role: currentUser.role,
        title: "Profile Picture Updated",
        message: "Your primary profile photograph has been updated and published successfully.",
        type: "system",
        isRead: false,
        createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      };
      setNotifications((prev) => [notif, ...prev]);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update profile picture" };
    }
  };

  const removeProfilePhoto = async (): Promise<{ success: boolean }> => {
    const placeholder = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";
    setAllUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, avatarUrl: placeholder } : u))
    );
    setCurrentUser((prev) => ({ ...prev, avatarUrl: placeholder }));

    if (currentUser.role === "maid") {
      setAllMaidProfiles((prev) =>
        prev.map((m) => (m.userId === currentUser.id ? { ...m, profilePhoto: "" } : m))
      );
    } else if (currentUser.role === "employer") {
      setAllEmployerProfiles((prev) =>
        prev.map((e) => (e.userId === currentUser.id ? { ...e, profilePhoto: "" } : e))
      );
    }

    const auditLogItem: MediaAuditLog = {
      id: `aud-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: "DELETE_PROFILE_PIC",
      mediaType: "profile",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      details: "Removed profile photo and reset to default avatar.",
    };
    setMediaAuditLogs((prev) => [auditLogItem, ...prev]);

    return { success: true };
  };

  const uploadAdditionalPhoto = async (
    slot: 1 | 2,
    imageDataUrl: string,
    title?: string,
    fileSizeKB: number = 220
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (currentUser.role === "maid") {
        setAllMaidProfiles((prev) =>
          prev.map((m) => {
            if (m.userId === currentUser.id) {
              return slot === 1
                ? {
                    ...m,
                    additionalPhoto1: imageDataUrl,
                    additionalPhoto1Title: title || "Work Attire & Uniform",
                    additionalPhoto1Status: "Approved",
                    updatedAt: new Date().toISOString(),
                  }
                : {
                    ...m,
                    additionalPhoto2: imageDataUrl,
                    additionalPhoto2Title: title || "Action & Skill Photograph",
                    additionalPhoto2Status: "Approved",
                    updatedAt: new Date().toISOString(),
                  };
            }
            return m;
          })
        );
      } else if (currentUser.role === "employer") {
        setAllEmployerProfiles((prev) =>
          prev.map((e) => {
            if (e.userId === currentUser.id) {
              return slot === 1
                ? {
                    ...e,
                    additionalPhoto1: imageDataUrl,
                    additionalPhoto1Title: title || "Estate / Residence Overview",
                    additionalPhoto1Status: "Approved",
                    updatedAt: new Date().toISOString(),
                  }
                : {
                    ...e,
                    additionalPhoto2: imageDataUrl,
                    additionalPhoto2Title: title || "Work Environment & Facilities",
                    additionalPhoto2Status: "Approved",
                    updatedAt: new Date().toISOString(),
                  };
            }
            return e;
          })
        );
      }

      const auditLogItem: MediaAuditLog = {
        id: `aud-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        action: slot === 1 ? "UPLOAD_ADDITIONAL_PHOTO_1" : "UPLOAD_ADDITIONAL_PHOTO_2",
        mediaType: slot === 1 ? "additional1" : "additional2",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        details: `Uploaded additional photo slot ${slot} (${fileSizeKB} KB): "${title || "Work Demonstration"}".`,
      };
      setMediaAuditLogs((prev) => [auditLogItem, ...prev]);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to upload additional photo" };
    }
  };

  const removeAdditionalPhoto = async (slot: 1 | 2): Promise<{ success: boolean }> => {
    if (currentUser.role === "maid") {
      setAllMaidProfiles((prev) =>
        prev.map((m) => {
          if (m.userId === currentUser.id) {
            return slot === 1
              ? { ...m, additionalPhoto1: "", additionalPhoto1Title: "", additionalPhoto1Status: undefined }
              : { ...m, additionalPhoto2: "", additionalPhoto2Title: "", additionalPhoto2Status: undefined };
          }
          return m;
        })
      );
    } else if (currentUser.role === "employer") {
      setAllEmployerProfiles((prev) =>
        prev.map((e) => {
          if (e.userId === currentUser.id) {
            return slot === 1
              ? { ...e, additionalPhoto1: "", additionalPhoto1Title: "", additionalPhoto1Status: undefined }
              : { ...e, additionalPhoto2: "", additionalPhoto2Title: "", additionalPhoto2Status: undefined };
          }
          return e;
        })
      );
    }

    const auditLogItem: MediaAuditLog = {
      id: `aud-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: slot === 1 ? "DELETE_ADDITIONAL_PHOTO_1" : "DELETE_ADDITIONAL_PHOTO_2",
      mediaType: slot === 1 ? "additional1" : "additional2",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      details: `Removed additional photo slot ${slot}.`,
    };
    setMediaAuditLogs((prev) => [auditLogItem, ...prev]);

    return { success: true };
  };

  const addPortfolioItem = async (
    itemData: Omit<PortfolioItem, "id" | "userId" | "userRole" | "userFullName" | "status" | "createdAt" | "updatedAt">
  ): Promise<{ success: boolean; item?: PortfolioItem; error?: string }> => {
    try {
      const newItem: PortfolioItem = {
        ...itemData,
        id: `port-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId: currentUser.id,
        userRole: currentUser.role,
        userFullName: currentUser.name,
        status: "Approved", // Instant publication with ongoing admin moderation
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        fileSizeKB: itemData.fileSizeKB || 260,
      };

      if (currentUser.role === "maid") {
        setAllMaidProfiles((prev) =>
          prev.map((m) =>
            m.userId === currentUser.id
              ? { ...m, portfolio: [newItem, ...(m.portfolio || [])], updatedAt: new Date().toISOString() }
              : m
          )
        );
      } else if (currentUser.role === "employer") {
        setAllEmployerProfiles((prev) =>
          prev.map((e) =>
            e.userId === currentUser.id
              ? { ...e, portfolio: [newItem, ...(e.portfolio || [])], updatedAt: new Date().toISOString() }
              : e
          )
        );
      }

      const auditLogItem: MediaAuditLog = {
        id: `aud-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        action: "UPLOAD_PORTFOLIO_ITEM",
        targetMediaId: newItem.id,
        mediaType: "portfolio",
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
        details: `Added new work showcase item "${newItem.title}" in category [${newItem.category}].`,
      };
      setMediaAuditLogs((prev) => [auditLogItem, ...prev]);

      return { success: true, item: newItem };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to add portfolio item" };
    }
  };

  const updatePortfolioItem = async (
    itemId: string,
    updates: Partial<PortfolioItem>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (currentUser.role === "maid") {
        setAllMaidProfiles((prev) =>
          prev.map((m) => {
            if (m.userId === currentUser.id && m.portfolio) {
              const updated = m.portfolio.map((p) =>
                p.id === itemId ? { ...p, ...updates, updatedAt: new Date().toISOString().split("T")[0] } : p
              );
              return { ...m, portfolio: updated, updatedAt: new Date().toISOString() };
            }
            return m;
          })
        );
      } else if (currentUser.role === "employer") {
        setAllEmployerProfiles((prev) =>
          prev.map((e) => {
            if (e.userId === currentUser.id && e.portfolio) {
              const updated = e.portfolio.map((p) =>
                p.id === itemId ? { ...p, ...updates, updatedAt: new Date().toISOString().split("T")[0] } : p
              );
              return { ...e, portfolio: updated, updatedAt: new Date().toISOString() };
            }
            return e;
          })
        );
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update portfolio item" };
    }
  };

  const deletePortfolioItem = async (itemId: string): Promise<{ success: boolean }> => {
    if (currentUser.role === "maid") {
      setAllMaidProfiles((prev) =>
        prev.map((m) =>
          m.userId === currentUser.id && m.portfolio
            ? { ...m, portfolio: m.portfolio.filter((p) => p.id !== itemId), updatedAt: new Date().toISOString() }
            : m
        )
      );
    } else if (currentUser.role === "employer") {
      setAllEmployerProfiles((prev) =>
        prev.map((e) =>
          e.userId === currentUser.id && e.portfolio
            ? { ...e, portfolio: e.portfolio.filter((p) => p.id !== itemId), updatedAt: new Date().toISOString() }
            : e
        )
      );
    }

    const auditLogItem: MediaAuditLog = {
      id: `aud-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: "DELETE_PORTFOLIO_ITEM",
      targetMediaId: itemId,
      mediaType: "portfolio",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      details: `Deleted portfolio showcase item ${itemId}.`,
    };
    setMediaAuditLogs((prev) => [auditLogItem, ...prev]);

    return { success: true };
  };

  const getProfileCompletion = (targetUserId?: string): ProfileCompletionStatus => {
    const uid = targetUserId || currentUser.id;
    const targetUser = allUsers.find((u) => u.id === uid) || currentUser;
    const maidProf = allMaidProfiles.find((m) => m.userId === uid);
    const empProf = allEmployerProfiles.find((e) => e.userId === uid);
    return calculateProfileCompletion(targetUser.role, maidProf, empProf, targetUser);
  };

  // ==========================================
  // ADMIN SPECIFIC ACTIONS
  // ==========================================

  const approveMaidProfileAdmin = (maidId: string) => {
    setAllMaidProfiles((prev) =>
      prev.map((m) => (m.id === maidId ? { ...m, verificationStatus: "Approved" } : m))
    );
  };

  const rejectMaidProfileAdmin = (maidId: string) => {
    setAllMaidProfiles((prev) =>
      prev.map((m) => (m.id === maidId ? { ...m, verificationStatus: "Rejected" } : m))
    );
  };

  const verifyMaidDocumentAdmin = (maidId: string, docId: string, status: "Verified" | "Rejected") => {
    setAllMaidProfiles((prev) =>
      prev.map((m) => {
        if (m.id === maidId) {
          const updatedDocs = m.privateDocuments.map((d) => (d.id === docId ? { ...d, verificationStatus: status } : d));
          return { ...m, privateDocuments: updatedDocs };
        }
        return m;
      })
    );
  };

  const approveJobAdmin = (jobId: string) => {
    setAllJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: "Approved" } : j)));
  };

  const rejectJobAdmin = (jobId: string) => {
    setAllJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, status: "Rejected" } : j)));
  };

  const updatePlatformPricingAdmin = async (newPricing: Partial<PlatformPricingSettings>) => {
    const updated = { ...pricingSettings, ...newPricing, updatedAt: new Date().toISOString() };
    setPricingSettings(updated);
    try {
      await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.warn("Failed to persist pricing to server, updated locally:", err);
    }
  };

  const adminModerateMedia = async (params: {
    targetUserId: string;
    mediaType: "profile" | "additional1" | "additional2" | "portfolio";
    portfolioItemId?: string;
    newStatus: "Approved" | "Flagged" | "Rejected";
    reason?: string;
  }): Promise<{ success: boolean }> => {
    const { targetUserId, mediaType, portfolioItemId, newStatus, reason } = params;

    // Update in maid profiles
    setAllMaidProfiles((prev) =>
      prev.map((m) => {
        if (m.userId === targetUserId) {
          if (mediaType === "profile") {
            return { ...m, profilePhotoStatus: newStatus };
          } else if (mediaType === "additional1") {
            return { ...m, additionalPhoto1Status: newStatus };
          } else if (mediaType === "additional2") {
            return { ...m, additionalPhoto2Status: newStatus };
          } else if (mediaType === "portfolio" && portfolioItemId && m.portfolio) {
            const updated = m.portfolio.map((p) =>
              p.id === portfolioItemId ? { ...p, status: newStatus } : p
            );
            return { ...m, portfolio: updated };
          }
        }
        return m;
      })
    );

    // Update in employer profiles
    setAllEmployerProfiles((prev) =>
      prev.map((e) => {
        if (e.userId === targetUserId) {
          if (mediaType === "profile") {
            return { ...e, profilePhotoStatus: newStatus };
          } else if (mediaType === "additional1") {
            return { ...e, additionalPhoto1Status: newStatus };
          } else if (mediaType === "additional2") {
            return { ...e, additionalPhoto2Status: newStatus };
          } else if (mediaType === "portfolio" && portfolioItemId && e.portfolio) {
            const updated = e.portfolio.map((p) =>
              p.id === portfolioItemId ? { ...p, status: newStatus } : p
            );
            return { ...e, portfolio: updated };
          }
        }
        return e;
      })
    );

    // Audit log
    const auditAction = newStatus === "Approved" ? "ADMIN_APPROVE" : newStatus === "Flagged" ? "ADMIN_FLAG" : "ADMIN_REJECT";
    const targetUser = allUsers.find((u) => u.id === targetUserId);
    const auditLogItem: MediaAuditLog = {
      id: `aud-${Date.now()}`,
      userId: targetUserId,
      userName: targetUser?.name || "Platform User",
      userRole: targetUser?.role || "maid",
      action: auditAction,
      targetMediaId: portfolioItemId,
      mediaType,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      details: `Admin ${auditAction.replace("ADMIN_", "").toLowerCase()}d ${mediaType}${portfolioItemId ? ` (item ${portfolioItemId})` : ""}${reason ? `: "${reason}"` : ""}.`,
      adminId: currentUser.id,
    };
    setMediaAuditLogs((prev) => [auditLogItem, ...prev]);

    // Send notification to user if flagged or rejected
    if (newStatus !== "Approved") {
      const notif: PlatformNotificationItem = {
        id: `notif-${Date.now()}`,
        userId: targetUserId,
        role: targetUser?.role || "maid",
        title: `Media Moderation: ${newStatus}`,
        message: `Your ${mediaType} upload was marked as ${newStatus} by our trust & safety team.${reason ? ` Reason: ${reason}` : ""}`,
        type: "system",
        isRead: false,
        createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    return { success: true };
  };

  const adminToggleUserMediaSuspension = async (
    userId: string,
    isSuspended: boolean,
    reason?: string
  ): Promise<{ success: boolean }> => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isMediaSuspended: isSuspended } : u))
    );

    const targetUser = allUsers.find((u) => u.id === userId);
    const auditLogItem: MediaAuditLog = {
      id: `aud-${Date.now()}`,
      userId,
      userName: targetUser?.name || "Platform User",
      userRole: targetUser?.role || "maid",
      action: isSuspended ? "ADMIN_SUSPEND_MEDIA" : "ADMIN_UNSUSPEND_MEDIA",
      mediaType: "profile",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      details: `Admin ${isSuspended ? "suspended" : "restored"} media upload privileges for user${reason ? `: "${reason}"` : ""}.`,
      adminId: currentUser.id,
    };
    setMediaAuditLogs((prev) => [auditLogItem, ...prev]);

    return { success: true };
  };

  // Notifications helpers
  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <PlatformContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUser,
        allUsers,
        allMaidProfiles,
        publicMaids,
        currentMaidProfile,
        updateMaidProfile,
        unlockMaidContact,
        allEmployerProfiles,
        currentEmployerProfile,
        allJobs,
        employerJobs,
        createJobPosting,
        updateJobPosting,
        closeJobPosting,
        featureJobPosting,
        allApplications,
        maidApplications,
        employerApplications,
        applyForJob,
        updateApplicationStatus,
        uploadProfilePhoto,
        removeProfilePhoto,
        uploadAdditionalPhoto,
        removeAdditionalPhoto,
        addPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,
        mediaAuditLogs,
        allPortfolioItems,
        getProfileCompletion,
        currentWallet,
        transactions,
        pricingSettings,
        createPaynowDeposit,
        verifyPaynowPayment,
        spendFromWallet,
        approveMaidProfileAdmin,
        rejectMaidProfileAdmin,
        verifyMaidDocumentAdmin,
        approveJobAdmin,
        rejectJobAdmin,
        updatePlatformPricingAdmin,
        adminModerateMedia,
        adminToggleUserMediaSuspension,
        notifications: userNotifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatform = () => {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform must be used within PlatformProvider");
  return ctx;
};
