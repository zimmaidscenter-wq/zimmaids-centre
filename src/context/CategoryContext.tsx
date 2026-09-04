import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { MarketplaceCategory, CategoryStats, FeaturedWorkerPayment } from "../types/category";
import { DEFAULT_CATEGORIES, INITIAL_FEATURED_PAYMENTS } from "../data/categoryData";
import { SAMPLE_WORKERS, SAMPLE_JOBS } from "../data/mockData";
import { WorkerProfile, JobPosting } from "../types/marketplace";

interface AddCategoryInput {
  name: string;
  description?: string;
  iconName?: string;
}

interface UpdateCategoryInput {
  name?: string;
  description?: string;
  iconName?: string;
  status?: "Active" | "Inactive";
}

interface CategoryContextType {
  categories: MarketplaceCategory[];
  publicCategories: MarketplaceCategory[]; // Categories visible publicly (active + have >=1 worker or job)
  categoryStats: CategoryStats[];
  allWorkers: WorkerProfile[];
  allJobs: JobPosting[];
  featuredPayments: FeaturedWorkerPayment[];
  
  // Category Admin CRUD & Validation
  addCategory: (input: AddCategoryInput) => { success: boolean; category?: MarketplaceCategory; error?: string };
  updateCategory: (id: string, input: UpdateCategoryInput) => { success: boolean; error?: string };
  toggleCategoryStatus: (id: string) => { success: boolean; error?: string };
  deleteCategory: (id: string, reassignToCategoryId?: string) => { success: boolean; error?: string };
  getCategoryByName: (name: string) => MarketplaceCategory | undefined;
  isCategoryPubliclyVisible: (categoryName: string) => boolean;
  normalizeCategoryName: (rawRoleOrCategory: string) => string;
  
  // Featured Worker $3 System
  initiateFeaturedPayment: (
    workerId: string,
    workerName: string,
    category: string,
    paymentMethod: FeaturedWorkerPayment["paymentMethod"]
  ) => { success: boolean; payment: FeaturedWorkerPayment };
  confirmFeaturedPayment: (
    paymentReference: string,
    receiptNumber?: string
  ) => { success: boolean; message: string; payment?: FeaturedWorkerPayment };
  adminToggleFeaturedStatus: (
    paymentId: string,
    newStatus: "Active" | "Inactive" | "Revoked"
  ) => { success: boolean; error?: string };
  adminDeactivateWorkerFeatured: (workerId: string, reason?: string) => { success: boolean };
  
  // Worker & Job Mutation
  updateWorkerCategory: (workerId: string, newCategoryName: string) => void;
  addWorkerProfile: (worker: WorkerProfile) => void;
  updateWorkerProfile: (workerId: string, updates: Partial<WorkerProfile>) => void;
  addJobPosting: (job: JobPosting) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

const CATEGORIES_STORAGE_KEY = "zmc_categories_dynamic_v2";
const FEATURED_PAYMENTS_STORAGE_KEY = "zmc_featured_payments_v2";
const WORKERS_STORAGE_KEY = "zmc_all_workers_dynamic_v2";
const JOBS_STORAGE_KEY = "zmc_all_jobs_dynamic_v2";

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser: authUser } = useAuth();

  // 1. Dynamic Categories State
  const [categories, setCategories] = useState<MarketplaceCategory[]>(() => {
    try {
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load categories from localStorage:", e);
    }
    return DEFAULT_CATEGORIES;
  });

  // 2. Workers State with Featured Status Integration
  const [allWorkers, setAllWorkers] = useState<WorkerProfile[]>(() => {
    try {
      const saved = localStorage.getItem(WORKERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load workers from localStorage:", e);
    }
    // Seed sample workers ensuring roles map to default categories
    return SAMPLE_WORKERS.map((w, idx) => {
      // Map initial roles cleanly to default categories
      let role = w.role;
      const lower = (w.role || "").toLowerCase();
      if (lower.includes("maid") || lower.includes("domestic") || lower.includes("housekeep") || lower.includes("nanny") || lower.includes("cleaner") || lower.includes("cook")) {
        role = "Maids";
      } else if (lower.includes("garden") || lower.includes("tree") || lower.includes("landscap") || lower.includes("farm")) {
        role = "Gardener";
      } else if (lower.includes("nurse") || lower.includes("care") || lower.includes("aide") || lower.includes("doctor")) {
        role = "Nurse Aids";
      } else {
        // Default to Maids or Gardener for domestic consistency
        role = idx % 2 === 0 ? "Maids" : "Gardener";
      }

      return {
        ...w,
        role: role as any,
        isFeatured: false,
        featuredExpiresAt: undefined,
      };
    });
  });

  // 3. Jobs State
  const [allJobs, setAllJobs] = useState<JobPosting[]>(() => {
    try {
      const saved = localStorage.getItem(JOBS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load jobs from localStorage:", e);
    }
    return SAMPLE_JOBS.map((j, idx) => {
      let roleNeeded = j.roleNeeded;
      const lower = (j.roleNeeded || "").toLowerCase();
      if (lower.includes("maid") || lower.includes("domestic") || lower.includes("housekeep") || lower.includes("nanny") || lower.includes("cleaner")) {
        roleNeeded = "Maids" as any;
      } else if (lower.includes("garden") || lower.includes("landscap")) {
        roleNeeded = "Gardener" as any;
      } else if (lower.includes("nurse") || lower.includes("care") || lower.includes("aide")) {
        roleNeeded = "Nurse Aids" as any;
      } else {
        roleNeeded = idx % 2 === 0 ? "Maids" as any : "Gardener" as any;
      }
      return {
        ...j,
        roleNeeded,
      };
    });
  });

  // 4. Featured Payments State
  const [featuredPayments, setFeaturedPayments] = useState<FeaturedWorkerPayment[]>(() => {
    try {
      const saved = localStorage.getItem(FEATURED_PAYMENTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load featured payments from localStorage:", e);
    }
    return INITIAL_FEATURED_PAYMENTS;
  });

  // Synchronize state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch (e) {
      console.error("Error persisting categories:", e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(WORKERS_STORAGE_KEY, JSON.stringify(allWorkers));
    } catch (e) {
      console.error("Error persisting workers:", e);
    }
  }, [allWorkers]);

  useEffect(() => {
    try {
      localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(allJobs));
    } catch (e) {
      console.error("Error persisting jobs:", e);
    }
  }, [allJobs]);

  useEffect(() => {
    try {
      localStorage.setItem(FEATURED_PAYMENTS_STORAGE_KEY, JSON.stringify(featuredPayments));
    } catch (e) {
      console.error("Error persisting featured payments:", e);
    }
  }, [featuredPayments]);

  // Synchronize newly registered or logged in worker so they appear at the very top of allWorkers!
  useEffect(() => {
    if (!authUser || authUser.role !== "Worker") return;

    setAllWorkers((prev) => {
      const existing = prev.find(
        (w) => w.id === authUser.id || (w.email && w.email.toLowerCase() === authUser.email.toLowerCase())
      );
      const newWorker: WorkerProfile = {
        id: authUser.id,
        fullName: authUser.fullName,
        role: (authUser.specificProfession as any) || existing?.role || "Maids",
        avatarUrl: authUser.avatarUrl || existing?.avatarUrl || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
        rating: existing?.rating || 5.0,
        reviewCount: existing?.reviewCount || 0,
        hourlyRateUSD: existing?.hourlyRateUSD || 5,
        monthlyRateUSD: existing?.monthlyRateUSD || 220,
        province: authUser.city || "Harare",
        district: authUser.suburb || "Central",
        city: (authUser.city as any) || "Harare",
        suburb: authUser.suburb || "Central",
        distanceKm: 2,
        experienceYears: 3,
        education: "O-Level",
        age: 28,
        gender: "Female",
        willingToLiveIn: true,
        willingToLiveOut: true,
        languages: ["English", "Shona"],
        skills: ["Housekeeping", "Cleaning", "Laundry", "Cooking", "Childcare"],
        bio: `Newly registered verified worker in ${authUser.city || "Harare"}. Available for immediate placement.`,
        verifications: {
          idCheck: true,
          policeClearance: authUser.approvalStatus === "Approved",
          referenceVerified: authUser.approvalStatus === "Approved",
          medicalCert: true,
        },
        isVerified: authUser.isVerified || authUser.approvalStatus === "Approved",
        availability: "Full-Time",
        policeClearanceDate: "2026-01-10",
        aiTrustScore: 92,
        status: "Active",
        isNew: true,
        submittedDate: new Date().toISOString(),
        phoneNumber: authUser.phoneNumber || "+263 785 458 828",
        whatsappNumber: authUser.phoneNumber || "+263 785 458 828",
        email: authUser.email,
      };

      const filtered = prev.filter(
        (w) => w.id !== authUser.id && (!w.email || w.email.toLowerCase() !== authUser.email.toLowerCase())
      );
      return [newWorker, ...filtered];
    });
  }, [authUser]);

  // Helper: Normalize raw role/category string into matched category name
  const normalizeCategoryName = (rawRoleOrCategory: string): string => {
    if (!rawRoleOrCategory) return "Maids";
    const cleaned = rawRoleOrCategory.trim();
    
    // Direct exact case-insensitive check against active categories
    const exact = categories.find((c) => c.name.toLowerCase() === cleaned.toLowerCase());
    if (exact) return exact.name;

    const lower = cleaned.toLowerCase();
    if (lower.includes("maid") || lower.includes("domestic") || lower.includes("housekeep") || lower.includes("nanny") || lower.includes("cleaner") || lower.includes("cook")) {
      return "Maids";
    }
    if (lower.includes("garden") || lower.includes("tree") || lower.includes("landscap") || lower.includes("farm")) {
      return "Gardener";
    }
    if (lower.includes("nurse") || lower.includes("care") || lower.includes("aide") || lower.includes("doctor")) {
      return "Nurse Aids";
    }
    return cleaned;
  };

  // Helper: Check if worker belongs to category
  const isWorkerInCategory = (worker: WorkerProfile, categoryName: string): boolean => {
    const workerCat = normalizeCategoryName(worker.role || "");
    const targetCat = normalizeCategoryName(categoryName);
    return workerCat.toLowerCase() === targetCat.toLowerCase();
  };

  // Helper: Check if job belongs to category
  const isJobInCategory = (job: JobPosting, categoryName: string): boolean => {
    const jobCat = normalizeCategoryName(job.roleNeeded || "");
    const targetCat = normalizeCategoryName(categoryName);
    return jobCat.toLowerCase() === targetCat.toLowerCase();
  };

  // 5. Compute Real-time Category Statistics & Visibility
  const categoryStats: CategoryStats[] = useMemo(() => {
    return categories.map((cat) => {
      const activeWorkerCount = allWorkers.filter(
        (w) => isWorkerInCategory(w, cat.name) && w.status !== "Archived" && !w.isRestricted
      ).length;

      const activeJobCount = allJobs.filter(
        (j) => isJobInCategory(j, cat.name) && j.status !== "Closed" && j.status !== "Draft"
      ).length;

      // Rule: Category is publicly visible ONLY IF status === "Active" AND has >=1 active worker OR >=1 active job
      const isPubliclyVisible = cat.status === "Active" && (activeWorkerCount > 0 || activeJobCount > 0);

      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        status: cat.status,
        activeWorkerCount,
        activeJobCount,
        isPubliclyVisible,
      };
    });
  }, [categories, allWorkers, allJobs]);

  // 6. Public Categories: ONLY active categories that have content (workers or jobs)
  const publicCategories: MarketplaceCategory[] = useMemo(() => {
    return categories.filter((cat) => {
      const stats = categoryStats.find((s) => s.id === cat.id);
      return stats ? stats.isPubliclyVisible : false;
    });
  }, [categories, categoryStats]);

  const isCategoryPubliclyVisible = (categoryName: string): boolean => {
    const norm = normalizeCategoryName(categoryName);
    const stats = categoryStats.find((s) => s.name.toLowerCase() === norm.toLowerCase());
    return stats ? stats.isPubliclyVisible : false;
  };

  const getCategoryByName = (name: string): MarketplaceCategory | undefined => {
    const norm = normalizeCategoryName(name);
    return categories.find((c) => c.name.toLowerCase() === norm.toLowerCase());
  };

  // 7. Category Admin Operations with strict validation
  const addCategory = (input: AddCategoryInput) => {
    const trimmedName = (input.name || "").trim();

    // Validation: Prevent blank names
    if (!trimmedName) {
      return { success: false, error: "Category name cannot be blank." };
    }

    if (trimmedName.length < 2) {
      return { success: false, error: "Category name must be at least 2 characters." };
    }

    // Validation: Prevent duplicates (case-insensitive)
    const exists = categories.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase());
    if (exists) {
      return { success: false, error: `A category named "${trimmedName}" already exists.` };
    }

    const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const newCat: MarketplaceCategory = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: trimmedName,
      slug: slug || `cat-${Date.now()}`,
      description: input.description?.trim() || `Professional verified domestic and artisan services in ${trimmedName}.`,
      iconName: input.iconName || "Briefcase",
      status: "Active",
      createdAt: new Date().toISOString(),
      order: categories.length + 1,
    };

    setCategories((prev) => [...prev, newCat]);
    return { success: true, category: newCat };
  };

  const updateCategory = (id: string, input: UpdateCategoryInput) => {
    const target = categories.find((c) => c.id === id);
    if (!target) {
      return { success: false, error: "Category not found." };
    }

    if (input.name !== undefined) {
      const trimmedName = input.name.trim();
      if (!trimmedName) {
        return { success: false, error: "Category name cannot be blank." };
      }
      // Check duplicate against other categories
      const duplicate = categories.some((c) => c.id !== id && c.name.toLowerCase() === trimmedName.toLowerCase());
      if (duplicate) {
        return { success: false, error: `Another category named "${trimmedName}" already exists.` };
      }
    }

    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updatedName = input.name !== undefined ? input.name.trim() : c.name;
        const slug = updatedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        return {
          ...c,
          name: updatedName,
          slug,
          description: input.description !== undefined ? input.description.trim() : c.description,
          iconName: input.iconName !== undefined ? input.iconName : c.iconName,
          status: input.status !== undefined ? input.status : c.status,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    return { success: true };
  };

  const toggleCategoryStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const nextStatus = c.status === "Active" ? "Inactive" : "Active";
        return { ...c, status: nextStatus, updatedAt: new Date().toISOString() };
      })
    );
    return { success: true };
  };

  const deleteCategory = (id: string, reassignToCategoryId?: string) => {
    const target = categories.find((c) => c.id === id);
    if (!target) {
      return { success: false, error: "Category not found." };
    }

    // Safety: ensure default categories or remaining categories can receive workers
    const remainingCats = categories.filter((c) => c.id !== id);
    if (remainingCats.length === 0) {
      return { success: false, error: "Cannot delete the last category on the platform." };
    }

    const fallbackCat = reassignToCategoryId
      ? remainingCats.find((c) => c.id === reassignToCategoryId) || remainingCats[0]
      : remainingCats[0];

    // Reassign workers so workers are never deleted!
    setAllWorkers((prev) =>
      prev.map((w) => {
        if (isWorkerInCategory(w, target.name)) {
          return { ...w, role: fallbackCat.name as any };
        }
        return w;
      })
    );

    // Reassign jobs
    setAllJobs((prev) =>
      prev.map((j) => {
        if (isJobInCategory(j, target.name)) {
          return { ...j, roleNeeded: fallbackCat.name as any };
        }
        return j;
      })
    );

    setCategories((prev) => prev.filter((c) => c.id !== id));
    return { success: true };
  };

  // 8. Featured Worker $3 System
  const initiateFeaturedPayment = (
    workerId: string,
    workerName: string,
    category: string,
    paymentMethod: FeaturedWorkerPayment["paymentMethod"]
  ) => {
    const paymentRef = `PAYNOW-FT-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newPayment: FeaturedWorkerPayment = {
      id: `pay-ft-${Date.now()}`,
      paymentReference: paymentRef,
      workerId,
      workerName,
      workerRole: category,
      category: normalizeCategoryName(category),
      amountUSD: 3.0, // Exact US$3.00 fee
      paymentMethod,
      paymentStatus: "Pending",
      paymentDate: new Date().toISOString().replace("T", " ").substring(0, 19),
      featuredStatus: "Inactive",
      receiptNumber: `RC-ZMC-${Math.floor(10000 + Math.random() * 90000)}`,
      notes: "Payment initiated via Paynow Zimbabwe gateway",
    };

    setFeaturedPayments((prev) => [newPayment, ...prev]);
    return { success: true, payment: newPayment };
  };

  const confirmFeaturedPayment = (paymentReference: string, receiptNumber?: string) => {
    const existing = featuredPayments.find((p) => p.paymentReference === paymentReference);
    if (!existing) {
      return { success: false, error: "Payment reference not found." };
    }

    // Idempotency: prevent double activation
    if (existing.paymentStatus === "Paid" && existing.featuredStatus === "Active") {
      return { success: true, message: "Payment was already confirmed and worker is active.", payment: existing };
    }

    const activationDate = new Date().toISOString();
    const expiryDateObj = new Date();
    expiryDateObj.setDate(expiryDateObj.getDate() + 30); // 30 days featured listing
    const expiresAt = expiryDateObj.toISOString();

    const updatedPayment: FeaturedWorkerPayment = {
      ...existing,
      paymentStatus: "Paid",
      featuredStatus: "Active",
      activationDate: activationDate.replace("T", " ").substring(0, 19),
      expiresAt: expiresAt.replace("T", " ").substring(0, 19),
      receiptNumber: receiptNumber || existing.receiptNumber,
      notes: `Verified successful US$3.00 payment via Paynow on ${new Date().toLocaleDateString()}`,
    };

    setFeaturedPayments((prev) => prev.map((p) => (p.paymentReference === paymentReference ? updatedPayment : p)));

    // Activate featured status on worker profile
    setAllWorkers((prev) =>
      prev.map((w) => {
        if (w.id === existing.workerId) {
          return {
            ...w,
            isFeatured: true,
            featuredExpiresAt: expiresAt,
          };
        }
        return w;
      })
    );

    return {
      success: true,
      message: `Worker "${existing.workerName}" successfully upgraded to Featured Worker for US$3.00!`,
      payment: updatedPayment,
    };
  };

  const adminToggleFeaturedStatus = (paymentId: string, newStatus: "Active" | "Inactive" | "Revoked") => {
    const payment = featuredPayments.find((p) => p.id === paymentId);
    if (!payment) return { success: false, error: "Payment record not found." };

    setFeaturedPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, featuredStatus: newStatus } : p))
    );

    const isFeaturedNow = newStatus === "Active";
    setAllWorkers((prev) =>
      prev.map((w) => (w.id === payment.workerId ? { ...w, isFeatured: isFeaturedNow } : w))
    );

    return { success: true };
  };

  const adminDeactivateWorkerFeatured = (workerId: string, reason?: string) => {
    setAllWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, isFeatured: false, featuredExpiresAt: undefined } : w))
    );

    setFeaturedPayments((prev) =>
      prev.map((p) =>
        p.workerId === workerId && p.featuredStatus === "Active"
          ? { ...p, featuredStatus: "Inactive", notes: `${p.notes || ""} | Deactivated by Admin: ${reason || "Policy moderation"}` }
          : p
      )
    );

    return { success: true };
  };

  const updateWorkerCategory = (workerId: string, newCategoryName: string) => {
    setAllWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, role: newCategoryName as any } : w))
    );
  };

  const addWorkerProfile = (worker: WorkerProfile) => {
    setAllWorkers((prev) => [{ ...worker, isNew: true, submittedDate: worker.submittedDate || new Date().toISOString() }, ...prev]);
  };

  const updateWorkerProfile = (workerId: string, updates: Partial<WorkerProfile>) => {
    setAllWorkers((prev) => prev.map((w) => (w.id === workerId ? { ...w, ...updates } : w)));
  };

  const addJobPosting = (job: JobPosting) => {
    setAllJobs((prev) => [job, ...prev]);
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        publicCategories,
        categoryStats,
        allWorkers,
        allJobs,
        featuredPayments,
        addCategory,
        updateCategory,
        toggleCategoryStatus,
        deleteCategory,
        getCategoryByName,
        isCategoryPubliclyVisible,
        normalizeCategoryName,
        initiateFeaturedPayment,
        confirmFeaturedPayment,
        adminToggleFeaturedStatus,
        adminDeactivateWorkerFeatured,
        updateWorkerCategory,
        addWorkerProfile,
        updateWorkerProfile,
        addJobPosting,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
};
