import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Star,
  Users,
  Search,
  MapPin,
  Sparkles,
  PhoneCall,
  MessageCircle,
  Briefcase,
  Award,
  TrendingUp,
  Lock,
  ArrowRight,
  Bot,
  FileCheck,
  Clock,
  Heart,
  ChevronRight,
  Smartphone,
  Building,
  UserCheck,
  Check
} from "lucide-react";

// Generated image assets paths
import heroImage from "../../assets/images/hero_zimb_family_1786612187383.jpg";
import appMockupImage from "../../assets/images/app_mobile_mockup_1786612200349.jpg";
import verificationBadgeImage from "../../assets/images/verification_badge_1786612213061.jpg";
import caregiverNannyImage from "../../assets/images/caregiver_nanny_1786612224041.jpg";
import skilledArtisanImage from "../../assets/images/skilled_artisan_1786612235127.jpg";
import { ZMC_OFFICIAL_LOGO } from "../common/BrandLogo";

interface LandingShowcaseProps {
  onNavigateToTab?: (tab: string) => void;
}

export const LandingShowcase: React.FC<LandingShowcaseProps> = ({ onNavigateToTab }) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");

  const SERVICE_CATEGORIES = [
    {
      title: "Housekeepers",
      description: "Professional home cleaners making living rooms, kitchens, and bedrooms spotless.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=500",
      count: "1,240+ Verified",
      badge: "ZRP CID Clear",
    },
    {
      title: "Nannies & Childcare",
      description: "Caring, trained nannies reading to and nurturing children in safe environments.",
      image: caregiverNannyImage,
      count: "890+ Verified",
      badge: "Red Cross & First Aid",
    },
    {
      title: "Elderly Caregivers",
      description: "Compassionate caregivers assisting senior family members with dignity.",
      image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=500",
      count: "650+ Nurse Aides",
      badge: "Red Cross Certified",
    },
    {
      title: "Tree Cutters & Arborists",
      description: "Expert chainsaw operators for dangerous tree felling, branch trimming & stump grinding.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=500",
      count: "180+ Tree Cutters",
      badge: "Safety Rigged",
    },
    {
      title: "Farm Workers",
      description: "Peri-urban farm assistants skilled in poultry, drip irrigation, crops & livestock.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=500",
      count: "290+ Farm Hands",
      badge: "Livestock & Crops",
    },
    {
      title: "Family Cooks",
      description: "Culinary experts preparing healthy traditional Shona/Ndebele stews and family meal preps.",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=500",
      count: "310+ Cooks",
      badge: "Hygiene Certified",
    },
    {
      title: "Satellite Dish Installers",
      description: "DStv Explora, OpenView HD & StarSat signal alignment and Extra View wall mounting.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=500",
      count: "240+ Installers",
      badge: "DStv Accredited",
    },
    {
      title: "Fumigation & Pest Control",
      description: "Eco-certified pest technicians eradicating termites, bedbugs, cockroaches & rodents.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=500",
      count: "190+ Specialists",
      badge: "Eco-Safe Certified",
    },
    {
      title: "Painters & Decorators",
      description: "Residential painters for interior emulsions, roof damp-proofing & wall texturing.",
      image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=500",
      count: "340+ Painters",
      badge: "Damp-Proofing",
    },
    {
      title: "Curtain & Blind Installers",
      description: "Precision curtain track fitters, wooden rod drilling, motorized blinds & blackout drapes.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=500",
      count: "160+ Installers",
      badge: "Precision Track",
    },
    {
      title: "Interior Designers",
      description: "Degree-qualified interior stylists for spatial planning, color staging & custom decor.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=500",
      count: "95+ Designers",
      badge: "Degree Qualified",
    },
    {
      title: "Part-Time Laundry Services",
      description: "Handwashing delicate clothing, crisp steam ironing, stain removal & bedding folding.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=500",
      count: "420+ Laundry Techs",
      badge: "Steam Ironing",
    },
    {
      title: "Sofa & Carpet Cleaners",
      description: "Mobile deep-extraction upholstery shampooing, leather treatment & odor elimination.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500",
      count: "280+ Cleaners",
      badge: "2-Hour Fast Dry",
    },
    {
      title: "Pavement & Driveway Cleaners",
      description: "High-pressure jet wash operators cleaning paved driveways, oil stains & pool surrounds.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=500",
      count: "150+ Jet Washers",
      badge: "Heavy Duty Petrol",
    },
    {
      title: "Gardeners & Landscapers",
      description: "Skilled horticulturists maintaining beautiful lawns, flowers, and vegetable gardens.",
      image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb12735?auto=format&fit=crop&q=80&w=500",
      count: "410+ Verified",
      badge: "Equipment Ready",
    },
    {
      title: "Certified Electricians",
      description: "Journeyman electricians safely installing 5kW solar systems, inverters, and rewiring.",
      image: skilledArtisanImage,
      count: "530+ Artisans",
      badge: "Class 1 Journeyman",
    },
    {
      title: "Plumbers & Geyser Techs",
      description: "Expert plumbers repairing leaks, unblocking drains, and installing solar geysers.",
      image: "https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&q=80&w=500",
      count: "380+ Techs",
      badge: "Journeyman Plumber",
    },
  ];

  const FEATURED_WORKERS = [
    {
      name: "Tendai Mukamuri",
      role: "Domestic Housekeeper",
      city: "Borrowdale, Harare",
      experience: "7 Years Exp.",
      rating: 4.9,
      reviews: 38,
      wage: "$220/mo",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
      trustScore: 98,
      verified: true,
    },
    {
      name: "Chipo Moyo",
      role: "Early Childhood Nanny",
      city: "Avondale, Harare",
      experience: "6 Years Exp.",
      rating: 5.0,
      reviews: 45,
      wage: "$260/mo",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400",
      trustScore: 99,
      verified: true,
    },
    {
      name: "Sizani Ndlovu",
      role: "Red Cross Nurse Aide",
      city: "Hillside, Bulawayo",
      experience: "5 Years Exp.",
      rating: 4.8,
      reviews: 22,
      wage: "$350/mo",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400",
      trustScore: 96,
      verified: true,
    },
    {
      name: "Blessing Chirwa",
      role: "Solar PV Electrician",
      city: "Highlands, Harare",
      experience: "10 Years Exp.",
      rating: 4.9,
      reviews: 64,
      wage: "$600/mo",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
      trustScore: 97,
      verified: true,
    },
  ];

  const TESTIMONIALS = [
    {
      quote: "Finding a trustworthy live-in nanny in Harare used to take weeks of uncertainty. With Zimbabwe Maids Centre, Chipo was police-cleared and interviewing at our home within 48 hours. The escrow payment gives complete peace of mind!",
      author: "Dr. Nyasha Tagwirei",
      location: "Borrowdale, Harare",
      role: "Medical Practitioner & Employer",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    },
    {
      quote: "As a Red Cross certified caregiver, ZMC gave me direct access to respectable families in Bulawayo. My monthly salary is guaranteed through EcoCash escrow without agency deductions.",
      author: "Sizani Ndlovu",
      location: "Bulawayo Central",
      role: "Verified Nurse Aide",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    },
    {
      quote: "Hired an electrician to install our 5kW solar system in Avondale. Blessing's Class 1 Journeyman certificate was verified on-screen and work was done perfectly.",
      author: "Tafadzwa Mutasa",
      location: "Avondale, Harare",
      role: "Home Owner",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 text-white rounded-3xl overflow-hidden border border-emerald-800/60 shadow-2xl">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-emerald-900/80 border border-emerald-500/60 rounded-full text-xs font-bold text-emerald-300 shadow-md">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-emerald-400 bg-white shrink-0">
                <img
                  src={ZMC_OFFICIAL_LOGO}
                  alt="ZMC Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span>Zimbabwe's #1 Verified Domestic & Household Marketplace</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Safe, Reliable Domestic Help & Household Artisans for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">Zimbabwean Homes</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Connect with 4,990+ ZRP Police cleared domestic workers, nannies, caregivers, gardeners, electricians, and plumbers across Harare, Bulawayo, and Mutare. All payments secured with EcoCash, InnBucks & Bank Escrow.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigateToTab?.("marketplace")}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Browse Verified Workers</span>
              </button>

              <button
                onClick={() => onNavigateToTab?.("jobs")}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-700/60 font-bold text-sm rounded-2xl transition-all flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-amber-300" />
                <span>Post Job Vacancy</span>
              </button>
            </div>

            {/* Quick Hero Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-emerald-900/80">
              <div>
                <span className="text-2xl font-black font-mono text-emerald-400">4,996+</span>
                <p className="text-xs text-slate-400">Verified Workers</p>
              </div>
              <div>
                <span className="text-2xl font-black font-mono text-amber-300">94.2%</span>
                <p className="text-xs text-slate-400">ZRP CID Pass Rate</p>
              </div>
              <div>
                <span className="text-2xl font-black font-mono text-sky-400">$415k+</span>
                <p className="text-xs text-slate-400">Escrow Disbursed</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl group">
              <img
                src={heroImage}
                alt="Smiling Zimbabwean domestic worker welcomed by a happy family"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-[420px] object-cover group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

              {/* Floating Verified Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/40 text-white flex items-center space-x-3">
                <div className="p-2.5 bg-emerald-600/30 rounded-xl text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">100% Police & Document Verified</h4>
                  <p className="text-[11px] text-slate-300">National ID • ZRP CID Clearance • Medical Health Certificate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
              <UserCheck className="w-4 h-4" />
              <span>Household & Artisan Services</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Browse Service Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigateToTab?.("marketplace")}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICE_CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all group flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/80 backdrop-blur-sm text-amber-300 text-[10px] font-bold rounded-xl border border-amber-400/40">
                  {cat.badge}
                </span>
              </div>

              <div className="p-5 space-y-2 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="font-mono font-bold text-emerald-700">{cat.count}</span>
                  <button
                    onClick={() => onNavigateToTab?.("marketplace")}
                    className="p-1.5 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 rounded-xl transition-all"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED WORKERS & VERIFIED PROFILES */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Top Rated Professionals</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Featured Domestic Staff & Artisans
            </h2>
          </div>
          <button
            onClick={() => onNavigateToTab?.("marketplace")}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-all"
          >
            Explore 4,990+ Profiles
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_WORKERS.map((worker, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 hover:border-emerald-400 transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={worker.image}
                    alt={worker.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover border border-emerald-300"
                  />
                  <div className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-600 rounded-full text-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{worker.name}</h4>
                  <p className="text-xs text-slate-500">{worker.role}</p>
                  <span className="text-[10px] text-emerald-700 font-bold">{worker.city}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-2xl text-xs space-y-1">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Experience:</span>
                  <strong className="text-slate-900">{worker.experience}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Trust Score:</span>
                  <strong className="text-emerald-700 font-mono">{worker.trustScore} pts</strong>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-xs text-slate-900">{worker.rating}</span>
                  <span className="text-[10px] text-slate-400">({worker.reviews})</span>
                </div>
                <span className="font-mono font-black text-emerald-700 text-sm">{worker.wage}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. VERIFICATION & TRUST PIPELINE */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 border border-emerald-800/80 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative p-2 bg-gradient-to-b from-amber-400/20 to-emerald-500/20 rounded-3xl border border-emerald-500/40 max-w-xs">
              <img
                src={verificationBadgeImage}
                alt="3D Gold ZRP Clearance & Verification Badge"
                referrerPolicy="no-referrer"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-xs font-bold text-amber-300">
              <ShieldCheck className="w-4 h-4" />
              <span>ZRP Police CID Clearance & Background Checks</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Strict 4-Step Verification Before Any Worker Touches Your Home
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                  <FileCheck className="w-4 h-4" />
                  <span>1. National ID Validation</span>
                </div>
                <p className="text-xs text-slate-300">Biometric identity verification against Registrar General records.</p>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>2. ZRP CID Police Clearance</span>
                </div>
                <p className="text-xs text-slate-300">Official fingerprint clearance certificate from Criminal Investigation Dept.</p>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>3. Medical & Red Cross Check</span>
                </div>
                <p className="text-xs text-slate-300">Health fitness checks, tuberculosis tests, and nurse aide certification.</p>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-1">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                  <Users className="w-4 h-4 text-sky-400" />
                  <span>4. Reference & Neighbor Audit</span>
                </div>
                <p className="text-xs text-slate-300">Direct phone call verification with previous employers in Zimbabwe.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MOBILE APP MOCKUP & SHOWCASE */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold">
              <Smartphone className="w-4 h-4 text-sky-600" />
              <span>Mobile App Available for Android & iOS</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              Manage Domestic Staff Hiring & Escrow Payouts On The Go
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Use the Zimbabwe Maids Centre mobile app to chat with candidate workers, approve weekly timesheets, track ZRP verification badges, and fund escrow with EcoCash or ZIPIT instantly.
            </p>

            <div className="space-y-3">
              {[
                "Instant WhatsApp & In-App Dual Language Messaging (Shona, Ndebele, English)",
                "One-Touch EcoCash & InnBucks Salary Escrow Deposit & Auto-Release",
                "Live GPS Distance Radius Filtering across Harare & Bulawayo suburbs",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                  <div className="p-1 bg-emerald-100 text-emerald-800 rounded-lg">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl max-w-sm">
              <img
                src={appMockupImage}
                alt="Zimbabwe Maids Centre Mobile App Mockup on Smartphone"
                referrerPolicy="no-referrer"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Verified Employer & Worker Reviews</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Trusted by 10,000+ Zimbabwean Households</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">"{t.quote}"</p>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.author}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-emerald-400"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{t.author}</h4>
                  <p className="text-[10px] text-slate-500">{t.role} • {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CONTACT & FOOTER BRANDING */}
      <footer className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800 text-xs">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-400 bg-white shrink-0 shadow-md">
                <img
                  src={ZMC_OFFICIAL_LOGO}
                  alt="Zimbabwe Maids Centre Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-sm text-white">Zimbabwe Maids Centre</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Zimbabwe's official digital platform for verified domestic staff, nannies, caregivers, and skilled household artisans.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase text-[11px] tracking-wider">Harare Office</h4>
            <p className="text-slate-400">Suite 402, Celestial Park, Borrowdale Road, Harare</p>
            <p className="text-slate-400">Phone: +263 78 545 8828</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase text-[11px] tracking-wider">Bulawayo Office</h4>
            <p className="text-slate-400">12th Avenue & Jason Moyo Street, Bulawayo Central</p>
            <p className="text-slate-400">WhatsApp: +263 78 545 8828</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-200 uppercase text-[11px] tracking-wider">Regulatory Compliance</h4>
            <p className="text-slate-400">Registered with Ministry of Public Service, Labour and Social Welfare Zimbabwe.</p>
            <span className="inline-block px-2 py-0.5 bg-emerald-900 text-emerald-300 font-bold text-[10px] rounded">
              ZRP CID Partner
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-slate-500 text-[11px] gap-2">
          <span>© 2026 Zimbabwe Maids Centre Enterprise. All Rights Reserved.</span>
          <span>Secured with SSL • Firebase ABAC • Gemini 3.6 Telemetry</span>
        </div>
      </footer>
    </div>
  );
};
