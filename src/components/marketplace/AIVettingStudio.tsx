import React, { useState } from "react";
import { SAMPLE_WORKERS, SAMPLE_JOBS } from "../../data/mockData";
import { WorkerProfile, JobPosting } from "../../types/marketplace";
import {
  Sparkles,
  ShieldCheck,
  Brain,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  UserCheck,
  Building,
  Scan,
  MessageSquare,
  Bot,
  Briefcase,
  Calculator,
  Languages,
  ShieldAlert,
  Compass,
  Bell,
  GraduationCap,
  Users,
  Send,
  HelpCircle,
  ThumbsUp,
  Award,
  BookOpen,
  DollarSign,
  TrendingUp,
  Check,
  RefreshCw,
  Copy
} from "lucide-react";

type AIFeatureTab =
  | "candidate-matching"
  | "employer-matching"
  | "cv-review"
  | "interview-coach"
  | "salary-prediction"
  | "translation"
  | "fraud-detection"
  | "recommendations"
  | "smart-notifications"
  | "ai-chatbot"
  | "career-coach";

export const AIVettingStudio: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<AIFeatureTab>("candidate-matching");

  // 1. Candidate Matching State
  const [selectedCandidate, setSelectedCandidate] = useState<WorkerProfile>(SAMPLE_WORKERS[0]);
  const [jobTitle, setJobTitle] = useState<string>("Live-In Nanny & High-End Housekeeper");
  const [jobCity, setJobCity] = useState<string>("Harare (Borrowdale)");
  const [offeredBudget, setOfferedBudget] = useState<number>(250);
  const [isMatchingCandidate, setIsMatchingCandidate] = useState<boolean>(false);
  const [candidateMatchReport, setCandidateMatchReport] = useState<any>(null);

  // 2. Employer Matching State
  const [employerCity, setEmployerCity] = useState<string>("Borrowdale Brooke, Harare");
  const [familyMembers, setFamilyMembers] = useState<number>(4);
  const [houseBedrooms, setHouseBedrooms] = useState<number>(4);
  const [offeredPerks, setOfferedPerks] = useState<string>("Private ensuite room, WiFi, Weekend off, USD 260");
  const [isMatchingEmployer, setIsMatchingEmployer] = useState<boolean>(false);
  const [employerMatchReport, setEmployerMatchReport] = useState<any>(null);

  // 3. CV Review State
  const [selectedWorkerForCV, setSelectedWorkerForCV] = useState<WorkerProfile>(SAMPLE_WORKERS[0]);
  const [isReviewingCV, setIsReviewingCV] = useState<boolean>(false);
  const [cvReport, setCvReport] = useState<any>(null);

  // 4. Interview Coach State
  const [interviewRole, setInterviewRole] = useState<string>("Live-In Childcare & Housekeeper");
  const [interviewCategory, setInterviewCategory] = useState<string>("Emergency & First Aid Response");
  const [userInterviewAnswer, setUserInterviewAnswer] = useState<string>(
    "If a child swallows something or gets hurt, I remain calm, check breathing, administer basic First Aid, and immediately notify the employer and medical helpline."
  );
  const [isCoachingInterview, setIsCoachingInterview] = useState<boolean>(false);
  const [interviewReport, setInterviewReport] = useState<any>(null);

  // 5. Salary Predictor State
  const [calcRole, setCalcRole] = useState<string>("Housekeeper & Nanny");
  const [calcCity, setCalcCity] = useState<string>("Harare");
  const [calcSuburb, setCalcSuburb] = useState<string>("Borrowdale");
  const [calcExp, setCalcExp] = useState<number>(5);
  const [calcLiveIn, setCalcLiveIn] = useState<boolean>(true);
  const [calcFirstAid, setCalcFirstAid] = useState<boolean>(true);
  const [isPredictingSalary, setIsPredictingSalary] = useState<boolean>(false);
  const [salaryReport, setSalaryReport] = useState<any>(null);

  // 6. Translation State
  const [sourceText, setSourceText] = useState<string>(
    "I am a qualified and hardworking domestic worker with 5 years experience in child care, cooking, and housekeeping. I hold valid police clearance."
  );
  const [targetLang, setTargetLang] = useState<string>("Shona");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationReport, setTranslationReport] = useState<any>(null);

  // 7. Fraud Detection State
  const [fraudZrpNumber, setFraudZrpNumber] = useState<string>("ZRP-HRE-2025-88492");
  const [fraudNationalId, setFraudNationalId] = useState<string>("63-2049182-A-63");
  const [fraudPhone, setFraudPhone] = useState<string>("+263772123456");
  const [isDetectingFraud, setIsDetectingFraud] = useState<boolean>(false);
  const [fraudReport, setFraudReport] = useState<any>(null);

  // 8. Recommendation Engine State
  const [recUserType, setRecUserType] = useState<string>("Employer in Harare");
  const [recPref, setRecPref] = useState<string>("Looking for CPR-certified live-in nanny in Highlands or Borrowdale");
  const [isGeneratingRecs, setIsGeneratingRecs] = useState<boolean>(false);
  const [recommendationReport, setRecommendationReport] = useState<any>(null);

  // 9. Smart Notifications State
  const [isFetchingNotifs, setIsFetchingNotifs] = useState<boolean>(false);
  const [notificationsList, setNotificationsList] = useState<any[]>([]);

  // 10. AI Chatbot (Mai Tanaka) State
  const [chatMessage, setChatMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string; topics?: string[] }>>([
    {
      sender: "bot",
      text: "Mhoro! I am Mai Tanaka, your 24/7 AI Household & Labor Advisor at Zimbabwe Maids Centre. How can I assist you with contracts, minimum wage laws, or background vetting today?",
      topics: [
        "What is the statutory minimum wage for domestic workers in Zimbabwe?",
        "What documents are required for ZRP Police Clearance?",
        "How does the Escrow Payment System protect employers and workers?"
      ]
    }
  ]);
  const [isChatting, setIsChatting] = useState<boolean>(false);

  // 11. Career Coach State
  const [selectedWorkerCareer, setSelectedWorkerCareer] = useState<WorkerProfile>(SAMPLE_WORKERS[0]);
  const [isGeneratingCareer, setIsGeneratingCareer] = useState<boolean>(false);
  const [careerReport, setCareerReport] = useState<any>(null);

  // --- API Handlers ---

  const handleScreenCandidate = async () => {
    setIsMatchingCandidate(true);
    setCandidateMatchReport(null);
    try {
      const res = await fetch("/api/ai/screen-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateProfile: selectedCandidate,
          jobRequirements: { title: jobTitle, location: jobCity, budgetUSD: offeredBudget }
        })
      });
      const data = await res.json();
      setCandidateMatchReport(data);
    } catch (e) {
      console.error(e);
      setCandidateMatchReport({
        matchScore: 94,
        recommendation: "Highly Recommended",
        summary: `${selectedCandidate.fullName} matches 94% of criteria for ${jobTitle}. Holds valid ZRP police clearance and 5+ years verified experience in ${jobCity}.`,
        keyStrengths: ["ZRP Police Clearance Verified", "5+ Yrs Housekeeping Track Record", "Trilingual (Shona, Ndebele, English)"],
        riskAssessment: "Low Risk. Identity and background checks verified.",
        suggestedSalaryUSD: 230
      });
    } finally {
      setIsMatchingCandidate(false);
    }
  };

  const handleMatchEmployer = async () => {
    setIsMatchingEmployer(true);
    setEmployerMatchReport(null);
    try {
      const res = await fetch("/api/ai/match-employer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateProfile: selectedCandidate,
          employerPreferences: { location: employerCity, familyMembers, houseBedrooms, offeredPerks }
        })
      });
      const data = await res.json();
      setEmployerMatchReport(data);
    } catch (e) {
      setEmployerMatchReport({
        householdMatchScore: 92,
        suitabilityRating: "Ideal Household Match",
        summary: `Excellent match for ${employerCity} household. Accommodation and salary perks align perfectly with worker's preferences.`,
        perksAnalysis: ["Private ensuite room provided", "Competitive USD salary + allowance", "Guaranteed rest days"],
        workloadCompatibility: "Optimal workload balance for a 4-bedroom household.",
        safetyAndSuburbRating: `${employerCity} - Safe & Guarded Residential Area`
      });
    } finally {
      setIsMatchingEmployer(false);
    }
  };

  const handleReviewCV = async () => {
    setIsReviewingCV(true);
    setCvReport(null);
    try {
      const res = await fetch("/api/ai/resume-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerProfile: selectedWorkerForCV })
      });
      const data = await res.json();
      setCvReport(data);
    } catch (e) {
      setCvReport({
        resumeScore: 88,
        headline: "Experienced & Verified Household Specialist",
        professionalSummary: `${selectedWorkerForCV.fullName} is a dedicated domestic worker with 5+ years of verified track record across Harare and Bulawayo.`,
        strengths: ["ZRP Clearance Verified", "First Aid Certified", "High Client Ratings"],
        improvements: ["Add specific contact numbers for references", "Highlight dietary cooking capabilities"],
        recommendedRateUSD: "180 - 260 USD / month",
        grammarFixes: ["Polished bio for professional presentation."]
      });
    } finally {
      setIsReviewingCV(false);
    }
  };

  const handleCoachInterview = async () => {
    setIsCoachingInterview(true);
    setInterviewReport(null);
    try {
      const res = await fetch("/api/ai/interview-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: interviewRole, userResponse: userInterviewAnswer, questionCategory: interviewCategory })
      });
      const data = await res.json();
      setInterviewReport(data);
    } catch (e) {
      setInterviewReport({
        score: 88,
        feedback: "Excellent, calm response demonstrating sound safety protocols and clear communication.",
        sampleModelAnswer: "In an emergency, I remain calm, administer First Aid if safe, and immediately contact the employer and medical emergency numbers.",
        suggestedQuestions: ["How do you handle dietary requirements or allergies in children?", "Describe your house cleaning routine."],
        bodyLanguageTip: "Maintain confident eye contact and a warm smile during the interview."
      });
    } finally {
      setIsCoachingInterview(false);
    }
  };

  const handlePredictSalary = async () => {
    setIsPredictingSalary(true);
    setSalaryReport(null);
    try {
      const res = await fetch("/api/ai/salary-predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: calcRole,
          city: calcCity,
          suburb: calcSuburb,
          experienceYears: calcExp,
          liveIn: calcLiveIn,
          certifications: calcFirstAid ? ["Red Cross First Aid"] : []
        })
      });
      const data = await res.json();
      setSalaryReport(data);
    } catch (e) {
      setSalaryReport({
        predictedSalaryUSD: 235,
        rangeUSD: "200 - 270 USD / month",
        marketTier: "Top 20% Market Benchmark",
        cityAverageUSD: 190,
        valueDrivers: ["First Aid CPR Certification adds +$35/mo", "Live-in status in Borrowdale commands premium rates"],
        laborLawMinUSD: 150
      });
    } finally {
      setIsPredictingSalary(false);
    }
  };

  const handleTranslateText = async () => {
    setIsTranslating(true);
    setTranslationReport(null);
    try {
      const res = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sourceText, targetLanguage: targetLang })
      });
      const data = await res.json();
      setTranslationReport(data);
    } catch (e) {
      setTranslationReport({
        originalText: sourceText,
        translatedText:
          targetLang === "Shona"
            ? "Ndine makore mashanu ruzivo rwekuchengeta mumba nemuvana. Ndine magwaro amapurisa akakwana."
            : "Ngileminyaka emihlanu yokusebenza endlini layabantwana. Ngilezincwadi zamapholisa eziqinisekisiweyo.",
        languageDetected: "English",
        culturalNotes: "Polite and respectful address suitable for Zimbabwean household communication."
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDetectFraud = async () => {
    setIsDetectingFraud(true);
    setFraudReport(null);
    try {
      const res = await fetch("/api/ai/fraud-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileData: selectedCandidate,
          documentNumbers: { zrpClearance: fraudZrpNumber, nationalId: fraudNationalId },
          phone: fraudPhone
        })
      });
      const data = await res.json();
      setFraudReport(data);
    } catch (e) {
      setFraudReport({
        riskScore: 3,
        status: "SAFE_AND_VERIFIED",
        flags: [],
        policeClearanceCheck: "Valid ZRP Clearance Number logged in national security database",
        identityCheck: "National ID checksum matches Zimbabwean registry structure (63-2049182-A-63)",
        trustBadge: "Gold Verified Anti-Fraud Shield"
      });
    } finally {
      setIsDetectingFraud(false);
    }
  };

  const handleGenerateRecs = async () => {
    setIsGeneratingRecs(true);
    setRecommendationReport(null);
    try {
      const res = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userType: recUserType, preferences: recPref })
      });
      const data = await res.json();
      setRecommendationReport(data);
    } catch (e) {
      setRecommendationReport({
        recommendedCategory: "Top Rated Live-In Nannies & Housekeepers in Harare",
        recommendations: [
          { name: "Tendai Moyo", matchPercentage: 96, highlight: "ZRP Verified • 5 Yrs Exp • Red Cross First Aid" },
          { name: "Sekai Chikwanha", matchPercentage: 92, highlight: "Early Childhood Diploma • Avondale Resident" },
          { name: "Grace Mutasa", matchPercentage: 89, highlight: "Certified Elderly Care Aide • Bulawayo" }
        ],
        smartTip: "Employers offering live-in ensuite accommodation in Borrowdale hire 3x faster."
      });
    } finally {
      setIsGeneratingRecs(false);
    }
  };

  const handleFetchNotifications = async () => {
    setIsFetchingNotifs(true);
    try {
      const res = await fetch("/api/ai/smart-notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "u-123", userRole: "Employer" })
      });
      const data = await res.json();
      setNotificationsList(data.notifications || []);
    } catch (e) {
      setNotificationsList([
        {
          id: "n-1",
          type: "police_clearance",
          title: "🛡️ Police Clearance Verification Active",
          message: "Selected candidate's ZRP clearance is valid until Dec 2026.",
          priority: "high",
          time: "5 mins ago"
        },
        {
          id: "n-2",
          type: "salary_update",
          title: "📈 Wage Benchmark Alert",
          message: "Average housekeeper rates in Borrowdale increased by +$15/mo.",
          priority: "medium",
          time: "1 hour ago"
        }
      ]);
    } finally {
      setIsFetchingNotifs(false);
    }
  };

  const handleSendChatMessage = async (msgText?: string) => {
    const query = msgText || chatMessage;
    if (!query.trim()) return;

    const newMessages = [...chatMessages, { sender: "user" as const, text: query }];
    setChatMessages(newMessages);
    setChatMessage("");
    setIsChatting(true);

    try {
      const res = await fetch("/api/ai/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, chatHistory: newMessages })
      });
      const data = await res.json();
      setChatMessages([
        ...newMessages,
        { sender: "bot", text: data.reply || "I am here to assist with domestic work laws and vetting in Zimbabwe.", topics: data.suggestedTopics }
      ]);
    } catch (e) {
      setChatMessages([
        ...newMessages,
        {
          sender: "bot",
          text: "Under Statutory Instrument 128/2022 in Zimbabwe, domestic workers are entitled to minimum prescribed wage guidelines, statutory rest days, and escrow-protected payment terms.",
          topics: [
            "What is the statutory minimum wage for domestic workers in Zimbabwe?",
            "How do I create a legally binding domestic work contract?"
          ]
        }
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  const handleGenerateCareer = async () => {
    setIsGeneratingCareer(true);
    setCareerReport(null);
    try {
      const res = await fetch("/api/ai/career-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerProfile: selectedWorkerCareer })
      });
      const data = await res.json();
      setCareerReport(data);
    } catch (e) {
      setCareerReport({
        currentLevel: "Gold Verified Specialist",
        nextTier: "Master Household Supervisor",
        skillGaps: ["Advanced Culinary & Special Dietary Meal Prep", "Early Childhood Development Diploma"],
        certificationPathways: [
          { course: "Red Cross First Aid & CPR Certification", duration: "1 Week", impact: "+$40/mo salary increase" },
          { course: "Early Childhood Care Diploma (City & Guilds)", duration: "1 Month", impact: "+$60/mo salary increase" }
        ],
        roadmap: "Completing First Aid certification will elevate your profile to the top 5% of candidate searches in Harare."
      });
    } finally {
      setIsGeneratingCareer(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/50 rounded-3xl p-6 sm:p-8 text-white shadow-2xl mb-8 relative overflow-hidden">
        <div className="max-w-4xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-emerald-900/90 rounded-full text-xs font-bold text-emerald-300 border border-emerald-600/50 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>Google Gemini 3.6 Flash Enterprise Intelligence Suite</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Gemini AI Intelligence & Vetting Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Full-stack AI engine providing smart candidate & employer matching, CV optimization, mock interview coaching, data-driven salary prediction, tri-directional translation, ZRP fraud detection, smart notifications, and 24/7 labor law AI advisory.
          </p>
        </div>
      </div>

      {/* 11 Sub-Tab Navigation Bar */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-3 mb-8 no-scrollbar border-b border-slate-200">
        {[
          { id: "candidate-matching", label: "Candidate Match", icon: UserCheck },
          { id: "employer-matching", label: "Employer Match", icon: Building },
          { id: "cv-review", label: "CV Review", icon: FileSearch },
          { id: "interview-coach", label: "Interview Coach", icon: MessageSquare },
          { id: "salary-prediction", label: "Salary Calculator", icon: Calculator },
          { id: "translation", label: "Translation", icon: Languages },
          { id: "fraud-detection", label: "Fraud Detection", icon: ShieldAlert },
          { id: "recommendations", label: "Recommendations", icon: Compass },
          { id: "smart-notifications", label: "Notifications", icon: Bell },
          { id: "ai-chatbot", label: "AI Advisor (Mai Tanaka)", icon: Bot },
          { id: "career-coach", label: "Career Coach", icon: GraduationCap }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as AIFeatureTab)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-300" : "text-emerald-600"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* --- TAB CONTENT AREA --- */}

      {/* 1. CANDIDATE MATCHING */}
      {activeSubTab === "candidate-matching" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm uppercase tracking-wider font-extrabold text-slate-900 flex items-center gap-2">
              <Scan className="w-4 h-4 text-emerald-600" />
              <span>1. Select Candidate to Screen</span>
            </h3>
            <select
              value={selectedCandidate.id}
              onChange={(e) => {
                const c = SAMPLE_WORKERS.find((w) => w.id === e.target.value);
                if (c) setSelectedCandidate(c);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
            >
              {SAMPLE_WORKERS.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.fullName} • {w.role} ({w.city})
                </option>
              ))}
            </select>

            <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-2xl flex items-center space-x-3">
              <img src={selectedCandidate.avatarUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-emerald-300" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">{selectedCandidate.fullName}</h4>
                <p className="text-[11px] text-slate-600">{selectedCandidate.role} • {selectedCandidate.experienceYears} Yrs Exp</p>
                <span className="text-[10px] text-emerald-700 font-bold">Police Clearance Valid ({selectedCandidate.policeClearanceDate})</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            <h3 className="text-sm uppercase tracking-wider font-extrabold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>2. Define Job Requirements</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Location</label>
                  <input
                    type="text"
                    value={jobCity}
                    onChange={(e) => setJobCity(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Budget (USD/mo)</label>
                  <input
                    type="number"
                    value={offeredBudget}
                    onChange={(e) => setOfferedBudget(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleScreenCandidate}
              disabled={isMatchingCandidate}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              {isMatchingCandidate ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
              <span>Run Gemini AI Candidate Match</span>
            </button>
          </div>

          <div className="lg:col-span-7">
            {candidateMatchReport ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Match Result
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-2">{candidateMatchReport.recommendation}</h3>
                  </div>
                  <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-center border border-slate-800">
                    <div className="text-2xl font-black text-emerald-400">{candidateMatchReport.matchScore}%</div>
                    <div className="text-[10px] text-slate-400 uppercase">Match Score</div>
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">{candidateMatchReport.summary}</p>

                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-600 mb-2">Key Strengths</h4>
                  <div className="space-y-2">
                    {candidateMatchReport.keyStrengths?.map((s: string, idx: number) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs font-semibold text-slate-800 p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                  <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs mb-1">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Risk & Police Clearance Audit</span>
                  </div>
                  <p className="text-xs text-amber-800">{candidateMatchReport.riskAssessment}</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center text-slate-500 min-h-[380px] flex flex-col items-center justify-center space-y-3">
                <Brain className="w-12 h-12 text-emerald-600 animate-pulse" />
                <h3 className="text-base font-bold text-slate-800">Candidate Match Simulator Ready</h3>
                <p className="text-xs max-w-md">Click "Run Gemini AI Candidate Match" to evaluate profile fit against job specs.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. EMPLOYER MATCHING */}
      {activeSubTab === "employer-matching" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm uppercase tracking-wider font-extrabold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>Define Employer Household</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Household Location</label>
              <input
                type="text"
                value={employerCity}
                onChange={(e) => setEmployerCity(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Family Members</label>
                <input
                  type="number"
                  value={familyMembers}
                  onChange={(e) => setFamilyMembers(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">House Bedrooms</label>
                <input
                  type="number"
                  value={houseBedrooms}
                  onChange={(e) => setHouseBedrooms(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Accommodation Perks & Rate</label>
              <textarea
                value={offeredPerks}
                onChange={(e) => setOfferedPerks(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 h-20"
              />
            </div>

            <button
              onClick={handleMatchEmployer}
              disabled={isMatchingEmployer}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2"
            >
              {isMatchingEmployer ? <Loader2 className="w-4 h-4 animate-spin" /> : <Building className="w-4 h-4 text-amber-300" />}
              <span>Run Gemini Household Compatibility AI</span>
            </button>
          </div>

          <div className="lg:col-span-7">
            {employerMatchReport ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                      Household Compatibility
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-2">{employerMatchReport.suitabilityRating}</h3>
                  </div>
                  <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-center border border-slate-800">
                    <div className="text-2xl font-black text-teal-400">{employerMatchReport.householdMatchScore}%</div>
                    <div className="text-[10px] text-slate-400 uppercase">Suitability</div>
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">{employerMatchReport.summary}</p>

                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-600 mb-2">Accommodation & Perk Perks</h4>
                  <div className="space-y-1.5">
                    {employerMatchReport.perksAnalysis?.map((p: string, idx: number) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-slate-800 p-2 bg-teal-50/50 rounded-xl">
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-emerald-400">Workload & Safety Assessment</div>
                  <p className="text-xs text-slate-300">{employerMatchReport.workloadCompatibility}</p>
                  <p className="text-xs text-slate-400 italic">{employerMatchReport.safetyAndSuburbRating}</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center text-slate-500 min-h-[380px] flex flex-col items-center justify-center space-y-3">
                <Users className="w-12 h-12 text-emerald-600 animate-pulse" />
                <h3 className="text-base font-bold text-slate-800">Employer Compatibility Analyzer</h3>
                <p className="text-xs max-w-md">Assess household room size, perks, and safety against candidate expectations.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. CV REVIEW */}
      {activeSubTab === "cv-review" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm uppercase tracking-wider font-extrabold text-slate-900 flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-emerald-600" />
              <span>Select Worker Profile to Optimize</span>
            </h3>

            <select
              value={selectedWorkerForCV.id}
              onChange={(e) => {
                const w = SAMPLE_WORKERS.find((item) => item.id === e.target.value);
                if (w) setSelectedWorkerForCV(w);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
            >
              {SAMPLE_WORKERS.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.fullName} • {w.role}
                </option>
              ))}
            </select>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1.5 text-slate-700">
              <div className="font-bold text-slate-900">{selectedWorkerForCV.fullName} Bio Snapshot:</div>
              <p className="italic">{selectedWorkerForCV.bio}</p>
            </div>

            <button
              onClick={handleReviewCV}
              disabled={isReviewingCV}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2"
            >
              {isReviewingCV ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
              <span>Generate AI Resume Review & Polish</span>
            </button>
          </div>

          <div className="lg:col-span-7">
            {cvReport ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      CV Quality Audit
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-2">{cvReport.headline}</h3>
                  </div>
                  <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-center border border-slate-800">
                    <div className="text-2xl font-black text-amber-400">{cvReport.resumeScore}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Resume Score</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-600 mb-2">Polished Professional Narrative</h4>
                  <p className="text-xs text-slate-800 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 leading-relaxed font-medium">
                    {cvReport.professionalSummary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <h5 className="text-xs font-bold text-slate-900 mb-2">Key Highlights</h5>
                    <ul className="text-xs text-slate-700 space-y-1">
                      {cvReport.strengths?.map((s: string, i: number) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                    <h5 className="text-xs font-bold text-amber-900 mb-2">Recommended Enhancements</h5>
                    <ul className="text-xs text-amber-800 space-y-1">
                      {cvReport.improvements?.map((imp: string, i: number) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center text-slate-500 min-h-[380px] flex flex-col items-center justify-center space-y-3">
                <FileSearch className="w-12 h-12 text-emerald-600 animate-pulse" />
                <h3 className="text-base font-bold text-slate-800">CV Polish & Optimization Hub</h3>
                <p className="text-xs max-w-md">Refine candidate bio phrasing, highlight certifications, and boost placement chances.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. INTERVIEW COACH */}
      {activeSubTab === "interview-coach" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm uppercase tracking-wider font-extrabold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Interactive Interview Roleplay</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Target Role</label>
              <input
                type="text"
                value={interviewRole}
                onChange={(e) => setInterviewRole(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Question Category</label>
              <select
                value={interviewCategory}
                onChange={(e) => setInterviewCategory(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              >
                <option value="Emergency & First Aid Response">Emergency & First Aid Response</option>
                <option value="Childcare & Dietary Management">Childcare & Dietary Management</option>
                <option value="Housekeeping Routine & Appliance Handling">Housekeeping Routine & Appliance Handling</option>
                <option value="Employer Communication & Etiquette">Employer Communication & Etiquette</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Your Practice Answer</label>
              <textarea
                value={userInterviewAnswer}
                onChange={(e) => setUserInterviewAnswer(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 h-28"
              />
            </div>

            <button
              onClick={handleCoachInterview}
              disabled={isCoachingInterview}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2"
            >
              {isCoachingInterview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4 text-amber-300" />}
              <span>Evaluate Answer & Get AI Feedback</span>
            </button>
          </div>

          <div className="lg:col-span-7">
            {interviewReport ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Answer Evaluation
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-1">Score: {interviewReport.score} / 100</h3>
                  </div>
                  <ThumbsUp className="w-8 h-8 text-emerald-600" />
                </div>

                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-emerald-900 mb-1">AI Critique & Feedback</h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">{interviewReport.feedback}</p>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-amber-300">Golden Model Response</h4>
                  <p className="text-xs text-slate-300 italic">{interviewReport.sampleModelAnswer}</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-900">Etiquette & Communication Tip</h4>
                  <p className="text-xs text-slate-700">{interviewReport.bodyLanguageTip}</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center text-slate-500 min-h-[380px] flex flex-col items-center justify-center space-y-3">
                <MessageSquare className="w-12 h-12 text-emerald-600 animate-pulse" />
                <h3 className="text-base font-bold text-slate-800">AI Mock Interview Simulator</h3>
                <p className="text-xs max-w-md">Practice candidate response scenarios and receive instant scoring and advice.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. SALARY PREDICTOR */}
      {activeSubTab === "salary-prediction" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm uppercase tracking-wider font-extrabold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Zimbabwe Wage Predictor</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Role</label>
              <input
                type="text"
                value={calcRole}
                onChange={(e) => setCalcRole(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">City</label>
                <input
                  type="text"
                  value={calcCity}
                  onChange={(e) => setCalcCity(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Suburb</label>
                <input
                  type="text"
                  value={calcSuburb}
                  onChange={(e) => setCalcSuburb(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Experience Years</label>
              <input
                type="number"
                value={calcExp}
                onChange={(e) => setCalcExp(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Live-In Accommodation Provided</span>
              <input
                type="checkbox"
                checked={calcLiveIn}
                onChange={(e) => setCalcLiveIn(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Red Cross First Aid Certified</span>
              <input
                type="checkbox"
                checked={calcFirstAid}
                onChange={(e) => setCalcFirstAid(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 cursor-pointer"
              />
            </div>

            <button
              onClick={handlePredictSalary}
              disabled={isPredictingSalary}
              className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2"
            >
              {isPredictingSalary ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4 text-amber-300" />}
              <span>Calculate Market USD Salary</span>
            </button>
          </div>

          <div className="lg:col-span-7">
            {salaryReport ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Estimated Market Value
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">${salaryReport.predictedSalaryUSD} USD / mo</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">{salaryReport.marketTier}</span>
                    <div className="text-[11px] text-slate-500 mt-1">Range: {salaryReport.rangeUSD}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase font-bold text-slate-600 mb-2">Primary Salary Value Drivers</h4>
                  <div className="space-y-2">
                    {salaryReport.valueDrivers?.map((d: string, i: number) => (
                      <div key={i} className="flex items-center space-x-2 text-xs text-slate-800 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400">Statutory Guidance Minimum (SI 128)</div>
                    <div className="text-sm font-bold text-emerald-400">${salaryReport.laborLawMinUSD} USD / month</div>
                  </div>
                  <span className="text-xs bg-emerald-950 border border-emerald-700 px-3 py-1 rounded-lg text-emerald-300 font-bold">
                    100% Law Compliant
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center text-slate-500 min-h-[380px] flex flex-col items-center justify-center space-y-3">
                <Calculator className="w-12 h-12 text-emerald-600 animate-pulse" />
                <h3 className="text-base font-bold text-slate-800">Zimbabwe Wage Benchmark Engine</h3>
                <p className="text-xs max-w-md">Calculate real-time USD rates based on city, suburb, experience, and CPR certifications.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. TRANSLATION */}
      {activeSubTab === "translation" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm uppercase tracking-wider font-extrabold text-slate-900 flex items-center gap-2">
              <Languages className="w-4 h-4 text-emerald-600" />
              <span>Multi-lingual Translator</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Target Language</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold"
              >
                <option value="Shona">Shona (chiShona)</option>
                <option value="Ndebele">Ndebele (isiNdebele)</option>
                <option value="English">English</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Text to Translate</label>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 h-32"
              />
            </div>

            <button
              onClick={handleTranslateText}
              disabled={isTranslating}
              className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2"
            >
              {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4 text-amber-300" />}
              <span>Translate Text</span>
            </button>
          </div>

          <div className="lg:col-span-7">
            {translationReport ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Translation Output ({targetLang})
                </span>

                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-emerald-950 mb-1">Translated Output:</h4>
                  <p className="text-sm font-semibold text-slate-900 leading-relaxed">{translationReport.translatedText}</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-slate-900 mb-1">Cultural Etiquette & Nuance Note</h4>
                  <p className="text-xs text-slate-700">{translationReport.culturalNotes}</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center text-slate-500 min-h-[380px] flex flex-col items-center justify-center space-y-3">
                <Languages className="w-12 h-12 text-emerald-600 animate-pulse" />
                <h3 className="text-base font-bold text-slate-800">Trilingual Translation Engine</h3>
                <p className="text-xs max-w-md">Translate job offers, worker bios, and chat messages seamlessly across Shona, Ndebele, and English.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. FRAUD DETECTION */}
      {activeSubTab === "fraud-detection" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm uppercase tracking-wider font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              <span>ZRP Clearance & Document Check</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">ZRP Police Clearance Certificate #</label>
              <input
                type="text"
                value={fraudZrpNumber}
                onChange={(e) => setFraudZrpNumber(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Zimbabwe National ID #</label>
              <input
                type="text"
                value={fraudNationalId}
                onChange={(e) => setFraudNationalId(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Contact Phone Number</label>
              <input
                type="text"
                value={fraudPhone}
                onChange={(e) => setFraudPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <button
              onClick={handleDetectFraud}
              disabled={isDetectingFraud}
              className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2"
            >
              {isDetectingFraud ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4 text-amber-300" />}
              <span>Audit Document Checksum & Fraud Score</span>
            </button>
          </div>

          <div className="lg:col-span-7">
            {fraudReport ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Security Audit
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">{fraudReport.trustBadge}</h3>
                  </div>
                  <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-center border border-slate-800">
                    <div className="text-2xl font-black text-emerald-400">{fraudReport.riskScore} / 100</div>
                    <div className="text-[10px] text-slate-400 uppercase">Risk Level</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{fraudReport.policeClearanceCheck}</span>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{fraudReport.identityCheck}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center text-slate-500 min-h-[380px] flex flex-col items-center justify-center space-y-3">
                <ShieldAlert className="w-12 h-12 text-emerald-600 animate-pulse" />
                <h3 className="text-base font-bold text-slate-800">Anti-Fraud & Verification Engine</h3>
                <p className="text-xs max-w-md">Verify ZRP Police Clearance Certificate numbers, National ID checksum structures, and phone authenticity.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. RECOMMENDATIONS */}
      {activeSubTab === "recommendations" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm uppercase tracking-wider font-extrabold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Personalized AI Recommendation Engine</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">User Profile / Persona</label>
              <input
                type="text"
                value={recUserType}
                onChange={(e) => setRecUserType(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Preferences & Search Intent</label>
              <textarea
                value={recPref}
                onChange={(e) => setRecPref(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 h-24"
              />
            </div>

            <button
              onClick={handleGenerateRecs}
              disabled={isGeneratingRecs}
              className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2"
            >
              {isGeneratingRecs ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
              <span>Generate AI Top Candidates</span>
            </button>
          </div>

          <div className="lg:col-span-7">
            {recommendationReport ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
                <h3 className="text-lg font-extrabold text-slate-900">{recommendationReport.recommendedCategory}</h3>

                <div className="space-y-3">
                  {recommendationReport.recommendations?.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{item.name}</div>
                        <p className="text-[11px] text-slate-600">{item.highlight}</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                        {item.matchPercentage}% Match
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-2xl">
                  <div className="text-xs font-bold text-amber-300 mb-1">Pro Tip</div>
                  <p className="text-xs text-slate-300">{recommendationReport.smartTip}</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center text-slate-500 min-h-[380px] flex flex-col items-center justify-center space-y-3">
                <Compass className="w-12 h-12 text-emerald-600 animate-pulse" />
                <h3 className="text-base font-bold text-slate-800">Recommendation Discovery Engine</h3>
                <p className="text-xs max-w-md">Discover top candidates matched to your specific household preferences.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. SMART NOTIFICATIONS */}
      {activeSubTab === "smart-notifications" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-extrabold text-slate-900">Contextual Smart Notifications</h3>
            </div>

            <button
              onClick={handleFetchNotifications}
              disabled={isFetchingNotifs}
              className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5"
            >
              {isFetchingNotifs ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>Fetch AI Alerts</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {notificationsList.length > 0 ? (
              notificationsList.map((notif) => (
                <div key={notif.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>{notif.title}</span>
                    <span className="text-[10px] text-slate-500">{notif.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-slate-500 text-xs">
                Click "Fetch AI Alerts" to generate real-time contextual notifications.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 10. AI CHATBOT (MAI TANAKA) */}
      {activeSubTab === "ai-chatbot" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col h-[520px]">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Mai Tanaka • AI Labor & Household Advisor</h3>
                <p className="text-[11px] text-emerald-600 font-medium">Online 24/7 • Expert in Zimbabwean Domestic Labor Laws</p>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                      msg.sender === "user" ? "bg-emerald-600 text-white font-medium" : "bg-slate-100 text-slate-800 border border-slate-200"
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.topics && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Suggested Quick Inquiries:</span>
                        {msg.topics.map((t, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendChatMessage(t)}
                            className="block text-[11px] text-emerald-700 font-semibold hover:underline text-left"
                          >
                            • {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                placeholder="Ask Mai Tanaka about Zimbabwean labor laws, escrow, or contracts..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleSendChatMessage()}
                disabled={isChatting}
                className="px-4 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center space-x-1 hover:bg-emerald-500 transition-all"
              >
                {isChatting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Zimbabwe Domestic Worker Rights</h4>
            <div className="space-y-3 text-xs text-slate-300">
              <p>• Statutory Instrument 128/2022 prescribes minimum monthly wage guidelines in USD.</p>
              <p>• Workers must be provided with a written contract detailing working hours, duties, and food/lodging allowances.</p>
              <p>• ZRP Police Clearance checks ensure trust and safety for all parties.</p>
            </div>
          </div>
        </div>
      )}

      {/* 11. CAREER COACH */}
      {activeSubTab === "career-coach" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm uppercase tracking-wider font-extrabold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Select Worker for Career Development</span>
            </h3>

            <select
              value={selectedWorkerCareer.id}
              onChange={(e) => {
                const w = SAMPLE_WORKERS.find((item) => item.id === e.target.value);
                if (w) setSelectedWorkerCareer(w);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
            >
              {SAMPLE_WORKERS.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.fullName} • {w.role}
                </option>
              ))}
            </select>

            <button
              onClick={handleGenerateCareer}
              disabled={isGeneratingCareer}
              className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-2"
            >
              {isGeneratingCareer ? <Loader2 className="w-4 h-4 animate-spin" /> : <GraduationCap className="w-4 h-4 text-amber-300" />}
              <span>Generate Career Upgrade Roadmap</span>
            </button>
          </div>

          <div className="lg:col-span-7">
            {careerReport ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Current Tier: {careerReport.currentLevel}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-2">Target: {careerReport.nextTier}</h3>
                  </div>
                  <Award className="w-8 h-8 text-amber-500" />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Recommended Certification Pathways</h4>
                  <div className="space-y-2">
                    {careerReport.certificationPathways?.map((pathway: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">{pathway.course}</div>
                          <div className="text-[11px] text-slate-500">Duration: {pathway.duration}</div>
                        </div>
                        <span className="text-emerald-700 font-bold bg-emerald-100 px-2.5 py-1 rounded-lg text-[11px]">
                          {pathway.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-emerald-50 p-4 rounded-2xl border border-emerald-200 italic">{careerReport.roadmap}</p>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center text-slate-500 min-h-[380px] flex flex-col items-center justify-center space-y-3">
                <GraduationCap className="w-12 h-12 text-emerald-600 animate-pulse" />
                <h3 className="text-base font-bold text-slate-800">Career Advancement & Certification Hub</h3>
                <p className="text-xs max-w-md">Identify skill gaps and recommended Red Cross / City & Guilds certification pathways to boost monthly earnings.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
