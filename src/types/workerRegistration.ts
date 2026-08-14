import { CityLocation, UserRole, PortfolioItem } from "./marketplace";

export type EnglishProficiency = "Excellent" | "Good" | "Fair" | "Basic" | "None";

export type EmploymentTypePreference = "Live In" | "Live Out" | "Either";

export type MaritalStatus = "Single" | "Married" | "Divorced" | "Widowed" | "Separated";

export type WorkerProfileApprovalStatus =
  | "Draft"
  | "Pending Review"
  | "Approved"
  | "Rejected"
  | "Needs More Information";

export interface PreviousEmploymentRecord {
  id: string;
  formerEmployerName: string;
  positionHeld: string;
  startDate: string;
  endDate: string;
  employerAddress: string;
  employerPhone: string;
  reasonForLeaving: string;
  referenceConfirmed?: boolean;
}

export interface NextOfKinDetails {
  fullName: string;
  relationship: string;
  nationalId: string;
  phoneNumber: string;
  residentialAddress: string;
}

export interface FamilyDetails {
  hasChildren: boolean;
  numberOfChildren: number;
  childrenAges: number[];
}

export interface VerificationDocumentUpload {
  type:
    | "National ID"
    | "Passport Photo"
    | "CV / Resume"
    | "Certificates"
    | "Reference Letters"
    | "Police Clearance"
    | "Medical Certificate"
    | "Proof of Address";
  fileName: string;
  fileSize?: string;
  uploadDate: string;
  fileUrl: string;
  isVerified: boolean;
  notes?: string;
}

export interface LegalDeclaration {
  declaredTrueAndAccurate: boolean;
  agreedToVerification: boolean;
  agreedToTerms: boolean;
  digitalSignature: string;
  signedDate: string;
}

export interface StandardizedWorkerRegistration {
  id: string;
  // Step 1: Personal Details
  fullName: string;
  dateOfBirth: string;
  age: number;
  gender: "Female" | "Male" | "Other";
  nationalId: string;
  phoneNumber: string;
  email?: string;
  residentialAddress: string;
  city: CityLocation;
  province: string;
  nationality: string;
  maritalStatus: MaritalStatus;

  // Step 2: Language Proficiency
  englishProficiency: EnglishProficiency;
  languagesSpoken: string[];

  // Step 3: Employment Preferences
  jobCategories: string[]; // e.g. Housekeeper, Nanny, Cook, etc.
  expectedMonthlySalaryUSD: number;
  preferredWorkLocation: string;
  employmentType: EmploymentTypePreference;
  availabilityDate: string;
  immediateAvailability: boolean;
  preferredProvince: string;
  preferredCity: CityLocation;

  // Step 4: Family Details
  familyDetails: FamilyDetails;

  // Step 5: Next of Kin
  nextOfKin: NextOfKinDetails;

  // Step 6: Previous Employment
  previousEmployments: PreviousEmploymentRecord[];

  // Verification Uploads
  verificationDocuments: VerificationDocumentUpload[];

  // Candidate Appearance 3-Photo Set (Profile, Full Length, Work Action)
  candidatePhotos?: {
    primaryProfilePhoto: string;
    fullLengthPhoto?: string;
    workActionPhoto?: string;
  };

  // Portfolio & Work Evidence Photos / Reference Documents
  portfolio?: PortfolioItem[];

  // Declaration & Digital Signature
  declaration: LegalDeclaration;

  // System & Management Metadata
  avatarUrl: string;
  bio: string;
  skills: string[];
  experienceYears: number;
  approvalStatus: WorkerProfileApprovalStatus;
  statusNotes?: string;
  source: "App Registration" | "WhatsApp Import" | "Admin Manual";
  rawWhatsAppMessage?: string;
  aiTrustScore: number;
  isDuplicateFlagged?: boolean;
  duplicateMatchReasons?: string[];
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}
