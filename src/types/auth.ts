import { CityLocation, UserRole } from "./marketplace";
import { AgencyProfile, AgencyPaymentRecord, AgencyRegistrationFormInput, AgencyStaffMember } from "./agency";

export type AuthAccountType = "Admin" | "Employer" | "Worker" | "Agency";

export type ApprovalStatus = "Approved" | "Pending Approval" | "Rejected" | "Suspended";

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  firstName?: string;
  surname?: string;
  role: AuthAccountType;
  specificProfession?: UserRole; // e.g. "Maid", "Nanny", "Caregiver" if worker
  city: CityLocation;
  suburb?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  avatarUrl?: string;
  qualifications?: string[];
  nationalIdNumber?: string;
  nationalIdDocUrl?: string;
  nationalIdFileName?: string;
  bio?: string;
  hourlyRateUSD?: number;
  monthlyRateUSD?: number;
  experienceYears?: number;
  skills?: string[];
  isFeatured?: boolean;
  featuredExpiresAt?: string;
  authProvider: "email" | "google" | "facebook";
  approvalStatus: ApprovalStatus;
  joinedDate: string;
  isVerified?: boolean;
  agencyId?: string;
  agencyName?: string;
  isAgencyVerified?: boolean;
  agencySubscriptionStatus?: string;
}

export interface AuthContextType {
  currentUser: UserSession | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isEditProfileModalOpen: boolean;
  setIsEditProfileModalOpen: (open: boolean) => void;
  authModalTab: "signin" | "signup" | "demo" | "agency-signup";
  setAuthModalTab: (tab: "signin" | "signup" | "demo" | "agency-signup") => void;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signupWithEmail: (data: {
    fullName: string;
    email: string;
    password: string;
    accountType: AuthAccountType;
    city: CityLocation;
    phoneNumber: string;
    specificProfession?: UserRole;
    agencyName?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  loginWithSocial: (provider: "google" | "facebook", accountType?: AuthAccountType) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchDemoUser: (role: AuthAccountType) => void;
  updateUserProfile: (updates: Partial<UserSession>) => Promise<{ success: boolean; error?: string }>;
  featureUserProfile: (feeUSD?: number) => Promise<{ success: boolean; error?: string }>;
  
  // Agency Ecosystem State & Handlers
  agencies: AgencyProfile[];
  currentAgency: AgencyProfile | null;
  registerAgency: (input: AgencyRegistrationFormInput) => { success: boolean; agencyId: string };
  approveAgency: (agencyId: string) => void;
  rejectAgency: (agencyId: string, reason?: string) => void;
  toggleAgencySuspension: (agencyId: string) => void;
  submitAgencySubscriptionPayment: (
    agencyId: string,
    payment: {
      senderPhoneNumber: string;
      transactionReference: string;
      proofOfPaymentUrl?: string;
      proofFileName?: string;
      notes?: string;
    }
  ) => void;
  verifyAgencySubscriptionPayment: (
    agencyId: string,
    paymentId: string,
    approved: boolean,
    rejectionReason?: string
  ) => void;
  addAgencyWorker: (agencyId: string, worker: any) => void;
  updateAgencyWorker: (agencyId: string, workerId: string, updates: any) => void;
  archiveAgencyWorker: (agencyId: string, workerId: string) => void;
  deleteAgencyWorker: (agencyId: string, workerId: string) => void;
  addAgencyJob: (agencyId: string, job: any) => void;
  updateAgencyJob: (agencyId: string, jobId: string, updates: any) => void;
  closeAgencyJob: (agencyId: string, jobId: string) => void;
  addAgencyStaff: (agencyId: string, staff: Omit<AgencyStaffMember, "id" | "joinedDate">) => void;
  updateAgencyProfileDetails: (agencyId: string, updates: Partial<AgencyProfile>) => void;
  
  // Pending worker & job approvals state managed centrally
  pendingWorkerProfiles: any[];
  approvedWorkerProfiles: any[];
  approveWorkerProfile: (id: string) => void;
  rejectWorkerProfile: (id: string, reason?: string) => void;
  
  pendingJobPostings: any[];
  approvedJobPostings: any[];
  approveJobPosting: (id: string) => void;
  rejectJobPosting: (id: string, reason?: string) => void;
}

