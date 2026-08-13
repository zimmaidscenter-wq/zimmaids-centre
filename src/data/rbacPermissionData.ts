export interface RolePermissionDetail {
  permissionId: string;
  module: "public" | "auth" | "profile" | "jobs" | "applications" | "chats" | "payments" | "reviews" | "verifications" | "training" | "reports" | "blog" | "subscriptions" | "tickets" | "agencies" | "finance" | "users" | "settings" | "rbac" | "admin" | "system" | "notifications";
  action: "create" | "read" | "update" | "delete" | "approve" | "override" | "moderate" | "manage" | "reconcile";
  title: string;
  description: string;
  securityScope: "Public" | "Self/Owner" | "Participant" | "Moderator" | "Support" | "Officer" | "Admin" | "Super Admin";
}

export interface RbacRoleSpec {
  roleId: string;
  roleName: string;
  category: "Public Access" | "Core End-Users" | "Operational Staff" | "System Executives";
  badgeColor: string;
  summary: string;
  targetAudience: string;
  inheritedRoles?: string[];
  permissionsCount: number;
  permissions: RolePermissionDetail[];
  securityPolicy: string;
}

export const RBAC_ROLES_SPEC: RbacRoleSpec[] = [
  {
    roleId: "guest",
    roleName: "1. Guest",
    category: "Public Access",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
    summary: "Unauthenticated web visitor browsing public listings, informative legal guides, and general platform capabilities.",
    targetAudience: "Anonymous web visitors, potential employers, job seekers exploring the platform.",
    permissionsCount: 7,
    securityPolicy: "Read-only access to public collections (jobs, worker public cards, blog, training catalog). Anonymous writes forbidden except account registration.",
    permissions: [
      {
        permissionId: "public.view_landing",
        module: "public",
        action: "read",
        title: "View Public Landing & Platform Overview",
        description: "Access home page, trust metrics, service offerings, and verification guarantees.",
        securityScope: "Public"
      },
      {
        permissionId: "workers.view_public_profile",
        module: "profile",
        action: "read",
        title: "Browse Public Worker Directory Cards",
        description: "Search active domestic workers and house artisans with anonymized contact details.",
        securityScope: "Public"
      },
      {
        permissionId: "jobs.view_public_listings",
        module: "jobs",
        action: "read",
        title: "Search Open Job Vacancies",
        description: "Browse advertised job listings across Zimbabwean cities and suburbs.",
        securityScope: "Public"
      },
      {
        permissionId: "blog.read_articles",
        module: "blog",
        action: "read",
        title: "Read Educational Articles & Labour Guides",
        description: "Access public blog articles regarding Zimbabwean Labour Act & domestic work standards.",
        securityScope: "Public"
      },
      {
        permissionId: "training.view_catalog",
        module: "training",
        action: "read",
        title: "Explore Vocational Training Course Catalog",
        description: "View available training modules, course outlines, and certifications.",
        securityScope: "Public"
      },
      {
        permissionId: "auth.register_account",
        module: "auth",
        action: "create",
        title: "Register New Platform Account",
        description: "Sign up as a Domestic Worker, Homeowner Employer, or Placement Agency.",
        securityScope: "Public"
      },
      {
        permissionId: "auth.login",
        module: "auth",
        action: "read",
        title: "Authenticate via SMS OTP / Password",
        description: "Log in securely using verified Zimbabwean phone number or email credentials.",
        securityScope: "Public"
      }
    ]
  },
  {
    roleId: "worker",
    roleName: "2. Worker",
    category: "Core End-Users",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    summary: "Domestic worker, nanny, elderly caregiver, or skilled house artisan seeking employment opportunities.",
    targetAudience: "Verified and pending domestic workers, housekeepers, caregivers, gardeners, and trade artisans.",
    inheritedRoles: ["guest"],
    permissionsCount: 15,
    securityPolicy: "Read/Write limited strictly to resource owner. Can view open jobs and apply, but cannot access other workers' applications or employers' private contact details before shortlisting.",
    permissions: [
      {
        permissionId: "profile.edit_own_worker",
        module: "profile",
        action: "update",
        title: "Edit Personal Worker Profile",
        description: "Update personal bio, expected rates (hourly/monthly USD), skills, and primary category.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "profile.upload_voice_bio",
        module: "profile",
        action: "update",
        title: "Record & Upload Audio Voice Profile",
        description: "Upload audio introductions in Shona, Ndebele, or English to Cloud Storage.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "verifications.submit_documents",
        module: "verifications",
        action: "create",
        title: "Submit National ID & ZRP Police Clearance",
        description: "Upload encrypted photos of Zimbabwean National ID and Police Clearance certificates for verification.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "jobs.search_filtered",
        module: "jobs",
        action: "read",
        title: "Spatial Proximity Job Search",
        description: "Search open jobs by suburb distance radius, salary range, and job format.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "applications.submit",
        module: "applications",
        action: "create",
        title: "Apply to Open Vacancies",
        description: "Submit formal job applications with requested salary and candidate pitch statement.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "applications.view_own_history",
        module: "applications",
        action: "read",
        title: "Track Application Progress",
        description: "View real-time status updates (applied, shortlisted, interview scheduled, offered, rejected).",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "chats.send_messages",
        module: "chats",
        action: "create",
        title: "Send Messages in Shortlisted Threads",
        description: "Exchange messages with employers who opened communication.",
        securityScope: "Participant"
      },
      {
        permissionId: "chats.send_voice_notes",
        module: "chats",
        action: "create",
        title: "Send Voice Notes in Chat",
        description: "Record and transmit spoken audio messages directly within chat channels.",
        securityScope: "Participant"
      },
      {
        permissionId: "payments.view_payouts",
        module: "payments",
        action: "read",
        title: "View Worker Wallet & Escrow Ledger",
        description: "Monitor earnings, held escrow balances for active contracts, and past payout statements.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "payments.withdraw_earnings",
        module: "payments",
        action: "update",
        title: "Request Disbursement to Mobile Money",
        description: "Initiate payout withdrawals to EcoCash, InnBucks, or Zipit bank accounts.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "reviews.view_received",
        module: "reviews",
        action: "read",
        title: "View Received Performance Reviews",
        description: "Inspect ratings, punctuality scores, and written testimonials left by past employers.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "reviews.respond_to_review",
        module: "reviews",
        action: "update",
        title: "Respond to Employer Testimonials",
        description: "Post a formal public response onto a review left on worker profile.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "training.enroll_courses",
        module: "training",
        action: "create",
        title: "Enroll in Vocational Training Modules",
        description: "Access course materials (First Aid, Infant Care, Elderly Care, Cooking) and take online quizzes.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "training.download_certificates",
        module: "training",
        action: "read",
        title: "Download Verified Digital Certificates",
        description: "Download official PDF certificates and display verified skill badges on profile.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "reports.file_incident",
        module: "reports",
        action: "create",
        title: "Report Misconduct or Safety Grievance",
        description: "File confidential safety reports or dispute tickets regarding employer misconduct.",
        securityScope: "Self/Owner"
      }
    ]
  },
  {
    roleId: "employer",
    roleName: "3. Employer",
    category: "Core End-Users",
    badgeColor: "bg-teal-100 text-teal-900 border-teal-300",
    summary: "Private homeowner, estate manager, corporate employer, or placement agency posting job vacancies and hiring domestic staff.",
    targetAudience: "Homeowners, families, diplomatic staff, corporate estate offices, and placement agencies.",
    inheritedRoles: ["guest"],
    permissionsCount: 13,
    securityPolicy: "Read/Write limited to own household profile and published job listings. Can view applicant document statuses and chat with candidates.",
    permissions: [
      {
        permissionId: "profile.edit_own_employer",
        module: "profile",
        action: "update",
        title: "Manage Household & Property Profile",
        description: "Update property size, number of family members, children/elderly presence, and address.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "jobs.create_posting",
        module: "jobs",
        action: "create",
        title: "Publish Job Vacancies",
        description: "Create new job postings specifying duties, salary range (USD), schedule, and requirements.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "jobs.edit_own_postings",
        module: "jobs",
        action: "update",
        title: "Edit Active Job Postings",
        description: "Modify job descriptions, adjust salary budgets, or change location requirements.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "jobs.close_posting",
        module: "jobs",
        action: "update",
        title: "Close or Cancel Vacancy",
        description: "Mark job as filled or cancel vacancy to stop receiving new applications.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "applications.review_candidates",
        module: "applications",
        action: "read",
        title: "Inspect Candidate Applications",
        description: "Review applicant work histories, verified ZRP clearance status, and listen to audio bios.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "applications.update_candidate_status",
        module: "applications",
        action: "update",
        title: "Shortlist or Reject Candidates",
        description: "Update applicant status, send interview invitations, or issue hiring offers.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "chats.initiate_candidate_chat",
        module: "chats",
        action: "create",
        title: "Initiate Direct Candidate Chat",
        description: "Open real-time messaging threads with shortlisted candidates.",
        securityScope: "Participant"
      },
      {
        permissionId: "payments.deposit_escrow",
        module: "payments",
        action: "create",
        title: "Deposit Wages into Escrow",
        description: "Fund placement fees and worker wages into platform escrow via EcoCash, InnBucks, Zipit, or Card.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "payments.approve_escrow_release",
        module: "payments",
        action: "update",
        title: "Authorize Escrow Wage Release",
        description: "Approve wage disbursement to worker upon satisfactory completion of work or monthly cycle.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "payments.raise_payment_dispute",
        module: "payments",
        action: "create",
        title: "Raise Escrow Payment Dispute",
        description: "Freeze escrow funds and request admin arbitration if worker fails to report or defaults.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "reviews.submit_worker_review",
        module: "reviews",
        action: "create",
        title: "Submit Worker Rating & Testimonial",
        description: "Rate hired worker on 5-star scale for punctuality, technical skill, and trustworthiness.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "subscriptions.manage_plan",
        module: "subscriptions",
        action: "manage",
        title: "Manage Subscription Membership",
        description: "Subscribe to Gold or Enterprise Agency tier for instant candidate contact unlock.",
        securityScope: "Self/Owner"
      },
      {
        permissionId: "reports.file_incident",
        module: "reports",
        action: "create",
        title: "Report Worker Misconduct or No-Show",
        description: "File safety or compliance tickets regarding worker no-show or fraudulent references.",
        securityScope: "Self/Owner"
      }
    ]
  },
  {
    roleId: "moderator",
    roleName: "4. Moderator",
    category: "Operational Staff",
    badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-300",
    summary: "Platform content officer maintaining community standards, educational blog content, and public reviews.",
    targetAudience: "Community trust and content moderation staff.",
    permissionsCount: 6,
    securityPolicy: "Read access across public and review content. Write access limited to updating/removing violating content, blog management, and flagging spam.",
    permissions: [
      {
        permissionId: "blog.manage_posts",
        module: "blog",
        action: "manage",
        title: "Create, Edit & Publish Blog Articles",
        description: "Draft and publish educational articles on Labour Act guidelines and domestic safety.",
        securityScope: "Moderator"
      },
      {
        permissionId: "blog.moderate_comments",
        module: "blog",
        action: "moderate",
        title: "Moderate Article Comments",
        description: "Approve or remove public user comments under educational blog posts.",
        securityScope: "Moderator"
      },
      {
        permissionId: "reviews.moderate_global",
        module: "reviews",
        action: "moderate",
        title: "Moderate Global Reviews & Testimonials",
        description: "Inspect flagged worker/employer reviews and edit or unpublish abusive content.",
        securityScope: "Moderator"
      },
      {
        permissionId: "jobs.flag_inappropriate",
        module: "jobs",
        action: "moderate",
        title: "Flag Fraudulent or Hazardous Job Vacancies",
        description: "Hide or flag job postings containing unsafe conditions, illegal pay, or spam.",
        securityScope: "Moderator"
      },
      {
        permissionId: "reports.review_content_tickets",
        module: "reports",
        action: "read",
        title: "Process Content Violation Reports",
        description: "Review user reports regarding inappropriate photos, language, or misleading profiles.",
        securityScope: "Moderator"
      },
      {
        permissionId: "users.view_public_activity",
        module: "users",
        action: "read",
        title: "Inspect Public User Activity Logs",
        description: "Audit public profile updates and published vacancy listings for compliance.",
        securityScope: "Moderator"
      }
    ]
  },
  {
    roleId: "support_staff",
    roleName: "5. Support Staff",
    category: "Operational Staff",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
    summary: "Customer service officer assisting end-users, mediating minor disputes, and troubleshooting account issues.",
    targetAudience: "Helpdesk agents, user support specialists, and customer care staff.",
    permissionsCount: 7,
    securityPolicy: "Read access to basic user profile data and support tickets. Cannot perform financial refunds or change roles.",
    permissions: [
      {
        permissionId: "tickets.view_all_support",
        module: "tickets",
        action: "read",
        title: "Access Helpdesk Support Ticket Queue",
        description: "View incoming support tickets, WhatsApp queries, and system help requests.",
        securityScope: "Support"
      },
      {
        permissionId: "tickets.reply_and_resolve",
        module: "tickets",
        action: "update",
        title: "Respond to & Resolve Support Queries",
        description: "Reply to end-users, provide guidance, and mark support tickets as resolved.",
        securityScope: "Support"
      },
      {
        permissionId: "users.view_basic_account",
        module: "users",
        action: "read",
        title: "Lookup User Account Summary",
        description: "Inspect user email, phone, city, verification badge state, and activity logs.",
        securityScope: "Support"
      },
      {
        permissionId: "jobs.view_all_details",
        module: "jobs",
        action: "read",
        title: "Inspect Vacancy Details for Troubleshooting",
        description: "View full job details to assist workers experiencing application issues.",
        securityScope: "Support"
      },
      {
        permissionId: "chats.inspect_flagged_messages",
        module: "chats",
        action: "read",
        title: "Inspect Flagged Chat Threads",
        description: "Review chat thread history when user flags abusive communication for dispute mediation.",
        securityScope: "Support"
      },
      {
        permissionId: "reports.investigate_dispute",
        module: "reports",
        action: "update",
        title: "Investigate Tier-1 User Disputes",
        description: "Contact parties involved in minor disputes and document findings for management.",
        securityScope: "Support"
      },
      {
        permissionId: "notifications.send_user_alert",
        module: "notifications",
        action: "create",
        title: "Dispatch System Support Alerts",
        description: "Send direct push or SMS notifications to users regarding support resolution.",
        securityScope: "Support"
      }
    ]
  },
  {
    roleId: "verification_officer",
    roleName: "6. Verification Officer",
    category: "Operational Staff",
    badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
    summary: "KYC compliance officer inspecting Zimbabwean National IDs, ZRP Police Clearance checks, and agency credentials.",
    targetAudience: "Identity verification officers, ZRP background check auditors, and accreditation officers.",
    permissionsCount: 7,
    securityPolicy: "Read/Write access restricted to verification queues, worker document collections, and trust score calculations.",
    permissions: [
      {
        permissionId: "verifications.view_queue",
        module: "verifications",
        action: "read",
        title: "Access FIFO Document Verification Queue",
        description: "View pending verification requests for National IDs and ZRP Police Clearance letters.",
        securityScope: "Officer"
      },
      {
        permissionId: "verifications.inspect_documents",
        module: "verifications",
        action: "read",
        title: "High-Res Inspection of Legal Documents",
        description: "Inspect high-resolution image uploads of Zimbabwean National IDs and Police Clearance certificates.",
        securityScope: "Officer"
      },
      {
        permissionId: "verifications.run_gemini_ocr_check",
        module: "verifications",
        action: "approve",
        title: "Execute Gemini AI Document OCR Scan",
        description: "Trigger automated AI OCR document extraction to cross-check ID numbers and names.",
        securityScope: "Officer"
      },
      {
        permissionId: "verifications.approve_clearance",
        module: "verifications",
        action: "approve",
        title: "Approve ZRP Police Clearance & ID",
        description: "Grant official Green Verified Tick and update police clearance status to 'Verified'.",
        securityScope: "Officer"
      },
      {
        permissionId: "verifications.reject_clearance",
        module: "verifications",
        action: "update",
        title: "Reject Invalid Document with Notes",
        description: "Reject document submission with explicit notes (e.g. blurry image, name mismatch, expired certificate).",
        securityScope: "Officer"
      },
      {
        permissionId: "agencies.audit_accreditation",
        module: "agencies",
        action: "approve",
        title: "Audit Placement Agency Accreditation",
        description: "Verify company registration and Ministry of Labour placement licenses for agencies.",
        securityScope: "Officer"
      },
      {
        permissionId: "users.update_trust_score",
        module: "users",
        action: "update",
        title: "Recalculate Worker AI Trust Index",
        description: "Update worker Trust Score (0 to 100) based on document authenticity and references.",
        securityScope: "Officer"
      }
    ]
  },
  {
    roleId: "finance_officer",
    roleName: "7. Finance Officer",
    category: "Operational Staff",
    badgeColor: "bg-emerald-100 text-emerald-950 border-emerald-400 font-bold",
    summary: "Financial controller overseeing platform escrow holds, gateway reconciliations, worker disbursements, and tax auditing.",
    targetAudience: "Financial controllers, accountants, payment gateway administrators, and escrow auditors.",
    permissionsCount: 7,
    securityPolicy: "Read/Write access across all financial ledgers, escrow accounts, gateway transaction refs, and payout overrides.",
    permissions: [
      {
        permissionId: "payments.view_global_ledger",
        module: "finance",
        action: "read",
        title: "View Global Real-Time Financial Ledger",
        description: "Monitor EcoCash, InnBucks, Zipit, Stripe, and Cash Voucher deposits and disbursements.",
        securityScope: "Officer"
      },
      {
        permissionId: "payments.reconcile_gateways",
        module: "finance",
        action: "reconcile",
        title: "Reconcile External Gateway Transaction Refs",
        description: "Match mobile gateway reference codes against internal platform escrow deposits.",
        securityScope: "Officer"
      },
      {
        permissionId: "payments.audit_escrow_holds",
        module: "finance",
        action: "read",
        title: "Audit Held Escrow Balances",
        description: "Inspect total USD and ZWG funds held in escrow for active job placements.",
        securityScope: "Officer"
      },
      {
        permissionId: "payments.manual_disburse_payout",
        module: "payments",
        action: "override",
        title: "Force Disburse Escrow Funds to Worker",
        description: "Manually authorize wage payout release following dispute resolution.",
        securityScope: "Officer"
      },
      {
        permissionId: "payments.process_employer_refund",
        module: "payments",
        action: "override",
        title: "Process Escrow Refund to Employer",
        description: "Refund escrow deposit to employer when job is unfulfilled or worker defaults.",
        securityScope: "Officer"
      },
      {
        permissionId: "payments.manage_commissions",
        module: "finance",
        action: "manage",
        title: "Inspect Platform Service Commission Deductions",
        description: "Audit platform commission fees generated on placement transactions.",
        securityScope: "Officer"
      },
      {
        permissionId: "finance.export_tax_reports",
        module: "finance",
        action: "read",
        title: "Export ZIMRA & IMTT Financial Reports",
        description: "Generate compliant tax and transaction logs for Zimbabwean regulatory authorities.",
        securityScope: "Officer"
      }
    ]
  },
  {
    roleId: "admin",
    roleName: "8. Admin",
    category: "System Executives",
    badgeColor: "bg-purple-100 text-purple-900 border-purple-300 font-bold",
    summary: "Operations manager possessing broad authority over users, vacancies, escalations, system settings, and staff operations.",
    targetAudience: "Operations managers, general platform managers, and compliance directors.",
    permissionsCount: 8,
    securityPolicy: "Broad read/write access across all operational modules. Cannot modify Super Admin accounts, create core RBAC schemas, or disable security logs.",
    permissions: [
      {
        permissionId: "users.manage_accounts",
        module: "users",
        action: "manage",
        title: "Manage & Edit User Accounts",
        description: "Update user profile details, reset verification states, or update contact information.",
        securityScope: "Admin"
      },
      {
        permissionId: "users.suspend_or_ban",
        module: "users",
        action: "override",
        title: "Suspend or Ban Non-Compliant Users",
        description: "Freeze accounts involved in fraud, harassment, or severe policy breaches.",
        securityScope: "Admin"
      },
      {
        permissionId: "jobs.override_status",
        module: "jobs",
        action: "override",
        title: "Override Job Listing States",
        description: "Force close, reopen, or delete non-compliant or fraudulent vacancies.",
        securityScope: "Admin"
      },
      {
        permissionId: "reports.resolve_escalated",
        module: "reports",
        action: "override",
        title: "Final Resolution of Escalated Safety Incidents",
        description: "Issue binding administrative decisions on safety reports and dispute escalations.",
        securityScope: "Admin"
      },
      {
        permissionId: "settings.edit_platform_config",
        module: "settings",
        action: "update",
        title: "Update Exchange Rates & Platform Fees",
        description: "Adjust USD/ZWG exchange rate and platform escrow fee percentage.",
        securityScope: "Admin"
      },
      {
        permissionId: "audit.view_admin_logs",
        module: "admin",
        action: "read",
        title: "Review Admin Action Audit Trail",
        description: "Inspect log history of administrative actions taken by staff members.",
        securityScope: "Admin"
      },
      {
        permissionId: "subscriptions.grant_comp_tier",
        module: "subscriptions",
        action: "override",
        title: "Issue Promotional Subscription Passes",
        description: "Grant complimentary Gold Employer or Pro Worker passes for marketing campaigns.",
        securityScope: "Admin"
      },
      {
        permissionId: "agencies.manage_agencies",
        module: "agencies",
        action: "manage",
        title: "Manage Placement Agency Partnerships",
        description: "Approve agency onboarding and monitor placement performance.",
        securityScope: "Admin"
      }
    ]
  },
  {
    roleId: "super_admin",
    roleName: "9. Super Admin",
    category: "System Executives",
    badgeColor: "bg-red-900 text-white border-red-950 font-black shadow-md",
    summary: "Root platform owner with absolute, unrestricted administrative control over RBAC configurations, database rules, and staff credentials.",
    targetAudience: "Executive leadership, CTO, system architects, and platform owners.",
    permissionsCount: 7,
    securityPolicy: "Unrestricted wildcard access (*.*) across all collections, environment settings, and RBAC rules. Protected by multi-factor authentication (MFA).",
    permissions: [
      {
        permissionId: "rbac.create_custom_role",
        module: "rbac",
        action: "manage",
        title: "Create & Define Custom RBAC Roles",
        description: "Define new RBAC roles and assign custom atomic permission lists.",
        securityScope: "Super Admin"
      },
      {
        permissionId: "rbac.assign_admin_roles",
        module: "rbac",
        action: "override",
        title: "Assign & Revoke Staff Administrator Roles",
        description: "Grant or revoke Admin, Finance, Verification, or Support roles to staff UIDs.",
        securityScope: "Super Admin"
      },
      {
        permissionId: "rbac.modify_permissions",
        module: "rbac",
        action: "override",
        title: "Modify System Permission Grants",
        description: "Create, update, or remove atomic permission definitions in system catalog.",
        securityScope: "Super Admin"
      },
      {
        permissionId: "admin.manage_admin_users",
        module: "admin",
        action: "manage",
        title: "Manage System Administrator Credentials",
        description: "Provision super-user accounts and set strict security MFA requirements.",
        securityScope: "Super Admin"
      },
      {
        permissionId: "database.schema_override",
        module: "system",
        action: "override",
        title: "Modify Security Rules & Index Configurations",
        description: "Deploy updated firestore.rules and compound index manifests to Firebase.",
        securityScope: "Super Admin"
      },
      {
        permissionId: "audit.view_raw_audit_logs",
        module: "admin",
        action: "read",
        title: "Inspect Immutable Root System Audit Logs",
        description: "Audit raw, unedited system security access logs and API invocations.",
        securityScope: "Super Admin"
      },
      {
        permissionId: "system.toggle_maintenance_mode",
        module: "system",
        action: "manage",
        title: "Activate / Deactivate Site Maintenance Mode",
        description: "Toggle platform maintenance mode for database migrations or emergency fixes.",
        securityScope: "Super Admin"
      }
    ]
  }
];
