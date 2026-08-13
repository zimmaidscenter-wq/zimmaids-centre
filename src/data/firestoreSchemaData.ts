export interface FieldDefinition {
  name: string;
  type: string;
  required: boolean;
  description: string;
  fk?: string; // Foreign Key Target e.g. "users.uid"
  enumValue?: string[];
  example?: any;
  notes?: string;
}

export interface SubcollectionDef {
  name: string;
  path: string;
  description: string;
  fields: FieldDefinition[];
}

export interface IndexRecommendation {
  type: "Single Field" | "Composite" | "Geospatial Geohash" | "Collection Group";
  fields: { name: string; mode: "ASC" | "DESC" | "ARRAY_CONTAINS" }[];
  queryPurpose: string;
}

export interface FirestoreCollectionSpec {
  id: string;
  name: string;
  path: string;
  category: "Identity & RBAC" | "Core Marketplace" | "Engagement & Chat" | "Financials & Trust" | "Operations & Content";
  summary: string;
  relationships: {
    targetCollection: string;
    type: "1:1" | "1:N" | "N:M";
    foreignKey: string;
    description: string;
  }[];
  fields: FieldDefinition[];
  subcollections: SubcollectionDef[];
  indexing: IndexRecommendation[];
  securitySummary: string;
}

export const COMPLETE_FIRESTORE_SCHEMA: FirestoreCollectionSpec[] = [
  {
    id: "users",
    name: "1. Users",
    path: "/users/{userId}",
    category: "Identity & RBAC",
    summary: "Primary user account collection storing core profile metadata, authentication credentials, contact details, and system roles for domestic workers, homeowners, agencies, and administrators.",
    relationships: [
      { targetCollection: "workers", type: "1:1", foreignKey: "workers.workerId = users.uid", description: "Worker profile extension for domestic staff & artisans." },
      { targetCollection: "employers", type: "1:1", foreignKey: "employers.employerId = users.uid", description: "Employer profile extension for homeowners & businesses." },
      { targetCollection: "roles", type: "1:N", foreignKey: "users.role = roles.roleId", description: "Role-based access control assignment." },
      { targetCollection: "notifications", type: "1:N", foreignKey: "users/{userId}/notifications/{notificationId}", description: "Personalized notification feed." }
    ],
    fields: [
      { name: "uid", type: "string", required: true, description: "Firebase Auth unique ID", fk: "auth.uid", example: "usr_263771234567" },
      { name: "email", type: "string", required: true, description: "Account email address", example: "tendai.m@gmail.com" },
      { name: "phone", type: "string", required: true, description: "Verified Zimbabwean mobile number (+263 format)", example: "+263772123456" },
      { name: "fullName", type: "string", required: true, description: "Legal full name as shown on Zimbabwean National ID", example: "Tendai Moyo" },
      { name: "role", type: "string", required: true, description: "System user role", enumValue: ["worker", "employer", "agency", "admin", "support"], example: "worker" },
      { name: "avatarUrl", type: "string", required: false, description: "HTTPS profile photo URL stored in Firebase Cloud Storage", example: "https://storage.googleapis.com/.../avatar.jpg" },
      { name: "city", type: "string", required: true, description: "Primary Zimbabwean city of residence", example: "Harare" },
      { name: "suburb", type: "string", required: true, description: "Residential suburb or high-density township", example: "Avondale" },
      { name: "nationalId", type: "string", required: false, description: "Zimbabwean National ID registration number", example: "63-1234567-A-63" },
      { name: "isPhoneVerified", type: "boolean", required: true, description: "SMS OTP verification status", example: true },
      { name: "isEmailVerified", type: "boolean", required: true, description: "Email confirmation status", example: true },
      { name: "status", type: "string", required: true, description: "Account lifecycle state", enumValue: ["active", "suspended", "pending_verification", "deactivated"], example: "active" },
      { name: "preferredLanguage", type: "string", required: true, description: "Preferred communication language", enumValue: ["en", "sn", "nd", "ny"], example: "sn" },
      { name: "fcmTokens", type: "array<string>", required: false, description: "Firebase Cloud Messaging push tokens", example: ["fcm_token_abc123"] },
      { name: "createdAt", type: "timestamp", required: true, description: "Server timestamp when account was created", example: "2026-01-15T08:30:00Z" },
      { name: "updatedAt", type: "timestamp", required: true, description: "Server timestamp when profile was last modified", example: "2026-08-08T12:00:00Z" }
    ],
    subcollections: [
      {
        name: "Notifications",
        path: "/users/{userId}/notifications/{notificationId}",
        description: "Personalized activity notifications, job invites, and payment status updates.",
        fields: [
          { name: "notificationId", type: "string", required: true, description: "Unique notification ID", example: "notif_9981" },
          { name: "title", type: "string", required: true, description: "Notification heading", example: "New Job Offer in Borrowdale" },
          { name: "body", type: "string", required: true, description: "Notification body text", example: "Mrs. Chitepo invited you for a Full-Time Housekeeper position." },
          { name: "type", type: "string", required: true, description: "Notification category", enumValue: ["job_alert", "application_update", "message_received", "payment_escrow_held", "payment_released", "police_verification_approved", "system_announcement"] },
          { name: "actionUrl", type: "string", required: false, description: "In-app route link", example: "/jobs/job_7721" },
          { name: "isRead", type: "boolean", required: true, description: "Read status flag", example: false },
          { name: "createdAt", type: "timestamp", required: true, description: "Timestamp of alert dispatch", example: "2026-08-08T10:15:00Z" }
        ]
      },
      {
        name: "Subscriptions",
        path: "/users/{userId}/subscriptions/{subscriptionId}",
        description: "Billing tier history and active feature entitlement passes.",
        fields: [
          { name: "subscriptionId", type: "string", required: true, description: "Subscription ID", example: "sub_4412" },
          { name: "planTier", type: "string", required: true, description: "Subscription plan tier", enumValue: ["free", "pro_worker", "gold_employer", "enterprise_agency"] },
          { name: "priceUSD", type: "number", required: true, description: "Monthly recurring fee in USD", example: 15.00 },
          { name: "billingCycle", type: "string", required: true, description: "Billing frequency", enumValue: ["monthly", "quarterly", "annually"] },
          { name: "status", type: "string", required: true, description: "Subscription state", enumValue: ["active", "grace_period", "cancelled", "expired"] },
          { name: "startDate", type: "timestamp", required: true, description: "Period start date" },
          { name: "endDate", type: "timestamp", required: true, description: "Period expiry date" }
        ]
      },
      {
        name: "Verifications",
        path: "/users/{userId}/verifications/{verificationId}",
        description: "KYC documents submitted by user for identity and police record check.",
        fields: [
          { name: "verificationId", type: "string", required: true, description: "Unique verification record ID" },
          { name: "documentType", type: "string", required: true, description: "Type of uploaded legal identity document", enumValue: ["national_id", "zrp_police_clearance", "driver_license", "passport", "reference_letter"] },
          { name: "documentNumber", type: "string", required: true, description: "Document ID number" },
          { name: "frontImageUrl", type: "string", required: true, description: "Encrypted Cloud Storage URL for front image" },
          { name: "backImageUrl", type: "string", required: false, description: "Encrypted Cloud Storage URL for back image" },
          { name: "verificationStatus", type: "string", required: true, description: "Verification stage", enumValue: ["pending", "ai_verified", "manual_review", "approved", "rejected"] },
          { name: "rejectionReason", type: "string", required: false, description: "Detailed explanation if document was rejected" }
        ]
      },
      {
        name: "Settings",
        path: "/users/{userId}/settings/preferences",
        description: "Singleton user preference document.",
        fields: [
          { name: "theme", type: "string", required: true, description: "UI visual mode", enumValue: ["light", "dark", "system"], example: "light" },
          { name: "smsNotifications", type: "boolean", required: true, description: "SMS fallback toggle for offline feature phone alerts", example: true },
          { name: "whatsappAlerts", type: "boolean", required: true, description: "WhatsApp job dispatch notifications", example: true },
          { name: "currencyPreference", type: "string", required: true, description: "Display currency", enumValue: ["USD", "ZWG"], example: "USD" },
          { name: "searchRadiusKm", type: "number", required: true, description: "Proximity radius in kilometres", example: 15 }
        ]
      }
    ],
    indexing: [
      { type: "Single Field", fields: [{ name: "email", mode: "ASC" }], queryPurpose: "Exact lookups during user login and duplicate account checks." },
      { type: "Single Field", fields: [{ name: "phone", mode: "ASC" }], queryPurpose: "SMS OTP authentication and phone contact searches." },
      { type: "Composite", fields: [{ name: "city", mode: "ASC" }, { name: "role", mode: "ASC" }, { name: "status", mode: "ASC" }], queryPurpose: "Filter active workers or employers by city." }
    ],
    securitySummary: "Read access allowed for owner or authenticated users looking up basic profile fields. Full read/write restricted to resource owner or system admins."
  },
  {
    id: "workers",
    name: "2. Workers",
    path: "/workers/{workerId}",
    category: "Core Marketplace",
    summary: "Detailed profiles for domestic workers, caregivers, and skilled house artisans, containing skills, hourly/monthly rates, ZRP police clearance verification status, voice profile URLs, and geohash spatial coordinates.",
    relationships: [
      { targetCollection: "users", type: "1:1", foreignKey: "workers.workerId = users.uid", description: "Points to underlying user account." },
      { targetCollection: "jobs", type: "N:M", foreignKey: "jobs.selectedWorkerId = workers.workerId", description: "Assigned jobs and placement contracts." },
      { targetCollection: "reviews", type: "1:N", foreignKey: "workers/{workerId}/reviews/{reviewId}", description: "Ratings and feedback left by homeowners." },
      { targetCollection: "trainingEnrollments", type: "1:N", foreignKey: "trainingEnrollments.workerId = workers.workerId", description: "Course completions and skill badges." }
    ],
    fields: [
      { name: "workerId", type: "string", required: true, description: "Primary Key matching User UID", fk: "users.uid", example: "usr_263771234567" },
      { name: "userId", type: "string", required: true, description: "FK pointing to Users collection", fk: "users.uid", example: "usr_263771234567" },
      { name: "primaryCategory", type: "string", required: true, description: "Main specialization category", enumValue: ["Housekeeper", "Nanny", "Cook", "Elderly Caregiver", "Gardener", "Driver", "Electrician", "Plumber", "Painter"], example: "Nanny" },
      { name: "skills", type: "array<string>", required: true, description: "Specific verifiable domestic & artisan skills", example: ["Infant CPR", "Baking", "First Aid", "Driving (Class 4)"] },
      { name: "experienceYears", type: "number", required: true, description: "Total years of domestic or trade experience", example: 6 },
      { name: "hourlyRateUSD", type: "number", required: true, description: "Base hourly fee in USD", example: 8.50 },
      { name: "monthlyRateUSD", type: "number", required: true, description: "Full-time monthly salary in USD", example: 280.00 },
      { name: "bio", type: "string", required: true, description: "Personal introduction and employment history summary" },
      { name: "audioBioUrl", type: "string", required: false, description: "Voice recording in Shona/Ndebele/English for accessible listening", example: "https://storage.googleapis.com/.../voice_intro.mp3" },
      { name: "policeClearanceStatus", type: "string", required: true, description: "ZRP Police Clearance record status", enumValue: ["verified", "pending", "not_submitted", "expired"], example: "verified" },
      { name: "policeClearanceDocUrl", type: "string", required: false, description: "Encrypted Cloud Storage URL for ZRP clearance document" },
      { name: "agencyId", type: "string", required: false, description: "Optional placement agency FK", fk: "agencies.agencyId", example: "agency_harare_01" },
      { name: "availabilityStatus", type: "string", required: true, description: "Real-time dispatch availability", enumValue: ["available", "placed", "interviewing", "on_leave"], example: "available" },
      { name: "ratingAverage", type: "number", required: true, description: "Aggregated 5-star rating score", example: 4.85 },
      { name: "ratingCount", type: "number", required: true, description: "Number of completed employer reviews", example: 24 },
      { name: "trustScore", type: "number", required: true, description: "AI Trust Index score (0 to 100)", example: 96 },
      { name: "verifiedBadge", type: "boolean", required: true, description: "Official green verified tick badge", example: true },
      { name: "latitude", type: "number", required: true, description: "Geographic latitude coordinate", example: -17.8252 },
      { name: "longitude", type: "number", required: true, description: "Geographic longitude coordinate", example: 31.0335 },
      { name: "geohash", type: "string", required: true, description: "Geohash for high-speed spatial proximity searches", example: "ks0d89x" }
    ],
    subcollections: [
      {
        name: "Reviews",
        path: "/workers/{workerId}/reviews/{reviewId}",
        description: "Public employer performance ratings and testimonials.",
        fields: [
          { name: "reviewId", type: "string", required: true, description: "Review ID", example: "rev_102" },
          { name: "employerId", type: "string", required: true, description: "Employer user ID", fk: "users.uid" },
          { name: "employerName", type: "string", required: true, description: "Public employer display name" },
          { name: "jobId", type: "string", required: true, description: "Associated job contract FK", fk: "jobs.jobId" },
          { name: "rating", type: "number", required: true, description: "Overall rating out of 5 stars", example: 5 },
          { name: "punctualityRating", type: "number", required: true, description: "Punctuality & reliability sub-score (1-5)", example: 5 },
          { name: "skillRating", type: "number", required: true, description: "Technical performance sub-score (1-5)", example: 5 },
          { name: "trustRating", type: "number", required: true, description: "Trustworthiness sub-score (1-5)", example: 5 },
          { name: "comment", type: "string", required: true, description: "Written performance commentary" },
          { name: "workerResponse", type: "string", required: false, description: "Optional response written by worker" }
        ]
      },
      {
        name: "Training",
        path: "/workers/{workerId}/training/{enrollmentId}",
        description: "Courses taken, assessment scores, and issued certificates.",
        fields: [
          { name: "enrollmentId", type: "string", required: true, description: "Enrollment ID" },
          { name: "courseId", type: "string", required: true, description: "Course FK", fk: "trainingModules.courseId" },
          { name: "courseTitle", type: "string", required: true, description: "Course title e.g. Infant First Aid & Safety" },
          { name: "completionStatus", type: "string", required: true, description: "Course progress status", enumValue: ["enrolled", "in_progress", "completed"] },
          { name: "scorePercent", type: "number", required: false, description: "Final exam score percentage", example: 92 },
          { name: "certificateUrl", type: "string", required: false, description: "Issued digital certificate PDF URL" }
        ]
      }
    ],
    indexing: [
      { type: "Composite", fields: [{ name: "primaryCategory", mode: "ASC" }, { name: "availabilityStatus", mode: "ASC" }, { name: "ratingAverage", mode: "DESC" }], queryPurpose: "Top rated workers list filtered by category and availability." },
      { type: "Composite", fields: [{ name: "policeClearanceStatus", mode: "ASC" }, { name: "verifiedBadge", mode: "ASC" }, { name: "monthlyRateUSD", mode: "ASC" }], queryPurpose: "Verified candidates ordered by salary range." },
      { type: "Geospatial Geohash", fields: [{ name: "geohash", mode: "ASC" }, { name: "primaryCategory", mode: "ASC" }], queryPurpose: "Find nearby workers within 2km - 20km radius using geohash range queries." }
    ],
    securitySummary: "Public read for all active workers. Update restricted to worker profile owner or authorized agency manager."
  },
  {
    id: "employers",
    name: "3. Employers",
    path: "/employers/{employerId}",
    category: "Core Marketplace",
    summary: "Profiles for private homeowners, diplomats, corporate clients, and residential estates looking to hire domestic staff or artisans.",
    relationships: [
      { targetCollection: "users", type: "1:1", foreignKey: "employers.employerId = users.uid", description: "Links to primary user account." },
      { targetCollection: "jobs", type: "1:N", foreignKey: "jobs.employerId = employers.employerId", description: "Job postings published by employer." },
      { targetCollection: "payments", type: "1:N", foreignKey: "payments.employerId = employers.employerId", description: "Escrow deposits and wage payments." }
    ],
    fields: [
      { name: "employerId", type: "string", required: true, description: "Primary Key matching User UID", fk: "users.uid", example: "usr_263779876543" },
      { name: "userId", type: "string", required: true, description: "FK pointing to Users collection", fk: "users.uid", example: "usr_263779876543" },
      { name: "employerType", type: "string", required: true, description: "Classification of household or hiring organization", enumValue: ["individual_homeowner", "private_household", "corporate_office", "diplomatic_mission"], example: "private_household" },
      { name: "houseSize", type: "string", required: true, description: "Property size context for workload estimation", enumValue: ["apartment", "medium_house", "large_estate", "farm"], example: "large_estate" },
      { name: "familyMembersCount", type: "number", required: true, description: "Number of residents in household", example: 5 },
      { name: "hasChildren", type: "boolean", required: true, description: "Presence of toddlers or young children", example: true },
      { name: "hasElderly", type: "boolean", required: true, description: "Presence of elderly residents requiring care", example: false },
      { name: "city", type: "string", required: true, description: "City where work location is situated", example: "Bulawayo" },
      { name: "suburb", type: "string", required: true, description: "Suburb name", example: "Kumalo" },
      { name: "totalJobsPosted", type: "number", required: true, description: "Total vacancies advertised", example: 3 },
      { name: "totalSpentUSD", type: "number", required: true, description: "Cumulative wage expenditure via platform escrow", example: 1450.00 }
    ],
    subcollections: [],
    indexing: [
      { type: "Single Field", fields: [{ name: "employerType", mode: "ASC" }], queryPurpose: "Segment employers by household vs corporate." },
      { type: "Composite", fields: [{ name: "city", mode: "ASC" }, { name: "suburb", mode: "ASC" }], queryPurpose: "Geographic categorization of hiring demand." }
    ],
    securitySummary: "Read access restricted to authenticated workers responding to jobs or system admins. Write restricted to employer owner."
  },
  {
    id: "jobs",
    name: "4. Jobs",
    path: "/jobs/{jobId}",
    category: "Core Marketplace",
    summary: "Job vacancies and dispatch requests containing duties, salary range, location, urgency level, and subcollections for applications and milestone payouts.",
    relationships: [
      { targetCollection: "employers", type: "1:N", foreignKey: "jobs.employerId = employers.employerId", description: "Employer who published the vacancy." },
      { targetCollection: "workers", type: "1:1", foreignKey: "jobs.selectedWorkerId = workers.workerId", description: "Worker hired for the role." },
      { targetCollection: "applications", type: "1:N", foreignKey: "jobs/{jobId}/applications/{applicationId}", description: "Submitted worker applications." },
      { targetCollection: "payments", type: "1:N", foreignKey: "payments.jobId = jobs.jobId", description: "Escrow wage funding." }
    ],
    fields: [
      { name: "jobId", type: "string", required: true, description: "Unique Job ID", example: "job_8821" },
      { name: "employerId", type: "string", required: true, description: "Employer user ID FK", fk: "employers.employerId", example: "usr_263779876543" },
      { name: "employerName", type: "string", required: true, description: "Employer display name", example: "Dr. A. Sibanda" },
      { name: "title", type: "string", required: true, description: "Job title heading", example: "Full-Time Live-in Nanny & Housekeeper" },
      { name: "category", type: "string", required: true, description: "Primary work category", enumValue: ["Housekeeper", "Nanny", "Cook", "Elderly Caregiver", "Gardener", "Driver", "Electrician", "Plumber", "Painter"], example: "Nanny" },
      { name: "jobType", type: "string", required: true, description: "Employment format", enumValue: ["full_time_live_in", "full_time_live_out", "part_time", "one_time_task", "contract"], example: "full_time_live_in" },
      { name: "description", type: "string", required: true, description: "Full job responsibilities and working conditions" },
      { name: "city", type: "string", required: true, description: "City location", example: "Harare" },
      { name: "suburb", type: "string", required: true, description: "Suburb location", example: "Borrowdale" },
      { name: "salaryMinUSD", type: "number", required: true, description: "Minimum salary budget in USD", example: 300.00 },
      { name: "salaryMaxUSD", type: "number", required: true, description: "Maximum salary budget in USD", example: 350.00 },
      { name: "salaryType", type: "string", required: true, description: "Payment structure", enumValue: ["hourly", "daily", "monthly", "project_fixed"], example: "monthly" },
      { name: "status", type: "string", required: true, description: "Vacancy lifecycle state", enumValue: ["open", "applications_closed", "interviewing", "filled", "cancelled", "expired"], example: "open" },
      { name: "applicantsCount", type: "number", required: true, description: "Counter of submitted applications", example: 12 },
      { name: "selectedWorkerId", type: "string", required: false, description: "Hired worker ID FK", fk: "workers.workerId", example: "usr_263771234567" },
      { name: "createdAt", type: "timestamp", required: true, description: "Posting creation time", example: "2026-08-01T09:00:00Z" }
    ],
    subcollections: [
      {
        name: "Applications",
        path: "/jobs/{jobId}/applications/{applicationId}",
        description: "Candidate applications submitted specifically for this job listing.",
        fields: [
          { name: "applicationId", type: "string", required: true, description: "Application ID", example: "app_5501" },
          { name: "workerId", type: "string", required: true, description: "Worker user ID FK", fk: "workers.workerId" },
          { name: "workerName", type: "string", required: true, description: "Worker full name" },
          { name: "pitchMessage", type: "string", required: true, description: "Cover note / statement of suitablity" },
          { name: "expectedSalaryUSD", type: "number", required: true, description: "Worker's requested wage in USD", example: 320.00 },
          { name: "status", type: "string", required: true, description: "Application status", enumValue: ["applied", "shortlisted", "interview_scheduled", "offered", "accepted", "rejected", "withdrawn"] }
        ]
      },
      {
        name: "Milestones",
        path: "/jobs/{jobId}/milestones/{milestoneId}",
        description: "Task stages and escrow funding releases for artisan / contract projects.",
        fields: [
          { name: "milestoneId", type: "string", required: true, description: "Milestone ID" },
          { name: "title", type: "string", required: true, description: "Milestone title e.g. Rough Wiring Completion" },
          { name: "amountUSD", type: "number", required: true, description: "Milestone payout amount USD", example: 120.00 },
          { name: "status", type: "string", required: true, description: "Milestone status", enumValue: ["pending", "funded_escrow", "submitted", "approved", "released"] }
        ]
      }
    ],
    indexing: [
      { type: "Composite", fields: [{ name: "category", mode: "ASC" }, { name: "status", mode: "ASC" }, { name: "createdAt", mode: "DESC" }], queryPurpose: "Worker feed searching open jobs in specific categories ordered by newest." },
      { type: "Composite", fields: [{ name: "city", mode: "ASC" }, { name: "jobType", mode: "ASC" }, { name: "salaryMinUSD", mode: "DESC" }], queryPurpose: "Job search filtered by location and salary tier." }
    ],
    securitySummary: "Public read for open listings. Create/Update restricted to employer owner or agency administrator."
  },
  {
    id: "applications",
    name: "5. Applications",
    path: "/applications/{applicationId}",
    category: "Core Marketplace",
    summary: "Top-level collection mirroring job applications to enable workers to query their full application history across all employers in a single query.",
    relationships: [
      { targetCollection: "jobs", type: "1:N", foreignKey: "applications.jobId = jobs.jobId", description: "Target job listing." },
      { targetCollection: "workers", type: "1:N", foreignKey: "applications.workerId = workers.workerId", description: "Applicant worker." },
      { targetCollection: "employers", type: "1:N", foreignKey: "applications.employerId = employers.employerId", description: "Employer receiving application." }
    ],
    fields: [
      { name: "applicationId", type: "string", required: true, description: "Unique Application ID", example: "app_5501" },
      { name: "jobId", type: "string", required: true, description: "Job FK", fk: "jobs.jobId", example: "job_8821" },
      { name: "workerId", type: "string", required: true, description: "Worker FK", fk: "workers.workerId", example: "usr_263771234567" },
      { name: "employerId", type: "string", required: true, description: "Employer FK", fk: "employers.employerId", example: "usr_263779876543" },
      { name: "workerName", type: "string", required: true, description: "Applicant display name", example: "Tendai Moyo" },
      { name: "pitchMessage", type: "string", required: true, description: "Personal pitch to employer" },
      { name: "expectedSalaryUSD", type: "number", required: true, description: "Requested wage", example: 320.00 },
      { name: "status", type: "string", required: true, description: "Application stage", enumValue: ["applied", "shortlisted", "interview_scheduled", "offered", "accepted", "rejected", "withdrawn"], example: "shortlisted" },
      { name: "createdAt", type: "timestamp", required: true, description: "Submission date", example: "2026-08-02T11:20:00Z" }
    ],
    subcollections: [],
    indexing: [
      { type: "Composite", fields: [{ name: "workerId", mode: "ASC" }, { name: "createdAt", mode: "DESC" }], queryPurpose: "Worker candidate dashboard displaying active application history." },
      { type: "Composite", fields: [{ name: "employerId", mode: "ASC" }, { name: "status", mode: "ASC" }], queryPurpose: "Employer dashboard viewing shortlisted candidates." }
    ],
    securitySummary: "Read/Write restricted to candidate worker or target employer."
  },
  {
    id: "messages",
    name: "6. Messages & Chats",
    path: "/chats/{chatId}",
    category: "Engagement & Chat",
    summary: "Real-time chat threads between homeowners, domestic staff, and agency managers, featuring voice note recordings, media attachments, and read receipts.",
    relationships: [
      { targetCollection: "users", type: "N:M", foreignKey: "chats.participants", description: "User UIDs participating in thread." },
      { targetCollection: "jobs", type: "1:1", foreignKey: "chats.jobId = jobs.jobId", description: "Optional job context." }
    ],
    fields: [
      { name: "chatId", type: "string", required: true, description: "Unique Thread ID", example: "chat_7712_9982" },
      { name: "jobId", type: "string", required: false, description: "Optional associated Job FK", fk: "jobs.jobId", example: "job_8821" },
      { name: "participants", type: "array<string>", required: true, description: "List of participant User UIDs", example: ["usr_263771234567", "usr_263779876543"] },
      { name: "lastMessageText", type: "string", required: true, description: "Preview of latest message", example: "Yes, I am available for an interview tomorrow at 10 AM." },
      { name: "lastMessageTimestamp", type: "timestamp", required: true, description: "Timestamp of last interaction", example: "2026-08-08T14:22:00Z" }
    ],
    subcollections: [
      {
        name: "Messages",
        path: "/chats/{chatId}/messages/{messageId}",
        description: "Individual message items with support for voice notes and images.",
        fields: [
          { name: "messageId", type: "string", required: true, description: "Message ID", example: "msg_10092" },
          { name: "chatId", type: "string", required: true, description: "Parent Chat ID" },
          { name: "senderId", type: "string", required: true, description: "Sender User UID", fk: "users.uid" },
          { name: "receiverId", type: "string", required: true, description: "Recipient User UID", fk: "users.uid" },
          { name: "text", type: "string", required: true, description: "Text content of message" },
          { name: "mediaUrl", type: "string", required: false, description: "Optional Cloud Storage attachment URL" },
          { name: "mediaType", type: "string", required: true, description: "Type of content", enumValue: ["text", "image", "audio_voice_note", "document"] },
          { name: "isRead", type: "boolean", required: true, description: "Read status flag", example: true },
          { name: "createdAt", type: "timestamp", required: true, description: "Message timestamp" }
        ]
      }
    ],
    indexing: [
      { type: "Composite", fields: [{ name: "participants", mode: "ARRAY_CONTAINS" }, { name: "lastMessageTimestamp", mode: "DESC" }], queryPurpose: "User inbox displaying active conversations sorted by recent activity." }
    ],
    securitySummary: "Read/Write strictly restricted to thread participants in `participants` array."
  },
  {
    id: "payments",
    name: "7. Payments",
    path: "/payments/{paymentId}",
    category: "Financials & Trust",
    summary: "Immutable financial ledger recording EcoCash, InnBucks, ZimSwitch, and Card escrow deposits, platform commissions, and worker disbursements.",
    relationships: [
      { targetCollection: "jobs", type: "1:1", foreignKey: "payments.jobId = jobs.jobId", description: "Job contract associated with payment." },
      { targetCollection: "employers", type: "1:N", foreignKey: "payments.employerId = employers.employerId", description: "Paying employer." },
      { targetCollection: "workers", type: "1:N", foreignKey: "payments.workerId = workers.workerId", description: "Beneficiary worker." }
    ],
    fields: [
      { name: "paymentId", type: "string", required: true, description: "Payment Transaction ID", example: "pay_escrow_9011" },
      { name: "bookingId", type: "string", required: true, description: "Placement contract ID", example: "bk_3301" },
      { name: "jobId", type: "string", required: true, description: "Job FK", fk: "jobs.jobId", example: "job_8821" },
      { name: "employerId", type: "string", required: true, description: "Employer FK", fk: "employers.employerId", example: "usr_263779876543" },
      { name: "workerId", type: "string", required: true, description: "Worker FK", fk: "workers.workerId", example: "usr_263771234567" },
      { name: "amountUSD", type: "number", required: true, description: "Gross transaction amount in USD", example: 350.00 },
      { name: "amountLocalZWG", type: "number", required: false, description: "Local currency equivalent in Zimbabwean Gold (ZWG)", example: 4900.00 },
      { name: "currency", type: "string", required: true, description: "Transaction currency code", enumValue: ["USD", "ZWG"], example: "USD" },
      { name: "paymentGateway", type: "string", required: true, description: "Local or international payment processor used", enumValue: ["ecocash", "innbucks", "zimswitch_zipit", "stripe_card", "cash_voucher"], example: "ecocash" },
      { name: "gatewayTransactionRef", type: "string", required: true, description: "Unique gateway reference identifier", example: "ECO-26377-889102" },
      { name: "escrowStatus", type: "string", required: true, description: "Escrow financial state", enumValue: ["pending_deposit", "escrow_held", "released_to_worker", "refunded_to_employer", "disputed"], example: "escrow_held" },
      { name: "platformFeeUSD", type: "number", required: true, description: "Platform service fee deduction (e.g. 5%)", example: 17.50 },
      { name: "netWorkerPayoutUSD", type: "number", required: true, description: "Net amount released to worker wallet", example: 332.50 },
      { name: "createdAt", type: "timestamp", required: true, description: "Deposit initiation timestamp" }
    ],
    subcollections: [
      {
        name: "EscrowLogs",
        path: "/payments/{paymentId}/escrowLogs/{logId}",
        description: "Audit trail of escrow lifecycle transitions and dispute releases.",
        fields: [
          { name: "logId", type: "string", required: true, description: "Log ID" },
          { name: "action", type: "string", required: true, description: "Escrow transition action", enumValue: ["deposit", "hold", "release_request", "release_approved", "refund_processed", "dispute_raised"] },
          { name: "triggeredByUserId", type: "string", required: true, description: "User or admin who performed transition", fk: "users.uid" },
          { name: "note", type: "string", required: true, description: "Explanatory log commentary" }
        ]
      }
    ],
    indexing: [
      { type: "Composite", fields: [{ name: "employerId", mode: "ASC" }, { name: "createdAt", mode: "DESC" }], queryPurpose: "Employer financial transaction statement history." },
      { type: "Composite", fields: [{ name: "workerId", mode: "ASC" }, { name: "escrowStatus", mode: "ASC" }], queryPurpose: "Worker earnings dashboard calculating held vs released funds." }
    ],
    securitySummary: "Read access restricted to paying employer, beneficiary worker, or finance admin. Writes restricted to server webhooks or system payment processor."
  },
  {
    id: "reviews",
    name: "8. Reviews",
    path: "/reviews/{reviewId}",
    category: "Financials & Trust",
    summary: "Global review index storing worker ratings, employer ratings, and dispute reviews.",
    relationships: [
      { targetCollection: "workers", type: "1:N", foreignKey: "reviews.workerId = workers.workerId", description: "Worker being rated." },
      { targetCollection: "employers", type: "1:N", foreignKey: "reviews.employerId = employers.employerId", description: "Employer submitting feedback." }
    ],
    fields: [
      { name: "reviewId", type: "string", required: true, description: "Global Review ID", example: "rev_global_102" },
      { name: "workerId", type: "string", required: true, description: "Worker FK", fk: "workers.workerId", example: "usr_263771234567" },
      { name: "employerId", type: "string", required: true, description: "Employer FK", fk: "employers.employerId", example: "usr_263779876543" },
      { name: "rating", type: "number", required: true, description: "Numeric rating (1.0 to 5.0)", example: 5 },
      { name: "comment", type: "string", required: true, description: "Review content text" },
      { name: "status", type: "string", required: true, description: "Moderation status", enumValue: ["published", "under_review", "flagged", "removed"], example: "published" },
      { name: "createdAt", type: "timestamp", required: true, description: "Creation date" }
    ],
    subcollections: [],
    indexing: [
      { type: "Composite", fields: [{ name: "workerId", mode: "ASC" }, { name: "status", mode: "ASC" }, { name: "createdAt", mode: "DESC" }], queryPurpose: "Display verified candidate reviews." }
    ],
    securitySummary: "Public read for published reviews. Write restricted to verified employers who completed a job placement with the worker."
  },
  {
    id: "notifications",
    name: "9. Notifications (Global)",
    path: "/notifications/{notificationId}",
    category: "Engagement & Chat",
    summary: "Global system notifications queue used by push workers and SMS dispatchers.",
    relationships: [
      { targetCollection: "users", type: "1:N", foreignKey: "notifications.recipientUserId = users.uid", description: "Recipient account." }
    ],
    fields: [
      { name: "notificationId", type: "string", required: true, description: "Notification ID", example: "notif_glob_501" },
      { name: "recipientUserId", type: "string", required: true, description: "Recipient User UID", fk: "users.uid", example: "usr_263771234567" },
      { name: "title", type: "string", required: true, description: "Alert title", example: "Police Clearance Approved" },
      { name: "body", type: "string", required: true, description: "Alert body message", example: "Your ZRP Police Clearance has been verified. You now hold a Green Verified Tick!" },
      { name: "type", type: "string", required: true, description: "Category", enumValue: ["job_alert", "application_update", "message_received", "payment_escrow_held", "payment_released", "police_verification_approved", "system_announcement"], example: "police_verification_approved" },
      { name: "isRead", type: "boolean", required: true, description: "Read flag", example: false },
      { name: "createdAt", type: "timestamp", required: true, description: "Dispatch timestamp" }
    ],
    subcollections: [],
    indexing: [
      { type: "Composite", fields: [{ name: "recipientUserId", mode: "ASC" }, { name: "isRead", mode: "ASC" }, { name: "createdAt", mode: "DESC" }], queryPurpose: "Unread notifications bell counter and list." }
    ],
    securitySummary: "Read/Write restricted to recipient user or notification service."
  },
  {
    id: "reports",
    name: "10. Reports & Safety",
    path: "/reports/{reportId}",
    category: "Financials & Trust",
    summary: "Safety incident reports, harassment tickets, fraud alerts, and contract dispute escalations.",
    relationships: [
      { targetCollection: "users", type: "1:N", foreignKey: "reports.reporterUserId = users.uid", description: "Reporting user." },
      { targetCollection: "users", type: "1:N", foreignKey: "reports.reportedUserId = users.uid", description: "Reported user." }
    ],
    fields: [
      { name: "reportId", type: "string", required: true, description: "Report Incident ID", example: "rep_8812" },
      { name: "reporterUserId", type: "string", required: true, description: "User reporting incident", fk: "users.uid", example: "usr_263779876543" },
      { name: "reportedUserId", type: "string", required: false, description: "User being reported", fk: "users.uid", example: "usr_263771234567" },
      { name: "reportType", type: "string", required: true, description: "Nature of offense", enumValue: ["fraud_attempt", "harassment", "unprofessional_behavior", "fake_documents", "no_show", "non_payment", "safety_hazard"], example: "no_show" },
      { name: "description", type: "string", required: true, description: "Detailed narrative description of incident" },
      { name: "status", type: "string", required: true, description: "Investigation state", enumValue: ["open", "under_investigation", "resolved", "dismissed"], example: "open" },
      { name: "assignedAdminId", type: "string", required: false, description: "Compliance officer handling ticket", fk: "users.uid" },
      { name: "createdAt", type: "timestamp", required: true, description: "Incident report date" }
    ],
    subcollections: [],
    indexing: [
      { type: "Composite", fields: [{ name: "status", mode: "ASC" }, { name: "createdAt", mode: "DESC" }], queryPurpose: "Compliance queue for admin moderation team." }
    ],
    securitySummary: "Create allowed for authenticated users. Read/Update restricted to reporting user or compliance admins."
  },
  {
    id: "verifications",
    name: "11. Verification Queue",
    path: "/verifications/{verificationId}",
    category: "Financials & Trust",
    summary: "Global queue for AI (Gemini OCR) and manual admin verification of Zimbabwean National IDs and ZRP Police Clearance certificates.",
    relationships: [
      { targetCollection: "users", type: "1:N", foreignKey: "verifications.userId = users.uid", description: "Submitting user." }
    ],
    fields: [
      { name: "verificationId", type: "string", required: true, description: "Verification ID", example: "ver_3301" },
      { name: "userId", type: "string", required: true, description: "Target User UID", fk: "users.uid", example: "usr_263771234567" },
      { name: "documentType", type: "string", required: true, description: "Document type", enumValue: ["national_id", "zrp_police_clearance", "driver_license", "passport", "reference_letter"], example: "zrp_police_clearance" },
      { name: "documentNumber", type: "string", required: true, description: "Document code e.g. ZRP-2026-881", example: "ZRP-HARARE-9921" },
      { name: "frontImageUrl", type: "string", required: true, description: "Document image URL" },
      { name: "verificationStatus", type: "string", required: true, description: "Queue status", enumValue: ["pending", "ai_verified", "manual_review", "approved", "rejected"], example: "ai_verified" },
      { name: "rejectionReason", type: "string", required: false, description: "Rejection note if applicable" },
      { name: "createdAt", type: "timestamp", required: true, description: "Submission date" }
    ],
    subcollections: [],
    indexing: [
      { type: "Composite", fields: [{ name: "verificationStatus", mode: "ASC" }, { name: "createdAt", mode: "ASC" }], queryPurpose: "First-in-first-out admin verification review queue." }
    ],
    securitySummary: "Read/Write restricted to submitting user or verification admin officers."
  },
  {
    id: "subscriptions",
    name: "12. Subscriptions",
    path: "/subscriptions/{subscriptionId}",
    category: "Financials & Trust",
    summary: "Monetization subscription records for placement agencies, employers, and premium worker memberships.",
    relationships: [
      { targetCollection: "users", type: "1:N", foreignKey: "subscriptions.userId = users.uid", description: "Subscriber user account." }
    ],
    fields: [
      { name: "subscriptionId", type: "string", required: true, description: "Subscription ID", example: "sub_gold_88" },
      { name: "userId", type: "string", required: true, description: "Subscriber UID", fk: "users.uid", example: "usr_263779876543" },
      { name: "userType", type: "string", required: true, description: "Account type", enumValue: ["employer", "agency", "worker"], example: "employer" },
      { name: "planTier", type: "string", required: true, description: "Membership plan", enumValue: ["free", "pro_worker", "gold_employer", "enterprise_agency"], example: "gold_employer" },
      { name: "priceUSD", type: "number", required: true, description: "Recurring rate USD", example: 25.00 },
      { name: "billingCycle", type: "string", required: true, description: "Billing period", enumValue: ["monthly", "quarterly", "annually"], example: "monthly" },
      { name: "status", type: "string", required: true, description: "Active state", enumValue: ["active", "grace_period", "cancelled", "expired"], example: "active" },
      { name: "startDate", type: "timestamp", required: true, description: "Subscription start date" },
      { name: "endDate", type: "timestamp", required: true, description: "Renewal / Expiry date" }
    ],
    subcollections: [],
    indexing: [
      { type: "Composite", fields: [{ name: "userId", mode: "ASC" }, { name: "status", mode: "ASC" }], queryPurpose: "Determine active user feature permissions and plan limits." }
    ],
    securitySummary: "Read allowed for subscriber owner. Writes restricted to billing webhook or platform admin."
  },
  {
    id: "training",
    name: "13. Training Modules",
    path: "/trainingModules/{courseId}",
    category: "Operations & Content",
    summary: "Catalog of vocational training courses (Infant Care, Elderly Care, Housekeeping, Culinary) designed for Zimbabwean domestic workers.",
    relationships: [
      { targetCollection: "workers", type: "N:M", foreignKey: "trainingEnrollments.workerId = workers.workerId", description: "Enrolled workers." }
    ],
    fields: [
      { name: "courseId", type: "string", required: true, description: "Course ID", example: "course_infant_care" },
      { name: "title", type: "string", required: true, description: "Course title", example: "Certified Infant & Toddler Care Specialist" },
      { name: "category", type: "string", required: true, description: "Vocational category", enumValue: ["First Aid & Safety", "Infant Care", "Elderly Care", "Advanced Housekeeping", "Culinary Skills", "Professional Etiquette"], example: "Infant Care" },
      { name: "description", type: "string", required: true, description: "Comprehensive course curriculum overview" },
      { name: "durationHours", type: "number", required: true, description: "Total course duration in hours", example: 12 },
      { name: "modulesCount", type: "number", required: true, description: "Number of lesson modules", example: 6 },
      { name: "isCertificateIssued", type: "boolean", required: true, description: "Issues digital badge upon passing exam", example: true },
      { name: "priceUSD", type: "number", required: true, description: "Enrollment cost in USD (0.00 for free modules)", example: 10.00 }
    ],
    subcollections: [
      {
        name: "Lessons",
        path: "/trainingModules/{courseId}/lessons/{lessonId}",
        description: "Individual lessons containing video clips, text guides, and audio explanations.",
        fields: [
          { name: "lessonId", type: "string", required: true, description: "Lesson ID" },
          { name: "title", type: "string", required: true, description: "Lesson title e.g. Infant Hygiene & Sterilization" },
          { name: "videoUrl", type: "string", required: false, description: "Streamable video lesson URL" },
          { name: "audioNoteUrl", type: "string", required: false, description: "Shona / Ndebele spoken audio lesson" },
          { name: "durationMinutes", type: "number", required: true, description: "Lesson duration in minutes", example: 15 }
        ]
      }
    ],
    indexing: [
      { type: "Composite", fields: [{ name: "category", mode: "ASC" }, { name: "priceUSD", mode: "ASC" }], queryPurpose: "Training portal catalog navigation." }
    ],
    securitySummary: "Public read access for published training courses. Edit restricted to platform content admins."
  },
  {
    id: "blog",
    name: "14. Blog & Educational Content",
    path: "/blogPosts/{postId}",
    category: "Operations & Content",
    summary: "Articles and employment guides on Zimbabwean labor laws, minimum wage regulations, safety standards, and employer advice.",
    relationships: [
      { targetCollection: "users", type: "1:N", foreignKey: "blogPosts.authorId = users.uid", description: "Author content admin." }
    ],
    fields: [
      { name: "postId", type: "string", required: true, description: "Article Post ID", example: "post_labour_laws_2026" },
      { name: "title", type: "string", required: true, description: "Article headline", example: "Understanding Zimbabwean Domestic Workers Rights & Minimum Wage Rates (2026)" },
      { name: "slug", type: "string", required: true, description: "URL-friendly slug", example: "understanding-zimbabwean-domestic-workers-rights-2026" },
      { name: "authorName", type: "string", required: true, description: "Author display name", example: "Advocate R. Takawira" },
      { name: "category", type: "string", required: true, description: "Blog category", enumValue: ["Domestic Employment Laws", "Home Safety", "Worker Rights", "Hiring Advice", "Company News"], example: "Domestic Employment Laws" },
      { name: "excerpt", type: "string", required: true, description: "Short summary snippet for article cards" },
      { name: "contentMarkdown", type: "string", required: true, description: "Full article body formatted in Markdown" },
      { name: "coverImageUrl", type: "string", required: true, description: "Featured image URL" },
      { name: "isPublished", type: "boolean", required: true, description: "Published state toggle", example: true },
      { name: "publishedAt", type: "timestamp", required: true, description: "Publication timestamp" }
    ],
    subcollections: [
      {
        name: "Comments",
        path: "/blogPosts/{postId}/comments/{commentId}",
        description: "User comments and Q&A discussion on published articles.",
        fields: [
          { name: "commentId", type: "string", required: true, description: "Comment ID" },
          { name: "userId", type: "string", required: true, description: "Commenter User UID", fk: "users.uid" },
          { name: "userName", type: "string", required: true, description: "Commenter display name" },
          { name: "text", type: "string", required: true, description: "Comment text body" },
          { name: "isApproved", type: "boolean", required: true, description: "Moderation approval status", example: true }
        ]
      }
    ],
    indexing: [
      { type: "Composite", fields: [{ name: "isPublished", mode: "ASC" }, { name: "publishedAt", mode: "DESC" }], queryPurpose: "Public blog list ordered by newest published articles." }
    ],
    securitySummary: "Public read for published posts. Write restricted to editorial administrators."
  },
  {
    id: "settings",
    name: "15. Settings",
    path: "/systemSettings/{settingId}",
    category: "Operations & Content",
    summary: "System-wide parameters including EcoCash / ZWG exchange rates, minimum wage rules, platform escrow fees, and maintenance switches.",
    relationships: [],
    fields: [
      { name: "settingId", type: "string", required: true, description: "Setting document ID e.g. platformConfig", example: "platformConfig" },
      { name: "platformName", type: "string", required: true, description: "Platform title", example: "Zimbabwe Maids Centre" },
      { name: "supportEmail", type: "string", required: true, description: "Support email address", example: "support@zimmaids.co.zw" },
      { name: "escrowFeePercentage", type: "number", required: true, description: "Platform escrow fee percentage", example: 5.0 },
      { name: "wgZwgExchangeRate", type: "number", required: true, description: "Current USD to Zimbabwean Gold (ZWG) rate", example: 14.0 },
      { name: "maintenanceMode", type: "boolean", required: true, description: "Emergency maintenance flag", example: false },
      { name: "updatedAt", type: "timestamp", required: true, description: "Last modification time" }
    ],
    subcollections: [],
    indexing: [
      { type: "Single Field", fields: [{ name: "settingId", mode: "ASC" }], queryPurpose: "Direct lookup for platform runtime configuration." }
    ],
    securitySummary: "Public read for operational config. Write restricted strictly to Super Administrators."
  },
  {
    id: "admin",
    name: "16. Admin Audit Logs",
    path: "/adminLogs/{logId}",
    category: "Operations & Content",
    summary: "Immutable audit trail recording every administrative override, user suspension, verification approval, and escrow refund.",
    relationships: [
      { targetCollection: "users", type: "1:N", foreignKey: "adminLogs.adminUserId = users.uid", description: "Admin performing action." }
    ],
    fields: [
      { name: "logId", type: "string", required: true, description: "Audit Log ID", example: "log_adm_9011" },
      { name: "adminUserId", type: "string", required: true, description: "Admin User UID", fk: "users.uid", example: "usr_admin_001" },
      { name: "adminEmail", type: "string", required: true, description: "Admin email address", example: "admin@zimmaids.co.zw" },
      { name: "actionCategory", type: "string", required: true, description: "Action type", enumValue: ["user_suspension", "verification_approval", "escrow_refund", "dispute_resolution", "system_config_change"], example: "verification_approval" },
      { name: "targetDocumentPath", type: "string", required: true, description: "Firestore document path acted upon", example: "/workers/usr_263771234567" },
      { name: "details", type: "string", required: true, description: "Narrative explanation of administrative action taken" },
      { name: "createdAt", type: "timestamp", required: true, description: "Timestamp of action" }
    ],
    subcollections: [],
    indexing: [
      { type: "Composite", fields: [{ name: "actionCategory", mode: "ASC" }, { name: "createdAt", mode: "DESC" }], queryPurpose: "Filter admin audit trails by action category and time." }
    ],
    securitySummary: "Read/Write strictly restricted to authorized system administrators. Deletion strictly forbidden."
  },
  {
    id: "roles",
    name: "17. Roles (RBAC)",
    path: "/roles/{roleId}",
    category: "Identity & RBAC",
    summary: "Role-based access control roles defining collections of permissions assigned to users, workers, employers, agencies, and administrators.",
    relationships: [
      { targetCollection: "permissions", type: "N:M", foreignKey: "roles.permissionIds", description: "Granted atomic permissions." }
    ],
    fields: [
      { name: "roleId", type: "string", required: true, description: "Role ID identifier", example: "verified_worker" },
      { name: "roleName", type: "string", required: true, description: "Human-readable role title", example: "Verified Domestic Worker" },
      { name: "description", type: "string", required: true, description: "Scope and responsibility summary" },
      { name: "permissionIds", type: "array<string>", required: true, description: "List of granted Permission IDs", example: ["jobs.apply", "chats.send", "training.view"] },
      { name: "isSystemRole", type: "boolean", required: true, description: "System default role flag preventing deletion", example: true }
    ],
    subcollections: [],
    indexing: [
      { type: "Single Field", fields: [{ name: "roleId", mode: "ASC" }], queryPurpose: "RBAC lookup when evaluating security assertions." }
    ],
    securitySummary: "Read allowed for authenticated users. Write restricted strictly to Super Administrators."
  },
  {
    id: "permissions",
    name: "18. Permissions (RBAC)",
    path: "/permissions/{permissionId}",
    category: "Identity & RBAC",
    summary: "Atomic permission definitions specifying granular CRUD and administrative capabilities across platform modules.",
    relationships: [],
    fields: [
      { name: "permissionId", type: "string", required: true, description: "Atomic Permission ID", example: "escrow.release" },
      { name: "module", type: "string", required: true, description: "Target platform subsystem", enumValue: ["users", "jobs", "payments", "verifications", "reports", "blog", "settings"], example: "payments" },
      { name: "action", type: "string", required: true, description: "Operation permitted", enumValue: ["create", "read", "update", "delete", "approve", "override"], example: "approve" },
      { name: "description", type: "string", required: true, description: "Detailed description of action capability" }
    ],
    subcollections: [],
    indexing: [
      { type: "Single Field", fields: [{ name: "module", mode: "ASC" }], queryPurpose: "Group permissions by functional system module." }
    ],
    securitySummary: "Read allowed for authenticated users. Write restricted strictly to Super Administrators."
  }
];
