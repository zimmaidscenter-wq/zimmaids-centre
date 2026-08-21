import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { AuthAccountType } from "../../types/auth";
import { UserRole, CityLocation } from "../../types/marketplace";
import { ALL_ZIMBABWE_CITIES } from "../../data/zimbabweLocations";
import { ZMC_OFFICIAL_LOGO } from "../common/BrandLogo";
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
  Briefcase,
  Users,
  Building2,
  Check
} from "lucide-react";

const WORKER_ROLES: UserRole[] = [
  "Domestic worker",
  "Maid",
  "Part-time maid",
  "Nanny",
  "Caregiver",
  "Housekeeper",
  "Gardener",
  "Driver",
  "Electrician",
  "Plumber",
  "Builder",
  "Carpenter",
  "Cleaner",
  "Chef",
  "Nurse aide",
];

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
    currentUser,
  } = useAuth();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [agencyNameInput, setAgencyNameInput] = useState("");
  const [accountType, setAccountType] = useState<AuthAccountType>("Employer");
  const [city, setCity] = useState<CityLocation>("Harare");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState<UserRole>("Maid");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isAuthModalOpen) return null;

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
        }, 600);
      } else {
        setErrorMsg(res?.error || "Failed to sign in. Please verify your email and password.");
      }
    } catch (err: any) {
      console.warn("Sign-in error:", err);
      setErrorMsg(err.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
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
        fullName: signupName,
        email: signupEmail,
        password: signupPassword,
        accountType,
        city,
        phoneNumber: phone || "+263 785 458 828",
        specificProfession: accountType === "Worker" ? profession : undefined,
        agencyName: accountType === "Agency" ? agencyNameInput.trim() : undefined,
      });

      if (res && res.success) {
        if (accountType === "Worker") {
          setSuccessMsg("Account created! Worker profile submitted for Admin & ZRP approval.");
        } else if (accountType === "Agency") {
          setSuccessMsg("Agency registered! Your account has been submitted for Admin verification.");
        } else {
          setSuccessMsg("Client account created successfully!");
        }

        setTimeout(() => {
          setIsAuthModalOpen(false);
          setSuccessMsg("");
        }, 1000);
      } else {
        setErrorMsg(res?.error || "Account creation could not be completed. Please try again.");
      }
    } catch (err: any) {
      console.warn("Signup error:", err);
      setErrorMsg(err.message || "Sign-up issue encountered.");
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
        }, 600);
      } else if (res?.error) {
        setErrorMsg(res.error);
      }
    } catch (err: any) {
      console.warn("Social sign-in catch:", err);
      setErrorMsg("Could not connect with social authentication. You can sign in using email & password.");
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
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500 bg-white shadow-xl shadow-emerald-950/20 mx-auto">
            <img
              src={ZMC_OFFICIAL_LOGO}
              alt="Zimbabwe Maids Centre Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Zimbabwe Maids Centre Identity Portal
          </h2>
          <p className="text-xs text-slate-500">
            Secure Role-Based Access for Clients, Domestic Staff & System Administrators
          </p>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1 text-xs font-bold">
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
              setAuthModalTab("demo");
              setErrorMsg("");
            }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              authModalTab === "demo"
                ? "bg-amber-400 text-slate-950 font-black shadow-md"
                : "text-amber-800 hover:text-amber-950"
            }`}
          >
            ⚡ Quick Demo Accounts
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
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: SIGN IN */}
        {authModalTab === "signin" && (
          <div className="space-y-5">
            {/* Social Login Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleSocialAuth("google", "Employer")}
                className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 shadow-2xs disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2 0 10.04 0 12s.46 3.8 1.27 5.42l4.01-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{isLoading ? "Signing in..." : "Sign In with Google"}</span>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleSocialAuth("facebook", "Employer")}
                className="w-full py-2.5 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>{isLoading ? "Signing in..." : "Sign In with Facebook"}</span>
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
                    placeholder="e.g. margaret@homeowner.co.zw"
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
                className="w-full py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: CREATE ACCOUNT (SIGN UP) */}
        {authModalTab === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-4 text-xs">
            {/* Account Type Choice */}
            <div>
              <label className="font-bold text-slate-800 block mb-1.5">Select Account Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAccountType("Employer")}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex items-start space-x-2 ${
                    accountType === "Employer"
                      ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/40"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Building2 className={`w-4 h-4 shrink-0 mt-0.5 ${accountType === "Employer" ? "text-emerald-700" : "text-slate-400"}`} />
                  <div>
                    <span className="font-extrabold text-slate-900 block text-xs">Employer</span>
                    <span className="text-[10px] text-slate-500 leading-tight block">Hire verified staff</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType("Worker")}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex items-start space-x-2 ${
                    accountType === "Worker"
                      ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/40"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Users className={`w-4 h-4 shrink-0 mt-0.5 ${accountType === "Worker" ? "text-emerald-700" : "text-slate-400"}`} />
                  <div>
                    <span className="font-extrabold text-slate-900 block text-xs">Worker</span>
                    <span className="text-[10px] text-slate-500 leading-tight block">Find domestic jobs</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType("Agency")}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex items-start space-x-2 ${
                    accountType === "Agency"
                      ? "bg-teal-50 border-teal-500 ring-2 ring-teal-400/40"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <ShieldCheck className={`w-4 h-4 shrink-0 mt-0.5 ${accountType === "Agency" ? "text-teal-700" : "text-slate-400"}`} />
                  <div>
                    <span className="font-extrabold text-slate-900 block text-xs">Agency</span>
                    <span className="text-[10px] text-slate-500 leading-tight block">Manage workforce</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Social Signup Option */}
            <div className="flex gap-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleSocialAuth("google", accountType)}
                className="flex-1 py-2 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[11px] rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-2xs disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.3 7.31 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2 0 10.04 0 12s.46 3.8 1.27 5.42l4.01-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleSocialAuth("facebook", accountType)}
                className="flex-1 py-2 px-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-[11px] rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-2xs disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariro Chikwanha"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">City Location</label>
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
            </div>

            {accountType === "Worker" && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Domestic Profession / Trade</label>
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {WORKER_ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {accountType === "Agency" && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Agency Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premier Domestic Services Pvt Ltd"
                  value={agencyNameInput}
                  onChange={(e) => setAgencyNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-teal-300 rounded-xl font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="tariro@gmail.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
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
              <label className="font-bold text-slate-700 block mb-1">Set Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {accountType === "Worker" && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed font-medium">
                🛡️ <strong>Safety & Vetting Notice:</strong> Domestic worker registrations undergo mandatory ZRP Police Clearance and Master Admin vetting before public listing in the Client Marketplace.
              </div>
            )}

            {accountType === "Agency" && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-[11px] text-teal-900 leading-relaxed font-medium space-y-1">
                <p>
                  🏢 <strong>Licensed Agency Platform:</strong> Manage your candidate roster, post verified agency vacancies, and access enterprise recruitment tools.
                </p>
                <p className="text-[10px] text-teal-700 font-bold">
                  • Monthly Subscription: $50 USD / mo (Payable via EcoCash or Direct Escrow).
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <span>Create {accountType} Account</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </form>
        )}

        {/* TAB 3: QUICK DEMO ACCOUNTS */}
        {authModalTab === "demo" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 text-center">
              Instantly switch between roles to test specific account permissions and view filters:
            </p>

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
                  <span className="font-extrabold text-xs">Executive Master Admin</span>
                  <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded">OVERALL CONTROL</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Full powers: Approve/Reject candidate profiles, Approve/Reject job postings, Revenue ledger & Security logs.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
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
                  <span className="font-extrabold text-xs">Mrs. Margaret Chigumba (Client / Employer)</span>
                  <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 font-bold text-[10px] rounded">CLIENT VIEW</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Relevant client view: Search domestic staff, Post job vacancies, My Jobs, Premium Pass ($30).
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

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
                  <span className="font-extrabold text-xs">Sizani Ndlovu (Employee / Worker)</span>
                  <span className="px-2 py-0.5 bg-sky-200 text-sky-900 font-bold text-[10px] rounded">EMPLOYEE VIEW</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Relevant employee view: My Profile & Approval Status, Search Vacancies, 30% Placement Fee status, AI Coach.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-sky-700 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

            {/* Agency Switch */}
            <button
              onClick={() => {
                switchDemoUser("Agency");
                setIsAuthModalOpen(false);
              }}
              className="w-full p-4 bg-teal-50 hover:bg-teal-100/80 border border-teal-200 text-slate-900 rounded-2xl text-left transition-all flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-teal-700" />
                  <span className="font-extrabold text-xs">Premier Domestic Services (Agency Portal)</span>
                  <span className="px-2 py-0.5 bg-teal-200 text-teal-900 font-bold text-[10px] rounded">AGENCY VIEW</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Multi-agency portal: Agency workforce management, sub-accounts, EcoCash $50/mo subscription status, agency job postings.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-teal-700 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
