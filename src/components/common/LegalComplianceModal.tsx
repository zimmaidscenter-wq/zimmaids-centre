import React, { useState } from "react";
import {
  ShieldCheck,
  FileText,
  Lock,
  Scale,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Send,
  Cookie,
  UserX,
  Download,
  Printer,
  ChevronRight,
  Info
} from "lucide-react";
import { DataDeletionTicket } from "../../types/marketplace";

interface LegalComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "privacy" | "terms" | "placement" | "guidelines" | "cookies" | "deletion";
}

export const LegalComplianceModal: React.FC<LegalComplianceModalProps> = ({
  isOpen,
  onClose,
  initialTab = "privacy",
}) => {
  const [activeTab, setActiveTab] = useState<
    "privacy" | "terms" | "placement" | "guidelines" | "cookies" | "deletion"
  >(initialTab);

  // Data Deletion Form States
  const [delFullName, setDelFullName] = useState("");
  const [delPhoneOrEmail, setDelPhoneOrEmail] = useState("");
  const [delNationalId, setDelNationalId] = useState("");
  const [delReason, setDelReason] = useState("No longer seeking domestic staffing / employment in Zimbabwe.");
  const [delUserRole, setDelUserRole] = useState("Employer");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [deletionTicket, setDeletionTicket] = useState<DataDeletionTicket | null>(null);

  if (!isOpen) return null;

  const handleDataDeletionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delFullName || !delPhoneOrEmail) return;

    const ticket: DataDeletionTicket = {
      id: `DEL-${Date.now().toString().slice(-6)}`,
      fullName: delFullName,
      phoneOrEmail: delPhoneOrEmail,
      nationalIdNumber: delNationalId || "Provided via account",
      reason: delReason,
      submittedAt: new Date().toISOString().split("T")[0],
      status: "Received",
      targetUserRole: delUserRole as any,
    };

    setDeletionTicket(ticket);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Legal & Compliance Hub
              </h2>
              <p className="text-xs text-slate-400">
                Statutory regulatory agreements, Privacy terms & Zimbabwe Data Protection Act compliance.
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
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto">
          {[
            { id: "privacy", label: "Privacy Policy", icon: Lock },
            { id: "terms", label: "Terms & Conditions", icon: FileText },
            { id: "placement", label: "Placement Fee Agreement", icon: Scale },
            { id: "guidelines", label: "Community Guidelines", icon: ShieldCheck },
            { id: "cookies", label: "Cookie Policy", icon: Cookie },
            { id: "deletion", label: "Data Deletion Request", icon: Trash2 },
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
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-slate-300 text-sm leading-relaxed">
          {/* 1. Privacy Policy */}
          {activeTab === "privacy" && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  Privacy Policy & Data Protection Act Compliance
                </h3>
                <p className="text-xs text-emerald-200 mt-1">
                  Last Updated: March 2026 • Complies with the Zimbabwe Cyber & Data Protection Act [Chapter 12:07].
                </p>
              </div>

              <h4 className="font-bold text-white text-sm">1. Data Collection & Purpose</h4>
              <p className="text-xs text-slate-300">
                Zimbabwe Maids Centre collects user credentials, National Identity card numbers, and Police Clearance certificates solely for the purpose of identity vetting, criminal record screening, and connecting employers with domestic workers and artisans.
              </p>

              <h4 className="font-bold text-white text-sm">2. Phone Number & Privacy Protection</h4>
              <p className="text-xs text-slate-300">
                Candidate contact details (direct telephone and WhatsApp numbers) are masked by default to prevent harassment and unauthorized solicitations. Direct access is unlocked strictly through verified Premium employer accounts or placement settlement agreements.
              </p>

              <h4 className="font-bold text-white text-sm">3. Biometric & Document Storage Security</h4>
              <p className="text-xs text-slate-300">
                All uploaded documents (including National IDs and Police Clearance certificates) are encrypted at rest using AES-256 protocols and stored on isolated cloud infrastructure. We do not sell or monetize personal demographic data.
              </p>

              <h4 className="font-bold text-white text-sm">4. Your Statutory Data Rights</h4>
              <p className="text-xs text-slate-300">
                Users retain the right to inspect, update, port, or request permanent deletion of their personal records and uploaded documents at any time using our automated Data Deletion portal.
              </p>
            </div>
          )}

          {/* 2. Terms and Conditions */}
          {activeTab === "terms" && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Platform Terms of Service & Placement Standards
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Governing employer conduct, worker accreditation, and domestic staffing arrangements across Zimbabwe.
                </p>
              </div>

              <h4 className="font-bold text-white text-sm">1. Verification Integrity</h4>
              <p className="text-xs text-slate-300">
                Candidates must provide authentic, unmodified National IDs and criminal record clearance documents. Providing forged police clearance certificates or false identity records constitutes grounds for immediate lifetime blacklisting and referral to regulatory authorities.
              </p>

              <h4 className="font-bold text-white text-sm">2. Employer Obligations & Fair Treatment</h4>
              <p className="text-xs text-slate-300">
                Employers agree to adhere to the statutory minimum wage standards, statutory off-days, nutritious food provisions (for live-in helpers), and respectful working conditions pursuant to the Zimbabwe Labour Act [Chapter 28:01] and Statutory Instrument 103 of 2021.
              </p>

              <h4 className="font-bold text-white text-sm">3. Platform Independence</h4>
              <p className="text-xs text-slate-300">
                Zimbabwe Maids Centre operates as a digital vetting directory and matching platform. While we conduct rigorous identity, reference, and police record checks, the primary employment contract exists directly between the household employer and the worker.
              </p>
            </div>
          )}

          {/* 3. Placement Fee Agreement */}
          {activeTab === "placement" && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-blue-950/40 border border-blue-500/30 rounded-2xl">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-400" />
                  Official Placement Fee & 30-Day Replacement Agreement
                </h3>
                <p className="text-xs text-blue-200 mt-1">
                  Fair, transparent, one-time placement compensation with guarantee warranty.
                </p>
              </div>

              <h4 className="font-bold text-white text-sm">1. Standard 10% Placement Settlement</h4>
              <p className="text-xs text-slate-300">
                Upon hiring a vetted domestic candidate from the Zimbabwe Maids Centre directory, the hiring employer agrees to settle a one-time platform placement fee equivalent to 10% of the candidate's first-month agreed salary (e.g. $20 for a $200/month maid).
              </p>

              <h4 className="font-bold text-white text-sm">2. 30-Day Free Candidate Replacement Guarantee</h4>
              <p className="text-xs text-slate-300">
                Every verified placement fee payment includes a 30-day comprehensive candidate warranty. If a worker leaves or fails to meet the household's agreed standards within 30 days of commencement, Zimbabwe Maids Centre provides up to two (2) free vetted replacements without additional placement fees.
              </p>

              <h4 className="font-bold text-white text-sm">3. Payment Channels</h4>
              <p className="text-xs text-slate-300">
                Settlements are accepted securely via EcoCash USD, InnBucks, Zipit (ZWG), Visa/Mastercard, or direct cash settlement at accredited agency service points.
              </p>
            </div>
          )}

          {/* 4. Community Guidelines */}
          {activeTab === "guidelines" && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-2xl">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Community Guidelines & Domestic Dignity Code
                </h3>
                <p className="text-xs text-amber-200 mt-1">
                  Zero tolerance for abuse, wage withholding, or discriminatory conduct.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-1">
                  <h5 className="font-bold text-white">For Employers:</h5>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300">
                    <li>Pay full agreed wages punctually on the agreed monthly date.</li>
                    <li>Provide safe, hygienic living conditions and private bedding for live-in staff.</li>
                    <li>Honor agreed rest days and reasonable working hours.</li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-1">
                  <h5 className="font-bold text-white">For Domestic Staff:</h5>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300">
                    <li>Exercise the highest standard of honesty, punctuality, and infant safety.</li>
                    <li>Respect household privacy and confidential domestic affairs.</li>
                    <li>Give minimum 14 days handover notice before departing an active post.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 5. Cookie Policy */}
          {activeTab === "cookies" && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-slate-800 border border-slate-700 rounded-2xl">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Cookie className="w-4 h-4 text-emerald-400" />
                  Cookie Policy & Local Session Management
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  How we use local storage and session data for performance and security.
                </p>
              </div>

              <p className="text-xs text-slate-300">
                We use strictly essential browser storage to preserve user login tokens, currency preferences (USD vs. ZWG), offline draft job applications, and security verification session states. We do not engage in invasive third-party cross-site advertising tracking.
              </p>
            </div>
          )}

          {/* 6. Data Deletion Request Process */}
          {activeTab === "deletion" && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-rose-950/40 border border-rose-500/30 rounded-2xl">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  Statutory Data Erasure & Account Deletion Request
                </h3>
                <p className="text-xs text-rose-200 mt-1">
                  Exercise your statutory Right to Erasure under the Zimbabwe Cyber and Data Protection Act [Chapter 12:07].
                </p>
              </div>

              {isSubmitted && deletionTicket ? (
                <div className="p-5 bg-emerald-950/80 border border-emerald-500 rounded-2xl space-y-3 animate-fade-in">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                    <h4 className="font-bold text-base text-white">Data Deletion Request Queued</h4>
                  </div>
                  <p className="text-xs text-slate-300">
                    Your erasure ticket has been recorded with reference number:
                  </p>
                  <div className="p-3 bg-slate-900 rounded-xl border border-emerald-500/50 flex justify-between items-center">
                    <span className="text-sm font-mono font-bold text-emerald-400">{deletionTicket.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-md">
                      STATUS: RECEIVED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    All associated personal records, uploaded National ID copies, and active job postings will be permanently purged within 48 business hours after compliance verification.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setDeletionTicket(null);
                    }}
                    className="mt-2 text-xs font-semibold text-emerald-400 underline hover:text-emerald-300"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDataDeletionSubmit} className="space-y-4">
                  <p className="text-xs text-slate-300">
                    Please provide your account details below. Our compliance officer will verify identity before purging personal data, documents, and directory records:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tendai Mukamuri"
                        value={delFullName}
                        onChange={(e) => setDelFullName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Phone or Email</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. +263 77 123 4567"
                        value={delPhoneOrEmail}
                        onChange={(e) => setDelPhoneOrEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">National ID Number (For Audit)</label>
                      <input
                        type="text"
                        placeholder="e.g. 63-1234567-A-42"
                        value={delNationalId}
                        onChange={(e) => setDelNationalId(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Account Role</label>
                      <select
                        value={delUserRole}
                        onChange={(e) => setDelUserRole(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                      >
                        <option value="Domestic worker">Domestic Worker</option>
                        <option value="Employer">Household Employer</option>
                        <option value="Agency">Staffing Agency</option>
                        <option value="Artisan">Artisan / Specialist</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Erasure</label>
                    <textarea
                      rows={2}
                      value={delReason}
                      onChange={(e) => setDelReason(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Submit Deletion Ticket</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zimbabwe Republic Law & Regulatory Compliance</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
