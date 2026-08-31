import React, { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { AuthAccountType } from "../../types/auth";
import { UserRole, CityLocation } from "../../types/marketplace";
import { ALL_ZIMBABWE_CITIES } from "../../data/zimbabweLocations";
import { ZMC_OFFICIAL_LOGO } from "../common/BrandLogo";
import { ScrollableDateOfBirthPicker } from "../common/ScrollableDateOfBirthPicker";
import {
  ShieldCheck,
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  X,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Users,
  Building2,
  Check,
  Upload,
  Camera,
  Calendar,
  CreditCard,
  Smartphone,
  RefreshCw,
  Zap
} from "lucide-react";

const WORKER_ROLES: UserRole[] = [
  "Maids",
  "Housekeeper",
  "Nanny",
  "Caregiver",
  "Nurse aide",
  "Gardener",
  "Domestic worker",
  "Part-time maid",
  "Cook",
  "Driver",
  "Cleaner",
  "Electrician",
  "Plumber",
  "Builder",
  "Carpenter"
];

const PAYMENT_GATEWAY_ASSETS = {
  ecocash: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=100",
  innbucks: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=100",
  visaMastercard: "https://images.unsplash.com/photo-1556742049-0a67e5572263?auto=format&fit=crop&q=80&w=100",
};

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    loginWithEmail,
    signupWithEmail,
    loginWithSocial,
    switchDemoUser,
    depositWorkerFeePaynow,
  } = useAuth();

  // Common Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<AuthAccountType>("Worker");
  const [city, setCity] = useState<CityLocation>("Harare");
  const [suburb, setSuburb] = useState("Avondale");
  const [phone, setPhone] = useState("");

  // Worker specific fields
  const [workerStep, setWorkerStep] = useState<1 | 2 | 3>(1);
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("1998-05-14");
  const [profession, setProfession] = useState<UserRole>("Maids");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("");
  const [profilePhotoName, setProfilePhotoName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Employer / Agency specific fields
  const [employerFullName, setEmployerFullName] = useState("");
  const [agencyNameInput, setAgencyNameInput] = useState("");

  // Paynow $3 deposit states
  const [paynowMethod, setPaynowMethod] = useState<"ecocash" | "onemoney" | "card" | "innbucks">("ecocash");
  const [paynowPhone, setPaynowPhone] = useState("0771490167");
  const [paynowRef, setPaynowRef] = useState(`PAYNOW-ZMC-${Math.floor(100000 + Math.random() * 900000)}`);
  const [isProcessingPaynow, setIsProcessingPaynow] = useState(false);
  const [isPaynowSuccess, setIsPaynowSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isAuthModalOpen) return null;

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhotoName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfilePhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);
    try {
      const res = await loginWithEmail(email, password);
      if (res && res.success) {
        setSuccessMsg("Signed in successfully!");
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setSuccessMsg("");
        }, 500);
      } else {
        setErrorMsg(res?.error || "Failed to sign in. Please verify your email and password.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1 -> Step 2 validation for Worker
  const handleWorkerStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !surname.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("Please fill in your Name, Surname, Email and Password.");
      return;
    }
    if (!dateOfBirth) {
      setErrorMsg("Please select your Date of Birth.");
      return;
    }
    setErrorMsg("");
    setWorkerStep(2);
  };

  // Finish Worker Registration (Payment is done later in the dashboard)
  const handleCompleteWorkerRegistration = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const fullName = `${firstName.trim()} ${surname.trim()}`;
      const defaultAvatar = profilePhotoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`;

      const res = await signupWithEmail({
        fullName,
        firstName: firstName.trim(),
        surname: surname.trim(),
        dateOfBirth,
        email: email.trim(),
        password,
        accountType: "Worker",
        city,
        suburb,
        phoneNumber: phone || "+263 785 458 828",
        avatarUrl: defaultAvatar,
        specificProfession: profession,
        isDepositPaid: false,
      });

      if (res && res.success) {
        setSuccessMsg("🎉 Account created successfully! You can deposit $3.00 USD via Paynow later in your dashboard to activate and unlock verified jobs.");
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setSuccessMsg("");
        }, 1200);
      } else {
        setErrorMsg(res?.error || "Registration could not be completed.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Sign-up issue encountered.");
    } finally {
      setIsLoading(false);
    }
  };

  // Standard Employer / Agency Signup
  const handleEmployerOrAgencySignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employerFullName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    if (accountType === "Agency" && !agencyNameInput.trim()) {
      setErrorMsg("Please enter your registered Agency Business Name.");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);
    try {
      const res = await signupWithEmail({
        fullName: employerFullName.trim(),
        email: email.trim(),
        password,
        accountType,
        city,
        suburb,
        phoneNumber: phone || "+263 785 458 828",
        agencyName: accountType === "Agency" ? agencyNameInput.trim() : undefined,
      });

      if (res && res.success) {
        setSuccessMsg(accountType === "Employer" ? "Employer account created!" : "Agency account registered!");
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setSuccessMsg("");
        }, 800);
      } else {
        setErrorMsg(res?.error || "Account creation failed.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Signup error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: "google" | "facebook", targetType: AuthAccountType = "Employer") => {
    setErrorMsg("");
    setIsLoading(true);
    try {
      const res = await loginWithSocial(provider, targetType);
      if (res && res.success) {
        setSuccessMsg(`Signed in with ${provider === "google" ? "Google" : "Facebook"}!`);
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setSuccessMsg("");
        }, 500);
      } else if (res?.error) {
        setErrorMsg(res.error);
      }
    } catch (err: any) {
      setErrorMsg("Social authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 relative my-8">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500 bg-white shadow-xl shadow-emerald-950/20 mx-auto">
            <img
              src={ZMC_OFFICIAL_LOGO}
              alt="Zimbabwe Maids Centre Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Zimbabwe Maids Centre
          </h2>
          <p className="text-xs text-slate-500">
            Sign up as a Worker or Employer to access verified domestic jobs and staff
          </p>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 text-xs font-bold">
          <button
            onClick={() => {
              setAuthModalTab("signup");
              setErrorMsg("");
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              authModalTab === "signup"
                ? "bg-emerald-900 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Create Account
          </button>

          <button
            onClick={() => {
              setAuthModalTab("signin");
              setErrorMsg("");
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              authModalTab === "signin"
                ? "bg-emerald-900 text-white shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>

          <button
            onClick={() => {
              setAuthModalTab("demo");
              setErrorMsg("");
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              authModalTab === "demo"
                ? "bg-amber-400 text-slate-950 font-black shadow-md"
                : "text-amber-800 hover:text-amber-950"
            }`}
          >
            ⚡ Quick Demo
          </button>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: SIGN IN */}
        {authModalTab === "signin" && (
          <div className="space-y-5">
            <div className="space-y-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleSocialAuth("google", "Employer")}
                className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 shadow-2xs disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.3 7.31 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2 0 10.04 0 12s.46 3.8 1.27 5.42l4.01-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>{isLoading ? "Signing in..." : "Sign In with Google"}</span>
              </button>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-[11px] font-bold uppercase">Or Email Login</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleSignIn} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. yourname@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>{isLoading ? "Signing In..." : "Sign In to Account"}</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: SIGN UP */}
        {authModalTab === "signup" && (
          <div className="space-y-4 text-xs">
            {/* Account Type Selector */}
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">I am registering as:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAccountType("Worker");
                    setErrorMsg("");
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-start space-x-2.5 ${
                    accountType === "Worker"
                      ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/40"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Users className={`w-5 h-5 shrink-0 mt-0.5 ${accountType === "Worker" ? "text-emerald-700" : "text-slate-400"}`} />
                  <div>
                    <span className="font-black text-slate-900 block text-xs">Worker / Maid</span>
                    <span className="text-[10px] text-slate-500 block leading-tight">Find domestic jobs in your category</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAccountType("Employer");
                    setErrorMsg("");
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-start space-x-2.5 ${
                    accountType === "Employer"
                      ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/40"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Building2 className={`w-5 h-5 shrink-0 mt-0.5 ${accountType === "Employer" ? "text-emerald-700" : "text-slate-400"}`} />
                  <div>
                    <span className="font-black text-slate-900 block text-xs">Employer</span>
                    <span className="text-[10px] text-slate-500 block leading-tight">Browse & place approved maids</span>
                  </div>
                </button>
              </div>
            </div>

            {/* WORKER REGISTRATION STEPPED FLOW */}
            {accountType === "Worker" && (
              <div className="space-y-4">
                {/* Stepper Progress Bar */}
                <div className="bg-slate-100 p-2 rounded-2xl flex items-center justify-between text-[11px] font-bold">
                  <span className={`px-3 py-1 rounded-xl flex items-center gap-1.5 ${workerStep === 1 ? "bg-emerald-900 text-white shadow-sm" : "text-emerald-800"}`}>
                    <span>1. Worker Details</span>
                    {workerStep > 1 && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </span>
                  <span className="text-slate-300">→</span>
                  <span className={`px-3 py-1 rounded-xl flex items-center gap-1.5 ${workerStep === 2 ? "bg-emerald-900 text-white shadow-sm" : "text-slate-400"}`}>
                    <span>2. Profile Photo & Finish</span>
                  </span>
                </div>

                {/* WORKER STEP 1: Personal Details */}
                {workerStep === 1 && (
                  <form onSubmit={handleWorkerStep1Next} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">First Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Chipo"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Surname *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Moyo"
                          value={surname}
                          onChange={(e) => setSurname(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Scrollable Date of Birth Picker */}
                    <ScrollableDateOfBirthPicker
                      value={dateOfBirth}
                      onChange={setDateOfBirth}
                      required
                    />

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Job Category / Profession *</label>
                      <select
                        value={profession}
                        onChange={(e) => setProfession(e.target.value as UserRole)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        {WORKER_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">City Location *</label>
                        <select
                          value={city}
                          onChange={(e) => setCity(e.target.value as CityLocation)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        >
                          {ALL_ZIMBABWE_CITIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Suburb / Area</label>
                        <input
                          type="text"
                          placeholder="e.g. Highfield / Avondale"
                          value={suburb}
                          onChange={(e) => setSuburb(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Phone / WhatsApp *</label>
                        <input
                          type="text"
                          required
                          placeholder="0771 490 167"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="chipo@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Create Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>Next: Upload Profile Picture</span>
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                    </button>
                  </form>
                )}

                {/* WORKER STEP 2: Profile Picture Upload from File */}
                {workerStep === 2 && (
                  <div className="space-y-4 text-center">
                    <div className="space-y-1">
                      <h3 className="font-black text-slate-900 text-sm">Upload Your Profile Picture</h3>
                      <p className="text-[11px] text-slate-500">
                        Upload a clear picture from your phone or computer. Employers prefer candidates with real photos.
                      </p>
                    </div>

                    {/* Avatar Preview */}
                    <div className="flex flex-col items-center justify-center space-y-3 py-2">
                      <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-emerald-500 bg-slate-100 shadow-lg relative group">
                        <img
                          src={profilePhotoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(firstName || "Worker")}`}
                          alt="Profile Preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-[10px] font-bold"
                        >
                          <Camera className="w-5 h-5 mb-1" />
                          <span>Change</span>
                        </button>
                      </div>

                      {profilePhotoName ? (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Photo selected: {profilePhotoName}</span>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400">Default avatar selected or upload your photo below</p>
                      )}
                    </div>

                    {/* Hidden input & upload trigger */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleProfilePhotoUpload}
                      className="hidden"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 p-4 rounded-2xl cursor-pointer transition-all flex flex-col items-center space-y-1.5"
                    >
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Upload className="w-4 h-4" />
                      </div>
                      <span className="font-extrabold text-emerald-900 text-xs">
                        {profilePhotoName ? "Select a different photo file" : "Choose Profile Picture from Device"}
                      </span>
                      <span className="text-[10px] text-slate-500">Supports JPG, PNG, WEBP (Max 5MB)</span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Payment is deferred — deposit later</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Registration is 100% free now. You can deposit the $3.00 USD approval fee later inside your dashboard when you want to unlock job applications.
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setWorkerStep(1)}
                        className="w-1/3 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={handleCompleteWorkerRegistration}
                        className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-white" />
                            <span>Creating Account...</span>
                          </>
                        ) : (
                          <>
                            <span>Complete Registration</span>
                            <Check className="w-4 h-4 text-white" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* EMPLOYER / AGENCY REGISTRATION */}
            {accountType !== "Worker" && (
              <form onSubmit={handleEmployerOrAgencySignUp} className="space-y-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {accountType === "Employer" ? "Your Full Name *" : "Contact Person Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mrs. Margaret Chigumba"
                    value={employerFullName}
                    onChange={(e) => setEmployerFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                {accountType === "Agency" && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Registered Agency Business Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Premier Domestic Services Pvt Ltd"
                      value={agencyNameInput}
                      onChange={(e) => setAgencyNameInput(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City Location *</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value as CityLocation)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      {ALL_ZIMBABWE_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Suburb / Area</label>
                    <input
                      type="text"
                      placeholder="e.g. Borrowdale / Glen Lorne"
                      value={suburb}
                      onChange={(e) => setSuburb(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="margaret@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone Number (WhatsApp)</label>
                    <input
                      type="text"
                      placeholder="+263 77..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Set Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <span>{isLoading ? "Creating Account..." : `Create ${accountType} Account`}</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: QUICK DEMO ACCOUNTS */}
        {authModalTab === "demo" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 text-center">
              Instantly switch between roles to test the simplified experience:
            </p>

            {/* Worker Switch */}
            <button
              onClick={() => {
                switchDemoUser("Worker");
                setIsAuthModalOpen(false);
              }}
              className="w-full p-4 bg-sky-50 hover:bg-sky-100/80 border border-sky-200 text-slate-900 rounded-2xl text-left transition-all flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-sky-700" />
                  <span className="font-extrabold text-xs">Sizani Ndlovu (Approved Maid / Worker)</span>
                  <span className="px-2 py-0.5 bg-sky-200 text-sky-900 font-bold text-[10px] rounded">WORKER PORTAL</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Worker view: sees only Maid category jobs, Add Funds button, and direct 1-click apply.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-sky-700 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

            {/* Employer Switch */}
            <button
              onClick={() => {
                switchDemoUser("Employer");
                setIsAuthModalOpen(false);
              }}
              className="w-full p-4 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-slate-900 rounded-2xl text-left transition-all flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span className="font-extrabold text-xs">Mrs. Margaret Chigumba (Employer)</span>
                  <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 font-bold text-[10px] rounded">EMPLOYER PORTAL</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Employer view: Browse approved maids by category, Add Funds, and place workers to unlock direct contacts.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

            {/* Admin Switch */}
            <button
              onClick={() => {
                switchDemoUser("Admin");
                setIsAuthModalOpen(false);
              }}
              className="w-full p-4 bg-gradient-to-r from-slate-900 to-slate-950 hover:from-slate-800 hover:to-slate-900 text-white border border-slate-800 rounded-2xl text-left transition-all flex items-center justify-between group shadow-md"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="font-extrabold text-xs">System Admin</span>
                  <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded">ADMIN</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Full control: Worker approvals, job postings, revenue ledger.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

