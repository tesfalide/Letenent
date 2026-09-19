// components/trainee/TraineePortalView.tsx
import React, { useState, useRef } from 'react';
import {
  Home,
  Dumbbell,
  User,
  Shield,
  Search,
  Bell,
  ThumbsUp,
  MessageCircle,
  Share2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Globe,
  Plus,
  X,
  Flame,
  Award,
  TrendingUp,
  CheckCircle2,
  Clock,
  Send,
  RotateCcw,
  Sun,
  Moon,
  LogOut,
  Calendar,
  Sparkles,
  ClipboardList,
  Camera,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import { TraineeProfile } from '@/types';
import { CURRENT_COACH } from '@/lib/mock-data';
import { useTheme } from '@/src/context/ThemeContext';
import { InstagramFeedView } from './InstagramFeedView';
import { WorkoutHubView } from './WorkoutHubView';

interface TraineePortalViewProps {
  trainee: TraineeProfile;
  onSignOut: () => void;
  onSwitchToCoach?: () => void;
}

type NavTab = 'home' | 'workout' | 'coach' | 'profile';

interface SetLogState {
  setNumber: number;
  weight: number;
  reps: number;
  rpe: number;
  completed: boolean;
}

interface ExerciseState {
  id: string;
  name: string;
  muscle: string;
  sets: SetLogState[];
}

export const TraineePortalView: React.FC<TraineePortalViewProps> = ({
  trainee,
  onSignOut,
  onSwitchToCoach,
}) => {
  const { isBright, toggleTheme } = useTheme();

  // Navigation tab state: 'home' | 'workout' | 'coach' | 'profile'
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Home feed state
  const [feedMode, setFeedMode] = useState<'following' | 'discover'>('following');
  const [feedDropdownOpen, setFeedDropdownOpen] = useState(false);
  const [hasLikedPost, setHasLikedPost] = useState(false);
  const [likeCount, setLikeCount] = useState(599);
  const [showAllExercises, setShowAllExercises] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(true);
  const [postComments, setPostComments] = useState<
    { id: string; user: string; avatar: string; time: string; text: string; likes: number }[]
  >([
    {
      id: 'c1',
      user: 'gustavo',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
      time: '5d',
      text: 'Vamoooos 💪🔥👏',
      likes: 10,
    },
    {
      id: 'c2',
      user: 'melhay333',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
      time: '5d',
      text: '¡Órale!',
      likes: 9,
    },
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  // Tennis Match / Photo Post (Exact match from the user screenshot)
  const [hasLikedTennisPost, setHasLikedTennisPost] = useState(false);
  const [tennisLikeCount, setTennisLikeCount] = useState(559);
  const [tennisCommentsOpen, setTennisCommentsOpen] = useState(true);
  const [newTennisComment, setNewTennisComment] = useState('');
  const [tennisComments, setTennisComments] = useState<
    { id: string; user: string; avatar: string; time: string; text: string; likes: number }[]
  >([
    {
      id: 'tc_1',
      user: 'ankasunflower',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80',
      time: '2w',
      text: 'I play, but terrible\nI played pickleball better :)',
      likes: 10,
    },
    {
      id: 'tc_2',
      user: 'chuckmacgrave',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
      time: '2w',
      text: 'Yeah I play 🔥',
      likes: 3,
    },
  ]);

  // Create photo/workout post modal state
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [postCaption, setPostCaption] = useState('');
  const [postSportOrType, setPostSportOrType] = useState('Tennis / Match');
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [selectedPresetPhoto, setSelectedPresetPhoto] = useState(0);
  const [localPhotoFileName, setLocalPhotoFileName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeviceFileUpload = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please choose an image file (PNG, JPG, JPEG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setCustomPhotoUrl(result);
        setLocalPhotoFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const presetPostPhotos = [
    {
      label: 'Tennis Clay Court Match',
      url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1080&auto=format&fit=crop&q=80',
    },
    {
      label: 'Gym Squat Rack Session',
      url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1080&auto=format&fit=crop&q=80',
    },
    {
      label: 'Outdoor Conditioning Run',
      url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1080&auto=format&fit=crop&q=80',
    },
    {
      label: 'Strength & Powerlifting Platform',
      url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1080&auto=format&fit=crop&q=80',
    },
  ];

  // Extra user-generated photo posts list
  const [userCreatedPosts, setUserCreatedPosts] = useState<
    {
      id: string;
      authorName: string;
      handle: string;
      avatar: string;
      location: string;
      imageUrl: string;
      caption: string;
      timeAgo: string;
      likes: number;
      hasLiked: boolean;
      scoreOverlay?: {
        p1Name: string;
        p1Score: string;
        p2Name: string;
        p2Score: string;
        badge?: string;
      };
      comments: { id: string; user: string; avatar: string; time: string; text: string; likes: number }[];
    }[]
  >([]);

  const handleAddTennisComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTennisComment.trim()) return;
    const newC = {
      id: `tc_${Date.now()}`,
      user: trainee.user.name.toLowerCase().replace(/\s+/g, '_'),
      avatar: trainee.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80',
      time: 'Just now',
      text: newTennisComment.trim(),
      likes: 0,
    };
    setTennisComments((prev) => [...prev, newC]);
    setNewTennisComment('');
  };

  const handlePublishNewPhotoPost = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = customPhotoUrl.trim() || presetPostPhotos[selectedPresetPhoto].url;
    const newPostItem = {
      id: `up_${Date.now()}`,
      authorName: trainee.user.name,
      handle: trainee.user.name.toLowerCase().replace(/\s+/g, '_'),
      avatar: trainee.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      location: postSportOrType,
      imageUrl: finalUrl,
      caption: postCaption.trim() || 'Great match today! Training pays off 🎾🔥',
      timeAgo: 'Just now',
      likes: 1,
      hasLiked: true,
      comments: [],
    };
    setUserCreatedPosts((prev) => [newPostItem, ...prev]);
    setPostCaption('');
    setCustomPhotoUrl('');
    setLocalPhotoFileName('');
    setCreatePostOpen(false);
  };
  const athleteSliderRef = useRef<HTMLDivElement>(null);

  const slideAthletes = (direction: 'left' | 'right') => {
    if (athleteSliderRef.current) {
      const scrollAmount = 210;
      athleteSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const [suggestedAthletes, setSuggestedAthletes] = useState([
    {
      id: 's1',
      name: 'Marcus Chen',
      handle: '@mchen_lift',
      focus: 'Powerlifting',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      followed: false,
    },
    {
      id: 's2',
      name: 'Olivia Vance',
      handle: '@olivia_fit',
      focus: 'CrossFit & Conditioning',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      followed: false,
    },
    {
      id: 's3',
      name: 'Wilson K.',
      handle: '@wilson_athletics',
      focus: 'Olympic Weightlifting',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
      followed: false,
    },
    {
      id: 's4',
      name: 'Sophia Alva',
      handle: '@sophia_lifts',
      focus: 'Hypertrophy & Prep',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      followed: false,
    },
    {
      id: 's5',
      name: 'Devonte Brooks',
      handle: '@devonte_power',
      focus: 'Track & Strength',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      followed: false,
    },
    {
      id: 's6',
      name: 'Elena Rostova',
      handle: '@elena_kettlebell',
      focus: 'Kettlebell & Mobility',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      followed: false,
    },
  ]);

  // Exercise tracking state for Workout tab
  const [exercises, setExercises] = useState<ExerciseState[]>([
    {
      id: 'ex_1',
      name: 'Incline Dumbbell Bench Press',
      muscle: 'Upper Chest & Front Delts',
      sets: [
        { setNumber: 1, weight: 65, reps: 10, rpe: 8, completed: true },
        { setNumber: 2, weight: 70, reps: 8, rpe: 8.5, completed: true },
        { setNumber: 3, weight: 70, reps: 8, rpe: 9, completed: false },
      ],
    },
    {
      id: 'ex_2',
      name: 'Barbell Overhead Press',
      muscle: 'Shoulders & Triceps',
      sets: [
        { setNumber: 1, weight: 115, reps: 8, rpe: 7.5, completed: true },
        { setNumber: 2, weight: 125, reps: 6, rpe: 8.5, completed: false },
        { setNumber: 3, weight: 125, reps: 6, rpe: 9, completed: false },
      ],
    },
    {
      id: 'ex_3',
      name: 'Cable Lateral Raise',
      muscle: 'Lateral Deltoids',
      sets: [
        { setNumber: 1, weight: 25, reps: 12, rpe: 8, completed: false },
        { setNumber: 2, weight: 25, reps: 12, rpe: 8.5, completed: false },
        { setNumber: 3, weight: 25, reps: 12, rpe: 9, completed: false },
      ],
    },
    {
      id: 'ex_4',
      name: 'Neutral Grip Lat Pulldown',
      muscle: 'Lats & Upper Back',
      sets: [
        { setNumber: 1, weight: 140, reps: 10, rpe: 8, completed: false },
        { setNumber: 2, weight: 140, reps: 10, rpe: 8.5, completed: false },
        { setNumber: 3, weight: 150, reps: 8, rpe: 9, completed: false },
      ],
    },
  ]);
  const [workoutFinished, setWorkoutFinished] = useState(false);

  // Coach tab sub-view: 'chat' | 'checkin'
  const [coachSubTab, setCoachSubTab] = useState<'chat' | 'checkin'>('chat');
  const [chatMessages, setChatMessages] = useState<
    { sender: 'coach' | 'trainee'; text: string; time: string }[]
  >([
    {
      sender: 'coach',
      text: `Hey ${trainee.user.name}, your volume progression on the squat and bench blocks is looking crisp. Keep up the clean tempo!`,
      time: '10:15 AM',
    },
    {
      sender: 'trainee',
      text: 'Thanks Coach Roger! The deload week helped tremendously with shoulder fatigue. Ready to log today.',
      time: '10:22 AM',
    },
    {
      sender: 'coach',
      text: 'Awesome. Maintain 2-second eccentrics on overhead presses. Let me know when your check-in is ready!',
      time: '10:28 AM',
    },
  ]);
  const [newMessageText, setNewMessageText] = useState('');

  // Check-In Form State
  const [checkInWeight, setCheckInWeight] = useState('164.5');
  const [energyScore, setEnergyScore] = useState(8);
  const [sleepScore, setSleepScore] = useState(8);
  const [dietAdherence, setDietAdherence] = useState(9);
  const [winsText, setWinsText] = useState('Hit PR on Incline DB Press (+5 lbs). Maintained 8 hours of sleep.');
  const [strugglesText, setStrugglesText] = useState('Mild quad soreness after high-volume leg day.');
  const [checkInSubmitted, setCheckInSubmitted] = useState(false);

  // Actions
  const toggleLikePost = () => {
    if (hasLikedPost) {
      setHasLikedPost(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setHasLikedPost(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newComment = {
      id: `c_${Date.now()}`,
      user: trainee.user.name.toLowerCase().replace(/\s+/g, '_'),
      avatar: trainee.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80',
      time: 'Just now',
      text: newCommentText.trim(),
      likes: 0,
    };
    setPostComments((prev) => [...prev, newComment]);
    setNewCommentText('');
  };

  const toggleSetCompleted = (exerciseId: string, setIdx: number) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const newSets = [...ex.sets];
        newSets[setIdx] = {
          ...newSets[setIdx],
          completed: !newSets[setIdx].completed,
        };
        return { ...ex, sets: newSets };
      })
    );
  };

  const updateSetMetric = (exerciseId: string, setIdx: number, field: 'weight' | 'reps', val: number) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const newSets = [...ex.sets];
        newSets[setIdx] = {
          ...newSets[setIdx],
          [field]: val,
        };
        return { ...ex, sets: newSets };
      })
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const msg = {
      sender: 'trainee' as const,
      text: newMessageText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, msg]);
    setNewMessageText('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'coach',
          text: 'Got your update! I am tracking your session logs live on the coach board.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  const completedSetsCount = exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const totalSetsCount = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const workoutProgressPercent = Math.round((completedSetsCount / totalSetsCount) * 100);

  return (
    <div
      className={`min-h-screen transition-colors duration-200 flex flex-col selection:bg-[#1877F2] selection:text-white ${
        isBright ? 'bg-slate-50 text-slate-900' : 'bg-black text-white'
      }`}
    >
      {/* ==================== TOP APP BAR ==================== */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-xl px-4 sm:px-8 py-3 flex items-center justify-between transition-colors ${
          isBright ? 'bg-white/95 border-slate-200 shadow-sm' : 'bg-black/95 border-zinc-900'
        }`}
      >
        {/* Left Side: Dynamic Screen Title / Brand with Dropdown (Inspired by screenshot) */}
        <div className="flex items-center gap-3 relative">
          <div className="w-8 h-8 rounded-xl bg-[#1877F2] flex items-center justify-center text-white font-black text-sm shadow-sm shadow-blue-500/20">
            <Dumbbell className="w-4 h-4 -rotate-45" />
          </div>

          {activeTab === 'home' ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setFeedDropdownOpen(!feedDropdownOpen)}
                className="flex items-center gap-1.5 font-black text-xl tracking-tight hover:opacity-80 transition-opacity"
              >
                <span>{feedMode === 'following' ? 'Home' : 'Discover'}</span>
                <ChevronDown className="w-4 h-4 text-zinc-400 mt-0.5" />
              </button>

              {feedDropdownOpen && (
                <div
                  className={`absolute left-0 top-full mt-2 w-56 rounded-2xl border shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 ${
                    isBright ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-900 border-zinc-800 text-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setFeedMode('following');
                      setFeedDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      feedMode === 'following'
                        ? isBright
                          ? 'bg-blue-50 text-[#1877F2]'
                          : 'bg-zinc-800 text-white'
                        : isBright
                        ? 'hover:bg-slate-100 text-slate-700'
                        : 'hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Home className="w-4 h-4" />
                      <span>Home (Following)</span>
                    </div>
                    {feedMode === 'following' && <Check className="w-4 h-4 text-[#1877F2]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFeedMode('discover');
                      setFeedDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      feedMode === 'discover'
                        ? isBright
                          ? 'bg-blue-50 text-[#1877F2]'
                          : 'bg-zinc-800 text-white'
                        : isBright
                        ? 'hover:bg-slate-100 text-slate-700'
                        : 'hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4" />
                      <span>Discover</span>
                    </div>
                    {feedMode === 'discover' && <Check className="w-4 h-4 text-[#1877F2]" />}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h1 className="font-black text-xl tracking-tight capitalize">
                {activeTab === 'workout' ? 'Workout' : activeTab === 'coach' ? 'Coach' : 'Profile'}
              </h1>
            </div>
          )}
        </div>

        {/* Right Side: Search, Notifications, Theme toggle, Switch to Coach & Sign Out */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Button (inspired by screenshot top-right) */}
          <button
            type="button"
            className={`p-2 rounded-xl transition-colors ${
              isBright ? 'text-slate-600 hover:bg-slate-100' : 'text-zinc-300 hover:bg-zinc-900'
            }`}
            title="Search exercises or athletes"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications Bell (inspired by screenshot top-right) */}
          <button
            type="button"
            className={`p-2 rounded-xl relative transition-colors ${
              isBright ? 'text-slate-600 hover:bg-slate-100' : 'text-zinc-300 hover:bg-zinc-900'
            }`}
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-[#1877F2] absolute top-1.5 right-1.5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle theme"
            className={`p-2 rounded-xl border transition-colors ${
              isBright
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            {isBright ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-blue-400" />}
          </button>

          {/* Quick Coach View Switch */}
          {onSwitchToCoach && (
            <button
              onClick={onSwitchToCoach}
              type="button"
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isBright
                  ? 'bg-blue-50 border-blue-200 text-[#1877F2] hover:bg-blue-100'
                  : 'bg-[#1877F2]/10 border-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2]/20'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Coach View</span>
            </button>
          )}

          {/* Sign Out */}
          <button
            onClick={onSignOut}
            type="button"
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 pb-28 space-y-6">
        {/* ==================== TAB 1: HOME (FIRST INSPIRATION FEED) ==================== */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Quick Share / Post Composer Bar */}
            <div
              className={`p-3 sm:p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950 border-zinc-900 shadow-lg'
              }`}
            >
              <img
                src={trainee.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                alt={trainee.user.name}
                className="w-9 h-9 rounded-full object-cover border border-[#1877F2]/60 shrink-0"
              />
              <button
                type="button"
                onClick={() => setCreatePostOpen(true)}
                className={`flex-1 text-left px-3.5 py-2 rounded-xl border text-xs font-medium transition-colors ${
                  isBright
                    ? 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    : 'bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:bg-zinc-850 hover:text-white'
                }`}
              >
                Post a photo, match result, or workout...
              </button>
              <button
                type="button"
                onClick={() => setCreatePostOpen(true)}
                className="px-3 py-2 rounded-xl bg-[#1877F2] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 hover:bg-blue-600 transition-colors shrink-0"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Post Photo</span>
              </button>
            </div>

            {/* Workout Post Card */}
            <article
              className={`rounded-2xl border transition-all overflow-hidden ${
                isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950 border-zinc-900 shadow-xl'
              }`}
            >
              {/* Post Header */}
              <div className="p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                    alt="alexandul"
                    className="w-10 h-10 rounded-full object-cover border border-[#1877F2]"
                  />
                  <div>
                    <h3 className="font-bold text-sm leading-tight flex items-center gap-2">
                      <span>alexandul</span>
                      <span className={`text-xs font-normal ${isBright ? 'text-slate-400' : 'text-zinc-500'}`}>
                        • 19:29
                      </span>
                    </h3>
                    <p className={`text-xs ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                      Centre Gym
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className={`p-1.5 rounded-lg ${isBright ? 'text-slate-400 hover:bg-slate-100' : 'text-zinc-500 hover:bg-zinc-900'}`}
                >
                  <span className="font-mono text-lg font-bold leading-none">•••</span>
                </button>
              </div>

              {/* Workout Stats: Time & Volume (Exact match from screenshot) */}
              <div className="px-5 pb-3 flex items-center gap-8 text-xs">
                <div>
                  <span className={`block text-[11px] font-medium ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                    Time
                  </span>
                  <span className="font-bold text-sm tracking-tight">1h 14min</span>
                </div>
                <div>
                  <span className={`block text-[11px] font-medium ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                    Volume
                  </span>
                  <span className="font-bold text-sm tracking-tight font-mono">12,114.4 lbs</span>
                </div>
              </div>

              <div className={`mx-5 border-t ${isBright ? 'border-slate-100' : 'border-zinc-900'}`} />

              {/* Exercise Breakdown with Green Accent Bars & Anatomical Thumbnails */}
              <div className="p-5 space-y-4">
                {/* Exercise 1: Squat */}
                <div className="flex items-center gap-3.5 group">
                  <div className="w-1 h-10 bg-emerald-500 rounded-full shrink-0" />
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shrink-0 shadow-sm border border-zinc-200">
                    {/* SVG Squat representation */}
                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-zinc-900" fill="currentColor">
                      <circle cx="12" cy="4" r="2" />
                      <rect x="5" y="6" width="14" height="2" rx="1" fill="#1877F2" />
                      <path d="M9 8h6l-1 5-2 1-2-1z" />
                      <path d="M8 14l2 6h2l-1-6" />
                      <path d="M16 14l-2 6h-2l1-6" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      4 sets Squat (Barbell)
                    </p>
                  </div>
                </div>

                {/* Exercise 2: Lunge */}
                <div className="flex items-center gap-3.5 group">
                  <div className="w-1 h-10 bg-emerald-500 rounded-full shrink-0" />
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shrink-0 shadow-sm border border-zinc-200">
                    {/* SVG Lunge representation */}
                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-zinc-900" fill="currentColor">
                      <circle cx="13" cy="4" r="2" />
                      <rect x="6" y="6" width="14" height="2" rx="1" fill="#1877F2" />
                      <path d="M11 8h4l-2 5-2 1z" />
                      <path d="M9 14l-3 4v2h3l3-4" />
                      <path d="M14 14l3 5h3v-2l-3-4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      4 sets Lunge (Barbell)
                    </p>
                  </div>
                </div>

                {/* Exercise 3: Iso-Lateral Chest Press */}
                <div className="flex items-center gap-3.5 group">
                  <div className="w-1 h-10 bg-transparent rounded-full shrink-0" />
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shrink-0 shadow-sm border border-zinc-200">
                    {/* SVG Machine Chest Press */}
                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-zinc-900" fill="currentColor">
                      <circle cx="12" cy="5" r="2" />
                      <path d="M7 10h10v2H7z" fill="#1877F2" />
                      <path d="M10 7h4v6h-4z" />
                      <path d="M8 15h8v4H8z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      3 sets Iso-Lateral Chest Press (Machine)
                    </p>
                  </div>
                </div>

                {/* Expandable Extra Exercises */}
                {showAllExercises && (
                  <div className="space-y-4 pt-1 animate-in fade-in duration-150">
                    <div className="flex items-center gap-3.5">
                      <div className="w-1 h-10 bg-transparent rounded-full shrink-0" />
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shrink-0 shadow-sm border border-zinc-200">
                        <Dumbbell className="w-5 h-5 text-zinc-900" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          3 sets Romanian Deadlift (Dumbbell)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="w-1 h-10 bg-transparent rounded-full shrink-0" />
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shrink-0 shadow-sm border border-zinc-200">
                        <Dumbbell className="w-5 h-5 text-zinc-900" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          4 sets Standing Calf Raise
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="w-1 h-10 bg-transparent rounded-full shrink-0" />
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center p-1 shrink-0 shadow-sm border border-zinc-200">
                        <Dumbbell className="w-5 h-5 text-zinc-900" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          3 sets Hanging Leg Raise
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* "See more exercises" button */}
                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={() => setShowAllExercises(!showAllExercises)}
                    className={`text-xs font-semibold transition-colors ${
                      isBright ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {showAllExercises ? 'Hide extra exercises' : 'See 4 more exercises'}
                  </button>
                </div>
              </div>

              {/* Social Action Bar (Like, Comment, Share) */}
              <div className={`px-5 py-3 border-t flex items-center gap-6 ${isBright ? 'border-slate-100' : 'border-zinc-900'}`}>
                <button
                  type="button"
                  onClick={toggleLikePost}
                  className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                    hasLikedPost ? 'text-[#1877F2]' : isBright ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${hasLikedPost ? 'fill-[#1877F2]' : ''}`} />
                  <span>{likeCount}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCommentsOpen(!commentsOpen)}
                  className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                    isBright ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{postComments.length + 11}</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Workout link copied to clipboard!')}
                  className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                    isBright ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* "Liked by alexandul and others" */}
              <div className="px-5 pb-3 flex items-center gap-2 text-xs">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60"
                    alt="user1"
                    className="inline-block w-4 h-4 rounded-full ring-2 ring-zinc-950 object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60"
                    alt="user2"
                    className="inline-block w-4 h-4 rounded-full ring-2 ring-zinc-950 object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60"
                    alt="user3"
                    className="inline-block w-4 h-4 rounded-full ring-2 ring-zinc-950 object-cover"
                  />
                </div>
                <p className={`text-[11px] ${isBright ? 'text-slate-600' : 'text-zinc-400'}`}>
                  Liked by <strong className={isBright ? 'text-slate-900' : 'text-white'}>alexandul</strong> and others
                </p>
              </div>

              {/* Comments Feed */}
              {commentsOpen && (
                <div className={`px-5 pb-5 pt-2 border-t space-y-3 ${isBright ? 'border-slate-100' : 'border-zinc-900'}`}>
                  {postComments.map((c) => (
                    <div key={c.id} className="flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <img
                          src={c.avatar}
                          alt={c.user}
                          className="w-7 h-7 rounded-full object-cover mt-0.5"
                        />
                        <div>
                          <p className="font-semibold leading-tight">
                            <span>{c.user}</span>{' '}
                            <span className={`text-[10px] font-normal ${isBright ? 'text-slate-400' : 'text-zinc-500'}`}>
                              {c.time}
                            </span>
                          </p>
                          <p className={`mt-0.5 ${isBright ? 'text-slate-700' : 'text-zinc-300'}`}>
                            {c.text}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                        <ThumbsUp className="w-3 h-3 cursor-pointer hover:text-[#1877F2]" />
                        <span>{c.likes}</span>
                      </div>
                    </div>
                  ))}

                  {/* Add comment input */}
                  <form onSubmit={handleAddComment} className="flex items-center gap-2.5 pt-2">
                    <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {trainee.user.name.slice(0, 1)}
                    </div>
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className={`flex-1 text-xs px-3.5 py-2 rounded-xl border focus:outline-none transition-colors ${
                        isBright
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#1877F2]'
                          : 'bg-zinc-900 border-zinc-800 text-white focus:border-[#1877F2]'
                      }`}
                    />
                    {newCommentText.trim() && (
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-xl bg-[#1877F2] text-white text-xs font-semibold"
                      >
                        Post
                      </button>
                    )}
                  </form>
                </div>
              )}
            </article>

            {/* Suggested Athletes Section - Side Slide Mode */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                    Suggested Athletes
                  </h3>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    isBright ? 'bg-slate-100 text-slate-600' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}>
                    {suggestedAthletes.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Side Slide Navigation Arrows */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => slideAthletes('left')}
                      className={`p-1.5 rounded-xl border transition-all ${
                        isBright
                          ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 active:scale-95'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-850 active:scale-95'
                      }`}
                      title="Slide left"
                      aria-label="Slide left"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => slideAthletes('right')}
                      className={`p-1.5 rounded-xl border transition-all ${
                        isBright
                          ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 active:scale-95'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-850 active:scale-95'
                      }`}
                      title="Slide right"
                      aria-label="Slide right"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert('Invite link copied: https://letenent.io/join/athlete')}
                    className="text-xs font-semibold text-[#1877F2] hover:underline flex items-center gap-1 pl-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span className="hidden xs:inline">Invite a friend</span>
                  </button>
                </div>
              </div>

              {/* Horizontal Side Slide Container */}
              <div
                ref={athleteSliderRef}
                className="flex items-stretch gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory py-1 px-0.5 scroll-smooth -mx-1 sm:mx-0"
              >
                {suggestedAthletes.map((athlete) => (
                  <div
                    key={athlete.id}
                    className={`min-w-[155px] w-[155px] sm:min-w-[175px] sm:w-[175px] shrink-0 snap-start p-4 rounded-2xl border flex flex-col justify-between relative transition-all duration-200 hover:scale-[1.01] ${
                      isBright
                        ? 'bg-white border-slate-200 shadow-sm hover:shadow'
                        : 'bg-zinc-950 border-zinc-900 hover:border-zinc-800'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSuggestedAthletes((prev) => prev.filter((a) => a.id !== athlete.id))}
                      className="absolute top-2.5 right-2.5 text-zinc-500 hover:text-zinc-300 p-1 rounded-lg transition-colors"
                      title="Dismiss"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex flex-col items-center text-center">
                      <img
                        src={athlete.avatar}
                        alt={athlete.name}
                        className="w-12 h-12 rounded-full object-cover mb-2 ring-2 ring-zinc-800/40"
                      />
                      <h4 className="text-xs font-bold leading-tight truncate w-full">{athlete.name}</h4>
                      <p className={`text-[10px] truncate w-full ${isBright ? 'text-slate-400' : 'text-zinc-500'}`}>
                        {athlete.handle}
                      </p>
                      <p className="text-[11px] text-[#1877F2] font-semibold mt-1 truncate w-full">
                        {athlete.focus}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSuggestedAthletes((prev) =>
                          prev.map((a) => (a.id === athlete.id ? { ...a, followed: !a.followed } : a))
                        );
                      }}
                      className={`w-full mt-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        athlete.followed
                          ? isBright
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-zinc-800 text-zinc-300'
                          : 'bg-[#1877F2] text-white hover:bg-blue-600 shadow-sm shadow-blue-600/20'
                      }`}
                    >
                      {athlete.followed ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Side slide hint & counter */}
              <div className="flex items-center justify-between text-[11px] px-1 text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2]" />
                  <span>Swipe sideways or use arrows to slide</span>
                </span>
                <span className="font-mono text-[10px]">
                  {suggestedAthletes.filter((a) => a.followed).length} followed
                </span>
              </div>
            </div>

            {/* ==================== USER-CREATED PHOTO POSTS ==================== */}
            {userCreatedPosts.map((up) => (
              <article
                key={up.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950 border-zinc-900 shadow-xl'
                }`}
              >
                {/* Author Header */}
                <div className="p-3.5 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={up.avatar}
                      alt={up.authorName}
                      className="w-9 h-9 rounded-full object-cover border border-[#1877F2]"
                    />
                    <div>
                      <h4 className="font-bold text-xs leading-tight flex items-center gap-1.5">
                        <span>{up.handle}</span>
                        <span className={`text-[11px] font-normal ${isBright ? 'text-slate-400' : 'text-zinc-500'}`}>
                          • {up.timeAgo}
                        </span>
                      </h4>
                      <p className={`text-[11px] ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                        {up.location}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`p-1.5 rounded-lg ${
                      isBright ? 'text-slate-400 hover:bg-slate-100' : 'text-zinc-500 hover:bg-zinc-900'
                    }`}
                  >
                    <span className="font-mono text-base font-bold leading-none">•••</span>
                  </button>
                </div>

                {/* Photo Image */}
                <div className="relative w-full aspect-[4/3] bg-zinc-900 overflow-hidden">
                  <img src={up.imageUrl} alt="Uploaded post" className="w-full h-full object-cover" />
                </div>

                {/* Action Bar */}
                <div className={`px-4 py-3 border-t flex items-center gap-6 ${isBright ? 'border-slate-100' : 'border-zinc-900'}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setUserCreatedPosts((prev) =>
                        prev.map((p) =>
                          p.id === up.id
                            ? {
                                ...p,
                                hasLiked: !p.hasLiked,
                                likes: p.hasLiked ? p.likes - 1 : p.likes + 1,
                              }
                            : p
                        )
                      );
                    }}
                    className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                      up.hasLiked ? 'text-[#1877F2]' : isBright ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${up.hasLiked ? 'fill-[#1877F2]' : ''}`} />
                    <span>{up.likes}</span>
                  </button>

                  <div className={`flex items-center gap-2 text-xs font-semibold ${isBright ? 'text-slate-600' : 'text-zinc-400'}`}>
                    <MessageCircle className="w-4 h-4" />
                    <span>{up.comments.length}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert('Post link copied to clipboard!')}
                    className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                      isBright ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Caption */}
                <div className="px-4 pb-4 text-xs">
                  <p>
                    <span className="font-bold mr-1.5">{up.handle}</span>
                    <span className={isBright ? 'text-slate-700' : 'text-zinc-300'}>{up.caption}</span>
                  </p>
                </div>
              </article>
            ))}

            {/* ==================== PHOTO POST (TENNIS MATCH WITH SCORECARD OVERLAY - EXACT REFERENCE) ==================== */}
            <article
              className={`rounded-2xl border transition-all overflow-hidden ${
                isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950 border-zinc-900 shadow-xl'
              }`}
            >
              {/* Post Header (guillemros) */}
              <div className="p-3.5 sm:p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                    alt="guillemros"
                    className="w-9 h-9 rounded-full object-cover border border-[#1877F2]"
                  />
                  <div>
                    <h4 className="font-bold text-xs leading-tight flex items-center gap-1.5">
                      <span>guillemros</span>
                      <span className={`text-[11px] font-normal ${isBright ? 'text-slate-400' : 'text-zinc-500'}`}>
                        • 2w ago
                      </span>
                    </h4>
                    <p className={`text-[11px] ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                      Barcelona Tennis Club • Match Play
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className={`p-1.5 rounded-lg ${
                    isBright ? 'text-slate-400 hover:bg-slate-100' : 'text-zinc-500 hover:bg-zinc-900'
                  }`}
                >
                  <span className="font-mono text-base font-bold leading-none">•••</span>
                </button>
              </div>

              {/* Tennis Match Picture with Overlaid Scorecard & Slice Branding (Exact replica of photo from reference) */}
              <div
                className="relative w-full aspect-[4/3] bg-zinc-900 overflow-hidden cursor-pointer select-none group"
                onDoubleClick={() => {
                  if (hasLikedTennisPost) {
                    setHasLikedTennisPost(false);
                    setTennisLikeCount((c) => c - 1);
                  } else {
                    setHasLikedTennisPost(true);
                    setTennisLikeCount((c) => c + 1);
                  }
                }}
              >
                {/* Clay Court Tennis Match Action Photo */}
                <img
                  src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&auto=format&fit=crop&q=80"
                  alt="Tennis match on clay court"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Scorecard Widget Overlay in Bottom-Left (Proportional & cleanly inset within picture borders) */}
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 max-w-[calc(100%-6.5rem)] bg-white/95 text-zinc-900 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-2xl backdrop-blur-md min-w-[175px] sm:min-w-[210px] border border-white/60 animate-in fade-in">
                  {/* Player 1: Jaume Ros */}
                  <div className="flex items-center justify-between gap-2.5 sm:gap-3 py-0.5 sm:py-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80"
                        alt="Jaume Ros"
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-zinc-300 shrink-0"
                      />
                      <span className="text-[11px] sm:text-xs font-bold text-zinc-900 tracking-tight truncate">Jaume Ros</span>
                      <span title="Winner" className="text-amber-500 text-[11px] sm:text-xs shrink-0">🏆</span>
                    </div>
                    <div className="flex items-center gap-2.5 sm:gap-3 font-bold font-mono text-xs sm:text-sm tracking-wide text-zinc-900 shrink-0">
                      <span>6</span>
                      <span>6</span>
                    </div>
                  </div>

                  {/* Player 2: Guillem Ros */}
                  <div className="flex items-center justify-between gap-2.5 sm:gap-3 py-0.5 sm:py-1 border-t border-zinc-100">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80"
                        alt="Guillem Ros"
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-zinc-300 shrink-0"
                      />
                      <span className="text-[11px] sm:text-xs font-medium text-zinc-700 tracking-tight truncate">Guillem Ros</span>
                    </div>
                    <div className="flex items-center gap-2.5 sm:gap-3 font-bold font-mono text-xs sm:text-sm tracking-wide text-zinc-500 shrink-0">
                      <span>2</span>
                      <span>0</span>
                    </div>
                  </div>
                </div>

                {/* Slice Watermark Logo in Bottom-Right (from screenshot) */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-1 sm:gap-1.5 text-white drop-shadow-md">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-amber-400 rotate-12 flex items-center justify-center shadow-md shrink-0">
                    <span className="w-2.5 sm:w-3 h-1 bg-white rounded-full block -rotate-45" />
                  </div>
                  <span className="font-black text-base sm:text-lg tracking-tight font-sans text-white drop-shadow-lg">
                    Slice
                  </span>
                </div>

                {/* Carousel Dots */}
                <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                </div>
              </div>

              {/* Social Action Bar (Like 559, Comment 38, Share) - Exact Screenshot Replica */}
              <div className={`px-4 py-3 border-t flex items-center gap-6 ${isBright ? 'border-slate-100' : 'border-zinc-900'}`}>
                {/* ThumbsUp / Like Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (hasLikedTennisPost) {
                      setHasLikedTennisPost(false);
                      setTennisLikeCount((c) => c - 1);
                    } else {
                      setHasLikedTennisPost(true);
                      setTennisLikeCount((c) => c + 1);
                    }
                  }}
                  className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                    hasLikedTennisPost ? 'text-[#1877F2]' : isBright ? 'text-slate-700 hover:text-slate-900' : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${hasLikedTennisPost ? 'fill-[#1877F2]' : ''}`} />
                  <span>{tennisLikeCount}</span>
                </button>

                {/* Comments Toggle */}
                <button
                  type="button"
                  onClick={() => setTennisCommentsOpen(!tennisCommentsOpen)}
                  className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                    isBright ? 'text-slate-700 hover:text-slate-900' : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{tennisComments.length + 36}</span>
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={() => alert('Match photo link copied to clipboard!')}
                  className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                    isBright ? 'text-slate-700 hover:text-slate-900' : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* "Liked by fedemarino and others" (Exact from screenshot) */}
              <div className="px-4 pb-3 flex items-center gap-2 text-xs">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60"
                    alt="user1"
                    className="inline-block w-4 h-4 rounded-full ring-2 ring-zinc-950 object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60"
                    alt="user2"
                    className="inline-block w-4 h-4 rounded-full ring-2 ring-zinc-950 object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=60"
                    alt="user3"
                    className="inline-block w-4 h-4 rounded-full ring-2 ring-zinc-950 object-cover"
                  />
                </div>
                <p className={`text-[11px] ${isBright ? 'text-slate-600' : 'text-zinc-400'}`}>
                  Liked by <strong className={isBright ? 'text-slate-900' : 'text-white'}>fedemarino</strong> and others
                </p>
              </div>

              {/* Comments Section (Includes ankasunflower and chuckmacgrave from screenshot) */}
              {tennisCommentsOpen && (
                <div className={`px-4 pb-4 pt-2 border-t space-y-3.5 ${isBright ? 'border-slate-100' : 'border-zinc-900'}`}>
                  {tennisComments.map((tc) => (
                    <div key={tc.id} className="flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <img
                          src={tc.avatar}
                          alt={tc.user}
                          className="w-7 h-7 rounded-full object-cover mt-0.5 ring-1 ring-zinc-800"
                        />
                        <div>
                          <p className="font-semibold leading-tight">
                            <span>{tc.user}</span>{' '}
                            <span className={`text-[10px] font-normal ${isBright ? 'text-slate-400' : 'text-zinc-500'}`}>
                              {tc.time}
                            </span>
                          </p>
                          <p className={`mt-0.5 whitespace-pre-line ${isBright ? 'text-slate-700' : 'text-zinc-300'}`}>
                            {tc.text}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-zinc-500 shrink-0">
                        <ThumbsUp className="w-3 h-3 cursor-pointer hover:text-[#1877F2]" />
                        <span>{tc.likes}</span>
                      </div>
                    </div>
                  ))}

                  {/* Add a comment input */}
                  <form onSubmit={handleAddTennisComment} className="flex items-center gap-2.5 pt-2">
                    <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300 shrink-0">
                      {trainee.user.name.slice(0, 1)}
                    </div>
                    <input
                      type="text"
                      value={newTennisComment}
                      onChange={(e) => setNewTennisComment(e.target.value)}
                      placeholder="Add a comment..."
                      className={`flex-1 text-xs px-3.5 py-2 rounded-xl border focus:outline-none transition-colors ${
                        isBright
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#1877F2]'
                          : 'bg-zinc-900 border-zinc-800 text-white focus:border-[#1877F2]'
                      }`}
                    />
                    {newTennisComment.trim() && (
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-xl bg-[#1877F2] text-white text-xs font-semibold"
                      >
                        Post
                      </button>
                    )}
                  </form>
                </div>
              )}
            </article>
          </div>
        )}

        {/* ==================== PHOTO POST MODAL ==================== */}
        {createPostOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 pb-20 sm:pb-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
            {/* Modal Dialog Card */}
            <div
              className={`w-full max-w-md md:max-w-lg max-h-[82vh] sm:max-h-[86vh] rounded-2xl sm:rounded-3xl border shadow-2xl flex flex-col relative overflow-hidden ${
                isBright ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'
              }`}
            >
              {/* Modal Header (Fixed at top) */}
              <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 border-b border-zinc-800/50 shrink-0">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#1877F2]" />
                  <h3 className="font-bold text-sm sm:text-base truncate">Post a Picture or Match</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCreatePostOpen(false);
                    setLocalPhotoFileName('');
                  }}
                  className="p-1.5 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body - Scrollable content with bottom padding ensuring elements are never cut off */}
              <div className="px-4 py-3 sm:px-5 sm:py-4 space-y-3.5 overflow-y-auto flex-1 min-h-0 overscroll-contain">
                {/* Select, Upload, or Enter Photo */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-400">Select or Upload Photo</label>
                    {customPhotoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomPhotoUrl('');
                          setLocalPhotoFileName('');
                        }}
                        className="text-[11px] text-rose-500 hover:underline"
                      >
                        Clear photo
                      </button>
                    )}
                  </div>

                  {/* Local Device Upload Button & Drag-and-Drop Area */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDeviceFileUpload(file);
                    }}
                  />

                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleDeviceFileUpload(file);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`group relative p-3.5 sm:p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center text-center ${
                      isDragOver
                        ? 'border-[#1877F2] bg-[#1877F2]/10 scale-[0.99]'
                        : customPhotoUrl && localPhotoFileName
                        ? 'border-emerald-500/60 bg-emerald-500/5'
                        : isBright
                        ? 'border-slate-300 hover:border-[#1877F2] bg-slate-50 hover:bg-blue-50/50'
                        : 'border-zinc-800 hover:border-[#1877F2] bg-zinc-900/60 hover:bg-zinc-900'
                    }`}
                  >
                    {customPhotoUrl && localPhotoFileName ? (
                      <div className="flex items-center gap-3 w-full">
                        <img
                          src={customPhotoUrl}
                          alt="Local uploaded preview"
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-emerald-500 shrink-0 shadow-sm"
                        />
                        <div className="text-left flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Photo Loaded from Device</span>
                          </div>
                          <p className="text-[11px] truncate text-zinc-400 font-mono mt-0.5">{localPhotoFileName}</p>
                          <p className="text-[10px] text-[#1877F2] mt-1 font-semibold">Click to choose a different photo</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-9 h-9 rounded-full bg-[#1877F2]/15 text-[#1877F2] flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                          <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className={`text-xs font-bold flex items-center justify-center gap-1.5 ${isBright ? 'text-slate-900' : 'text-white'}`}>
                            <span>Add Photo from Local Device</span>
                          </p>
                          <p className={`text-[11px] ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                            Click to browse files or drag & drop (JPG, PNG, WEBP)
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Preset suggestions */}
                  <div className="space-y-1.5 pt-1">
                    <span className={`text-[11px] font-medium block ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                      Or choose a preset athletic photo:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {presetPostPhotos.map((photo, idx) => (
                        <button
                          key={photo.label}
                          type="button"
                          onClick={() => {
                            setSelectedPresetPhoto(idx);
                            setCustomPhotoUrl('');
                            setLocalPhotoFileName('');
                          }}
                          className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                            selectedPresetPhoto === idx && !customPhotoUrl
                              ? 'border-[#1877F2] bg-[#1877F2]/10 ring-1 ring-[#1877F2]'
                              : isBright
                              ? 'border-slate-200 hover:bg-slate-50'
                              : 'border-zinc-800 hover:bg-zinc-900'
                          }`}
                        >
                          <img src={photo.url} alt={photo.label} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                          <span className="text-[11px] font-medium leading-tight line-clamp-2">{photo.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional Custom Web URL input */}
                  <div className="pt-1">
                    <input
                      type="url"
                      value={!localPhotoFileName ? customPhotoUrl : ''}
                      onChange={(e) => {
                        setLocalPhotoFileName('');
                        setCustomPhotoUrl(e.target.value);
                      }}
                      placeholder="Or paste an image web URL (https://...)"
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                        isBright
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#1877F2]'
                          : 'bg-zinc-900 border-zinc-800 text-white focus:border-[#1877F2]'
                      }`}
                    />
                  </div>
                </div>

                {/* Tag Sport / Activity */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">Activity / Tag</label>
                  <input
                    type="text"
                    value={postSportOrType}
                    onChange={(e) => setPostSportOrType(e.target.value)}
                    placeholder="e.g. Tennis Club • Match Play, Leg Day, CrossFit"
                    className={`w-full text-xs px-3.5 py-2 rounded-xl border focus:outline-none ${
                      isBright
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#1877F2]'
                        : 'bg-zinc-900 border-zinc-800 text-white focus:border-[#1877F2]'
                    }`}
                  />
                </div>

                {/* Caption */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">Caption & Thoughts</label>
                  <textarea
                    rows={2}
                    value={postCaption}
                    onChange={(e) => setPostCaption(e.target.value)}
                    placeholder="Share details about the match, score, or workout pump..."
                    className={`w-full text-xs p-3 rounded-xl border focus:outline-none resize-none ${
                      isBright
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#1877F2]'
                        : 'bg-zinc-900 border-zinc-800 text-white focus:border-[#1877F2]'
                    }`}
                  />
                </div>
              </div>

              {/* Modal Footer / Actions */}
              <div className="p-3.5 sm:p-4 border-t border-zinc-800/50 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setCreatePostOpen(false);
                    setLocalPhotoFileName('');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                    isBright ? 'text-slate-600 hover:bg-slate-100' : 'text-zinc-400 hover:bg-zinc-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePublishNewPhotoPost}
                  className="px-5 py-2 rounded-xl bg-[#1877F2] text-white text-xs font-bold hover:bg-blue-600 transition-colors shadow-sm shadow-blue-500/30"
                >
                  Publish Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: WORKOUT (EXACT INSPIRATION FROM IMAGE.PNG + COACH PROGRAM) ==================== */}
        {activeTab === 'workout' && (
          <WorkoutHubView trainee={trainee} />
        )}

        {/* OLD_WORKOUT_BLOCK */}
        {false && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Workout Header Card */}
            <div
              className={`p-5 sm:p-6 rounded-2xl border ${
                isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950 border-zinc-900'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#1877F2]">
                    Block 2 • Hypertrophy Focus
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                    Push Strength & Upper Body Volume
                  </h2>
                  <p className={`text-xs mt-1 ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                    Assigned by Coach Roger Bothman • Est. duration: 55 mins • 4 primary movements
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`px-3 py-1.5 rounded-xl border text-center ${
                      isBright ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-zinc-800'
                    }`}
                  >
                    <span className={`text-[10px] block font-mono uppercase ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                      Sets Done
                    </span>
                    <span className="text-base font-black font-mono text-[#1877F2]">
                      {completedSetsCount} / {totalSetsCount}
                    </span>
                  </div>

                  <button
                    onClick={() => setWorkoutFinished(true)}
                    disabled={workoutFinished}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                      workoutFinished
                        ? 'bg-emerald-500 text-white cursor-default'
                        : 'bg-[#1877F2] hover:bg-blue-600 active:bg-blue-700 text-white shadow-blue-600/20'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{workoutFinished ? 'Session Logged!' : 'Complete Workout'}</span>
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-5">
                <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                  <span className={isBright ? 'text-slate-600' : 'text-zinc-400'}>Session Completion</span>
                  <span className="font-bold text-[#1877F2]">{workoutProgressPercent}%</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${isBright ? 'bg-slate-100' : 'bg-zinc-900'}`}>
                  <div
                    className="h-full bg-[#1877F2] transition-all duration-300 rounded-full"
                    style={{ width: `${workoutProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Finished Banner */}
            {workoutFinished && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-between animate-fade-in">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold">Awesome work, {trainee.user.name}! Session Completed.</h4>
                    <p className="text-xs text-emerald-400/90">
                      All sets and tonnage have been recorded to your compliance ledger and sent to Coach Roger.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setWorkoutFinished(false)}
                  className="p-1.5 text-xs hover:bg-emerald-500/20 rounded-lg transition-colors"
                  title="Re-open session"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Exercise Cards */}
            <div className="space-y-4">
              {exercises.map((ex, exIdx) => (
                <div
                  key={ex.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isBright ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-900'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800/40">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#1877F2]/10 text-[#1877F2] font-mono text-xs font-black flex items-center justify-center">
                        {exIdx + 1}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold">{ex.name}</h3>
                        <p className={`text-xs ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                          {ex.muscle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sets Table */}
                  <div className="mt-3 space-y-2">
                    <div
                      className={`grid grid-cols-5 text-[11px] font-mono uppercase font-semibold px-2 py-1 ${
                        isBright ? 'text-slate-500' : 'text-zinc-400'
                      }`}
                    >
                      <span>Set</span>
                      <span className="text-center">Weight (lbs)</span>
                      <span className="text-center">Reps</span>
                      <span className="text-center">Target RPE</span>
                      <span className="text-right">Complete</span>
                    </div>

                    {ex.sets.map((set, setIdx) => (
                      <div
                        key={setIdx}
                        className={`grid grid-cols-5 items-center px-3 py-2 rounded-xl text-xs font-mono transition-colors ${
                          set.completed
                            ? isBright
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                              : 'bg-emerald-950/20 border border-emerald-900/40 text-emerald-200'
                            : isBright
                            ? 'bg-slate-50 border border-slate-200 text-slate-800'
                            : 'bg-zinc-900/60 border border-zinc-800/80 text-zinc-200'
                        }`}
                      >
                        <span className="font-bold">Set {set.setNumber}</span>

                        <div className="flex justify-center">
                          <input
                            type="number"
                            value={set.weight}
                            onChange={(e) => updateSetMetric(ex.id, setIdx, 'weight', Number(e.target.value))}
                            className={`w-14 text-center py-1 rounded-lg border font-bold ${
                              isBright
                                ? 'bg-white border-slate-300 text-slate-900'
                                : 'bg-zinc-950 border-zinc-700 text-white'
                            }`}
                          />
                        </div>

                        <div className="flex justify-center">
                          <input
                            type="number"
                            value={set.reps}
                            onChange={(e) => updateSetMetric(ex.id, setIdx, 'reps', Number(e.target.value))}
                            className={`w-12 text-center py-1 rounded-lg border font-bold ${
                              isBright
                                ? 'bg-white border-slate-300 text-slate-900'
                                : 'bg-zinc-950 border-zinc-700 text-white'
                            }`}
                          />
                        </div>

                        <span className="text-center font-bold text-[#1877F2]">
                          @{set.rpe}
                        </span>

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => toggleSetCompleted(ex.id, setIdx)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                              set.completed
                                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                                : isBright
                                ? 'border border-slate-300 hover:bg-slate-200 text-slate-400'
                                : 'border border-zinc-700 hover:bg-zinc-800 text-zinc-500'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: COACH ==================== */}
        {activeTab === 'coach' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Coach Profile Card */}
            <div
              className={`p-5 rounded-2xl border flex items-center justify-between ${
                isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950 border-zinc-900'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={CURRENT_COACH.avatarUrl}
                  alt={CURRENT_COACH.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#1877F2]"
                />
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <span>{CURRENT_COACH.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1877F2]/10 text-[#1877F2] font-semibold">
                      Head Coach
                    </span>
                  </h3>
                  <p className={`text-xs ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                    {CURRENT_COACH.email} • 94% response rate
                  </p>
                </div>
              </div>

              {/* Toggle Sub-tab: Chat vs Check-In */}
              <div className={`p-1 rounded-xl border flex ${isBright ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900 border-zinc-800'}`}>
                <button
                  type="button"
                  onClick={() => setCoachSubTab('chat')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    coachSubTab === 'chat'
                      ? 'bg-[#1877F2] text-white shadow-sm'
                      : isBright
                      ? 'text-slate-600'
                      : 'text-zinc-400'
                  }`}
                >
                  Chat
                </button>
                <button
                  type="button"
                  onClick={() => setCoachSubTab('checkin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    coachSubTab === 'checkin'
                      ? 'bg-[#1877F2] text-white shadow-sm'
                      : isBright
                      ? 'text-slate-600'
                      : 'text-zinc-400'
                  }`}
                >
                  Check-In
                </button>
              </div>
            </div>

            {/* Sub-view: Chat */}
            {coachSubTab === 'chat' ? (
              <div
                className={`p-4 sm:p-6 rounded-2xl border flex flex-col h-[480px] ${
                  isBright ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-900'
                }`}
              >
                <div className="flex-1 overflow-y-auto py-2 space-y-3">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${msg.sender === 'trainee' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md px-3.5 py-2.5 rounded-2xl text-xs ${
                          msg.sender === 'trainee'
                            ? 'bg-[#1877F2] text-white rounded-br-none'
                            : isBright
                            ? 'bg-slate-100 text-slate-900 rounded-bl-none'
                            : 'bg-zinc-900 text-zinc-100 rounded-bl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 mt-1 px-1">
                        {msg.time}
                      </span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="pt-3 border-t border-zinc-800/60 flex gap-2">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Ask Coach Roger a question or send an update..."
                    className={`flex-1 text-xs px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                      isBright ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-zinc-800'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!newMessageText.trim()}
                    className="px-4 py-2 rounded-xl bg-[#1877F2] hover:bg-blue-600 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
              </div>
            ) : (
              /* Sub-view: Check-In Form */
              <div
                className={`p-6 rounded-2xl border ${
                  isBright ? 'bg-white border-slate-200' : 'bg-zinc-950 border-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/60">
                  <div>
                    <h3 className="text-base font-bold">Weekly Accountability & Readiness Check-In</h3>
                    <p className={`text-xs ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                      Week 6 of 12 • Direct video or text review by Coach Roger.
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#1877F2]/10 text-[#1877F2] font-bold">
                    Pending Review
                  </span>
                </div>

                {checkInSubmitted ? (
                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Check-In Submitted Successfully!</span>
                    </div>
                    <p className="text-xs text-emerald-400/90">
                      Your metrics and notes have been logged to Coach Roger's review engine.
                    </p>
                    <button
                      onClick={() => setCheckInSubmitted(false)}
                      className="mt-2 text-xs underline font-semibold hover:opacity-80"
                    >
                      Edit check-in entry
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setCheckInSubmitted(true);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Morning Fasted Weight (lbs)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={checkInWeight}
                          onChange={(e) => setCheckInWeight(e.target.value)}
                          className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none ${
                            isBright ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-zinc-800'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Average Sleep Quality (1 - 10)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={sleepScore}
                          onChange={(e) => setSleepScore(Number(e.target.value))}
                          className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none ${
                            isBright ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-zinc-800'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Daily Energy Levels (1 - 10)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={energyScore}
                          onChange={(e) => setEnergyScore(Number(e.target.value))}
                          className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none ${
                            isBright ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-zinc-800'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Nutrition & Macro Adherence (1 - 10)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={dietAdherence}
                          onChange={(e) => setDietAdherence(Number(e.target.value))}
                          className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none ${
                            isBright ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-zinc-800'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Wins & Highlights</label>
                      <textarea
                        rows={2}
                        value={winsText}
                        onChange={(e) => setWinsText(e.target.value)}
                        className={`w-full text-xs p-3 rounded-xl border focus:outline-none resize-none ${
                          isBright ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-zinc-800'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Struggles or Questions</label>
                      <textarea
                        rows={2}
                        value={strugglesText}
                        onChange={(e) => setStrugglesText(e.target.value)}
                        className={`w-full text-xs p-3 rounded-xl border focus:outline-none resize-none ${
                          isBright ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-zinc-800'
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-white font-bold text-xs transition-colors shadow-md shadow-blue-600/20"
                    >
                      Submit Check-In
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 4: PROFILE ==================== */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Athlete Profile Card */}
            <div
              className={`p-6 rounded-2xl border text-center relative ${
                isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950 border-zinc-900'
              }`}
            >
              {trainee.user.avatarUrl ? (
                <img
                  src={trainee.user.avatarUrl}
                  alt={trainee.user.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-[#1877F2] shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-zinc-800 text-2xl font-bold flex items-center justify-center mx-auto">
                  {trainee.user.name.slice(0, 2)}
                </div>
              )}

              <h2 className="text-lg font-black mt-3">{trainee.user.name}</h2>
              <p className={`text-xs ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                {trainee.user.email} • {trainee.targetFocus}
              </p>

              {/* Metric Badges */}
              <div className="grid grid-cols-3 gap-2 mt-5">
                <div className={`p-3 rounded-xl border ${isBright ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-zinc-800'}`}>
                  <span className={`text-[10px] font-mono uppercase block ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                    Adherence
                  </span>
                  <span className="text-base font-black font-mono text-emerald-500">
                    {trainee.compliance14Days}%
                  </span>
                </div>

                <div className={`p-3 rounded-xl border ${isBright ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-zinc-800'}`}>
                  <span className={`text-[10px] font-mono uppercase block ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                    Workouts
                  </span>
                  <span className="text-base font-black font-mono text-[#1877F2]">
                    {trainee.workoutsCompleted14Days}
                  </span>
                </div>

                <div className={`p-3 rounded-xl border ${isBright ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-zinc-800'}`}>
                  <span className={`text-[10px] font-mono uppercase block ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                    Streak
                  </span>
                  <span className="text-base font-black font-mono text-amber-500 flex items-center justify-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    14d
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Records */}
            <div
              className={`p-5 rounded-2xl border ${
                isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950 border-zinc-900'
              }`}
            >
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Personal Records (PRs)</span>
              </h3>
              <div className="space-y-2">
                {[
                  { exercise: 'Barbell Back Squat', weight: '245 lbs x 5 reps', date: '3 days ago' },
                  { exercise: 'Incline Dumbbell Bench Press', weight: '70 lbs x 8 reps', date: 'Yesterday' },
                  { exercise: 'Romanian Deadlift (RDL)', weight: '255 lbs x 6 reps', date: 'Last week' },
                ].map((pr, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                      isBright ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-zinc-800'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{pr.exercise}</p>
                      <p className="text-emerald-500 font-mono font-semibold">{pr.weight}</p>
                    </div>
                    <span className={`font-mono text-[11px] ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                      {pr.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Settings & Sign Out */}
            <div
              className={`p-4 rounded-2xl border space-y-2 ${
                isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950 border-zinc-900'
              }`}
            >
              <button
                type="button"
                onClick={toggleTheme}
                className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  isBright ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-zinc-900 text-zinc-200'
                }`}
              >
                <span>Display Theme</span>
                <span className="text-[11px] text-[#1877F2] font-mono">{isBright ? 'Bright' : 'Black'}</span>
              </button>

              <button
                type="button"
                onClick={onSignOut}
                className="w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors text-rose-500 hover:bg-rose-500/10"
              >
                <span>Sign Out of Account</span>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ==================== BOTTOM FOOTER DOCK (INSPIRED BY SCREENSHOT) ==================== */}
      <footer
        className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-2xl transition-colors ${
          isBright
            ? 'bg-white/95 border-slate-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]'
            : 'bg-black/95 border-zinc-900/90 shadow-[0_-4px_24px_rgba(0,0,0,0.6)]'
        }`}
      >
        <div className="max-w-md sm:max-w-xl mx-auto px-4 pt-2 pb-1">
          {/* The 4 Tab Buttons: Home, Workout, Coach, Profile */}
          <div className="grid grid-cols-4 gap-1">
            {/* 1. HOME */}
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                activeTab === 'home'
                  ? 'text-[#1877F2]'
                  : isBright
                  ? 'text-slate-500 hover:text-slate-900'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <div
                className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                  activeTab === 'home'
                    ? isBright
                      ? 'bg-blue-100/70 text-[#1877F2]'
                      : 'bg-[#1877F2]/20 text-[#1877F2]'
                    : ''
                }`}
              >
                <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              </div>
              <span className={`text-[10px] font-semibold mt-0.5 ${activeTab === 'home' ? 'font-bold' : ''}`}>
                Home
              </span>
            </button>

            {/* 2. WORKOUT */}
            <button
              type="button"
              onClick={() => setActiveTab('workout')}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                activeTab === 'workout'
                  ? 'text-[#1877F2]'
                  : isBright
                  ? 'text-slate-500 hover:text-slate-900'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <div
                className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                  activeTab === 'workout'
                    ? isBright
                      ? 'bg-blue-100/70 text-[#1877F2]'
                      : 'bg-[#1877F2]/20 text-[#1877F2]'
                    : ''
                }`}
              >
                <Dumbbell className={`w-5 h-5 ${activeTab === 'workout' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              </div>
              <span className={`text-[10px] font-semibold mt-0.5 ${activeTab === 'workout' ? 'font-bold' : ''}`}>
                Workout
              </span>
            </button>

            {/* 3. COACH */}
            <button
              type="button"
              onClick={() => setActiveTab('coach')}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                activeTab === 'coach'
                  ? 'text-[#1877F2]'
                  : isBright
                  ? 'text-slate-500 hover:text-slate-900'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <div
                className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                  activeTab === 'coach'
                    ? isBright
                      ? 'bg-blue-100/70 text-[#1877F2]'
                      : 'bg-[#1877F2]/20 text-[#1877F2]'
                    : ''
                }`}
              >
                <Shield className={`w-5 h-5 ${activeTab === 'coach' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              </div>
              <span className={`text-[10px] font-semibold mt-0.5 ${activeTab === 'coach' ? 'font-bold' : ''}`}>
                Coach
              </span>
            </button>

            {/* 4. PROFILE */}
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                activeTab === 'profile'
                  ? 'text-[#1877F2]'
                  : isBright
                  ? 'text-slate-500 hover:text-slate-900'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <div
                className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                  activeTab === 'profile'
                    ? isBright
                      ? 'bg-blue-100/70 text-[#1877F2]'
                      : 'bg-[#1877F2]/20 text-[#1877F2]'
                    : ''
                }`}
              >
                <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              </div>
              <span className={`text-[10px] font-semibold mt-0.5 ${activeTab === 'profile' ? 'font-bold' : ''}`}>
                Profile
              </span>
            </button>
          </div>

          {/* Home indicator bar (matching mobile design in the screenshot) */}
          <div className="w-32 h-1 bg-zinc-600/40 rounded-full mx-auto mt-2 mb-0.5" />
        </div>
      </footer>
    </div>
  );
};
