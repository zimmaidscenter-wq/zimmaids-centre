import React, { useState } from "react";
import { UserReferralProfile, ReferralReward } from "../../types/marketplace";
import {
  Gift,
  Share2,
  Copy,
  Check,
  Users,
  Award,
  DollarSign,
  Send,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
  Clock,
  ArrowRight,
  TrendingUp,
  Percent
} from "lucide-react";

interface ReferralProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
  onApplyDiscountToPlacement?: (voucherCode: string, discountUSD: number) => void;
}

const INITIAL_REFERRALS: ReferralReward[] = [
  {
    id: "ref-1",
    referredName: "Farai Chitepo",
    referredEmailOrPhone: "+263 77 412 8901",
    dateReferred: "2026-03-02",
    status: "Placement Completed",
    discountEarnedUSD: 20,
    discountVoucherCode: "REF-FARAI-20USD",
    isRedeemed: false,
  },
  {
    id: "ref-2",
    referredName: "Kudzai Matarise",
    referredEmailOrPhone: "kmatarise@gmail.com",
    dateReferred: "2026-03-08",
    status: "Placement Completed",
    discountEarnedUSD: 20,
    discountVoucherCode: "REF-KUDZAI-20USD",
    isRedeemed: false,
  },
  {
    id: "ref-3",
    referredName: "Nyasha Mhuri",
    referredEmailOrPhone: "+263 71 892 1104",
    dateReferred: "2026-03-12",
    status: "Registered",
    discountEarnedUSD: 0,
    discountVoucherCode: "REF-NYASHA-PENDING",
    isRedeemed: false,
  },
];

export const ReferralProgramModal: React.FC<ReferralProgramModalProps> = ({
  isOpen,
  onClose,
  userName = "Tafadzwa Tagwirei",
  userEmail = "user@zimmaids.co.zw",
  onApplyDiscountToPlacement,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [inviteEmailOrPhone, setInviteEmailOrPhone] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<ReferralReward[]>(INITIAL_REFERRALS);

  if (!isOpen) return null;

  const rawCode = userName.split(" ")[0].toUpperCase() || "VIP";
  const userReferralCode = `ZMC-REF-${rawCode}26`;
  const referralLink = `https://zimmaids.co.zw/signup?ref=${userReferralCode}`;

  const successfulPlacements = referrals.filter((r) => r.status === "Placement Completed").length;
  const availableDiscount = referrals
    .filter((r) => r.status === "Placement Completed" && !r.isRedeemed)
    .reduce((acc, curr) => acc + curr.discountEarnedUSD, 0);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userReferralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmailOrPhone.trim()) return;

    setIsSendingInvite(true);
    setTimeout(() => {
      const newRef: ReferralReward = {
        id: `ref-${Date.now()}`,
        referredName: inviteName || "Invited Friend",
        referredEmailOrPhone: inviteEmailOrPhone,
        dateReferred: new Date().toISOString().split("T")[0],
        status: "Pending Registration",
        discountEarnedUSD: 0,
        discountVoucherCode: `REF-${Date.now().toString().slice(-4)}`,
        isRedeemed: false,
      };

      setReferrals([newRef, ...referrals]);
      setIsSendingInvite(false);
      setInviteSuccessMsg(`Invitation dispatched to ${inviteEmailOrPhone}!`);
      setInviteEmailOrPhone("");
      setInviteName("");
      setTimeout(() => setInviteSuccessMsg(null), 4000);
    }, 800);
  };

  const whatsappShareText = encodeURIComponent(
    `Hello! I use Zimbabwe Maids Centre to hire vetted domestic workers, maids, and artisans with police clearance and escrow protection. Use my invite code *${userReferralCode}* to get $15 USD off your first hire!\n\nLink: ${referralLink}`
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative my-8 animate-in fade-in zoom-in duration-200">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-emerald-950/60 hover:bg-emerald-950 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-bold text-amber-300 mb-1.5 uppercase tracking-wider">
            <Gift className="w-4 h-4 text-amber-400" />
            <span>Invite & Earn Program</span>
          </div>

          <h3 className="text-2xl font-black text-white">
            Give $15, Get $20 Discount on Placement Fees
          </h3>
          <p className="text-xs text-emerald-200 mt-1 max-w-lg leading-relaxed">
            Invite friends, family, or fellow employers to Zimbabwe Maids Centre. When they complete a hire, you receive a <strong>$20 USD discount</strong> automatically credited toward your next placement fee!
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-2xl">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Invited Friends</span>
              </div>
              <div className="text-xl font-black text-emerald-950 mt-1">{referrals.length}</div>
              <div className="text-[10px] text-emerald-700">Across Zimbabwe</div>
            </div>

            <div className="bg-teal-50/80 border border-teal-200 p-3.5 rounded-2xl">
              <div className="text-[10px] font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Placements Done</span>
              </div>
              <div className="text-xl font-black text-teal-950 mt-1">{successfulPlacements}</div>
              <div className="text-[10px] text-teal-700">Earned Rewards</div>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                <span>Placement Discount</span>
              </div>
              <div className="text-xl font-black text-amber-950 mt-1">${availableDiscount} USD</div>
              <div className="text-[10px] text-amber-700 font-semibold">Ready to apply at checkout</div>
            </div>
          </div>

          {/* User's Referral Code & Link Box */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
                  Your Unique Referral Code
                </span>
                <p className="text-[11px] text-slate-300 mt-0.5">Share this code with friends or post your custom invite link:</p>
              </div>
              <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full text-xs font-black">
                Active Code
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Code Box */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block">Referral Code</span>
                  <span className="font-mono text-base font-black text-emerald-400">{userReferralCode}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {/* Link Box */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="truncate mr-2">
                  <span className="text-[9px] text-slate-400 uppercase block">Direct Link</span>
                  <span className="font-mono text-xs text-slate-300 truncate block">{referralLink}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Quick WhatsApp Share Button */}
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={`https://wa.me/?text=${whatsappShareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[200px] flex items-center justify-center space-x-2 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-98"
              >
                <MessageSquare className="w-4 h-4 fill-slate-950" />
                <span>Share via WhatsApp</span>
              </a>

              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Copy Invite URL</span>
              </button>
            </div>
          </div>

          {/* Quick Direct Invite Form */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-emerald-600" />
              <span>Send Direct Invitation</span>
            </h4>

            {inviteSuccessMsg && (
              <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{inviteSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSendInvite} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Friend's Full Name"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                required
                placeholder="WhatsApp # or Email Address"
                value={inviteEmailOrPhone}
                onChange={(e) => setInviteEmailOrPhone(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={isSendingInvite}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingInvite ? "Sending..." : "Send Invite"}</span>
              </button>
            </form>
          </div>

          {/* Referral Reward Milestones */}
          <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-4 rounded-2xl border border-emerald-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>Placement Fee Discount Milestones</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">Lifetime Rewards</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-amber-400 font-black text-xs block">Tier 1: 1 Friend</span>
                <p className="text-[11px] text-slate-300">$20 USD Instant Discount on next 30% placement fee.</p>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-amber-400 font-black text-xs block">Tier 2: 3 Friends</span>
                <p className="text-[11px] text-slate-300">50% OFF Next Placement Fee + 1 Month Free WhatsApp Alerts.</p>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-black text-xs block">Tier 3: 5 Friends</span>
                <p className="text-[11px] text-slate-300">100% FREE Placement Fee (Platform absorbs 100% of charge!).</p>
              </div>
            </div>
          </div>

          {/* Referral Tracking List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Your Referral Tracking Ledger</span>
              </h4>
              <span className="text-[10px] text-slate-500 font-semibold">{referrals.length} Total</span>
            </div>

            <div className="space-y-2">
              {referrals.map((ref) => (
                <div
                  key={ref.id}
                  className="bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-emerald-400 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-xs">{ref.referredName}</span>
                      <span
                        className={`px-2 py-0.2 rounded-full text-[9px] font-black uppercase ${
                          ref.status === "Placement Completed"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : ref.status === "Registered"
                            ? "bg-teal-100 text-teal-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {ref.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {ref.referredEmailOrPhone} • Invited on {ref.dateReferred}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase block">Voucher Code</span>
                      <span className="font-mono text-xs font-bold text-slate-800">{ref.discountVoucherCode}</span>
                    </div>

                    {ref.status === "Placement Completed" && (
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-xs">
                          +${ref.discountEarnedUSD} USD
                        </span>
                        {onApplyDiscountToPlacement && (
                          <button
                            type="button"
                            onClick={() => {
                              onApplyDiscountToPlacement(ref.discountVoucherCode, ref.discountEarnedUSD);
                              onClose();
                            }}
                            className="px-2.5 py-1 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-[10px] rounded-xl transition-colors"
                          >
                            Apply
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Current balance: <span className="font-bold text-emerald-700">${availableDiscount} USD in placement credits</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
