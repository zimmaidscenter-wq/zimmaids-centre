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
  | "Chef"
  | "Nurse aide"
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
  agencyName?: string;
  audioBioUrl?: string;
  // Contact & Protection Fields
  phoneNumber?: string;
  whatsappNumber?: string;
  email?: string;
  address?: string;
  isRestricted?: boolean;
  restrictionReason?: string;
}

export interface JobPosting {
  id: string;
  title: string;
  roleNeeded: UserRole;
  employerName: string;
  city: CityLocation;
  suburb: string;
  offeredSalaryUSD: number;
  payFrequency: "Hourly" | "Daily" | "Weekly" | "Monthly" | "One-Time Task";
  workType: "Full-Time" | "Part-Time" | "Live-In" | "One-Time Task";
  description: string;
  requiredSkills: string[];
  postedDate: string;
  applicantCount: number;
  status: "Open" | "In Review" | "Placed" | "Filled" | "Draft" | "Expired";
  urgent: boolean;
  isFeatured?: boolean;
  expiryDate?: string;
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
