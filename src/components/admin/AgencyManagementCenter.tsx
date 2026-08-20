import React, { useState } from "react";
import {
  Building2,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Ban,
  DollarSign,
  TrendingUp,
  FileCheck,
  Users,
  Briefcase
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { AgencyProfile, AgencyPaymentRecord } from "../../types/agency";
import { PAYMENT_GATEWAY_ASSETS } from "../common/PaymentBadges";

export const AgencyManagementCenter: React.FC = () => {
  const {
    agencies,
    approveAgency,
    rejectAgency,
    toggleAgencySuspension,
    verifyAgencySubscriptionPayment,
  } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<
    "queue" | "payments" | "all-agencies" | "revenue"
  >("queue");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgencyForReview, setSelectedAgencyForReview] = useState<AgencyProfile | null>(null);
  const [selectedPaymentForReview, setSelectedPaymentForReview] = useState<{
    agency: AgencyProfile;
    payment: AgencyPaymentRecord;
  } | null>(null);

  // Derived lists
  const pendingAgencies = agencies.filter((a) => a.approvalStatus === "Pending Approval");
  
  // Pending EcoCash Payments across all agencies
  const pendingPayments: { agency: AgencyProfile; payment: AgencyPaymentRecord }[] = [];
  agencies.forEach((a) => {
    if (a.subscription.pendingPaymentRecord && a.subscription.pendingPaymentRecord.status === "Pending Review") {
      pendingPayments.push({ agency: a, payment: a.subscription.pendingPaymentRecord });
    }
  });

  const activeAgencies = agencies.filter((a) => a.approvalStatus === "Approved");
  const totalMRR = activeAgencies.filter((a) => a.subscription.status === "Active" || a.subscription.status === "Expiring Soon").length * 50;

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Navigation */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <Building2 className="w-4 h-4" />
            <span>Multi-Agency Governance & Subscriptions</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Agency Management & Subscription Verification
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit domestic placement agencies, verify CR14 compliance, and approve $50 USD EcoCash monthly subscriptions.
          </p>
        </div>

        {/* Sub Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab("queue")}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center space-x-1.5 transition-all ${
              activeSubTab === "queue"
                ? "bg-emerald-800 text-white shadow"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <span>Registration Queue</span>
            {pendingAgencies.length > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-black">
                {pendingAgencies.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab("payments")}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap flex items-center space-x-1.5 transition-all ${
              activeSubTab === "payments"
                ? "bg-emerald-800 text-white shadow"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>EcoCash Verification</span>
            {pendingPayments.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded-full text-[10px] font-black">
                {pendingPayments.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab("all-agencies")}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeSubTab === "all-agencies"
                ? "bg-emerald-800 text-white shadow"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <span>All Agencies ({agencies.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("revenue")}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeSubTab === "revenue"
                ? "bg-emerald-800 text-white shadow"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <span>MRR Revenue (${totalMRR}/mo)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: AGENCY REGISTRATION QUEUE */}
      {/* ========================================================================= */}
      {activeSubTab === "queue" && (
        <div className="space-y-4">
          {pendingAgencies.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-2 shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Agency Queue is Clear</h3>
              <p className="text-xs text-slate-500">
                All submitted domestic agency registrations have been verified and processed.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingAgencies.map((agency) => (
                <div
                  key={agency.id}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={agency.logoUrl}
                      alt={agency.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-extrabold uppercase">
                          Pending Verification
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">• {agency.city}</span>
                        <span className="text-xs text-slate-400 font-semibold">• Registered {agency.createdAt}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{agency.name}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 max-w-xl">{agency.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{agency.physicalAddress}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{agency.phone}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Mail className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{agency.email}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Documents count and Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                      <span className="text-xs font-black text-slate-900 block">
                        {agency.verificationDocuments.length} Documents
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold block">Attached for Audit</span>
                    </div>

                    <button
                      onClick={() => setSelectedAgencyForReview(agency)}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center space-x-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Audit Documents</span>
                    </button>

                    <button
                      onClick={() => approveAgency(agency.id)}
                      className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center space-x-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve & Verify</span>
                    </button>

                    <button
                      onClick={() => rejectAgency(agency.id)}
                      className="px-3 py-2.5 border border-slate-200 hover:bg-rose-50 hover:text-rose-700 rounded-xl text-xs font-bold text-slate-600 flex items-center justify-center"
                      title="Reject Agency"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: ECOCASH SUBSCRIPTION PAYMENT VERIFICATION */}
      {/* ========================================================================= */}
      {activeSubTab === "payments" && (
        <div className="space-y-4">
          {pendingPayments.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-2 shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">All EcoCash Payments Reconciled</h3>
              <p className="text-xs text-slate-500">
                No pending $50 USD monthly subscription receipts awaiting review.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingPayments.map(({ agency, payment }) => (
                <div
                  key={payment.id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-slate-300 transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg text-[10px] font-extrabold">
                        <img
                          src={PAYMENT_GATEWAY_ASSETS.ecocash}
                          alt="EcoCash"
                          referrerPolicy="no-referrer"
                          className="w-3.5 h-3.5 rounded object-cover"
                        />
                        <span>EcoCash $50/mo Verification</span>
                      </div>
                      <span className="text-xs text-slate-400 font-semibold">• Submitted {payment.submittedAt}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{agency.name}</h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1.5">
                        <img
                          src={PAYMENT_GATEWAY_ASSETS.paynow}
                          alt="Gateway"
                          referrerPolicy="no-referrer"
                          className="w-4 h-4 rounded object-contain bg-white"
                        />
                        Amount: <strong className="text-emerald-900 font-black">${payment.amountUSD} USD</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Sender: <strong className="font-mono text-slate-800">{payment.senderPhoneNumber}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Txn Ref: <strong className="font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">{payment.transactionReference}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Gateway: <strong className="text-emerald-700">Paynow Zimbabwe</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end lg:self-auto">
                    <button
                      onClick={() =>
                        verifyAgencySubscriptionPayment(agency.id, payment.id, true)
                      }
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Grant 30 Days</span>
                    </button>

                    <button
                      onClick={() =>
                        verifyAgencySubscriptionPayment(agency.id, payment.id, false, "Invalid Transaction Reference")
                      }
                      className="px-3.5 py-2.5 border border-slate-200 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-xl text-xs font-bold"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: ALL AGENCIES DIRECTORY */}
      {/* ========================================================================= */}
      {activeSubTab === "all-agencies" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Registered Placement Agencies</h3>
            <span className="text-xs text-slate-400 font-semibold">{agencies.length} Total Agencies</span>
          </div>

          <div className="divide-y divide-slate-100">
            {agencies.map((ag) => (
              <div key={ag.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={ag.logoUrl}
                    alt={ag.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-slate-900">{ag.name}</h4>
                      {ag.isVerified && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-full text-[10px] font-bold border border-emerald-200">
                          Verified Agency
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {ag.city} • {ag.phone} • {ag.email}
                    </p>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1 font-semibold">
                      <span>{ag.workerCount} Workers</span>
                      <span>•</span>
                      <span>{ag.activeJobsCount} Vacancies</span>
                      <span>•</span>
                      <span>{ag.placementsCount} Placements</span>
                      <span>•</span>
                      <span className="text-emerald-700">Sub: {ag.subscription.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <button
                    onClick={() => toggleAgencySuspension(ag.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      ag.approvalStatus === "Suspended"
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700"
                    }`}
                  >
                    {ag.approvalStatus === "Suspended" ? "Reactivate" : "Suspend"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 4: MRR REVENUE */}
      {/* ========================================================================= */}
      {activeSubTab === "revenue" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 shadow-lg">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-300">
                Agency Subscription MRR
              </span>
              <div className="text-3xl font-black text-white mt-1">${totalMRR} USD</div>
              <span className="text-xs text-emerald-200/80 block mt-1">
                From {activeAgencies.length} Licensed Agencies ($50/mo each)
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Agency Count
              </span>
              <div className="text-3xl font-black text-slate-900 mt-1">{activeAgencies.length}</div>
              <span className="text-xs text-slate-500 block mt-1">Harare, Bulawayo, Mutare & Gweru</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Primary Payment Gateway
              </span>
              <div className="text-2xl font-black text-emerald-800 mt-1">Paynow Zimbabwe</div>
              <span className="text-xs text-slate-500 block mt-1">Direct Settlement (EcoCash, Cards, InnBucks)</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AUDIT AGENCY DOCUMENTS */}
      {/* ========================================================================= */}
      {selectedAgencyForReview && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-emerald-700" />
                <h3 className="font-black text-slate-900 text-base">
                  Audit Agency Registration: {selectedAgencyForReview.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAgencyForReview(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl">
                <div>
                  <span className="text-slate-400 font-bold block">Physical Address:</span>
                  <span className="font-semibold text-slate-900">{selectedAgencyForReview.physicalAddress}, {selectedAgencyForReview.city}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Contact Person:</span>
                  <span className="font-semibold text-slate-900">{selectedAgencyForReview.contactPerson.fullName} ({selectedAgencyForReview.contactPerson.position})</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Email & Phone:</span>
                  <span className="font-semibold text-slate-900">{selectedAgencyForReview.email} • {selectedAgencyForReview.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Years in Operation:</span>
                  <span className="font-semibold text-slate-900">{selectedAgencyForReview.yearsInOperation} Years</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Attached Verification Documents:
                </h4>
                {selectedAgencyForReview.verificationDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <FileCheck className="w-4 h-4 text-emerald-700" />
                      <span className="font-bold text-slate-900">{doc.name}</span>
                      <span className="text-[10px] text-slate-400">({doc.type})</span>
                    </div>
                    <span className="text-emerald-700 font-bold text-[10px]">Verified Format</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedAgencyForReview(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                Close Audit
              </button>
              <button
                onClick={() => {
                  approveAgency(selectedAgencyForReview.id);
                  setSelectedAgencyForReview(null);
                }}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Approve Agency</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
