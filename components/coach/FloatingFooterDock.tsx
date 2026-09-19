import React, { useState, useRef, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  User,
  X,
  Send,
  CheckCheck,
  Search,
  ChevronRight,
  Dumbbell,
  Settings,
  Moon,
  Sun,
  LogOut,
  ExternalLink,
  Circle,
} from 'lucide-react';
import { TraineeProfile } from '@/types';
import { CURRENT_COACH } from '@/lib/mock-data';
import { useTheme } from '../../src/context/ThemeContext';

interface Message {
  id: string;
  sender: 'coach' | 'trainee';
  text: string;
  timestamp: string;
}

interface Conversation {
  traineeId: string;
  unreadCount: number;
  lastMessage: string;
  lastTimestamp: string;
  messages: Message[];
}

interface FloatingFooterDockProps {
  trainees: TraineeProfile[];
  onNavigateToRoster: () => void;
  onNavigateToProgram: (traineeId: string) => void;
  onNavigateToSettings: () => void;
  onSignOut?: () => void;
}

const INITIAL_CONVERSATIONS: Record<string, Conversation> = {
  trainee_kaiya: {
    traineeId: 'trainee_kaiya',
    unreadCount: 1,
    lastMessage: 'Will do! Should I adjust my warm-up sets?',
    lastTimestamp: '10:42 AM',
    messages: [
      {
        id: 'msg_1',
        sender: 'trainee',
        text: 'Hey Coach Roger! Finished today’s squat session. RPE 8 on the top set felt surprisingly smooth.',
        timestamp: '10:15 AM',
      },
      {
        id: 'msg_2',
        sender: 'coach',
        text: 'Great depth on the video Kaiya! Keep your ribs down on the ascent. We will add 2.5kg next week.',
        timestamp: '10:30 AM',
      },
      {
        id: 'msg_3',
        sender: 'trainee',
        text: 'Will do! Should I adjust my warm-up sets?',
        timestamp: '10:42 AM',
      },
    ],
  },
  trainee_wilson: {
    traineeId: 'trainee_wilson',
    unreadCount: 1,
    lastMessage: 'Hamstrings are a bit tight from RDLs. Rest or mobility work?',
    lastTimestamp: '9:18 AM',
    messages: [
      {
        id: 'msg_4',
        sender: 'trainee',
        text: 'Good morning coach! Hamstrings are a bit tight from RDLs. Rest or mobility work?',
        timestamp: '9:18 AM',
      },
    ],
  },
  trainee_olivia: {
    traineeId: 'trainee_olivia',
    unreadCount: 0,
    lastMessage: 'Bench press form video uploaded to workout log.',
    lastTimestamp: 'Yesterday',
    messages: [
      {
        id: 'msg_5',
        sender: 'coach',
        text: 'Hey Olivia, your bench bar path is looking much more vertical. Excellent elbow tuck.',
        timestamp: 'Yesterday',
      },
      {
        id: 'msg_6',
        sender: 'trainee',
        text: 'Bench press form video uploaded to workout log.',
        timestamp: 'Yesterday',
      },
    ],
  },
  trainee_01: {
    traineeId: 'trainee_01',
    unreadCount: 0,
    lastMessage: 'Ready for the new microcycle!',
    lastTimestamp: 'Sep 15',
    messages: [
      {
        id: 'msg_7',
        sender: 'coach',
        text: 'Marcus, your new 4-week powerbuilding block is published in your app.',
        timestamp: 'Sep 15',
      },
      {
        id: 'msg_8',
        sender: 'trainee',
        text: 'Ready for the new microcycle!',
        timestamp: 'Sep 15',
      },
    ],
  },
};

type OpenPanel = 'client' | 'chat' | 'profile' | null;

export const FloatingFooterDock: React.FC<FloatingFooterDockProps> = ({
  trainees,
  onNavigateToRoster,
  onNavigateToProgram,
  onNavigateToSettings,
  onSignOut,
}) => {
  const { isBright, toggleTheme } = useTheme();
  const [activePanel, setActivePanel] = useState<OpenPanel>(null);
  const [conversations, setConversations] = useState<Record<string, Conversation>>(INITIAL_CONVERSATIONS);
  const [selectedChatTraineeId, setSelectedChatTraineeId] = useState<string>('trainee_kaiya');
  const [chatInputText, setChatInputText] = useState('');
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Total unread messages across all trainees
  const totalUnreadCount = (Object.values(conversations) as Conversation[]).reduce(
    (acc: number, curr: Conversation) => acc + curr.unreadCount,
    0
  );

  // Scroll chat to bottom when conversation or message changes
  useEffect(() => {
    if (activePanel === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activePanel, selectedChatTraineeId, conversations]);

  const togglePanel = (panel: OpenPanel) => {
    if (activePanel === panel) {
      setActivePanel(null);
    } else {
      setActivePanel(panel);
      // If opening chat, clear unread for active trainee
      if (panel === 'chat') {
        setConversations((prev) => {
          const current = prev[selectedChatTraineeId];
          if (!current || current.unreadCount === 0) return prev;
          return {
            ...prev,
            [selectedChatTraineeId]: {
              ...current,
              unreadCount: 0,
            },
          };
        });
      }
    }
  };

  const handleSelectChatTrainee = (id: string) => {
    setSelectedChatTraineeId(id);
    setConversations((prev) => {
      const current = prev[id];
      if (!current || current.unreadCount === 0) return prev;
      return {
        ...prev,
        [id]: {
          ...current,
          unreadCount: 0,
        },
      };
    });
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInputText.trim()) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      sender: 'coach',
      text: chatInputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) => {
      const current = prev[selectedChatTraineeId] || {
        traineeId: selectedChatTraineeId,
        unreadCount: 0,
        lastMessage: '',
        lastTimestamp: '',
        messages: [],
      };

      return {
        ...prev,
        [selectedChatTraineeId]: {
          ...current,
          lastMessage: newMessage.text,
          lastTimestamp: newMessage.timestamp,
          messages: [...current.messages, newMessage],
        },
      };
    });

    setChatInputText('');
  };

  const selectedTrainee = trainees.find((t) => t.id === selectedChatTraineeId) || trainees[0];
  const activeConversation = conversations[selectedChatTraineeId] || {
    traineeId: selectedChatTraineeId,
    unreadCount: 0,
    lastMessage: 'No messages yet',
    lastTimestamp: 'Now',
    messages: [],
  };

  // Filter trainees for client popover
  const filteredTrainees = trainees.filter((t) =>
    t.user.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
    t.targetFocus.toLowerCase().includes(clientSearchQuery.toLowerCase())
  );

  return (
    <>
      {/* Popovers Area (Pointer events auto inside) */}
      {activePanel && (
        <div className="fixed bottom-16 right-4 sm:right-6 z-50 pointer-events-auto">
        {/* CLIENT FLOATING POPOVER */}
        {activePanel === 'client' && (
          <div
            id="floating-client-panel"
            className={`w-[calc(100vw-2rem)] sm:w-96 rounded-2xl border shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 transition-colors ${
              isBright
                ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/60'
                : 'bg-zinc-900/95 border-zinc-800 text-zinc-100 shadow-black/80'
            }`}
          >
            {/* Header */}
            <div className={`p-3.5 border-b flex items-center justify-between ${
              isBright ? 'border-slate-100 bg-slate-50/50' : 'border-zinc-800/80 bg-zinc-950/40'
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold leading-none">Athletes & Clients</h3>
                  <p className={`text-[10px] mt-0.5 ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                    {trainees.length} Assigned Clients
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setActivePanel(null);
                    onNavigateToRoster();
                  }}
                  className={`text-[11px] font-semibold px-2 py-1 rounded-lg transition-colors ${
                    isBright ? 'text-[#1877F2] hover:bg-blue-50' : 'text-blue-400 hover:bg-blue-500/10'
                  }`}
                >
                  View All
                </button>
                <button
                  onClick={() => setActivePanel(null)}
                  className={`p-1 rounded-lg transition-colors ${
                    isBright ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                  aria-label="Close client panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className={`p-2.5 border-b ${isBright ? 'border-slate-100' : 'border-zinc-800/60'}`}>
              <div className="relative">
                <Search className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 ${isBright ? 'text-slate-400' : 'text-zinc-500'}`} />
                <input
                  type="text"
                  placeholder="Filter client..."
                  value={clientSearchQuery}
                  onChange={(e) => setClientSearchQuery(e.target.value)}
                  className={`w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    isBright
                      ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-[#1877F2]'
                  }`}
                />
              </div>
            </div>

            {/* Client List */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-1 divide-y divide-transparent">
              {filteredTrainees.map((t) => (
                <div
                  key={t.id}
                  className={`p-2 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                    isBright ? 'hover:bg-slate-50' : 'hover:bg-zinc-850/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      {t.user.avatarUrl ? (
                        <img
                          src={t.user.avatarUrl}
                          alt={t.user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#1877F2]/20 text-[#1877F2] font-bold text-xs flex items-center justify-center">
                          {t.user.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-zinc-900 absolute bottom-0 right-0" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate leading-tight">{t.user.name}</p>
                      <p className={`text-[10px] truncate ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                        {t.targetFocus}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        handleSelectChatTrainee(t.id);
                        setActivePanel('chat');
                      }}
                      title="Chat with client"
                      className={`p-1.5 rounded-lg transition-colors ${
                        isBright
                          ? 'text-slate-600 hover:text-[#1877F2] hover:bg-blue-50'
                          : 'text-zinc-400 hover:text-blue-400 hover:bg-zinc-800'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setActivePanel(null);
                        onNavigateToProgram(t.id);
                      }}
                      title="Assign / View Program"
                      className={`p-1.5 rounded-lg transition-colors ${
                        isBright
                          ? 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                          : 'text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800'
                      }`}
                    >
                      <Dumbbell className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {filteredTrainees.length === 0 && (
                <div className="py-6 text-center text-xs text-zinc-500">
                  No clients matching "{clientSearchQuery}"
                </div>
              )}
            </div>

            {/* Footer quick action */}
            <div className={`p-2.5 border-t text-center ${isBright ? 'border-slate-100 bg-slate-50/50' : 'border-zinc-800/80 bg-zinc-950/40'}`}>
              <button
                onClick={() => {
                  setActivePanel(null);
                  onNavigateToRoster();
                }}
                className={`w-full py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  isBright
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                }`}
              >
                Open Full Client Roster
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* CHAT FLOATING MESSENGER POPOVER */}
        {activePanel === 'chat' && (
          <div
            id="floating-chat-panel"
            className={`w-[calc(100vw-2rem)] sm:w-[400px] h-[520px] max-h-[82vh] rounded-2xl border shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 transition-colors ${
              isBright
                ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/60'
                : 'bg-zinc-900/95 border-zinc-800 text-zinc-100 shadow-black/80'
            }`}
          >
            {/* Top Bar with Trainee Switcher */}
            <div className={`p-3 border-b flex items-center justify-between ${
              isBright ? 'border-slate-100 bg-slate-50/80' : 'border-zinc-800/80 bg-zinc-950/60'
            }`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative">
                  {selectedTrainee?.user.avatarUrl ? (
                    <img
                      src={selectedTrainee.user.avatarUrl}
                      alt={selectedTrainee.user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#1877F2]/20 text-[#1877F2] font-bold text-xs flex items-center justify-center">
                      {selectedTrainee?.user.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 absolute bottom-0 right-0" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <select
                      value={selectedChatTraineeId}
                      onChange={(e) => handleSelectChatTrainee(e.target.value)}
                      className={`text-xs font-bold bg-transparent border-0 cursor-pointer focus:outline-none truncate max-w-[150px] sm:max-w-[180px] ${
                        isBright ? 'text-slate-900' : 'text-zinc-100'
                      }`}
                    >
                      {trainees.map((t) => (
                        <option
                          key={t.id}
                          value={t.id}
                          className={isBright ? 'bg-white text-slate-900' : 'bg-zinc-900 text-zinc-100'}
                        >
                          {t.user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[10px] text-emerald-500 flex items-center gap-1 font-medium">
                    <Circle className="w-1.5 h-1.5 fill-current" />
                    Online • Direct Coaching Channel
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setActivePanel(null);
                    onNavigateToProgram(selectedChatTraineeId);
                  }}
                  title="Open Program"
                  className={`p-1.5 rounded-lg transition-colors ${
                    isBright ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  <Dumbbell className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActivePanel(null)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isBright ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Trainee Tabs Horizontal Bar */}
            <div className={`px-2 py-1.5 border-b flex items-center gap-1.5 overflow-x-auto no-scrollbar ${
              isBright ? 'border-slate-100 bg-slate-50/40' : 'border-zinc-800/60 bg-zinc-950/30'
            }`}>
              {trainees.slice(0, 6).map((t) => {
                const isSelected = t.id === selectedChatTraineeId;
                const unread = conversations[t.id]?.unreadCount || 0;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelectChatTrainee(t.id)}
                    className={`relative px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-[#1877F2] text-white font-bold shadow-sm'
                        : isBright
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <span>{t.user.name.split(' ')[0]}</span>
                    {unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                        {unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Messages Area */}
            <div className={`flex-1 p-3.5 overflow-y-auto space-y-3 ${
              isBright ? 'bg-slate-50/30' : 'bg-zinc-950/20'
            }`}>
              {activeConversation.messages.map((msg) => {
                const isCoach = msg.sender === 'coach';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isCoach ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        isCoach
                          ? 'bg-[#1877F2] text-white rounded-br-sm shadow-sm'
                          : isBright
                          ? 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-sm shadow-sm'
                          : 'bg-zinc-800 border border-zinc-700/60 text-zinc-100 rounded-bl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-1 mt-1 px-1">
                      <span className={`text-[10px] ${isBright ? 'text-slate-400' : 'text-zinc-500'}`}>
                        {msg.timestamp}
                      </span>
                      {isCoach && (
                        <CheckCheck className="w-3 h-3 text-blue-400" />
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick coaching prompts */}
            <div className={`px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t ${
              isBright ? 'border-slate-100 bg-white' : 'border-zinc-800/60 bg-zinc-900'
            }`}>
              {[
                'Great form! 🔥',
                'Add 2.5kg next session',
                'Deload as prescribed',
                'Check your rest periods',
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setChatInputText(preset)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 transition-colors ${
                    isBright
                      ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                      : 'border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Chat Input Form */}
            <form
              onSubmit={handleSendMessage}
              className={`p-2.5 border-t flex items-center gap-2 ${
                isBright ? 'border-slate-100 bg-white' : 'border-zinc-800 bg-zinc-900'
              }`}
            >
              <input
                type="text"
                placeholder={`Message ${selectedTrainee?.user.name}...`}
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                className={`flex-1 text-xs px-3 py-2 rounded-xl border focus:outline-none transition-colors ${
                  isBright
                    ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#1877F2]'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-[#1877F2]'
                }`}
              />
              <button
                type="submit"
                disabled={!chatInputText.trim()}
                className="w-8 h-8 rounded-xl bg-[#1877F2] hover:bg-blue-600 active:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-colors shadow-sm"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* PROFILE FLOATING POPOVER */}
        {activePanel === 'profile' && (
          <div
            id="floating-profile-panel"
            className={`w-[calc(100vw-2rem)] sm:w-80 rounded-2xl border shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 transition-colors ${
              isBright
                ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/60'
                : 'bg-zinc-900/95 border-zinc-800 text-zinc-100 shadow-black/80'
            }`}
          >
            {/* Profile Header */}
            <div className={`p-4 border-b relative ${
              isBright ? 'border-slate-100 bg-slate-50/60' : 'border-zinc-800/80 bg-zinc-950/40'
            }`}>
              <button
                onClick={() => setActivePanel(null)}
                className={`absolute top-3 right-3 p-1 rounded-lg transition-colors ${
                  isBright ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
                aria-label="Close profile panel"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="relative">
                  {CURRENT_COACH.avatarUrl ? (
                    <img
                      src={CURRENT_COACH.avatarUrl}
                      alt={CURRENT_COACH.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-[#1877F2]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-[#1877F2]/20 text-[#1877F2] font-black text-sm flex items-center justify-center border-2 border-[#1877F2]">
                      {CURRENT_COACH.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 absolute -bottom-0.5 -right-0.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight flex items-center gap-1.5">
                    {CURRENT_COACH.name}
                  </h3>
                  <p className={`text-[11px] font-mono ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                    {CURRENT_COACH.email}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#1877F2]/10 text-[#1877F2]">
                    Head Strength Coach
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className={`grid grid-cols-2 gap-2 p-3 border-b ${isBright ? 'border-slate-100' : 'border-zinc-800/60'}`}>
              <div className={`p-2.5 rounded-xl border text-center ${
                isBright ? 'bg-slate-50 border-slate-200/80' : 'bg-zinc-950/60 border-zinc-800/80'
              }`}>
                <span className={`text-[10px] block uppercase tracking-wider font-semibold ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                  Athletes
                </span>
                <span className="text-base font-extrabold font-mono text-[#1877F2]">
                  {trainees.length}
                </span>
              </div>
              <div className={`p-2.5 rounded-xl border text-center ${
                isBright ? 'bg-slate-50 border-slate-200/80' : 'bg-zinc-950/60 border-zinc-800/80'
              }`}>
                <span className={`text-[10px] block uppercase tracking-wider font-semibold ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                  Avg Adherence
                </span>
                <span className="text-base font-extrabold font-mono text-emerald-500">
                  94%
                </span>
              </div>
            </div>

            {/* Actions list */}
            <div className="p-2 space-y-1">
              <button
                onClick={() => {
                  setActivePanel(null);
                  onNavigateToSettings();
                }}
                className={`w-full p-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                  isBright ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-[#1877F2]" />
                  <span>Coach Settings & Preferences</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              <button
                onClick={toggleTheme}
                className={`w-full p-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                  isBright ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-800 text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isBright ? (
                    <Sun className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Moon className="w-4 h-4 text-blue-400" />
                  )}
                  <span>Theme: <strong>{isBright ? 'Bright' : 'Black'}</strong></span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                  isBright ? 'bg-slate-200 text-slate-700' : 'bg-zinc-800 text-zinc-300'
                }`}>
                  Toggle
                </span>
              </button>

              <button
                onClick={() => {
                  setActivePanel(null);
                  if (onSignOut) {
                    onSignOut();
                  }
                }}
                className={`w-full p-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors text-rose-500 ${
                  isBright ? 'hover:bg-rose-50' : 'hover:bg-rose-950/30'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </div>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </button>
            </div>
          </div>
        )}
        </div>
      )}

      {/* FIXED FOOTER DOCK BAR */}
      <div
        id="floating-footer-dock"
        className={`fixed bottom-0 left-0 md:left-64 lg:left-72 right-0 z-40 border-t backdrop-blur-xl px-4 sm:px-6 py-2.5 flex items-center justify-center transition-all duration-200 ${
          isBright
            ? 'bg-white/95 border-slate-200 text-slate-800 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]'
            : 'bg-zinc-950/95 border-zinc-800/90 text-zinc-200 shadow-[0_-4px_24px_rgba(0,0,0,0.5)]'
        }`}
      >
        {/* Dock Buttons (Client, Chat, Profile) with even spacing and uniform sizes */}
        <div className="w-full max-w-md mx-auto flex items-center justify-center gap-3 sm:gap-4">
          {/* CLIENT BUTTON */}
          <button
            id="dock-btn-client"
            type="button"
            onClick={() => togglePanel('client')}
            className={`flex-1 sm:flex-initial min-w-[96px] sm:min-w-[108px] h-9 flex items-center justify-center gap-2 px-4 rounded-xl text-xs font-semibold transition-all select-none ${
              activePanel === 'client'
                ? 'bg-[#1877F2] text-white shadow-sm'
                : isBright
                ? 'bg-transparent text-slate-700 hover:text-slate-950 hover:bg-slate-100/70'
                : 'bg-transparent text-zinc-300 hover:text-white hover:bg-zinc-900/70'
            }`}
            aria-label="Toggle clients menu"
            title="Clients & Athletes"
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>Client</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold leading-none ${
              activePanel === 'client'
                ? 'bg-white/20 text-white'
                : isBright
                ? 'bg-slate-100 text-slate-700'
                : 'bg-zinc-900 text-zinc-300'
            }`}>
              {trainees.length}
            </span>
          </button>

          {/* CHAT BUTTON */}
          <button
            id="dock-btn-chat"
            type="button"
            onClick={() => togglePanel('chat')}
            className={`flex-1 sm:flex-initial min-w-[96px] sm:min-w-[108px] h-9 flex items-center justify-center gap-2 px-4 rounded-xl text-xs font-semibold transition-all select-none relative ${
              activePanel === 'chat'
                ? 'bg-[#1877F2] text-white shadow-sm'
                : isBright
                ? 'bg-transparent text-slate-700 hover:text-slate-950 hover:bg-slate-100/70'
                : 'bg-transparent text-zinc-300 hover:text-white hover:bg-zinc-900/70'
            }`}
            aria-label="Toggle coach chat"
            title="Direct Client Messaging"
          >
            <div className="relative flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              {totalUnreadCount > 0 && activePanel !== 'chat' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#1877F2] ring-2 ring-white dark:ring-zinc-950 animate-pulse" />
              )}
            </div>
            <span>Chat</span>
            {totalUnreadCount > 0 && (
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold leading-none ${
                activePanel === 'chat'
                  ? 'bg-white/20 text-white'
                  : 'bg-[#1877F2] text-white'
              }`}>
                {totalUnreadCount}
              </span>
            )}
          </button>

          {/* PROFILE BUTTON */}
          <button
            id="dock-btn-profile"
            type="button"
            onClick={() => togglePanel('profile')}
            className={`flex-1 sm:flex-initial min-w-[96px] sm:min-w-[108px] h-9 flex items-center justify-center gap-2 px-4 rounded-xl text-xs font-semibold transition-all select-none ${
              activePanel === 'profile'
                ? 'bg-[#1877F2] text-white shadow-sm'
                : isBright
                ? 'bg-transparent text-slate-700 hover:text-slate-950 hover:bg-slate-100/70'
                : 'bg-transparent text-zinc-300 hover:text-white hover:bg-zinc-900/70'
            }`}
            aria-label="Toggle coach profile"
            title="Coach Profile & Quick Settings"
          >
            <div className="relative flex items-center justify-center">
              {CURRENT_COACH.avatarUrl ? (
                <img
                  src={CURRENT_COACH.avatarUrl}
                  alt={CURRENT_COACH.name}
                  className="w-3.5 h-3.5 rounded-full object-cover"
                />
              ) : (
                <User className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 border border-white dark:border-zinc-900" />
            </div>
            <span>Profile</span>
          </button>
        </div>
      </div>
    </>
  );
};
