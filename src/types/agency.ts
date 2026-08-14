import { CityLocation, UserRole } from "./marketplace";

export type AgencyApprovalStatus = "Approved" | "Pending Approval" | "Rejected" | "Suspended";

export type AgencySubscriptionStatus = "Active" | "Pending Verification" | "Expiring Soon" | "Expired" | "Suspended";

export type AgencyDocumentType = 
  | "Certificate of Incorporation"
  | "CR14/Company Registration"
  | "Proof of Business Address"
  | "National ID of Owner/Manager"
  | "Operating Licence"
  | "Tax Clearance (ITF263)"
  | "Other";

export interface AgencyVerificationDocument {
  id: string;
  type: AgencyDocumentType;
  name: string;
  fileUrl: string;
  uploadedAt: string;
  isVerified: boolean;
  notes?: string;
}

export interface AgencyContactPerson {
  fullName: string;
  position: string;
  phone: string;
  email: string;
}

export interface AgencyStaffMember {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "Owner" | "Recruitment Manager" | "Placement Officer" | "Staff";
  status: "Active" | "Invited" | "Suspended";
  joinedDate: string;
}

export interface AgencyPaymentRecord {
  id: string;
  agencyId: string;
  agencyName: string;
  amountUSD: number; // $50
  paymentMethod: "EcoCash";
  recipientName: string; // "Chenjerai"
  recipientEcoCashNumber: string; // "+263 785 458 828"
  senderPhoneNumber: string;
  transactionReference: string;
  proofOfPaymentUrl: string;
  proofFileName: string;
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  status: "Pending Review" | "Verified" | "Rejected";
  rejectionReason?: string;
  notes?: string;
  periodGrantedDays?: number; // 30 days
}

export interface AgencySubscription {
  status: AgencySubscriptionStatus;
  planName: string; // "Agency Standard Monthly"
  monthlyFeeUSD: number; // 50
  currentPeriodStart: string;
  currentPeriodEnd: string;
  gracePeriodEnd: string;
  daysRemaining: number;
  lastPaymentDate?: string;
  pendingPaymentRecord?: AgencyPaymentRecord;
  paymentHistory: AgencyPaymentRecord[];
  reminderSchedule: {
    sevenDaysBeforeSent: boolean;
    threeDaysBeforeSent: boolean;
    expiryDateSent: boolean;
    sevenDaysAfterSent: boolean;
  };
}

export interface AgencyPlacement {
  id: string;
  agencyId: string;
  agencyName: string;
  workerId: string;
  workerName: string;
  employerName: string;
  employerPhone: string;
  role: UserRole;
  city: CityLocation;
  agreedMonthlySalaryUSD: number;
  placementDate: string;
  status: "Active" | "Probation" | "Completed" | "Disputed";
  contractType: "Full-Time Live-In" | "Full-Time Live-Out" | "Part-Time" | "Temporary";
}

export interface AgencyProfile {
  id: string;
  name: string; // Agency Name
  tradingName?: string;
  businessRegNumber?: string;
  physicalAddress: string;
  city: CityLocation;
  province: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  website?: string;
  logoUrl: string;
  description: string;
  yearsInOperation: number;
  contactPerson: AgencyContactPerson;
  verificationDocuments: AgencyVerificationDocument[];
  approvalStatus: AgencyApprovalStatus;
  isVerified: boolean; // Verified Agency Badge
  subscription: AgencySubscription;
  staffMembers: AgencyStaffMember[];
  workerCount: number;
  activeJobsCount: number;
  placementsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AgencyRegistrationFormInput {
  // Business Information
  name: string;
  tradingName?: string;
  businessRegNumber?: string;
  physicalAddress: string;
  city: CityLocation;
  province: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  website?: string;
  logoUrl?: string;
  description: string;
  yearsInOperation: number;

  // Contact Person
  contactPerson: AgencyContactPerson;

  // Documents
  documents: {
    type: AgencyDocumentType;
    name: string;
    fileUrl: string;
  }[];

  // Initial Payment (optional during registration or submit immediately)
  ecoCashSenderPhone?: string;
  ecoCashTransactionRef?: string;
  proofOfPaymentUrl?: string;
  proofFileName?: string;
}
