export interface MarketplaceCategory {
  id: string;
  name: string; // e.g. "Maids", "Gardener", "Nurse Aids"
  slug: string; // "maids", "gardener", "nurse-aids"
  description: string;
  iconName?: string;
  icon?: string; // Emoji or Lucide icon indicator
  coverImageUrl?: string;
  type?: string; // e.g. "Household & Domestic", "Outdoor & Landscaping", "Healthcare & Caregiving"
  status: "Active" | "Inactive";
  activeWorkerCount?: number;
  activeJobCount?: number;
  createdAt: string;
  updatedAt?: string;
  order?: number;
}

export interface CategoryStats {
  id: string;
  name: string;
  slug: string;
  status: "Active" | "Inactive";
  activeWorkerCount: number;
  activeJobCount: number;
  isPubliclyVisible: boolean; // true if status === "Active" && (activeWorkerCount > 0 || activeJobCount > 0)
}

export interface FeaturedWorkerPayment {
  id: string; // Unique transaction id
  paymentReference: string; // Unique ref e.g. PAYNOW-FT-174000-ABCD
  workerId: string;
  workerName: string;
  workerRole?: string;
  category: string;
  amountUSD: number; // 3.00
  paymentMethod: "EcoCash" | "OneMoney" | "InnBucks" | "ZimSwitch" | "Visa / MasterCard" | "Paynow USD";
  paymentStatus: "Paid" | "Pending" | "Failed" | "Refunded";
  paymentDate: string;
  featuredStatus: "Active" | "Inactive" | "Expired" | "Revoked";
  activationDate?: string;
  expiresAt?: string; // 30-day duration
  receiptNumber?: string;
  pollUrl?: string;
  notes?: string;
}
