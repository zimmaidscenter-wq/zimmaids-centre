import React, { useState, useMemo } from "react";
import { useCategories } from "../../context/CategoryContext";
import { MarketplaceCategory, FeaturedWorkerPayment } from "../../types/category";
import {
  Layers,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Star,
  DollarSign,
  Briefcase,
  Users,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Trees,
  HeartHandshake,
  Check,
  X,
  CreditCard,
  Calendar,
  FileSpreadsheet,
  RefreshCw,
  SlidersHorizontal,
  Info,
  Clock,
  ArrowRight
} from "lucide-react";

export const CategoryManagementCenter: React.FC = () => {
  const {
    categories,
    publicCategories,
    categoryStats,
    allWorkers,
    allJobs,
    featuredPayments,
    addCategory,
    updateCategory,
    toggleCategoryStatus,
    deleteCategory,
    adminToggleFeaturedStatus,
    adminDeactivateWorkerFeatured,
    confirmFeaturedPayment,
  } = useCategories();

  const [activeSubTab, setActiveSubTab] = useState<"categories" | "featured-workers" | "visibility-audit">("categories");

  // Category Add / Edit State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MarketplaceCategory | null>(null);
  const [categoryNameInput, setCategoryNameInput] = useState("");
  const [categoryDescInput, setCategoryDescInput] = useState("");
  const [categoryIconInput, setCategoryIconInput] = useState("Briefcase");
  const [categoryFormError, setCategoryFormError] = useState<string | null>(null);
  const [categoryFormSuccess, setCategoryFormSuccess] = useState<string | null>(null);

  // Category Delete State
  const [deletingCategory, setDeletingCategory] = useState<MarketplaceCategory | null>(null);
  const [reassignTargetCatId, setReassignTargetCatId] = useState<string>("");

  // Featured Workers Search & Filters
  const [featuredSearchQuery, setFeaturedSearchQuery] = useState("");
  const [featuredCategoryFilter, setFeaturedCategoryFilter] = useState("All");
  const [featuredStatusFilter, setFeaturedStatusFilter] = useState("All");
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState<FeaturedWorkerPayment | null>(null);

  // Stats calculation
  const totalCategories = categories.length;
  const activeCount = categories.filter((c) => c.status === "Active").length;
  const publicCount = publicCategories.length;
  const hiddenEmptyCount = activeCount - publicCount;
  const totalFeaturedWorkers = allWorkers.filter((w) => w.isFeatured).length;
  const totalFeaturedRevenueUSD = featuredPayments
    .filter((p) => p.paymentStatus === "Paid")
    .reduce((sum, p) => sum + p.amountUSD, 0);

  // Handle Add Category Submit
  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryFormError(null);
    setCategoryFormSuccess(null);

    const res = addCategory({
      name: categoryNameInput,
      description: categoryDescInput,
      iconName: categoryIconInput,
    });

    if (!res.success) {
      setCategoryFormError(res.error || "Failed to add category.");
      return;
    }

    setCategoryFormSuccess(`Category "${categoryNameInput}" created successfully! It will automatically appear publicly once it has active workers or jobs.`);
    setCategoryNameInput("");
    setCategoryDescInput("");
    setCategoryIconInput("Briefcase");
    setTimeout(() => {
      setIsAddModalOpen(false);
      setCategoryFormSuccess(null);
    }, 1800);
  };

  // Handle Edit Category Submit
  const handleEditCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setCategoryFormError(null);
    setCategoryFormSuccess(null);

    const res = updateCategory(editingCategory.id, {
      name: categoryNameInput,
      description: categoryDescInput,
      iconName: categoryIconInput,
    });

    if (!res.success) {
      setCategoryFormError(res.error || "Failed to update category.");
      return;
    }

    setCategoryFormSuccess(`Category "${categoryNameInput}" updated successfully!`);
    setTimeout(() => {
      setEditingCategory(null);
      setCategoryFormSuccess(null);
    }, 1200);
  };

  // Handle Delete Category Submit
  const handleDeleteCategorySubmit = () => {
    if (!deletingCategory) return;
    const res = deleteCategory(deletingCategory.id, reassignTargetCatId);
    if (!res.success) {
      alert(res.error || "Failed to delete category.");
      return;
    }
    setDeletingCategory(null);
  };

  // Filtered Featured Payments
  const filteredFeaturedPayments = useMemo(() => {
    return featuredPayments.filter((p) => {
      const matchesSearch =
        p.workerName.toLowerCase().includes(featuredSearchQuery.toLowerCase()) ||
        p.workerId.toLowerCase().includes(featuredSearchQuery.toLowerCase()) ||
        p.paymentReference.toLowerCase().includes(featuredSearchQuery.toLowerCase()) ||
        (p.receiptNumber && p.receiptNumber.toLowerCase().includes(featuredSearchQuery.toLowerCase()));

      const matchesCat =
        featuredCategoryFilter === "All" ||
        p.category.toLowerCase() === featuredCategoryFilter.toLowerCase();

      const matchesStatus =
        featuredStatusFilter === "All" ||
        p.paymentStatus.toLowerCase() === featuredStatusFilter.toLowerCase() ||
        p.featuredStatus.toLowerCase() === featuredStatusFilter.toLowerCase();

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [featuredPayments, featuredSearchQuery, featuredCategoryFilter, featuredStatusFilter]);

  const renderIcon = (name?: string) => {
    switch (name) {
      case "Trees":
        return <Trees className="w-4 h-4 text-emerald-600" />;
      case "HeartHandshake":
        return <HeartHandshake className="w-4 h-4 text-rose-600" />;
      case "Sparkles":
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case "Users":
        return <Users className="w-4 h-4 text-blue-600" />;
      default:
        return <Briefcase className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Navigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Zimbabwe Maids Centre • Category Control Hub
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                $3 Paynow Featured System
              </span>
            </div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-emerald-400" />
              Dynamic Category & Featured Worker Management
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Control public category availability, prevent empty category display on public pages, and manage worker $3.00 USD Paynow promotions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCategoryNameInput("");
                setCategoryDescInput("");
                setCategoryIconInput("Briefcase");
                setCategoryFormError(null);
                setCategoryFormSuccess(null);
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/40 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Category</span>
            </button>
          </div>
        </div>

        {/* Metric Cards Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6">
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-slate-400 block">Total Categories</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-white font-mono">{totalCategories}</span>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">{activeCount} active in system</span>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-emerald-300 block">Publicly Visible</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-emerald-400 font-mono">{publicCount}</span>
              <Eye className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] text-emerald-300/80 mt-1 block">Active + Has Content</span>
          </div>

          <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-amber-300 block">Auto-Hidden (Empty)</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-amber-400 font-mono">{hiddenEmptyCount}</span>
              <EyeOff className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-[10px] text-amber-300/80 mt-1 block">0 workers & 0 jobs</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-slate-400 block">Active Workers</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-white font-mono">{allWorkers.length}</span>
              <Users className="w-4 h-4 text-teal-400" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Across categories</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-slate-400 block">Featured Workers</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-amber-300 font-mono">{totalFeaturedWorkers}</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">$3.00 USD Boosted</span>
          </div>

          <div className="bg-emerald-900/40 border border-emerald-700/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-emerald-300 block">Featured Revenue</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-emerald-300 font-mono">${totalFeaturedRevenueUSD.toFixed(2)}</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] text-emerald-300/80 mt-1 block">Paynow USD gateway</span>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveSubTab("categories")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === "categories"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Category Management ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("featured-workers")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === "featured-workers"
                ? "bg-amber-400 text-slate-950 shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Star className="w-4 h-4 fill-current" />
            <span>Featured Workers & Payments ({featuredPayments.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab("visibility-audit")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === "visibility-audit"
                ? "bg-blue-500 text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Public Visibility Rules & Audit</span>
          </button>
        </div>
      </div>

      {/* SUB TAB 1: CATEGORY MANAGEMENT */}
      {activeSubTab === "categories" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Platform Categories Overview</h3>
              <p className="text-xs text-slate-500">
                Default categories: <strong>Maids</strong>, <strong>Gardener</strong>, <strong>Nurse Aids</strong>. Categories without active workers or jobs are automatically hidden publicly.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Empty categories auto-hide from homepage, filters, and dropdowns.</span>
            </div>
          </div>

          {/* Categories Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Category Name</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4 text-center">Active Workers</th>
                  <th className="py-3 px-4 text-center">Active Jobs</th>
                  <th className="py-3 px-4">System Status</th>
                  <th className="py-3 px-4">Public Visibility</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {categoryStats.map((cat) => {
                  const fullCat = categories.find((c) => c.id === cat.id);
                  return (
                    <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                            {renderIcon(fullCat?.iconName)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-sm block">{cat.name}</span>
                            <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{fullCat?.description}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                        /{cat.slug}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                          cat.activeWorkerCount > 0 ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                        }`}>
                          {cat.activeWorkerCount} {cat.activeWorkerCount === 1 ? "Worker" : "Workers"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                          cat.activeJobCount > 0 ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-500"
                        }`}>
                          {cat.activeJobCount} {cat.activeJobCount === 1 ? "Job" : "Jobs"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => toggleCategoryStatus(cat.id)}
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            cat.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                          }`}
                        >
                          {cat.status === "Active" ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4">
                        {cat.isPubliclyVisible ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>🟢 Visible Publicly</span>
                          </span>
                        ) : cat.status === "Inactive" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                            <span>🔴 Inactive (Disabled)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                            <span>🟡 Hidden (0 Content)</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => {
                              if (fullCat) {
                                setEditingCategory(fullCat);
                                setCategoryNameInput(fullCat.name);
                                setCategoryDescInput(fullCat.description || "");
                                setCategoryIconInput(fullCat.iconName || "Briefcase");
                                setCategoryFormError(null);
                                setCategoryFormSuccess(null);
                              }
                            }}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
                            title="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (fullCat) {
                                setDeletingCategory(fullCat);
                                setReassignTargetCatId(categories.find((c) => c.id !== fullCat.id)?.id || "");
                              }
                            }}
                            className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-lg transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 2: FEATURED WORKERS & $3 PAYNOW PAYMENTS */}
      {activeSubTab === "featured-workers" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                Featured Worker Ledger & Paynow $3 Promotions
              </h3>
              <p className="text-xs text-slate-500">
                Manage worker boost subscriptions ($3.00 USD per 30 days). Verified via Paynow gateway with tamper-proof idempotency checks.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[220px] max-w-sm flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search worker, ID, Paynow ref..."
                  value={featuredSearchQuery}
                  onChange={(e) => setFeaturedSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                />
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="text-slate-500 font-medium">Category:</span>
                <select
                  value={featuredCategoryFilter}
                  onChange={(e) => setFeaturedCategoryFilter(e.target.value)}
                  className="bg-white border border-slate-300 px-2.5 py-1.5 rounded-lg font-medium text-xs focus:outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="text-slate-500 font-medium">Status:</span>
                <select
                  value={featuredStatusFilter}
                  onChange={(e) => setFeaturedStatusFilter(e.target.value)}
                  className="bg-white border border-slate-300 px-2.5 py-1.5 rounded-lg font-medium text-xs focus:outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Paid">Paid / Confirmed</option>
                  <option value="Pending">Pending Payment</option>
                  <option value="Active">Active Featured</option>
                  <option value="Inactive">Inactive / Revoked</option>
                </select>
              </div>
            </div>

            <div className="text-right text-xs font-mono text-slate-600">
              Showing <strong>{filteredFeaturedPayments.length}</strong> records
            </div>
          </div>

          {/* Featured Payments Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Worker Profile</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Paynow Reference</th>
                  <th className="py-3 px-4">Gateway</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Featured Status</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredFeaturedPayments.map((p) => {
                  const worker = allWorkers.find((w) => w.id === p.workerId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center border border-amber-300 shrink-0 text-xs">
                            {p.workerName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block flex items-center gap-1">
                              {p.workerName}
                              {worker?.isFeatured && (
                                <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                              )}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {p.workerId}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-medium text-[11px]">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        ${p.amountUSD.toFixed(2)} USD
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                        {p.paymentReference}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-medium">
                          {p.paymentMethod}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {p.paymentStatus === "Paid" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Paid
                          </span>
                        ) : p.paymentStatus === "Pending" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full text-[10px] font-bold">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Failed
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {p.featuredStatus === "Active" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-[10px] font-bold">
                            <Star className="w-3 h-3 text-amber-600 fill-amber-500" />
                            Active Boost
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-medium">
                            {p.featuredStatus}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {p.expiresAt ? p.expiresAt.substring(0, 10) : "—"}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {p.paymentStatus === "Pending" && (
                            <button
                              onClick={() => {
                                confirmFeaturedPayment(p.paymentReference);
                              }}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold"
                              title="Manually Verify & Confirm Payment"
                            >
                              Verify Paid
                            </button>
                          )}

                          {p.featuredStatus === "Active" ? (
                            <button
                              onClick={() => adminToggleFeaturedStatus(p.id, "Inactive")}
                              className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-200 rounded text-[10px] font-bold"
                              title="Deactivate Featured Status"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => adminToggleFeaturedStatus(p.id, "Active")}
                              className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 rounded text-[10px] font-bold"
                              title="Reactivate Featured Status"
                            >
                              Activate
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedPaymentDetail(p)}
                            className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100"
                            title="View Receipt & Gateway Logs"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB TAB 3: VISIBILITY AUDIT */}
      {activeSubTab === "visibility-audit" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Public Category Visibility & Role-Based Discovery Rules
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Verify that empty categories are never shown on public pages, and role-based marketplace boundaries are strictly enforced.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                Empty Category Auto-Hiding Rules
              </h4>
              <ul className="text-xs text-slate-600 space-y-2.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Zero Profile/Job Rule:</strong> If a category has 0 active profiles and 0 active jobs, it is automatically hidden from the homepage, worker listings, employer search filters, category dropdowns, and search results.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Auto-Publishing:</strong> When a worker registers or a job is posted in an empty category, it automatically appears publicly without admin intervention.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Safe Retention:</strong> Empty categories remain safe in the Admin portal and are not deleted when empty.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Role-Based Marketplace Boundaries
              </h4>
              <ul className="text-xs text-slate-600 space-y-2.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Workers browse Employers & Jobs:</strong> Domestic workers and artisans see employer job openings, application status, employer hiring requests, and wage escrow guarantees.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Employers browse Workers:</strong> Homeowners and corporate clients discover verified maid/gardener/nurse profiles, filter by location, compare rates, and request interviews.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Featured Worker Priority:</strong> Workers boosted with $3.00 USD Paynow fee receive priority ranking in employer search while respecting all KYC verification checks.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD CATEGORY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                Create New Marketplace Category
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {categoryFormError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{categoryFormError}</span>
              </div>
            )}

            {categoryFormSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{categoryFormSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAddCategorySubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Electricians, Cooks, Drivers..."
                  value={categoryNameInput}
                  onChange={(e) => setCategoryNameInput(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Name must be unique and non-blank.
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  placeholder="Brief summary of duties and services covered..."
                  value={categoryDescInput}
                  onChange={(e) => setCategoryDescInput(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category Icon</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "Sparkles", label: "Sparkles" },
                    { id: "Trees", label: "Nature/Garden" },
                    { id: "HeartHandshake", label: "Care/Health" },
                    { id: "Briefcase", label: "General Hand" },
                  ].map((icon) => (
                    <button
                      key={icon.id}
                      type="button"
                      onClick={() => setCategoryIconInput(icon.id)}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                        categoryIconInput === icon.id
                          ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {renderIcon(icon.id)}
                      <span className="text-[10px]">{icon.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT CATEGORY MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                Edit Category: {editingCategory.name}
              </h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {categoryFormError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{categoryFormError}</span>
              </div>
            )}

            {categoryFormSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{categoryFormSuccess}</span>
              </div>
            )}

            <form onSubmit={handleEditCategorySubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category Name</label>
                <input
                  type="text"
                  value={categoryNameInput}
                  onChange={(e) => setCategoryNameInput(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  value={categoryDescInput}
                  onChange={(e) => setCategoryDescInput(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Icon</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "Sparkles", label: "Sparkles" },
                    { id: "Trees", label: "Nature/Garden" },
                    { id: "HeartHandshake", label: "Care/Health" },
                    { id: "Briefcase", label: "General Hand" },
                  ].map((icon) => (
                    <button
                      key={icon.id}
                      type="button"
                      onClick={() => setCategoryIconInput(icon.id)}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                        categoryIconInput === icon.id
                          ? "bg-blue-50 border-blue-500 text-blue-800 font-bold"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {renderIcon(icon.id)}
                      <span className="text-[10px]">{icon.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CATEGORY CONFIRMATION */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-slate-900 text-base">
                Delete Category: {deletingCategory.name}?
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              Deleting this category will remove it from the platform. Existing worker profiles and jobs in this category will <strong>NOT be deleted</strong>—they will be safely reassigned to the selected category below.
            </p>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 block">
                Reassign Workers & Jobs to:
              </label>
              <select
                value={reassignTargetCatId}
                onChange={(e) => setReassignTargetCatId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium focus:outline-none"
              >
                {categories
                  .filter((c) => c.id !== deletingCategory.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCategorySubmit}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-md"
              >
                Confirm Safe Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: PAYMENT DETAIL RECEIPT INSPECT */}
      {selectedPaymentDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                <h3 className="font-bold text-slate-900 text-base">Paynow $3 USD Featured Receipt</h3>
              </div>
              <button onClick={() => setSelectedPaymentDetail(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2.5 font-mono text-xs border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Worker:</span>
                <span className="font-bold text-slate-900 font-sans">{selectedPaymentDetail.workerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Worker ID:</span>
                <span className="text-slate-700">{selectedPaymentDetail.workerId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Category:</span>
                <span className="text-slate-800 font-sans">{selectedPaymentDetail.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Amount:</span>
                <span className="text-emerald-700 font-bold">${selectedPaymentDetail.amountUSD.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Reference:</span>
                <span className="text-slate-900">{selectedPaymentDetail.paymentReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Payment Date:</span>
                <span className="text-slate-700">{selectedPaymentDetail.paymentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Payment Gateway:</span>
                <span className="text-slate-800 font-sans">{selectedPaymentDetail.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Payment Status:</span>
                <span className="font-bold text-emerald-600">{selectedPaymentDetail.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Expiry (30 Days):</span>
                <span className="text-slate-700">{selectedPaymentDetail.expiresAt || "N/A"}</span>
              </div>
              {selectedPaymentDetail.notes && (
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 font-sans">
                  <strong>Notes:</strong> {selectedPaymentDetail.notes}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedPaymentDetail(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
