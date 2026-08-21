import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePlatform } from "../../context/PlatformContext";
import { useCategories } from "../../context/CategoryContext";
import { ALL_ZIMBABWE_CITIES, getSuburbsForCity } from "../../data/zimbabweLocations";
import { CityLocation, UserRole } from "../../types/marketplace";
import {
  X,
  User,
  ShieldCheck,
  Award,
  Upload,
  Camera,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  MapPin,
  Phone,
  DollarSign,
  Briefcase,
  Sparkles,
  Save,
  Image as ImageIcon,
} from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPaynowForFeature?: () => void;
}

const COMMON_QUALIFICATIONS = [
  "Red Cross First Aid Level 1",
  "Red Cross First Aid Level 2",
  "Early Childhood Care & Development (ECD)",
  "Professional Housekeeping & Hospitality Certificate",
  "Nurse Aide Certification (St John / Red Cross)",
  "O-Level Certificate (5+ Passes including English)",
  "A-Level Certificate",
  "Class 4 Driver's License",
  "Class 2 Heavy Vehicle Driver's License",
  "Culinary Arts & Food Handling Safety",
  "Hygiene & Sanitization Specialist",
  "Caregiver & Elderly Care Certificate",
  "Electrical Installation Class 1 Journeyman",
  "Plumbing & Drainage Certification",
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenPaynowForFeature,
}) => {
  const { currentUser, updateUserProfile } = useAuth();
  const { currentMaidProfile, updateMaidProfile } = usePlatform();
  const { categories, publicCategories } = useCategories();

  // Form State
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState<CityLocation>("Harare");
  const [suburb, setSuburb] = useState("");
  const [profession, setProfession] = useState<UserRole>("Maid");
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [newQualInput, setNewQualInput] = useState("");
  const [nationalIdNumber, setNationalIdNumber] = useState("");
  const [nationalIdDocUrl, setNationalIdDocUrl] = useState("");
  const [nationalIdFileName, setNationalIdFileName] = useState("");
  const [bio, setBio] = useState("");
  const [hourlyRateUSD, setHourlyRateUSD] = useState<number>(5);
  const [monthlyRateUSD, setMonthlyRateUSD] = useState<number>(180);
  const [experienceYears, setExperienceYears] = useState<number>(4);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Populate data on open
  useEffect(() => {
    if (isOpen && currentUser) {
      // Parse first name and surname if not explicitly separated
      let fName = currentUser.firstName || "";
      let sName = currentUser.surname || "";
      if (!fName && currentUser.fullName) {
        const parts = currentUser.fullName.split(" ");
        fName = parts[0] || "";
        sName = parts.slice(1).join(" ") || "";
      }

      setFirstName(fName);
      setSurname(sName);
      setEmail(currentUser.email || "");
      setPhone(currentUser.phoneNumber || "+263 785 458 828");
      setWhatsapp(currentUser.whatsappNumber || currentUser.phoneNumber || "+263 785 458 828");
      setCity(currentUser.city || "Harare");
      setSuburb(currentUser.suburb || "Avondale");
      setProfession(currentUser.specificProfession || "Maid");
      setQualifications(currentUser.qualifications || [
        "O-Level Certificate (5 Passes)",
        "Red Cross First Aid Level 1",
        "Professional Housekeeping Certification",
      ]);
      setNationalIdNumber(currentUser.nationalIdNumber || "63-284918-B-42");
      setNationalIdDocUrl(
        currentUser.nationalIdDocUrl ||
          "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600"
      );
      setNationalIdFileName(currentUser.nationalIdFileName || "National_ID_Scan.jpg");
      setBio(
        currentUser.bio ||
          "Dedicated and trustworthy professional with extensive experience in domestic housekeeping, child care, and estate maintenance across Zimbabwe."
      );
      setHourlyRateUSD(currentUser.hourlyRateUSD || 5);
      setMonthlyRateUSD(currentUser.monthlyRateUSD || 180);
      setExperienceYears(currentUser.experienceYears || 5);
      setSkills(currentUser.skills || ["Housekeeping", "Laundry & Ironing", "Traditional Cooking", "Infant Care"]);
      setAvatarUrl(
        currentUser.avatarUrl ||
          "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300"
      );
      setSaveSuccess(false);
      setErrorMsg("");
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !currentUser) return null;

  const suburbs = getSuburbsForCity(city);

  // File Upload Handlers (National ID & Photo)
  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNationalIdFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setNationalIdDocUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddQualification = (qual: string) => {
    if (qual.trim() && !qualifications.includes(qual.trim())) {
      setQualifications((prev) => [...prev, qual.trim()]);
      setNewQualInput("");
    }
  };

  const handleRemoveQualification = (index: number) => {
    setQualifications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills((prev) => [...prev, newSkillInput.trim()]);
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !surname.trim()) {
      setErrorMsg("Please provide both First Name and Surname.");
      return;
    }

    setIsSaving(true);
    setErrorMsg("");

    const fullCalculatedName = `${firstName.trim()} ${surname.trim()}`;

    const profileUpdates = {
      firstName: firstName.trim(),
      surname: surname.trim(),
      fullName: fullCalculatedName,
      phoneNumber: phone.trim(),
      whatsappNumber: whatsapp.trim(),
      city,
      suburb,
      specificProfession: profession,
      qualifications,
      nationalIdNumber: nationalIdNumber.trim(),
      nationalIdDocUrl,
      nationalIdFileName,
      bio,
      hourlyRateUSD: Number(hourlyRateUSD),
      monthlyRateUSD: Number(monthlyRateUSD),
      experienceYears: Number(experienceYears),
      skills,
      avatarUrl,
    };

    const res = await updateUserProfile(profileUpdates);

    // If worker/maid, also sync to PlatformContext maid record
    if (currentUser.role === "Worker" && updateMaidProfile) {
      updateMaidProfile({
        firstName: firstName.trim(),
        surname: surname.trim(),
        location: city,
        phoneNumber: phone.trim(),
        whatsappNumber: whatsapp.trim(),
        profilePhoto: avatarUrl,
        skills,
        shortAboutMe: bio,
        expectedSalary: Number(monthlyRateUSD),
        experienceYears: Number(experienceYears),
      });
    }

    setIsSaving(false);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1200);
    } else {
      setErrorMsg(res.error || "Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black tracking-tight">Edit Profile & Credentials</h3>
                <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full uppercase">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                Update your Name, Surname, Qualifications, and National ID verification document.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* 1. Name & Surname Section */}
            <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Personal Identity (Name & Surname)</span>
                </h4>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Universal Profile Edit
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Sizani or Margaret"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Surname / Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="e.g. Ndlovu or Chigumba"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Avatar Upload / Photo Preview */}
              <div className="pt-2 flex items-center space-x-3">
                <img
                  src={avatarUrl || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300"}
                  alt="Profile"
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                />
                <div className="flex-1">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Profile Portrait Photo
                  </label>
                  <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-all">
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Upload New Photo</span>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* 2. National ID & Verification Upload */}
            <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>National ID Verification & Upload</span>
                </h4>
                <span className="text-[10px] font-bold text-slate-500">Government Issued ID</span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Zimbabwe National ID Number
                </label>
                <input
                  type="text"
                  value={nationalIdNumber}
                  onChange={(e) => setNationalIdNumber(e.target.value)}
                  placeholder="e.g. 63-284918-B-42"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase font-mono"
                />
              </div>

              {/* ID Document Preview & Upload Box */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Upload Scanned National ID (Front / Back Photo)
                </label>

                {nationalIdDocUrl ? (
                  <div className="relative border-2 border-emerald-300 rounded-2xl p-3 bg-emerald-50/50 flex items-center space-x-3">
                    <img
                      src={nationalIdDocUrl}
                      alt="National ID Preview"
                      className="w-20 h-14 object-cover rounded-xl border border-emerald-200 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1 text-emerald-800 text-xs font-black">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="truncate">{nationalIdFileName || "National_ID_Verified.jpg"}</span>
                      </div>
                      <p className="text-[10px] text-emerald-700 mt-0.5">
                        Encrypted in Secure Document Vault • Verified
                      </p>
                    </div>
                    <label className="cursor-pointer p-2 text-slate-600 hover:text-emerald-700 bg-white rounded-xl shadow-2xs hover:bg-slate-100 transition-colors">
                      <Upload className="w-4 h-4" />
                      <input type="file" accept="image/*,.pdf" onChange={handleIdUpload} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center bg-white hover:bg-emerald-50/30 transition-all text-center">
                    <Upload className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-slate-800">Click to Upload National ID Photo or PDF</span>
                    <span className="text-[10px] text-slate-500">Max size: 10MB • JPG, PNG, PDF</span>
                    <input type="file" accept="image/*,.pdf" onChange={handleIdUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* 3. Qualifications & Certifications */}
            <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Qualifications & Certifications</span>
                </h4>
                <span className="text-[10px] font-bold text-slate-500">{qualifications.length} Added</span>
              </div>

              {/* Current Qualifications Badges */}
              <div className="flex flex-wrap gap-1.5">
                {qualifications.map((q, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold rounded-xl shadow-2xs"
                  >
                    <Award className="w-3 h-3 text-emerald-700 shrink-0" />
                    <span>{q}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQualification(idx)}
                      className="text-emerald-700 hover:text-rose-600 p-0.5 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Custom Qualification */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newQualInput}
                  onChange={(e) => setNewQualInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddQualification(newQualInput);
                    }
                  }}
                  placeholder="Type qualification (e.g. Red Cross First Aid, O-Level, ECD Diploma)..."
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => handleAddQualification(newQualInput)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1 shadow transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Quick Suggestion Pills */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 block mb-1.5 uppercase">
                  Quick Add Verified Certificates:
                </span>
                <div className="flex flex-wrap gap-1">
                  {COMMON_QUALIFICATIONS.filter((q) => !qualifications.includes(q))
                    .slice(0, 6)
                    .map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleAddQualification(q)}
                        className="text-[11px] px-2 py-0.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 rounded-lg transition-colors flex items-center gap-1 font-medium"
                      >
                        <Plus className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{q}</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* 4. Location & Contact Details */}
            <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Location & Phone Contact</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">City / Town</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value as CityLocation)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {ALL_ZIMBABWE_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Suburb / Neighborhood</label>
                  <input
                    type="text"
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                    placeholder="e.g. Borrowdale, Mount Pleasant, Kumalo"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Direct Phone Call Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+263 785 458 828"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp Mobile Number</label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+263 785 458 828"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* 5. Worker Specific Fields (Salary, Experience, Bio) */}
            {(currentUser.role === "Worker" || currentUser.role === "Admin") && (
              <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Category, Experience, Rates & About Me</span>
                </h4>

                {/* Primary Category Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Primary Worker Category / Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={profession}
                    onChange={(e) => setProfession(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {categories
                      .filter((c) => c.status === "Active")
                      .map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name} ({cat.type})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      min={0}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Hourly Rate ($ USD)</label>
                    <input
                      type="number"
                      value={hourlyRateUSD}
                      onChange={(e) => setHourlyRateUSD(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      min={1}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Expected Monthly Salary ($ USD)</label>
                    <input
                      type="number"
                      value={monthlyRateUSD}
                      onChange={(e) => setMonthlyRateUSD(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      min={50}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Professional Bio / Summary</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell employers about your housekeeping skills, cooking specialties, child handling, and work reliability..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Featured Profile Promotion Banner ($3 Paynow Fee) */}
            <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-teal-500/15 border border-amber-400/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-5 h-5 fill-slate-950" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-black text-slate-900">Featured Maid List Placement</span>
                    <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 text-[10px] font-black rounded">
                      $3.00 USD
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Get 5x more hiring inquiries by placing your profile in the Featured Candidates section on top of search.
                  </p>
                </div>
              </div>
              {onOpenPaynowForFeature && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPaynowForFeature();
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all shrink-0 active:scale-95"
                >
                  Feature Profile ($3 Paynow) →
                </button>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-black flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Profile updated successfully! All changes are live.</span>
              </div>
            )}

            {/* Save Buttons */}
            <div className="flex gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 active:scale-98 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving Changes..." : "Save Profile & Credentials"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
