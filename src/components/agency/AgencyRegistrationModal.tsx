import React, { useState } from "react";
import {
  Building2,
  ShieldCheck,
  CreditCard,
  FileText,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Upload,
  ArrowRight,
  ArrowLeft,
  X,
  Phone,
  Mail,
  MapPin,
  Globe,
  Clock,
  Sparkles,
  Info,
  Copy,
  Check,
  FileCheck
} from "lucide-react";
import { CityLocation } from "../../types/marketplace";
import { AgencyDocumentType, AgencyRegistrationFormInput } from "../../types/agency";
import { useAuth } from "../../context/AuthContext";
import { PAYMENT_GATEWAY_ASSETS } from "../common/PaymentBadges";

const ZIM_CITIES: CityLocation[] = [
  "Harare",
  "Bulawayo",
  "Chitungwiza",
  "Mutare",
  "Gweru",
  "Kwekwe",
  "Kadoma",
  "Masvingo",
  "Chinhoyi",
  "Norton",
  "Marondera",
  "Ruwa",
  "Victoria Falls",
  "Hwange",
  "Zvishavane",
  "Beitbridge",
];

interface AgencyRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AgencyRegistrationModal: React.FC<AgencyRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { registerAgency } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form State
  const [businessData, setBusinessData] = useState({
    name: "",
    tradingName: "",
    businessRegNumber: "",
    physicalAddress: "",
    city: "Harare" as CityLocation,
    province: "Harare Province",
    email: "",
    phone: "",
    whatsappNumber: "",
    website: "",
    description: "",
    yearsInOperation: 3,
    logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200",
  });

  const [contactPerson, setContactPerson] = useState({
    fullName: "",
    position: "Managing Director",
    phone: "",
    email: "",
  });

  const [uploadedDocs, setUploadedDocs] = useState<
    { type: AgencyDocumentType; name: string; fileUrl: string }[]
  >([
    {
      type: "Certificate of Incorporation",
      name: "Certificate_of_Incorporation_2026.pdf",
      fileUrl: "https://zimmaidscentre.co.zw/sample_inc.pdf",
    },
    {
      type: "National ID of Owner/Manager",
      name: "Owner_National_ID.pdf",
      fileUrl: "https://zimmaidscentre.co.zw/sample_id.pdf",
    },
    {
      type: "Proof of Business Address",
      name: "Commercial_Lease_Agreement.pdf",
      fileUrl: "https://zimmaidscentre.co.zw/sample_lease.pdf",
    },
  ]);

  const [paymentData, setPaymentData] = useState({
    senderPhone: "",
    transactionRef: "",
    proofFileName: "EcoCash_Payment_Receipt.png",
    proofUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400",
  });

  if (!isOpen) return null;

  const handleAddDocument = (type: AgencyDocumentType) => {
    const newDocName = `${type.replace(/\s+/g, "_")}_${Date.now().toString().slice(-4)}.pdf`;
    setUploadedDocs((prev) => [
      ...prev,
      {
        type,
        name: newDocName,
        fileUrl: "https://zimmaidscentre.co.zw/uploaded_doc.pdf",
      },
    ]);
  };

  const handleRemoveDoc = (index: number) => {
    setUploadedDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const input: AgencyRegistrationFormInput = {
      name: businessData.name || "Domestic Placement Agency",
      tradingName: businessData.tradingName,
      businessRegNumber: businessData.businessRegNumber,
      physicalAddress: businessData.physicalAddress || "Central Business District, Zimbabwe",
      city: businessData.city,
      province: businessData.province,
      email: businessData.email || "agency@zimmaids.co.zw",
      phone: businessData.phone || "+263 785 458 828",
      whatsappNumber: businessData.whatsappNumber || businessData.phone || "+263 785 458 828",
      website: businessData.website,
      logoUrl: businessData.logoUrl,
      description: businessData.description || "Licensed recruitment agency for vetted household professionals.",
      yearsInOperation: businessData.yearsInOperation,
      contactPerson: {
        fullName: contactPerson.fullName || "Agency Director",
        position: contactPerson.position || "Director",
        phone: contactPerson.phone || businessData.phone || "+263 785 458 828",
        email: contactPerson.email || businessData.email || "director@agency.co.zw",
      },
      documents: uploadedDocs,
      ecoCashSenderPhone: paymentData.senderPhone,
      ecoCashTransactionRef: paymentData.transactionRef,
      proofFileName: paymentData.proofFileName,
      proofOfPaymentUrl: paymentData.proofUrl,
    };

    setTimeout(() => {
      registerAgency(input);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      if (onSuccess) onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-emerald-950/60 hover:bg-emerald-950 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl">
              <Building2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-300">
                Official Agency Portal
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Register Domestic Placement Agency
              </h2>
            </div>
          </div>
          <p className="text-xs text-emerald-100/80 max-w-xl">
            Join Zimbabwe&apos;s leading recruitment marketplace. Publish vetted candidates, manage domestic staff, and access direct employer placements.
          </p>

          {/* Stepper Progress */}
          {!submitSuccess && (
            <div className="grid grid-cols-4 gap-2 mt-5">
              {[
                { num: 1, label: "Business Info" },
                { num: 2, label: "Contact Person" },
                { num: 3, label: "Documents" },
                { num: 4, label: "Subscription" },
              ].map((s) => (
                <div
                  key={s.num}
                  className={`border-t-2 pt-2 transition-all ${
                    step >= s.num
                      ? "border-emerald-400 text-white font-bold"
                      : "border-emerald-900/60 text-emerald-400/50"
                  }`}
                >
                  <span className="text-[10px] block">Step {s.num}</span>
                  <span className="text-xs truncate block">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submitSuccess ? (
            <div className="text-center py-8 space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                Agency Registration Submitted!
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your agency application is now in <strong className="text-emerald-700 font-bold">Pending Approval</strong> status. Our administrator team will review your business registration documents and EcoCash monthly subscription payment.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Agency Name:</span>
                  <span className="font-bold text-slate-900">{businessData.name || "Your Agency"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Monthly Plan:</span>
                  <span className="font-bold text-emerald-800">$50 USD / month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Review Turnaround:</span>
                  <span className="font-bold text-slate-900">Within 2 to 4 hours</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-sm shadow-md shadow-emerald-700/20 transition-all"
                >
                  Access Agency Portal
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* STEP 1: BUSINESS INFORMATION */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-900">Company & Business Information</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Agency Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={businessData.name}
                        onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })}
                        placeholder="e.g. Premier Domestic Placements"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Trading Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={businessData.tradingName}
                        onChange={(e) => setBusinessData({ ...businessData, tradingName: e.target.value })}
                        placeholder="e.g. Premier Maids Zimbabwe"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Business Reg / CR14 Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={businessData.businessRegNumber}
                        onChange={(e) => setBusinessData({ ...businessData, businessRegNumber: e.target.value })}
                        placeholder="e.g. CO-ZIM-2023-9912"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Years in Operation
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={businessData.yearsInOperation}
                        onChange={(e) => setBusinessData({ ...businessData, yearsInOperation: parseInt(e.target.value) || 1 })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Physical Office Address <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={businessData.physicalAddress}
                        onChange={(e) => setBusinessData({ ...businessData, physicalAddress: e.target.value })}
                        placeholder="e.g. Suite 4, Borrowdale Shopping Centre, Harare"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        City / Base <span className="text-rose-600">*</span>
                      </label>
                      <select
                        value={businessData.city}
                        onChange={(e) => setBusinessData({ ...businessData, city: e.target.value as CityLocation, province: `${e.target.value} Province` })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      >
                        {ZIM_CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Official Agency Email <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={businessData.email}
                        onChange={(e) => setBusinessData({ ...businessData, email: e.target.value })}
                        placeholder="e.g. contact@premiermaids.co.zw"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Office Phone Number <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={businessData.phone}
                        onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
                        placeholder="e.g. +263 242 884 920"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        WhatsApp Business Number
                      </label>
                      <input
                        type="tel"
                        value={businessData.whatsappNumber}
                        onChange={(e) => setBusinessData({ ...businessData, whatsappNumber: e.target.value })}
                        placeholder="e.g. +263 772 450 119"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Agency Bio & Services Offered
                      </label>
                      <textarea
                        rows={2}
                        value={businessData.description}
                        onChange={(e) => setBusinessData({ ...businessData, description: e.target.value })}
                        placeholder="Describe your domestic staffing specialization (e.g. vetted housekeepers, nannies, elderly caregivers, chefs)..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-2"
                    >
                      <span>Continue to Contact Person</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: CONTACT PERSON */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                    <UserCheck className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-900">Principal Recruiter / Contact Person</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Contact Full Name <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={contactPerson.fullName}
                        onChange={(e) => setContactPerson({ ...contactPerson, fullName: e.target.value })}
                        placeholder="e.g. Mrs. Florence Chitembwe"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Position / Title <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={contactPerson.position}
                        onChange={(e) => setContactPerson({ ...contactPerson, position: e.target.value })}
                        placeholder="e.g. Managing Director & Recruiter"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mobile Phone Number <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={contactPerson.phone}
                        onChange={(e) => setContactPerson({ ...contactPerson, phone: e.target.value })}
                        placeholder="e.g. +263 772 450 119"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Direct Email Address <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={contactPerson.email}
                        onChange={(e) => setContactPerson({ ...contactPerson, email: e.target.value })}
                        placeholder="e.g. florence@premiermaids.co.zw"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-start space-x-3 text-xs text-emerald-900">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Principal Recruiter Responsibility</p>
                      <p className="text-emerald-800/90 text-[11px] mt-0.5">
                        This contact person will be designated as the primary account administrator for staff onboarding, candidate verification reviews, and placement fee reconciliation.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center space-x-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-2"
                    >
                      <span>Continue to Documents</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: VERIFICATION DOCUMENTS */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-900">Upload Verification & Compliance Documents</h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    To maintain trust and security across the marketplace, please attach your company registration, director identification, and operating credentials.
                  </p>

                  {/* Document List */}
                  <div className="space-y-2.5">
                    {uploadedDocs.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-2xl"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                            <FileCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{doc.name}</span>
                            <span className="text-[10px] text-slate-500 font-semibold uppercase">{doc.type}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Quick Add Document Options */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-700 block mb-2">
                      Add Required or Supporting Documents:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "CR14/Company Registration",
                        "Operating Licence",
                        "Tax Clearance (ITF263)",
                        "Other",
                      ].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => handleAddDocument(t as AgencyDocumentType)}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-600 text-slate-700 hover:text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
                        >
                          <Upload className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Attach {t}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center space-x-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-2"
                    >
                      <span>Proceed to Subscription & EcoCash</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: SUBSCRIPTION & ECOCASH PAYMENT */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-bold text-slate-900">Monthly Agency Subscription Plan</h3>
                  </div>

                  {/* Fee Card */}
                  <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-900 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="px-2.5 py-0.5 bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-[10px] font-extrabold uppercase rounded-full">
                          Agency Standard Plan
                        </span>
                        <h4 className="text-xl font-black text-white mt-1">
                          Unlimited Placements & Candidate Publishing
                        </h4>
                        <p className="text-xs text-emerald-200/80 mt-1 max-w-md">
                          Publish unlimited vetted housekeepers, caregivers, and cooks. Access direct client requests and verified placement badge.
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-black text-white">$50</span>
                        <span className="text-xs text-emerald-300 block font-semibold">USD / Month</span>
                      </div>
                    </div>
                  </div>

                  {/* Paynow Zimbabwe Payment Details Box */}
                  <div className="bg-gradient-to-br from-emerald-950 to-slate-900 border-2 border-emerald-500/60 rounded-2xl p-4 space-y-3 text-white shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={PAYMENT_GATEWAY_ASSETS.paynow}
                          alt="Paynow"
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-lg object-contain bg-white p-0.5 border border-emerald-400/40 shrink-0"
                        />
                        <div>
                          <span className="text-xs font-black text-white uppercase tracking-wide flex items-center gap-1.5">
                            Paynow Zimbabwe Gateway
                            <span className="bg-emerald-500/30 text-emerald-300 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
                              Official
                            </span>
                          </span>
                          <span className="text-[10px] text-emerald-300 font-medium block">
                            Direct Agency Subscription Settlement
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-900/80 text-emerald-200 border border-emerald-600/60 font-bold px-2 py-0.5 rounded-full">
                        $50 USD / mo
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-700 text-xs">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={PAYMENT_GATEWAY_ASSETS.ecocash}
                          alt="EcoCash"
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-lg object-cover border border-blue-500/40 shrink-0"
                        />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Mobile Money</span>
                          <span className="font-extrabold text-white">EcoCash / OneMoney</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={PAYMENT_GATEWAY_ASSETS.visaMastercard}
                          alt="Cards"
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-lg object-cover border border-emerald-500/40 shrink-0"
                        />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Debit / Credit</span>
                          <span className="font-extrabold text-emerald-400">Visa / Mastercard</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={PAYMENT_GATEWAY_ASSETS.innbucks}
                          alt="InnBucks"
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-lg object-cover border border-amber-500/40 shrink-0"
                        />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Retail Outlets</span>
                          <span className="font-extrabold text-amber-300">InnBucks QR</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Proof of Payment Form */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <span className="text-xs font-bold text-slate-900 block">
                      Submit Proof of Payment:
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Sender Phone Number
                        </label>
                        <input
                          type="tel"
                          value={paymentData.senderPhone}
                          onChange={(e) => setPaymentData({ ...paymentData, senderPhone: e.target.value })}
                          placeholder="e.g. +263 772 450 119"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          EcoCash Transaction Reference
                        </label>
                        <input
                          type="text"
                          value={paymentData.transactionRef}
                          onChange={(e) => setPaymentData({ ...paymentData, transactionRef: e.target.value })}
                          placeholder="e.g. MP260813.1142.H89123"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-white border border-dashed border-slate-300 rounded-xl flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Upload className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-semibold text-slate-700">{paymentData.proofFileName}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md text-[10px] font-bold">
                        Attached (Proof)
                      </span>
                    </div>
                  </div>

                  {/* Pending Notice */}
                  <div className="flex items-start space-x-2.5 p-3 bg-slate-100 rounded-2xl text-xs text-slate-700">
                    <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>
                      New agency accounts remain in <strong>Pending Approval</strong> until reviewed by an administrator. You can immediately access your agency portal to draft worker profiles while awaiting verification.
                    </span>
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center space-x-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center space-x-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Submitting Application...</span>
                      ) : (
                        <>
                          <span>Submit Agency Registration</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
