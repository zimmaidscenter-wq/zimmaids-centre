import React, { createContext, useContext, useState, useEffect } from "react";
import { UserSession, AuthAccountType, ApprovalStatus, AuthContextType } from "../types/auth";
import { CityLocation, UserRole } from "../types/marketplace";
import { AgencyProfile, AgencyPaymentRecord, AgencyRegistrationFormInput, AgencyStaffMember } from "../types/agency";
import { INITIAL_AGENCIES } from "../data/agencyData";
import { 
  auth, 
  db, 
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  doc,
  getDoc,
  setDoc,
  isMasterAdminEmail,
  MASTER_ADMIN_EMAIL
} from "../lib/firebase";

// Default Pre-Configured Users
export const PRECONFIGURED_USERS: Record<AuthAccountType, UserSession> = {
  Admin: {
    id: "usr-admin-01",
    email: "zimmaidscentre@gmail.com",
    fullName: "Tafadzwa Tagwirei (Master Admin)",
    role: "Admin",
    city: "Harare",
    phoneNumber: "+263 785 458 828",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    authProvider: "email",
    approvalStatus: "Approved",
    joinedDate: "2026-01-01",
    isVerified: true,
  },
  Agency: {
    id: "usr-agency-01",
    email: "florence@premierdomestic.co.zw",
    fullName: "Mrs. Florence Chitembwe (Agency Owner)",
    role: "Agency",
    city: "Harare",
    phoneNumber: "+263 772 450 119",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    authProvider: "email",
    approvalStatus: "Approved",
    joinedDate: "2021-03-01",
    isVerified: true,
    agencyId: "agency-harare-01",
    agencyName: "Premier Domestic Staffing Agency",
    isAgencyVerified: true,
    agencySubscriptionStatus: "Active",
  },
  Employer: {
    id: "usr-employer-01",
    email: "margaret@homeowner.co.zw",
    fullName: "Mrs. Margaret Chigumba (Client)",
    role: "Employer",
    city: "Harare",
    phoneNumber: "+263 772 345 678",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    authProvider: "google",
    approvalStatus: "Approved",
    joinedDate: "2026-03-15",
    isVerified: true,
  },
  Worker: {
    id: "usr-worker-01",
    email: "sizani.ndlovu@gmail.com",
    fullName: "Sizani Ndlovu (Employee)",
    role: "Worker",
    specificProfession: "Caregiver",
    city: "Harare",
    phoneNumber: "+263 771 902 441",
    avatarUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200",
    authProvider: "facebook",
    approvalStatus: "Approved",
    joinedDate: "2026-04-10",
    isVerified: true,
  },
};

// Initial Seed Data for Pending & Approved Worker Profiles
const INITIAL_WORKER_PROFILES = [
  {
    id: "w-approved-1",
    fullName: "Sizani Ndlovu",
    role: "Caregiver & Nurse Aide",
    city: "Harare",
    suburb: "Avondale",
    hourlyRateUSD: 5,
    monthlyRateUSD: 280,
    experienceYears: 7,
    approvalStatus: "Approved" as ApprovalStatus,
    verifications: { idCheck: true, policeClearance: true, referenceVerified: true, medicalCert: true },
    isVerified: true,
    bio: "Certified nurse aide with 7 years elderly care experience. ZRP police cleared.",
    photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
    submittedDate: "2026-08-01 09:15",
    policeClearanceNo: "ZRP-P26-90112",
  },
  {
    id: "w-approved-2",
    fullName: "Chipo Moyo",
    role: "Nanny & Housekeeper",
    city: "Harare",
    suburb: "Borrowdale",
    hourlyRateUSD: 4,
    monthlyRateUSD: 220,
    experienceYears: 6,
    approvalStatus: "Approved" as ApprovalStatus,
    verifications: { idCheck: true, policeClearance: true, referenceVerified: true, medicalCert: true },
    isVerified: true,
    bio: "Experienced live-in nanny and housekeeper. Red Cross First Aid certified.",
    photoUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400",
    submittedDate: "2026-08-02 11:30",
    policeClearanceNo: "ZRP-P26-88194",
  },
  {
    id: "v101",
    fullName: "Tariro Chikwanha",
    role: "Nurse Aide & Caregiver",
    city: "Harare",
    suburb: "Borrowdale",
    hourlyRateUSD: 6,
    monthlyRateUSD: 300,
    experienceYears: 5,
    approvalStatus: "Pending Approval" as ApprovalStatus,
    verifications: { idCheck: true, policeClearance: true, referenceVerified: false, medicalCert: true },
    isVerified: false,
    bio: "Dedicated caregiver looking for live-in or day duty in Harare low density suburbs. Certified in Red Cross Home Nursing.",
    photoUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400",
    submittedDate: "2026-08-12 14:20",
    policeClearanceNo: "ZRP CID Clearance Ref # 2026/8821",
    idDocUrl: "National ID 63-299102-X-42",
  },
  {
    id: "v102",
    fullName: "Knowledge Moyo",
    role: "Electrician",
    city: "Bulawayo",
    suburb: "Suburbs",
    hourlyRateUSD: 10,
    monthlyRateUSD: 450,
    experienceYears: 8,
    approvalStatus: "Pending Approval" as ApprovalStatus,
    verifications: { idCheck: true, policeClearance: true, referenceVerified: true, medicalCert: false },
    isVerified: false,
    bio: "Class 1 Journeyman Electrician specializing in residential solar inverter systems and generator wiring.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    submittedDate: "2026-08-12 15:05",
    policeClearanceNo: "ZRP CID Clearance Ref # 2026/9930",
    idDocUrl: "National ID 08-112093-Y-12",
  },
  {
    id: "v103",
    fullName: "Grace Mutambara",
    role: "Housekeeper",
    city: "Mutare",
    suburb: "Greendale",
    hourlyRateUSD: 4,
    monthlyRateUSD: 200,
    experienceYears: 4,
    approvalStatus: "Pending Approval" as ApprovalStatus,
    verifications: { idCheck: true, policeClearance: true, referenceVerified: false, medicalCert: true },
    isVerified: false,
    bio: "Hardworking housekeeper skilled in deep cleaning, steam ironing, and traditional cooking.",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    submittedDate: "2026-08-12 16:11",
    policeClearanceNo: "ZRP CID Clearance Ref # 2026/1042",
    idDocUrl: "National ID 75-883910-W-19",
  },
];

// Initial Seed Data for Pending & Approved Job Postings
const INITIAL_JOB_POSTINGS = [
  {
    id: "j-approved-1",
    title: "Live-In Nanny & Cook for Borrowdale Family",
    roleNeeded: "Nanny",
    employerName: "Mrs. Margaret Chigumba",
    city: "Harare",
    suburb: "Borrowdale",
    offeredSalaryUSD: 350,
    payFrequency: "Monthly",
    workType: "Live-In",
    description: "Seeking a caring nanny to assist with 2 young children, light housekeeping, and evening meals.",
    requiredSkills: ["Infant Care", "Cooking", "First Aid"],
    postedDate: "2026-08-01",
    applicantCount: 12,
    status: "Approved" as ApprovalStatus,
    urgent: true,
  },
  {
    id: "j-approved-2",
    title: "Solar Inverter Maintenance & Battery Wiring",
    roleNeeded: "Electrician",
    employerName: "Tafadzwa Mutasa",
    city: "Harare",
    suburb: "Avondale",
    offeredSalaryUSD: 150,
    payFrequency: "One-Time Task",
    workType: "One-Time Task",
    description: "Fault finding on 5kVA Deye Solar Inverter and 48V Lithium Battery Bank installation.",
    requiredSkills: ["Inverter Wiring", "Solar PV", "Class 1 Journeyman"],
    postedDate: "2026-08-05",
    applicantCount: 5,
    status: "Approved" as ApprovalStatus,
    urgent: false,
  },
  {
    id: "j-pending-101",
    title: "Full-Time Executive Housekeeper & Steam Ironer",
    roleNeeded: "Housekeeper",
    employerName: "Dr. Nyasha Tagwirei",
    city: "Harare",
    suburb: "Mount Pleasant",
    offeredSalaryUSD: 260,
    payFrequency: "Monthly",
    workType: "Full-Time",
    description: "Looking for an experienced housekeeper for daily residence cleaning, laundry, steam ironing, and organizing.",
    requiredSkills: ["Deep Cleaning", "Steam Ironing", "Punctual"],
    postedDate: "2026-08-12",
    applicantCount: 0,
    status: "Pending Approval" as ApprovalStatus,
    urgent: true,
  },
  {
    id: "j-pending-102",
    title: "Part-Time Weekend Gardener & Lawn Mowing",
    roleNeeded: "Gardener",
    employerName: "Eng. Farai Sibanda",
    city: "Bulawayo",
    suburb: "Suburbs",
    offeredSalaryUSD: 110,
    payFrequency: "Monthly",
    workType: "Part-Time",
    description: "Lawn mowing, hedge trimming, and flowerbed maintenance 2 Saturdays per month.",
    requiredSkills: ["Lawn Mowing", "Hedge Trimming", "Landscaping"],
    postedDate: "2026-08-12",
    applicantCount: 0,
    status: "Pending Approval" as ApprovalStatus,
    urgent: false,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Retrieve saved session from localStorage
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem("zmc_auth_session");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Could not load persisted user session:", e);
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"signin" | "signup" | "demo" | "agency-signup">("signup");

  // Keep session synced to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem("zmc_auth_session", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("zmc_auth_session");
      }
    } catch (e) {
      console.warn("Could not persist user session:", e);
    }
  }, [currentUser]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const isAdmin = isMasterAdminEmail(fbUser.email);
        try {
          const userDocRef = doc(db, "users", fbUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            const session: UserSession = {
              id: fbUser.uid,
              email: fbUser.email || "",
              fullName: data.fullName || fbUser.displayName || "User",
              role: isAdmin ? "Admin" : (data.role as AuthAccountType) || "Employer",
              specificProfession: data.specificProfession,
              city: data.city || "Harare",
              phoneNumber: data.phoneNumber || data.phone || "",
              avatarUrl: data.avatarUrl || fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fbUser.email || "user")}`,
              authProvider: fbUser.providerData?.[0]?.providerId === "google.com" ? "google" : "email",
              approvalStatus: isAdmin ? "Approved" : ((data.approvalStatus as ApprovalStatus) || "Approved"),
              joinedDate: data.createdAt ? data.createdAt.substring(0, 10) : new Date().toISOString().substring(0, 10),
              isVerified: isAdmin ? true : (data.isVerified ?? true),
              agencyId: data.agencyId,
              agencyName: data.agencyName,
              isAgencyVerified: data.isAgencyVerified,
              agencySubscriptionStatus: data.agencySubscriptionStatus,
            };
            setCurrentUser(session);
          } else {
            // Document doesn't exist yet, build session and persist
            const role: AuthAccountType = isAdmin ? "Admin" : "Employer";
            const session: UserSession = {
              id: fbUser.uid,
              email: fbUser.email || "",
              fullName: fbUser.displayName || (fbUser.email ? fbUser.email.split("@")[0] : "Administrator"),
              role,
              city: "Harare",
              phoneNumber: "+263 785 458 828",
              avatarUrl: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fbUser.email || "admin")}`,
              authProvider: fbUser.providerData?.[0]?.providerId === "google.com" ? "google" : "email",
              approvalStatus: "Approved",
              joinedDate: new Date().toISOString().split("T")[0],
              isVerified: true,
            };
            setCurrentUser(session);

            // Persist to Firestore
            await setDoc(doc(db, "users", fbUser.uid), {
              uid: fbUser.uid,
              email: fbUser.email,
              fullName: session.fullName,
              phone: session.phoneNumber,
              role: isAdmin ? "admin" : "employer",
              city: "Harare",
              status: "active",
              isVerified: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }, { merge: true });

            if (isAdmin) {
              await setDoc(doc(db, "adminUsers", fbUser.uid), {
                uid: fbUser.uid,
                email: fbUser.email,
                role: "Admin",
                fullName: session.fullName,
                createdAt: new Date().toISOString(),
              }, { merge: true });
            }
          }
        } catch (err) {
          console.warn("Error fetching user profile from Firestore:", err);
          // If Firestore query fails, fallback to session with Admin grant if email matches
          if (isAdmin) {
            setCurrentUser({
              id: fbUser.uid,
              email: fbUser.email || MASTER_ADMIN_EMAIL,
              fullName: fbUser.displayName || "Master Administrator",
              role: "Admin",
              city: "Harare",
              phoneNumber: "+263 785 458 828",
              authProvider: "email",
              approvalStatus: "Approved",
              joinedDate: new Date().toISOString().split("T")[0],
              isVerified: true,
            });
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Agencies Database
  const [agencies, setAgencies] = useState<AgencyProfile[]>(INITIAL_AGENCIES);

  // Worker profiles state
  const [allWorkerProfiles, setAllWorkerProfiles] = useState(INITIAL_WORKER_PROFILES);
  // Job postings state
  const [allJobPostings, setAllJobPostings] = useState(INITIAL_JOB_POSTINGS);

  // Current Agency (if logged-in user is an agency)
  const currentAgency = currentUser?.agencyId
    ? agencies.find((a) => a.id === currentUser.agencyId) || null
    : currentUser?.role === "Agency"
    ? agencies[0] || null
    : null;

  // Computed arrays
  const pendingWorkerProfiles = allWorkerProfiles.filter((w) => w.approvalStatus === "Pending Approval");
  const approvedWorkerProfiles = allWorkerProfiles.filter((w) => w.approvalStatus === "Approved");

  const pendingJobPostings = allJobPostings.filter((j) => j.status === "Pending Approval");
  const approvedJobPostings = allJobPostings.filter((j) => j.status === "Approved");

  // ==========================================
  // AUTH ACTIONS
  // ==========================================

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim();
    const isAdmin = isMasterAdminEmail(trimmedEmail);

    // 1. Check against preconfigured demo users for instant offline / dev access
    const preconfigFound = Object.values(PRECONFIGURED_USERS).find(
      (u) => u.email.toLowerCase() === trimmedEmail.toLowerCase()
    );
    if (preconfigFound && pass === "password123") {
      setCurrentUser(preconfigFound);
      setIsAuthModalOpen(false);
      return { success: true };
    }

    // 2. Authenticate with real Firebase Authentication
    try {
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, pass);
      } catch (signInErr: any) {
        // If account does not exist yet (e.g. initial setup for admin or user), auto-create
        if (signInErr.code === "auth/user-not-found" || signInErr.code === "auth/invalid-credential" || signInErr.code === "auth/invalid-email") {
          try {
            userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, pass);
          } catch (createErr: any) {
            if (createErr.code === "auth/email-already-in-use") {
              return { success: false, error: "Incorrect password for this registered account. Please check your password." };
            }
            throw createErr;
          }
        } else if (signInErr.code === "auth/wrong-password") {
          return { success: false, error: "Incorrect password. Please try again." };
        } else {
          throw signInErr;
        }
      }

      const fbUser = userCredential.user;
      const effectiveRole: AuthAccountType = isAdmin ? "Admin" : "Employer";

      // Write / Update Firestore
      try {
        const userDocRef = doc(db, "users", fbUser.uid);
        await setDoc(userDocRef, {
          uid: fbUser.uid,
          email: trimmedEmail,
          fullName: fbUser.displayName || trimmedEmail.split("@")[0].replace(".", " "),
          phone: "+263 785 458 828",
          role: isAdmin ? "admin" : effectiveRole.toLowerCase(),
          city: "Harare",
          status: "active",
          isVerified: true,
          updatedAt: new Date().toISOString(),
        }, { merge: true });

        if (isAdmin) {
          await setDoc(doc(db, "adminUsers", fbUser.uid), {
            uid: fbUser.uid,
            email: trimmedEmail,
            role: "Admin",
            fullName: "Master Administrator",
            createdAt: new Date().toISOString(),
          }, { merge: true });
        }
      } catch (firestoreErr) {
        console.warn("Firestore sync warning on login:", firestoreErr);
      }

      const session: UserSession = {
        id: fbUser.uid,
        email: trimmedEmail,
        fullName: isAdmin ? "Master Admin (Zimbabwe Maids Centre)" : (fbUser.displayName || trimmedEmail.split("@")[0].replace(".", " ")),
        role: effectiveRole,
        city: "Harare",
        phoneNumber: "+263 785 458 828",
        avatarUrl: isAdmin 
          ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
          : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trimmedEmail)}`,
        authProvider: "email",
        approvalStatus: "Approved",
        joinedDate: new Date().toISOString().split("T")[0],
        isVerified: true,
      };

      setCurrentUser(session);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      console.warn("Firebase email login error:", err);
      // Fallback local session if network or demo
      const fallbackRole: AuthAccountType = isAdmin ? "Admin" : "Employer";
      const fallbackUser: UserSession = {
        id: `usr-${Date.now()}`,
        email: trimmedEmail,
        fullName: isAdmin ? "Master Admin" : trimmedEmail.split("@")[0].replace(".", " "),
        role: fallbackRole,
        city: "Harare",
        authProvider: "email",
        approvalStatus: "Approved",
        joinedDate: new Date().toISOString().split("T")[0],
        isVerified: true,
      };
      setCurrentUser(fallbackUser);
      setIsAuthModalOpen(false);
      return { success: true };
    }
  };

  const signupWithEmail = async (data: {
    fullName: string;
    firstName?: string;
    surname?: string;
    dateOfBirth?: string;
    email: string;
    password: string;
    accountType: AuthAccountType;
    city: CityLocation;
    suburb?: string;
    phoneNumber: string;
    avatarUrl?: string;
    specificProfession?: UserRole;
    agencyName?: string;
    isDepositPaid?: boolean;
  }): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = data.email.trim();
    const isAdmin = isMasterAdminEmail(trimmedEmail);
    const assignedRole: AuthAccountType = isAdmin ? "Admin" : data.accountType;
    const isWorker = assignedRole === "Worker";
    const isAgency = assignedRole === "Agency";

    const resolvedFullName = data.fullName || `${data.firstName || ""} ${data.surname || ""}`.trim();
    const finalAvatar = data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(resolvedFullName)}`;

    let createdAgencyId: string | undefined = undefined;

    if (isAgency) {
      createdAgencyId = `agency-${Date.now()}`;
      const newAgency: AgencyProfile = {
        id: createdAgencyId,
        name: data.agencyName || resolvedFullName,
        tradingName: data.agencyName,
        physicalAddress: `${data.city} Central Business District`,
        city: data.city,
        province: `${data.city} Province`,
        email: trimmedEmail,
        phone: data.phoneNumber,
        whatsappNumber: data.phoneNumber,
        logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200",
        description: `Registered domestic placement agency based in ${data.city}, Zimbabwe. Specializing in vetted domestic professionals.`,
        yearsInOperation: 1,
        contactPerson: {
          fullName: resolvedFullName,
          position: "Owner / Director",
          phone: data.phoneNumber,
          email: trimmedEmail,
        },
        verificationDocuments: [
          {
            id: `doc-${Date.now()}-1`,
            type: "National ID of Owner/Manager",
            name: `National_ID_${resolvedFullName.replace(/\s+/g, "_")}.pdf`,
            fileUrl: "https://zimmaidscentre.co.zw/docs/owner_id.pdf",
            uploadedAt: new Date().toISOString().split("T")[0],
            isVerified: false,
          },
        ],
        approvalStatus: "Pending Approval",
        isVerified: false,
        subscription: {
          status: "Pending Verification",
          planName: "Agency Standard Monthly",
          monthlyFeeUSD: 50,
          currentPeriodStart: new Date().toISOString().split("T")[0],
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          gracePeriodEnd: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          daysRemaining: 30,
          paymentHistory: [],
          reminderSchedule: {
            sevenDaysBeforeSent: false,
            threeDaysBeforeSent: false,
            expiryDateSent: false,
            sevenDaysAfterSent: false,
          },
        },
        staffMembers: [
          {
            id: `staff-${Date.now()}`,
            fullName: resolvedFullName,
            email: trimmedEmail,
            phone: data.phoneNumber,
            role: "Owner",
            status: "Active",
            joinedDate: new Date().toISOString().split("T")[0],
          },
        ],
        workerCount: 0,
        activeJobsCount: 0,
        placementsCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      };

      setAgencies((prev) => [newAgency, ...prev]);
    }

    try {
      // 1. Create Firebase Auth user
      let fbUser;
      try {
        const userCred = await createUserWithEmailAndPassword(auth, trimmedEmail, data.password);
        fbUser = userCred.user;
        await updateProfile(fbUser, {
          displayName: resolvedFullName,
          photoURL: finalAvatar,
        });
      } catch (authErr: any) {
        if (authErr.code === "auth/email-already-in-use") {
          // If already created, sign in to sync
          const signCred = await signInWithEmailAndPassword(auth, trimmedEmail, data.password);
          fbUser = signCred.user;
        } else {
          throw authErr;
        }
      }

      const uid = fbUser.uid;
      const isApproved = isAdmin || (!isWorker && !isAgency) || !!data.isDepositPaid;

      // 2. Persist in Firestore `/users/{uid}`
      const userDocData = {
        uid,
        email: trimmedEmail,
        fullName: resolvedFullName,
        firstName: data.firstName || resolvedFullName.split(" ")[0],
        surname: data.surname || resolvedFullName.split(" ").slice(1).join(" "),
        dateOfBirth: data.dateOfBirth || "1996-05-12",
        avatarUrl: finalAvatar,
        phone: data.phoneNumber || "+263 785 458 828",
        role: isAdmin ? "admin" : (assignedRole === "Agency" ? "agency" : (isWorker ? "worker" : "employer")),
        city: data.city,
        suburb: data.suburb || "Central",
        status: "active",
        isVerified: isApproved,
        isDepositPaid: !!data.isDepositPaid,
        approvalStatus: isApproved ? "Approved" : "Pending Approval",
        specificProfession: data.specificProfession || (isWorker ? "Maids" : null),
        agencyId: createdAgencyId || null,
        agencyName: isAgency ? (data.agencyName || resolvedFullName) : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, "users", uid), userDocData, { merge: true });

        // If Master Admin, record in admin collection
        if (isAdmin) {
          await setDoc(doc(db, "adminUsers", uid), {
            uid,
            email: trimmedEmail,
            role: "Admin",
            fullName: resolvedFullName,
            createdAt: new Date().toISOString(),
          }, { merge: true });
        }

        // If Worker, create domain document in `/workers/{uid}`
        if (isWorker) {
          await setDoc(doc(db, "workers", uid), {
            workerId: uid,
            userId: uid,
            primaryCategory: data.specificProfession || "Maids",
            skills: ["Housekeeping", "Cleaning", "Ironing"],
            experienceYears: 3,
            hourlyRateUSD: 5,
            monthlyRateUSD: 220,
            bio: `Registered ${data.specificProfession || "domestic professional"} in ${data.city}.`,
            policeClearanceStatus: isApproved ? "approved" : "pending",
            availabilityStatus: "available",
            ratingAverage: 5.0,
            ratingCount: 0,
            trustScore: 90,
            verifiedBadge: isApproved,
            isDepositPaid: !!data.isDepositPaid,
            approvalStatus: isApproved ? "Approved" : "Pending Approval",
          }, { merge: true });
        }

        // If Employer, create domain document in `/employers/{uid}`
        if (assignedRole === "Employer") {
          await setDoc(doc(db, "employers", uid), {
            employerId: uid,
            userId: uid,
            employerType: "individual_homeowner",
            city: data.city,
            totalJobsPosted: 0,
            totalSpentUSD: 0,
          }, { merge: true });
        }
      } catch (firestoreErr) {
        console.warn("Firestore user creation write:", firestoreErr);
      }

      const newSession: UserSession = {
        id: uid,
        email: trimmedEmail,
        fullName: resolvedFullName,
        firstName: data.firstName || resolvedFullName.split(" ")[0],
        surname: data.surname || resolvedFullName.split(" ").slice(1).join(" "),
        dateOfBirth: data.dateOfBirth || "1996-05-12",
        role: assignedRole,
        specificProfession: data.specificProfession,
        city: data.city,
        suburb: data.suburb || "Central",
        phoneNumber: data.phoneNumber,
        avatarUrl: finalAvatar,
        authProvider: "email",
        approvalStatus: isApproved ? "Approved" : "Pending Approval",
        joinedDate: new Date().toISOString().split("T")[0],
        isVerified: isApproved,
        isDepositPaid: !!data.isDepositPaid,
        agencyId: createdAgencyId,
        agencyName: isAgency ? (data.agencyName || resolvedFullName) : undefined,
        isAgencyVerified: false,
        agencySubscriptionStatus: isAgency ? "Pending Verification" : undefined,
      };

      setCurrentUser(newSession);

      // If worker, also register in UI worker queue
      if (isWorker) {
        const newWorkerItem = {
          id: uid,
          fullName: resolvedFullName,
          firstName: data.firstName || resolvedFullName.split(" ")[0],
          surname: data.surname || resolvedFullName.split(" ").slice(1).join(" "),
          dateOfBirth: data.dateOfBirth || "1996-05-12",
          role: data.specificProfession || "Maids",
          city: data.city,
          suburb: data.suburb || "Central",
          hourlyRateUSD: 5,
          monthlyRateUSD: 220,
          experienceYears: 3,
          approvalStatus: isApproved ? "Approved" : ("Pending Approval" as ApprovalStatus),
          verifications: { idCheck: true, policeClearance: isApproved, referenceVerified: isApproved, medicalCert: true },
          isVerified: isApproved,
          isDepositPaid: !!data.isDepositPaid,
          bio: `Newly registered ${data.specificProfession || "domestic worker"} in ${data.city}.`,
          photoUrl: finalAvatar,
          submittedDate: new Date().toISOString().replace("T", " ").substring(0, 16),
          policeClearanceNo: isApproved ? "ZRP-P26-OK" : "ZRP Submission Pending",
          idDocUrl: `National ID Submission (${resolvedFullName})`,
        };
        setAllWorkerProfiles((prev) => [newWorkerItem, ...prev]);
      }

      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      console.warn("Firebase signup error:", err);
      // Fallback local creation if Firebase auth produces an error
      const isApproved = isAdmin || (!isWorker && !isAgency) || !!data.isDepositPaid;
      const fallbackSession: UserSession = {
        id: `usr-${Date.now()}`,
        email: trimmedEmail,
        fullName: resolvedFullName,
        firstName: data.firstName || resolvedFullName.split(" ")[0],
        surname: data.surname || resolvedFullName.split(" ").slice(1).join(" "),
        dateOfBirth: data.dateOfBirth || "1996-05-12",
        role: assignedRole,
        specificProfession: data.specificProfession,
        city: data.city,
        suburb: data.suburb || "Central",
        phoneNumber: data.phoneNumber,
        avatarUrl: finalAvatar,
        authProvider: "email",
        approvalStatus: isApproved ? "Approved" : "Pending Approval",
        joinedDate: new Date().toISOString().split("T")[0],
        isVerified: isApproved,
        isDepositPaid: !!data.isDepositPaid,
        agencyId: createdAgencyId,
        agencyName: isAgency ? (data.agencyName || resolvedFullName) : undefined,
      };
      setCurrentUser(fallbackSession);
      setIsAuthModalOpen(false);
      return { success: true };
    }
  };

  const depositWorkerFeePaynow = async (workerId: string, paynowRef: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (currentUser) {
        const updatedUser: UserSession = {
          ...currentUser,
          approvalStatus: "Approved",
          isVerified: true,
          isDepositPaid: true,
        };
        setCurrentUser(updatedUser);
      }

      // Update in worker list
      setAllWorkerProfiles((prev) =>
        prev.map((w) =>
          w.id === workerId
            ? { ...w, approvalStatus: "Approved" as ApprovalStatus, isVerified: true, isDepositPaid: true }
            : w
        )
      );

      // Sync with Firestore if active
      if (currentUser?.id) {
        try {
          await setDoc(doc(db, "users", currentUser.id), {
            approvalStatus: "Approved",
            isVerified: true,
            isDepositPaid: true,
            paynowActivationRef: paynowRef,
            activatedAt: new Date().toISOString(),
          }, { merge: true });

          await setDoc(doc(db, "workers", currentUser.id), {
            approvalStatus: "Approved",
            verifiedBadge: true,
            isDepositPaid: true,
            policeClearanceStatus: "approved",
          }, { merge: true });
        } catch (e) {
          console.warn("Firestore worker activation sync:", e);
        }
      }

      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to update worker approval" };
    }
  };

  const loginWithSocial = async (provider: "google" | "facebook", accountType: AuthAccountType = "Employer"): Promise<{ success: boolean; error?: string }> => {
    if (provider === "google") {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        const isAdmin = isMasterAdminEmail(fbUser.email);
        const effectiveRole: AuthAccountType = isAdmin ? "Admin" : accountType;

        // Persist to Firestore
        try {
          await setDoc(doc(db, "users", fbUser.uid), {
            uid: fbUser.uid,
            email: fbUser.email,
            fullName: fbUser.displayName || "Google User",
            phone: "+263 785 458 828",
            role: isAdmin ? "admin" : effectiveRole.toLowerCase(),
            city: "Harare",
            status: "active",
            isVerified: true,
            updatedAt: new Date().toISOString(),
          }, { merge: true });

          if (isAdmin) {
            await setDoc(doc(db, "adminUsers", fbUser.uid), {
              uid: fbUser.uid,
              email: fbUser.email,
              role: "Admin",
              fullName: fbUser.displayName || "Master Administrator",
              createdAt: new Date().toISOString(),
            }, { merge: true });
          }
        } catch (dbErr) {
          console.warn("Social sign in Firestore sync warning:", dbErr);
        }

        const session: UserSession = {
          id: fbUser.uid,
          email: fbUser.email || "",
          fullName: fbUser.displayName || (isAdmin ? "Master Admin" : "Google Client"),
          role: effectiveRole,
          city: "Harare",
          phoneNumber: "+263 785 458 828",
          avatarUrl: fbUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
          authProvider: "google",
          approvalStatus: "Approved",
          joinedDate: new Date().toISOString().split("T")[0],
          isVerified: true,
        };

        setCurrentUser(session);
        setIsAuthModalOpen(false);
        return { success: true };
      } catch (err: any) {
        console.warn("Google popup sign-in fallback triggered:", err);
      }
    }

    // Fallback social mock
    const providerName = provider === "google" ? "Google" : "Facebook";
    const sampleNames = {
      Admin: "Admin Executive",
      Agency: `Premier Domestic Staffing (${providerName} Auth)`,
      Employer: `Client (${providerName} User)`,
      Worker: `Employee (${providerName} User)`,
    };

    const isAgency = accountType === "Agency";

    const newSession: UserSession = {
      id: `usr-${provider}-${Date.now()}`,
      email: `${provider}.${accountType.toLowerCase()}@social.zimmaids.co.zw`,
      fullName: sampleNames[accountType],
      role: accountType,
      city: "Harare",
      phoneNumber: "+263 785 458 828",
      avatarUrl: provider === "google"
        ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
        : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      authProvider: provider,
      approvalStatus: "Approved",
      joinedDate: new Date().toISOString().split("T")[0],
      isVerified: true,
      agencyId: isAgency ? "agency-harare-01" : undefined,
      agencyName: isAgency ? "Premier Domestic Staffing Agency" : undefined,
      isAgencyVerified: isAgency ? true : undefined,
      agencySubscriptionStatus: isAgency ? "Active" : undefined,
    };

    setCurrentUser(newSession);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Firebase sign out error:", e);
    }
    setCurrentUser(null);
  };

  const switchDemoUser = (role: AuthAccountType) => {
    setCurrentUser(PRECONFIGURED_USERS[role]);
  };

  // ==========================================
  // AGENCY MANAGEMENT METHODS
  // ==========================================

  const registerAgency = (input: AgencyRegistrationFormInput): { success: boolean; agencyId: string } => {
    const newAgencyId = `agency-${Date.now()}`;
    const today = new Date().toISOString().split("T")[0];
    const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const grace = new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const hasPayment = !!input.ecoCashTransactionRef;

    const paymentRecord: AgencyPaymentRecord | undefined = hasPayment
      ? {
          id: `pay-${Date.now()}`,
          agencyId: newAgencyId,
          agencyName: input.name,
          amountUSD: 50,
          paymentMethod: "Paynow Gateway",
          recipientName: "Paynow Zimbabwe Gateway",
          recipientEcoCashNumber: "Automated Paynow Clearing",
          senderPhoneNumber: input.ecoCashSenderPhone || input.phone,
          transactionReference: input.ecoCashTransactionRef || `MP${Date.now()}`,
          proofOfPaymentUrl: input.proofOfPaymentUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400",
          proofFileName: input.proofFileName || "Paynow_Receipt_Proof.png",
          submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
          status: "Pending Review",
          notes: "Initial registration monthly fee payment via Paynow Gateway.",
        }
      : undefined;

    const newAgency: AgencyProfile = {
      id: newAgencyId,
      name: input.name,
      tradingName: input.tradingName,
      businessRegNumber: input.businessRegNumber,
      physicalAddress: input.physicalAddress,
      city: input.city,
      province: input.province || `${input.city} Province`,
      email: input.email,
      phone: input.phone,
      whatsappNumber: input.whatsappNumber,
      website: input.website,
      logoUrl: input.logoUrl || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200",
      description: input.description,
      yearsInOperation: input.yearsInOperation || 1,
      contactPerson: input.contactPerson,
      verificationDocuments: input.documents.map((d, index) => ({
        id: `doc-${Date.now()}-${index}`,
        type: d.type,
        name: d.name,
        fileUrl: d.fileUrl,
        uploadedAt: today,
        isVerified: false,
      })),
      approvalStatus: "Pending Approval",
      isVerified: false,
      subscription: {
        status: hasPayment ? "Pending Verification" : "Pending Verification",
        planName: "Agency Standard Monthly",
        monthlyFeeUSD: 50,
        currentPeriodStart: today,
        currentPeriodEnd: expiry,
        gracePeriodEnd: grace,
        daysRemaining: 30,
        pendingPaymentRecord: paymentRecord,
        paymentHistory: [],
        reminderSchedule: {
          sevenDaysBeforeSent: false,
          threeDaysBeforeSent: false,
          expiryDateSent: false,
          sevenDaysAfterSent: false,
        },
      },
      staffMembers: [
        {
          id: `staff-${Date.now()}`,
          fullName: input.contactPerson.fullName,
          email: input.contactPerson.email,
          phone: input.contactPerson.phone,
          role: "Owner",
          status: "Active",
          joinedDate: today,
        },
      ],
      workerCount: 0,
      activeJobsCount: 0,
      placementsCount: 0,
      createdAt: today,
      updatedAt: today,
    };

    setAgencies((prev) => [newAgency, ...prev]);

    // Update current session to agency in Pending Approval
    const agencySession: UserSession = {
      id: `usr-agency-${newAgencyId}`,
      email: newAgency.email,
      fullName: newAgency.contactPerson.fullName,
      role: "Agency",
      city: newAgency.city,
      phoneNumber: newAgency.phone,
      avatarUrl: newAgency.logoUrl,
      authProvider: "email",
      approvalStatus: "Pending Approval",
      joinedDate: today,
      isVerified: false,
      agencyId: newAgencyId,
      agencyName: newAgency.name,
      isAgencyVerified: false,
      agencySubscriptionStatus: "Pending Verification",
    };
    setCurrentUser(agencySession);
    setIsAuthModalOpen(false);

    return { success: true, agencyId: newAgencyId };
  };

  const approveAgency = (agencyId: string) => {
    setAgencies((prev) =>
      prev.map((a) => {
        if (a.id === agencyId) {
          return {
            ...a,
            approvalStatus: "Approved",
            isVerified: true,
            updatedAt: new Date().toISOString().split("T")[0],
            verificationDocuments: a.verificationDocuments.map((doc) => ({ ...doc, isVerified: true })),
          };
        }
        return a;
      })
    );
    if (currentUser?.agencyId === agencyId) {
      setCurrentUser((prev) => (prev ? { ...prev, approvalStatus: "Approved", isVerified: true, isAgencyVerified: true } : null));
    }
  };

  const rejectAgency = (agencyId: string, reason?: string) => {
    setAgencies((prev) =>
      prev.map((a) => (a.id === agencyId ? { ...a, approvalStatus: "Rejected", updatedAt: new Date().toISOString().split("T")[0] } : a))
    );
    if (currentUser?.agencyId === agencyId) {
      setCurrentUser((prev) => (prev ? { ...prev, approvalStatus: "Rejected" } : null));
    }
  };

  const toggleAgencySuspension = (agencyId: string) => {
    setAgencies((prev) =>
      prev.map((a) => {
        if (a.id === agencyId) {
          const nextStatus: ApprovalStatus = a.approvalStatus === "Suspended" ? "Approved" : "Suspended";
          const nextSubStatus = nextStatus === "Suspended" ? "Suspended" : "Active";
          return {
            ...a,
            approvalStatus: nextStatus,
            subscription: { ...a.subscription, status: nextSubStatus },
            updatedAt: new Date().toISOString().split("T")[0],
          };
        }
        return a;
      })
    );
  };

  const submitAgencySubscriptionPayment = (
    agencyId: string,
    payment: {
      senderPhoneNumber: string;
      transactionReference: string;
      proofOfPaymentUrl?: string;
      proofFileName?: string;
      notes?: string;
    }
  ) => {
    const today = new Date().toISOString().replace("T", " ").substring(0, 16);
    const agency = agencies.find((a) => a.id === agencyId);
    if (!agency) return;

    const newPaymentRecord: AgencyPaymentRecord = {
      id: `pay-${Date.now()}`,
      agencyId,
      agencyName: agency.name,
      amountUSD: 50,
      paymentMethod: "Paynow Gateway",
      recipientName: "Paynow Zimbabwe Gateway",
      recipientEcoCashNumber: "Automated Paynow Clearing",
      senderPhoneNumber: payment.senderPhoneNumber,
      transactionReference: payment.transactionReference,
      proofOfPaymentUrl: payment.proofOfPaymentUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400",
      proofFileName: payment.proofFileName || "Paynow_Payment_Receipt.png",
      submittedAt: today,
      status: "Pending Review",
      notes: payment.notes,
    };

    setAgencies((prev) =>
      prev.map((a) => {
        if (a.id === agencyId) {
          return {
            ...a,
            subscription: {
              ...a.subscription,
              status: "Pending Verification",
              pendingPaymentRecord: newPaymentRecord,
            },
          };
        }
        return a;
      })
    );

    if (currentUser?.agencyId === agencyId) {
      setCurrentUser((prev) => (prev ? { ...prev, agencySubscriptionStatus: "Pending Verification" } : null));
    }
  };

  const verifyAgencySubscriptionPayment = (
    agencyId: string,
    paymentId: string,
    approved: boolean,
    rejectionReason?: string
  ) => {
    const today = new Date().toISOString().replace("T", " ").substring(0, 16);
    const dateOnly = new Date().toISOString().split("T")[0];
    const newEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const newGrace = new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    setAgencies((prev) =>
      prev.map((a) => {
        if (a.id === agencyId) {
          const pending = a.subscription.pendingPaymentRecord;
          if (approved) {
            const verifiedPayment: AgencyPaymentRecord = pending
              ? {
                  ...pending,
                  status: "Verified",
                  verifiedAt: today,
                  verifiedBy: "Master Admin (Tafadzwa Tagwirei)",
                  periodGrantedDays: 30,
                }
              : {
                  id: paymentId,
                  agencyId: a.id,
                  agencyName: a.name,
                  amountUSD: 50,
                  paymentMethod: "Paynow Gateway",
                  recipientName: "Paynow Zimbabwe Gateway",
                  recipientEcoCashNumber: "Automated Paynow Clearing",
                  senderPhoneNumber: a.phone,
                  transactionReference: `PAYNOW-${Date.now()}`,
                  proofOfPaymentUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400",
                  proofFileName: "Paynow_Admin_Verified.png",
                  submittedAt: today,
                  verifiedAt: today,
                  verifiedBy: "Master Admin (Tafadzwa Tagwirei)",
                  status: "Verified",
                  periodGrantedDays: 30,
                };

            return {
              ...a,
              approvalStatus: "Approved",
              isVerified: true,
              subscription: {
                ...a.subscription,
                status: "Active",
                currentPeriodStart: dateOnly,
                currentPeriodEnd: newEnd,
                gracePeriodEnd: newGrace,
                daysRemaining: 30,
                lastPaymentDate: dateOnly,
                pendingPaymentRecord: undefined,
                paymentHistory: [verifiedPayment, ...a.subscription.paymentHistory],
              },
            };
          } else {
            return {
              ...a,
              subscription: {
                ...a.subscription,
                status: "Expired",
                pendingPaymentRecord: pending
                  ? { ...pending, status: "Rejected", rejectionReason }
                  : undefined,
              },
            };
          }
        }
        return a;
      })
    );
  };

  const addAgencyWorker = (agencyId: string, worker: any) => {
    const agency = agencies.find((a) => a.id === agencyId);
    const agencyName = agency?.name || "Agency Managed";
    const newWorkerId = `w-agency-${Date.now()}`;

    const newWorkerItem = {
      id: newWorkerId,
      fullName: worker.fullName,
      role: worker.role || "Housekeeper",
      city: worker.city || agency?.city || "Harare",
      suburb: worker.suburb || "Central",
      hourlyRateUSD: worker.hourlyRateUSD || 5,
      monthlyRateUSD: worker.monthlyRateUSD || 220,
      experienceYears: worker.experienceYears || 3,
      approvalStatus: "Approved" as ApprovalStatus,
      verifications: { idCheck: true, policeClearance: true, referenceVerified: true, medicalCert: true },
      isVerified: true,
      agencyId,
      agencyName,
      isAgencyManaged: true,
      isAgencyVerified: agency?.isVerified || true,
      bio: worker.bio || `Vetted candidate managed by ${agencyName}.`,
      photoUrl: worker.photoUrl || worker.avatarUrl || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
      avatarUrl: worker.photoUrl || worker.avatarUrl || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
      submittedDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      policeClearanceNo: worker.policeClearanceNo || "ZRP Verified Ref # 2026/Agency",
      status: "Active",
      rating: 5.0,
      reviewCount: 1,
      skills: worker.skills || ["Professional Cleaning", "Ironing", "Cooking"],
      languages: worker.languages || ["English", "Shona"],
      availability: worker.availability || "Full-Time",
      age: worker.age || 28,
      gender: worker.gender || "Female",
      willingToLiveIn: worker.willingToLiveIn ?? true,
      willingToLiveOut: worker.willingToLiveOut ?? true,
      education: worker.education || "O-Level",
      aiTrustScore: 98,
    };

    setAllWorkerProfiles((prev) => [newWorkerItem, ...prev]);

    // Increment agency worker count
    setAgencies((prev) =>
      prev.map((a) => (a.id === agencyId ? { ...a, workerCount: a.workerCount + 1 } : a))
    );
  };

  const updateAgencyWorker = (agencyId: string, workerId: string, updates: any) => {
    setAllWorkerProfiles((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, ...updates } : w))
    );
  };

  const archiveAgencyWorker = (agencyId: string, workerId: string) => {
    setAllWorkerProfiles((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, status: w.status === "Archived" ? "Active" : "Archived" } : w))
    );
  };

  const deleteAgencyWorker = (agencyId: string, workerId: string) => {
    setAllWorkerProfiles((prev) => prev.filter((w) => w.id !== workerId));
    setAgencies((prev) =>
      prev.map((a) => (a.id === agencyId ? { ...a, workerCount: Math.max(0, a.workerCount - 1) } : a))
    );
  };

  const addAgencyJob = (agencyId: string, job: any) => {
    const agency = agencies.find((a) => a.id === agencyId);
    const newJob = {
      id: `job-agency-${Date.now()}`,
      title: job.title,
      roleNeeded: job.roleNeeded,
      employerName: `${agency?.name || "Agency"} (Client Vacancy)`,
      agencyId,
      agencyName: agency?.name,
      isAgencyVerified: agency?.isVerified || true,
      city: job.city || agency?.city || "Harare",
      suburb: job.suburb || "Central",
      offeredSalaryUSD: job.offeredSalaryUSD || 250,
      payFrequency: job.payFrequency || "Monthly",
      workType: job.workType || "Full-Time",
      description: job.description,
      requiredSkills: job.requiredSkills || ["Experienced", "Punctual"],
      postedDate: new Date().toISOString().split("T")[0],
      applicantCount: 0,
      status: "Open" as const,
      urgent: !!job.urgent,
      isFeatured: !!job.isFeatured,
    };

    setAllJobPostings((prev) => [newJob, ...prev]);
    setAgencies((prev) =>
      prev.map((a) => (a.id === agencyId ? { ...a, activeJobsCount: a.activeJobsCount + 1 } : a))
    );
  };

  const updateAgencyJob = (agencyId: string, jobId: string, updates: any) => {
    setAllJobPostings((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, ...updates } : j))
    );
  };

  const closeAgencyJob = (agencyId: string, jobId: string) => {
    setAllJobPostings((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: "Closed" as const } : j))
    );
    setAgencies((prev) =>
      prev.map((a) => (a.id === agencyId ? { ...a, activeJobsCount: Math.max(0, a.activeJobsCount - 1) } : a))
    );
  };

  const addAgencyStaff = (agencyId: string, staff: Omit<AgencyStaffMember, "id" | "joinedDate">) => {
    const newStaffMember: AgencyStaffMember = {
      ...staff,
      id: `staff-${Date.now()}`,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setAgencies((prev) =>
      prev.map((a) => (a.id === agencyId ? { ...a, staffMembers: [...a.staffMembers, newStaffMember] } : a))
    );
  };

  const updateAgencyProfileDetails = (agencyId: string, updates: Partial<AgencyProfile>) => {
    setAgencies((prev) =>
      prev.map((a) => (a.id === agencyId ? { ...a, ...updates, updatedAt: new Date().toISOString().split("T")[0] } : a))
    );
  };

  // Admin Profile Approval Powers
  const approveWorkerProfile = (id: string) => {
    setAllWorkerProfiles((prev) =>
      prev.map((w) => (w.id === id ? { ...w, approvalStatus: "Approved", isVerified: true } : w))
    );
  };

  const rejectWorkerProfile = (id: string) => {
    setAllWorkerProfiles((prev) =>
      prev.map((w) => (w.id === id ? { ...w, approvalStatus: "Rejected" } : w))
    );
  };

  // Admin Job Posting Approval Powers
  const approveJobPosting = (id: string) => {
    setAllJobPostings((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: "Approved" } : j))
    );
  };

  const rejectJobPosting = (id: string) => {
    setAllJobPostings((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: "Rejected" } : j))
    );
  };

  // Universal Profile Update (Name, Surname, Qualifications, National ID upload, etc.)
  const updateUserProfile = async (updates: Partial<UserSession>): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: "No active user session." };

    try {
      const updatedUser: UserSession = {
        ...currentUser,
        ...updates,
      };

      // Recalculate fullName if firstName or surname provided
      if (updates.firstName || updates.surname) {
        const f = updates.firstName ?? currentUser.firstName ?? "";
        const s = updates.surname ?? currentUser.surname ?? "";
        updatedUser.fullName = `${f} ${s}`.trim();
      }

      setCurrentUser(updatedUser);

      // Sync to localStorage
      try {
        localStorage.setItem("zmc_auth_session", JSON.stringify(updatedUser));
      } catch (e) {
        console.warn("Error saving updated session:", e);
      }

      // Sync to Firestore if user is authenticated with UID
      if (currentUser.id) {
        try {
          const userDocRef = doc(db, "users", currentUser.id);
          await setDoc(userDocRef, {
            ...updates,
            fullName: updatedUser.fullName,
            updatedAt: new Date().toISOString(),
          }, { merge: true });
        } catch (firestoreErr) {
          console.warn("Firestore sync warning on profile update:", firestoreErr);
        }
      }

      return { success: true };
    } catch (err: any) {
      console.error("updateUserProfile error:", err);
      return { success: false, error: err.message || "Failed to update profile" };
    }
  };

  // Feature User Profile for $3.00 USD
  const featureUserProfile = async (feeUSD: number = 3.0): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: "No user logged in." };

    try {
      const expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      const updatedUser: UserSession = {
        ...currentUser,
        isFeatured: true,
        featuredExpiresAt: expiry,
      };

      setCurrentUser(updatedUser);
      localStorage.setItem("zmc_auth_session", JSON.stringify(updatedUser));

      if (currentUser.id) {
        try {
          const userDocRef = doc(db, "users", currentUser.id);
          await setDoc(userDocRef, {
            isFeatured: true,
            featuredExpiresAt: expiry,
            featuredFeePaidUSD: feeUSD,
            featuredPaymentDate: new Date().toISOString(),
          }, { merge: true });
        } catch (err) {
          console.warn("Firestore error saving featured status:", err);
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to feature profile" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isEditProfileModalOpen,
        setIsEditProfileModalOpen,
        authModalTab,
        setAuthModalTab,
        loginWithEmail,
        signupWithEmail,
        loginWithSocial,
        logout,
        switchDemoUser,
        updateUserProfile,
        featureUserProfile,
        depositWorkerFeePaynow,
        agencies,
        currentAgency,
        registerAgency,
        approveAgency,
        rejectAgency,
        toggleAgencySuspension,
        submitAgencySubscriptionPayment,
        verifyAgencySubscriptionPayment,
        addAgencyWorker,
        updateAgencyWorker,
        archiveAgencyWorker,
        deleteAgencyWorker,
        addAgencyJob,
        updateAgencyJob,
        closeAgencyJob,
        addAgencyStaff,
        updateAgencyProfileDetails,
        pendingWorkerProfiles,
        approvedWorkerProfiles,
        approveWorkerProfile,
        rejectWorkerProfile,
        pendingJobPostings,
        approvedJobPostings,
        approveJobPosting,
        rejectJobPosting,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
