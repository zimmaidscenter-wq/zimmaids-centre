import React, { useState } from "react";
import { WorkerProfile, MessageItem } from "../../types/marketplace";
import { INITIAL_MESSAGES } from "../../data/mockData";
import { X, Send, Languages, ShieldCheck, Volume2, Sparkles } from "lucide-react";

interface ChatModalProps {
  worker: WorkerProfile | null;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ worker, onClose }) => {
  const [messages, setMessages] = useState<MessageItem[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [showTranslations, setShowTranslations] = useState(true);

  if (!worker) return null;

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: MessageItem = {
      id: `m-${Date.now()}`,
      senderName: "Homeowner",
      senderRole: "Employer",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
      translatedText: inputText,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Simulated reply
    setTimeout(() => {
      const replyMessage: MessageItem = {
        id: `m-${Date.now() + 1}`,
        senderName: worker.fullName,
        senderRole: worker.role,
        text: `Ndatenda zvikuru! Ndichakubata pa +263 771 xxx xxx. Ndine chokwadi chekuti tinoshanda zvakanaka.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: false,
        translatedText: `Thank you very much! I will contact you on +263 771 xxx xxx. I am confident we will work well together.`,
      };
      setMessages((prev) => [...prev, replyMessage]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full h-[600px] flex flex-col overflow-hidden shadow-2xl relative my-auto animate-in zoom-in-95 duration-200">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-4 flex items-center justify-between border-b border-emerald-800/40">
          <div className="flex items-center space-x-3">
            <img
              src={worker.avatarUrl}
              alt={worker.fullName}
              className="w-10 h-10 rounded-xl object-cover border border-emerald-400/80"
            />
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-sm text-white">{worker.fullName}</h3>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-[11px] text-emerald-200">
                {worker.role} • {worker.suburb}, {worker.city}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTranslations(!showTranslations)}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 border transition-colors ${
                showTranslations
                  ? "bg-emerald-500 text-slate-950 border-emerald-400"
                  : "bg-emerald-950 text-emerald-200 border-emerald-700"
              }`}
              title="Toggle AI Shona/English Translation"
            >
              <Languages className="w-3.5 h-3.5" />
              <span className="text-[10px]">AI Auto-Translate</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-emerald-200 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                  msg.isMe
                    ? "bg-emerald-600 text-white rounded-br-none"
                    : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                }`}
              >
                <div className="font-bold text-[10px] mb-0.5 opacity-80">{msg.senderName}</div>
                <p>{msg.text}</p>
                {showTranslations && msg.translatedText && msg.translatedText !== msg.text && (
                  <div className="mt-1.5 pt-1.5 border-t border-slate-200/50 text-[10px] italic text-emerald-800 font-medium bg-emerald-50/80 p-1.5 rounded-md">
                    <span className="font-bold not-italic">EN Translation: </span>
                    {msg.translatedText}
                  </div>
                )}
              </div>
              <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type message in English, Shona, or Ndebele..."
            className="flex-1 px-3.5 py-2.5 bg-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
          />
          <button
            onClick={handleSend}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
