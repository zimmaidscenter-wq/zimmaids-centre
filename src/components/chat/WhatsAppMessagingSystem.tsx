import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Phone,
  Video,
  Mic,
  MicOff,
  Send,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Check,
  CheckCheck,
  Search,
  Pin,
  MoreVertical,
  X,
  Play,
  Pause,
  Volume2,
  Download,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  UserX,
  Maximize2,
  Minimize2,
  PhoneOff,
  VideoOff,
  ShieldCheck,
  Sparkles,
  Share2,
  Camera,
  RotateCcw,
  Plus,
  FileCode,
  Eye,
  Smile,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { UserRole, CityLocation } from "../../types/marketplace";

// TYPES
export type ReadStatus = "sent" | "delivered" | "read";

export type MessageType =
  | "text"
  | "voice"
  | "image"
  | "video"
  | "pdf"
  | "interview_invitation";

export interface InterviewData {
  id: string;
  position: string;
  date: string;
  time: string;
  venue: string;
  isVirtual: boolean;
  notes: string;
  status: "pending" | "accepted" | "declined";
  responseNote?: string;
}

export interface ChatMessage {
  id: string;
  senderId: "me" | "contact";
  senderName: string;
  timestamp: string;
  status: ReadStatus;
  type: MessageType;
  text?: string;
  translatedText?: string;
  // Voice note fields
  audioUrl?: string;
  durationSec?: number;
  waveformData?: number[];
  // Image fields
  imageUrl?: string;
  caption?: string;
  // Video fields
  videoUrl?: string;
  thumbnailUrl?: string;
  videoDuration?: string;
  // PDF fields
  pdfName?: string;
  pdfSize?: string;
  pdfPageCount?: number;
  pdfUrl?: string;
  // Interview invitation
  interviewData?: InterviewData;
}

export interface ChatContact {
  id: string;
  fullName: string;
  role: UserRole;
  avatarUrl: string;
  onlineStatus: "online" | "offline" | "typing";
  lastSeen?: string;
  phone: string;
  city: CityLocation;
  suburb: string;
  isPinned: boolean;
  unreadCount: number;
  lastMessageText: string;
  lastMessageTime: string;
  messages: ChatMessage[];
}

// SAMPLE INITIAL MESSAGES & CONTACTS
const INITIAL_CONTACTS: ChatContact[] = [
  {
    id: "c-1",
    fullName: "Tendai Moyo",
    role: "Housekeeper",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
    onlineStatus: "online",
    lastSeen: "Today at 08:15",
    phone: "+263 772 491 823",
    city: "Harare",
    suburb: "Borrowdale",
    isPinned: true,
    unreadCount: 1,
    lastMessageText: "Interview Invitation: Friday 10:00 AM",
    lastMessageTime: "10:14 AM",
    messages: [
      {
        id: "m-101",
        senderId: "contact",
        senderName: "Tendai Moyo",
        timestamp: "09:30 AM",
        status: "read",
        type: "text",
        text: "Mhoro / Hello! I am interested in the full-time housekeeper position in Borrowdale. I have 7 years experience and certified police clearance.",
        translatedText: "Hello! I am interested in the full-time housekeeper position in Borrowdale. I have 7 years experience and certified police clearance."
      },
      {
        id: "m-102",
        senderId: "contact",
        senderName: "Tendai Moyo",
        timestamp: "09:32 AM",
        status: "read",
        type: "voice",
        durationSec: 24,
        audioUrl: "https://actions.google.com/sounds/v1/speech/person_speaking.ogg",
        waveformData: [25, 40, 65, 80, 45, 90, 100, 70, 50, 30, 85, 95, 60, 40, 75, 90, 30, 20, 55, 70, 40, 25],
        text: "Voice note introducing my house cleaning routine and meal preparation skills."
      },
      {
        id: "m-103",
        senderId: "contact",
        senderName: "Tendai Moyo",
        timestamp: "09:35 AM",
        status: "read",
        type: "image",
        imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800",
        caption: "Deep cleaning result from my previous home in Mount Pleasant."
      },
      {
        id: "m-104",
        senderId: "contact",
        senderName: "Tendai Moyo",
        timestamp: "09:38 AM",
        status: "read",
        type: "pdf",
        pdfName: "Tendai_Moyo_Police_Clearance_2026.pdf",
        pdfSize: "1.4 MB",
        pdfPageCount: 2,
        pdfUrl: "#"
      },
      {
        id: "m-105",
        senderId: "me",
        senderName: "Employer",
        timestamp: "10:10 AM",
        status: "read",
        type: "text",
        text: "Thank you Tendai! Your profile looks fantastic. Let's schedule an interview."
      },
      {
        id: "m-106",
        senderId: "me",
        senderName: "Employer",
        timestamp: "10:14 AM",
        status: "read",
        type: "interview_invitation",
        interviewData: {
          id: "inv-101",
          position: "Senior Housekeeper & Cook",
          date: "Friday, Aug 15, 2026",
          time: "10:00 AM CAT",
          venue: "Borrowdale Brooke Estate, Gate 2 or WhatsApp Video Call",
          isVirtual: false,
          notes: "Please bring original national ID and reference letters.",
          status: "pending"
        }
      }
    ]
  },
  {
    id: "c-2",
    fullName: "Sekai Chikwanha",
    role: "Nanny",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    onlineStatus: "online",
    lastSeen: "Today at 09:42",
    phone: "+263 773 812 904",
    city: "Harare",
    suburb: "Avondale",
    isPinned: true,
    unreadCount: 0,
    lastMessageText: "I have accepted the interview invitation!",
    lastMessageTime: "09:42 AM",
    messages: [
      {
        id: "m-201",
        senderId: "contact",
        senderName: "Sekai Chikwanha",
        timestamp: "09:00 AM",
        status: "read",
        type: "text",
        text: "Good morning! I hold an Early Childhood Education diploma and 6 years nanny experience.",
        translatedText: "Good morning! I hold an Early Childhood Education diploma and 6 years nanny experience."
      },
      {
        id: "m-202",
        senderId: "contact",
        senderName: "Sekai Chikwanha",
        timestamp: "09:05 AM",
        status: "read",
        type: "video",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=600",
        videoDuration: "0:42",
        caption: "Short video demonstration of toddler learning activities and first aid drill."
      },
      {
        id: "m-203",
        senderId: "me",
        senderName: "Employer",
        timestamp: "09:20 AM",
        status: "read",
        type: "interview_invitation",
        interviewData: {
          id: "inv-202",
          position: "Full-Time Infant & Toddler Nanny",
          date: "Thursday, Aug 14, 2026",
          time: "02:00 PM CAT",
          venue: "Avondale Shopping Centre Office / Video Call",
          isVirtual: true,
          notes: "We will discuss early childhood routines.",
          status: "accepted",
          responseNote: "Thank you so much! I look forward to speaking on Thursday."
        }
      }
    ]
  },
  {
    id: "c-3",
    fullName: "Grace Mutasa",
    role: "Caregiver",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250",
    onlineStatus: "offline",
    lastSeen: "Yesterday at 18:30",
    phone: "+263 712 994 011",
    city: "Bulawayo",
    suburb: "Hillside",
    isPinned: false,
    unreadCount: 0,
    lastMessageText: "Red Cross certificate attached.",
    lastMessageTime: "Yesterday",
    messages: [
      {
        id: "m-301",
        senderId: "contact",
        senderName: "Grace Mutasa",
        timestamp: "Yesterday",
        status: "read",
        type: "text",
        text: "Hello, I am a certified Red Cross Nurse Aide specializing in elderly care."
      },
      {
        id: "m-302",
        senderId: "contact",
        senderName: "Grace Mutasa",
        timestamp: "Yesterday",
        status: "read",
        type: "pdf",
        pdfName: "Red_Cross_Nurse_Aide_Certificate.pdf",
        pdfSize: "2.1 MB",
        pdfPageCount: 3,
        pdfUrl: "#"
      }
    ]
  },
  {
    id: "c-4",
    fullName: "Blessed Tauro",
    role: "Electrician",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    onlineStatus: "online",
    lastSeen: "Just now",
    phone: "+263 775 002 188",
    city: "Harare",
    suburb: "Highlands",
    isPinned: false,
    unreadCount: 0,
    lastMessageText: "I can inspect your DB board tomorrow morning.",
    lastMessageTime: "08:10 AM",
    messages: [
      {
        id: "m-401",
        senderId: "contact",
        senderName: "Blessed Tauro",
        timestamp: "08:10 AM",
        status: "read",
        type: "text",
        text: "Salibonani! I am a Class 1 Journeyman solar electrician. I can inspect your DB board and solar inverter setup tomorrow morning."
      }
    ]
  }
];

export const WhatsAppMessagingSystem: React.FC = () => {
  const [contacts, setContacts] = useState<ChatContact[]>(INITIAL_CONTACTS);
  const [activeContactId, setActiveContactId] = useState<string>("c-1");
  const [showMobileConversation, setShowMobileConversation] = useState<boolean>(false);
  const [threadSearch, setThreadSearch] = useState("");
  const [inChatSearch, setInChatSearch] = useState("");
  const [showInChatSearch, setShowInChatSearch] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  
  // Voice Note Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<any>(null);

  // Audio Playback State
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1, 1.5, 2

  // Attachments Menu
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  // Modals State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<{ name: string; size: string; pages?: number } | null>(null);
  const [showInterviewComposer, setShowInterviewComposer] = useState(false);

  // Call Overlays
  const [activeVoiceCall, setActiveVoiceCall] = useState<{ contact: ChatContact; duration: number; isMuted: boolean; isSpeaker: boolean } | null>(null);
  const [activeVideoCall, setActiveVideoCall] = useState<{ contact: ChatContact; duration: number; isMuted: boolean; isCameraOff: boolean } | null>(null);

  // Call Timers
  const callTimerRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeContactId, activeContact?.messages, isRecording]);

  // Handle Recording Timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  // Toggle Pin Chat
  const handleTogglePin = (contactId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setContacts(prev =>
      prev.map(c => (c.id === contactId ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  // Send Text Message
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      senderId: "me",
      senderName: "Employer",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "delivered",
      type: "text",
      text: messageInput.trim()
    };

    updateActiveContactMessages(newMsg);
    setMessageInput("");

    // Simulate Candidate Read Receipt & Automated Typing Reply
    setTimeout(() => {
      setContacts(prev =>
        prev.map(c =>
          c.id === activeContactId
            ? {
                ...c,
                messages: c.messages.map(m =>
                  m.id === newMsg.id ? { ...m, status: "read" } : m
                ),
                onlineStatus: "typing"
              }
            : c
        )
      );
    }, 1200);

    // Send Simulated Reply
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `m-${Date.now() + 1}`,
        senderId: "contact",
        senderName: activeContact.fullName,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "read",
        type: "text",
        text: `Ndatenda zvikuru / Thank you! I have received your message regarding the ${activeContact.role} position.`,
        translatedText: `Thank you very much! I have received your message regarding the ${activeContact.role} position.`
      };

      setContacts(prev =>
        prev.map(c =>
          c.id === activeContactId
            ? {
                ...c,
                onlineStatus: "online",
                lastMessageText: replyMsg.text || "",
                lastMessageTime: replyMsg.timestamp,
                messages: [...c.messages, replyMsg]
              }
            : c
        )
      );
    }, 3200);
  };

  // Stop & Send Voice Note
  const handleSendVoiceNote = () => {
    setIsRecording(false);
    const duration = recordingSeconds || 5;

    const voiceMsg: ChatMessage = {
      id: `m-vn-${Date.now()}`,
      senderId: "me",
      senderName: "Employer",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "delivered",
      type: "voice",
      durationSec: duration,
      waveformData: Array.from({ length: 20 }, () => Math.floor(Math.random() * 80) + 20),
      text: "Voice Note"
    };

    updateActiveContactMessages(voiceMsg);
  };

  // Helper to add message to current chat
  const updateActiveContactMessages = (msg: ChatMessage) => {
    setContacts(prev =>
      prev.map(c =>
        c.id === activeContactId
          ? {
              ...c,
              lastMessageText: msg.text || (msg.type === "voice" ? "🎤 Voice Note" : "Attachment"),
              lastMessageTime: msg.timestamp,
              messages: [...c.messages, msg]
            }
          : c
      )
    );
  };

  // Send Sample Image Attachment
  const handleSendSampleImage = () => {
    setShowAttachmentMenu(false);
    const imgMsg: ChatMessage = {
      id: `m-img-${Date.now()}`,
      senderId: "me",
      senderName: "Employer",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "delivered",
      type: "image",
      imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
      caption: "Photos of the primary household workspace."
    };
    updateActiveContactMessages(imgMsg);
  };

  // Send Sample PDF Attachment
  const handleSendSamplePdf = () => {
    setShowAttachmentMenu(false);
    const pdfMsg: ChatMessage = {
      id: `m-pdf-${Date.now()}`,
      senderId: "me",
      senderName: "Employer",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "delivered",
      type: "pdf",
      pdfName: "Household_Worker_Agreement_Terms_2026.pdf",
      pdfSize: "840 KB",
      pdfPageCount: 4,
      pdfUrl: "#"
    };
    updateActiveContactMessages(pdfMsg);
  };

  // Send Interview Invitation
  const handleSendInterviewInvitation = (invite: Omit<InterviewData, "id" | "status">) => {
    setShowInterviewComposer(false);
    const inviteData: InterviewData = {
      ...invite,
      id: `inv-${Date.now()}`,
      status: "pending"
    };

    const invMsg: ChatMessage = {
      id: `m-inv-${Date.now()}`,
      senderId: "me",
      senderName: "Employer",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "delivered",
      type: "interview_invitation",
      interviewData: inviteData
    };

    updateActiveContactMessages(invMsg);
  };

  // Candidate Interview Response (Accept/Decline)
  const handleRespondToInterview = (messageId: string, accept: boolean) => {
    setContacts(prev =>
      prev.map(c => {
        if (c.id !== activeContactId) return c;
        return {
          ...c,
          messages: c.messages.map(m => {
            if (m.id === messageId && m.interviewData) {
              return {
                ...m,
                interviewData: {
                  ...m.interviewData,
                  status: accept ? "accepted" : "declined",
                  responseNote: accept
                    ? `I am pleased to accept the interview for ${m.interviewData.date} at ${m.interviewData.time}.`
                    : "Unfortunately I cannot make this time. Could we reschedule?"
                }
              };
            }
            return m;
          })
        };
      })
    );
  };

  // Start Voice Call
  const startVoiceCall = () => {
    setActiveVoiceCall({
      contact: activeContact,
      duration: 0,
      isMuted: false,
      isSpeaker: true
    });

    if (callTimerRef.current) clearInterval(callTimerRef.current);
    callTimerRef.current = setInterval(() => {
      setActiveVoiceCall(prev => prev ? { ...prev, duration: prev.duration + 1 } : null);
    }, 1000);
  };

  // Start Video Call
  const startVideoCall = () => {
    setActiveVideoCall({
      contact: activeContact,
      duration: 0,
      isMuted: false,
      isCameraOff: false
    });

    if (callTimerRef.current) clearInterval(callTimerRef.current);
    callTimerRef.current = setInterval(() => {
      setActiveVideoCall(prev => prev ? { ...prev, duration: prev.duration + 1 } : null);
    }, 1000);
  };

  const endVoiceCall = () => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    setActiveVoiceCall(null);
  };

  const endVideoCall = () => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    setActiveVideoCall(null);
  };

  // Filter contacts by sidebar search
  const filteredContacts = contacts.filter(c =>
    c.fullName.toLowerCase().includes(threadSearch.toLowerCase()) ||
    c.role.toLowerCase().includes(threadSearch.toLowerCase()) ||
    c.lastMessageText.toLowerCase().includes(threadSearch.toLowerCase())
  );

  const pinnedContacts = filteredContacts.filter(c => c.isPinned);
  const otherContacts = filteredContacts.filter(c => !c.isPinned);

  // Filter active chat messages by in-chat search
  const displayedMessages = activeContact.messages.filter(m => {
    if (!inChatSearch.trim()) return true;
    const q = inChatSearch.toLowerCase();
    return (
      (m.text && m.text.toLowerCase().includes(q)) ||
      (m.pdfName && m.pdfName.toLowerCase().includes(q)) ||
      (m.interviewData && m.interviewData.position.toLowerCase().includes(q))
    );
  });

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Container Frame mimicking WhatsApp Web / Desktop */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[820px]">
        
        {/* SIDEBAR: CHAT THREADS & PINNED CHATS */}
        <div className={`md:col-span-4 lg:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50 ${showMobileConversation ? "hidden md:flex" : "flex"}`}>
          
          {/* WhatsApp Sidebar Header */}
          <div className="bg-emerald-900 text-white p-4 flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-emerald-300 fill-emerald-300/30" />
              </div>
              <div>
                <h2 className="font-black text-sm text-white tracking-tight flex items-center gap-1.5">
                  <span>WhatsApp Centre</span>
                  <span className="px-1.5 py-0.5 bg-emerald-500 text-slate-950 font-black text-[9px] uppercase tracking-widest rounded">
                    24/7 Live
                  </span>
                </h2>
                <p className="text-[11px] text-emerald-200 font-medium">Zimbabwe Maids Centre</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowInterviewComposer(true)}
                className="p-2 text-emerald-200 hover:text-white bg-emerald-800/80 hover:bg-emerald-800 rounded-xl transition-all"
                title="Create Interview Invitation"
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Contacts Bar */}
          <div className="p-3 bg-white border-b border-slate-200 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search candidates or chat text..."
                value={threadSearch}
                onChange={e => setThreadSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Threads List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            
            {/* PINNED SECTION */}
            {pinnedContacts.length > 0 && (
              <div className="bg-slate-100/70">
                <div className="px-4 py-1.5 text-[10px] font-black tracking-wider uppercase text-emerald-800 flex items-center space-x-1">
                  <Pin className="w-3 h-3 text-emerald-700 fill-emerald-700" />
                  <span>Pinned Candidates ({pinnedContacts.length})</span>
                </div>

                {pinnedContacts.map(contact => (
                  <div
                    key={contact.id}
                    onClick={() => {
                      setActiveContactId(contact.id);
                      setShowMobileConversation(true);
                    }}
                    className={`p-3.5 flex items-center justify-between cursor-pointer transition-all hover:bg-emerald-50/80 ${
                      activeContactId === contact.id ? "bg-emerald-100/80 border-l-4 border-emerald-600" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={contact.avatarUrl}
                          alt={contact.fullName}
                          className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                        />
                        {contact.onlineStatus === "online" && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-xs text-slate-900 truncate">{contact.fullName}</h4>
                          <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-1">{contact.lastMessageTime}</span>
                        </div>
                        <p className="text-[11px] font-bold text-emerald-800">{contact.role} • {contact.suburb}</p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {contact.onlineStatus === "typing" ? (
                            <span className="text-emerald-600 font-bold italic animate-pulse">typing...</span>
                          ) : (
                            contact.lastMessageText
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={e => handleTogglePin(contact.id, e)}
                      className="p-1 text-slate-400 hover:text-emerald-700 ml-2"
                      title="Unpin Chat"
                    >
                      <Pin className="w-3.5 h-3.5 text-emerald-700 fill-emerald-700" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* OTHER CONTACTS */}
            {otherContacts.length > 0 && (
              <div>
                {pinnedContacts.length > 0 && (
                  <div className="px-4 py-1.5 text-[10px] font-black tracking-wider uppercase text-slate-400">
                    All Messages
                  </div>
                )}

                {otherContacts.map(contact => (
                  <div
                    key={contact.id}
                    onClick={() => {
                      setActiveContactId(contact.id);
                      setShowMobileConversation(true);
                    }}
                    className={`p-3.5 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-100 ${
                      activeContactId === contact.id ? "bg-emerald-100/80 border-l-4 border-emerald-600" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={contact.avatarUrl}
                          alt={contact.fullName}
                          className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                        />
                        {contact.onlineStatus === "online" && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-xs text-slate-900 truncate">{contact.fullName}</h4>
                          <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-1">{contact.lastMessageTime}</span>
                        </div>
                        <p className="text-[11px] font-bold text-emerald-800">{contact.role} • {contact.city}</p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{contact.lastMessageText}</p>
                      </div>
                    </div>

                    <button
                      onClick={e => handleTogglePin(contact.id, e)}
                      className="p-1 text-slate-300 hover:text-emerald-700 ml-2"
                      title="Pin Chat"
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MAIN CHAT CONVERSATION WORKSPACE */}
        <div className={`md:col-span-8 lg:col-span-8 flex flex-col bg-[#efeae2] relative ${showMobileConversation ? "flex" : "hidden md:flex"}`}>
          
          {/* Active Chat Header */}
          <div className="bg-emerald-950 text-white p-3.5 flex items-center justify-between shadow-md z-10 shrink-0">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowMobileConversation(false)}
                className="md:hidden p-1.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 hover:text-white rounded-xl flex items-center justify-center shrink-0"
                title="Back to Candidate Threads"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <img
                src={activeContact.avatarUrl}
                alt={activeContact.fullName}
                className="w-10 h-10 rounded-2xl object-cover border border-emerald-400/80"
              />
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-extrabold text-sm text-white">{activeContact.fullName}</h3>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-center space-x-2 text-[11px]">
                  <span className="text-emerald-200 font-medium">
                    {activeContact.role} • {activeContact.suburb}, {activeContact.city}
                  </span>
                  <span className="text-emerald-400">•</span>
                  <span className="text-emerald-300 flex items-center gap-1 font-mono">
                    <span className={`w-2 h-2 rounded-full ${activeContact.onlineStatus === 'online' || activeContact.onlineStatus === 'typing' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
                    {activeContact.onlineStatus === "typing" ? (
                      <strong className="text-emerald-300 animate-pulse font-bold">typing...</strong>
                    ) : activeContact.onlineStatus === "online" ? (
                      "Online"
                    ) : (
                      activeContact.lastSeen
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Header Right Action Buttons */}
            <div className="flex items-center space-x-1">
              {/* In-Chat Search Toggle */}
              <button
                onClick={() => setShowInChatSearch(!showInChatSearch)}
                className={`p-2 rounded-xl transition-all ${
                  showInChatSearch ? "bg-emerald-800 text-white" : "text-emerald-200 hover:text-white hover:bg-emerald-900"
                }`}
                title="Search Messages"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Voice Call Button */}
              <button
                onClick={startVoiceCall}
                className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-900 rounded-xl transition-all"
                title="Voice Call"
              >
                <Phone className="w-4 h-4" />
              </button>

              {/* Video Call Button */}
              <button
                onClick={startVideoCall}
                className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-900 rounded-xl transition-all"
                title="Video Call"
              >
                <Video className="w-4 h-4" />
              </button>

              {/* Create Interview Invitation */}
              <button
                onClick={() => setShowInterviewComposer(true)}
                className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-1 ml-2"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Invite</span>
              </button>
            </div>
          </div>

          {/* In-Chat Search Bar (Expandable) */}
          {showInChatSearch && (
            <div className="bg-white border-b border-slate-200 p-2.5 flex items-center space-x-2 animate-in slide-in-from-top-2 duration-150 z-10">
              <Search className="w-4 h-4 text-emerald-600" />
              <input
                type="text"
                placeholder="Search within this chat history..."
                value={inChatSearch}
                onChange={e => setInChatSearch(e.target.value)}
                className="flex-1 text-xs bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-400 font-bold">
                {displayedMessages.length} matches
              </span>
              <button onClick={() => { setShowInChatSearch(false); setInChatSearch(""); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* CHAT BUBBLES CONTAINER */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
            {displayedMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.senderId === "me" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm relative ${
                    msg.senderId === "me"
                      ? "bg-emerald-700 text-white rounded-tr-none"
                      : "bg-white text-slate-900 rounded-tl-none border border-slate-200/80"
                  }`}
                >
                  {/* Sender Label */}
                  <div className="font-extrabold text-[10px] mb-1 opacity-80 flex items-center justify-between">
                    <span>{msg.senderName}</span>
                    {msg.senderId === "me" && (
                      <span className="text-[9px] text-emerald-200 font-mono ml-2">Employer</span>
                    )}
                  </div>

                  {/* 1. TEXT MESSAGE */}
                  {msg.type === "text" && (
                    <div>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      {msg.translatedText && msg.translatedText !== msg.text && (
                        <div className="mt-2 pt-1.5 border-t border-slate-200/40 text-[10px] text-emerald-950 font-medium bg-emerald-50/90 p-2 rounded-lg">
                          <span className="font-extrabold text-emerald-800">AI Shona/English Translation: </span>
                          {msg.translatedText}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. VOICE NOTE MESSAGE */}
                  {msg.type === "voice" && (
                    <div className="space-y-2 min-w-[220px]">
                      <div className="flex items-center space-x-3 bg-black/10 p-2.5 rounded-xl">
                        <button
                          onClick={() => setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)}
                          className="w-9 h-9 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full flex items-center justify-center shrink-0 shadow-md transition-all"
                        >
                          {playingAudioId === msg.id ? (
                            <Pause className="w-4 h-4 fill-slate-950" />
                          ) : (
                            <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                          )}
                        </button>

                        {/* Waveform Visualizer */}
                        <div className="flex-1 flex items-center space-x-0.5 h-6">
                          {(msg.waveformData || [30, 60, 90, 40, 80, 20, 70, 90, 50, 30, 80, 100, 40, 60, 80]).map((h, i) => (
                            <span
                              key={i}
                              style={{ height: `${Math.max(20, h)}%` }}
                              className={`w-1 rounded-full transition-all ${
                                playingAudioId === msg.id
                                  ? "bg-emerald-300 animate-pulse"
                                  : msg.senderId === "me" ? "bg-white/70" : "bg-emerald-700"
                              }`}
                            ></span>
                          ))}
                        </div>

                        {/* Speed Toggle Pill */}
                        <button
                          onClick={() => setPlaybackSpeed(s => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1))}
                          className="px-1.5 py-0.5 bg-black/20 text-[9px] font-black rounded-md text-white border border-white/20"
                          title="Playback Speed"
                        >
                          {playbackSpeed}x
                        </button>
                      </div>

                      <div className="flex justify-between items-center text-[10px] opacity-80 px-1 font-mono">
                        <span>🎤 Voice Note ({msg.durationSec || 15}s)</span>
                        <span>0:00 / {formatSeconds(msg.durationSec || 15)}</span>
                      </div>
                    </div>
                  )}

                  {/* 3. IMAGE MESSAGE */}
                  {msg.type === "image" && (
                    <div className="space-y-2">
                      <div
                        onClick={() => setSelectedImage(msg.imageUrl || null)}
                        className="rounded-xl overflow-hidden cursor-pointer group relative border border-black/10"
                      >
                        <img
                          src={msg.imageUrl}
                          alt="Attachment"
                          className="w-full max-h-56 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-6 h-6" />
                        </div>
                      </div>
                      {msg.caption && <p className="text-xs font-medium">{msg.caption}</p>}
                    </div>
                  )}

                  {/* 4. VIDEO MESSAGE */}
                  {msg.type === "video" && (
                    <div className="space-y-2 max-w-xs">
                      <div className="relative rounded-xl overflow-hidden border border-black/10 group">
                        <img
                          src={msg.thumbnailUrl}
                          alt="Video Thumbnail"
                          className="w-full h-44 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <button className="w-12 h-12 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                          </button>
                        </div>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white font-mono text-[10px] rounded-md">
                          {msg.videoDuration || "0:45"}
                        </span>
                      </div>
                      {msg.caption && <p className="text-xs">{msg.caption}</p>}
                    </div>
                  )}

                  {/* 5. PDF DOCUMENT MESSAGE */}
                  {msg.type === "pdf" && (
                    <div className="bg-slate-900 text-white p-3 rounded-xl space-y-2 border border-slate-700 min-w-[240px]">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="font-extrabold text-xs text-white truncate">{msg.pdfName}</h5>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {msg.pdfPageCount || 2} Pages • {msg.pdfSize || "1.2 MB"} • PDF Document
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2 border-t border-slate-800 text-[11px]">
                        <button
                          onClick={() => setSelectedPdf({ name: msg.pdfName || "Document.pdf", size: msg.pdfSize || "1.2 MB", pages: msg.pdfPageCount || 2 })}
                          className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold rounded-lg transition-colors text-center"
                        >
                          View PDF
                        </button>
                        <button
                          onClick={() => alert(`Downloading ${msg.pdfName}`)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 6. INTERVIEW INVITATION CARD */}
                  {msg.type === "interview_invitation" && msg.interviewData && (
                    <div className="bg-white text-slate-900 p-4 rounded-2xl space-y-3 border border-emerald-200 shadow-md min-w-[280px]">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-extrabold text-[10px] rounded uppercase tracking-wider flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-emerald-700" />
                          <span>Interview Invitation</span>
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            msg.interviewData.status === "accepted"
                              ? "bg-emerald-600 text-white"
                              : msg.interviewData.status === "declined"
                              ? "bg-rose-600 text-white"
                              : "bg-amber-100 text-amber-900 border border-amber-300"
                          }`}
                        >
                          {msg.interviewData.status.toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-black text-sm text-slate-900">{msg.interviewData.position}</h4>
                        <p className="text-xs font-semibold text-emerald-800 mt-0.5">{msg.interviewData.date}</p>
                        <p className="text-xs text-slate-600 font-mono">{msg.interviewData.time}</p>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-1">
                        <div className="flex items-center space-x-1.5 text-slate-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{msg.interviewData.venue}</span>
                        </div>
                        {msg.interviewData.notes && (
                          <p className="text-[10px] text-slate-500 italic border-t border-slate-200/60 pt-1 mt-1">
                            "{msg.interviewData.notes}"
                          </p>
                        )}
                      </div>

                      {/* Candidate Actions if Pending */}
                      {msg.interviewData.status === "pending" && (
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => handleRespondToInterview(msg.id, true)}
                            className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleRespondToInterview(msg.id, false)}
                            className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center space-x-1"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>Decline</span>
                          </button>
                        </div>
                      )}

                      {msg.interviewData.responseNote && (
                        <div className="p-2 bg-emerald-50 rounded-xl text-[10px] text-emerald-900 font-medium border border-emerald-200">
                          <strong>Candidate Response:</strong> {msg.interviewData.responseNote}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Timestamp & Read Receipt */}
                  <div className="flex items-center justify-end space-x-1 text-[9px] opacity-75 mt-1 font-mono">
                    <span>{msg.timestamp}</span>
                    {msg.senderId === "me" && (
                      <span>
                        {msg.status === "read" ? (
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-300 font-extrabold" title="Read" />
                        ) : msg.status === "delivered" ? (
                          <CheckCheck className="w-3.5 h-3.5 text-white/80" title="Delivered" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-white/80" title="Sent" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Candidate Typing Indicator */}
            {activeContact.onlineStatus === "typing" && (
              <div className="flex items-center space-x-2 bg-white p-2.5 rounded-2xl w-fit border border-slate-200 shadow-sm animate-pulse">
                <span className="text-xs font-bold text-emerald-800">{activeContact.fullName} is typing</span>
                <div className="flex space-x-1">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ATTACHMENT MENU DRAWER */}
          {showAttachmentMenu && (
            <div className="absolute bottom-20 left-4 bg-white border border-slate-200 rounded-3xl p-3 shadow-2xl z-20 flex items-center space-x-3 animate-in slide-in-from-bottom-3 duration-200">
              <button
                onClick={handleSendSampleImage}
                className="flex flex-col items-center space-y-1 p-2 hover:bg-slate-50 rounded-2xl transition-colors text-slate-800"
              >
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold">Image</span>
              </button>

              <button
                onClick={handleSendSamplePdf}
                className="flex flex-col items-center space-y-1 p-2 hover:bg-slate-50 rounded-2xl transition-colors text-slate-800"
              >
                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold">PDF Doc</span>
              </button>

              <button
                onClick={() => { setShowAttachmentMenu(false); setShowInterviewComposer(true); }}
                className="flex flex-col items-center space-y-1 p-2 hover:bg-slate-50 rounded-2xl transition-colors text-slate-800"
              >
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold">Interview</span>
              </button>
            </div>
          )}

          {/* INPUT BAR / VOICE RECORDING BAR */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            {isRecording ? (
              <div className="flex items-center justify-between bg-rose-50 border border-rose-200 p-2.5 rounded-2xl animate-pulse">
                <div className="flex items-center space-x-3">
                  <span className="w-3 h-3 bg-rose-600 rounded-full animate-ping"></span>
                  <span className="text-xs font-black text-rose-900 font-mono">
                    Recording Voice Note... ({formatSeconds(recordingSeconds)})
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsRecording(false)}
                    className="p-2 text-slate-500 hover:text-rose-600"
                    title="Cancel Recording"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSendVoiceNote}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Voice Note</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {/* Paperclip Button */}
                <button
                  onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                  className={`p-2.5 rounded-xl transition-all ${
                    showAttachmentMenu ? "bg-emerald-100 text-emerald-800" : "text-slate-500 hover:bg-slate-100"
                  }`}
                  title="Attach File"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {/* Text Field */}
                <input
                  type="text"
                  placeholder={`Type message to ${activeContact.fullName} in English, Shona, or Ndebele...`}
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />

                {/* Mic Record Button vs Send Button */}
                {messageInput.trim() ? (
                  <button
                    onClick={handleSendMessage}
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-md transition-all shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsRecording(true)}
                    className="p-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl shadow-md transition-all shrink-0"
                    title="Hold to record voice note"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: VOICE CALL SCREEN OVERLAY */}
      {activeVoiceCall && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-slate-900 to-emerald-950 text-white border border-emerald-800/60 rounded-3xl max-w-sm w-full p-8 text-center space-y-6 shadow-2xl relative">
            <div className="space-y-2">
              <div className="relative w-24 h-24 mx-auto">
                <img
                  src={activeVoiceCall.contact.avatarUrl}
                  alt={activeVoiceCall.contact.fullName}
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-emerald-500/40"
                />
                <span className="absolute inset-0 rounded-3xl ring-8 ring-emerald-500/20 animate-ping"></span>
              </div>
              <h3 className="font-black text-xl text-white">{activeVoiceCall.contact.fullName}</h3>
              <p className="text-xs text-emerald-300 font-medium">{activeVoiceCall.contact.role}</p>
              <p className="text-xs text-emerald-400 font-mono font-bold">
                WhatsApp Voice Call • {formatSeconds(activeVoiceCall.duration)}
              </p>
            </div>

            <div className="flex items-center justify-center space-x-6 pt-4">
              <button
                onClick={() => setActiveVoiceCall(p => p ? { ...p, isMuted: !p.isMuted } : null)}
                className={`p-4 rounded-full transition-all ${
                  activeVoiceCall.isMuted ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                {activeVoiceCall.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              <button
                onClick={endVoiceCall}
                className="p-5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg transition-transform hover:scale-105"
                title="End Call"
              >
                <PhoneOff className="w-7 h-7" />
              </button>

              <button
                onClick={() => setActiveVoiceCall(p => p ? { ...p, isSpeaker: !p.isSpeaker } : null)}
                className={`p-4 rounded-full transition-all ${
                  activeVoiceCall.isSpeaker ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-200"
                }`}
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: VIDEO CALL SCREEN OVERLAY */}
      {activeVideoCall && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full h-[600px] overflow-hidden shadow-2xl relative flex flex-col justify-between">
            
            {/* Simulated Candidate Video Stream */}
            <div className="absolute inset-0">
              <img
                src={activeVideoCall.contact.avatarUrl}
                alt={activeVideoCall.contact.fullName}
                className="w-full h-full object-cover filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60"></div>
            </div>

            {/* Top Bar */}
            <div className="relative z-10 p-6 flex items-center justify-between text-white">
              <div>
                <h3 className="font-extrabold text-base text-white">{activeVideoCall.contact.fullName}</h3>
                <p className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                  HD Video Call • {formatSeconds(activeVideoCall.duration)}
                </p>
              </div>

              {/* Picture-in-Picture Self Feed */}
              <div className="w-28 h-36 bg-slate-950 rounded-2xl border-2 border-emerald-500 overflow-hidden shadow-xl relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
                  alt="Self"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 text-[8px] bg-black/60 px-1 py-0.5 rounded text-white font-mono">You</span>
              </div>
            </div>

            {/* Bottom Call Controls */}
            <div className="relative z-10 p-6 flex items-center justify-center space-x-6">
              <button
                onClick={() => setActiveVideoCall(p => p ? { ...p, isMuted: !p.isMuted } : null)}
                className={`p-4 rounded-full transition-all ${
                  activeVideoCall.isMuted ? "bg-rose-600 text-white" : "bg-slate-800/80 backdrop-blur-md text-white"
                }`}
              >
                {activeVideoCall.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              <button
                onClick={endVideoCall}
                className="p-5 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-xl transition-transform hover:scale-105"
              >
                <VideoOff className="w-7 h-7" />
              </button>

              <button
                onClick={() => setActiveVideoCall(p => p ? { ...p, isCameraOff: !p.isCameraOff } : null)}
                className={`p-4 rounded-full transition-all ${
                  activeVideoCall.isCameraOff ? "bg-amber-600 text-white" : "bg-slate-800/80 backdrop-blur-md text-white"
                }`}
              >
                <Camera className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: INTERVIEW INVITATION COMPOSER */}
      {showInterviewComposer && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative my-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">Schedule Interview Invitation</h3>
              </div>
              <button onClick={() => setShowInterviewComposer(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                const form = e.target as any;
                handleSendInterviewInvitation({
                  position: form.position.value,
                  date: form.date.value,
                  time: form.time.value,
                  venue: form.venue.value,
                  isVirtual: form.isVirtual.checked,
                  notes: form.notes.value
                });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-800 block mb-1">Position / Job Role</label>
                <input
                  type="text"
                  name="position"
                  defaultValue={`Full-Time ${activeContact.role}`}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Date</label>
                  <input
                    type="text"
                    name="date"
                    defaultValue="Friday, Aug 15, 2026"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Time (CAT)</label>
                  <input
                    type="text"
                    name="time"
                    defaultValue="10:00 AM CAT"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Venue / Physical Address or Link</label>
                <input
                  type="text"
                  name="venue"
                  defaultValue={`Borrowdale Estate, Gate 2 (${activeContact.city})`}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Instructions / Employer Notes</label>
                <textarea
                  name="notes"
                  defaultValue="Please bring original national ID and reference contacts."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                ></textarea>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input type="checkbox" name="isVirtual" id="isVirtual" className="w-4 h-4 accent-emerald-600" />
                <label htmlFor="isVirtual" className="font-bold text-slate-700">Virtual Interview (WhatsApp Video Call)</label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                Send Interview Invitation Card
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: IMAGE LIGHTBOX */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-slate-300"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={selectedImage} alt="Expanded" className="w-full rounded-2xl max-h-[80vh] object-contain" />
          </div>
        </div>
      )}

      {/* MODAL 5: PDF DOCUMENT PREVIEW */}
      {selectedPdf && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl relative my-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-rose-400" />
                <h3 className="font-extrabold text-white text-sm">{selectedPdf.name}</h3>
              </div>
              <button onClick={() => setSelectedPdf(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
              <FileText className="w-16 h-16 text-rose-500 mx-auto" />
              <p className="text-xs font-bold text-slate-200">{selectedPdf.name}</p>
              <p className="text-[11px] text-slate-400 font-mono">
                {selectedPdf.pages} Pages • {selectedPdf.size} • Verified ZMC Document
              </p>
              <div className="p-3 bg-slate-900 rounded-xl text-[10px] text-emerald-400 font-medium">
                ✓ Document Cryptographically Sealed & Verified by Zimbabwe Maids Centre Vetting Engine
              </div>
            </div>

            <button
              onClick={() => { alert(`Downloading ${selectedPdf.name}`); setSelectedPdf(null); }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Original PDF File</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
