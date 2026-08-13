import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Sparkles,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Star,
  Clock,
  DollarSign,
  Briefcase,
  GraduationCap,
  Languages as LanguagesIcon,
  User,
  HeartHandshake,
  Home,
  Database,
  Code2,
  Copy,
  Check,
  Download,
  AlertTriangle,
  RotateCcw,
  Zap,
  Layers,
  FileCode,
  Compass,
  ArrowRight,
  UserCheck,
  CheckSquare,
  Bookmark,
  Share2
} from "lucide-react";
import { WorkerProfile, UserRole, CityLocation } from "../../types/marketplace";
import { SAMPLE_WORKERS } from "../../data/mockData";
import { ALL_ZIMBABWE_CITIES, getSuburbsForCity } from "../../data/zimbabweLocations";

interface EnterpriseSearchEngineProps {
  currency?: "USD" | "ZWG";
}

// Available Options for Search Dimensions
const PROVINCES = [
  "All Provinces",
  "Harare Province",
  "Bulawayo Province",
  "Manicaland",
  "Midlands",
  "Mashonaland East",
  "Mashonaland West",
  "Mashonaland Central",
  "Matabeleland North",
  "Matabeleland South",
  "Masvingo"
];

const DISTRICTS = [
  "All Districts",
  "Harare Urban",
  "Goromonzi",
  "Seke",
  "Epworth",
  "Bulawayo Central",
  "Mutare Urban",
  "Gweru Urban",
  "Kwekwe Urban",
  "Masvingo Urban"
];

const CITIES: string[] = [
  "All Cities",
  ...ALL_ZIMBABWE_CITIES
];

const PROFESSIONS: (UserRole | "All Professions")[] = [
  "All Professions",
  "Domestic worker",
  "Maid",
  "Part-time maid",
  "Nanny",
  "Housekeeper",
  "Caregiver",
  "Gardener",
  "Driver",
  "Chef",
  "Electrician",
  "Plumber",
  "Builder",
  "Carpenter",
  "Cleaner",
  "Nurse aide",
  "Tree cutter",
  "Farm worker",
  "Cook",
  "Satellite dish installer",
  "Fumigation specialist",
  "Painter",
  "Curtain installer",
  "Interior designer",
  "Part-time laundry worker",
  "Sofa & carpet cleaner",
  "Pavement cleaner"
];

const SKILL_OPTIONS = [
  "Deep Cleaning",
  "Childcare",
  "Infant Care",
  "Elderly Care",
  "Cooking",
  "First Aid",
  "Laundry & Ironing",
  "Meal Prep",
  "Solar PV Installation",
  "Inverter Wiring",
  "Defensive Driving Cert",
  "Class 2 License",
  "Borehole Pumps",
  "Lawn Care",
  "Vital Signs"
];

const LANGUAGE_OPTIONS = ["English", "Shona", "Ndebele", "Chewa", "Venda", "Tonga"];

const EDUCATION_LEVELS = [
  "All Education Levels",
  "Primary",
  "O-Level",
  "A-Level",
  "Red Cross Certificate",
  "Early Childhood Diploma",
  "Class 1 Journeyman",
  "Class 2 License",
  "University Degree"
];

const AVAILABILITY_OPTIONS = [
  "All Modes",
  "Full-Time",
  "Part-Time",
  "Live-In",
  "Contract",
  "Emergency On-Call"
];

export const EnterpriseSearchEngine: React.FC<EnterpriseSearchEngineProps> = () => {
  const [workersList] = useState<WorkerProfile[]>(SAMPLE_WORKERS);

  // 17 FILTER STATES
  const [textQuery, setTextQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("All Provinces"); // 1. Province
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts"); // 2. District
  const [selectedCity, setSelectedCity] = useState<string>("All Cities"); // 3. City
  const [selectedSuburb, setSelectedSuburb] = useState<string>("All Suburbs"); // Suburb
  const [selectedProfession, setSelectedProfession] = useState<string>("All Professions"); // 4. Profession
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]); // 5. Skills
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]); // 6. Languages
  const [salaryRangeUSD, setSalaryRangeUSD] = useState<number>(600); // 7. Salary (Max)
  const [minExperience, setMinExperience] = useState<number>(0); // 8. Experience
  const [selectedAvailability, setSelectedAvailability] = useState("All Modes"); // 9. Availability
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false); // 10. Verified
  const [minRating, setMinRating] = useState<number>(0); // 11. Rating
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(30); // 12. Distance
  const [selectedEducation, setSelectedEducation] = useState("All Education Levels"); // 13. Education
  const [minAge, setMinAge] = useState<number>(18); // 14. Age Min
  const [maxAge, setMaxAge] = useState<number>(60); // 14. Age Max
  const [selectedGender, setSelectedGender] = useState<string>("All"); // 15. Gender
  const [requireLiveIn, setRequireLiveIn] = useState<boolean>(false); // 16. Live In
  const [requireLiveOut, setRequireLiveOut] = useState<boolean>(false); // 17. Live Out

  // View mode tab: "search" vs "firestore-indexing"
  const [activeEngineTab, setActiveEngineTab] = useState<"search" | "firestore-indexing">("search");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Toggle skill selection
  const handleToggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  // Toggle language selection
  const handleToggleLanguage = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  // Reset all 17 filters
  const handleResetFilters = () => {
    setTextQuery("");
    setSelectedProvince("All Provinces");
    setSelectedDistrict("All Districts");
    setSelectedCity("All Cities");
    setSelectedSuburb("All Suburbs");
    setSelectedProfession("All Professions");
    setSelectedSkills([]);
    setSelectedLanguages([]);
    setSalaryRangeUSD(600);
    setMinExperience(0);
    setSelectedAvailability("All Modes");
    setVerifiedOnly(false);
    setMinRating(0);
    setMaxDistanceKm(30);
    setSelectedEducation("All Education Levels");
    setMinAge(18);
    setMaxAge(60);
    setSelectedGender("All");
    setRequireLiveIn(false);
    setRequireLiveOut(false);
  };

  // Active filter counter
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (textQuery) count++;
    if (selectedProvince !== "All Provinces") count++;
    if (selectedDistrict !== "All Districts") count++;
    if (selectedCity !== "All Cities") count++;
    if (selectedProfession !== "All Professions") count++;
    if (selectedSkills.length > 0) count += selectedSkills.length;
    if (selectedLanguages.length > 0) count += selectedLanguages.length;
    if (salaryRangeUSD < 600) count++;
    if (minExperience > 0) count++;
    if (selectedAvailability !== "All Modes") count++;
    if (verifiedOnly) count++;
    if (minRating > 0) count++;
    if (maxDistanceKm < 30) count++;
    if (selectedEducation !== "All Education Levels") count++;
    if (minAge > 18 || maxAge < 60) count++;
    if (selectedGender !== "All") count++;
    if (requireLiveIn) count++;
    if (requireLiveOut) count++;
    return count;
  }, [
    textQuery,
    selectedProvince,
    selectedDistrict,
    selectedCity,
    selectedProfession,
    selectedSkills,
    selectedLanguages,
    salaryRangeUSD,
    minExperience,
    selectedAvailability,
    verifiedOnly,
    minRating,
    maxDistanceKm,
    selectedEducation,
    minAge,
    maxAge,
    selectedGender,
    requireLiveIn,
    requireLiveOut,
  ]);

  // Execute Search Filtering across all 17 dimensions
  const filteredWorkers = useMemo(() => {
    return workersList.filter(worker => {
      // 1. Province
      if (selectedProvince !== "All Provinces" && worker.province !== selectedProvince) return false;

      // 2. District
      if (selectedDistrict !== "All Districts" && worker.district !== selectedDistrict) return false;

      // 3. City
      if (selectedCity !== "All Cities" && worker.city !== selectedCity) return false;

      // Suburb
      if (selectedSuburb !== "All Suburbs" && worker.suburb.toLowerCase() !== selectedSuburb.toLowerCase()) return false;

      // 4. Profession
      if (selectedProfession !== "All Professions" && worker.role !== selectedProfession) return false;

      // 5. Skills (Must match all selected skills)
      if (selectedSkills.length > 0) {
        const hasAllSkills = selectedSkills.every(sk =>
          worker.skills.some(ws => ws.toLowerCase().includes(sk.toLowerCase()))
        );
        if (!hasAllSkills) return false;
      }

      // 6. Languages (Must match at least one selected language)
      if (selectedLanguages.length > 0) {
        const hasLang = selectedLanguages.some(l => worker.languages.includes(l));
        if (!hasLang) return false;
      }

      // 7. Salary
      if (worker.monthlyRateUSD > salaryRangeUSD) return false;

      // 8. Experience
      if (worker.experienceYears < minExperience) return false;

      // 9. Availability
      if (selectedAvailability !== "All Modes" && worker.availability !== selectedAvailability) return false;

      // 10. Verified
      if (verifiedOnly && !worker.isVerified) return false;

      // 11. Rating
      if (worker.rating < minRating) return false;

      // 12. Distance
      if (worker.distanceKm > maxDistanceKm) return false;

      // 13. Education
      if (selectedEducation !== "All Education Levels" && worker.education !== selectedEducation) return false;

      // 14. Age
      if (worker.age < minAge || worker.age > maxAge) return false;

      // 15. Gender
      if (selectedGender !== "All" && worker.gender !== selectedGender) return false;

      // 16. Live In
      if (requireLiveIn && !worker.willingToLiveIn) return false;

      // 17. Live Out
      if (requireLiveOut && !worker.willingToLiveOut) return false;

      // Text Query Search
      if (textQuery) {
        const q = textQuery.toLowerCase();
        const match =
          worker.fullName.toLowerCase().includes(q) ||
          worker.bio.toLowerCase().includes(q) ||
          worker.suburb.toLowerCase().includes(q) ||
          worker.role.toLowerCase().includes(q) ||
          worker.skills.some(s => s.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [
    workersList,
    textQuery,
    selectedProvince,
    selectedDistrict,
    selectedCity,
    selectedProfession,
    selectedSkills,
    selectedLanguages,
    salaryRangeUSD,
    minExperience,
    selectedAvailability,
    verifiedOnly,
    minRating,
    maxDistanceKm,
    selectedEducation,
    minAge,
    maxAge,
    selectedGender,
    requireLiveIn,
    requireLiveOut,
  ]);

  // Generate Firestore Composite Indexes JSON
  const generatedFirestoreIndexesJSON = useMemo(() => {
    const fieldsToInclude: { fieldPath: string; order: "ASCENDING" | "DESCENDING" }[] = [];

    // Equality filters first
    if (selectedProvince !== "All Provinces") fieldsToInclude.push({ fieldPath: "province", order: "ASCENDING" });
    if (selectedDistrict !== "All Districts") fieldsToInclude.push({ fieldPath: "district", order: "ASCENDING" });
    if (selectedCity !== "All Cities") fieldsToInclude.push({ fieldPath: "city", order: "ASCENDING" });
    if (selectedProfession !== "All Professions") fieldsToInclude.push({ fieldPath: "role", order: "ASCENDING" });
    if (verifiedOnly) fieldsToInclude.push({ fieldPath: "isVerified", order: "ASCENDING" });
    if (selectedGender !== "All") fieldsToInclude.push({ fieldPath: "gender", order: "ASCENDING" });
    if (requireLiveIn) fieldsToInclude.push({ fieldPath: "willingToLiveIn", order: "ASCENDING" });
    if (requireLiveOut) fieldsToInclude.push({ fieldPath: "willingToLiveOut", order: "ASCENDING" });
    if (selectedAvailability !== "All Modes") fieldsToInclude.push({ fieldPath: "availability", order: "ASCENDING" });
    if (selectedEducation !== "All Education Levels") fieldsToInclude.push({ fieldPath: "education", order: "ASCENDING" });

    // Inequality / Range fields second
    fieldsToInclude.push({ fieldPath: "monthlyRateUSD", order: "ASCENDING" });
    fieldsToInclude.push({ fieldPath: "experienceYears", order: "DESCENDING" });
    fieldsToInclude.push({ fieldPath: "rating", order: "DESCENDING" });
    fieldsToInclude.push({ fieldPath: "age", order: "ASCENDING" });

    const indexConfig = {
      indexes: [
        {
          collectionGroup: "workers",
          queryScope: "COLLECTION",
          fields: fieldsToInclude,
        },
        {
          collectionGroup: "workers",
          queryScope: "COLLECTION",
          fields: [
            { fieldPath: "city", order: "ASCENDING" },
            { fieldPath: "role", order: "ASCENDING" },
            { fieldPath: "isVerified", order: "ASCENDING" },
            { fieldPath: "monthlyRateUSD", order: "ASCENDING" },
          ],
        },
      ],
      fieldOverrides: [],
    };

    return JSON.stringify(indexConfig, null, 2);
  }, [
    selectedProvince,
    selectedDistrict,
    selectedCity,
    selectedProfession,
    verifiedOnly,
    selectedGender,
    requireLiveIn,
    requireLiveOut,
    selectedAvailability,
    selectedEducation,
  ]);

  // Generate Production Firebase Query Code (TypeScript)
  const generatedFirestoreSDKCode = useMemo(() => {
    let code = `import { collection, query, where, orderBy, getDocs } from "firebase/firestore";\nimport { db } from "../lib/firebase";\n\nasync function searchWorkers() {\n  const workersRef = collection(db, "workers");\n  const queryConstraints = [];\n\n`;

    // 1-4 Location & Role Equality
    if (selectedProvince !== "All Provinces") code += `  queryConstraints.push(where("province", "==", "${selectedProvince}"));\n`;
    if (selectedDistrict !== "All Districts") code += `  queryConstraints.push(where("district", "==", "${selectedDistrict}"));\n`;
    if (selectedCity !== "All Cities") code += `  queryConstraints.push(where("city", "==", "${selectedCity}"));\n`;
    if (selectedProfession !== "All Professions") code += `  queryConstraints.push(where("role", "==", "${selectedProfession}"));\n`;

    // 5. Skills (array-contains)
    if (selectedSkills.length > 0) {
      code += `  queryConstraints.push(where("skills", "array-contains", "${selectedSkills[0]}"));\n`;
    }

    // 6. Languages
    if (selectedLanguages.length > 0) {
      code += `  queryConstraints.push(where("languages", "array-contains-any", ${JSON.stringify(selectedLanguages)}));\n`;
    }

    // 7. Salary
    if (salaryRangeUSD < 600) {
      code += `  queryConstraints.push(where("monthlyRateUSD", "<=", ${salaryRangeUSD}));\n`;
    }

    // 8. Experience
    if (minExperience > 0) {
      code += `  queryConstraints.push(where("experienceYears", ">=", ${minExperience}));\n`;
    }

    // 9. Availability
    if (selectedAvailability !== "All Modes") {
      code += `  queryConstraints.push(where("availability", "==", "${selectedAvailability}"));\n`;
    }

    // 10. Verified
    if (verifiedOnly) {
      code += `  queryConstraints.push(where("isVerified", "==", true));\n`;
    }

    // 11. Rating
    if (minRating > 0) {
      code += `  queryConstraints.push(where("rating", ">=", ${minRating}));\n`;
    }

    // 13. Education
    if (selectedEducation !== "All Education Levels") {
      code += `  queryConstraints.push(where("education", "==", "${selectedEducation}"));\n`;
    }

    // 14. Age
    if (minAge > 18 || maxAge < 60) {
      code += `  queryConstraints.push(where("age", ">=", ${minAge}));\n  queryConstraints.push(where("age", "<=", ${maxAge}));\n`;
    }

    // 15. Gender
    if (selectedGender !== "All") {
      code += `  queryConstraints.push(where("gender", "==", "${selectedGender}"));\n`;
    }

    // 16. Live In
    if (requireLiveIn) {
      code += `  queryConstraints.push(where("willingToLiveIn", "==", true));\n`;
    }

    // 17. Live Out
    if (requireLiveOut) {
      code += `  queryConstraints.push(where("willingToLiveOut", "==", true));\n`;
    }

    code += `\n  // Ordering & Query Execution\n  queryConstraints.push(orderBy("monthlyRateUSD", "asc"));\n  const q = query(workersRef, ...queryConstraints);\n  const snapshot = await getDocs(q);\n  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));\n}`;

    return code;
  }, [
    selectedProvince,
    selectedDistrict,
    selectedCity,
    selectedProfession,
    selectedSkills,
    selectedLanguages,
    salaryRangeUSD,
    minExperience,
    selectedAvailability,
    verifiedOnly,
    minRating,
    selectedEducation,
    minAge,
    maxAge,
    selectedGender,
    requireLiveIn,
    requireLiveOut,
  ]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleDownloadIndexesJSON = () => {
    const blob = new Blob([generatedFirestoreIndexesJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "firestore.indexes.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 border border-teal-800/60 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                <Search className="w-6 h-6" />
              </span>
              <h1 className="text-2xl font-black tracking-tight text-white">Enterprise Search & Firestore Index Engine</h1>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl">
              High-performance candidate discovery across all <strong>17 structural dimensions</strong> (Province, District, City, Profession, Skills, Languages, Salary, Experience, Availability, Verified, Rating, Distance, Education, Age, Gender, Live In, Live Out) coupled with real-time <strong>Firestore Indexing Recommendations</strong>.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setActiveEngineTab("search")}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 shadow-lg ${
                activeEngineTab === "search"
                  ? "bg-emerald-500 text-slate-950 shadow-emerald-500/20"
                  : "bg-slate-800/90 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Interactive Search ({filteredWorkers.length})</span>
            </button>

            <button
              onClick={() => setActiveEngineTab("firestore-indexing")}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 shadow-lg ${
                activeEngineTab === "firestore-indexing"
                  ? "bg-amber-400 text-slate-950 shadow-amber-400/20"
                  : "bg-slate-800/90 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Database className="w-4 h-4 text-amber-900" />
              <span>Firestore Index Advisor</span>
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH ENGINE TAB */}
      {activeEngineTab === "search" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* SIDEBAR: 17 FILTER PANELS */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-5 h-fit">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <h2 className="font-extrabold text-slate-900 text-sm">Filter Matrix ({activeFilterCount})</h2>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            <div className="space-y-4 text-xs max-h-[800px] overflow-y-auto pr-1">
              {/* Text Search Input */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Keywords / Bio Search</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search name, bio, skills..."
                    value={textQuery}
                    onChange={e => setTextQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* 1. Province */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">1. Province</label>
                <select
                  value={selectedProvince}
                  onChange={e => setSelectedProvince(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {PROVINCES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* 2. District */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">2. District</label>
                <select
                  value={selectedDistrict}
                  onChange={e => setSelectedDistrict(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* 3. City */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">3. City / Town</label>
                <select
                  value={selectedCity}
                  onChange={e => {
                    setSelectedCity(e.target.value);
                    setSelectedSuburb("All Suburbs");
                  }}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Suburb Selector */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Major Suburb / Neighborhood</label>
                <select
                  value={selectedSuburb}
                  onChange={e => setSelectedSuburb(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {getSuburbsForCity(selectedCity === "All Cities" ? "Harare" : selectedCity).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* 4. Profession */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">4. Profession / Role</label>
                <select
                  value={selectedProfession}
                  onChange={e => setSelectedProfession(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {PROFESSIONS.map(pr => (
                    <option key={pr} value={pr}>{pr}</option>
                  ))}
                </select>
              </div>

              {/* 5. Skills Chips */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">5. Skills Tag Selection</label>
                <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                  {SKILL_OPTIONS.map(sk => {
                    const active = selectedSkills.includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => handleToggleSkill(sk)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                          active
                            ? "bg-emerald-800 text-white"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {sk}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Languages */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">6. Spoken Languages</label>
                <div className="flex flex-wrap gap-1 p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                  {LANGUAGE_OPTIONS.map(lang => {
                    const active = selectedLanguages.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => handleToggleLanguage(lang)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                          active
                            ? "bg-teal-700 text-white"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 7. Salary Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-800">7. Max Monthly Salary</label>
                  <span className="font-mono font-bold text-emerald-800">${salaryRangeUSD} USD</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="800"
                  step="25"
                  value={salaryRangeUSD}
                  onChange={e => setSalaryRangeUSD(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* 8. Experience */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-800">8. Min Experience Years</label>
                  <span className="font-mono font-bold text-emerald-800">{minExperience}+ Yrs</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={minExperience}
                  onChange={e => setMinExperience(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* 9. Availability */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">9. Availability Mode</label>
                <select
                  value={selectedAvailability}
                  onChange={e => setSelectedAvailability(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {AVAILABILITY_OPTIONS.map(av => (
                    <option key={av} value={av}>{av}</option>
                  ))}
                </select>
              </div>

              {/* 10. Verified Toggle */}
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>10. Fully Verified Only</span>
                </span>
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={e => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* 11. Rating Filter */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">11. Minimum Rating</label>
                <select
                  value={minRating}
                  onChange={e => setMinRating(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value={0}>Any Rating (1.0 - 5.0)</option>
                  <option value={4.0}>4.0★ and above</option>
                  <option value={4.5}>4.5★ and above</option>
                  <option value={4.8}>4.8★ and above</option>
                  <option value={5.0}>5.0★ Perfect Rating</option>
                </select>
              </div>

              {/* 12. Distance Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-800">12. Max Radius Distance</label>
                  <span className="font-mono font-bold text-emerald-800">{maxDistanceKm} KM</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  step="2"
                  value={maxDistanceKm}
                  onChange={e => setMaxDistanceKm(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* 13. Education */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">13. Education Standard</label>
                <select
                  value={selectedEducation}
                  onChange={e => setSelectedEducation(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {EDUCATION_LEVELS.map(ed => (
                    <option key={ed} value={ed}>{ed}</option>
                  ))}
                </select>
              </div>

              {/* 14. Age Range */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">14. Age Range ({minAge} - {maxAge} Yrs)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="18"
                    max="60"
                    value={minAge}
                    onChange={e => setMinAge(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px]"
                    placeholder="Min Age"
                  />
                  <input
                    type="number"
                    min="18"
                    max="65"
                    value={maxAge}
                    onChange={e => setMaxAge(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px]"
                    placeholder="Max Age"
                  />
                </div>
              </div>

              {/* 15. Gender */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">15. Candidate Gender</label>
                <div className="flex items-center space-x-2">
                  {["All", "Female", "Male"].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setSelectedGender(g)}
                      className={`flex-1 py-1 rounded-lg font-bold text-[11px] border transition-all ${
                        selectedGender === g
                          ? "bg-emerald-800 text-white border-emerald-800"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* 16. Live In Toggle */}
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-emerald-600" />
                  <span>16. Willing to Live-In</span>
                </span>
                <input
                  type="checkbox"
                  checked={requireLiveIn}
                  onChange={e => setRequireLiveIn(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* 17. Live Out Toggle */}
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>17. Willing to Live-Out</span>
                </span>
                <input
                  type="checkbox"
                  checked={requireLiveOut}
                  onChange={e => setRequireLiveOut(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* MAIN RESULTS GRID */}
          <div className="lg:col-span-3 space-y-4">
            {/* Search Meta Bar */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-600">
                <span>Matching Candidates: <strong className="text-slate-900 font-extrabold text-sm">{filteredWorkers.length}</strong></span>
                <span>•</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Indexed Query Speed: ~12ms
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Sort By:</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                  AI Match Score & Rating
                </span>
              </div>
            </div>

            {/* Candidate Cards Grid */}
            {filteredWorkers.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">No worker profiles match all 17 active criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try relaxing your salary ceiling, expanding radius distance, or resetting tag filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredWorkers.map(worker => (
                  <div
                    key={worker.id}
                    className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Top Bar */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={worker.avatarUrl}
                            alt={worker.fullName}
                            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                          />
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <h3 className="font-black text-slate-900 text-base">{worker.fullName}</h3>
                              {worker.isVerified && (
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Verified Worker" />
                              )}
                            </div>
                            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">{worker.role}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-base font-black text-emerald-900 font-mono">${worker.monthlyRateUSD} <span className="text-[10px] text-slate-500 font-normal">USD/mo</span></div>
                          <div className="text-[10px] text-slate-500 font-semibold">${worker.hourlyRateUSD}/hr</div>
                        </div>
                      </div>

                      {/* Location & Key Stats */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{worker.suburb}, {worker.city} ({worker.distanceKm} km)</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                          <span>{worker.rating}★ ({worker.reviewCount} reviews)</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{worker.education}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{worker.age} Yrs • {worker.gender}</span>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{worker.bio}</p>

                      {/* Skills Chips */}
                      <div className="flex flex-wrap gap-1">
                        {worker.skills.map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-medium rounded-md">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        {worker.willingToLiveIn && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-extrabold rounded">Live-In</span>
                        )}
                        {worker.willingToLiveOut && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">Live-Out</span>
                        )}
                      </div>

                      <button
                        onClick={() => alert(`Initiating direct Escrow booking process with ${worker.fullName}`)}
                        className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                      >
                        Book Candidate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FIRESTORE INDEXING ADVISOR TAB */}
      {activeEngineTab === "firestore-indexing" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Database className="w-6 h-6 text-emerald-600" />
                <span>Firestore Composite Indexing Recommendations</span>
              </h2>
              <button
                onClick={handleDownloadIndexesJSON}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download firestore.indexes.json</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Firestore requires <strong>Composite Indexes</strong> when querying multiple fields simultaneously or combining equality operators (<code>==</code>) with inequality range filters (<code>&lt;=</code>, <code>&gt;=</code>, <code>orderBy</code>, <code>array-contains</code>). The configuration below is dynamically updated based on your selected 17 search filters.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* INDEX JSON CONFIG BOX */}
            <div className="bg-slate-950 text-slate-100 rounded-3xl p-5 border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-xs font-bold text-amber-300">firestore.indexes.json</span>
                </div>
                <button
                  onClick={() => copyToClipboard(generatedFirestoreIndexesJSON, "json")}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-all flex items-center space-x-1"
                >
                  {copiedCode === "json" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === "json" ? "Copied!" : "Copy JSON"}</span>
                </button>
              </div>

              <pre className="font-mono text-[11px] leading-relaxed text-emerald-300 bg-slate-900 p-4 rounded-2xl overflow-x-auto max-h-96 border border-slate-800">
                {generatedFirestoreIndexesJSON}
              </pre>
            </div>

            {/* FIREBASE SDK TYPESCRIPT QUERY CODE BOX */}
            <div className="bg-slate-950 text-slate-100 rounded-3xl p-5 border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-xs font-bold text-emerald-300">searchWorkers.ts (Firebase SDK)</span>
                </div>
                <button
                  onClick={() => copyToClipboard(generatedFirestoreSDKCode, "ts")}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-all flex items-center space-x-1"
                >
                  {copiedCode === "ts" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === "ts" ? "Copied!" : "Copy Code"}</span>
                </button>
              </div>

              <pre className="font-mono text-[11px] leading-relaxed text-slate-200 bg-slate-900 p-4 rounded-2xl overflow-x-auto max-h-96 border border-slate-800">
                {generatedFirestoreSDKCode}
              </pre>
            </div>
          </div>

          {/* FIRESTORE ARCHITECTURE BEST PRACTICES CARD */}
          <div className="bg-gradient-to-r from-slate-900 to-teal-950 text-white rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="font-extrabold text-base flex items-center gap-2 text-amber-300">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Enterprise Firestore Search Indexing Rules & Constraints</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1.5">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Equality-First Clause Order</span>
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  In composite index definitions, equality filters (<code>province</code>, <code>city</code>, <code>role</code>, <code>isVerified</code>) must strictly precede range or inequality filters (<code>monthlyRateUSD</code>, <code>rating</code>) to minimize scanned index keys.
                </p>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1.5">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Single Array-Contains Limit</span>
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  Firestore limits a single query to at most one <code>array-contains</code> clause. Multi-skill filtering evaluates the primary skill server-side and applies secondary skill matching client-side.
                </p>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1.5">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>GeoHash Distance Radius</span>
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  For radius distance filtering (e.g. &lt; 10km from Borrowdale), store Geohash pairs (<code>geohash</code>) and run bounding box queries using GeoFirestore algorithms for millisecond response times.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
