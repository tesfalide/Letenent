// components/trainee/InstagramFeedView.tsx
// Instagram-style social feed where athletes post, react, comment, and discover

import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Plus,
  X,
  Send,
  Sparkles,
  Image as ImageIcon,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  Check,
} from 'lucide-react';
import { TraineeProfile } from '@/types';
import { useTheme } from '@/src/context/ThemeContext';

export interface FeedPost {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    isCoach?: boolean;
  };
  location: string;
  timeAgo: string;
  imageUrl?: string;
  caption: string;
  hashtags: string[];
  workoutStats?: {
    time: string;
    volume: string;
    prCount?: number;
  };
  exercises?: {
    name: string;
    sets: number;
    hasAccent?: boolean;
  }[];
  likes: number;
  hasLiked: boolean;
  hasBookmarked: boolean;
  comments: {
    id: string;
    user: string;
    avatar: string;
    time: string;
    text: string;
    likes: number;
  }[];
}

interface InstagramFeedViewProps {
  trainee: TraineeProfile;
  suggestedAthletes: {
    id: string;
    name: string;
    handle: string;
    focus: string;
    avatar: string;
    followed: boolean;
  }[];
  onToggleFollowAthlete: (id: string) => void;
  onDismissAthlete: (id: string) => void;
}

export const InstagramFeedView: React.FC<InstagramFeedViewProps> = ({
  trainee,
  suggestedAthletes,
  onToggleFollowAthlete,
  onDismissAthlete,
}) => {
  const { isBright } = useTheme();

  // Stories data
  const [stories] = useState([
    {
      id: 'st_my',
      name: 'Your Story',
      avatar: trainee.user.avatarUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      isMe: true,
      hasActive: false,
    },
    {
      id: 'st_coach',
      name: 'Coach Roger',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      isCoach: true,
      hasActive: true,
      media: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      caption: 'Form cue of the day: Retract and depress scapulae on all horizontal pulls! 🔥',
    },
    {
      id: 'st_alex',
      name: 'alexandul',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      hasActive: true,
      media: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
      caption: 'Late night leg session wrapped up! 12,000 lbs moved.',
    },
    {
      id: 'st_marcus',
      name: 'marcus_power',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      hasActive: true,
      media: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800',
      caption: 'New 3-rep max on incline bench press today! 💥',
    },
    {
      id: 'st_olivia',
      name: 'olivia_fit',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      hasActive: true,
      media: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800',
      caption: 'Conditioning circuits hit different on Saturday mornings.',
    },
    {
      id: 'st_wilson',
      name: 'wilson_k',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
      hasActive: true,
      media: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800',
      caption: 'Snatch technique drills feeling sharp.',
    },
  ]);

  const [activeStory, setActiveStory] = useState<(typeof stories)[0] | null>(null);

  // New Post Modal State
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [postCaption, setPostCaption] = useState('');
  const [postLocation, setPostLocation] = useState('Centre Gym');
  const [postVolume, setPostVolume] = useState('11,400 lbs');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const presetPhotos = [
    {
      url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80',
      label: 'Barbell Squat Rack',
    },
    {
      url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&auto=format&fit=crop&q=80',
      label: 'Dumbbell Bench Press',
    },
    {
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop&q=80',
      label: 'Gym Floor & Iron',
    },
    {
      url: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=900&auto=format&fit=crop&q=80',
      label: 'Deadlift Setup',
    },
  ];

  // Feed Posts List
  const [posts, setPosts] = useState<FeedPost[]>([
    {
      id: 'post_1',
      author: {
        name: 'Alexandul',
        username: 'alexandul',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      location: 'Centre Gym',
      timeAgo: '19:29',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80',
      caption: 'Crushed lower body hypertrophy today. Focused heavily on 3-second eccentrics on squats and deep stretch on lunges. Feeling the pump! 🔥',
      hashtags: ['#legday', '#hypertrophy', '#letenent', '#squats'],
      workoutStats: {
        time: '1h 14min',
        volume: '12,114.4 lbs',
        prCount: 1,
      },
      exercises: [
        { name: '4 sets Squat (Barbell)', sets: 4, hasAccent: true },
        { name: '4 sets Lunge (Barbell)', sets: 4, hasAccent: true },
        { name: '3 sets Iso-Lateral Chest Press (Machine)', sets: 3, hasAccent: false },
        { name: '3 sets Romanian Deadlift (Dumbbell)', sets: 3, hasAccent: false },
      ],
      likes: 601,
      hasLiked: false,
      hasBookmarked: false,
      comments: [
        {
          id: 'c_1',
          user: 'gustavo',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80',
          time: '5d',
          text: 'Vamoooos 💪🔥👏',
          likes: 10,
        },
        {
          id: 'c_2',
          user: 'melhay333',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80',
          time: '5d',
          text: '¡Órale! Great volume!',
          likes: 9,
        },
      ],
    },
    {
      id: 'post_coach_roger',
      author: {
        name: 'Roger Bothman',
        username: 'coach_roger',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        isCoach: true,
      },
      location: 'Letenent Performance Lab',
      timeAgo: '3h ago',
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop&q=80',
      caption: 'Coaching tip of the week: Stop rushing your warmup sets! Treat 135 lbs with the exact same intent, bracing, and bar path as 405 lbs. Quality creates longevity. 🎯',
      hashtags: ['#coachtips', '#technique', '#strengthcoach', '#letenent'],
      likes: 248,
      hasLiked: true,
      hasBookmarked: true,
      comments: [
        {
          id: 'c_c1',
          user: 'marcus_power',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80',
          time: '2h',
          text: 'Golden advice coach. Needed this reminder today.',
          likes: 5,
        },
      ],
    },
    {
      id: 'post_marcus',
      author: {
        name: 'Marcus Chen',
        username: 'marcus_power',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      },
      location: 'Metropolitan Athletics',
      timeAgo: '5h ago',
      imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&auto=format&fit=crop&q=80',
      caption: 'Hit 85s for 8 clean reps on incline dumbbell press! Shoulder stability has reached an all-time high with the new programming block.',
      hashtags: ['#powerbuilding', '#upperbody', '#pr'],
      workoutStats: {
        time: '58min',
        volume: '14,800 lbs',
        prCount: 2,
      },
      exercises: [
        { name: '4 sets Incline DB Press', sets: 4, hasAccent: true },
        { name: '3 sets Chest-Supported Row', sets: 3, hasAccent: true },
        { name: '3 sets Overhead Press', sets: 3, hasAccent: false },
      ],
      likes: 184,
      hasLiked: false,
      hasBookmarked: false,
      comments: [
        {
          id: 'c_m1',
          user: 'coach_roger',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80',
          time: '4h',
          text: 'Textbook lockouts, Marcus. The tempo discipline is paying off!',
          likes: 8,
        },
      ],
    },
  ]);

  // Comment input per post
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>({});

  // Slide ref for suggested athletes
  const athleteSliderRef = React.useRef<HTMLDivElement>(null);

  const slideAthletes = (direction: 'left' | 'right') => {
    if (athleteSliderRef.current) {
      const scrollAmount = 210;
      athleteSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Toggle Like with Heart
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const willLike = !p.hasLiked;
        return {
          ...p,
          hasLiked: willLike,
          likes: willLike ? p.likes + 1 : p.likes - 1,
        };
      })
    );
  };

  // Toggle Bookmark
  const handleToggleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, hasBookmarked: !p.hasBookmarked } : p))
    );
  };

  // Post Comment
  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    const newC = {
      id: `c_${Date.now()}`,
      user: trainee.user.name.toLowerCase().replace(/\s+/g, '_'),
      avatar: trainee.user.avatarUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80',
      time: 'Just now',
      text,
      likes: 0,
    };

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, newC] } : p))
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  // Quick Emoji Click for Comment
  const handleAddQuickEmoji = (postId: string, emoji: string) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: (prev[postId] || '') + emoji,
    }));
  };

  // Create New Post
  const handleCreateNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postCaption.trim()) return;

    const newPost: FeedPost = {
      id: `post_${Date.now()}`,
      author: {
        name: trainee.user.name,
        username: trainee.user.name.toLowerCase().replace(/\s+/g, '_'),
        avatar: trainee.user.avatarUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      },
      location: postLocation || 'Centre Gym',
      timeAgo: 'Just now',
      imageUrl: presetPhotos[selectedPhotoIndex].url,
      caption: postCaption.trim(),
      hashtags: ['#workout', '#letenent', '#fitness'],
      workoutStats: {
        time: '52min',
        volume: postVolume || '11,400 lbs',
        prCount: 1,
      },
      exercises: [
        { name: '4 sets Incline DB Bench Press', sets: 4, hasAccent: true },
        { name: '3 sets Barbell Overhead Press', sets: 3, hasAccent: true },
        { name: '3 sets Cable Lateral Raise', sets: 3, hasAccent: false },
      ],
      likes: 1,
      hasLiked: true,
      hasBookmarked: false,
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setPostCaption('');
    setCreatePostOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* ==================== 1. STORIES TRAY ==================== */}
      <div
        className={`p-3.5 rounded-2xl border ${
          isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950 border-zinc-900'
        }`}
      >
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
          {stories.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                if (s.isMe) {
                  setCreatePostOpen(true);
                } else if (s.hasActive) {
                  setActiveStory(s);
                }
              }}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              <div
                className={`relative p-0.5 rounded-full transition-transform group-hover:scale-105 ${
                  s.isMe
                    ? 'p-0'
                    : s.hasActive
                    ? 'bg-gradient-to-tr from-[#1877F2] via-blue-400 to-indigo-500'
                    : 'bg-zinc-700'
                }`}
              >
                <img
                  src={s.avatar}
                  alt={s.name}
                  className={`w-14 h-14 rounded-full object-cover border-2 ${
                    isBright ? 'border-white' : 'border-black'
                  }`}
                />
                {s.isMe && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#1877F2] border-2 border-black flex items-center justify-center text-white">
                    <Plus className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                {s.isCoach && (
                  <div className="absolute top-0 right-0 px-1 py-0.2 rounded-full bg-[#1877F2] text-[8px] font-bold text-white uppercase font-mono">
                    Coach
                  </div>
                )}
              </div>
              <span
                className={`text-[11px] font-medium tracking-tight truncate max-w-[64px] ${
                  isBright ? 'text-slate-700' : 'text-zinc-300'
                }`}
              >
                {s.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ==================== 2. QUICK POST COMPOSER BAR ==================== */}
      <div
        className={`p-3.5 sm:p-4 rounded-2xl border flex items-center gap-3 transition-all ${
          isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950 border-zinc-900'
        }`}
      >
        <img
          src={trainee.user.avatarUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'}
          alt={trainee.user.name}
          className="w-10 h-10 rounded-full object-cover border border-[#1877F2]"
        />
        <button
          type="button"
          onClick={() => setCreatePostOpen(true)}
          className={`flex-1 text-left px-4 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
            isBright
              ? 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
              : 'bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
          }`}
        >
          Share your workout or personal record...
        </button>
        <button
          type="button"
          onClick={() => setCreatePostOpen(true)}
          className="px-3 py-2 rounded-xl bg-[#1877F2] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 hover:bg-blue-600 transition-colors"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Post</span>
        </button>
      </div>

      {/* ==================== 3. INSTAGRAM FEED POSTS ==================== */}
      <div className="space-y-6">
        {posts.map((post, postIndex) => (
          <React.Fragment key={post.id}>
            <article
              className={`rounded-2xl border transition-all overflow-hidden ${
                isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-zinc-950 border-zinc-900 shadow-xl'
              }`}
            >
              {/* Post Header */}
              <div className="p-3.5 sm:p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#1877F2] to-indigo-500">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-black"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs leading-tight">{post.author.username}</h4>
                      {post.author.isCoach && (
                        <span className="px-1.5 py-0.2 rounded-md bg-[#1877F2]/20 text-[#1877F2] font-mono text-[9px] font-bold">
                          COACH
                        </span>
                      )}
                      <span className={`text-[11px] ${isBright ? 'text-slate-400' : 'text-zinc-500'}`}>
                        • {post.timeAgo}
                      </span>
                    </div>
                    <p className={`text-[11px] ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                      {post.location}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className={`p-1.5 rounded-lg ${
                    isBright ? 'text-slate-400 hover:bg-slate-100' : 'text-zinc-500 hover:bg-zinc-900'
                  }`}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Workout Stats Strip (If logged) */}
              {post.workoutStats && (
                <div className="px-4 pb-2.5 flex items-center gap-6 text-xs">
                  <div>
                    <span className={`block text-[10px] font-mono uppercase ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                      Duration
                    </span>
                    <span className="font-bold text-xs">{post.workoutStats.time}</span>
                  </div>
                  <div>
                    <span className={`block text-[10px] font-mono uppercase ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                      Total Volume
                    </span>
                    <span className="font-bold text-xs font-mono">{post.workoutStats.volume}</span>
                  </div>
                  {post.workoutStats.prCount && (
                    <div>
                      <span className={`block text-[10px] font-mono uppercase ${isBright ? 'text-slate-500' : 'text-zinc-400'}`}>
                        Personal Records
                      </span>
                      <span className="font-bold text-xs text-amber-400 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        {post.workoutStats.prCount} PRs
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Post Media / Workout Image with Double-Tap Heart */}
              {post.imageUrl && (
                <div
                  className="relative overflow-hidden cursor-pointer select-none aspect-[4/3] bg-zinc-900"
                  onDoubleClick={() => handleToggleLike(post.id)}
                >
                  <img
                    src={post.imageUrl}
                    alt="Workout session"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Action Bar (Heart, Comment, Share, Bookmark) */}
              <div className="p-3.5 sm:p-4 pb-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Heart / Like */}
                  <button
                    type="button"
                    onClick={() => handleToggleLike(post.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold focus:outline-none group"
                  >
                    <Heart
                      className={`w-5 h-5 transition-transform active:scale-125 ${
                        post.hasLiked
                          ? 'fill-rose-500 text-rose-500'
                          : isBright
                          ? 'text-slate-700 group-hover:text-slate-900'
                          : 'text-zinc-200 group-hover:text-white'
                      }`}
                    />
                    <span className={post.hasLiked ? 'text-rose-500' : ''}>{post.likes}</span>
                  </button>

                  {/* Comment */}
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-xs font-semibold focus:outline-none"
                  >
                    <MessageCircle
                      className={`w-5 h-5 ${
                        isBright ? 'text-slate-700 hover:text-slate-900' : 'text-zinc-200 hover:text-white'
                      }`}
                    />
                    <span>{post.comments.length}</span>
                  </button>

                  {/* Share */}
                  <button
                    type="button"
                    onClick={() => alert('Post link copied to clipboard!')}
                    className={`focus:outline-none ${
                      isBright ? 'text-slate-700 hover:text-slate-900' : 'text-zinc-200 hover:text-white'
                    }`}
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Bookmark */}
                <button
                  type="button"
                  onClick={() => handleToggleBookmark(post.id)}
                  className="focus:outline-none"
                >
                  <Bookmark
                    className={`w-5 h-5 ${
                      post.hasBookmarked
                        ? 'fill-[#1877F2] text-[#1877F2]'
                        : isBright
                        ? 'text-slate-700 hover:text-slate-900'
                        : 'text-zinc-200 hover:text-white'
                    }`}
                  />
                </button>
              </div>

              {/* Likes and Social Proof */}
              <div className="px-4 pb-2 text-xs">
                <p className={`font-semibold ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  Liked by{' '}
                  <span className="font-bold">
                    {post.hasLiked ? trainee.user.name.toLowerCase().replace(/\s+/g, '_') : 'coach_roger'}
                  </span>{' '}
                  and {post.likes - 1} others
                </p>
              </div>

              {/* Caption */}
              <div className="px-4 pb-2.5 text-xs leading-relaxed">
                <p>
                  <strong className="font-bold mr-1.5">{post.author.username}</strong>
                  <span className={isBright ? 'text-slate-800' : 'text-zinc-200'}>
                    {post.caption}
                  </span>
                </p>
                {post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {post.hashtags.map((tag, idx) => (
                      <span key={idx} className="text-[#1877F2] font-semibold text-[11px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Exercises Dropdown Toggle (If exercises are logged) */}
              {post.exercises && post.exercises.length > 0 && (
                <div className={`mx-4 my-2 p-3 rounded-xl border ${
                  isBright ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900/60 border-zinc-800'
                }`}>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedExercises((prev) => ({
                        ...prev,
                        [post.id]: !prev[post.id],
                      }))
                    }
                    className="w-full flex items-center justify-between text-xs font-semibold text-[#1877F2]"
                  >
                    <span>
                      {expandedExercises[post.id]
                        ? 'Hide exercise breakdown'
                        : `View ${post.exercises.length} exercises logged`}
                    </span>
                    <span className="font-mono text-[10px]">
                      {expandedExercises[post.id] ? '▲' : '▼'}
                    </span>
                  </button>

                  {expandedExercises[post.id] && (
                    <div className="mt-2.5 space-y-2 border-t pt-2.5 border-zinc-800/40 animate-in fade-in duration-150">
                      {post.exercises.map((ex, exIdx) => (
                        <div key={exIdx} className="flex items-center gap-2.5 text-xs">
                          {ex.hasAccent ? (
                            <div className="w-1 h-5 bg-emerald-500 rounded-full shrink-0" />
                          ) : (
                            <div className="w-1 h-5 bg-blue-500/50 rounded-full shrink-0" />
                          )}
                          <span className="font-medium truncate">{ex.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Comments Thread */}
              <div className={`px-4 pt-2 pb-4 border-t space-y-2.5 ${
                isBright ? 'border-slate-100' : 'border-zinc-900'
              }`}>
                {post.comments.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {post.comments.map((c) => (
                      <div key={c.id} className="flex items-start justify-between gap-2 text-xs">
                        <div className="flex items-start gap-2">
                          <img
                            src={c.avatar}
                            alt={c.user}
                            className="w-6 h-6 rounded-full object-cover mt-0.5"
                          />
                          <div>
                            <p className="leading-tight">
                              <span className="font-bold mr-1.5">{c.user}</span>
                              <span className={isBright ? 'text-slate-700' : 'text-zinc-300'}>
                                {c.text}
                              </span>
                            </p>
                            <span className={`text-[10px] ${isBright ? 'text-slate-400' : 'text-zinc-500'}`}>
                              {c.time}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                          <Heart className="w-3 h-3 hover:text-rose-500 cursor-pointer" />
                          {c.likes > 0 && <span>{c.likes}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Emoji Reaction Pill Bar */}
                <div className="flex items-center gap-1.5 pt-1">
                  {['🔥', '💪', '👏', '⚡️', '🏋️‍♂️'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleAddQuickEmoji(post.id, emoji)}
                      className={`px-2 py-0.5 rounded-full text-xs transition-transform hover:scale-110 active:scale-95 border ${
                        isBright ? 'bg-slate-100 border-slate-200' : 'bg-zinc-900 border-zinc-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Inline Comment Form */}
                <form
                  onSubmit={(e) => handleAddComment(post.id, e)}
                  className="flex items-center gap-2 pt-1"
                >
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    placeholder="Add a comment or reaction..."
                    className={`flex-1 text-xs px-3 py-2 rounded-xl border focus:outline-none transition-colors ${
                      isBright
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#1877F2]'
                        : 'bg-zinc-900 border-zinc-800 text-white focus:border-[#1877F2]'
                    }`}
                  />
                  {(commentInputs[post.id] || '').trim() && (
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-[#1877F2] text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
                    >
                      Post
                    </button>
                  )}
                </form>
              </div>
            </article>

            {/* ==================== 4. SUGGESTED ATHLETES CAROUSEL (SIDE SLIDE MODE) ==================== */}
            {postIndex === 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isBright ? 'text-slate-500' : 'text-zinc-400'
                      }`}
                    >
                      Suggested Athletes
                    </h3>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        isBright ? 'bg-slate-100 text-slate-600' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                      }`}
                    >
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
                        onClick={() => onDismissAthlete(athlete.id)}
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
                        onClick={() => onToggleFollowAthlete(athlete.id)}
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
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ==================== 5. STORY PREVIEW MODAL ==================== */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 relative flex flex-col">
            {/* Story Top Bar with Progress Line */}
            <div className="p-3 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeStory.avatar}
                  alt={activeStory.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#1877F2]"
                />
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">{activeStory.name}</h4>
                  <span className="text-[10px] text-zinc-400">2h ago</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveStory(null)}
                className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Story Media */}
            <div className="aspect-[9/16] w-full bg-zinc-900 relative">
              {activeStory.media && (
                <img
                  src={activeStory.media}
                  alt="Story"
                  className="w-full h-full object-cover"
                />
              )}
              {/* Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                <p className="text-sm font-semibold text-white">{activeStory.caption}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 6. CREATE POST MODAL ==================== */}
      {createPostOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            className={`max-w-lg w-full rounded-3xl border p-6 space-y-4 shadow-2xl relative ${
              isBright ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1877F2]" />
                <span>Create Workout Post</span>
              </h3>
              <button
                type="button"
                onClick={() => setCreatePostOpen(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-800/40 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewPost} className="space-y-4">
              {/* Select Fitness Image */}
              <div>
                <label className="block text-xs font-semibold mb-2">Select Photo</label>
                <div className="grid grid-cols-4 gap-2">
                  {presetPhotos.map((photo, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setSelectedPhotoIndex(pIdx)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        selectedPhotoIndex === pIdx
                          ? 'border-[#1877F2] ring-2 ring-[#1877F2]/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                      {selectedPhotoIndex === pIdx && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#1877F2] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-semibold mb-1">Caption</label>
                <textarea
                  required
                  rows={3}
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  placeholder="Share how your session went, milestones, or questions..."
                  className={`w-full text-xs p-3 rounded-xl border focus:outline-none resize-none ${
                    isBright ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-zinc-800'
                  }`}
                />
              </div>

              {/* Location & Volume */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Location / Gym</label>
                  <input
                    type="text"
                    value={postLocation}
                    onChange={(e) => setPostLocation(e.target.value)}
                    placeholder="Centre Gym"
                    className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none ${
                      isBright ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-zinc-800'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Total Volume</label>
                  <input
                    type="text"
                    value={postVolume}
                    onChange={(e) => setPostVolume(e.target.value)}
                    placeholder="12,400 lbs"
                    className={`w-full text-xs px-3 py-2 rounded-xl border focus:outline-none ${
                      isBright ? 'bg-slate-50 border-slate-200' : 'bg-zinc-900 border-zinc-800'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreatePostOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
                    isBright ? 'border-slate-200 hover:bg-slate-100' : 'border-zinc-800 hover:bg-zinc-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!postCaption.trim()}
                  className="px-5 py-2 rounded-xl bg-[#1877F2] text-white text-xs font-bold hover:bg-blue-600 shadow-md shadow-blue-600/20 disabled:opacity-40"
                >
                  Share Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
