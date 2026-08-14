import { WorkerProfile, PortfolioItem } from "../types/marketplace";
import { StandardizedWorkerRegistration } from "../types/workerRegistration";

export interface CompletenessCategory {
  id: string;
  name: string;
  weight: number;
  score: number;
  isComplete: boolean;
  statusLabel: string;
  recommendation: string;
}

export interface CompletenessResult {
  totalPercentage: number;
  level: "Starter" | "Standard" | "High Quality" | "All-Star Elite";
  levelColor: string;
  levelBadge: string;
  summaryText: string;
  categories: CompletenessCategory[];
  missingActionItems: {
    id: string;
    label: string;
    points: number;
    actionKey: "upload_photos" | "upload_portfolio" | "upload_clearance" | "upload_reference" | "complete_bio";
  }[];
}

export function calculateProfileCompleteness(
  profile: Partial<WorkerProfile> | Partial<StandardizedWorkerRegistration> | null | undefined,
  portfolioList?: PortfolioItem[]
): CompletenessResult {
  if (!profile) {
    return {
      totalPercentage: 0,
      level: "Starter",
      levelColor: "text-slate-500",
      levelBadge: "bg-slate-100 text-slate-700",
      summaryText: "No profile data entered yet.",
      categories: [],
      missingActionItems: [],
    };
  }

  const items = portfolioList || profile.portfolio || [];
  const candidatePhotos = (profile as any).candidatePhotos || {};
  const avatarUrl = profile.avatarUrl;
  const hasPrimaryPhoto = Boolean(avatarUrl && !avatarUrl.includes("placeholder") || candidatePhotos.primaryProfilePhoto);
  const hasFullLength = Boolean(candidatePhotos.fullLengthPhoto);
  const hasWorkAction = Boolean(candidatePhotos.workActionPhoto);

  // 1. Photos Score (Max 25%)
  let photosScore = 0;
  if (hasPrimaryPhoto) photosScore += 10;
  if (hasFullLength) photosScore += 7.5;
  if (hasWorkAction) photosScore += 7.5;

  // 2. Portfolio Work Proof (Max 20%)
  const workImages = items.filter(
    (i) => i.fileType === "image" && (i.category.includes("Proof") || i.category.includes("Photo") || i.category.includes("Sample"))
  );
  let portfolioScore = 0;
  if (workImages.length >= 2) {
    portfolioScore = 20;
  } else if (workImages.length === 1) {
    portfolioScore = 12;
  }

  // 3. Official Verification Documents (Max 25%)
  let docScore = 0;
  const hasId = Boolean((profile as any).nationalId || (profile as any).verifications?.idCheck || items.some((i) => i.category === "National ID"));
  const hasPolice = Boolean(
    (profile as any).policeClearanceDate ||
    (profile as any).verifications?.policeClearance ||
    items.some((i) => i.category === "Police Clearance" || i.title.toLowerCase().includes("police") || i.title.toLowerCase().includes("zrp"))
  );
  const hasMedical = Boolean(
    (profile as any).verifications?.medicalCert ||
    items.some((i) => i.category === "Medical Report" || i.title.toLowerCase().includes("medical") || i.title.toLowerCase().includes("health"))
  );

  if (hasId) docScore += 10;
  if (hasPolice) docScore += 10;
  if (hasMedical) docScore += 5;

  // 4. References & Letters (Max 15%)
  const referenceLetters = items.filter(
    (i) => i.category === "Reference Letter" || i.fileType === "pdf" || i.title.toLowerCase().includes("reference")
  );
  const hasRefCheck = Boolean((profile as any).verifications?.referenceVerified || (profile as any).previousEmployments?.some((e: any) => e.referenceConfirmed));
  let referenceScore = 0;
  if (referenceLetters.length >= 2 || (referenceLetters.length >= 1 && hasRefCheck)) {
    referenceScore = 15;
  } else if (referenceLetters.length === 1 || hasRefCheck) {
    referenceScore = 10;
  }

  // 5. Bio & CV Profile Details (Max 15%)
  let bioScore = 0;
  const bio = profile.bio || "";
  const skills = profile.skills || [];
  if (bio.trim().length >= 40) bioScore += 7;
  else if (bio.trim().length > 10) bioScore += 4;
  if (skills.length >= 3) bioScore += 5;
  else if (skills.length >= 1) bioScore += 3;
  const rateUSD = (profile as any).monthlyRateUSD || (profile as any).rateUSD || (profile as any).expectedMonthlySalaryUSD;
  if (rateUSD) bioScore += 3;

  const total = Math.min(100, Math.round(photosScore + portfolioScore + docScore + referenceScore + bioScore));

  let level: CompletenessResult["level"] = "Starter";
  let levelColor = "text-slate-600";
  let levelBadge = "bg-slate-100 text-slate-800 border-slate-300";
  let summaryText = "Complete more items to unlock top employer visibility.";

  if (total >= 90) {
    level = "All-Star Elite";
    levelColor = "text-emerald-700";
    levelBadge = "bg-emerald-100 text-emerald-900 border-emerald-300";
    summaryText = "Outstanding profile! Fully verified with complete photos, proof of work & documentation.";
  } else if (total >= 70) {
    level = "High Quality";
    levelColor = "text-teal-700";
    levelBadge = "bg-teal-100 text-teal-900 border-teal-300";
    summaryText = "Strong profile with verified credentials. Upload remaining documents to reach 100%.";
  } else if (total >= 45) {
    level = "Standard";
    levelColor = "text-amber-700";
    levelBadge = "bg-amber-100 text-amber-900 border-amber-300";
    summaryText = "Good start! Adding your full-length photo and reference letter will boost your employer inquiries 3x.";
  }

  const categories: CompletenessCategory[] = [
    {
      id: "photos",
      name: "Candidate Appearance Photos",
      weight: 25,
      score: Math.round(photosScore),
      isComplete: photosScore >= 25,
      statusLabel: `${[hasPrimaryPhoto && "Profile Headshot", hasFullLength && "Full-Length", hasWorkAction && "Work-Action"].filter(Boolean).length}/3 Photos Uploaded`,
      recommendation: !hasFullLength || !hasWorkAction ? "Upload full-length and work appearance photos so clients can see how you present yourself." : "All 3 appearance photos verified.",
    },
    {
      id: "portfolio",
      name: "Work Proof & Action Photos",
      weight: 20,
      score: Math.round(portfolioScore),
      isComplete: portfolioScore >= 20,
      statusLabel: `${workImages.length} Evidence Photos`,
      recommendation: workImages.length < 2 ? "Upload photos of past cooking, cleaning, or childcare work to build trust." : "Great portfolio evidence uploaded.",
    },
    {
      id: "documents",
      name: "Verified Compliance Documents",
      weight: 25,
      score: Math.round(docScore),
      isComplete: docScore >= 25,
      statusLabel: `${[hasId && "National ID", hasPolice && "Police Clearance", hasMedical && "Medical Cert"].filter(Boolean).join(", ") || "No Docs"}`,
      recommendation: !hasPolice ? "Attach your ZRP CID police vetting certificate for maximum trust." : "Government verification documents in order.",
    },
    {
      id: "references",
      name: "Employer Reference Letters",
      weight: 15,
      score: Math.round(referenceScore),
      isComplete: referenceScore >= 15,
      statusLabel: `${referenceLetters.length} Reference Letter${referenceLetters.length === 1 ? "" : "s"}`,
      recommendation: referenceLetters.length === 0 ? "Upload at least 1 written recommendation from a past household." : "Verified recommendation attached.",
    },
    {
      id: "details",
      name: "CV Bio & Specializations",
      weight: 15,
      score: Math.round(bioScore),
      isComplete: bioScore >= 15,
      statusLabel: `${skills.length} Skills • ${bio.length > 0 ? "Bio Added" : "No Bio"}`,
      recommendation: bio.length < 40 ? "Write a detailed bio highlighting your reliability and domestic strengths." : "Comprehensive CV summary provided.",
    },
  ];

  const missingActionItems: CompletenessResult["missingActionItems"] = [];
  if (!hasFullLength) {
    missingActionItems.push({
      id: "full-length-photo",
      label: "Upload Full-Length Standing Picture",
      points: 8,
      actionKey: "upload_photos",
    });
  }
  if (!hasWorkAction) {
    missingActionItems.push({
      id: "work-action-photo",
      label: "Upload Work Uniform / In-Action Picture",
      points: 7,
      actionKey: "upload_photos",
    });
  }
  if (workImages.length < 2) {
    missingActionItems.push({
      id: "work-proof",
      label: "Add Work Proof Photos (Cooking / Cleaning / Ironing)",
      points: 10,
      actionKey: "upload_portfolio",
    });
  }
  if (!hasPolice) {
    missingActionItems.push({
      id: "police-clearance",
      label: "Attach ZRP CID Police Clearance Certificate",
      points: 10,
      actionKey: "upload_clearance",
    });
  }
  if (referenceLetters.length === 0) {
    missingActionItems.push({
      id: "reference-letter",
      label: "Upload Signed Employer Reference Letter",
      points: 10,
      actionKey: "upload_reference",
    });
  }

  return {
    totalPercentage: total,
    level,
    levelColor,
    levelBadge,
    summaryText,
    categories,
    missingActionItems,
  };
}
