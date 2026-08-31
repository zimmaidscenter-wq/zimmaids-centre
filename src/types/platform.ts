// Platform Strict Separation Types: Maid, Employer, Admin, Wallet, Paynow, Jobs, Applications

export type UserRoleType = "maid" | "employer" | "admin";

export type PortfolioCategory =
  | "Cleaning Results"
  | "House Cleaning"
  | "Gardening & Landscaping"
  | "Cooking & Culinary"
  | "Cooking & Meal Prep"
  | "Childcare & Nannying"
  | "Childcare & Infant Care"
  | "Plumbing"
  | "Electrical"
  | "Carpentry"
  | "Painting & Decorating"
  | "Construction & Masonry"
  | "Elderly Care"
  | "Elderly & Patient Care"
  | "Laundry & Ironing"
  | "Housekeeping & Organization"
  | "General Maintenance"
  | "Residence & Accommodation"
  | "Workplace & Facility"
  | "Other Services";

export type PortfolioCategoryType = PortfolioCategory;

export interface PortfolioItem {
  id: string;
  userId: string; // Foreign key to User.id
  userRole: UserRoleType;
  userFullName: string;
  imageUrl: string;
  title: string;
  description: string;
  category: PortfolioCategory;
  date?: string;
  dateCompleted?: string;
  isBeforeAfter?: boolean;
  caption?: string;
  tags?: string[];
  status: "Approved" | "Pending Review" | "Pending" | "Flagged" | "Rejected";
  flagReason?: string;
  createdAt: string;
  updatedAt: string;
  fileSizeKB?: number;
  dimensions?: { width: number; height: number };
}

export interface MediaAuditLog {
  id: string;
  userId: string;
  userName?: string;
  userFullName?: string;
  userRole: UserRoleType;
  action:
    | "UPLOAD_PROFILE_PIC"
    | "REPLACE_PROFILE_PIC"
    | "DELETE_PROFILE_PIC"
    | "UPLOAD_ADDITIONAL_PHOTO_1"
    | "UPLOAD_ADDITIONAL_PHOTO_2"
    | "DELETE_ADDITIONAL_PHOTO"
    | "DELETE_ADDITIONAL_PHOTO_1"
    | "DELETE_ADDITIONAL_PHOTO_2"
    | "UPLOAD_PORTFOLIO_ITEM"
    | "DELETE_PORTFOLIO_ITEM"
    | "ADMIN_APPROVE"
    | "ADMIN_REJECT"
    | "ADMIN_FLAG"
    | "ADMIN_SUSPEND_USER"
    | "ADMIN_SUSPEND_MEDIA"
    | "ADMIN_UNSUSPEND_MEDIA";
  targetMediaId?: string;
  mediaType: "profile" | "additional1" | "additional2" | "portfolio" | "all";
  timestamp: string;
  details?: any;
  reason?: string;
  adminId?: string;
  actorId?: string;
}

export interface ProfileCompletionStatus {
  percentage: number;
  isComplete: boolean;
  checklist: {
    key: string;
    label: string;
    completed: boolean;
    weight: number;
    actionHint: string;
  }[];
}

export interface PlatformUser {
  id: string;
  role: UserRoleType;
  name: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  avatarUrl?: string;
  createdAt: string;
  status: "Active" | "Pending Approval" | "Suspended";
  isVerified?: boolean;
  isMediaSuspended?: boolean;
}

export interface PreviousEmploymentRecord {
  id: string;
  formerEmployerName: string;
  positionHeld: string;
  startDate: string;
  endDate: string;
  employerPhone: string;
  reasonForLeaving: string;
}

export interface PrivateWorkerDocument {
  id: string;
  type: "National ID" | "Certificate" | "Reference" | "Police Clearance";
  title: string;
  documentNumber?: string;
  fileUrl: string;
  fileType: "pdf" | "image";
  uploadedAt: string;
  fileSize?: string;
  verificationStatus: "Verified" | "Pending Review" | "Rejected" | "Not Submitted";
  adminNotes?: string;
}

export interface MaidProfileRecord {
  id: string;
  userId: string; // Foreign key strictly to User.id (where role === 'maid')
  firstName: string;
  surname: string;
  dateOfBirth: string; // Stored securely (YYYY-MM-DD), NEVER exposed directly
  gender: "Female" | "Male";
  numberOfChildren: number;
  location: string; // City (e.g. "Harare", "Bulawayo")
  residentialAddress: string; // Sensitive (Suburb / Stand, private)
  phoneNumber: string; // Sensitive (private)
  whatsappNumber: string; // Sensitive (private)
  email: string; // Sensitive (private)
  profilePhoto: string;
  profilePhotoStatus?: "Approved" | "Pending Review" | "Flagged" | "Rejected";
  additionalPhoto1?: string;
  additionalPhoto1Title?: string;
  additionalPhoto1Status?: "Approved" | "Pending Review" | "Flagged" | "Rejected";
  additionalPhoto2?: string;
  additionalPhoto2Title?: string;
  additionalPhoto2Status?: "Approved" | "Pending Review" | "Flagged" | "Rejected";
  portfolio: PortfolioItem[];
  experienceYears: number;
  workExperience: string;
  skills: string[];
  previousEmployment: PreviousEmploymentRecord[];
  expectedSalary: number; // Monthly USD
  availability: "Available immediately" | "Available from a future date" | "Already employed" | "Temporarily unavailable";
  availableFromDate?: string;
  preferredWorkLocation: string;
  willingToLiveIn: boolean;
  willingToLiveOut: boolean;
  shortAboutMe: string;
  verificationStatus: "Approved" | "Pending Approval" | "Rejected" | "Suspended";
  adminRejectionReason?: string;
  documentStatus: {
    nationalId: "Not Submitted" | "Pending Review" | "Verified" | "Rejected";
    certificates: "Not Submitted" | "Pending Review" | "Verified" | "Rejected";
    references: "Not Submitted" | "Pending Review" | "Verified" | "Rejected";
    policeClearance: "Not Submitted" | "Pending Review" | "Verified" | "Rejected";
  };
  privateDocuments: PrivateWorkerDocument[];
  isFeatured?: boolean;
  unlockedByEmployerIds: string[]; // Employer user IDs who have paid access
  submittedForApprovalAt?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Public Maid Profile View: Age dynamically computed from dateOfBirth, private documents & contact details redacted
export interface PublicMaidProfile {
  id: string;
  userId: string;
  fullName: string;
  age: number; // Automatically computed from dateOfBirth
  numberOfChildren: number;
  location: string;
  profilePhoto: string;
  additionalPhoto1?: string;
  additionalPhoto1Title?: string;
  additionalPhoto2?: string;
  additionalPhoto2Title?: string;
  portfolio: PortfolioItem[];
  experienceYears: number;
  workExperience: string;
  skills: string[];
  expectedSalary: number;
  availability: string;
  willingToLiveIn: boolean;
  willingToLiveOut: boolean;
  shortAboutMe: string;
  verificationStatus: "Approved" | "Pending Approval" | "Rejected" | "Suspended";
  isVerified: boolean;
  isFeatured?: boolean;
  // If unlocked by the current employer, contact details are populated
  isUnlockedForCurrentEmployer?: boolean;
  unlockedPhone?: string;
  unlockedWhatsApp?: string;
  unlockedEmail?: string;
  unlockedResidentialAddress?: string;
  unlockedDocumentsCount?: number;
}

export interface EmployerProfileRecord {
  id: string;
  userId: string; // Foreign key strictly to User.id (where role === 'employer')
  title: "Mr" | "Mrs" | "Ms" | "Dr" | "Eng" | "Prof";
  surname: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  location: string;
  residentialAddress?: string;
  profilePhoto?: string;
  profilePhotoStatus?: "Approved" | "Pending Review" | "Flagged" | "Rejected";
  additionalPhoto1?: string;
  additionalPhoto1Title?: string;
  additionalPhoto1Status?: "Approved" | "Pending Review" | "Flagged" | "Rejected";
  additionalPhoto2?: string;
  additionalPhoto2Title?: string;
  additionalPhoto2Status?: "Approved" | "Pending Review" | "Flagged" | "Rejected";
  portfolio?: PortfolioItem[];
  householdOrBusinessName?: string;
  isSubscribed?: boolean;
  subscriptionPlan?: "Monthly Unlimited" | "Quarterly Pass" | "Annual VIP";
  subscriptionExpiresAt?: string;
  status: "Approved" | "Pending Approval" | "Suspended";
  createdAt: string;
  updatedAt: string;
}

export interface JobRecord {
  id: string;
  employerId: string; // Foreign key strictly to User.id (where role === 'employer')
  employerTitleSurname: string; // e.g. "Mrs Moyo"
  title: string; // "House Maid", "Nanny", "Cleaner", "Cook", "Gardener", "Domestic Worker"
  description: string;
  salary: number;
  salaryPeriod: "monthly" | "weekly";
  location: string; // City
  suburb: string;
  daysOff: "1 day per week" | "2 days per week" | "Weekends" | "Sunday Off" | "Saturday Off" | "Specific Days (Negotiable)";
  workingHours: string; // e.g. "07:00 - 17:00"
  accommodation: "Live-in" | "Live-out";
  requirements: {
    experienceYears: number;
    skills: string[];
    minAge?: number;
    maxAge?: number;
    otherNotes?: string;
  };
  status: "Pending Approval" | "Approved" | "Rejected" | "Closed";
  isFeatured: boolean;
  applicantCount: number;
  datePosted: string;
  createdAt: string;
}

export interface JobApplicationRecord {
  id: string;
  maidId: string; // Foreign key strictly to User.id of maid
  jobId: string; // Foreign key strictly to Job.id
  employerId: string; // Foreign key strictly to User.id of employer
  maidName: string;
  maidAge: number;
  maidPhoto: string;
  jobTitle: string;
  jobSalary: number;
  jobLocation: string;
  employerTitleSurname: string;
  appliedDate: string;
  status: "Pending" | "Shortlisted" | "Approved" | "Rejected" | "Hired" | "Withdrawn";
  coverNote?: string;
  applicantPhone?: string;
  applicantWhatsApp?: string;
  applicantExperience?: string;
  applicantSkills?: string;
  hasPoliceClearance?: boolean;
  hasReferences?: boolean;
  isUnlocked?: boolean;
  updatedAt?: string;
}

export interface EmployerWalletRecord {
  id: string;
  userId: string; // Foreign key to User.id (employer)
  balance: number; // USD Available Balance
  totalDeposited: number; // Total USD Deposited
  totalSpent: number; // Total USD Spent
  updatedAt: string;
}

export interface PaymentTransactionRecord {
  id: string; // Unique Transaction ID
  userId: string; // Foreign key to User.id
  userRole: UserRoleType;
  userName: string;
  amount: number;
  currency: "USD" | "ZWG";
  service: string; // "Wallet Deposit", "Job Posting Fee", "Featured Job", "Premium Maid Access", "Featured Maid Profile"
  paynowReference: string; // Unique reference e.g. "MAID-EMP-20260815-839271"
  pollUrl: string;
  status: "Pending" | "Paid" | "Failed" | "Cancelled" | "Expired";
  paymentMethod: "Paynow" | "EcoCash" | "OneMoney" | "InnBucks" | "Visa/Mastercard" | "Wallet Balance";
  date: string;
  verifiedAt?: string;
  isVerified: boolean;
  metadata?: {
    jobId?: string;
    maidId?: string;
    serviceType?: string;
  };
}

export interface PlatformPricingSettings {
  jobPostingFeeUSD: number;
  featuredJobFeeUSD: number;
  premiumMaidAccessFeeUSD: number; // Single Maid Contact Unlock
  employerSubscriptionUSD: number; // Unlimited Maid Contact Monthly Pass
  featuredMaidProfileFeeUSD: number;
  urgentPlacementFeeUSD: number;
  workerJobAccessFeeUSD: number;
  updatedAt: string;
}

export interface PlatformNotificationItem {
  id: string;
  userId: string;
  role: UserRoleType;
  title: string;
  message: string;
  type: "payment" | "application" | "verification" | "job" | "system";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

// Utility: Calculate Age dynamically from Date of Birth string (YYYY-MM-DD)
export function calculateAge(dateOfBirthString: string): number {
  if (!dateOfBirthString) return 28;
  const dob = new Date(dateOfBirthString);
  if (isNaN(dob.getTime())) return 28;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age > 0 ? age : 28;
}

// Utility: Calculate Profile Completion for Maid or Employer
export function calculateProfileCompletion(
  role: UserRoleType,
  maidProfile?: MaidProfileRecord | null,
  employerProfile?: EmployerProfileRecord | null,
  user?: PlatformUser | null
): ProfileCompletionStatus {
  if (role === "maid" && maidProfile) {
    const hasProfilePic = !!maidProfile.profilePhoto && !maidProfile.profilePhoto.includes("placeholder");
    const hasPhoto1 = !!maidProfile.additionalPhoto1;
    const hasPhoto2 = !!maidProfile.additionalPhoto2;
    const hasPortfolio = maidProfile.portfolio && maidProfile.portfolio.length > 0;
    const hasPersonalInfo = !!maidProfile.firstName && !!maidProfile.surname && !!maidProfile.dateOfBirth && !!maidProfile.residentialAddress;
    const hasDocuments = maidProfile.privateDocuments && maidProfile.privateDocuments.length > 0;
    const hasExperience = !!maidProfile.experienceYears && !!maidProfile.workExperience && maidProfile.skills.length > 0;

    const checklist = [
      {
        key: "profilePhoto",
        label: "Profile Picture",
        completed: hasProfilePic,
        weight: 20,
        actionHint: "Upload a crisp portrait photo of yourself",
      },
      {
        key: "additionalPhoto1",
        label: "Additional Photo 1",
        completed: hasPhoto1,
        weight: 10,
        actionHint: "Add a secondary professional/attire photo",
      },
      {
        key: "additionalPhoto2",
        label: "Additional Photo 2",
        completed: hasPhoto2,
        weight: 10,
        actionHint: "Add an in-action work photograph",
      },
      {
        key: "portfolio",
        label: "Work Portfolio Gallery",
        completed: hasPortfolio,
        weight: 20,
        actionHint: "Upload photos showing cleaning, cooking, gardening, or artisan work",
      },
      {
        key: "personalInfo",
        label: "Personal & Contact Information",
        completed: hasPersonalInfo,
        weight: 20,
        actionHint: "Complete full name, DOB, phone, and suburb",
      },
      {
        key: "documents",
        label: "Verification Documents (ZRP / ID)",
        completed: hasDocuments,
        weight: 20,
        actionHint: "Upload National ID or ZRP Police Clearance",
      },
    ];

    const percentage = checklist.reduce((acc, item) => (item.completed ? acc + item.weight : acc), 0);

    return {
      percentage,
      isComplete: percentage >= 100,
      checklist,
    };
  } else if (role === "employer" && employerProfile) {
    const hasProfilePic = !!employerProfile.profilePhoto || !!user?.avatarUrl;
    const hasPhoto1 = !!employerProfile.additionalPhoto1;
    const hasPhoto2 = !!employerProfile.additionalPhoto2;
    const hasPortfolio = !!(employerProfile.portfolio && employerProfile.portfolio.length > 0);
    const hasContact = !!employerProfile.surname && !!employerProfile.phone && !!employerProfile.location;
    const hasAddress = !!employerProfile.residentialAddress || !!employerProfile.householdOrBusinessName;

    const checklist = [
      {
        key: "profilePhoto",
        label: "Profile Picture",
        completed: hasProfilePic,
        weight: 25,
        actionHint: "Upload an employer portrait or organization logo",
      },
      {
        key: "additionalPhoto1",
        label: "Additional Photo 1",
        completed: hasPhoto1,
        weight: 15,
        actionHint: "Add household/workplace or facility image",
      },
      {
        key: "additionalPhoto2",
        label: "Additional Photo 2",
        completed: hasPhoto2,
        weight: 15,
        actionHint: "Add a secondary household/premises image",
      },
      {
        key: "portfolio",
        label: "Workplace / Estate Showcase",
        completed: hasPortfolio,
        weight: 15,
        actionHint: "Upload images of the home, garden, or workspace",
      },
      {
        key: "personalInfo",
        label: "Employer Details & Title",
        completed: hasContact,
        weight: 15,
        actionHint: "Set formal title, surname, and contact number",
      },
      {
        key: "location",
        label: "Suburb & Residence Verification",
        completed: hasAddress,
        weight: 15,
        actionHint: "Specify suburb location in Zimbabwe",
      },
    ];

    const percentage = checklist.reduce((acc, item) => (item.completed ? acc + item.weight : acc), 0);

    return {
      percentage,
      isComplete: percentage >= 100,
      checklist,
    };
  }

  return {
    percentage: 50,
    isComplete: false,
    checklist: [],
  };
}
