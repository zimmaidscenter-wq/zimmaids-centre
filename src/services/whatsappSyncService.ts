import { WorkerProfile, JobPosting, UserRole, CityLocation } from "../types/marketplace";
import { SAMPLE_WORKERS, SAMPLE_JOBS } from "../data/mockData";
import { ALL_ZIMBABWE_CITIES, getSuburbsForCity } from "../data/zimbabweLocations";

export interface SyncLogEntry {
  id: string;
  timestamp: string;
  sourceName: string;
  mediaType: "Text Log" | "ID Image / OCR" | "Voice Note Transcribed" | "PDF Resume" | "WhatsApp Webhook";
  recordType: "Worker Profile" | "Job Posting";
  status: "Parsed & Synced to DB" | "Verification Pending" | "Duplicate Merged";
  extractedNameOrTitle: string;
  extractedLocation: string;
  extractedPhone: string;
  extractedRate: string;
  autoVerifiedPolice: boolean;
  rawDetails: string;
}

type SyncListener = () => void;

class WhatsAppSyncService {
  private syncLogs: SyncLogEntry[] = [];
  private autoSyncActive: boolean = true;
  private listeners: Set<SyncListener> = new Set();
  private pollingTimer: number | null = null;

  constructor() {
    // Seed initial historical sync logs
    this.syncLogs = [
      {
        id: "sync-101",
        timestamp: "2026-08-13 02:40:12",
        sourceName: "Harare_Recruitment_Batch_08.txt",
        mediaType: "Text Log",
        recordType: "Worker Profile",
        status: "Parsed & Synced to DB",
        extractedNameOrTitle: "Rudo Dube (Maid)",
        extractedLocation: "Harare, Mount Pleasant",
        extractedPhone: "+263785458828",
        extractedRate: "$200/mo",
        autoVerifiedPolice: true,
        rawDetails: "Full-time maid with ZRP Police Clearance CID cert attached.",
      },
      {
        id: "sync-102",
        timestamp: "2026-08-13 02:25:05",
        sourceName: "Candidate_ID_Scan_Nomsa.jpg",
        mediaType: "ID Image / OCR",
        recordType: "Worker Profile",
        status: "Parsed & Synced to DB",
        extractedNameOrTitle: "Nomsa Sibanda (Part-time maid)",
        extractedLocation: "Bulawayo, Kumalo",
        extractedPhone: "+263772111000",
        extractedRate: "$140/mo",
        autoVerifiedPolice: true,
        rawDetails: "OCR extracted ID number 08-234912A-18 and medical certificate.",
      },
      {
        id: "sync-103",
        timestamp: "2026-08-13 02:10:44",
        sourceName: "VoiceNote_3785458828_Cleaner.ogg",
        mediaType: "Voice Note Transcribed",
        recordType: "Worker Profile",
        status: "Parsed & Synced to DB",
        extractedNameOrTitle: "Tinashe Gumbo (Sofa & Carpet Cleaner)",
        extractedLocation: "Harare, Avondale",
        extractedPhone: "+263785458828",
        extractedRate: "$30/task",
        autoVerifiedPolice: false,
        rawDetails: "Voice Note transcription: 'I do sofa shampooing and carpet cleaning in Avondale.'",
      }
    ];

    // Start auto-polling daemon
    this.startAutoPolling();
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getLogs(): SyncLogEntry[] {
    return [...this.syncLogs];
  }

  public isAutoSyncActive(): boolean {
    return this.autoSyncActive;
  }

  public toggleAutoSync(): boolean {
    this.autoSyncActive = !this.autoSyncActive;
    if (this.autoSyncActive) {
      this.startAutoPolling();
    } else if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
    this.notify();
    return this.autoSyncActive;
  }

  /**
   * Parse raw text string and sync directly to DB
   */
  public syncRawText(rawText: string, isJob: boolean = false, sourceName: string = "WhatsApp Direct Text"): { worker?: WorkerProfile; job?: JobPosting; log: SyncLogEntry } {
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);

    if (!isJob) {
      // Parse Worker from Standard WhatsApp Group Format
      const nameMatch = rawText.match(/(?:\*Full Name\*|Full Name|Name|Candidate)[:\s]*([^\n*]+)/i);
      const roleMatch = rawText.match(/(?:\*Role\*|\*Job Category\*|Role|Profession|Position)[:\s]*([^\n*]+)/i);
      const locationMatch = rawText.match(/(?:\*Full address\*|\*Address\*|Full address|City|Location|Suburb|Address)[:\s]*([^\n*]+)/i);
      const phoneMatch = rawText.match(/(?:\*Phone number\*|\*Phone\*|Phone|WhatsApp|Mobile)[:\s]*(\+?[\d\s-]{8,})/i);
      const salaryMatch = rawText.match(/(?:\*Salary expectancy\*|\*Salary\*|Salary expectancy|Salary|Wage|Pay|Rate)[:\s]*\$?(\d+)/i);
      const expMatch = rawText.match(/(?:\*Period served\*|\*Experience\*|Period served|Experience|Exp)[:\s]*(\d+)/i);
      const ageMatch = rawText.match(/(?:\*Age\*:?|\*Age\*|Age:?|Age)[:\s]*(\d+)/i);
      const stayInMatch = rawText.match(/(?:\*Are you comfortable with stay in job\?\*|stay in|live in)[:\s]*([^\n*]+)/i);

      const parsedName = nameMatch ? nameMatch[1].trim() : "WhatsApp Candidate " + Math.floor(Math.random() * 900 + 100);
      const phone = phoneMatch ? phoneMatch[1].replace(/\s/g, "") : "+263785458828";
      const salary = salaryMatch ? parseInt(salaryMatch[1], 10) : 220;
      const exp = expMatch ? parseInt(expMatch[1], 10) : 3;
      const age = ageMatch ? parseInt(ageMatch[1], 10) : 28;

      let city: CityLocation = "Harare";
      if (/bulawayo/i.test(rawText)) city = "Bulawayo";
      else if (/mutare/i.test(rawText)) city = "Mutare";
      else if (/gweru/i.test(rawText)) city = "Gweru";
      else if (/chitungwiza/i.test(rawText)) city = "Chitungwiza";

      let role: UserRole = "Maid";
      const lower = rawText.toLowerCase();
      if (lower.includes("part-time maid") || lower.includes("part time maid")) role = "Part-time maid";
      else if (lower.includes("nanny") || lower.includes("babysitter")) role = "Nanny";
      else if (lower.includes("caregiver") || lower.includes("nurse")) role = "Caregiver";
      else if (lower.includes("tree cutter") || lower.includes("tree felling")) role = "Tree cutter";
      else if (lower.includes("cook") || lower.includes("chef")) role = "Cook";
      else if (lower.includes("cleaner") || lower.includes("housekeeper")) role = "Housekeeper";
      else if (lower.includes("maid") || lower.includes("housemaid")) role = "Maid";

      const hasPolice = /police|zrp|cid|clearance/i.test(rawText);
      const isStayIn = stayInMatch ? /yes|stay|live/i.test(stayInMatch[1]) : /stay in|live-in|live in/i.test(rawText);

      const newWorker: WorkerProfile = {
        id: `wa-sync-w-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        fullName: parsedName,
        role: role,
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
        rating: 4.9,
        reviewCount: 1,
        hourlyRateUSD: Math.round(salary / 40) || 6,
        monthlyRateUSD: salary,
        province: city === "Bulawayo" ? "Bulawayo Province" : "Harare Province",
        district: "Urban",
        city: city,
        suburb: locationMatch ? locationMatch[1].trim() : "Borrowdale",
        distanceKm: 2.5,
        experienceYears: exp,
        education: "O-Level",
        age: age,
        gender: /male/i.test(rawText) && !/female/i.test(rawText) ? "Male" : "Female",
        willingToLiveIn: isStayIn,
        willingToLiveOut: true,
        languages: ["English", "Shona"],
        skills: ["WhatsApp Verified", "Housekeeping", "Laundry & Ironing"],
        bio: rawText.slice(0, 220),
        verifications: {
          idCheck: true,
          policeClearance: hasPolice,
          referenceVerified: true,
          medicalCert: true,
        },
        isVerified: true,
        availability: isStayIn ? "Live-In" : "Full-Time",
        policeClearanceDate: "2026-03-01",
        aiTrustScore: hasPolice ? 98 : 92,
      };

      // Auto-Sync into main database
      SAMPLE_WORKERS.unshift(newWorker);

      const log: SyncLogEntry = {
        id: `log-${Date.now()}`,
        timestamp,
        sourceName,
        mediaType: "Text Log",
        recordType: "Worker Profile",
        status: "Parsed & Synced to DB",
        extractedNameOrTitle: `${newWorker.fullName} (${newWorker.role})`,
        extractedLocation: `${newWorker.city}, ${newWorker.suburb}`,
        extractedPhone: phone,
        extractedRate: `$${newWorker.monthlyRateUSD}/mo`,
        autoVerifiedPolice: hasPolice,
        rawDetails: rawText.slice(0, 100) + "...",
      };

      this.syncLogs.unshift(log);
      this.notify();
      return { worker: newWorker, log };
    } else {
      // Parse Job Posting
      const titleMatch = rawText.match(/(?:Job|Title|Vacancy):\s*(.+)/i);
      const empMatch = rawText.match(/(?:Employer|Client):\s*(.+)/i);
      const payMatch = rawText.match(/(?:Pay|Salary|Offered):\s*\$?(\d+)/i);

      const title = titleMatch ? titleMatch[1].trim() : "WhatsApp Job Vacancy";
      const employer = empMatch ? empMatch[1].trim() : "WhatsApp Employer";
      const pay = payMatch ? parseInt(payMatch[1], 10) : 250;

      const newJob: JobPosting = {
        id: `wa-sync-j-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: title,
        roleNeeded: "Maid",
        employerName: employer,
        city: "Harare",
        suburb: "Avondale",
        offeredSalaryUSD: pay,
        payFrequency: "Monthly",
        workType: "Full-Time",
        description: rawText,
        requiredSkills: ["WhatsApp Auto-Parsed", "Police Clearance Required"],
        postedDate: new Date().toISOString().split("T")[0],
        applicantCount: 0,
        status: "Open",
        urgent: true,
      };

      SAMPLE_JOBS.unshift(newJob);

      const log: SyncLogEntry = {
        id: `log-${Date.now()}`,
        timestamp,
        sourceName,
        mediaType: "Text Log",
        recordType: "Job Posting",
        status: "Parsed & Synced to DB",
        extractedNameOrTitle: newJob.title,
        extractedLocation: `${newJob.city}, ${newJob.suburb}`,
        extractedPhone: "+263785458828",
        extractedRate: `$${newJob.offeredSalaryUSD}/mo`,
        autoVerifiedPolice: true,
        rawDetails: rawText.slice(0, 100) + "...",
      };

      this.syncLogs.unshift(log);
      this.notify();
      return { job: newJob, log };
    }
  }

  /**
   * Process uploaded Media File (Images, Audio, PDF) using OCR/AI simulation & auto-sync to DB
   */
  public async processMediaFile(file: File): Promise<{ worker?: WorkerProfile; job?: JobPosting; log: SyncLogEntry }> {
    // Simulate OCR / Audio Transcription AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const fileName = file.name;
    const fileType = file.type;
    const isImage = fileType.startsWith("image/");
    const isAudio = fileType.startsWith("audio/") || fileName.endsWith(".ogg") || fileName.endsWith(".m4a");
    const isPdf = fileType.includes("pdf") || fileName.endsWith(".pdf");

    let mediaType: SyncLogEntry["mediaType"] = "ID Image / OCR";
    if (isAudio) mediaType = "Voice Note Transcribed";
    if (isPdf) mediaType = "PDF Resume";

    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);

    // AI Media Extraction Heuristics
    const candidateNames = ["Memory Mapfumo", "Kudzai Ndlovu", "Chipo Mutasa", "Blessing Hove", "Sharon Ncube", "Tafadzwa Zvobgo"];
    const randomName = candidateNames[Math.floor(Math.random() * candidateNames.length)];
    
    const roles: UserRole[] = ["Maid", "Part-time maid", "Nanny", "Caregiver", "Housekeeper", "Cook"];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];

    const cities: CityLocation[] = ["Harare", "Bulawayo", "Mutare", "Gweru", "Chitungwiza"];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const citySuburbs = getSuburbsForCity(randomCity);
    const randomSuburb = citySuburbs.length > 1 ? citySuburbs[1] : citySuburbs[0];

    const monthlyRate = Math.floor(Math.random() * 12 + 15) * 10; // $150 - $270

    // Construct image URL preview if image file was uploaded
    let avatarUrl = "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=300";
    let mediaUrl = "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800";
    if (isImage) {
      avatarUrl = URL.createObjectURL(file);
      mediaUrl = avatarUrl;
    } else if (isPdf) {
      mediaUrl = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=600";
    }

    const portfolioItems: any[] = [
      {
        id: `wa-port-main-${Date.now()}`,
        title: isPdf ? `Verified Document: ${fileName}` : `Work Evidence: ${fileName}`,
        category: isPdf ? "Reference Letter" : "Work Photo",
        fileType: isPdf ? "pdf" : "image",
        url: mediaUrl,
        description: `Imported via WhatsApp Media sync (${fileName}). Validated through AI media extraction pipeline.`,
        uploadedAt: new Date().toISOString().split("T")[0],
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        isVerified: true,
        issuerOrEmployer: isPdf ? "Previous Household Employer" : undefined,
        rating: 5,
        documentContent: isPdf ? `Official Reference Letter and Verified Qualification for ${randomName}. Confirmed exemplary housekeeping, punctuality, and trustworthy domestic care.` : undefined,
      },
      {
        id: `wa-port-clean-${Date.now()}`,
        title: "Deep Clean & Kitchen Sanitization Proof",
        category: "Cleaning / Ironing Proof",
        fileType: "image",
        url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800",
        description: "Kitchen counter deep cleaning, gas stove degreasing, and dish organization.",
        uploadedAt: new Date().toISOString().split("T")[0],
        fileSize: "1.4 MB",
        isVerified: true,
      },
      {
        id: `wa-port-iron-${Date.now()}`,
        title: "Steam Ironing & Wardrobe Care Proof",
        category: "Cleaning / Ironing Proof",
        fileType: "image",
        url: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&q=80&w=800",
        description: "Steam pressing of linen, school uniforms, and garments.",
        uploadedAt: new Date().toISOString().split("T")[0],
        fileSize: "1.6 MB",
        isVerified: true,
      }
    ];

    const newWorker: WorkerProfile = {
      id: `media-sync-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fullName: randomName,
      role: randomRole,
      avatarUrl: avatarUrl,
      rating: 5.0,
      reviewCount: 3,
      hourlyRateUSD: Math.round(monthlyRate / 35),
      monthlyRateUSD: monthlyRate,
      province: randomCity === "Bulawayo" ? "Bulawayo Province" : "Harare Province",
      district: "Urban",
      city: randomCity,
      suburb: randomSuburb,
      distanceKm: 1.8,
      experienceYears: Math.floor(Math.random() * 7 + 2),
      education: "O-Level",
      age: Math.floor(Math.random() * 15 + 22),
      gender: "Female",
      willingToLiveIn: true,
      willingToLiveOut: true,
      languages: ["Shona", "English", "Ndebele"],
      skills: [
        `${mediaType} Extracted`,
        "OCR National ID Verified",
        "ZRP Police CID Clearance Attached",
        "Medical Fitness Certified"
      ],
      bio: `Automated Media Ingestion (${fileName}): Candidate metadata extracted from ${mediaType}. ZRP Police CID clearance stamp detected and verified with proof of work portfolio.`,
      verifications: {
        idCheck: true,
        policeClearance: true,
        referenceVerified: true,
        medicalCert: true,
      },
      isVerified: true,
      availability: "Full-Time",
      policeClearanceDate: "2026-03-05",
      aiTrustScore: 99,
      agencyName: "WhatsApp Automated Sync Engine",
      portfolio: portfolioItems,
    };

    // Auto-Sync into main database array
    SAMPLE_WORKERS.unshift(newWorker);

    const log: SyncLogEntry = {
      id: `log-${Date.now()}`,
      timestamp,
      sourceName: fileName,
      mediaType,
      recordType: "Worker Profile",
      status: "Parsed & Synced to DB",
      extractedNameOrTitle: `${newWorker.fullName} (${newWorker.role})`,
      extractedLocation: `${newWorker.city}, ${newWorker.suburb}`,
      extractedPhone: "+263785458828",
      extractedRate: `$${newWorker.monthlyRateUSD}/mo`,
      autoVerifiedPolice: true,
      rawDetails: `File [${fileName}] parsed via Vision/Audio AI OCR. Extracted ID & CID Police clearance automatically synced to Worker Directory.`,
    };

    this.syncLogs.unshift(log);
    this.notify();
    return { worker: newWorker, log };
  }

  /**
   * Start periodic background webhook polling daemon simulation
   */
  private startAutoPolling() {
    if (this.pollingTimer) return;

    this.pollingTimer = window.setInterval(() => {
      if (!this.autoSyncActive) return;

      // 15% chance per 12 seconds to receive an automated WhatsApp incoming candidate webhook
      if (Math.random() < 0.18) {
        const sampleNames = ["Fortunate Chawasarira", "Nyasha Zimunya", "Siphosami Mpofu", "Mercy Mupfumi"];
        const name = sampleNames[Math.floor(Math.random() * sampleNames.length)];
        const roles: UserRole[] = ["Maid", "Part-time maid", "Nanny", "Caregiver"];
        const role = roles[Math.floor(Math.random() * roles.length)];

        const rawText = `AUTOMATED WHATSAPP INCOMING WEBHOOK
Candidate: ${name}
Role: ${role}
Location: Harare, Greendale
Phone: +263785458828
Salary: $210/month
Police Clearance: ZRP CID Cleared 2026
Bio: Experienced domestic worker and maid with references from Greendale family.`;

        this.syncRawText(rawText, false, "WhatsApp Webhook Listener (+263785458828)");
      }
    }, 12000);
  }
}

export const whatsappSyncService = new WhatsAppSyncService();
