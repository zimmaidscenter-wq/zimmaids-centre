import React, { createContext, useContext, useState, useEffect } from "react";
import { UserSession, AuthAccountType, ApprovalStatus, AuthContextType } from "../types/auth";
import { CityLocation, UserRole } from "../types/marketplace";
import { AgencyProfile, AgencyPaymentRecord, AgencyRegistrationFormInput, AgencyStaffMember } from "../types/agency";
import { INITIAL_AGENCIES } from "../data/agencyData";

// Default Pre-Configured Users
export const PRECONFIGURED_USERS: Record<AuthAccountType, UserSession> = {
  Admin: {
    id: "usr-admin-01",
    email: "zimmaidscentre@gmail.com",
    fullName: "Tafadzwa Tagwirei (Master Admin)",
    role: "Admin",
    city: "Harare",
    phoneNumber: "+263 785 458 828",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    authProvider: "email",
    approvalStatus: "Approved",
    joinedDate: "2026-01-01",
    isVerified: true,
  },
  Agency: {
    id: "usr-agency-01",
    email: "florence@premierdomestic.co.zw",
    fullName: "Mrs. Florence Chitembwe (Agency Owner)",
    role: "Agency",
    city: "Harare",
    phoneNumber: "+263 772 450 119",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    authProvider: "email",
    approvalStatus: "Approved",
    joinedDate: "2021-03-01",
    isVerified: true,
    agencyId: "agency-harare-01",
    agencyName: "Premier Domestic Staffing Agency",
    isAgencyVerified: true,
    agencySubscriptionStatus: "Active",
  },
  Employer: {
    id: "usr-employer-01",
    email: "margaret@homeowner.co.zw",
    fullName: "Mrs. Margaret Chigumba (Client)",
    role: "Employer",
    city: "Harare",
    phoneNumber: "+263 772 345 678",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    authProvider: "google",
    approvalStatus: "Approved",
    joinedDate: "2026-03-15",
    isVerified: true,
  },
  Worker: {
    id: "usr-worker-01",
    email: "sizani.ndlovu@gmail.com",
    fullName: "Sizani Ndlovu (Employee)",
    role: "Worker",
    specificProfession: "Caregiver",
    city: "Harare",
    phoneNumber: "+263 771 902 441",
    avatarUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200",
    authProvider: "facebook",
    approvalStatus: "Approved",
    joinedDate: "2026-04-10",
    isVerified: true,
  },
};

// Initial Seed Data for Pending & Approved Worker Profiles
const INITIAL_WORKER_PROFILES = [
  {
    id: "w-approved-1",
    fullName: "Sizani Ndlovu",
    role: "Caregiver & Nurse Aide",
    city: "Harare",
    suburb: "Avondale",
    hourlyRateUSD: 5,
    monthlyRateUSD: 280,
    experienceYears: 7,
    approvalStatus: "Approved" as ApprovalStatus,
    verifications: { idCheck: true, policeClearance: true, referenceVerified: true, medicalCert: true },
    isVerified: true,
    bio: "Certified nurse aide with 7 years elderly care experience. ZRP police cleared.",
    photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
    submittedDate: "2026-08-01 09:15",
    policeClearanceNo: "ZRP-P26-90112",
  },
  {
    id: "w-approved-2",
    fullName: "Chipo Moyo",
    role: "Nanny & Housekeeper",
    city: "Harare",
    suburb: "Borrowdale",
    hourlyRateUSD: 4,
    monthlyRateUSD: 220,
    experienceYears: 6,
    approvalStatus: "Approved" as ApprovalStatus,
    verifications: { idCheck: true, policeClearance: true, referenceVerified: true, medicalCert: true },
    isVerified: true,
    bio: "Experienced live-in nanny and housekeeper. Red Cross First Aid certified.",
    photoUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400",
    submittedDate: "2026-08-02 11:30",
    policeClearanceNo: "ZRP-P26-88194",
  },
  {
    id: "v101",
    fullName: "Tariro Chikwanha",
    role: "Nurse Aide & Caregiver",
    city: "Harare",
    suburb: "Borrowdale",
    hourlyRateUSD: 6,
    monthlyRateUSD: 300,
    experienceYears: 5,
    approvalStatus: "Pending Approval" as ApprovalStatus,
    verifications: { idCheck: true, policeClearance: true, referenceVerified: false, medicalCert: true },
    isVerified: false,
    bio: "Dedicated caregiver looking for live-in or day duty in Harare low density suburbs. Certified in Red Cross Home Nursing.",
    photoUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400",
    submittedDate: "2026-08-12 14:20",
    policeClearanceNo: "ZRP CID Clearance Ref # 2026/8821",
    idDocUrl: "National ID 63-299102-X-42",
  },
  {
    id: "v102",
    fullName: "Knowledge Moyo",
    role: "Electrician",
    city: "Bulawayo",
    suburb: "Suburbs",
    hourlyRateUSD: 10,
    monthlyRateUSD: 450,
    experienceYears: 8,
    approvalStatus: "Pending Approval" as ApprovalStatus,
    verifications: { idCheck: true, policeClearance: true, referenceVerified: true, medicalCert: false },
    isVerified: false,
    bio: "Class 1 Journeyman Electrician specializing in residential solar inverter systems and generator wiring.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    submittedDate: "2026-08-12 15:05",
    policeClearanceNo: "ZRP CID Clearance Ref # 2026/9930",
    idDocUrl: "National ID 08-112093-Y-12",
  },
  {
    id: "v103",
    fullName: "Grace Mutambara",
    role: "Housekeeper",
    city: "Mutare",
    suburb: "Greendale",
    hourlyRateUSD: 4,
    monthlyRateUSD: 200,
    experienceYears: 4,
    approvalStatus: "Pending Approval" as ApprovalStatus,
    verifications: { idCheck: true, policeClearance: true, referenceVerified: false, medicalCert: true },
    isVerified: false,
    bio: "Hardworking housekeeper skilled in deep cleaning, steam ironing, and traditional cooking.",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    submittedDate: "2026-08-12 16:11",
    policeClearanceNo: "ZRP CID Clearance Ref # 2026/1042",
    idDocUrl: "National ID 75-883910-W-19",
  },
];

// Initial Seed Data for Pending & Approved Job Postings
const INITIAL_JOB_POSTINGS = [
  {
    id: "j-approved-1",
    title: "Live-In Nanny & Cook for Borrowdale Family",
    roleNeeded: "Nanny",
    employerName: "Mrs. Margaret Chigumba",
    city: "Harare",
    suburb: "Borrowdale",
    offeredSalaryUSD: 350,
    payFrequency: "Monthly",
    workType: "Live-In",
    description: "Seeking a caring nanny to assist with 2 young children, light housekeeping, and evening meals.",
    requiredSkills: ["Infant Care", "Cooking", "First Aid"],
    postedDate: "2026-08-01",
    applicantCount: 12,
    status: "Approved" as ApprovalStatus,
    urgent: true,
  },
  {
    id: "j-approved-2",
    title: "Solar Inverter Maintenance & Battery Wiring",
    roleNeeded: "Electrician",
    employerName: "Tafadzwa Mutasa",
    city: "Harare",
    suburb: "Avondale",
    offeredSalaryUSD: 150,
    payFrequency: "One-Time Task",
    workType: "One-Time Task",
    description: "Fault finding on 5kVA Deye Solar Inverter and 48V Lithium Battery Bank installation.",
    requiredSkills: ["Inverter Wiring", "Solar PV", "Class 1 Journeyman"],
    postedDate: "2026-08-05",
    applicantCount: 5,
    status: "Approved" as ApprovalStatus,
    urgent: false,
  },
  {
    id: "j-pending-101",
    title: "Full-Time Executive Housekeeper & Steam Ironer",
    roleNeeded: "Housekeeper",
    employerName: "Dr. Nyasha Tagwirei",
    city: "Harare",
    suburb: "Mount Pleasant",
    offeredSalaryUSD: 260,
    payFrequency: "Monthly",
    workType: "Full-Time",
    description: "Looking for an experienced housekeeper for daily residence cleaning, laundry, steam ironing, and organizing.",
    requiredSkills: ["Deep Cleaning", "Steam Ironing", "Punctual"],
    postedDate: "2026-08-12",
    applicantCount: 0,
    status: "Pending Approval" as ApprovalStatus,
    urgent: true,
  },
  {
    id: "j-pending-102",
    title: "Part-Time Weekend Gardener & Lawn Mowing",
    roleNeeded: "Gardener",
    employerName: "Eng. Farai Sibanda",
    city: "Bulawayo",
    suburb: "Suburbs",
    offeredSalaryUSD: 110,
    payFrequency: "Monthly",
    workType: "Part-Time",
    description: "Lawn mowing, hedge trimming, and flowerbed maintenance 2 Saturdays per month.",
    requiredSkills: ["Lawn Mowing", "Hedge Trimming", "Landscaping"],
    postedDate: "2026-08-12",
    applicantCount: 0,
    status: "Pending Approval" as ApprovalStatus,
    urgent: false,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // New visitors land as unauthenticated guests so they can register or sign in
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"signin" | "signup" | "demo" | "agency-signup">("signup");

  // Agencies Database
  const [agencies, setAgencies] = useState<AgencyProfile[]>(INITIAL_AGENCIES);

  // Worker profiles state
  const [allWorkerProfiles, setAllWorkerProfiles] = useState(INITIAL_WORKER_PROFILES);
  // Job postings state
  const [allJobPostings, setAllJobPostings] = useState(INITIAL_JOB_POSTINGS);

  // Current Agency (if logged-in user is an agency)
  const currentAgency = currentUser?.agencyId
    ? agencies.find((a) => a.id === currentUser.agencyId) || null
    : currentUser?.role === "Agency"
    ? agencies[0] || null
    : null;

  // Computed arrays
  const pendingWorkerProfiles = allWorkerProfiles.filter((w) => w.approvalStatus === "Pending Approval");
  const approvedWorkerProfiles = allWorkerProfiles.filter((w) => w.approvalStatus === "Approved");

  const pendingJobPostings = allJobPostings.filter((j) => j.status === "Pending Approval");
  const approvedJobPostings = allJobPostings.filter((j) => j.status === "Approved");

  // Auth actions
  const loginWithEmail = (email: string, pass: string): boolean => {
    // Check against preconfigured
    const found = Object.values(PRECONFIGURED_USERS).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (found) {
      setCurrentUser(found);
      setIsAuthModalOpen(false);
      return true;
    }

    // Check if matching any registered agency
    const agencyMatch = agencies.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (agencyMatch) {
      const agencySession: UserSession = {
        id: `usr-agency-${agencyMatch.id}`,
        email: agencyMatch.email,
        fullName: agencyMatch.contactPerson.fullName,
        role: "Agency",
        city: agencyMatch.city,
        phoneNumber: agencyMatch.phone,
        avatarUrl: agencyMatch.logoUrl,
        authProvider: "email",
        approvalStatus: agencyMatch.approvalStatus,
        joinedDate: agencyMatch.createdAt,
        isVerified: agencyMatch.isVerified,
        agencyId: agencyMatch.id,
        agencyName: agencyMatch.name,
        isAgencyVerified: agencyMatch.isVerified,
        agencySubscriptionStatus: agencyMatch.subscription.status,
      };
      setCurrentUser(agencySession);
      setIsAuthModalOpen(false);
      return true;
    }

    // Create new custom user session
    const role: AuthAccountType = email.includes("admin")
      ? "Admin"
      : email.includes("agency")
      ? "Agency"
      : email.includes("worker")
      ? "Worker"
      : "Employer";

    const newUser: UserSession = {
      id: `usr-${Date.now()}`,
      email,
      fullName: email.split("@")[0].replace(".", " "),
      role,
      city: "Harare",
      authProvider: "email",
      approvalStatus: "Approved",
      joinedDate: new Date().toISOString().split("T")[0],
      isVerified: true,
      agencyId: role === "Agency" ? "agency-harare-01" : undefined,
      agencyName: role === "Agency" ? "Premier Domestic Staffing Agency" : undefined,
    };
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const signupWithEmail = (data: {
    fullName: string;
    email: string;
    password: string;
    accountType: AuthAccountType;
    city: CityLocation;
    phoneNumber: string;
    specificProfession?: UserRole;
    agencyName?: string;
  }) => {
    const isWorker = data.accountType === "Worker";
    const isAgency = data.accountType === "Agency";

    let createdAgencyId: string | undefined = undefined;

    if (isAgency) {
      createdAgencyId = `agency-${Date.now()}`;
      const newAgency: AgencyProfile = {
        id: createdAgencyId,
        name: data.agencyName || data.fullName,
        tradingName: data.agencyName,
        physicalAddress: `${data.city} Central Business District`,
        city: data.city,
        province: `${data.city} Province`,
        email: data.email,
        phone: data.phoneNumber,
        whatsappNumber: data.phoneNumber,
        logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200",
        description: `Registered domestic placement agency based in ${data.city}, Zimbabwe. Specializing in vetted domestic professionals.`,
        yearsInOperation: 1,
        contactPerson: {
          fullName: data.fullName,
          position: "Owner / Director",
          phone: data.phoneNumber,
          email: data.email,
        },
        verificationDocuments: [
          {
            id: `doc-${Date.now()}-1`,
            type: "National ID of Owner/Manager",
            name: `National_ID_${data.fullName.replace(/\s+/g, "_")}.pdf`,
            fileUrl: "https://zimmaidscentre.co.zw/docs/owner_id.pdf",
            uploadedAt: new Date().toISOString().split("T")[0],
            isVerified: false,
          },
        ],
        approvalStatus: "Pending Approval",
        isVerified: false,
        subscription: {
          status: "Pending Verification",
          planName: "Agency Standard Monthly",
          monthlyFeeUSD: 50,
          currentPeriodStart: new Date().toISOString().split("T")[0],
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          gracePeriodEnd: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          daysRemaining: 30,
          paymentHistory: [],
          reminderSchedule: {
            sevenDaysBeforeSent: false,
            threeDaysBeforeSent: false,
            expiryDateSent: false,
            sevenDaysAfterSent: false,
          },
        },
        staffMembers: [
          {
            id: `staff-${Date.now()}`,
            fullName: data.fullName,
            email: data.email,
            phone: data.phoneNumber,
            role: "Owner",
            status: "Active",
            joinedDate: new Date().toISOString().split("T")[0],
          },
        ],
        workerCount: 0,
        activeJobsCount: 0,
        placementsCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };

      setAgencies((prev) => [newAgency, ...prev]);
    }

    const newSession: UserSession = {
      id: `usr-${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
      role: data.accountType,
      specificProfession: data.specificProfession,
      city: data.city,
      phoneNumber: data.phoneNumber,
      authProvider: "email",
      approvalStatus: isWorker || isAgency ? "Pending Approval" : "Approved",
      joinedDate: new Date().toISOString().split("T")[0],
      isVerified: !isWorker && !isAgency,
      agencyId: createdAgencyId,
      agencyName: isAgency ? (data.agencyName || data.fullName) : undefined,
      isAgencyVerified: false,
      agencySubscriptionStatus: isAgency ? "Pending Verification" : undefined,
    };

    setCurrentUser(newSession);

    // If worker, also register in worker queue for Admin approval
    if (isWorker) {
      const newWorkerItem = {
        id: `v-${Date.now()}`,
        fullName: data.fullName,
        role: data.specificProfession || "Maid",
        city: data.city,
        suburb: "Central",
        hourlyRateUSD: 5,
        monthlyRateUSD: 220,
        experienceYears: 2,
        approvalStatus: "Pending Approval" as ApprovalStatus,
        verifications: { idCheck: true, policeClearance: false, referenceVerified: false, medicalCert: false },
        isVerified: false,
        bio: `Newly registered ${data.specificProfession || "domestic worker"} in ${data.city}. Awaiting ZRP police clearance verification.`,
        photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
        submittedDate: new Date().toISOString().replace("T", " ").substring(0, 16),
        policeClearanceNo: "ZRP Submission Pending",
        idDocUrl: `National ID Submission (${data.fullName})`,
      };
      setAllWorkerProfiles((prev) => [newWorkerItem, ...prev]);
    }

    setIsAuthModalOpen(false);
  };

  const loginWithSocial = (provider: "google" | "facebook", accountType: AuthAccountType = "Employer") => {
    const providerName = provider === "google" ? "Google" : "Facebook";
    const sampleNames = {
      Admin: "Admin Executive",
      Agency: `Premier Domestic Staffing (${providerName} Auth)`,
      Employer: `Client (${providerName} User)`,
      Worker: `Employee (${providerName} User)`,
    };

    const isAgency = accountType === "Agency";

    const newSession: UserSession = {
      id: `usr-${provider}-${Date.now()}`,
      email: `${provider}.${accountType.toLowerCase()}@social.zimmaids.co.zw`,
      fullName: sampleNames[accountType],
      role: accountType,
      city: "Harare",
      phoneNumber: "+263 785 458 828",
      avatarUrl: provider === "google"
        ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
        : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      authProvider: provider,
      approvalStatus: "Approved",
      joinedDate: new Date().toISOString().split("T")[0],
      isVerified: true,
      agencyId: isAgency ? "agency-harare-01" : undefined,
      agencyName: isAgency ? "Premier Domestic Staffing Agency" : undefined,
      isAgencyVerified: isAgency ? true : undefined,
      agencySubscriptionStatus: isAgency ? "Active" : undefined,
    };

    setCurrentUser(newSession);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchDemoUser = (role: AuthAccountType) => {
    setCurrentUser(PRECONFIGURED_USERS[role]);
  };

  // ==========================================
  // AGENCY MANAGEMENT METHODS
  // ==========================================

  const registerAgency = (input: AgencyRegistrationFormInput): { success: boolean; agencyId: string } => {
    const newAgencyId = `agency-${Date.now()}`;
    const today = new Date().toISOString().split("T")[0];
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const grace = new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const hasPayment = !!input.ecoCashTransactionRef;

    const paymentRecord: AgencyPaymentRecord | undefined = hasPayment
      ? {
          id: `pay-${Date.now()}`,
          agencyId: newAgencyId,
          agencyName: input.name,
          amountUSD: 50,
          paymentMethod: "Paynow Gateway",
          recipientName: "Paynow Zimbabwe Gateway",
          recipientEcoCashNumber: "Automated Paynow Clearing",
          senderPhoneNumber: input.ecoCashSenderPhone || input.phone,
          transactionReference: input.ecoCashTransactionRef || `MP${Date.now()}`,
          proofOfPaymentUrl: input.proofOfPaymentUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400",
          proofFileName: input.proofFileName || "Paynow_Receipt_Proof.png",
          submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
          status: "Pending Review",
          notes: "Initial registration monthly fee payment via Paynow Gateway.",
        }
      : undefined;

    const newAgency: AgencyProfile = {
      id: newAgencyId,
      name: input.name,
      tradingName: input.tradingName,
      businessRegNumber: input.businessRegNumber,
      physicalAddress: input.physicalAddress,
      city: input.city,
      province: input.province || `${input.city} Province`,
      email: input.email,
      phone: input.phone,
      whatsappNumber: input.whatsappNumber,
      website: input.website,
      logoUrl: input.logoUrl || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200",
      description: input.description,
      yearsInOperation: input.yearsInOperation || 1,
      contactPerson: input.contactPerson,
      verificationDocuments: input.documents.map((d, index) => ({
        id: `doc-${Date.now()}-${index}`,
        type: d.type,
        name: d.name,
        fileUrl: d.fileUrl,
        uploadedAt: today,
        isVerified: false,
      })),
      approvalStatus: "Pending Approval",
      isVerified: false,
      subscription: {
        status: hasPayment ? "Pending Verification" : "Pending Verification",
        planName: "Agency Standard Monthly",
        monthlyFeeUSD: 50,
        currentPeriodStart: today,
        currentPeriodEnd: expiry,
        gracePeriodEnd: grace,
        daysRemaining: 30,
        pendingPaymentRecord: paymentRecord,
        paymentHistory: [],
        reminderSchedule: {
          sevenDaysBeforeSent: false,
          threeDaysBeforeSent: false,
          expiryDateSent: false,
          sevenDaysAfterSent: false,
        },
      },
      staffMembers: [
        {
          id: `staff-${Date.now()}`,
          fullName: input.contactPerson.fullName,
          email: input.contactPerson.email,
          phone: input.contactPerson.phone,
          role: "Owner",
          status: "Active",
          joinedDate: today,
        },
      ],
      workerCount: 0,
      activeJobsCount: 0,
      placementsCount: 0,
      createdAt: today,
      updatedAt: today,
    };

    setAgencies((prev) => [newAgency, ...prev]);

    // Update current session to agency in Pending Approval
    const agencySession: UserSession = {
      id: `usr-agency-${newAgencyId}`,
      email: newAgency.email,
      fullName: newAgency.contactPerson.fullName,
      role: "Agency",
      city: newAgency.city,
      phoneNumber: newAgency.phone,
      avatarUrl: newAgency.logoUrl,
      authProvider: "email",
      approvalStatus: "Pending Approval",
      joinedDate: today,
      isVerified: false,
      agencyId: newAgencyId,
      agencyName: newAgency.name,
      isAgencyVerified: false,
      agencySubscriptionStatus: "Pending Verification",
    };
    setCurrentUser(agencySession);
    setIsAuthModalOpen(false);

    return { success: true, agencyId: newAgencyId };
  };

  const approveAgency = (agencyId: string) => {
    setAgencies((prev) =>
      prev.map((a) => {
        if (a.id === agencyId) {
          return {
            ...a,
            approvalStatus: "Approved",
            isVerified: true,
            updatedAt: new Date().toISOString().split("T")[0],
            verificationDocuments: a.verificationDocuments.map((doc) => ({ ...doc, isVerified: true })),
          };
        }
        return a;
      })
    );
    if (currentUser?.agencyId === agencyId) {
      setCurrentUser((prev) => (prev ? { ...prev, approvalStatus: "Approved", isVerified: true, isAgencyVerified: true } : null));
    }
  };

  const rejectAgency = (agencyId: string, reason?: string) => {
    setAgencies((prev) =>
      prev.map((a) => (a.id === agencyId ? { ...a, approvalStatus: "Rejected", updatedAt: new Date().toISOString().split("T")[0] } : a))
    );
    if (currentUser?.agencyId === agencyId) {
      setCurrentUser((prev) => (prev ? { ...prev, approvalStatus: "Rejected" } : null));
    }
  };

  const toggleAgencySuspension = (agencyId: string) => {
    setAgencies((prev) =>
      prev.map((a) => {
        if (a.id === agencyId) {
          const nextStatus: ApprovalStatus = a.approvalStatus === "Suspended" ? "Approved" : "Suspended";
          const nextSubStatus = nextStatus === "Suspended" ? "Suspended" : "Active";
          return {
            ...a,
            approvalStatus: nextStatus,
            subscription: { ...a.subscription, status: nextSubStatus },
            updatedAt: new Date().toISOString().split("T")[0],
          };
        }
        return a;
      })
    );
  };

  const submitAgencySubscriptionPayment = (
    agencyId: string,
    payment: {
      senderPhoneNumber: string;
      transactionReference: string;
      proofOfPaymentUrl?: string;
      proofFileName?: string;
      notes?: string;
    }
  ) => {
    const today = new Date().toISOString().replace("T", " ").substring(0, 16);
    const agency = agencies.find((a) => a.id === agencyId);
    if (!agency) return;

    const newPaymentRecord: AgencyPaymentRecord = {
      id: `pay-${Date.now()}`,
      agencyId,
      agencyName: agency.name,
      amountUSD: 50,
      paymentMethod: "Paynow Gateway",
      recipientName: "Paynow Zimbabwe Gateway",
      recipientEcoCashNumber: "Automated Paynow Clearing",
      senderPhoneNumber: payment.senderPhoneNumber,
      transactionReference: payment.transactionReference,
      proofOfPaymentUrl: payment.proofOfPaymentUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400",
      proofFileName: payment.proofFileName || "Paynow_Payment_Receipt.png",
      submittedAt: today,
      status: "Pending Review",
      notes: payment.notes,
    };

    setAgencies((prev) =>
      prev.map((a) => {
        if (a.id === agencyId) {
          return {
            ...a,
            subscription: {
              ...a.subscription,
              status: "Pending Verification",
              pendingPaymentRecord: newPaymentRecord,
            },
          };
        }
        return a;
      })
    );

    if (currentUser?.agencyId === agencyId) {
      setCurrentUser((prev) => (prev ? { ...prev, agencySubscriptionStatus: "Pending Verification" } : null));
    }
  };

  const verifyAgencySubscriptionPayment = (
    agencyId: string,
    paymentId: string,
    approved: boolean,
    rejectionReason?: string
  ) => {
    const today = new Date().toISOString().replace("T", " ").substring(0, 16);
    const dateOnly = new Date().toISOString().split("T")[0];
    const newEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const newGrace = new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    setAgencies((prev) =>
      prev.map((a) => {
        if (a.id === agencyId) {
          const pending = a.subscription.pendingPaymentRecord;
          if (approved) {
            const verifiedPayment: AgencyPaymentRecord = pending
              ? {
                  ...pending,
                  status: "Verified",
                  verifiedAt: today,
                  verifiedBy: "Master Admin (Tafadzwa Tagwirei)",
                  periodGrantedDays: 30,
                }
              : {
                  id: paymentId,
                  agencyId: a.id,
                  agencyName: a.name,
                  amountUSD: 50,
                  paymentMethod: "Paynow Gateway",
                  recipientName: "Paynow Zimbabwe Gateway",
                  recipientEcoCashNumber: "Automated Paynow Clearing",
                  senderPhoneNumber: a.phone,
                  transactionReference: `PAYNOW-${Date.now()}`,
                  proofOfPaymentUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400",
                  proofFileName: "Paynow_Admin_Verified.png",
                  submittedAt: today,
                  verifiedAt: today,
                  verifiedBy: "Master Admin (Tafadzwa Tagwirei)",
                  status: "Verified",
                  periodGrantedDays: 30,
                };

            return {
              ...a,
              approvalStatus: "Approved",
              isVerified: true,
              subscription: {
                ...a.subscription,
                status: "Active",
                currentPeriodStart: dateOnly,
                currentPeriodEnd: newEnd,
                gracePeriodEnd: newGrace,
                daysRemaining: 30,
                lastPaymentDate: dateOnly,
                pendingPaymentRecord: undefined,
                paymentHistory: [verifiedPayment, ...a.subscription.paymentHistory],
              },
            };
          } else {
            return {
              ...a,
              subscription: {
                ...a.subscription,
                status: "Expired",
                pendingPaymentRecord: pending
                  ? { ...pending, status: "Rejected", rejectionReason }
                  : undefined,
              },
            };
          }
        }
        return a;
      })
    );
  };

  const addAgencyWorker = (agencyId: string, worker: any) => {
    const agency = agencies.find((a) => a.id === agencyId);
    const agencyName = agency?.name || "Agency Managed";
    const newWorkerId = `w-agency-${Date.now()}`;

    const newWorkerItem = {
      id: newWorkerId,
      fullName: worker.fullName,
      role: worker.role || "Housekeeper",
      city: worker.city || agency?.city || "Harare",
      suburb: worker.suburb || "Central",
      hourlyRateUSD: worker.hourlyRateUSD || 5,
      monthlyRateUSD: worker.monthlyRateUSD || 220,
      experienceYears: worker.experienceYears || 3,
      approvalStatus: "Approved" as ApprovalStatus,
      verifications: { idCheck: true, policeClearance: true, referenceVerified: true, medicalCert: true },
      isVerified: true,
      agencyId,
      agencyName,
      isAgencyManaged: true,
      isAgencyVerified: agency?.isVerified || true,
      bio: worker.bio || `Vetted candidate managed by ${agencyName}.`,
      photoUrl: worker.photoUrl || worker.avatarUrl || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
      avatarUrl: worker.photoUrl || worker.avatarUrl || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
      submittedDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      policeClearanceNo: worker.policeClearanceNo || "ZRP Verified Ref # 2026/Agency",
      status: "Active",
      rating: 5.0,
      reviewCount: 1,
      skills: worker.skills || ["Professional Cleaning", "Ironing", "Cooking"],
      languages: worker.languages || ["English", "Shona"],
      availability: worker.availability || "Full-Time",
      age: worker.age || 28,
      gender: worker.gender || "Female",
      willingToLiveIn: worker.willingToLiveIn ?? true,
      willingToLiveOut: worker.willingToLiveOut ?? true,
      education: worker.education || "O-Level",
      aiTrustScore: 98,
    };

    setAllWorkerProfiles((prev) => [newWorkerItem, ...prev]);

    // Increment agency worker count
    setAgencies((prev) =>
      prev.map((a) => (a.id === agencyId ? { ...a, workerCount: a.workerCount + 1 } : a))
    );
  };

  const updateAgencyWorker = (agencyId: string, workerId: string, updates: any) => {
    setAllWorkerProfiles((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, ...updates } : w))
    );
  };

  const archiveAgencyWorker = (agencyId: string, workerId: string) => {
    setAllWorkerProfiles((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, status: w.status === "Archived" ? "Active" : "Archived" } : w))
    );
  };

  const deleteAgencyWorker = (agencyId: string, workerId: string) => {
    setAllWorkerProfiles((prev) => prev.filter((w) => w.id !== workerId));
    setAgencies((prev) =>
      prev.map((a) => (a.id === agencyId ? { ...a, workerCount: Math.max(0, a.workerCount - 1) } : a))
    );
  };

  const addAgencyJob = (agencyId: string, job: any) => {
    const agency = agencies.find((a) => a.id === agencyId);
    const newJob = {
      id: `job-agency-${Date.now()}`,
      title: job.title,
      roleNeeded: job.roleNeeded,
      employerName: `${agency?.name || "Agency"} (Client Vacancy)`,
      agencyId,
      agencyName: agency?.name,
      isAgencyVerified: agency?.isVerified || true,
      city: job.city || agency?.city || "Harare",
      suburb: job.suburb || "Central",
      offeredSalaryUSD: job.offeredSalaryUSD || 250,
      payFrequency: job.payFrequency || "Monthly",
      workType: job.workType || "Full-Time",
      description: job.description,
      requiredSkills: job.requiredSkills || ["Experienced", "Punctual"],
      postedDate: new Date().toISOString().split("T")[0],
      applicantCount: 0,
      status: "Open" as const,
      urgent: !!job.urgent,
      isFeatured: !!job.isFeatured,
    };

    setAllJobPostings((prev) => [newJob, ...prev]);
    setAgencies((prev) =>
      prev.map((a) => (a.id === agencyId ? { ...a, activeJobsCount: a.activeJobsCount + 1 } : a))
    );
  };

  const updateAgencyJob = (agencyId: string, jobId: string, updates: any) => {
    setAllJobPostings((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, ...updates } : j))
    );
  };

  const closeAgencyJob = (agencyId: string, jobId: string) => {
    setAllJobPostings((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: "Closed" as const } : j))
    );
    setAgencies((prev) =>
      prev.map((a) => (a.id === agencyId ? { ...a, activeJobsCount: Math.max(0, a.activeJobsCount - 1) } : a))
    );
  };

  const addAgencyStaff = (agencyId: string, staff: Omit<AgencyStaffMember, "id" | "joinedDate">) => {
    const newStaffMember: AgencyStaffMember = {
      ...staff,
      id: `staff-${Date.now()}`,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setAgencies((prev) =>
      prev.map((a) => (a.id === agencyId ? { ...a, staffMembers: [...a.staffMembers, newStaffMember] } : a))
    );
  };

  const updateAgencyProfileDetails = (agencyId: string, updates: Partial<AgencyProfile>) => {
    setAgencies((prev) =>
      prev.map((a) => (a.id === agencyId ? { ...a, ...updates, updatedAt: new Date().toISOString().split("T")[0] } : a))
    );
  };

  // Admin Profile Approval Powers
  const approveWorkerProfile = (id: string) => {
    setAllWorkerProfiles((prev) =>
      prev.map((w) => (w.id === id ? { ...w, approvalStatus: "Approved", isVerified: true } : w))
    );
  };

  const rejectWorkerProfile = (id: string) => {
    setAllWorkerProfiles((prev) =>
      prev.map((w) => (w.id === id ? { ...w, approvalStatus: "Rejected" } : w))
    );
  };

  // Admin Job Posting Approval Powers
  const approveJobPosting = (id: string) => {
    setAllJobPostings((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: "Approved" } : j))
    );
  };

  const rejectJobPosting = (id: string) => {
    setAllJobPostings((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: "Rejected" } : j))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        loginWithEmail,
        signupWithEmail,
        loginWithSocial,
        logout,
        switchDemoUser,
        agencies,
        currentAgency,
        registerAgency,
        approveAgency,
        rejectAgency,
        toggleAgencySuspension,
        submitAgencySubscriptionPayment,
        verifyAgencySubscriptionPayment,
        addAgencyWorker,
        updateAgencyWorker,
        archiveAgencyWorker,
        deleteAgencyWorker,
        addAgencyJob,
        updateAgencyJob,
        closeAgencyJob,
        addAgencyStaff,
        updateAgencyProfileDetails,
        pendingWorkerProfiles,
        approvedWorkerProfiles,
        approveWorkerProfile,
        rejectWorkerProfile,
        pendingJobPostings,
        approvedJobPostings,
        approveJobPosting,
        rejectJobPosting,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
