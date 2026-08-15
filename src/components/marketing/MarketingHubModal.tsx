import React, { useState } from "react";
import {
  Sparkles,
  Award,
  Building,
  Briefcase,
  Star,
  BookOpen,
  HelpCircle,
  MessageCircle,
  TrendingUp,
  Tag,
  CheckCircle2,
  X,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Clock,
  Heart,
  Send,
  Bot
} from "lucide-react";
import { WorkerProfile, JobPosting } from "../../types/marketplace";

interface MarketingHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
  currency?: "USD" | "ZWG";
}

export const MarketingHubModal: React.FC<MarketingHubModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  currency = "USD",
}) => {
  const [activeTab, setActiveTab] = useState<
    "featured" | "promotions" | "stories" | "blog" | "faqs" | "live_chat"
  >("featured");

  const [faqSearch, setFaqSearch] = useState("");
  const [faqCategory, setFaqCategory] = useState<"All" | "Employers" | "Workers" | "Agencies">("All");

  // Live Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "ai" | "user"; text: string; time: string }>>([
    {
      sender: "ai",
      text: "Hello! I am your Zimbabwe Maids Centre Domestic Staffing Assistant. How can I help you find or place verified domestic staff today?",
      time: "Just now",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  if (!isOpen) return null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    const newMsg = { sender: "user" as const, text: userText, time: "Just now" };
    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput("");

    // AI Response simulation
    setTimeout(() => {
      let reply = "All our domestic workers and artisans have verified National IDs, CID police clearances, and contacted reference letters. Would you like me to match you with a candidate in your suburb?";
      if (userText.toLowerCase().includes("cost") || userText.toLowerCase().includes("fee") || userText.toLowerCase().includes("price")) {
        reply = "Our standard placement fee is a transparent 10% of the candidate's monthly salary (e.g. $20 for a $200/mo maid) and includes a 30-day free replacement guarantee!";
      } else if (userText.toLowerCase().includes("nanny") || userText.toLowerCase().includes("baby")) {
        reply = "We have 890+ Red Cross certified infant nannies and toddler caregivers available in Harare, Bulawayo, and Mutare.";
      } else if (userText.toLowerCase().includes("police") || userText.toLowerCase().includes("vetting")) {
        reply = "Every verified worker undergoes strict biometric fingerprint vetting from CID Headquarters Morris Depot before being listed.";
      }
      setChatMessages((prev) => [...prev, { sender: "ai", text: reply, time: "Just now" }]);
    }, 600);
  };

  const FEATURED_WORKERS = [
    {
      id: "fw-1",
      name: "Tendai Mukamuri",
      role: "Domestic Worker & Cook",
      location: "Borrowdale, Harare",
      rating: 4.9,
      reviews: 38,
      salary: "$220/mo",
      experience: "6 yrs",
      badge: "CID Police Clear & Red Cross",
      photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=300",
    },
    {
      id: "fw-2",
      name: "Nomsa Sibanda",
      role: "Infant Caregiver & Nanny",
      location: "Kumalo, Bulawayo",
      rating: 5.0,
      reviews: 29,
      salary: "$240/mo",
      experience: "5 yrs",
      badge: "ECD Diploma & Infant First Aid",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    },
    {
      id: "fw-3",
      name: "Blessing Moyo",
      role: "Class 1 Electrician & Solar",
      location: "Avondale, Harare",
      rating: 4.95,
      reviews: 52,
      salary: "$25/visit",
      experience: "8 yrs",
      badge: "Class 1 Journeyman",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    },
  ];

  const FEATURED_AGENCIES = [
    {
      name: "Premier Domestic Staffing Agency",
      location: "Harare CBD & Borrowdale",
      staffCount: "140+ Placed",
      rating: 4.9,
      accreditation: "Accredited Agency Tier 1",
      specialty: "High-density & Low-density residential domestic staff",
    },
    {
      name: "Bulawayo Home & Childcare Services",
      location: "Bulawayo Central & Hillside",
      staffCount: "85+ Placed",
      rating: 4.85,
      accreditation: "Accredited Agency Tier 1",
      specialty: "Nannies, Elderly Nurse Aides & Garden Specialists",
    },
  ];

  const BLOG_POSTS = [
    {
      id: "blog-1",
      title: "How to Ensure Solar Backup Battery Longevity with Household Staff",
      readTime: "4 min read",
      category: "Home Systems Care",
      excerpt: "Step-by-step guidance on training domestic staff to manage inverter heavy loads during ZESA power shedding in Zimbabwe.",
      date: "Aug 12, 2026",
    },
    {
      id: "blog-2",
      title: "Understanding Domestic Worker Minimum Wages & Statutory Instrument 103 of 2021",
      readTime: "6 min read",
      category: "Labour Compliance",
      excerpt: "A practical guide for Zimbabwean homeowners on fair domestic employment contracts, off-day regulations, and paid rest.",
      date: "Aug 05, 2026",
    },
    {
      id: "blog-3",
      title: "Infant Choking & Toddler Emergency First Aid Guide for Nannies",
      readTime: "5 min read",
      category: "Child Safety",
      excerpt: "Essential Red Cross certified first aid techniques that every professional child caregiver must know in the home.",
      date: "Jul 28, 2026",
    },
  ];

  const FAQS = [
    {
      category: "Employers",
      q: "How are workers vetted on Zimbabwe Maids Centre?",
      a: "Every candidate undergoes a mandatory 3-step audit: 1) Physical National ID biometric and OCR check, 2) Criminal record vetting certificate issued by CID Headquarters, and 3) Direct telephone reference checks with former household employers.",
    },
    {
      category: "Employers",
      q: "What is the 10% placement fee and does it include a warranty?",
      a: "Yes! When you hire a verified candidate, you pay a one-time 10% placement fee of the first month's salary. This includes our 30-Day Free Replacement Guarantee: if the placement doesn't work out, we provide up to 2 vetted replacements at no extra charge.",
    },
    {
      category: "Workers",
      q: "Is there any registration fee for domestic workers looking for jobs?",
      a: "No. Registration and job applications for workers are 100% free. We believe in fair domestic empowerment without predatory applicant charges.",
    },
    {
      category: "Agencies",
      q: "How can staffing agencies list their candidates in bulk?",
      a: "Accredited agencies can use our Agency Pro Dashboard to bulk import candidate photos, police clearances, and skills via WhatsApp sync or CSV spreadsheet.",
    },
  ];

  const filteredFaqs = FAQS.filter((f) => {
    const matchesCategory = faqCategory === "All" || f.category === faqCategory;
    const matchesSearch =
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.a.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Marketing, Knowledge & Live Support
              </h2>
              <p className="text-xs text-slate-400">
                Featured Spotlight, Promotional Vouchers, Success Stories, Household Blog & Live AI Assistant.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Navigation Tabs */}
        <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto">
          {[
            { id: "featured", label: "Featured Spotlight", icon: Award },
            { id: "promotions", label: "Promotions & Vouchers", icon: Tag },
            { id: "stories", label: "Success Stories", icon: Heart },
            { id: "blog", label: "Household Tips Blog", icon: BookOpen },
            { id: "faqs", label: "Searchable FAQs", icon: HelpCircle },
            { id: "live_chat", label: "Live Support Chat", icon: MessageCircle },
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "bg-emerald-500 text-slate-950 shadow-md"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-5">
          {/* 1. Featured Workers & Agencies */}
          {activeTab === "featured" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    Top-Rated Featured Workers of the Week
                  </h3>
                  <span className="text-xs text-emerald-400 font-semibold">100% Police Vetted</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {FEATURED_WORKERS.map((w) => (
                    <div
                      key={w.id}
                      className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl flex flex-col justify-between hover:border-emerald-500/50 transition-all group"
                    >
                      <div>
                        <div className="flex items-center space-x-3 mb-3">
                          <img
                            src={w.photo}
                            alt={w.name}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500/40"
                          />
                          <div>
                            <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                              {w.name}
                            </h4>
                            <p className="text-xs text-slate-400">{w.role}</p>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-300">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Location:</span>
                            <span className="font-medium text-white">{w.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Rating:</span>
                            <span className="text-amber-400 font-bold flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-400" /> {w.rating} ({w.reviews})
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Rate:</span>
                            <span className="text-emerald-400 font-bold">{w.salary}</span>
                          </div>
                        </div>

                        <div className="mt-3 p-2 bg-slate-900 rounded-xl border border-slate-800 text-[10px] text-emerald-300 font-medium">
                          🛡️ {w.badge}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (onNavigateToTab) {
                            onNavigateToTab("marketplace");
                            onClose();
                          }
                        }}
                        className="mt-4 w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1"
                      >
                        <span>View Profile & Hire</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Agencies */}
              <div className="pt-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <Building className="w-4 h-4 text-blue-400" />
                  Accredited Staffing Agencies
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {FEATURED_AGENCIES.map((agency, i) => (
                    <div
                      key={i}
                      className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-2 hover:border-blue-500/40 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-white text-sm">{agency.name}</h4>
                          <p className="text-xs text-slate-400">{agency.location}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                          {agency.accreditation}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{agency.specialty}</p>
                      <div className="flex justify-between items-center pt-2 text-xs text-slate-400 border-t border-slate-700/60">
                        <span>{agency.staffCount}</span>
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400" /> {agency.rating} Star Rating
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. Promotions & Vouchers */}
          {activeTab === "promotions" && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-3xl relative overflow-hidden">
                <div className="space-y-2 relative z-10 max-w-lg">
                  <span className="px-2.5 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-extrabold rounded-full">
                    SPRING PLACEMENT PROMO
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Save $20 Off Your Next Household Placement Fee
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Use promo voucher code at checkout to receive an instant $20 discount when hiring any vetted domestic worker or nanny.
                  </p>
                  <div className="flex items-center space-x-3 pt-2">
                    <div className="px-4 py-2 bg-slate-950 border border-dashed border-emerald-400 rounded-xl font-mono font-bold text-emerald-400 text-sm">
                      ZMC-SAVE20
                    </div>
                    <span className="text-xs text-slate-400">Valid for all EcoCash & InnBucks settlements</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Refer a Friend & Earn $20 Credits</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Share your unique referral link with fellow homeowners in Harare and Bulawayo.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (onNavigateToTab) {
                      onNavigateToTab("marketplace");
                      onClose();
                    }
                  }}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
                >
                  Open Referrals
                </button>
              </div>
            </div>
          )}

          {/* 3. Verified Success Stories */}
          {activeTab === "stories" && (
            <div className="space-y-4 animate-fade-in">
              {[
                {
                  author: "Dr. & Mrs. Chidzero (Borrowdale)",
                  role: "Homeowners with 2 toddlers",
                  story: "We had struggled for months to find an infant caregiver with verified Red Cross certification. Within 24 hours of contacting Zimbabwe Maids Centre, we interviewed Nomsa and completed vetting. She has been a blessing to our family for 18 months!",
                  worker: "Placed: Nomsa S. (Nanny)",
                },
                {
                  author: "Mr. T. Hove (Hillside, Bulawayo)",
                  role: "Homeowner Caring for Elderly Parent",
                  story: "The police CID clearance report gave us absolute peace of mind. Our nurse aide is compassionate, punctual, and highly professional.",
                  worker: "Placed: Mercy D. (Nurse Aide)",
                },
                {
                  author: "Tendai Mukamuri (Domestic Specialist)",
                  role: "Verified Professional Housekeeper",
                  story: "Zimbabwe Maids Centre treated me with dignity, helped me get my police clearance certificate, and connected me with an employer who respects my working hours and pays my salary on time.",
                  worker: "Worker Career Testimonial",
                },
              ].map((story, i) => (
                <div key={i} className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-sm">{story.author}</h4>
                      <p className="text-xs text-emerald-400 font-medium">{story.role}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full">
                      VERIFIED PLACEMENT
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">"{story.story}"</p>
                  <p className="text-[11px] text-slate-400 font-semibold pt-1 border-t border-slate-700/60">
                    {story.worker}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* 4. Blog & Household Tips */}
          {activeTab === "blog" && (
            <div className="space-y-3 animate-fade-in">
              {BLOG_POSTS.map((post) => (
                <div
                  key={post.id}
                  className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl hover:border-emerald-500/40 transition-all space-y-2 group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 bg-slate-900 text-emerald-400 font-semibold rounded-md">
                      {post.category}
                    </span>
                    <span>{post.readTime} • {post.date}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{post.excerpt}</p>
                </div>
              ))}
            </div>
          )}

          {/* 5. Searchable FAQs */}
          {activeTab === "faqs" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <input
                  type="text"
                  placeholder="Search questions e.g. police clearance, fees, warranty..."
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  className="px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 flex-1 min-w-[200px]"
                />
                <div className="flex space-x-1">
                  {(["All", "Employers", "Workers", "Agencies"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFaqCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        faqCategory === cat ? "bg-emerald-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredFaqs.map((faq, i) => (
                  <div key={i} className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-1.5">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      {faq.q}
                    </h4>
                    <p className="text-xs text-slate-300 pl-6 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Live Support Chat */}
          {activeTab === "live_chat" && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 max-h-60 overflow-y-auto space-y-3">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-emerald-500 text-slate-950 font-semibold rounded-br-none"
                          : "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none"
                      }`}
                    >
                      <div className="flex items-center space-x-1 mb-1 opacity-75 text-[10px]">
                        {msg.sender === "ai" ? (
                          <span className="flex items-center gap-1 font-bold text-emerald-400">
                            <Bot className="w-3 h-3" /> ZMC Assistant
                          </span>
                        ) : (
                          <span>You</span>
                        )}
                        <span>• {msg.time}</span>
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Ask a question about worker vetting, rates, or guarantees..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center space-x-1 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>

              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span>Need urgent human domestic care consultation?</span>
                <a
                  href="https://wa.me/263785458828?text=Hello%20Zimbabwe%20Maids%20Centre%20Human%20Support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                >
                  <span>Connect via WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Zimbabwe Maids Centre • Verified Domestic Staffing Marketplace</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
