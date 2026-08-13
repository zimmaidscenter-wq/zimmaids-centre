import React, { useState } from "react";
import { RBAC_ROLES_SPEC, RbacRoleSpec, RolePermissionDetail } from "../../data/rbacPermissionData";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Search,
  Check,
  Copy,
  Layers,
  Key,
  Lock,
  UserCheck,
  Users,
  Briefcase,
  Sliders,
  Sparkles,
  Download,
  Filter,
  Eye,
  FileCode,
  ChevronRight,
  ShieldQuestion,
  Building,
  Headphones,
  Award,
  DollarSign,
  Crown
} from "lucide-react";

export const RbacPermissionViewer: React.FC = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("worker");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"role-detail" | "matrix-comparison">("role-detail");
  const [copied, setCopied] = useState<boolean>(false);

  const modulesList = [
    "All",
    "public",
    "auth",
    "profile",
    "jobs",
    "applications",
    "chats",
    "payments",
    "verifications",
    "finance",
    "reports",
    "tickets",
    "blog",
    "settings",
    "rbac",
    "admin"
  ];

  const selectedRole =
    RBAC_ROLES_SPEC.find((r) => r.roleId === selectedRoleId) || RBAC_ROLES_SPEC[1];

  const filteredPermissions = selectedRole.permissions.filter((p) => {
    const matchesModule = selectedModuleFilter === "All" || p.module === selectedModuleFilter;
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.permissionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.action.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case "guest":
        return <Eye className="w-4 h-4 text-slate-500" />;
      case "worker":
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case "employer":
        return <Briefcase className="w-4 h-4 text-teal-600" />;
      case "moderator":
        return <ShieldQuestion className="w-4 h-4 text-indigo-600" />;
      case "support_staff":
        return <Headphones className="w-4 h-4 text-amber-600" />;
      case "verification_officer":
        return <Award className="w-4 h-4 text-blue-600" />;
      case "finance_officer":
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case "admin":
        return <ShieldCheck className="w-4 h-4 text-purple-600" />;
      case "super_admin":
        return <Crown className="w-4 h-4 text-amber-400" />;
      default:
        return <Shield className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(RBAC_ROLES_SPEC, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate total unique permissions across all 9 roles
  const allUniquePermissions = Array.from(
    new Set(RBAC_ROLES_SPEC.flatMap((r) => r.permissions.map((p) => p.permissionId)))
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-800/40 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-900/80 border border-purple-700/60 rounded-full text-xs text-purple-200 font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Complete Role-Based Access Control (RBAC) Architecture</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Zimbabwe Maids Centre • 9 Role Permissions Specification
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Exhaustive permissions matrix for Guest, Worker, Employer, Admin, Super Admin, Moderator, Support Staff, Verification Officer, and Finance Officer.
            </p>
          </div>

          <button
            onClick={handleCopyJSON}
            className="self-start md:self-center inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "JSON Copied!" : "Export RBAC Roles JSON"}</span>
          </button>
        </div>
      </div>

      {/* Mode Controls and Stats */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* View Switcher */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setViewMode("role-detail")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "role-detail"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Detailed Role Permissions
          </button>
          <button
            onClick={() => setViewMode("matrix-comparison")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "matrix-comparison"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Full Matrix Comparison Grid
          </button>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1.5 font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>9 Configured Roles</span>
          </div>
          <div className="flex items-center space-x-1.5 font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>{allUniquePermissions.length} Total Atomic Permissions</span>
          </div>
        </div>
      </div>

      {/* DETAILED ROLE PERMISSIONS VIEW */}
      {viewMode === "role-detail" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Role Selection Sidebar */}
          <div className="lg:col-span-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1 mb-2">
              Select Role to Inspect ({RBAC_ROLES_SPEC.length})
            </div>

            {RBAC_ROLES_SPEC.map((role) => {
              const isSelected = role.roleId === selectedRole.roleId;
              return (
                <button
                  key={role.roleId}
                  onClick={() => setSelectedRoleId(role.roleId)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start justify-between ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-800 shadow-md ring-2 ring-purple-500/50"
                      : "bg-white hover:bg-slate-50 text-slate-800 border-slate-200"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(role.roleId)}
                      <h4 className="text-xs font-black">{role.roleName}</h4>
                    </div>
                    <p className={`text-[11px] line-clamp-1 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                      {role.summary}
                    </p>
                    <div className="flex items-center space-x-2 pt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${role.badgeColor}`}>
                        {role.permissions.length} Permissions
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{role.category}</span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 mt-2 transition-transform ${
                      isSelected ? "text-purple-400 translate-x-1" : "text-slate-300"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Role Detail & Permissions List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              {/* Role Header Info */}
              <div className="border-b border-slate-100 pb-5 mb-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(selectedRole.roleId)}
                    <h3 className="text-xl font-bold text-slate-900">{selectedRole.roleName}</h3>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full border ${selectedRole.badgeColor}`}>
                    {selectedRole.category}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{selectedRole.summary}</p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5 text-xs text-slate-700">
                  <div>
                    <span className="font-bold text-slate-900">Target Users: </span>
                    <span>{selectedRole.targetAudience}</span>
                  </div>
                  {selectedRole.inheritedRoles && selectedRole.inheritedRoles.length > 0 && (
                    <div className="flex items-center space-x-2 pt-1 border-t border-slate-200/60">
                      <span className="font-bold text-slate-900">Inherits Permissions From: </span>
                      {selectedRole.inheritedRoles.map((ir) => (
                        <span key={ir} className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                          {ir}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="pt-1.5 border-t border-slate-200/60 text-[11px] text-purple-900 font-medium">
                    <span className="font-bold text-slate-900">Security Rule Policy: </span>
                    <span>{selectedRole.securityPolicy}</span>
                  </div>
                </div>
              </div>

              {/* Filters for Permissions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                {/* Module dropdown */}
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={selectedModuleFilter}
                    onChange={(e) => setSelectedModuleFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 py-1.5 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {modulesList.map((m) => (
                      <option key={m} value={m}>
                        Module: {m}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Box */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filter permissions..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* List of Permissions for Selected Role */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Granted Permissions ({filteredPermissions.length})
                </div>

                {filteredPermissions.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-xs text-slate-500">
                    No permissions match the current search filter.
                  </div>
                ) : (
                  filteredPermissions.map((perm) => (
                    <div
                      key={perm.permissionId}
                      className="bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200 rounded-2xl p-4 transition-all space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-xs text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-md border border-purple-200">
                            {perm.permissionId}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{perm.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                            Action: {perm.action}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Scope: {perm.securityScope}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{perm.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MATRIX COMPARISON GRID VIEW */}
      {viewMode === "matrix-comparison" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Role-by-Role Permission Matrix</h3>
              <p className="text-xs text-slate-500">
                Compare atomic capabilities across all 9 platform roles.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search permission matrix..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-3 font-bold sticky left-0 bg-slate-900 z-10 min-w-[220px]">
                    Atomic Permission
                  </th>
                  {RBAC_ROLES_SPEC.map((role) => (
                    <th key={role.roleId} className="p-3 font-bold text-center min-w-[110px] border-l border-slate-800">
                      <div className="text-[11px] font-extrabold">{role.roleName.split(". ")[1]}</div>
                      <div className="text-[9px] font-mono text-purple-300 opacity-80">{role.roleId}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {allUniquePermissions
                  .filter((pId) => pId.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((pId) => {
                    const samplePerm = RBAC_ROLES_SPEC.flatMap((r) => r.permissions).find(
                      (p) => p.permissionId === pId
                    );

                    return (
                      <tr key={pId} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono text-slate-900 font-bold sticky left-0 bg-white shadow-sm">
                          <div className="text-xs text-purple-950 font-bold">{pId}</div>
                          <div className="text-[10px] text-slate-500 font-normal truncate max-w-[210px]">
                            {samplePerm?.title}
                          </div>
                        </td>

                        {RBAC_ROLES_SPEC.map((role) => {
                          const hasPermission = role.permissions.some((p) => p.permissionId === pId);

                          return (
                            <td key={role.roleId} className="p-3 text-center border-l border-slate-100">
                              {hasPermission ? (
                                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                </div>
                              ) : (
                                <div className="inline-flex items-center justify-center w-6 h-6 text-slate-300">
                                  -
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
