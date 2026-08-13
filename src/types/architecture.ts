export interface ArchSection {
  id: string;
  title: string;
  category: string;
  summary: string;
  mermaidDiagram?: string;
  keyHighlights: string[];
  specs: {
    label: string;
    value: string;
    details: string;
  }[];
}

export const ARCHITECTURE_SECTIONS: ArchSection[] = [
  {
    id: "system-diagram",
    title: "1. High-Level System Architecture Diagram",
    category: "Core Blueprint",
    summary: "End-to-end multi-tier microservices architecture designed to scale to millions of users across Zimbabwe and SADC region with offline capabilities and multi-currency support.",
    mermaidDiagram: `graph TD
    subgraph Clients["📱 Client Layer (Cross-Platform Flutter & Web)"]
        FlutterApp["Flutter Mobile App (Android/iOS)"]
        ReactWebApp["React Web Portal (Homeowners & Admins)"]
        USSDGateway["USSD/SMS Service (Offline Feature Phones)"]
    end

    subgraph Ingress["🛡️ Edge & Ingress Layer"]
        CDN["Google Cloud CDN / Cloudflare"]
        LoadBalancer["Google Cloud Load Balancing (Anycast IP)"]
        WAF["Cloud Armor WAF / DDoS Mitigation"]
    end

    subgraph Gateway["⚡ API Gateway & Auth"]
        APIGateway["Express / Cloud Endpoints API Gateway"]
        FirebaseAuth["Firebase Auth (Phone SMS, Google, Custom Tokens)"]
    end

    subgraph Microservices["⚙️ Backend Services (Cloud Run & Functions)"]
        UserService["User & Profile Microservice"]
        VettingService["AI Vetting & Background Check Service"]
        JobMatchingService["Job & Dispatch Engine"]
        PaymentService["Escrow & Payment Gateway (EcoCash, InnBucks, ZimSwitch)"]
        MessagingService["Real-Time Chat & Notification Service"]
        AdminService["Compliance & Regional Ops Center"]
    end

    subgraph Intelligence["🧠 AI Layer (Google Gemini & Vision)"]
        GeminiAI["Google Gemini 2.5 AI Studio API"]
        OCRDocAI["Cloud Vision & OCR Verification"]
    end

    subgraph DataStore["💾 Data & Storage Layer (Firebase / Firestore / GCP)"]
        Firestore["Cloud Firestore (Multi-Region Sharded DB)"]
        CloudStorage["Firebase Cloud Storage (Secure Documents & Media)"]
        RedisCache["Redis Cloud MemoryStore (Active Caching & PubSub)"]
    end

    subgraph ThirdParty["🔌 Third-Party Integrations"]
        EcoCashAPI["EcoCash & InnBucks API Integrations"]
        ZimPoliceAPI["ZRP Police Clearance Verification Mock"]
        SMSGateway["Econet & NetOne SMS Gateway"]
    end

    FlutterApp --> CDN
    ReactWebApp --> CDN
    USSDGateway --> LoadBalancer
    CDN --> LoadBalancer
    LoadBalancer --> WAF
    WAF --> APIGateway

    APIGateway --> FirebaseAuth
    APIGateway --> UserService
    APIGateway --> VettingService
    APIGateway --> JobMatchingService
    APIGateway --> PaymentService
    APIGateway --> MessagingService
    APIGateway --> AdminService

    VettingService --> GeminiAI
    VettingService --> OCRDocAI
    JobMatchingService --> GeminiAI

    UserService --> Firestore
    JobMatchingService --> Firestore
    PaymentService --> Firestore
    MessagingService --> RedisCache
    MessagingService --> Firestore

    VettingService --> CloudStorage
    UserService --> CloudStorage

    PaymentService --> EcoCashAPI
    VettingService --> ZimPoliceAPI
    MessagingService --> SMSGateway
`,
    keyHighlights: [
      "Anycast Global Cloud Load Balancing with Cloud Armor DDoS Protection",
      "Offline-first client state synchronization for rural and low-connectivity zones",
      "USSD/SMS fallback integration for basic feature-phone workers",
      "Native EcoCash, InnBucks, and ZimSwitch local payment processor connectors"
    ],
    specs: [
      { label: "Target Scalability", value: "10,000,000+ Users", details: "Horizontal auto-scaling with Cloud Run and Firestore distributed shards." },
      { label: "Latency Target", value: "<150ms Regional", details: "Edge caching via Google Cloud CDN with Harare & Johannesburg PoPs." },
      { label: "Uptime SLA", value: "99.99%", details: "Multi-region redundancy across GCP europe-west1 and africa-south1." }
    ]
  },
  {
    id: "frontend-arch",
    title: "2. Frontend Architecture (Flutter & React)",
    category: "Client Architecture",
    summary: "Cross-platform mobile apps built with Flutter using BLoC state management, paired with a React 19 web dashboard for administrative and enterprise agency management.",
    mermaidDiagram: `graph LR
    subgraph FlutterModule["📱 Flutter Client Architecture"]
        UI["UI Layer (Material Design 3 Widgets)"]
        BLoC["BLoC State Management"]
        Repository["Data Repository Layer"]
        LocalCache["Hive / SQLite Offline Store"]
        SyncManager["Background Sync Worker"]
    end

    subgraph Network["🌐 Communication Channel"]
        GraphQL_REST["gRPC / REST / Firestore SDK"]
    end

    UI --> BLoC
    BLoC --> Repository
    Repository --> LocalCache
    Repository --> SyncManager
    SyncManager --> GraphQL_REST
    Repository --> GraphQL_REST
`,
    keyHighlights: [
      "Material Design 3 visual design system with dynamic light/dark theme adaptation",
      "BLoC pattern for unidirectional data flow and reactive UI updates",
      "Multi-language support for Shona, Ndebele, English, and Chewa",
      "Audio profile playback for illiterate workers to listen to job specifications"
    ],
    specs: [
      { label: "Mobile Framework", value: "Flutter 3.x", details: "Single codebase compiling natively to Android APK/AAB and iOS IPA." },
      { label: "Web Portal", value: "React 19 + Vite", details: "High-performance administrative console and agency bulk job portal." },
      { label: "Design System", value: "Material You (MD3)", details: "Accessible touch targets (>48px), high contrast for sunlight readability." }
    ]
  },
  {
    id: "backend-arch",
    title: "3. Backend Microservices & Cloud Functions",
    category: "Server Architecture",
    summary: "Serverless microservices running on GCP Cloud Run and Firebase Cloud Functions v2 with Node.js/TypeScript and Python AI microservices.",
    mermaidDiagram: `graph TD
    Gateway["Express.js API Gateway (Port 3000 Container)"] --> AuthMiddleware["Auth & RBAC Middleware"]
    AuthMiddleware --> Services

    subgraph Services["Core Microservices"]
        ProfileMS["User & KYC Service"]
        DispatchMS["Smart Dispatch & Geospatial Engine"]
        EscrowMS["Escrow & Multi-Currency Ledger"]
        ReviewMS["Trust & Rating Service"]
    end

    DispatchMS --> Geospatial["Google Maps Places & Distance Matrix API"]
    ProfileMS --> DocVerifier["Google Cloud Vision OCR"]
    EscrowMS --> LocalGateways["EcoCash / InnBucks Webhooks"]
`,
    keyHighlights: [
      "Serverless zero-maintenance deployment scaling down to zero when idle",
      "Event-driven architecture powered by GCP Pub/Sub for asynchronous background tasks",
      "Role-based access control (RBAC) enforced across 15 distinct user roles",
      "Idempotent payment webhook processor preventing double-spending"
    ],
    specs: [
      { label: "Runtime Environment", value: "Cloud Run Container", details: "Auto-scales from 0 to 500 instances in <2 seconds." },
      { label: "Execution Speed", value: "Average 45ms", details: "In-memory caching and optimized cold-start configurations." },
      { label: "API Protocol", value: "RESTful JSON / gRPC", details: "Strict OpenAPI 3.0 specification validation." }
    ]
  },
  {
    id: "database-erd",
    title: "4. Database Schema & Firestore ERD",
    category: "Data Architecture",
    summary: "Optimized NoSQL document structure in Cloud Firestore, leveraging collection grouping and automated indexing for instant sub-20ms queries.",
    mermaidDiagram: `erDiagram
    USERS ||--o{ VERIFICATIONS : has
    USERS ||--o{ BOOKINGS : requests
    WORKERS ||--|| USERS : extends
    WORKERS ||--o{ REVIEWS : receives
    WORKERS ||--o{ SKILLS : possesses
    AGENCIES ||--o{ WORKERS : manages
    BOOKINGS ||--|| PAYMENTS : includes
    BOOKINGS ||--o{ MESSAGES : contains

    USERS {
        string userId PK
        string fullName
        string phone
        string role "worker | employer | agency | admin"
        string city "Harare | Bulawayo | Mutare..."
        timestamp createdAt
    }

    WORKERS {
        string workerId PK
        string userId FK
        string category "Nanny | Electrician | Housekeeper..."
        array skills
        number hourlyRateUSD
        number monthlyRateUSD
        string policeClearanceStatus "Verified | Pending | Failed"
        number ratingAverage
        geopoint location
    }

    BOOKINGS {
        string bookingId PK
        string employerId FK
        string workerId FK
        string status "pending | escrow_held | active | completed | disputed"
        number totalAmountUSD
        timestamp startDate
        timestamp endDate
    }

    PAYMENTS {
        string paymentId PK
        string bookingId FK
        string gateway "ecocash | innbucks | zimswitch | stripe"
        string escrowStatus "held | released | refunded"
        string currency "USD | ZWG"
        number amount
    }
`,
    keyHighlights: [
      "Hierarchical collection indexing with compound queries on location and skill set",
      "Geohash spatial indexing for pinpoint worker search within 2km to 50km radius",
      "Soft-delete flags and immutable audit logs for strict Zimbabwean legal compliance",
      "Automated automated schema validation rules via Firestore Security Rules"
    ],
    specs: [
      { label: "Primary Database", value: "Cloud Firestore", details: "Multi-region replication with native snapshot listeners." },
      { label: "Read Latency", value: "<15ms", details: "Optimized with Cloud Firestore client cache and indexes." },
      { label: "Query Capacity", value: "Unlimited Sharded", details: "Automatic document distribution across Google Infrastructure." }
    ]
  },
  {
    id: "auth-security",
    title: "5. Authentication & Security Framework",
    category: "Security",
    summary: "Bank-grade authentication supporting OTP SMS via Zimbabwean networks (Econet, NetOne, Telecel), Google OAuth, biometric lock, and end-to-end data encryption.",
    mermaidDiagram: `graph LR
    User["User Device"] --> PhoneInput["Phone Number (+263...)"]
    PhoneInput --> SMSGateway["Econet/NetOne SMS OTP"]
    SMSGateway --> OTPValidation["Firebase Auth Verification"]
    OTPValidation --> JWT["Issue JWT Token with Custom Claims"]
    JWT --> RBAC["Role Check (Worker, Employer, Admin)"]
`,
    keyHighlights: [
      "Custom JWT tokens with embedding role claims (e.g. isVerifiedWorker, isAdmin)",
      "National ID / Driver's License OCR verification against police clearance registries",
      "AES-256 bit encryption at rest, TLS 1.3 in transit",
      "OWASP Mobile Top 10 hardened client app against reverse engineering"
    ],
    specs: [
      { label: "Primary Auth Provider", value: "Firebase Auth", details: "Native SMS OTP support tailored for Zimbabwean country code (+263)." },
      { label: "Data Protection", value: "Data Protection Act", details: "Compliant with Zimbabwean Cyber & Data Protection Regulations." },
      { label: "Session Security", value: "OAuth 2.0 / PKCE", details: "Auto-refresh tokens with 15-minute expiration window." }
    ]
  },
  {
    id: "payments-escrow",
    title: "6. Zimbabwean Multi-Currency & Escrow Payments",
    category: "Financials",
    summary: "Comprehensive local payment bridge integrating EcoCash mobile money, InnBucks cash vouchers, ZimSwitch ZIPIT, and USD card processors into an automated escrow system.",
    mermaidDiagram: `graph TD
    Employer["Employer / Homeowner"] --> ChooseMethod{"Select Payment Method"}
    ChooseMethod -->|EcoCash| EcoCash["EcoCash Direct Express API"]
    ChooseMethod -->|InnBucks| InnBucks["InnBucks QR / Voucher API"]
    ChooseMethod -->|ZimSwitch| ZimSwitch["ZimSwitch ZIPIT Bank Transfer"]
    ChooseMethod -->|USD Card| Stripe["Visa / Mastercard Processor"]

    EcoCash --> EscrowVault["ZMC Escrow Vault Account"]
    InnBucks --> EscrowVault
    ZimSwitch --> EscrowVault
    Stripe --> EscrowVault

    EscrowVault -->|Job Done & Signed| ReleaseWorker["Instant Payout to Worker Account"]
    EscrowVault -->|Dispute Opened| AdminDispute["ZMC Arbitration Panel"]
`,
    keyHighlights: [
      "Escrow protection holding employer funds safely until job completion confirmation",
      "Dual currency support handling USD and Zimbabwean Gold (ZWG) with live conversion rates",
      "Instant wage disbursements directly to EcoCash wallet upon digital timesheet approval",
      "Automated Ministry of Labour minimum wage compliance verification"
    ],
    specs: [
      { label: "Mobile Money", value: "EcoCash / NetOne", details: "Direct USSD push prompt sent to employer mobile phone." },
      { label: "Cash Convenience", value: "InnBucks Vouchers", details: "Enables cash-based instant deposit at any InnBucks counter nation-wide." },
      { label: "Escrow Fee", value: "5% Platform Service Fee", details: "Automated revenue splitting engine between platform and agencies." }
    ]
  },
  {
    id: "ai-services",
    title: "7. AI Services & Vetting Pipeline (Gemini AI)",
    category: "Artificial Intelligence",
    summary: "Leveraging Google Gemini 2.5 Flash for background document analysis, automated profile translation, voice-guided onboarding, and smart candidate-job matching.",
    mermaidDiagram: `graph TD
    ApplicantDoc["Worker ID / Police Clearance Upload"] --> DocScan["Cloud Vision OCR"]
    DocScan --> GeminiEngine["Google Gemini 2.5 AI Engine"]
    GeminiEngine --> Analysis["AI Analysis"]
    Analysis --> PoliceCheck["Police Record Verification Check"]
    Analysis --> SkillExtract["Automated Skill & Experience Extraction"]
    Analysis --> TrustScore["Compute AI Trust Index (0 - 100)"]
    TrustScore --> VerifiedBadge["Issue Green Verified Badge"]
`,
    keyHighlights: [
      "Gemini AI automated document validation detecting altered police clearance certificates",
      "Multilingual AI translation bridging Shona, Ndebele, and English in direct chat",
      "Smart Matchmaker calculating distance, skills, personality fit, and past reviews",
      "Voice bot allowing illiterate workers to answer vetting questions via voice recordings"
    ],
    specs: [
      { label: "AI Engine", value: "Google Gemini 2.5", details: "Sub-second inference for profile scoring and candidate matching." },
      { label: "Document OCR", value: "Cloud Document AI", details: "Recognizes Zimbabwean National IDs, Passports, and ZRP clearance letters." },
      { label: "Trust Score Precision", value: "98.4%", details: "Cross-checks phone numbers, references, and official documents." }
    ]
  },
  {
    id: "offline-sync",
    title: "8. Offline-First Architecture & Network Resiliency",
    category: "Reliability",
    summary: "Resilient offline data strategy ensuring domestic workers and artisans can view schedules, record work hours, and receive notifications even during load shedding or poor cellular coverage.",
    mermaidDiagram: `graph LR
    Action["User Action (Check-in / Timesheet)"] --> NetCheck{"Online?"}
    NetCheck -->|Yes| FirestoreDirect["Firestore Live Sync"]
    NetCheck -->|No| LocalQueue["Local SQLite Queue"]
    LocalQueue --> BackgroundWorker["Flutter Background Sync Service"]
    BackgroundWorker -->|Reconnected| ConflictResolver["Auto Conflict Resolution Strategy"]
    ConflictResolver --> FirestoreDirect
`,
    keyHighlights: [
      "Local-first SQLite storage preserving full app functionality without internet connection",
      "Opportunistic background sync engine uploading queued timesheets when 3G/4G reconnects",
      "Optimistic UI updates providing instant visual feedback without waiting for server response",
      "SMS fallback alerts for critical booking invitations when data networks are unavailable"
    ],
    specs: [
      { label: "Offline Storage", value: "Hive / SQLite", details: "Stores up to 500MB of local profiles, chat history, and active jobs." },
      { label: "Sync Engine", value: "Firebase Offline Persistence", details: "Automated delta synchronization with conflict management." },
      { label: "SMS Backup", value: "USSD / Shortcode Engine", details: "Workers can reply 'YES' via SMS to accept job dispatches." }
    ]
  },
  {
    id: "scale-disaster",
    title: "9. Scalability, Caching, Backup & Disaster Recovery",
    category: "Infrastructure",
    summary: "Enterprise infrastructure plan ensuring high availability, sub-second query response times, daily continuous snapshots, and sub-15 minute Recovery Point Objective (RPO).",
    mermaidDiagram: `graph TD
    PrimaryRegion["Primary Region: europe-west1 (Belgium)"] --> Replication["Continuous Geo-Replication"]
    Replication --> BackupRegion["Failover Region: africa-south1 (Johannesburg)"]

    subgraph BackupStrategy["Backup Pipeline"]
        FirestoreDB["Firestore Live DB"] --> ExportJob["Hourly Differential Export"]
        ExportJob --> ColdStorage["Google Cloud Storage Nearline Vault"]
    end
`,
    keyHighlights: [
      "Firestore multi-region automatic sharding accommodating 500,000+ simultaneous read/write operations",
      "Redis Cloud MemoryStore layer caching frequent searches and worker availability maps",
      "RPO (Recovery Point Objective) < 15 minutes, RTO (Recovery Time Objective) < 1 hour",
      "Continuous automated integration testing with zero-downtime rolling upgrades"
    ],
    specs: [
      { label: "Peak Capacity", value: "50,000 RPS", details: "Auto-scaled container pools managed by Cloud Run." },
      { label: "Backup Frequency", value: "Hourly Snapshots", details: "Encrypted backups stored across 3 geographic zones." },
      { label: "Caching Layer", value: "Redis Enterprise", details: "Caches location searches, reducing DB query loads by 75%." }
    ]
  }
];
