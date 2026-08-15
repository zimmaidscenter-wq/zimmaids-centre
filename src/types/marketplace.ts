export type UserRole = 
  | "Domestic worker"
  | "Maid"
  | "Part-time maid"
  | "Nanny"
  | "Caregiver"
  | "Housekeeper"
  | "Gardener"
  | "Driver"
  | "Electrician"
  | "Plumber"
  | "Builder"
  | "Carpenter"
  | "Cleaner"
  | "General cleaner"
  | "Chef"
  | "Nurse aide"
  | "Doctor"
  | "Shop assistant"
  | "General hand"
  | "Caretaker"
  | "Mobile carwasher"
  | "Appliance repairer"
  | "Locksmith"
  | "Tree cutter"
  | "Farm worker"
  | "Cook"
  | "Satellite dish installer"
  | "Fumigation specialist"
  | "Painter"
  | "Curtain installer"
  | "Interior designer"
  | "Part-time laundry worker"
  | "Sofa & carpet cleaner"
  | "Pavement cleaner"
  | "Home owner"
  | "Employer"
  | "Agency"
  | "Admin";

export type CityLocation = 
  | "Harare"
  | "Bulawayo"
  | "Chitungwiza"
  | "Mutare"
  | "Gweru"
  | "Kwekwe"
  | "Kadoma"
  | "Masvingo"
  | "Chinhoyi"
  | "Marondera"
  | "Norton"
  | "Bindura"
  | "Victoria Falls"
  | "Zvishavane"
  | "Hwange"
  | "Redcliff"
  | "Ruwa"
  | "Beitbridge"
  | "Kariba"
  | "Chipinge"
  | "Gokwe"
  | "Chegutu"
  | "Karoi"
  | "Plumtree"
  | "Shurugwi"
  | "Chiredzi"
  | "Nyanga"
  | "Rusape"
  | "Chivhu"
  | "Mvurwi"
  | "Gwanda"
  | "Binga"
  | "Lupane";

export interface VerificationBadge {
  idCheck: boolean;
  policeClearance: boolean;
  referenceVerified: boolean;
  medicalCert: boolean;
  tradeTradeLicense?: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category:
    | "Work Photo"
    | "Reference Letter"
    | "Certificate"
    | "National ID"
    | "Police Clearance"
    | "Medical Report"
    | "Cooking / Meal Sample"
    | "Cleaning / Ironing Proof"
    | "Childcare / Nursery Setup"
    | "Other Document";
  fileType: "image" | "pdf";
  url: string;
  thumbnailUrl?: string;
  description?: string;
  uploadedAt: string;
  fileSize?: string;
  isVerified?: boolean;
  issuerOrEmployer?: string;
  rating?: number;
  documentContent?: string;
  verifiedBy?: string;
}

export interface WorkerProfile {
  id: string;
  fullName: string;
  role: UserRole; // Profession
  avatarUrl: string;
  rating: number;
  reviewCount: number;
  hourlyRateUSD: number;
  monthlyRateUSD: number; // Salary
  province: string; // Province
  district: string; // District
  city: CityLocation; // City
  suburb: string;
  distanceKm: number; // Distance
  experienceYears: number; // Experience
  education: "Primary" | "O-Level" | "A-Level" | "Red Cross Certificate" | "Early Childhood Diploma" | "Class 1 Journeyman" | "Class 2 License" | "University Degree"; // Education
  age: number; // Age
  gender: "Female" | "Male" | "Non-Binary"; // Gender
  willingToLiveIn: boolean; // Live In
  willingToLiveOut: boolean; // Live Out
  languages: string[]; // Languages
  skills: string[]; // Skills
  bio: string;
  verifications: VerificationBadge; // Verified
  isVerified: boolean; // Overall verification state
  availability: "Full-Time" | "Part-Time" | "Live-In" | "Contract" | "Emergency On-Call"; // Availability
  policeClearanceDate: string;
  aiTrustScore: number;
  agencyId?: string;
  agencyName?: string;
  isAgencyManaged?: boolean;
  isAgencyVerified?: boolean;
  status?: "Active" | "Archived" | "Draft" | "Pending Review";
  audioBioUrl?: string;
  // Candidate Appearance 3-Photo Set (Profile, Full Length, Work Action)
  candidatePhotos?: {
    primaryProfilePhoto: string;
    fullLengthPhoto?: string;
    workActionPhoto?: string;
  };
  // Portfolio & Document attachments
  portfolio?: PortfolioItem[];
  // Documents & CV uploads
  cvUrl?: string;
  policeClearanceDocUrl?: string;
  medicalCertDocUrl?: string;
  referenceLettersCount?: number;
  documents?: {
    type: "CV" | "Police Clearance" | "Medical Certificate" | "Reference Letter" | "Trade Certificate" | "National ID";
    name: string;
    url: string;
    uploadedAt: string;
  }[];
  // Contact & Protection Fields
  phoneNumber?: string;
  whatsappNumber?: string;
  email?: string;
  address?: string;
  isRestricted?: boolean;
  restrictionReason?: string;
  // Enhanced Availability Status
  availabilityStatus?: "available_immediately" | "available_future_date" | "already_employed" | "temporarily_unavailable";
  availableFromDate?: string;
  availabilitySchedule?: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  noticePeriod?: "Immediate" | "1 Week Notice" | "2 Weeks Notice" | "1 Month Notice";
}

export type AvailabilityStatusType =
  | "available_immediately"
  | "available_future_date"
  | "already_employed"
  | "temporarily_unavailable";

export interface VaultDocument {
  id: string;
  type: "National ID" | "Certificate" | "Police Clearance" | "Medical Certificate" | "Reference Letter" | "Employment Contract";
  title: string;
  issuerOrAuthority: string;
  dateIssued: string;
  expiryDate?: string;
  verificationStatus: "Verified" | "Pending Review" | "Expired" | "Self-Uploaded";
  documentUrl: string;
  fileSize: string;
  fileType: "pdf" | "image";
  notes?: string;
  isEncrypted: boolean;
  // Contract specific fields
  contractDetails?: {
    employerName: string;
    workerName: string;
    agreedSalaryUSD: number;
    startDate: string;
    workType: "Live-In" | "Day Worker" | "Part-Time";
    offDays: string;
    signedByWorker: boolean;
    signedByEmployer: boolean;
    signedDate?: string;
  };
}

export interface AppNotification {
  id: string;
  category: "jobs" | "applications" | "interviews" | "messages" | "verifications" | "subscriptions" | "placement_fees";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: {
    jobId?: string;
    workerId?: string;
    employerName?: string;
    amountUSD?: number;
    status?: string;
  };
}

export interface BiDirectionalReview {
  id: string;
  authorType: "Employer" | "Worker";
  authorName: string;
  authorLocation: string;
  targetName: string;
  targetRole: string;
  rating: number;
  placementDate: string;
  verifiedPlacement: boolean;
  detailedRatings: {
    punctualityOrFairness: number;
    honestyOrPayTimeliness: number;
    skillOrScopeClarity: number;
    hygieneOrSafeEnvironment: number;
  };
  reviewText: string;
  createdAt: string;
  helpfulCount: number;
  status: "Published" | "Under Moderation" | "Disputed";
}

export interface DataDeletionTicket {
  id: string;
  fullName: string;
  phoneOrEmail: string;
  nationalIdNumber: string;
  reason: string;
  submittedAt: string;
  status: "Received" | "Under Review" | "Data Purged" | "Rejected";
  targetUserRole: UserRole;
}

export type HelperType = "Live-In" | "Live-Out/Day Worker";
export type PrimaryFocusRole =
  | "Housekeeping"
  | "Nanny"
  | "Elderly Care"
  | "Chef"
  | "Gardener"
  | "Maid";

export interface EmployerHiringRequest {
  id: string;
  fullName: string;
  phoneOrWhatsApp: string;
  email?: string;
  physicalAddress: {
    streetAddress?: string;
    suburb: string;
    city: CityLocation | string;
  };
  helperType: HelperType;
  primaryFocus: PrimaryFocusRole;
  preferredAges: string;
  householdDetails: {
    numberOfKids: number;
    numberOfAdults: number;
    numberOfBedrooms: number;
    pets: string;
    kidsAgesNotes?: string;
  };
  specialNeeds: string;
  proposedOffDays: string;
  staffAccommodation: string;
  offeredSalaryUSD?: number;
  startDate?: string;
  urgent?: boolean;
  additionalNotes?: string;
  status: "Pending Match" | "In Review" | "Interviewing" | "Placed" | "Closed";
  createdAt: string;
}

export interface JobPosting {
  id: string;
  title: string;
  roleNeeded: UserRole;
  employerName: string;
  agencyId?: string;
  agencyName?: string;
  isAgencyVerified?: boolean;
  city: CityLocation;
  suburb: string;
  offeredSalaryUSD: number;
  payFrequency: "Hourly" | "Daily" | "Weekly" | "Monthly" | "One-Time Task";
  workType: "Full-Time" | "Part-Time" | "Live-In" | "One-Time Task";
  description: string;
  requiredSkills: string[];
  postedDate: string;
  applicantCount: number;
  status: "Open" | "In Review" | "Placed" | "Filled" | "Draft" | "Expired" | "Closed";
  urgent: boolean;
  isFeatured?: boolean;
  expiryDate?: string;
  // Enhanced Employer Hiring Details
  helperType?: HelperType;
  primaryFocus?: PrimaryFocusRole;
  preferredAges?: string;
  householdDetails?: {
    numberOfKids: number;
    numberOfAdults: number;
    numberOfBedrooms: number;
    pets: string;
    kidsAgesNotes?: string;
  };
  specialNeeds?: string;
  proposedOffDays?: string;
  staffAccommodation?: string;
  physicalAddress?: {
    streetAddress?: string;
    suburb: string;
    city: string;
  };
  phoneOrWhatsApp?: string;
}

export interface PlacementFeeRecord {
  id: string;
  workerId: string;
  workerName: string;
  employerName: string;
  jobTitle: string;
  agreedSalaryUSD: number;
  placementFeeUSD: number; // 30% of agreed salary
  status: "Pending" | "Paid" | "Under Review" | "Overdue";
  placementDate: string;
  dueDate: string;
  proofOfPaymentUrl?: string;
  proofFileName?: string;
  paymentMethod: "EcoCash" | "InnBucks" | "ZimSwitch" | "Visa/Mastercard" | "Mukuru" | "Cash";
  ecoCashNumberUsed?: string;
  notes?: string;
}

export interface PremiumSubscription {
  isPremiumEmployer: boolean;
  planName: string;
  priceUSD: number;
  durationDays: number;
  activatedAt?: string;
  expiresAt?: string;
}

export interface ReferralReward {
  id: string;
  referredName: string;
  referredEmailOrPhone: string;
  dateReferred: string;
  status: "Pending Registration" | "Registered" | "Placement Completed";
  discountEarnedUSD: number;
  discountVoucherCode: string;
  isRedeemed: boolean;
}

export interface UserReferralProfile {
  referralCode: string;
  referralLink: string;
  totalInvitesSent: number;
  successfulPlacements: number;
  totalDiscountsEarnedUSD: number;
  availableDiscountBalanceUSD: number;
  referrals: ReferralReward[];
}

export interface MessageItem {
  id: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  translatedText?: string;
  audioMessage?: boolean;
}
