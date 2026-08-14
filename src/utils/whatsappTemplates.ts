import { StandardizedWorkerRegistration } from "../types/workerRegistration";
import { WorkerProfile, CityLocation, UserRole } from "../types/marketplace";

export const ZIMBABWE_PROVINCES = [
  "Harare Metropolitan",
  "Bulawayo Metropolitan",
  "Manicaland",
  "Mashonaland Central",
  "Mashonaland East",
  "Mashonaland West",
  "Masvingo",
  "Matabeleland North",
  "Matabeleland South",
  "Midlands",
];

export const STANDARD_JOB_CATEGORIES = [
  "Housekeeper",
  "Nanny",
  "Caregiver",
  "Cook",
  "Gardener",
  "Driver",
  "Cleaner",
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "Security Guard",
  "Handyman",
  "Nurse aide",
  "Chef",
  "Other",
];

export const STANDARD_LANGUAGES = [
  "English",
  "Shona",
  "Ndebele",
  "Chewa",
  "Tonga",
  "Kalanga",
  "Venda",
  "Sotho",
  "Shangani",
];

export const WHATSAPP_STANDARD_GROUP_TEMPLATE = `*PROFILE DETAILS/CV*




*Full Name* 



*Age*:

*ID number* 

*Phone number*

*Full address* 



*Marital Status* 



*Are you good in English?*
    


*NEXT OF KIN INFORMATION*

*Full Name* 
*Relationship* 
*Full address*
*ID Number* 



*Salary expectancy*
     


*Are you comfortable with stay in job?*

 

*Your Kids' age* 
     

*When do you want to start?*
    



*FORMER EMPLOYER DETAILS*

 



*Full name*  
*Period served*
*Full address* 
*Phone number*`;

export const WHATSAPP_REGISTRATION_TEMPLATE_EN = WHATSAPP_STANDARD_GROUP_TEMPLATE;

export const WHATSAPP_SAMPLE_FILLED_PROFILE = `*PROFILE DETAILS/CV*

*Full Name* Memory Tendai Nyathi

*Age*: 28

*ID number* 63-199203-T-42

*Phone number* +263 77 490 2118

*Full address* Stand 512, Unit L, Chitungwiza, Harare

*Marital Status* Single

*Are you good in English?* Yes, Good

*NEXT OF KIN INFORMATION*

*Full Name* Grace Nyathi
*Relationship* Mother
*Full address* Stand 512, Unit L, Chitungwiza, Harare
*ID Number* 63-088129-K-19

*Salary expectancy* $220 USD

*Are you comfortable with stay in job?* Yes (Stay-in / Live In)

*Your Kids' age* 1 child, aged 6

*When do you want to start?* Immediately

*FORMER EMPLOYER DETAILS*

*Full name* Mrs. Beatrice Sithole
*Period served* 2021 to 2024 (3 years)
*Full address* Avondale, Harare
*Phone number* +263 77 288 3011`;

export const WHATSAPP_REGISTRATION_TEMPLATE_SHONA = `*ZIMBABWE MAIDS CENTRE - FOMU REKUNYORESA VASHANDI (CHISHONA)*
Pindura mibvunzo inotevera kuti tipedzise kunyoresa kwenyu:

1. *ZITA NENHOROONDO YENYU*
- Zita Rizere: 
- Zuva Rokuzvarwa (DD/MM/YYYY): 
- Munhurume/Munhukadzi: 
- Nhamba YeChitupa (ID): 
- Nhamba Yefoni: 
- Kero Yenyu (Address): 
- Guta (Harare/Bulawayo/Mutare/etc): 

2. *MITAURO*
- Chirungu (Zvakanaka Kwazvo/Zvakanaka/Zvishoma): 
- Mimwe Mitauro (Shona, Ndebele, English): 

3. *BASA RAUNODA*
- Mhando Yebasa (Mubatsiri Wemumba/Nanny/Caregiver/Cook/Gardener/Driver): 
- Muhoro Waunotarisira (USD pamwedzi): $
- Kugara Pamba (Live-In) kana Kubva Kumba (Live-Out): 

4. *MHURI*
- Mune vana here? (Ehe/Kwete): 
- Kana muri navo, vangani uye vane makore mangani?: 

5. *HAMA YEPEDYOHO (Next of Kin)*
- Zita Rehama: 
- Hukama (Amai/Mukoma/Murume/Sisi): 
- Foni Yehama: 

6. *KWAMAKAITA BASA Kare (Reference)*
- Zita Ravarungu Vamakarikira: 
- Basa Ramakaita: 
- Foni Yavo: `;

// Normalize Zimbabwe Phone Number to +263 format
export function normalizeZimbabwePhoneNumber(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+263")) {
    return cleaned;
  }
  if (cleaned.startsWith("263")) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith("0")) {
    return `+263${cleaned.substring(1)}`;
  }
  if (cleaned.startsWith("7") || cleaned.startsWith("8")) {
    return `+263${cleaned}`;
  }
  return cleaned;
}

// Calculate age from Date of Birth string (YYYY-MM-DD or DD/MM/YYYY)
export function calculateAgeFromDob(dobString: string): number {
  if (!dobString) return 25;
  let birthDate: Date;
  if (dobString.includes("/")) {
    const parts = dobString.split("/");
    if (parts.length === 3) {
      if (parts[2].length === 4) {
        // DD/MM/YYYY
        birthDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      } else {
        birthDate = new Date(dobString);
      }
    } else {
      birthDate = new Date(dobString);
    }
  } else {
    birthDate = new Date(dobString);
  }

  if (isNaN(birthDate.getTime())) return 25;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age > 0 ? age : 25;
}

// Convert Standardized Worker Registration into WorkerProfile for Marketplace Directory
export function convertRegistrationToWorkerProfile(
  reg: StandardizedWorkerRegistration
): WorkerProfile {
  const primaryRole = (reg.jobCategories?.[0] || "Maid") as UserRole;
  
  return {
    id: reg.id,
    fullName: reg.fullName,
    role: primaryRole,
    avatarUrl: reg.avatarUrl || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
    rating: 5.0,
    reviewCount: 0,
    hourlyRateUSD: Math.max(3, Math.round(reg.expectedMonthlySalaryUSD / 45)),
    monthlyRateUSD: reg.expectedMonthlySalaryUSD || 220,
    province: reg.province || "Harare Metropolitan",
    district: reg.city || "Harare",
    city: reg.city || "Harare",
    suburb: reg.residentialAddress ? reg.residentialAddress.split(",")[0] : "Central",
    distanceKm: 3.5,
    experienceYears: reg.experienceYears || (reg.previousEmployments.length > 0 ? reg.previousEmployments.length * 2 : 3),
    education: "O-Level",
    age: reg.age || calculateAgeFromDob(reg.dateOfBirth),
    gender: reg.gender === "Male" ? "Male" : "Female",
    willingToLiveIn: reg.employmentType === "Live In" || reg.employmentType === "Either",
    willingToLiveOut: reg.employmentType === "Live Out" || reg.employmentType === "Either",
    languages: reg.languagesSpoken.length > 0 ? reg.languagesSpoken : ["English", "Shona"],
    skills: reg.skills.length > 0 ? reg.skills : ["Housekeeping", "Cooking", "Laundry & Ironing"],
    bio: reg.bio || `Professional ${primaryRole} with verified references in ${reg.city}. Looking for ${reg.employmentType.toLowerCase()} placement.`,
    verifications: {
      idCheck: reg.verificationDocuments.some((d) => d.type === "National ID"),
      policeClearance: reg.verificationDocuments.some((d) => d.type === "Police Clearance"),
      referenceVerified: reg.previousEmployments.some((p) => p.referenceConfirmed),
      medicalCert: reg.verificationDocuments.some((d) => d.type === "Medical Certificate"),
      tradeTradeLicense: reg.verificationDocuments.some((d) => d.type === "Certificates"),
    },
    isVerified: reg.approvalStatus === "Approved",
    availability: reg.immediateAvailability
      ? "Full-Time"
      : reg.employmentType === "Live In"
      ? "Live-In"
      : "Full-Time",
    policeClearanceDate: new Date().toISOString().split("T")[0],
    aiTrustScore: reg.aiTrustScore || 92,
    phoneNumber: reg.phoneNumber,
    whatsappNumber: reg.phoneNumber,
    email: reg.email,
    address: reg.residentialAddress,
    portfolio: reg.portfolio && reg.portfolio.length > 0
      ? reg.portfolio
      : reg.verificationDocuments.map((doc, idx) => ({
          id: `wa-doc-${idx}-${Date.now()}`,
          title: doc.fileName || doc.type,
          category: (doc.type === "Reference Letters"
            ? "Reference Letter"
            : doc.type === "Certificates"
            ? "Certificate"
            : doc.type === "National ID"
            ? "National ID"
            : doc.type === "Police Clearance"
            ? "Police Clearance"
            : doc.type === "Medical Certificate"
            ? "Medical Report"
            : "Other Document") as any,
          fileType: doc.fileName?.toLowerCase().endsWith(".pdf") ? "pdf" : "image",
          url: doc.fileUrl || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600",
          uploadedAt: doc.uploadDate || new Date().toISOString().split("T")[0],
          fileSize: doc.fileSize || "1.2 MB",
          isVerified: doc.isVerified ?? true,
          description: doc.notes || `Verified ${doc.type} attached during registration.`,
        })),
    documents: reg.verificationDocuments.map((d) => ({
      type: (d.type === "Reference Letters"
        ? "Reference Letter"
        : d.type === "Certificates"
        ? "Trade Certificate"
        : d.type === "Police Clearance"
        ? "Police Clearance"
        : d.type === "Medical Certificate"
        ? "Medical Certificate"
        : d.type === "National ID"
        ? "National ID"
        : "CV") as any,
      name: d.fileName,
      url: d.fileUrl,
      uploadedAt: d.uploadDate,
    })),
  };
}

// Duplicate Detection Checker
export function checkDuplicateWorker(
  newCandidate: Partial<StandardizedWorkerRegistration>,
  existingCandidates: StandardizedWorkerRegistration[]
): { isDuplicate: boolean; reasons: string[]; matchedCandidate?: StandardizedWorkerRegistration } {
  const reasons: string[] = [];
  let matchedCandidate: StandardizedWorkerRegistration | undefined;

  for (const existing of existingCandidates) {
    if (newCandidate.id && existing.id === newCandidate.id) continue;

    // Check 1: National ID Match
    if (
      newCandidate.nationalId &&
      existing.nationalId &&
      newCandidate.nationalId.trim().toUpperCase() === existing.nationalId.trim().toUpperCase()
    ) {
      reasons.push(`Exact National ID Match: ${existing.nationalId}`);
      matchedCandidate = existing;
    }

    // Check 2: Phone Number Match
    const normNewPhone = normalizeZimbabwePhoneNumber(newCandidate.phoneNumber || "");
    const normExistPhone = normalizeZimbabwePhoneNumber(existing.phoneNumber || "");
    if (normNewPhone && normExistPhone && normNewPhone === normExistPhone) {
      reasons.push(`Matching Phone Number: ${existing.phoneNumber}`);
      matchedCandidate = existing;
    }

    // Check 3: Email Match
    if (
      newCandidate.email &&
      existing.email &&
      newCandidate.email.trim().toLowerCase() === existing.email.trim().toLowerCase()
    ) {
      reasons.push(`Matching Email Address: ${existing.email}`);
      matchedCandidate = existing;
    }

    // Check 4: Full Name + Date of Birth Match
    if (
      newCandidate.fullName &&
      existing.fullName &&
      newCandidate.fullName.trim().toLowerCase() === existing.fullName.trim().toLowerCase() &&
      newCandidate.dateOfBirth &&
      existing.dateOfBirth &&
      newCandidate.dateOfBirth === existing.dateOfBirth
    ) {
      reasons.push(`Identical Full Name and Date of Birth: ${existing.fullName} (${existing.dateOfBirth})`);
      matchedCandidate = existing;
    }

    if (reasons.length > 0) {
      break;
    }
  }

  return {
    isDuplicate: reasons.length > 0,
    reasons,
    matchedCandidate,
  };
}

/**
 * Format Employer Hiring Request into standard Zimbabwe Maids Centre WhatsApp message format
 */
export function formatEmployerHiringRequestToWhatsApp(req: {
  fullName: string;
  phoneOrWhatsApp?: string;
  physicalAddress: {
    streetAddress?: string;
    suburb: string;
    city: string;
  };
  helperType: string;
  primaryFocus: string;
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
}): string {
  const addressStr = req.physicalAddress.streetAddress
    ? `${req.physicalAddress.streetAddress}, ${req.physicalAddress.suburb}, ${req.physicalAddress.city}`
    : `${req.physicalAddress.suburb}, ${req.physicalAddress.city}`;

  return `*ZIMBABWE MAIDS CENTRE - EMPLOYER HIRING FORM*
────────────────────────
*Full Name:* ${req.fullName || "Not Specified"}
*Phone/WhatsApp:* ${req.phoneOrWhatsApp || "Not Specified"}

*Physical Address (Suburb & City):*
${addressStr}

*Helper Type:* ${req.helperType}
*Primary Focus:* ${req.primaryFocus}

*Preferred Ages:* ${req.preferredAges || "Any / Mature"}

*Household Details:*
• Number of Kids: ${req.householdDetails.numberOfKids}${req.householdDetails.kidsAgesNotes ? ` (${req.householdDetails.kidsAgesNotes})` : ""}
• Number of Adults: ${req.householdDetails.numberOfAdults}
• Number of Bedrooms: ${req.householdDetails.numberOfBedrooms}
• Pets: ${req.householdDetails.pets || "None"}

*Special Needs & Specific Instructions:*
${req.specialNeeds ? req.specialNeeds : "None / Standard routine"}

*Proposed Off Days:* ${req.proposedOffDays || "Every Sunday"}

*Staff Accommodation:* ${req.staffAccommodation || "Not Applicable / Live-Out"}

*Budget / Offered Salary:* ${req.offeredSalaryUSD ? `$${req.offeredSalaryUSD} USD/month` : "Negotiable"}
*Start Date / Urgency:* ${req.startDate || "Immediate"}${req.urgent ? " *(URGENT)*" : ""}
────────────────────────
_Generated via Zimbabwe Maids Centre Platform_`;
}
