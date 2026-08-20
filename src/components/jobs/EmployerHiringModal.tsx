import React, { useState } from "react";
import {
  X,
  Building,
  MapPin,
  Home,
  User,
  Phone,
  Calendar,
  DollarSign,
  Heart,
  Baby,
  Users,
  BedDouble,
  Dog,
  Sparkles,
  CheckCircle2,
  Share2,
  Copy,
  Clock,
  ShieldCheck,
  Send,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import {
  CityLocation,
  HelperType,
  PrimaryFocusRole,
  EmployerHiringRequest,
  JobPosting
} from "../../types/marketplace";
import { ALL_ZIMBABWE_CITIES, getSuburbsForCity } from "../../data/zimbabweLocations";
import { formatEmployerHiringRequestToWhatsApp } from "../../utils/whatsappTemplates";
import { usePlatform } from "../../context/PlatformContext";

interface EmployerHiringModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (request: EmployerHiringRequest) => void;
  initialCity?: CityLocation;
  currency?: "USD" | "ZWG";
}

const PRIMARY_FOCUS_OPTIONS: {
  role: PrimaryFocusRole;
  label: string;
  icon: string;
  desc: string;
}[] = [
  { role: "Housekeeping", label: "Housekeeping", icon: "🧹", desc: "General cleaning, laundry, ironing & home upkeep" },
  { role: "Nanny", label: "Nanny & Childcare", icon: "👶", desc: "Infant care, school runs, feeding & child stimulation" },
  { role: "Elderly Care", label: "Elderly Care", icon: "👵", desc: "Senior companion care, vitals, meals & mobility support" },
  { role: "Chef", label: "Chef / Cook", icon: "👨‍🍳", desc: "Family meal preparation, baking & traditional dishes" },
  { role: "Gardener", label: "Gardener", icon: "🌿", desc: "Lawn care, landscaping, hedges & perimeter upkeep" },
  { role: "Maid", label: "Maid", icon: "🏠", desc: "Dedicated daily residential cleaning & household duties" },
];

const PREFERRED_AGE_OPTIONS = [
  "20 - 29 Years",
  "30 - 39 Years",
  "40 - 49 Years",
  "50+ Years (Mature / Experienced)",
  "Any Age (No Preference)",
];

const PROPOSED_OFF_DAYS_OPTIONS = [
  "Every Sunday",
  "Alternate Weekends (Saturday & Sunday)",
  "Every Saturday",
  "1 Day Per Week (Flexible)",
  "2 Days Per Week",
  "Month-End Break (4 Consecutive Days)",
  "Custom / Negotiable",
];

const STAFF_ACCOMMODATION_OPTIONS = [
  "Separate Private Cottage with Ensuite Bathroom",
  "Domestic Quarters (Private Room + Shared Bathroom)",
  "Inside Main House (Private Bedroom)",
  "Self-Contained Staff Quarters with Electricity & Water",
  "Not Applicable (Live-Out / Day Worker)",
  "Other / Custom Arrangement",
];

export const EmployerHiringModal: React.FC<EmployerHiringModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialCity = "Harare",
  currency = "USD",
}) => {
  const { recordHiringNotification } = usePlatform();
  const [fullName, setFullName] = useState("");
  const [phoneOrWhatsApp, setPhoneOrWhatsApp] = useState("");
  const [city, setCity] = useState<CityLocation>(initialCity);
  const [suburb, setSuburb] = useState<string>("Borrowdale");
  const [streetAddress, setStreetAddress] = useState("");

  const [helperType, setHelperType] = useState<HelperType>("Live-In");
  const [primaryFocus, setPrimaryFocus] = useState<PrimaryFocusRole>("Housekeeping");

  const [preferredAges, setPreferredAges] = useState<string>("30 - 39 Years");
  const [customAgeRange, setCustomAgeRange] = useState<string>("");

  // Household Details
  const [numberOfKids, setNumberOfKids] = useState<number>(1);
  const [kidsAgesNotes, setKidsAgesNotes] = useState<string>("");
  const [numberOfAdults, setNumberOfAdults] = useState<number>(2);
  const [numberOfBedrooms, setNumberOfBedrooms] = useState<number>(3);
  const [pets, setPets] = useState<string>("None");
  const [customPetDetails, setCustomPetDetails] = useState<string>("");

  // Special Needs & Off Days & Accommodation
  const [specialNeeds, setSpecialNeeds] = useState<string>("");
  const [proposedOffDays, setProposedOffDays] = useState<string>("Every Sunday");
  const [customOffDays, setCustomOffDays] = useState<string>("");
  const [staffAccommodation, setStaffAccommodation] = useState<string>(
    "Separate Private Cottage with Ensuite Bathroom"
  );
  const [customAccommodation, setCustomAccommodation] = useState<string>("");

  // Salary & Timeline
  const [offeredSalaryUSD, setOfferedSalaryUSD] = useState<number>(220);
  const [startDate, setStartDate] = useState<string>("Immediate (Within 48 Hours)");
  const [isUrgent, setIsUrgent] = useState<boolean>(false);

  // Status & Feedback
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentSuburbs = getSuburbsForCity(city);

  const handleCityChange = (newCity: CityLocation) => {
    setCity(newCity);
    const available = getSuburbsForCity(newCity);
    setSuburb(available.length > 1 ? available[1] : available[0] || "Central");
  };

  const getResolvedRequestData = (): EmployerHiringRequest => {
    const finalAge = preferredAges === "Custom" ? customAgeRange : preferredAges;
    const finalPets = pets === "Other" ? customPetDetails || "Pets present" : pets;
    const finalOffDays = proposedOffDays === "Custom / Negotiable" ? customOffDays || proposedOffDays : proposedOffDays;
    const finalAccommodation =
      helperType === "Live-Out/Day Worker"
        ? "Not Applicable (Live-Out / Day Worker)"
        : staffAccommodation === "Other / Custom Arrangement"
        ? customAccommodation || staffAccommodation
        : staffAccommodation;

    return {
      id: `hire-req-${Date.now()}`,
      fullName: fullName.trim() || "Prospective Employer",
      phoneOrWhatsApp: phoneOrWhatsApp.trim() || "+263 77 123 4567",
      physicalAddress: {
        streetAddress: streetAddress.trim() || undefined,
        suburb: suburb || "Borrowdale",
        city: city || "Harare",
      },
      helperType,
      primaryFocus,
      preferredAges: finalAge || "30 - 39 Years",
      householdDetails: {
        numberOfKids,
        numberOfAdults,
        numberOfBedrooms,
        pets: finalPets,
        kidsAgesNotes: kidsAgesNotes.trim() || undefined,
      },
      specialNeeds: specialNeeds.trim(),
      proposedOffDays: finalOffDays,
      staffAccommodation: finalAccommodation,
      offeredSalaryUSD: Number(offeredSalaryUSD) || 220,
      startDate,
      urgent: isUrgent,
      status: "Pending Match",
      createdAt: new Date().toISOString(),
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg("Please enter your Full Name.");
      return;
    }
    if (!suburb) {
      setErrorMsg("Please specify your Suburb and City.");
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    const requestData = getResolvedRequestData();

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      recordHiringNotification(requestData.primaryFocus, `${requestData.helperType} ${requestData.primaryFocus} for ${requestData.physicalAddress.suburb}, ${requestData.physicalAddress.city}`);
      if (onSuccess) {
        onSuccess(requestData);
      }
    }, 800);
  };

  const handleShareToWhatsApp = () => {
    const requestData = getResolvedRequestData();
    const formatted = formatEmployerHiringRequestToWhatsApp(requestData);
    const whatsappUrl = `https://wa.me/263785458828?text=${encodeURIComponent(formatted)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyText = () => {
    const requestData = getResolvedRequestData();
    const formatted = formatEmployerHiringRequestToWhatsApp(requestData);
    navigator.clipboard.writeText(formatted);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-emerald-950/70 hover:bg-emerald-900 text-white rounded-full transition-colors"
            title="Close Form"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-300 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="uppercase tracking-wider">Zimbabwe Maids Centre • Verified Placement Request</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            Employer Hiring Form & Helper Request
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-xl">
            Fill out your household specifications below to receive matched, police-cleared, and vetted candidates across Harare, Bulawayo, and all Zimbabwe towns.
          </p>
        </div>

        {/* Modal Content / Scrollable Form */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {isSuccess ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900">
                  Hiring Request Submitted Successfully!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <span className="font-bold text-slate-900">{fullName}</span>. Your requirement for a{" "}
                  <span className="font-bold text-emerald-700">{helperType} {primaryFocus}</span> in{" "}
                  <span className="font-bold text-slate-900">{suburb}, {city}</span> has been lodged.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 max-w-md mx-auto text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Helper Type:</span>
                  <span className="font-bold text-slate-800">{helperType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Primary Focus:</span>
                  <span className="font-bold text-slate-800">{primaryFocus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Household:</span>
                  <span className="font-bold text-slate-800">
                    {numberOfKids} Kids, {numberOfAdults} Adults, {numberOfBedrooms} Bedrooms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Pets:</span>
                  <span className="font-bold text-slate-800">{pets}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Proposed Off Days:</span>
                  <span className="font-bold text-slate-800">{proposedOffDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Staff Accommodation:</span>
                  <span className="font-bold text-slate-800">{staffAccommodation}</span>
                </div>
                {specialNeeds && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-medium block">Special Needs:</span>
                    <span className="text-slate-800 italic">{specialNeeds}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  type="button"
                  onClick={handleShareToWhatsApp}
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Request Directly to WhatsApp (+263785458828)</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2"
                >
                  {copiedNotification ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedNotification ? "Copied to Clipboard!" : "Copy Form Summary"}</span>
                </button>
              </div>

              <div className="pt-3">
                <button
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-slate-700 font-bold underline"
                >
                  Return to Candidate Marketplace
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* SECTION 1: FULL NAME & PHYSICAL ADDRESS */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                  <User className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    1. Employer Details & Physical Address
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mr. Tafadzwa Tagwirei / Mrs. Chipo Moyo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Phone / WhatsApp Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +263 77 123 4567"
                      value={phoneOrWhatsApp}
                      onChange={(e) => setPhoneOrWhatsApp(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Physical Address (Suburb & City) */}
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>City / Town <span className="text-rose-500">*</span></span>
                      </label>
                      <select
                        value={city}
                        onChange={(e) => handleCityChange(e.target.value as CityLocation)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                      >
                        {ALL_ZIMBABWE_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                        <Building className="w-3 h-3 text-emerald-600" />
                        <span>Suburb / Area <span className="text-rose-500">*</span></span>
                      </label>
                      {currentSuburbs && currentSuburbs.length > 0 ? (
                        <select
                          value={suburb}
                          onChange={(e) => setSuburb(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                        >
                          {currentSuburbs.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          placeholder="Enter your suburb or area"
                          value={suburb}
                          onChange={(e) => setSuburb(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Street / House Address <span className="text-slate-400 font-normal">(Optional / Kept Confidential)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 14 Enterprise Rd / Stand 402 Borrowdale Brooke"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: HELPER TYPE & PRIMARY FOCUS */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    2. Helper Type & Primary Focus
                  </h3>
                </div>

                {/* Helper Type: Live-In or Live-Out/Day Worker */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">
                    Helper Type <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setHelperType("Live-In")}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        helperType === "Live-In"
                          ? "bg-emerald-900 text-white border-emerald-900 shadow-md ring-2 ring-emerald-500/50"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-extrabold text-sm flex items-center justify-between">
                        <span>Live-In</span>
                        <span className="text-base">🛌</span>
                      </div>
                      <p className={`text-[11px] mt-1 ${helperType === "Live-In" ? "text-emerald-200" : "text-slate-500"}`}>
                        Stays on premises in provided accommodation.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHelperType("Live-Out/Day Worker")}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        helperType === "Live-Out/Day Worker"
                          ? "bg-emerald-900 text-white border-emerald-900 shadow-md ring-2 ring-emerald-500/50"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-extrabold text-sm flex items-center justify-between">
                        <span>Live-Out / Day Worker</span>
                        <span className="text-base">🚪</span>
                      </div>
                      <p className={`text-[11px] mt-1 ${helperType === "Live-Out/Day Worker" ? "text-emerald-200" : "text-slate-500"}`}>
                        Commutes daily (e.g. 7:30 AM to 4:30 PM).
                      </p>
                    </button>
                  </div>
                </div>

                {/* Primary Focus: Housekeeping / Nanny / Elderly Care / Chef / Gardener / Maid */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">
                    Primary Focus <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {PRIMARY_FOCUS_OPTIONS.map((item) => (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => setPrimaryFocus(item.role)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          primaryFocus === item.role
                            ? "bg-emerald-800 text-white border-emerald-800 shadow-md ring-2 ring-emerald-400"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{item.icon}</span>
                          <span className="font-bold text-xs">{item.label}</span>
                        </div>
                        <p className={`text-[10px] mt-1 line-clamp-2 leading-tight ${primaryFocus === item.role ? "text-emerald-100" : "text-slate-500"}`}>
                          {item.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 3: PREFERRED AGES, OFF DAYS & STAFF ACCOMMODATION */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    3. Preferred Ages, Off Days & Staff Accommodation
                  </h3>
                </div>

                {/* Preferred Ages */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Preferred Helper Age Bracket
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PREFERRED_AGE_OPTIONS.map((ageOpt) => (
                      <button
                        key={ageOpt}
                        type="button"
                        onClick={() => setPreferredAges(ageOpt)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          preferredAges === ageOpt
                            ? "bg-emerald-700 text-white shadow-sm"
                            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {ageOpt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Proposed Off Days */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Proposed Off Days
                  </label>
                  <select
                    value={proposedOffDays}
                    onChange={(e) => setProposedOffDays(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    {PROPOSED_OFF_DAYS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  {proposedOffDays === "Custom / Negotiable" && (
                    <input
                      type="text"
                      placeholder="Specify custom off days schedule (e.g. Every second Sunday + public holidays)"
                      value={customOffDays}
                      onChange={(e) => setCustomOffDays(e.target.value)}
                      className="w-full mt-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  )}
                </div>

                {/* Staff Accommodation */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
                    <span>Staff Accommodation Provided</span>
                    {helperType === "Live-Out/Day Worker" && (
                      <span className="text-[10px] font-normal text-slate-500">(N/A for Live-Out)</span>
                    )}
                  </label>

                  {helperType === "Live-Out/Day Worker" ? (
                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 italic">
                      Live-Out / Day Worker position — worker arranges own off-site accommodation and commutes.
                    </div>
                  ) : (
                    <>
                      <select
                        value={staffAccommodation}
                        onChange={(e) => setStaffAccommodation(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                      >
                        {STAFF_ACCOMMODATION_OPTIONS.filter((o) => o !== "Not Applicable (Live-Out / Day Worker)").map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>

                      {staffAccommodation === "Other / Custom Arrangement" && (
                        <input
                          type="text"
                          placeholder="Describe accommodation arrangement (e.g. Furnished room with separate kitchenette)"
                          value={customAccommodation}
                          onChange={(e) => setCustomAccommodation(e.target.value)}
                          className="w-full mt-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* SECTION 4: HOUSEHOLD & FAMILY DETAILS */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                  <Home className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    4. Household & Property Details
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Number of Kids */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1 flex items-center justify-center gap-1">
                      <Baby className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Kids</span>
                    </label>
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setNumberOfKids(Math.max(0, numberOfKids - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-sm w-5 text-slate-900">{numberOfKids}</span>
                      <button
                        type="button"
                        onClick={() => setNumberOfKids(numberOfKids + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Number of Adults */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1 flex items-center justify-center gap-1">
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Adults</span>
                    </label>
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setNumberOfAdults(Math.max(1, numberOfAdults - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-sm w-5 text-slate-900">{numberOfAdults}</span>
                      <button
                        type="button"
                        onClick={() => setNumberOfAdults(numberOfAdults + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Number of Bedrooms */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1 flex items-center justify-center gap-1">
                      <BedDouble className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bedrooms</span>
                    </label>
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setNumberOfBedrooms(Math.max(1, numberOfBedrooms - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="font-extrabold text-sm w-5 text-slate-900">{numberOfBedrooms}</span>
                      <button
                        type="button"
                        onClick={() => setNumberOfBedrooms(numberOfBedrooms + 1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Pets */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1 flex items-center justify-center gap-1">
                      <Dog className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pets</span>
                    </label>
                    <select
                      value={pets}
                      onChange={(e) => setPets(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-[11px] font-bold rounded-lg p-1.5 focus:outline-none"
                    >
                      <option value="None">None</option>
                      <option value="1 Dog">1 Dog</option>
                      <option value="2+ Dogs">2+ Dogs</option>
                      <option value="Cat(s)">Cat(s)</option>
                      <option value="Dogs & Cats">Dogs & Cats</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {numberOfKids > 0 && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Kids' Ages & Details <span className="text-slate-400 font-normal">(Optional, e.g. 2 years old toddler & 6 years old)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Newborn 4 months & 5 yr old attending preschool"
                      value={kidsAgesNotes}
                      onChange={(e) => setKidsAgesNotes(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                {pets === "Other" && (
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Specify Pet Details
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2 Boerboels in yard (helper does not feed them)"
                      value={customPetDetails}
                      onChange={(e) => setCustomPetDetails(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 5: SPECIAL NEEDS (BLANK SPACE / DETAILED TEXT AREA) */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      5. Special Needs & Specific Household Instructions
                    </h3>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                    Custom Space
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  Please provide details about any dietary requirements, infant care routines, special medical conditions, delicate laundry handling, pet feeding, or particular household preferences.
                </p>

                <textarea
                  rows={4}
                  value={specialNeeds}
                  onChange={(e) => setSpecialNeeds(e.target.value)}
                  placeholder="e.g. 
- Must be experienced with infant sleep routines and sterilization of baby bottles
- Family adheres to a low-salt and healthy vegetable-rich meal diet
- We have a delicate steam iron for business suits
- Grandma lives with us and needs gentle assistance with morning medication and tea
- No smoking or strong perfumes on premises..."
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-normal leading-relaxed"
                />
              </div>

              {/* SECTION 6: SALARY BUDGET & START TIMELINE */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    6. Budget & Timeline
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Offered Monthly Salary (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        min="80"
                        max="2000"
                        step="10"
                        value={offeredSalaryUSD}
                        onChange={(e) => setOfferedSalaryUSD(Number(e.target.value))}
                        className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Typical market range: $180 - $350 USD depending on experience.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Expected Start Date
                    </label>
                    <select
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Immediate (Within 48 Hours)">Immediate (Within 48 Hours)</option>
                      <option value="Within 1 Week">Within 1 Week</option>
                      <option value="1st of Next Month">1st of Next Month</option>
                      <option value="15th of Next Month">15th of Next Month</option>
                      <option value="Flexible / Negotiable">Flexible / Negotiable</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="urgentHiringCheck"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="urgentHiringCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Urgent Hiring Requirement (Prioritize Fast-Track WhatsApp Dispatch)
                  </label>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? "Submitting Request..." : "Submit Hiring Request"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareToWhatsApp}
                  className="px-4 py-3.5 bg-emerald-950 hover:bg-slate-900 text-emerald-300 font-bold text-xs rounded-2xl transition-all flex items-center justify-center space-x-2 border border-emerald-800"
                  title="Directly send this completed hiring brief to WhatsApp"
                >
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Send to WhatsApp</span>
                  <span className="sm:hidden">WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyText}
                  className="px-3.5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-all flex items-center justify-center space-x-1.5"
                  title="Copy formatted text"
                >
                  {copiedNotification ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copiedNotification ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
