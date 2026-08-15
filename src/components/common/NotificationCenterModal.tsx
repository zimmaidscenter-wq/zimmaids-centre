import React, { useState } from "react";
import {
  Bell,
  Briefcase,
  UserCheck,
  Calendar,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  Clock,
  Check,
  Trash2,
  X,
  Sparkles,
  ExternalLink,
  Filter,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { AppNotification } from "../../types/marketplace";

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: "notif-1",
      category: "verifications",
      title: "ZRP Police Clearance Verified",
      message: "Your Police CID fingerprint clearance has been verified by the Master Admin. You now hold a Verified Badge!",
      timestamp: "10 mins ago",
      isRead: false,
      metadata: { status: "Verified" },
    },
    {
      id: "notif-2",
      category: "jobs",
      title: "New Job Match in Borrowdale",
      message: "A family in Borrowdale Brooke posted a Full-Time Housekeeper & Cook role ($250/mo) matching your skills.",
      timestamp: "45 mins ago",
      isRead: false,
      actionUrl: "jobs",
      metadata: { jobId: "job-102", amountUSD: 250 },
    },
    {
      id: "notif-3",
      category: "interviews",
      title: "Interview Request Received",
      message: "Mrs. Sarah Jenkins invited you for a WhatsApp video interview on Monday, 18 Aug at 10:00 AM.",
      timestamp: "2 hours ago",
      isRead: false,
      actionUrl: "whatsapp",
      metadata: { employerName: "Mrs. Sarah Jenkins" },
    },
    {
      id: "notif-4",
      category: "applications",
      title: "Application Shortlisted",
      message: "Your application for 'Infant Nanny' at Avondale Residence has been shortlisted by the employer.",
      timestamp: "5 hours ago",
      isRead: true,
      actionUrl: "jobs",
    },
    {
      id: "notif-5",
      category: "messages",
      title: "New Message from Premier Agency",
      message: "Agency Manager: 'We have 2 high-density family placements ready for review. Please check your chat.'",
      timestamp: "1 day ago",
      isRead: true,
      actionUrl: "whatsapp",
    },
    {
      id: "notif-6",
      category: "placement_fees",
      title: "Placement Fee Settlement Reminder",
      message: "Your 10% placement settlement for candidate Nomsa S. ($14.00) is due within 48 hours via EcoCash/InnBucks.",
      timestamp: "1 day ago",
      isRead: false,
      actionUrl: "payments",
      metadata: { amountUSD: 14 },
    },
    {
      id: "notif-7",
      category: "subscriptions",
      title: "Premium Employer Pass Expiring Soon",
      message: "Your 30-day Unlimited Direct Contacts pass will renew in 3 days. Extend to keep unmasked phone numbers.",
      timestamp: "2 days ago",
      isRead: true,
      actionUrl: "payments",
    },
  ]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markSingleAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const simulateTestNotification = () => {
    const categories: AppNotification["category"][] = [
      "jobs",
      "applications",
      "interviews",
      "messages",
      "verifications",
      "subscriptions",
      "placement_fees",
    ];
    const randomCat = categories[Math.floor(Math.random() * categories.length)];

    const sampleTemplates: Record<AppNotification["category"], { title: string; message: string; actionUrl: string }> = {
      jobs: {
        title: "Urgent Caregiver Needed (Highlands)",
        message: "Elderly care position available immediately offering $220/month with full board.",
        actionUrl: "jobs",
      },
      applications: {
        title: "Employer Viewed Your Profile",
        message: "A Mount Pleasant homeowner reviewed your candidate photo gallery and reference letters.",
        actionUrl: "marketplace",
      },
      interviews: {
        title: "In-Person Trial Arranged",
        message: "Paid 1-day home trial scheduled for Friday in Glen Lorne.",
        actionUrl: "jobs",
      },
      messages: {
        title: "WhatsApp Chat Received",
        message: "Employer sent: 'Can you start on the 1st of next month?'",
        actionUrl: "whatsapp",
      },
      verifications: {
        title: "National ID OCR Approved",
        message: "Zimbabwe National ID verified against identity registries.",
        actionUrl: "worker",
      },
      subscriptions: {
        title: "Agency Pro Tier Activated",
        message: "Your monthly agency subscription is confirmed via EcoCash.",
        actionUrl: "agency",
      },
      placement_fees: {
        title: "Placement Fee Verified",
        message: "Admin approved your EcoCash proof of payment. Placement warranty active.",
        actionUrl: "payments",
      },
    };

    const template = sampleTemplates[randomCat];
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      category: randomCat,
      title: template.title,
      message: template.message,
      timestamp: "Just now",
      isRead: false,
      actionUrl: template.actionUrl,
    };

    setNotifications((prev) => [newNotif, ...prev]);
  };

  const getCategoryIcon = (category: AppNotification["category"]) => {
    switch (category) {
      case "jobs":
        return <Briefcase className="w-4 h-4 text-emerald-400" />;
      case "applications":
        return <UserCheck className="w-4 h-4 text-blue-400" />;
      case "interviews":
        return <Calendar className="w-4 h-4 text-purple-400" />;
      case "messages":
        return <MessageSquare className="w-4 h-4 text-teal-400" />;
      case "verifications":
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case "subscriptions":
        return <Clock className="w-4 h-4 text-amber-400" />;
      case "placement_fees":
        return <CreditCard className="w-4 h-4 text-rose-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filterCategory === "all") return true;
    if (filterCategory === "unread") return !n.isRead;
    return n.category === filterCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-slate-950 text-xs font-black rounded-full flex items-center justify-center border-2 border-slate-900">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Notifications Hub
              </h2>
              <p className="text-xs text-slate-400">
                Live alerts for Jobs, Applications, Interviews, Messages & Verification updates.
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

        {/* Toolbar & Filters */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            {[
              { id: "all", label: "All Alerts" },
              { id: "unread", label: `Unread (${unreadCount})` },
              { id: "jobs", label: "Jobs" },
              { id: "applications", label: "Apps" },
              { id: "interviews", label: "Interviews" },
              { id: "verifications", label: "Vetting" },
              { id: "placement_fees", label: "Settlements" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterCategory(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterCategory === f.id
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-sm"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={simulateTestNotification}
              className="px-2.5 py-1 bg-purple-600/80 hover:bg-purple-600 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              title="Test notification trigger"
            >
              <Sparkles className="w-3 h-3" />
              <span>Simulate Alert</span>
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-2">
              <CheckCircle2 className="w-12 h-12 mx-auto text-slate-600" />
              <p className="text-sm font-semibold text-slate-400">All caught up!</p>
              <p className="text-xs">No pending notifications in this category.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markSingleAsRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 group relative cursor-pointer ${
                  !notif.isRead
                    ? "bg-slate-800/90 border-emerald-500/40 shadow-md shadow-emerald-950/30"
                    : "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-slate-900 rounded-xl border border-slate-700 mt-0.5 shrink-0">
                    {getCategoryIcon(notif.category)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className={`text-sm font-bold ${!notif.isRead ? "text-white" : "text-slate-300"}`}>
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-slate-500 mt-2 block font-medium">
                      {notif.timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100">
                  {notif.actionUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onNavigateToTab) {
                          onNavigateToTab(notif.actionUrl!);
                          onClose();
                        }
                      }}
                      className="p-1.5 bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 rounded-lg transition-colors text-xs flex items-center gap-1 font-semibold"
                      title="View Action"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    className="p-1.5 hover:bg-rose-950/60 hover:text-rose-400 text-slate-500 rounded-lg transition-colors"
                    title="Dismiss"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Push notifications enabled for WhatsApp & SMS alerts</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
