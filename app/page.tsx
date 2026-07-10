'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Plus, 
  Trash2, 
  Send, 
  Share2, 
  Copy, 
  Check, 
  FileText, 
  Server, 
  Compass, 
  Film, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  CornerDownRight, 
  Sliders, 
  Search, 
  BookOpen, 
  Download, 
  Info, 
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2,
  FastForward,
  Rewind,
  SkipForward,
  SkipBack,
  Pause,
  Volume2,
  Gamepad2,
  Trophy,
  Sun,
  Moon,
  Sparkles,
  LogIn,
  LogOut,
  User,
  Lock,
  Mail,
  Database,
  Cpu,
  Activity,
  Terminal,
  Settings,
  Bot,
  Languages,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Interfaces
interface Reply {
  id: string;
  author: string;
  avatarColor: string;
  text: string;
  timestamp: string;
  rating: number;
}

interface Comment {
  id: string;
  author: string;
  avatarColor: string;
  text: string;
  timestamp: string;
  rating: number;
  userVote: 'up' | 'down' | null;
  replies: Reply[];
}

interface Video {
  id: string;
  title: string;
  url: string;
  author: string;
  category: string;
  description: string;
  isCustom?: boolean;
}

// Initial default videos
const DEFAULT_VIDEOS: Video[] = [
  {
    id: 'lofi-1',
    title: 'Lofi Girl - Synthwave Radio 🌌',
    url: 'https://www.youtube.com/embed/4xDzrJKXOOY',
    author: 'Lofi Girl',
    category: 'Música & Chill',
    description: 'Un viaje retro-futurista por la noche cibernética. El acompañante perfecto para programar, diseñar o relajarse bajo la luz de la luna.'
  },
  {
    id: 'neon-drive',
    title: 'Tokyo Night Drive in Rain - 4K Visuals 🌧️',
    url: 'https://www.youtube.com/embed/5Wq1_X_3Gis',
    author: 'Ambient Tokyo',
    category: 'Aesthetic / Visual',
    description: 'Inmersión total en las calles iluminadas por luces de neón en Tokio durante una noche lluviosa de verano. Relajación visual pura.'
  },
  {
    id: 'dev-desk',
    title: 'Aesthetic Coding ASMR - Dark Mechanical Keyboard 💻',
    url: 'https://www.youtube.com/embed/k9Wup0W0v4E',
    author: 'DevVibes',
    category: 'Programación / ASMR',
    description: 'El crujido rítmico de un teclado mecánico en una oficina minimalista iluminada por tonos de neón cian y violeta. Concentración nocturna absoluta.'
  },
  {
    id: 'space-journey',
    title: 'Interstellar Deep Space Journey - Ambient Visuals 🪐',
    url: 'https://www.youtube.com/embed/u6Z-3eP8O2I',
    author: 'Cosmic Relax',
    category: 'Ciencia / Relax',
    description: 'Explora las profundidades del cosmos, nebulosas distantes y galaxias en espiral acompañadas de texturas sonoras ambientales oscuras.'
  }
];

// Initial comments by video ID
const INITIAL_COMMENTS_MAP: Record<string, Comment[]> = {
  'lofi-1': [
    {
      id: 'c1',
      author: 'Kira_Codes',
      avatarColor: 'from-cyan-400 to-blue-500',
      text: 'Esta interfaz oscura es de otro nivel. Los efectos de iluminación ambiental detrás del reproductor le dan una inmersión cinematográfica espectacular. ¡Increíble trabajo de diseño!',
      timestamp: 'Hace 2 horas',
      rating: 42,
      userVote: null,
      replies: []
    },
    {
      id: 'c2',
      author: 'Satoshi_Dev',
      avatarColor: 'from-purple-500 to-pink-500',
      text: '¡Me encanta la sección de configuración de Nginx y Docker! Justo estaba buscando un Dockerfile multi-stage optimizado para mi servidor en Render con proxy inverso. Se agradece un montón.',
      timestamp: 'Hace 4 horas',
      rating: 28,
      userVote: null,
      replies: [
        {
          id: 'c2-r1',
          author: 'Gustavo_A',
          avatarColor: 'from-emerald-400 to-teal-500',
          text: '¡Totalmente de acuerdo! El hecho de empaquetar Next.js standalone con Nginx en el mismo contenedor para cabeceras de seguridad y caché de archivos estáticos es nivel senior.',
          timestamp: 'Hace 3 horas',
          rating: 12
        }
      ]
    },
    {
      id: 'c3',
      author: 'Luna_Mind',
      avatarColor: 'from-orange-400 to-red-500',
      text: '¿Es mi idea o la música de lofi synthwave se escucha mejor cuando la interfaz tiene esta vibra cibernética? Gran acierto visual.',
      timestamp: 'Hace 6 horas',
      rating: 15,
      userVote: null,
      replies: []
    }
  ],
  'neon-drive': [
    {
      id: 'nd-1',
      author: 'NeonRider',
      avatarColor: 'from-pink-500 to-rose-600',
      text: 'Nada se compara a ver las calles de Shinjuku bajo la lluvia a las 3:00 AM. El complemento de comentarios abajo añade un sentido de comunidad súper acogedor.',
      timestamp: 'Hace 1 día',
      rating: 19,
      userVote: null,
      replies: []
    }
  ],
  'dev-desk': [
    {
      id: 'dd-1',
      author: 'KeyboardEnthusiast',
      avatarColor: 'from-indigo-400 to-purple-600',
      text: 'Ese sonido de los interruptores de teclado lubricados es pura dopamina para programar de noche. ¡Excelente selección!',
      timestamp: 'Hace 12 horas',
      rating: 23,
      userVote: null,
      replies: []
    }
  ],
  'space-journey': [
    {
      id: 'sj-1',
      author: 'Stargazer_X',
      avatarColor: 'from-amber-400 to-orange-500',
      text: 'Visuales perfectos para desconectar el cerebro y entrar en el hiperespacio mientras compilo mis proyectos.',
      timestamp: 'Hace 5 horas',
      rating: 9,
      userVote: null,
      replies: []
    }
  ]
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  // Subtitle & translation states
  const [subtitles, setSubtitles] = useState<Array<{ start: number; end: number; original: string; spanish: string }>>([]);
  const [subtitlesLoading, setSubtitlesLoading] = useState(false);
  const [subtitlesError, setSubtitlesError] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [isPlayingSimulated, setIsPlayingSimulated] = useState(false);
  
  // Custom Video Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState('Música & Chill');
  const [newDescription, setNewDescription] = useState('');
  const [formError, setFormError] = useState('');

  // Comment input State
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [commentSort, setCommentSort] = useState<'rating' | 'newest'>('rating');
  const [commentSearch, setCommentSearch] = useState('');

  // Tab state (Sidebar) - 'videos' | 'telegram' | 'social' | 'nginx' | 'quest' | 'bot'
  const [activeSidebarTab, setActiveSidebarTab] = useState<'videos' | 'telegram' | 'social' | 'nginx' | 'quest' | 'bot'>('videos');
  const [activeGuideTab, setActiveGuideTab] = useState<'render-standard' | 'render-docker' | 'vps'>('render-standard');

  // Server Sync and Logs State
  const [serverLogs, setServerLogs] = useState<any[]>([]);
  const [serverRequests, setServerRequests] = useState<number>(0);
  const [serverStatus, setServerStatus] = useState<string>('HEALTHY');
  const [serverUptime, setServerUptime] = useState<number>(0);
  const [nodeVersion, setNodeVersion] = useState<string>('');
  const [hasTelegramToken, setHasTelegramToken] = useState<boolean>(false);
  const [customBotToken, setCustomBotToken] = useState<string>('');
  const [showRealBotGuide, setShowRealBotGuide] = useState<boolean>(true);
  
  // Simulated Telegram Chat State
  const [simulatedChat, setSimulatedChat] = useState<Array<{ id: string; sender: 'user' | 'bot'; text: string; timestamp: string }>>([
    {
      id: 'msg-init-1',
      sender: 'bot',
      text: '🤖 Hola, soy @Start_vidroxbot. ¡Pregúntame enviando /start o envíame un enlace de video directamente para agregarlo a la Red Nocturna!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [simulatedInput, setSimulatedInput] = useState('');
  const [isSimulatingMessage, setIsSimulatingMessage] = useState(false);
  const [copiedTextType, setCopiedTextType] = useState<string | null>(null);
  
  // UI preferences
  const [cinemaMode, setCinemaMode] = useState(false);
  const [playerHeight, setPlayerHeight] = useState<'standard' | 'tall' | 'cinema'>('standard');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [glowEffect, setGlowEffect] = useState(true);

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Authentication State
  const [currentUser, setCurrentUser] = useState<{ email: string; username: string } | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authRememberMe, setAuthRememberMe] = useState(true);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Invisible Video Ingestion Console State
  const [secretConsoleOpen, setSecretConsoleOpen] = useState(false);
  const [secretInputText, setSecretInputText] = useState('');
  const [secretConsoleError, setSecretConsoleError] = useState('');
  const [secretConsoleSuccess, setSecretConsoleSuccess] = useState('');
  const [typedKeys, setTypedKeys] = useState('');

  // Game & Score System State
  const [score, setScore] = useState<number>(0);
  const [secretsFound, setSecretsFound] = useState<string[]>([]);
  const [questStep, setQuestStep] = useState<number>(0);
  const [showScoreToast, setShowScoreToast] = useState<{ show: boolean; points: number; message: string } | null>(null);

  // Theme helper class name resolver
  const tc = (darkClasses: string, lightClasses: string) => {
    return theme === 'dark' ? darkClasses : lightClasses;
  };

  // Helper to award score points
  const awardPoints = useCallback((points: number, reason: string) => {
    setScore(prev => {
      const nextScore = prev + points;
      localStorage.setItem('nocturnal_score', nextScore.toString());
      return nextScore;
    });
    setShowScoreToast({ show: true, points, message: reason });
    setTimeout(() => {
      setShowScoreToast(null);
    }, 4000);
  }, []);

  // Helper to discover hidden secrets
  const findSecret = (secretId: string, points: number, reason: string) => {
    setSecretsFound(prev => {
      if (prev.includes(secretId)) return prev;
      const nextSecrets = [...prev, secretId];
      localStorage.setItem('nocturnal_secrets', JSON.stringify(nextSecrets));
      // Award points only for first discovery
      awardPoints(points, reason);
      return nextSecrets;
    });
  };

  // Telegram Group Config
  const [telegramUrl, setTelegramUrl] = useState('http://t.me/Start_vidroxbot');
  const [isEditingTelegram, setIsEditingTelegram] = useState(false);
  const [tempTelegramUrl, setTempTelegramUrl] = useState('http://t.me/Start_vidroxbot');

  // Telegram Feed, Chat & Inbox Live States
  const [telegramFeed, setTelegramFeed] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [inboxMessages, setInboxMessages] = useState<any[]>([]);
  const [newTelegramPostText, setNewTelegramPostText] = useState('');
  const [newLiveChatMessageText, setNewLiveChatMessageText] = useState('');
  const [newInboxMessageText, setNewInboxMessageText] = useState('');
  const [activeInboxRecipient, setActiveInboxRecipient] = useState<string>('invitado');
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const autoplayRef = useRef(true);
  useEffect(() => {
    autoplayRef.current = autoplayEnabled;
  }, [autoplayEnabled]);

  // Load state from LocalStorage on mount
  useEffect(() => {
    // Load videos
    const savedVideos = localStorage.getItem('nocturnal_videos');
    let loadedVideos = DEFAULT_VIDEOS;
    if (savedVideos) {
      try {
        const parsed = JSON.parse(savedVideos);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedVideos = parsed;
        }
      } catch (e) {
        console.error('Error loading videos', e);
      }
    }
    
    // Set active video
    const defaultActive = loadedVideos[0] || DEFAULT_VIDEOS[0];

    // Set telegram url if stored
    const savedTelegram = localStorage.getItem('nocturnal_telegram_url');
    let finalTelegram = 'http://t.me/Start_vidroxbot';
    if (savedTelegram) {
      finalTelegram = savedTelegram;
    }

    // Set author name if stored
    const savedAuthor = localStorage.getItem('nocturnal_author_name');
    let finalAuthor = '';
    if (savedAuthor) {
      finalAuthor = savedAuthor;
    } else {
      // Pick a cool random name
      const defaultNames = ['Cyber_Coder', 'Lofi_Nerd', 'Night_Walker', 'Zero_G', 'Neo_Pixel'];
      finalAuthor = defaultNames[Math.floor(Math.random() * defaultNames.length)] + '_' + Math.floor(Math.random() * 100);
    }

    // Check for remembered user sessions
    const savedUserSession = localStorage.getItem('nocturnal_current_user');
    const sessionUserSession = sessionStorage.getItem('nocturnal_current_user');
    let finalCurrentUser = null;
    
    if (savedUserSession) {
      try {
        finalCurrentUser = JSON.parse(savedUserSession);
      } catch (e) {
        console.error('Error parsing saved current user', e);
      }
    } else if (sessionUserSession) {
      try {
        finalCurrentUser = JSON.parse(sessionUserSession);
      } catch (e) {
        console.error('Error parsing session current user', e);
      }
    }

    if (finalCurrentUser) {
      finalAuthor = finalCurrentUser.username;
    }

    // Load Game & Theme State
    const savedTheme = localStorage.getItem('nocturnal_theme');
    let finalTheme: 'light' | 'dark' = 'dark';
    if (savedTheme === 'light' || savedTheme === 'dark') {
      finalTheme = savedTheme;
    }

    const savedScore = localStorage.getItem('nocturnal_score');
    let finalScore = 0;
    if (savedScore) {
      finalScore = parseInt(savedScore, 10) || 0;
    }

    const savedSecrets = localStorage.getItem('nocturnal_secrets');
    let finalSecrets: string[] = [];
    if (savedSecrets) {
      try {
        finalSecrets = JSON.parse(savedSecrets);
      } catch (e) {
        finalSecrets = [];
      }
    }

    const savedQuestStep = localStorage.getItem('nocturnal_quest_step');
    let finalQuestStep = 0;
    if (savedQuestStep) {
      finalQuestStep = parseInt(savedQuestStep, 10) || 0;
    }

    setTimeout(() => {
      setVideos(loadedVideos);
      setActiveVideo(defaultActive);
      setTelegramUrl(finalTelegram);
      setTempTelegramUrl(finalTelegram);
      setAuthorName(finalAuthor);
      setCurrentUser(finalCurrentUser);
      setTheme(finalTheme);
      setScore(finalScore);
      setSecretsFound(finalSecrets);
      setQuestStep(finalQuestStep);
      setMounted(true);
    }, 0);
  }, []);

  // Theme Sync side effect
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('nocturnal_theme', theme);
    if (theme === 'light') {
      document.body.classList.remove('bg-[#050506]', 'text-white');
      document.body.classList.add('bg-[#F3F4F6]', 'text-slate-800');
    } else {
      document.body.classList.remove('bg-[#F3F4F6]', 'text-slate-800');
      document.body.classList.add('bg-[#050506]', 'text-white');
    }
  }, [theme, mounted]);


  // Update comments when active video changes
  useEffect(() => {
    if (!activeVideo) return;
    
    const savedComments = localStorage.getItem(`nocturnal_comments_${activeVideo.id}`);
    let finalComments: Comment[] = [];
    if (savedComments) {
      try {
        finalComments = JSON.parse(savedComments);
      } catch (e) {
        finalComments = [];
      }
    } else {
      // Use initial mock comments or empty array
      const initial = INITIAL_COMMENTS_MAP[activeVideo.id] || [];
      finalComments = initial;
      localStorage.setItem(`nocturnal_comments_${activeVideo.id}`, JSON.stringify(initial));
    }

    setTimeout(() => {
      setComments(finalComments);
    }, 0);
  }, [activeVideo]);

  // Video playback custom controls (seeking, next, previous, play/pause)
  const ytTimeRef = useRef<number>(0);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data === 'string') {
          if (event.data.includes('infoDelivery')) {
            const data = JSON.parse(event.data);
            if (data.event === 'infoDelivery' && data.info) {
              if (typeof data.info.currentTime === 'number') {
                ytTimeRef.current = data.info.currentTime;
              }
              if (typeof data.info.playerState === 'number') {
                const state = data.info.playerState;
                if (state === 1) { // 1 is playing
                  setIsPlaying(true);
                } else if (state === 2) { // 2 is paused
                  setIsPlaying(false);
                } else if (state === 0) { // 0 is ended
                  if (autoplayRef.current) {
                    const btnNext = document.getElementById('btn-next-video');
                    if (btnNext) btnNext.click();
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        // Safe catch for postMessage parse issues
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const togglePlayPause = useCallback(() => {
    const videoEl = document.getElementById('main-video-element') as HTMLVideoElement;
    if (videoEl) {
      const nextPlayState = !isPlaying;
      if (nextPlayState) {
        videoEl.play().catch(() => {});
      } else {
        videoEl.pause();
      }
      setIsPlaying(nextPlayState);
      awardPoints(5, nextPlayState ? 'Video reproducido' : 'Video pausado');
      return;
    }

    const iframe = document.getElementById('main-video-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      const nextPlayState = !isPlaying;
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: nextPlayState ? 'playVideo' : 'pauseVideo',
        args: []
      }), '*');
      setIsPlaying(nextPlayState);
      awardPoints(5, nextPlayState ? 'Video reproducido' : 'Video pausado');
    }
  }, [isPlaying, awardPoints]);

  const handleSeek = useCallback((secondsOffset: number) => {
    const videoEl = document.getElementById('main-video-element') as HTMLVideoElement;
    if (videoEl) {
      const targetTime = Math.max(0, videoEl.currentTime + secondsOffset);
      videoEl.currentTime = targetTime;
      return;
    }

    const iframe = document.getElementById('main-video-iframe') as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      const targetTime = Math.max(0, ytTimeRef.current + secondsOffset);
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'seekTo',
        args: [targetTime, true]
      }), '*');
      ytTimeRef.current = targetTime; // Optimistic update
    }
  }, []);

  const handleNextVideo = useCallback(() => {
    if (videos.length === 0) return;
    const currentIndex = videos.findIndex(v => v.id === activeVideo?.id);
    if (currentIndex === -1) {
      setActiveVideo(videos[0]);
    } else {
      const nextIndex = (currentIndex + 1) % videos.length;
      setActiveVideo(videos[nextIndex]);
    }
  }, [videos, activeVideo]);

  const handlePrevVideo = useCallback(() => {
    if (videos.length === 0) return;
    const currentIndex = videos.findIndex(v => v.id === activeVideo?.id);
    if (currentIndex === -1) {
      setActiveVideo(videos[videos.length - 1]);
    } else {
      const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
      setActiveVideo(videos[prevIndex]);
    }
  }, [videos, activeVideo]);

  // Sync state with server JSON database
  const syncWithServer = useCallback(async () => {
    try {
      const response = await fetch('/api/videos');
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from server");
      }
      const data = await response.json();
      if (data && data.success) {
        setServerLogs(data.logs || []);
        setServerRequests(data.serverRequests || 0);
        setServerStatus(data.status || 'HEALTHY');
        setServerUptime(data.uptime || 0);
        setNodeVersion(data.nodeVersion || '');
        setHasTelegramToken(!!data.hasTelegramToken);

        // Sync new live collections
        if (data.telegramUrl) {
          setTelegramUrl(data.telegramUrl);
        }
        if (Array.isArray(data.telegramFeed)) {
          setTelegramFeed(data.telegramFeed);
        }
        if (Array.isArray(data.chatMessages)) {
          setChatMessages(data.chatMessages);
        }
        if (Array.isArray(data.inboxMessages)) {
          setInboxMessages(data.inboxMessages);
        }

        // If there are videos in the server database, let's merge them into our videos list!
        if (Array.isArray(data.videos) && data.videos.length > 0) {
          setVideos(prev => {
            const merged = [...prev];
            data.videos.forEach((sv: any) => {
              if (!merged.some(v => v.id === sv.id || v.url === sv.url)) {
                merged.push({
                  id: sv.id,
                  title: sv.title,
                  url: sv.url,
                  author: sv.author,
                  category: sv.category,
                  description: sv.description,
                  isCustom: true
                });
              }
            });
            localStorage.setItem('nocturnal_videos', JSON.stringify(merged));
            return merged;
          });
        }
      }
    } catch (error) {
      console.warn('Error syncing with server database:', error);
    }
  }, []);

  // Poll server for live updates every 5 seconds
  useEffect(() => {
    if (!mounted) return;
    
    const runSync = () => {
      syncWithServer();
    };

    setTimeout(runSync, 0);
    const interval = setInterval(runSync, 5000);
    return () => clearInterval(interval);
  }, [mounted, syncWithServer]);

  // Fetch translated subtitles when active video changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!activeVideo) {
        setSubtitles([]);
        setDetectedLanguage('');
        setVideoCurrentTime(0);
        setIsPlayingSimulated(false);
        return;
      }

      setSubtitlesLoading(true);
      setSubtitlesError('');
      setSubtitles([]);
      setVideoCurrentTime(0);
      setIsPlayingSimulated(true);

      fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activeVideo.title,
          description: activeVideo.description || '',
          author: activeVideo.author || '',
          category: activeVideo.category || '',
        }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSubtitles(data.subtitles || []);
            setDetectedLanguage(data.detectedLanguage || 'Desconocido');
          } else {
            setSubtitlesError(data.error || 'No se pudieron generar los subtítulos.');
          }
        })
        .catch(err => {
          console.error('Error al cargar subtítulos:', err);
          setSubtitlesError('Error al conectar con el servicio de traducción de Gemini.');
        })
        .finally(() => {
          setSubtitlesLoading(false);
        });
    }, 0);

    return () => clearTimeout(timer);
  }, [activeVideo]);

  // Simulated playback time increment for iframes or when simulated play is active
  useEffect(() => {
    if (!isPlayingSimulated || !activeVideo || !isPlaying) return;
    
    const isNativeVideo = activeVideo.url.match(/\.(mp4|webm|ogg)($|\?)/i);
    // If it's a native video, we update current time from video elements, not simulated timer.
    if (isNativeVideo) return;

    const interval = setInterval(() => {
      setVideoCurrentTime(prev => {
        if (prev >= 180) {
          return 0;
        }
        return prev + 0.5;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isPlayingSimulated, activeVideo, isPlaying]);

  // Handle Telegram feed postings
  const handleAddTelegramPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTelegramPostText.trim()) return;

    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addTelegramPost',
          senderName: currentUser ? currentUser.username : (authorName || 'Explorador Anónimo'),
          senderUsername: currentUser ? currentUser.username.toLowerCase() : 'anon_nox',
          text: newTelegramPostText.trim()
        })
      });
      if (response.ok) {
        setNewTelegramPostText('');
        syncWithServer();
        awardPoints(15, 'Publicación compartida en el feed de Telegram');
      }
    } catch (err) {
      console.error('Error posting to telegram feed:', err);
    }
  };

  // Handle live community chat messages
  const handleSendLiveChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLiveChatMessageText.trim()) return;

    const senderName = currentUser ? currentUser.username : (authorName || 'Invitado_Nocturno');
    const avatarColors = ['bg-indigo-500', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500', 'bg-cyan-500', 'bg-pink-500'];
    const hash = senderName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color = avatarColors[hash % avatarColors.length];

    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addChatMessage',
          sender: senderName,
          text: newLiveChatMessageText.trim(),
          avatarColor: color
        })
      });
      if (response.ok) {
        setNewLiveChatMessageText('');
        syncWithServer();
        awardPoints(5, 'Mensaje enviado al chat en vivo');
      }
    } catch (err) {
      console.error('Error sending chat message:', err);
    }
  };

  // Handle direct user inbox messages
  const handleSendInboxMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInboxMessageText.trim() || !activeInboxRecipient) return;

    const senderName = currentUser ? currentUser.username : 'invitado';

    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addInboxMessage',
          sender: senderName,
          recipient: activeInboxRecipient,
          text: newInboxMessageText.trim()
        })
      });
      if (response.ok) {
        setNewInboxMessageText('');
        syncWithServer();
        awardPoints(10, 'Mensaje directo enviado exitosamente');

        // To make the inbox highly interactive and fun, let's trigger an automatic simulated response after 2 seconds!
        setTimeout(async () => {
          const replies = [
            `¡Hola! Recibí tu mensaje. Qué buen gusto musical tienes. El video que estamos viendo está espectacular. 🎵`,
            `¡Saludos! Me encanta este canal de videos nocturnos, las vibras de ASMR y Chill son fantásticas.`,
            `Hola, ¿cómo va todo? Gracias por escribirme por privado. Sigamos disfrutando de la transmisión continua. ✨`,
            `¡Excelente mensaje! Acabo de añadir un nuevo video a la cola de reproducción. ¡Cuéntame qué te parece!`
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];

          await fetch('/api/videos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'addInboxMessage',
              sender: activeInboxRecipient,
              recipient: senderName,
              text: randomReply
            })
          });
          syncWithServer();
        }, 2000);
      }
    } catch (err) {
      console.error('Error sending direct message:', err);
    }
  };

  // Process raw input (link or embed code) from invisible source
  const processInvisibleVideoInput = useCallback((rawInput: string): boolean => {
    if (!rawInput || !rawInput.trim()) return false;
    
    let url = rawInput.trim();
    let extractedTitle = '';

    // Check if it's iframe code
    if (url.includes('<iframe') || url.includes('src=')) {
      const srcMatch = url.match(/src=["']([^"']+)["']/i);
      if (srcMatch && srcMatch[1]) {
        url = srcMatch[1];
      }
      const titleMatch = url.match(/title=["']([^"']+)["']/i);
      if (titleMatch && titleMatch[1]) {
        extractedTitle = titleMatch[1];
      }
    }

    const embedUrl = getEmbedUrl(url);
    if (!embedUrl) {
      return false;
    }

    const isYoutube = embedUrl.includes('youtube.com') || embedUrl.includes('youtu.be') || embedUrl.includes('youtube-nocookie.com');
    const isVimeo = embedUrl.includes('vimeo.com') || embedUrl.includes('player.vimeo.com');
    const isStandardHttp = embedUrl.startsWith('http://') || embedUrl.startsWith('https://');

    if (!isYoutube && !isVimeo && !isStandardHttp) {
      return false;
    }

    const finalTitle = extractedTitle || `Vídeo Secreto #${Date.now().toString().slice(-4)}`;
    
    // POST to server database to persist
    fetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: finalTitle,
        url: embedUrl,
        author: currentUser ? currentUser.username : (authorName || 'Explorador Nocturno'),
        category: 'Infiltrado / Secreto 🔒',
        description: 'Video integrado mediante canal invisible de inyección directa.'
      })
    }).then(res => {
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }
      return res.json();
    })
      .then(data => {
        if (data && data.success) {
          syncWithServer();
        }
      }).catch(err => console.warn('Error saving video server-side:', err));

    setVideos(prev => {
      const title = finalTitle;
      
      const newVideo: Video = {
        id: 'custom-' + Date.now(),
        title: title,
        url: embedUrl,
        author: currentUser ? currentUser.username : (authorName || 'Explorador Nocturno'),
        category: 'Infiltrado / Secreto 🔒',
        description: 'Video integrado mediante canal invisible de inyección directa.',
        isCustom: true
      };

      const updatedVideos = [...prev, newVideo];
      localStorage.setItem('nocturnal_videos', JSON.stringify(updatedVideos));
      
      // Select newly added video
      setActiveVideo(newVideo);
      
      // Highlight secret with score points!
      setTimeout(() => {
        awardPoints(120, `¡Inyección directa exitosa! Vídeo: ${title}`);
      }, 100);

      return updatedVideos;
    });

    return true;
  }, [currentUser, authorName, syncWithServer, awardPoints]);

  // Handle direct secret submission
  const handleSecretConsoleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSecretConsoleError('');
    setSecretConsoleSuccess('');

    if (!secretInputText.trim()) {
      setSecretConsoleError('Por favor ingresa un enlace o código embed de iframe.');
      return;
    }

    const success = processInvisibleVideoInput(secretInputText);
    if (success) {
      setSecretConsoleSuccess('¡Vídeo secreto inyectado con éxito!');
      setSecretInputText('');
      setTimeout(() => {
        setSecretConsoleOpen(false);
        setSecretConsoleSuccess('');
      }, 1500);
    } else {
      setSecretConsoleError('No se pudo procesar. Asegúrate de que sea un enlace o código embed válido.');
    }
  }, [secretInputText, processInvisibleVideoInput]);

  // Invisible code/key detection and global paste trigger
  useEffect(() => {
    if (!mounted) return;

    // Detect secret keyword (cheat code) "nocturna" or "video" or "embed"
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement as HTMLElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
        return;
      }

      if (e.key && e.key.length === 1) {
        setTypedKeys(prev => {
          const next = (prev + e.key.toLowerCase()).slice(-15);
          if (next.includes('nocturna') || next.includes('secreto') || next.includes('video') || next.includes('embed')) {
            setSecretConsoleOpen(true);
            setSecretConsoleError('');
            setSecretConsoleSuccess('');
            setSecretInputText('');
            awardPoints(25, '¡Canal de inyección activado por comando de teclado!');
            return '';
          }
          return next;
        });
      }

      // Also listen for a specific key combination (Alt + P) when not typing
      if (e.altKey && (e.key === 'p' || e.key === 'P' || e.key === 'π')) {
        e.preventDefault();
        setSecretConsoleOpen(true);
        setSecretConsoleError('');
        setSecretConsoleSuccess('');
        setSecretInputText('');
        awardPoints(15, 'Consola secreta abierta mediante atajo Alt+P');
      }

      // Keyboard shortcuts for video controls
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSeek(10);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSeek(-10);
      } else if (e.key === 'n' || e.key === 'N') {
        if (!e.ctrlKey && !e.altKey && !e.metaKey) {
          e.preventDefault();
          handleNextVideo();
        }
      } else if (e.key === 'b' || e.key === 'B') {
        if (!e.ctrlKey && !e.altKey && !e.metaKey) {
          e.preventDefault();
          handlePrevVideo();
        }
      } else if (e.key === 'm' || e.key === 'M') {
        if (!e.ctrlKey && !e.altKey && !e.metaKey) {
          e.preventDefault();
          setCinemaMode(c => !c);
        }
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.getAttribute('contenteditable') === 'true')) {
          return;
        }
        e.preventDefault();
        togglePlayPause();
      }
    };

    // Global paste listener when not focusing input elements
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const activeEl = document.activeElement as HTMLElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) {
        return;
      }

      const text = e.clipboardData?.getData('text') || '';
      if (!text) return;

      const success = processInvisibleVideoInput(text);
      if (success) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('paste', handleGlobalPaste);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('paste', handleGlobalPaste);
    };
  }, [mounted, processInvisibleVideoInput, handleSeek, handleNextVideo, handlePrevVideo, setCinemaMode, togglePlayPause, awardPoints]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#07080a] text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
          <span className="font-mono text-sm tracking-widest text-cyan-400">CARGANDO AMBIENTE NOCTURNO...</span>
        </div>
      </div>
    );
  }

  // Helper to parse standard watch URLs to Embed URLs
  function getEmbedUrl(url: string): string {
    if (!url) return '';
    const trimmed = url.trim();
    
    // Support iframe code directly
    if (trimmed.includes('<iframe') || trimmed.includes('src=')) {
      const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
      if (srcMatch && srcMatch[1]) {
        return srcMatch[1];
      }
    }

    if (trimmed.includes('/embed/') || trimmed.includes('player.vimeo.com/video/')) {
      if (trimmed.includes('youtube.com') && !trimmed.includes('enablejsapi=1')) {
        return trimmed.includes('?') ? `${trimmed}&enablejsapi=1` : `${trimmed}?enablejsapi=1`;
      }
      return trimmed;
    }
    
    // YouTube Shorts support
    if (trimmed.includes('/shorts/')) {
      const parts = trimmed.split('/shorts/');
      if (parts[1]) {
        const id = parts[1].split(/[?&#]/)[0];
        if (id && id.length === 11) {
          return `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&modestbranding=1&enablejsapi=1`;
        }
      }
    }

    // YouTube standard watch URL
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = trimmed.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=0&modestbranding=1&enablejsapi=1`;
    }
    
    // Vimeo standard
    regExp = /^.*(vimeo\.com\/)((channels\/[a-z]+\/)|(groups\/[a-z]+\/videos\/)|(album\/\d+\/video\/))?(\d+)?.*/;
    match = trimmed.match(regExp);
    if (match && match[6]) {
      return `https://player.vimeo.com/video/${match[6]}?autoplay=1`;
    }

    // Twitch support
    if (trimmed.includes('twitch.tv/')) {
      const parts = trimmed.split('twitch.tv/');
      if (parts[1]) {
        const channelOrVideo = parts[1].split(/[?&#]/)[0];
        if (channelOrVideo) {
          const isTwitchVideo = channelOrVideo.startsWith('videos/');
          if (isTwitchVideo) {
            const videoId = channelOrVideo.substring(7);
            return `https://player.twitch.tv/?video=${videoId}&parent=${window.location.hostname}&autoplay=true`;
          } else {
            return `https://player.twitch.tv/?channel=${channelOrVideo}&parent=${window.location.hostname}&autoplay=true`;
          }
        }
      }
    }
    
    return trimmed;
  }

  // Handle User Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const emailTrim = authEmail.trim().toLowerCase();
    const usernameTrim = authUsername.trim();
    const password = authPassword;

    // Basic validation
    if (!emailTrim || !usernameTrim || !password) {
      setAuthError('Todos los campos son obligatorios.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(emailTrim)) {
      setAuthError('Formato de correo electrónico no válido.');
      return;
    }

    if (usernameTrim.length < 3) {
      setAuthError('El usuario debe tener al menos 3 caracteres.');
      return;
    }

    if (password.length < 6) {
      setAuthError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // Load users from localStorage
    const usersJson = localStorage.getItem('nocturnal_registered_users');
    let users: any[] = [];
    if (usersJson) {
      try {
        users = JSON.parse(usersJson);
      } catch (e) {
        users = [];
      }
    }

    // Check if email already registered
    if (users.some((u: any) => u.email === emailTrim)) {
      setAuthError('Este correo electrónico ya está registrado.');
      return;
    }

    // Check if username already taken
    if (users.some((u: any) => u.username.toLowerCase() === usernameTrim.toLowerCase())) {
      setAuthError('Este nombre de usuario ya está en uso.');
      return;
    }

    // Create new user object
    const newUser = {
      email: emailTrim,
      username: usernameTrim,
      password: password,
      registeredAt: new Date().toISOString()
    };

    // Save back to localStorage
    users.push(newUser);
    localStorage.setItem('nocturnal_registered_users', JSON.stringify(users));

    // Set active session
    const sessionUser = { email: emailTrim, username: usernameTrim };
    if (authRememberMe) {
      localStorage.setItem('nocturnal_current_user', JSON.stringify(sessionUser));
    } else {
      sessionStorage.setItem('nocturnal_current_user', JSON.stringify(sessionUser));
    }

    setCurrentUser(sessionUser);
    setAuthorName(usernameTrim);
    localStorage.setItem('nocturnal_author_name', usernameTrim);

    setAuthSuccess('¡Registro completado con éxito!');
    
    // Reward points!
    awardPoints(150, '¡Bienvenido a la Red Nocturna! Perfil registrado');

    // Reset fields
    setAuthEmail('');
    setAuthUsername('');
    setAuthPassword('');

    setTimeout(() => {
      setAuthModalOpen(false);
      setAuthSuccess('');
    }, 1500);
  };

  // Handle User Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const emailTrim = authEmail.trim().toLowerCase();
    const password = authPassword;

    if (!emailTrim || !password) {
      setAuthError('Por favor, introduce el correo electrónico y la contraseña.');
      return;
    }

    // Load registered users
    const usersJson = localStorage.getItem('nocturnal_registered_users');
    let users: any[] = [];
    if (usersJson) {
      try {
        users = JSON.parse(usersJson);
      } catch (e) {
        users = [];
      }
    }

    // Find user
    const foundUser = users.find((u: any) => u.email === emailTrim && u.password === password);
    if (!foundUser) {
      setAuthError('Correo electrónico o contraseña incorrectos.');
      return;
    }

    // Success login
    const sessionUser = { email: foundUser.email, username: foundUser.username };
    if (authRememberMe) {
      localStorage.setItem('nocturnal_current_user', JSON.stringify(sessionUser));
    } else {
      sessionStorage.setItem('nocturnal_current_user', JSON.stringify(sessionUser));
    }

    setCurrentUser(sessionUser);
    setAuthorName(foundUser.username);
    localStorage.setItem('nocturnal_author_name', foundUser.username);

    setAuthSuccess('¡Sesión iniciada con éxito!');
    
    // Quick notification points!
    awardPoints(50, 'Sesión iniciada correctamente');

    // Reset fields
    setAuthEmail('');
    setAuthPassword('');

    setTimeout(() => {
      setAuthModalOpen(false);
      setAuthSuccess('');
    }, 1500);
  };

  // Handle User Logout
  const handleLogout = () => {
    localStorage.removeItem('nocturnal_current_user');
    sessionStorage.removeItem('nocturnal_current_user');
    setCurrentUser(null);
    
    // Pick a cool random name as guest fallback
    const defaultNames = ['Cyber_Coder', 'Lofi_Nerd', 'Night_Walker', 'Zero_G', 'Neo_Pixel'];
    const newGuestName = defaultNames[Math.floor(Math.random() * defaultNames.length)] + '_' + Math.floor(Math.random() * 100);
    setAuthorName(newGuestName);
    localStorage.setItem('nocturnal_author_name', newGuestName);
    
    // Notify user
    awardPoints(10, 'Sesión cerrada. Ahora eres un invitado');
  };

  // Handle Adding custom video
  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newTitle.trim()) {
      setFormError('Por favor ingresa un título descriptivo.');
      return;
    }
    if (!newUrl.trim()) {
      setFormError('Por favor ingresa un enlace de video (YouTube, Vimeo, etc).');
      return;
    }

    const embedUrl = getEmbedUrl(newUrl);
    if (!embedUrl) {
      setFormError('Enlace inválido. Asegúrate de que sea un video de YouTube, Vimeo o un embed directo.');
      return;
    }

    const newVideo: Video = {
      id: 'custom-' + Date.now(),
      title: newTitle.trim(),
      url: embedUrl,
      author: authorName || 'Creador Anónimo',
      category: newCategory,
      description: newDescription.trim() || 'Video guardado en la colección local del usuario.',
      isCustom: true
    };

    // POST to server database to persist
    fetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newTitle.trim(),
        url: embedUrl,
        author: authorName || 'Creador Anónimo',
        category: newCategory,
        description: newDescription.trim() || 'Video guardado en la colección local del usuario.'
      })
    }).then(res => {
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }
      return res.json();
    })
      .then(data => {
        if (data && data.success) {
          syncWithServer();
        }
      }).catch(err => console.warn('Error saving video server-side:', err));

    const updatedVideos = [...videos, newVideo];
    setVideos(updatedVideos);
    localStorage.setItem('nocturnal_videos', JSON.stringify(updatedVideos));
    
    // Reset Form
    setNewTitle('');
    setNewUrl('');
    setNewDescription('');
    setShowAddForm(false);
    
    // Select the new video
    setActiveVideo(newVideo);
  };

  // Handle Deleting custom video
  const handleDeleteVideo = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid selecting the deleted video
    
    const updatedVideos = videos.filter(v => v.id !== id);
    setVideos(updatedVideos);
    localStorage.setItem('nocturnal_videos', JSON.stringify(updatedVideos));
    
    // If the active video was deleted, switch to the first default video
    if (activeVideo?.id === id) {
      setActiveVideo(updatedVideos[0] || DEFAULT_VIDEOS[0]);
    }
  };

  // Save current comments list to localStorage
  const saveComments = (newComments: Comment[]) => {
    if (!activeVideo) return;
    setComments(newComments);
    localStorage.setItem(`nocturnal_comments_${activeVideo.id}`, JSON.stringify(newComments));
  };

  // Handle adding a top-level comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    // Save author name in preferences
    const finalAuthor = authorName.trim() || 'AnonDev';
    localStorage.setItem('nocturnal_author_name', finalAuthor);

    const avatarColors = [
      'from-cyan-400 to-blue-500',
      'from-purple-500 to-pink-500',
      'from-rose-500 to-amber-500',
      'from-emerald-400 to-teal-500',
      'from-violet-500 to-fuchsia-600',
      'from-amber-400 to-orange-500'
    ];
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const newComment: Comment = {
      id: 'comment-' + Date.now(),
      author: finalAuthor,
      avatarColor: randomColor,
      text: commentText.trim(),
      timestamp: 'Justo ahora',
      rating: 1,
      userVote: 'up', // Starts with author vote
      replies: []
    };

    const updatedComments = [newComment, ...comments];
    saveComments(updatedComments);
    setCommentText('');
  };

  // Handle upvoting/downvoting a comment
  const handleVote = (commentId: string, direction: 'up' | 'down') => {
    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        let voteDiff = 0;
        let nextVote: 'up' | 'down' | null = null;

        if (c.userVote === direction) {
          // Cancel vote
          voteDiff = direction === 'up' ? -1 : 1;
          nextVote = null;
        } else {
          // Change or apply vote
          if (c.userVote === null) {
            voteDiff = direction === 'up' ? 1 : -1;
          } else {
            // Swapping upvote <-> downvote
            voteDiff = direction === 'up' ? 2 : -2;
          }
          nextVote = direction;
        }

        return {
          ...c,
          rating: c.rating + voteDiff,
          userVote: nextVote
        };
      }
      return c;
    });

    saveComments(updatedComments);
  };

  // Handle adding a reply to a comment
  const handleAddReply = (commentId: string) => {
    const text = replyText[commentId];
    if (!text || !text.trim()) return;

    const finalAuthor = authorName.trim() || 'AnonDev';
    localStorage.setItem('nocturnal_author_name', finalAuthor);

    const avatarColors = [
      'from-emerald-400 to-teal-500',
      'from-indigo-400 to-purple-600',
      'from-yellow-400 to-orange-500'
    ];
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const newReply: Reply = {
      id: 'reply-' + Date.now(),
      author: finalAuthor,
      avatarColor: randomColor,
      text: text.trim(),
      timestamp: 'Justo ahora',
      rating: 1
    };

    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [...c.replies, newReply]
        };
      }
      return c;
    });

    saveComments(updatedComments);
    setReplyText(prev => ({ ...prev, [commentId]: '' }));
    setActiveReplyId(null);
  };

  // Helper to copy configs to clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextType(type);
    setTimeout(() => {
      setCopiedTextType(null);
    }, 2000);
  };

  // Filters and sorts comments
  const filteredComments = comments
    .filter(c => {
      if (!commentSearch) return true;
      const search = commentSearch.toLowerCase();
      return (
        c.text.toLowerCase().includes(search) || 
        c.author.toLowerCase().includes(search) ||
        c.replies.some(r => r.text.toLowerCase().includes(search) || r.author.toLowerCase().includes(search))
      );
    })
    .sort((a, b) => {
      if (commentSort === 'rating') {
        return b.rating - a.rating;
      } else {
        // "Justo ahora" elements first, crude sorting by timestamp/id
        return b.id.localeCompare(a.id);
      }
    });

  // Configurations for Nginx & Render
  const NGINX_CONF = `# /etc/nginx/nginx.conf
# Configuración optimizada de Proxy Inverso para Render & Next.js Standalone
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Ocultar versión de nginx por seguridad
    server_tokens off;

    # Logs de producción compactos
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log warn;

    sendfile        on;
    tcp_nopush      on;
    keepalive_timeout  65;

    # Compresión GZIP de alta respuesta
    gzip on;
    gzip_disable "msie6";
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Redirección e Integración de Proxy Inverso Premium
    server {
        # Render expone PORT dinámicamente; por defecto Nginx debe escuchar en el puerto solicitado
        listen 80;
        server_name localhost;

        # Cabeceras de Seguridad Profesional (OWASP Compliance)
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval';" always;

        # Proxy Reverso hacia Next.js Standalone corriendo en puerto 3000
        location / {
            proxy_pass http://127.0.0.1:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Cacheo de archivos estáticos optimizado para Next.js
        location /_next/static/ {
            proxy_pass http://127.0.0.1:3000;
            proxy_cache_valid 200 30d;
            expires 30d;
            access_log off;
        }

        # Manejo de error 502/504 elegante
        error_page 502 /502.html;
        location = /502.html {
            root /usr/share/nginx/html;
            internal;
        }
    }
}`;

  const DOCKERFILE = `# Dockerfile - Despliegue Premium con Next.js + Nginx en un solo Contenedor

# --- FASE 1: Dependencias de Construcción ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- FASE 2: Compilación Standalone ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- FASE 3: Contenedor Final Combinado ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Instalar Nginx y Supervisor para orquestar ambos procesos
RUN apk add --no-cache nginx supervisor

# Crear directorios y mapear Next.js standalone
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Configurar Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Crear archivo 502 de cortesía para Nginx
RUN mkdir -p /usr/share/nginx/html && \\
    echo '<div style="background:#090a0f;color:#e2e8f0;padding:4rem;text-align:center;font-family:sans-serif;height:100vh;display:flex;flex-direction:column;justify-content:center;"><h1>Iniciando Servidor</h1><p style="color:#a0aec0">La aplicación Next.js se está levantando. El proxy inverso Nginx conectará en unos segundos...</p></div>' > /usr/share/nginx/html/502.html

# Configurar Supervisor para Next.js y Nginx
COPY supervisord.conf /etc/supervisord.conf

# Exponer el puerto 80 que escucha Nginx
EXPOSE 80

# Iniciar procesos concurrentemente
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]`;

  const SUPERVISORD_CONF = `# supervisord.conf
[supervisord]
nodaemon=true
user=root
logfile=/var/log/supervisord.log
pidfile=/var/run/supervisord.pid

[program:nextjs]
command=node server.js
directory=/app
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:nginx]
command=nginx -g "daemon off;"
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0`;

  const RENDER_YAML = `# render.yaml - Blueprint de Despliegue en Render
services:
  - type: web
    name: nocturnal-player-proxy
    env: docker
    dockerfilePath: Dockerfile
    plan: free # Apto para el plan gratis de Render
    envVars:
      - key: GEMINI_API_KEY
        sync: false # Configurar el secreto en el panel de control de Render
      - key: APP_URL
        value: https://nocturnal-player.onrender.com # Tu URL final asignada
`;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${tc('bg-[#050506] text-white', 'bg-[#F3F4F6] text-slate-800')}`}>
      
      {/* Dynamic Ambient Background Glow (Glow Effect behind active video) */}
      {glowEffect && !cinemaMode && theme === 'dark' && (
        <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none z-0"></div>
      )}
      {glowEffect && !cinemaMode && theme === 'dark' && (
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
      )}

      {/* TOP DECORATIVE HEADER (Professional Polish Nav Bar) */}
      <header className={`border-b sticky top-0 z-50 transition-colors duration-300 ${tc('border-white/10 bg-[#0A0A0B]', 'border-slate-200 bg-white')}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo and Brand */}
            <div 
              className="flex items-center gap-3 cursor-pointer select-none"
              onDoubleClick={() => {
                setSecretConsoleOpen(true);
                setSecretConsoleError('');
                setSecretConsoleSuccess('');
                setSecretInputText('');
                awardPoints(35, '¡Has descubierto la puerta de inyección secreta haciendo doble clic en el logotipo!');
              }}
              title="Doble clic para activar canal de inyección directa"
            >
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`font-bold text-lg tracking-tight block ${tc('text-white', 'text-slate-900')}`}>
                  NOCTURNA <span className="text-blue-500">PRO</span>
                </span>
                {/* Secret 1: Pulsing sparkles icon */}
                <button
                  type="button"
                  onClick={() => findSecret('header-star', 50, 'Estrella de Anomalía de Red')}
                  className={`p-1 rounded-full transition-all duration-300 ${
                    secretsFound.includes('header-star')
                      ? 'text-yellow-500 hover:scale-110'
                      : 'text-blue-500/30 hover:text-yellow-400 hover:scale-125 animate-pulse'
                  }`}
                  title={secretsFound.includes('header-star') ? '¡Anomalía resuelta! (+50 PTS)' : '¿Qué es este brillo de red?'}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick stats / Deployment status indicators */}
            <div className="hidden lg:flex gap-2">
              <div className={`px-3 py-1 border rounded text-[10px] uppercase tracking-widest font-semibold ${tc('bg-white/5 border-white/10 text-white/70', 'bg-slate-100 border-slate-200 text-slate-600')}`}>
                Deploy: Render
              </div>
              <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 rounded text-[10px] uppercase tracking-widest font-semibold">
                Nginx: Up
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live Interactive Scoreboard */}
            <div className={`flex items-center gap-2 border px-3 py-1.5 rounded-xl transition-all ${
              tc('bg-yellow-500/10 border-yellow-500/20 text-yellow-400', 'bg-amber-100 border-amber-200 text-amber-800')
            }`} title="Tu puntuación de juego actual">
              <Trophy className="w-4 h-4 text-amber-500 animate-bounce" />
              <div className="flex flex-col text-left">
                <span className="text-[8px] uppercase tracking-wider opacity-60 font-mono leading-none">PUNTUACIÓN</span>
                <span className="text-xs font-bold font-mono leading-none mt-0.5">{score} PTS</span>
              </div>
            </div>

            {/* User Session and Authentication Badge */}
            {currentUser ? (
              <div className={`flex items-center gap-2 border rounded-xl px-3 py-1.5 transition-all ${tc('bg-blue-500/5 border-blue-500/20 text-blue-300', 'bg-blue-50 border-blue-200 text-blue-800')}`}>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="hidden md:inline text-[10px] font-mono opacity-70">Sesión:</span>
                <span className="text-xs font-semibold font-mono tracking-wide max-w-[90px] truncate" title={currentUser.username}>{currentUser.username}</span>
                <button
                  onClick={handleLogout}
                  className={`ml-1 p-1 rounded hover:bg-red-500/10 text-red-400 hover:text-red-500 transition-colors`}
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Guest nickname Indicator */}
                <div className={`hidden sm:flex items-center gap-2 border rounded-xl px-3 py-1.5 ${tc('bg-white/5 border-white/10', 'bg-slate-100 border-slate-200')}`}>
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                  <span className={`text-[10px] font-mono ${tc('text-white/40', 'text-slate-400')}`}>Invitado:</span>
                  <input 
                    type="text" 
                    value={authorName} 
                    onChange={(e) => {
                      setAuthorName(e.target.value);
                      localStorage.setItem('nocturnal_author_name', e.target.value);
                    }}
                    placeholder="Tu usuario..."
                    className={`bg-transparent text-xs font-semibold focus:outline-none w-20 text-left border-b border-transparent focus:border-blue-500 ${tc('text-blue-400 hover:border-white/20', 'text-blue-600 hover:border-slate-300')}`}
                  />
                </div>
                
                {/* Access Button */}
                <button
                  onClick={() => {
                    setAuthTab('login');
                    setAuthError('');
                    setAuthSuccess('');
                    setAuthModalOpen(true);
                  }}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-all ${
                    tc('bg-blue-600 hover:bg-blue-700 text-white border-blue-500/30 shadow-md shadow-blue-600/10', 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500/30')
                  }`}
                  title="Iniciar Sesión"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Entrar</span>
                </button>
              </div>
            )}

            {/* Cinema Mode Switch */}
            <button 
              id="btn-cinema"
              onClick={() => setCinemaMode(!cinemaMode)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border transition-all ${
                cinemaMode 
                  ? tc('bg-blue-600/20 text-blue-300 border-blue-500/40 font-medium', 'bg-blue-100 text-blue-700 border-blue-300 font-medium') 
                  : tc('bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/10', 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200')
              }`}
              title="Alternar Modo Cine"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{cinemaMode ? 'Salir Cine' : 'Modo Cine'}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              id="btn-theme-toggle"
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border transition-all ${
                tc(
                  'bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/10',
                  'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                )
              }`}
              title="Alternar Modo Claro / Oscuro"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="hidden sm:inline">Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Modo Oscuro</span>
                </>
              )}
            </button>

            {/* Telegram Link Button with Live Customizer */}
            <div className="relative flex items-center gap-1">
              <a 
                href={telegramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-[#229ED9]/30 bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9]/25 hover:border-[#229ED9]/50 transition-all font-semibold"
                title="Unirse al canal o grupo de Telegram"
              >
                <Send className="w-3.5 h-3.5 rotate-45 text-[#229ED9]" />
                <span className="hidden md:inline">Telegram</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setTempTelegramUrl(telegramUrl);
                  setIsEditingTelegram(!isEditingTelegram);
                }}
                className={`p-1.5 rounded border transition-all ${
                  isEditingTelegram 
                    ? tc('bg-blue-600/20 text-blue-400 border-blue-500/40', 'bg-blue-100 text-blue-700 border-blue-300') 
                    : tc('bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10', 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800')
                }`}
                title="Configurar enlace de Telegram"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>

              {/* Dynamic Telegram URL configuration popover */}
              <AnimatePresence>
                {isEditingTelegram && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 top-11 z-50 border p-3 rounded-lg shadow-xl w-64 flex flex-col gap-2.5 ${tc('bg-[#0A0A0B] border-white/10', 'bg-white border-slate-200')}`}
                  >
                    <div>
                      <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest block mb-1">Enlace de Telegram</span>
                      <input
                        type="text"
                        value={tempTelegramUrl}
                        onChange={(e) => setTempTelegramUrl(e.target.value)}
                        placeholder="https://t.me/TuGrupo..."
                        className="w-full bg-[#050506] border border-white/10 rounded p-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => setIsEditingTelegram(false)}
                        className="px-2.5 py-1 text-[11px] text-white/60 hover:text-white bg-white/5 rounded hover:bg-white/10 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          let finalUrl = tempTelegramUrl.trim();
                          if (finalUrl && !finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
                            finalUrl = 'https://' + finalUrl;
                          }
                          setTelegramUrl(finalUrl || 'http://t.me/Start_vidroxbot');
                          localStorage.setItem('nocturnal_telegram_url', finalUrl || 'http://t.me/Start_vidroxbot');
                          setIsEditingTelegram(false);
                        }}
                        className="px-2.5 py-1 text-[11px] bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
                      >
                        Guardar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Professional Profile Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border border-white/20 hidden xs:block"></div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: PLAYER & COMMENTS */}
        <div className={`transition-all duration-500 ${cinemaMode ? 'lg:col-span-12' : 'lg:col-span-8'} flex flex-col gap-6`}>
          
          {/* VIDEO STAGE */}
          <div className="relative group">
            {/* Ambient Lighting Behind Active Player (Dynamic glow) */}
            {glowEffect && theme === 'dark' && (
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>
            )}
            
            <div className={`relative z-10 w-full rounded-2xl overflow-hidden bg-black border flex flex-col justify-between shadow-2xl transition-all duration-500 ${
              playerHeight === 'tall' 
                ? 'h-[280px] xs:h-[360px] sm:h-[520px]' 
                : playerHeight === 'cinema' 
                  ? 'h-[320px] xs:h-[420px] sm:h-[650px]' 
                  : 'aspect-video'
            } ${tc('border-white/10', 'border-slate-300')}`}>
              {activeVideo ? (
                activeVideo.url.match(/\.(mp4|webm|ogg)($|\?)/i) ? (
                  <video
                    id="main-video-element"
                    src={activeVideo.url}
                    controls
                    autoPlay
                    onEnded={() => {
                      if (autoplayRef.current) {
                        const btnNext = document.getElementById('btn-next-video');
                        if (btnNext) btnNext.click();
                      }
                    }}
                    onTimeUpdate={(e) => setVideoCurrentTime((e.target as HTMLVideoElement).currentTime)}
                    className="w-full h-full object-contain"
                    style={{ background: 'black' }}
                  />
                ) : (
                  <iframe
                    id="main-video-iframe"
                    src={activeVideo.url}
                    title={activeVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white/50">
                  <Play className="w-12 h-12 text-white/20 mb-2 animate-bounce" />
                  <p>Selecciona un video de la barra lateral para reproducir.</p>
                </div>
              )}

              {/* Subtitle overlay inside the video player */}
              {activeVideo && subtitlesEnabled && (
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 w-11/12 max-w-2xl px-4 text-center pointer-events-none select-none">
                  {subtitlesLoading ? (
                    <div className="inline-block bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-[11px] font-mono text-cyan-400 animate-pulse shadow-2xl">
                      ⚡ Traduciendo y sincronizando subtítulos al español con Gemini IA...
                    </div>
                  ) : subtitlesError ? (
                    <div className="inline-block bg-red-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-red-500/20 text-[11px] text-red-300 shadow-2xl">
                      ⚠️ {subtitlesError}
                    </div>
                  ) : (
                    (() => {
                      const currentSub = subtitles.find(
                        s => videoCurrentTime >= s.start && videoCurrentTime <= s.end
                      );
                      if (!currentSub) return null;
                      return (
                        <div className="inline-flex flex-col items-center gap-1.5 transition-all duration-200">
                          {/* Original line indicator */}
                          {detectedLanguage && detectedLanguage.toLowerCase() !== 'español' && (
                            <span className="bg-black/50 backdrop-blur-sm text-white/50 text-[10px] sm:text-xs font-sans px-2.5 py-0.5 rounded-md italic">
                              [{detectedLanguage}]: {currentSub.original}
                            </span>
                          )}
                          {/* Spanish Translation line */}
                          <span className="bg-black/85 backdrop-blur-md text-white text-sm sm:text-base md:text-lg font-medium px-4 py-2 rounded-xl border border-white/10 shadow-2xl tracking-wide">
                            {currentSub.spanish}
                          </span>
                        </div>
                      );
                    })()
                  )}
                </div>
              )}
            </div>
          </div>

          {/* PLAYBACK TIP & ORIGINAL LINK (TROUBLESHOOTER) */}
          {activeVideo && (
            <div className={`mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl border text-xs transition-all ${
              tc('bg-[#0E0F12]/80 border-white/5 text-white/70', 'bg-slate-50 border-slate-200 text-slate-600')
            }`}>
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <p className="leading-relaxed">
                  💡 <strong>¿No reproduce o sale error?</strong> Los navegadores modernos a veces bloquean la reproducción automática o restringen embeds de YouTube dentro de la vista previa de AI Studio. Haz clic en el reproductor para activarlo, usa los controles de abajo o pulsa en <strong>Ver Original</strong>.
                </p>
              </div>
              <a 
                href={activeVideo.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/25 transition-all shrink-0 uppercase tracking-wider"
              >
                <span>Ver Original</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* VIDEO CONTROLS: PLAYBACK SPEED, JUMP, & RESIZING (CONSOLA EN PANTALLA) */}
          {activeVideo && (
            <div 
              id="player-control-deck"
              className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 shadow-lg ${
                tc('bg-[#0E0F12]/90 border-white/10 text-white', 'bg-white border-slate-200 text-slate-800')
              }`}
            >
              {/* LEFT SIDE: SKIP & PLAYHEAD STEPPING */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
                <div className="flex items-center gap-1.5">
                  <button
                    id="btn-skip-prev"
                    onClick={handlePrevVideo}
                    className={`p-2 rounded-lg border transition-all ${
                      tc('bg-white/5 border-white/10 hover:bg-white/10 text-white/80 hover:text-white', 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700 hover:text-slate-900')
                    }`}
                    title="Video Anterior (Atajo: B)"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    id="btn-seek-backward"
                    onClick={() => handleSeek(-10)}
                    className={`px-3 py-2 rounded-lg border flex items-center gap-1.5 text-xs font-mono transition-all ${
                      tc('bg-white/5 border-white/10 hover:bg-white/10 text-white/80 hover:text-white', 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700 hover:text-slate-900')
                    }`}
                    title="Retroceder 10 segundos (Atajo: Flecha Izquierda)"
                  >
                    <Rewind className="w-3.5 h-3.5" />
                    <span>-10s</span>
                  </button>
                </div>

                {/* PLAY / PAUSE BUTTON */}
                <button
                  id="btn-play-pause-toggle"
                  onClick={togglePlayPause}
                  className={`px-3 py-2 rounded-lg border flex items-center gap-1.5 text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-sm ${
                    isPlaying
                      ? tc('bg-red-500/15 border-red-500/25 text-red-400 hover:bg-red-500/25', 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100')
                      : tc('bg-emerald-500/15 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25', 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100')
                  }`}
                  title={isPlaying ? "Pausar Video (Atajo: Espacio)" : "Reproducir Video (Atajo: Espacio)"}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span className="hidden sm:inline">Pausar</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span className="hidden sm:inline">Reprod.</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    id="btn-seek-forward"
                    onClick={() => handleSeek(10)}
                    className={`px-3 py-2 rounded-lg border flex items-center gap-1.5 text-xs font-mono transition-all ${
                      tc('bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20', 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100')
                    }`}
                    title="Adelantar 10 segundos (Atajo: Flecha Derecha)"
                  >
                    <span>+10s</span>
                    <FastForward className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id="btn-next-video"
                    onClick={handleNextVideo}
                    className={`p-2 rounded-lg border transition-all ${
                      tc('bg-white/5 border-white/10 hover:bg-white/10 text-white/80 hover:text-white', 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700 hover:text-slate-900')
                    }`}
                    title="Siguiente Video (Atajo: N)"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CENTER: KEYBOARD SHORTCUT CHIPS INFO (STYLISH DECK) */}
              <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono text-white/40">
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/20 border border-white/5">
                  <kbd>Espacio</kbd> <span className="opacity-75">Play/Pausa</span>
                </span>
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/20 border border-white/5">
                  <kbd>←</kbd>/<kbd>→</kbd> <span className="opacity-75">Saltar</span>
                </span>
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/20 border border-white/5">
                  <kbd>B</kbd>/<kbd>N</kbd> <span className="opacity-75">Prev/Sig</span>
                </span>
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/20 border border-white/5">
                  <kbd>M</kbd> <span className="opacity-75">Cine</span>
                </span>
              </div>

              {/* RIGHT SIDE: RESIZING CONTROL PILLS (AGRANDAR VIDEO) */}
              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                <div className="text-[10px] font-mono opacity-50 uppercase tracking-wider block md:hidden select-none">
                  Tamaño del Reproductor:
                </div>
                
                <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
                  <button
                    id="btn-size-standard"
                    onClick={() => {
                      setPlayerHeight('standard');
                      awardPoints(5, 'Ajustado reproductor a tamaño estándar 16:9');
                    }}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded transition-all ${
                      playerHeight === 'standard'
                        ? tc('bg-blue-600/30 text-blue-300 border border-blue-500/20 font-semibold', 'bg-blue-600 text-white font-semibold')
                        : tc('text-white/60 hover:text-white hover:bg-white/5', 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                    }`}
                  >
                    Estándar
                  </button>

                  <button
                    id="btn-size-tall"
                    onClick={() => {
                      setPlayerHeight('tall');
                      awardPoints(15, 'Ajustado reproductor a tamaño Grande (520px)');
                    }}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded transition-all ${
                      playerHeight === 'tall'
                        ? tc('bg-blue-600/30 text-blue-300 border border-blue-500/20 font-semibold', 'bg-blue-600 text-white font-semibold')
                        : tc('text-white/60 hover:text-white hover:bg-white/5', 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                    }`}
                  >
                    Grande
                  </button>

                  <button
                    id="btn-size-cinema"
                    onClick={() => {
                      setPlayerHeight('cinema');
                      awardPoints(25, 'Ajustado reproductor a tamaño Ultra (650px)');
                    }}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded transition-all ${
                      playerHeight === 'cinema'
                        ? tc('bg-blue-600/30 text-blue-300 border border-blue-500/20 font-semibold', 'bg-blue-600 text-white font-semibold')
                        : tc('text-white/60 hover:text-white hover:bg-white/5', 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                    }`}
                  >
                    Ultra
                  </button>
                </div>

                {/* CINEMA MODE TOGGLE */}
                <button
                  id="btn-cinema-mode-toggle"
                  onClick={() => {
                    setCinemaMode(!cinemaMode);
                    awardPoints(20, cinemaMode ? 'Saliendo de Modo Cine' : 'Iniciando Modo Cine');
                  }}
                  className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 ${
                    cinemaMode
                      ? tc('bg-purple-500/20 border-purple-500/30 text-purple-300 hover:bg-purple-500/30', 'bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200')
                      : tc('bg-white/5 border-white/10 hover:bg-white/10 text-white/80 hover:text-white', 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700 hover:text-slate-900')
                  }`}
                  title={cinemaMode ? "Reducir a Ancho Normal" : "Agrandar a Ancho Completo (Modo Cine)"}
                >
                  {cinemaMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* MÓDULO DE TRADUCCIÓN Y SUBTÍTULOS EN VIVO */}
          {activeVideo && (
            <div 
              id="subtitles-translation-deck"
              className={`p-4 rounded-2xl border flex flex-col gap-4 transition-all duration-300 shadow-lg ${
                tc('bg-[#0E0F12]/90 border-white/10 text-white', 'bg-white border-slate-200 text-slate-800')
              }`}
            >
              {/* Header section of translation deck */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${tc('bg-blue-500/10 text-blue-400', 'bg-blue-50 text-blue-600')}`}>
                    <Languages className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold tracking-wide">Traductor & Subtítulos en Vivo (Gemini AI)</h2>
                    <p className={`text-[11px] ${tc('text-white/50', 'text-slate-500')}`}>
                      Detección automática de idioma original y traducción en tiempo real al español
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider transition-all border ${
                      subtitlesEnabled
                        ? tc('bg-blue-500/15 border-blue-500/35 text-blue-400 hover:bg-blue-500/25', 'bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100')
                        : tc('bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10', 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-200')
                    }`}
                  >
                    {subtitlesEnabled ? 'Subtítulos: ON' : 'Subtítulos: OFF'}
                  </button>

                  <button
                    onClick={() => {
                      // Trigger refetch
                      setSubtitlesLoading(true);
                      setSubtitlesError('');
                      fetch('/api/translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          title: activeVideo.title,
                          description: activeVideo.description || '',
                          author: activeVideo.author || '',
                          category: activeVideo.category || '',
                        }),
                      })
                        .then(res => res.json())
                        .then(data => {
                          if (data.success) {
                            setSubtitles(data.subtitles || []);
                            setDetectedLanguage(data.detectedLanguage || 'Desconocido');
                          } else {
                            setSubtitlesError(data.error || 'No se pudieron generar los subtítulos.');
                          }
                        })
                        .catch(err => {
                          console.error('Error al regenerar:', err);
                          setSubtitlesError('Error de red al regenerar subtítulos.');
                        })
                        .finally(() => {
                          setSubtitlesLoading(false);
                        });
                    }}
                    disabled={subtitlesLoading}
                    className={`p-2 rounded-lg border transition-all ${
                      subtitlesLoading ? 'opacity-50 cursor-not-allowed' : ''
                    } ${tc('bg-white/5 border-white/10 hover:bg-white/10 text-white/80 hover:text-white', 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700 hover:text-slate-900')}`}
                    title="Regenerar traducción con Gemini AI"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${subtitlesLoading ? 'animate-spin text-cyan-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Translation Status details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {/* Language detected */}
                <div className={`p-2.5 rounded-xl border flex flex-col gap-1 ${tc('bg-white/5 border-white/5', 'bg-slate-50 border-slate-100')}`}>
                  <span className={`text-[10px] uppercase font-mono tracking-wider ${tc('text-white/40', 'text-slate-400')}`}>Idioma Original:</span>
                  {subtitlesLoading ? (
                    <span className="font-semibold text-cyan-400 animate-pulse font-mono">Analizando...</span>
                  ) : detectedLanguage ? (
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      🟢 {detectedLanguage}
                    </span>
                  ) : (
                    <span className="font-semibold opacity-40">Pendiente</span>
                  )}
                </div>

                {/* Translation Engine */}
                <div className={`p-2.5 rounded-xl border flex flex-col gap-1 ${tc('bg-white/5 border-white/5', 'bg-slate-50 border-slate-100')}`}>
                  <span className={`text-[10px] uppercase font-mono tracking-wider ${tc('text-white/40', 'text-slate-400')}`}>Motor Traductor:</span>
                  <span className="font-semibold text-cyan-400 font-mono">Gemini 3.5 Flash ⚡</span>
                </div>

                {/* Playback Source type */}
                <div className={`p-2.5 rounded-xl border flex flex-col gap-1 ${tc('bg-white/5 border-white/5', 'bg-slate-50 border-slate-100')}`}>
                  <span className={`text-[10px] uppercase font-mono tracking-wider ${tc('text-white/40', 'text-slate-400')}`}>Modo Sincro:</span>
                  <span className="font-semibold font-mono">
                    {activeVideo.url.match(/\.(mp4|webm|ogg)($|\?)/i) ? 'onTimeUpdate (Nativo)' : 'Simulada (Intervalo)'}
                  </span>
                </div>

                {/* Time controller state */}
                <div className={`p-2.5 rounded-xl border flex flex-col gap-1 ${tc('bg-white/5 border-white/5', 'bg-slate-50 border-slate-100')}`}>
                  <span className={`text-[10px] uppercase font-mono tracking-wider ${tc('text-white/40', 'text-slate-400')}`}>Cursor de Tiempo:</span>
                  <span className="font-semibold font-mono text-blue-400">
                    {Math.floor(videoCurrentTime / 60)}:{(videoCurrentTime % 60).toFixed(1).padStart(4, '0')} / 3:00
                  </span>
                </div>
              </div>

              {/* Timeline scrubber for simulated subtitles */}
              {(!activeVideo.url.match(/\.(mp4|webm|ogg)($|\?)/i)) && (
                <div className={`p-3 rounded-xl border flex flex-col gap-2 ${tc('bg-black/30 border-white/5', 'bg-slate-50 border-slate-200')}`}>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                      <span className={tc('text-white/70', 'text-slate-600')}>Línea de tiempo de traducción simulada:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPlayingSimulated(!isPlayingSimulated)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                          isPlayingSimulated
                            ? tc('bg-emerald-500/10 border-emerald-500/25 text-emerald-400', 'bg-emerald-50 border-emerald-300 text-emerald-700')
                            : tc('bg-amber-500/10 border-amber-500/25 text-amber-400', 'bg-amber-50 border-amber-300 text-amber-700')
                        }`}
                      >
                        {isPlayingSimulated ? 'REPRODUCIENDO SINCRO' : 'SINCRO PAUSADA'}
                      </button>
                      <button
                        onClick={() => setVideoCurrentTime(0)}
                        className={`px-1.5 py-0.5 rounded text-[10px] border ${tc('bg-white/5 border-white/10 hover:bg-white/10', 'bg-white border-slate-300 hover:bg-slate-50')}`}
                      >
                        Reiniciar
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono opacity-50">0:00</span>
                    <input
                      type="range"
                      min="0"
                      max="180"
                      step="0.5"
                      value={videoCurrentTime}
                      onChange={(e) => {
                        setVideoCurrentTime(parseFloat(e.target.value));
                      }}
                      className="flex-1 accent-blue-500 cursor-ew-resize h-1 bg-white/10 rounded-lg appearance-none"
                    />
                    <span className="text-[10px] font-mono opacity-50">3:00</span>
                  </div>
                </div>
              )}

              {/* Live Preview List of Subtitles */}
              {subtitles.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-1">
                  <span className={`text-[10px] font-mono uppercase tracking-wider block ${tc('text-white/40', 'text-slate-400')}`}>Previsualización de Líneas de Traducción:</span>
                  <div className={`max-h-24 overflow-y-auto rounded-xl border p-2 flex flex-col gap-1 text-[11px] font-mono ${tc('bg-black/20 border-white/5', 'bg-slate-50 border-slate-100')}`}>
                    {subtitles.map((sub, idx) => {
                      const isActive = videoCurrentTime >= sub.start && videoCurrentTime <= sub.end;
                      return (
                        <button
                          key={idx}
                          onClick={() => setVideoCurrentTime(sub.start)}
                          className={`text-left p-1.5 rounded transition-all flex items-start gap-2.5 ${
                            isActive
                              ? tc('bg-blue-500/15 text-white font-bold border-l-2 border-blue-500 pl-2', 'bg-blue-50 text-blue-900 font-bold border-l-2 border-blue-600 pl-2')
                              : tc('hover:bg-white/5 text-white/50 hover:text-white/80', 'hover:bg-slate-100 text-slate-500 hover:text-slate-800')
                          }`}
                        >
                          <span className={`text-[10px] ${isActive ? 'text-blue-400' : 'opacity-40'} font-mono shrink-0`}>
                            [{Math.floor(sub.start / 60)}:{(sub.start % 60).toString().padStart(2, '0')}]
                          </span>
                          <span className="flex-1 truncate">
                            {detectedLanguage && detectedLanguage.toLowerCase() !== 'español' && (
                              <span className="opacity-60 italic mr-1">({sub.original})</span>
                            )}
                            <span>{sub.spanish}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE VIDEO INFO METADATA */}
          {activeVideo && (
            <div id="video-metadata-card" className={`rounded-2xl p-6 glow-shadow border transition-all ${tc('bg-[#0A0A0B]/80 border-white/10 text-white', 'bg-white border-slate-200 text-slate-800')}`}>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-mono tracking-wider font-semibold px-2.5 py-0.5 rounded border uppercase ${
                      tc('bg-blue-500/10 text-blue-400 border-blue-500/20', 'bg-blue-50 text-blue-600 border-blue-200')
                    }`}>
                      {activeVideo.category}
                    </span>
                    <span className={`text-xs font-mono ${tc('text-white/50', 'text-slate-400')}`}>ID: {activeVideo.id}</span>
                  </div>
                  <h1 className={`text-2xl font-semibold tracking-tight leading-snug ${tc('text-white', 'text-slate-900')}`}>
                    {activeVideo.title}
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      copyToClipboard(activeVideo.url, 'embed-url');
                    }}
                    className={`flex items-center gap-2 border text-xs px-4 py-2 rounded transition-all ${
                      tc('bg-white/5 border-white/10 hover:bg-white/10 text-white/80 hover:text-white', 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700 hover:text-slate-900')
                    }`}
                  >
                    {copiedTextType === 'embed-url' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-blue-400 animate-scale" />
                        <span className="text-blue-400">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className={`w-3.5 h-3.5 ${tc('text-white/60', 'text-slate-500')}`} />
                        <span>Share</span>
                      </>
                    )}
                  </button>

                  {activeVideo.isCustom && (
                    <button
                      onClick={(e) => handleDeleteVideo(activeVideo.id, e)}
                      className={`border text-xs px-4 py-2 rounded transition-all flex items-center gap-1.5 ${
                        tc('bg-red-500/10 border-red-500/20 hover:border-red-500 hover:bg-red-500/20 text-red-400 hover:text-white', 'bg-red-50 border-red-200 hover:bg-red-600 text-red-600 hover:text-white')
                      }`}
                      title="Eliminar este video personalizado"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  )}
                </div>
              </div>

              <div className={`h-px my-4 ${tc('bg-white/10', 'bg-slate-200')}`}></div>

              <div>
                <div className={`flex items-center gap-2 text-xs mb-2 ${tc('text-white/50', 'text-slate-500')}`}>
                  <span>Canal Autor:</span>
                  <span className={`text-xs font-semibold ${tc('text-white', 'text-slate-800')}`}>{activeVideo.author}</span>
                </div>
                <p className={`text-xs leading-relaxed p-4 rounded border ${tc('bg-white/5 border-white/10 text-white/80', 'bg-slate-50 border-slate-100 text-slate-600')}`}>
                  {activeVideo.description}
                </p>
              </div>
            </div>
          )}

          {/* QUALITY FOOTER COMMENTS SECTION (Al pie del reproductor) */}
          <div id="comments-section" className={`rounded-2xl p-6 glow-shadow flex flex-col gap-6 border transition-all ${tc('bg-[#0A0A0B]/80 border-white/10', 'bg-white border-slate-200')}`}>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <h3 className={`font-sans font-semibold text-sm uppercase tracking-wider ${tc('text-white', 'text-slate-800')}`}>Comments</h3>
                <span className={`text-xs px-2.5 py-1 rounded border font-mono ${tc('bg-white/5 text-white/60 border-white/10', 'bg-slate-100 text-slate-600 border-slate-200')}`}>
                  {comments.length}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Search Comments */}
                <div className="relative">
                  <Search className={`w-3.5 h-3.5 absolute left-3 top-2.5 ${tc('text-white/40', 'text-slate-400')}`} />
                  <input
                    type="text"
                    placeholder="Buscar comentarios..."
                    value={commentSearch}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCommentSearch(val);
                      const term = val.toLowerCase().trim();
                      if (term === 'secreto' || term === 'secret' || term === 'hack' || term === 'nocturna') {
                        findSecret('comment-hack', 100, '¡Palabra clave oculta en búsqueda!');
                      }
                    }}
                    className={`border rounded py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-blue-500 w-44 ${tc('bg-[#050506] border-white/10 text-white placeholder-white/30', 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400')}`}
                  />
                </div>

                {/* Sort selector */}
                <button
                  onClick={() => setCommentSort(commentSort === 'rating' ? 'newest' : 'rating')}
                  className={`flex items-center gap-1.5 text-xs rounded transition-all border ${tc('text-white/80 hover:text-white bg-white/5 border-white/10', 'text-slate-600 hover:text-slate-800 bg-slate-100 border-slate-200')}`}
                >
                  <Sliders className="w-3 h-3 text-blue-500" />
                  <span>
                    Sort: {commentSort === 'rating' ? 'Relevancia' : 'Recientes'}
                  </span>
                </button>
              </div>
            </div>

            {/* Comment Input Form */}
            <form onSubmit={handleAddComment} className={`p-4 rounded-xl border transition-all ${tc('bg-[#0A0A0B] border-white/10', 'bg-slate-50 border-slate-200')}`}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                  {authorName ? authorName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${tc('text-white/50', 'text-slate-500')}`}>Publicar como:</span>
                    <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${tc('text-blue-400 bg-blue-500/10 border-blue-500/20', 'text-blue-600 bg-blue-50 border-blue-200')}`}>
                      {authorName || 'AnonDev'}
                    </span>
                  </div>
                  
                  <textarea
                    placeholder="Escribe un comentario técnico o de apreciación..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={2}
                    className={`w-full text-sm p-3 rounded border resize-none focus:outline-none focus:border-blue-500 ${tc('bg-[#050506] border-white/10 text-white placeholder-white/30', 'bg-white border-slate-200 text-slate-800 placeholder-slate-400')}`}
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className={`font-semibold text-xs px-4 py-2 rounded transition-all flex items-center gap-1.5 ${tc('bg-blue-600 hover:bg-blue-700 disabled:bg-white/5 disabled:text-white/30 text-white', 'bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white')}`}
                    >
                      <Send className="w-3 h-3" />
                      <span>Comentar</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="flex flex-col gap-4">
              <AnimatePresence initial={false}>
                {filteredComments.length > 0 ? (
                  filteredComments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                      className={`p-4 rounded-xl border flex flex-col gap-3 transition-all ${tc('bg-[#0A0A0B]/40 border-white/10', 'bg-slate-50 border-slate-100')}`}
                    >
                      {/* Comment Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded bg-gradient-to-tr ${comment.avatarColor} flex items-center justify-center font-bold text-white text-xs`}>
                            {comment.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className={`text-xs font-semibold ${tc('text-white/90', 'text-slate-800')}`}>{comment.author}</span>
                            <span className={`text-[10px] block ${tc('text-white/40', 'text-slate-400')}`}>{comment.timestamp}</span>
                          </div>
                        </div>

                        {/* Voting controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleVote(comment.id, 'up')}
                            className={`p-1.5 rounded transition-colors ${
                              comment.userVote === 'up'
                                ? 'bg-blue-500/10 text-blue-400'
                                : tc('text-white/40 hover:text-white', 'text-slate-400 hover:text-slate-700')
                            }`}
                            title="Me gusta"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <span className={`text-xs font-mono min-w-4 text-center ${
                            comment.rating > 0 
                              ? 'text-blue-500 font-medium' 
                              : comment.rating < 0 
                                ? 'text-red-500' 
                                : tc('text-white/40', 'text-slate-400')
                          }`}>
                            {comment.rating}
                          </span>
                          <button
                            onClick={() => handleVote(comment.id, 'down')}
                            className={`p-1.5 rounded transition-colors ${
                              comment.userVote === 'down'
                                ? 'bg-red-500/10 text-red-400'
                                : tc('text-white/40 hover:text-white', 'text-slate-400 hover:text-slate-700')
                            }`}
                            title="No me gusta"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Comment Text */}
                      <p className={`text-sm leading-relaxed pl-1 ${tc('text-white/80', 'text-slate-700')}`}>
                        {comment.text}
                      </p>

                      {/* Comment Actions Footer */}
                      <div className="flex items-center gap-4 pl-1">
                        <button
                          onClick={() => {
                            setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
                          }}
                          className={`text-[11px] font-semibold flex items-center gap-1.5 transition-colors ${tc('text-blue-400 hover:text-blue-300', 'text-blue-600 hover:text-blue-800')}`}
                        >
                          <CornerDownRight className="w-3 h-3" />
                          <span>Responder</span>
                        </button>
                      </div>

                      {/* Active Reply Input Form */}
                      <AnimatePresence>
                        {activeReplyId === comment.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`overflow-hidden pl-6 border-l my-1 ${tc('border-white/10', 'border-slate-200')}`}
                          >
                            <div className="flex items-center gap-2.5 pt-2">
                              <input
                                type="text"
                                placeholder={`Responder a ${comment.author}...`}
                                value={replyText[comment.id] || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setReplyText(prev => ({ ...prev, [comment.id]: val }));
                                }}
                                className={`flex-1 border rounded p-2 text-xs focus:outline-none focus:border-blue-500 ${tc('bg-[#050506] border-white/10 text-white', 'bg-white border-slate-200 text-slate-800')}`}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddReply(comment.id);
                                }}
                              />
                              <button
                                onClick={() => handleAddReply(comment.id)}
                                disabled={!replyText[comment.id]?.trim()}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded text-xs transition-all flex items-center gap-1 disabled:opacity-50 disabled:pointer-events-none"
                              >
                                <Send className="w-2.5 h-2.5" />
                                <span>Enviar</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Nested Replies Rendering */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className={`mt-2 pl-4 border-l-2 flex flex-col gap-3 ${tc('border-white/10', 'border-slate-200')}`}>
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className={`p-3 rounded border flex flex-col gap-2 ${tc('bg-[#050506]/40 border-white/5', 'bg-white border-slate-200 text-slate-800 shadow-sm')}`}>
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded bg-gradient-to-tr ${reply.avatarColor} flex items-center justify-center font-bold text-white text-[10px]`}>
                                  {reply.author.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <span className={`text-xs font-semibold ${tc('text-white/95', 'text-slate-800')}`}>{reply.author}</span>
                                  <span className={`text-[9px] ml-1.5 ${tc('text-white/40', 'text-slate-400')}`}>{reply.timestamp}</span>
                                </div>
                              </div>
                              <p className={`text-xs leading-normal pl-1 ${tc('text-white/80', 'text-slate-600')}`}>
                                {reply.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className={`text-center py-10 rounded-xl border border-dashed ${tc('bg-[#050506]/30 border-white/10 text-white/40', 'bg-slate-50 border-slate-200 text-slate-400')}`}>
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-xs font-mono uppercase tracking-wider">NINGÚN COMENTARIO COINCIDE CON TU BÚSQUEDA.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR TABS (VIDEOS / DEPLOYMENT / QUEST) */}
        {!cinemaMode && (
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* TABS SWITCHER */}
            <div className={`p-1.5 rounded-xl border flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-nowrap w-full ${tc('bg-[#0A0A0B] border-white/10', 'bg-white border-slate-200')}`}>
              <button
                onClick={() => setActiveSidebarTab('videos')}
                className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-semibold tracking-tight transition-all ${
                  activeSidebarTab === 'videos'
                    ? tc('bg-blue-600/15 text-blue-400 border border-blue-500/25', 'bg-blue-50 text-blue-600 border border-blue-200')
                    : tc('text-white/60 hover:text-white border border-transparent', 'text-slate-500 hover:text-slate-800 border border-transparent')
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explorar</span>
              </button>

              <button
                id="btn-tab-telegram"
                onClick={() => {
                  setActiveSidebarTab('telegram');
                  awardPoints(5, 'Sección Feed de Telegram abierta');
                }}
                className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-semibold tracking-tight transition-all ${
                  activeSidebarTab === 'telegram'
                    ? tc('bg-sky-500/15 text-sky-400 border border-sky-500/25', 'bg-sky-50 text-sky-600 border border-sky-200')
                    : tc('text-white/60 hover:text-white border border-transparent', 'text-slate-500 hover:text-slate-800 border border-transparent')
                }`}
              >
                <Send className="w-3.5 h-3.5 rotate-45" />
                <span>Telegram Feed</span>
              </button>

              <button
                id="btn-tab-social"
                onClick={() => {
                  setActiveSidebarTab('social');
                  awardPoints(5, 'Sección Social Chat e Inbox abierta');
                }}
                className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-semibold tracking-tight transition-all ${
                  activeSidebarTab === 'social'
                    ? tc('bg-violet-500/15 text-violet-400 border border-violet-500/25', 'bg-violet-50 text-violet-600 border border-violet-200')
                    : tc('text-white/60 hover:text-white border border-transparent', 'text-slate-500 hover:text-slate-800 border border-transparent')
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Social Chat ({chatMessages.length})</span>
              </button>
              
              <button
                id="btn-tab-nginx"
                onClick={() => setActiveSidebarTab('nginx')}
                className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-semibold tracking-tight transition-all ${
                  activeSidebarTab === 'nginx'
                    ? tc('bg-blue-600/15 text-blue-400 border border-blue-500/25', 'bg-blue-50 text-blue-600 border border-blue-200')
                    : tc('text-white/60 hover:text-white border border-transparent', 'text-slate-500 hover:text-slate-800 border border-transparent')
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>Nginx Hub</span>
              </button>

              <button
                id="btn-tab-quest"
                onClick={() => setActiveSidebarTab('quest')}
                className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-semibold tracking-tight transition-all ${
                  activeSidebarTab === 'quest'
                    ? tc('bg-yellow-500/15 text-yellow-400 border border-yellow-500/25', 'bg-amber-100 text-amber-800 border border-amber-200')
                    : tc('text-white/60 hover:text-white border border-transparent', 'text-slate-500 hover:text-slate-800 border border-transparent')
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Quest 🎮</span>
              </button>
            </div>

            {/* TAB CONTENT: VIDEOS */}
            {activeSidebarTab === 'videos' && (
              <div className="flex flex-col gap-4">
                
                {/* Curator Header & Add Custom Video Button */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono uppercase tracking-widest ${tc('text-white/50', 'text-slate-500')}`}>Canales Curados ({videos.length})</span>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded transition-all shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir Video</span>
                  </button>
                </div>

                {/* PLAYLIST AUTOPLAY STATUS DECK */}
                <div className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${tc('bg-[#0A0A0B]/60 border-white/5', 'bg-slate-50 border-slate-200')}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${autoplayEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      <span className={`text-[11px] font-bold tracking-tight ${tc('text-white/80', 'text-slate-800')}`}>
                        Reproducción Automática {autoplayEnabled ? 'Activada' : 'Pausada'}
                      </span>
                    </div>
                    
                    {/* IOS-style toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        setAutoplayEnabled(!autoplayEnabled);
                        awardPoints(5, `Autoplay de playlist ${!autoplayEnabled ? 'activado' : 'desactivado'}`);
                      }}
                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        autoplayEnabled ? 'bg-emerald-500' : tc('bg-zinc-800', 'bg-slate-300')
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          autoplayEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {/* Next up preview */}
                  {videos.length > 0 && (
                    <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-2 text-[10px] font-mono">
                      <span className={tc('text-white/40', 'text-slate-500')}>SIGUIENTE:</span>
                      <span className={`truncate font-semibold max-w-[200px] ${tc('text-blue-400', 'text-blue-600')}`}>
                        {(() => {
                          const currentIndex = videos.findIndex(v => v.id === activeVideo?.id);
                          const nextIndex = (currentIndex + 1) % videos.length;
                          return videos[nextIndex]?.title || 'Ninguno';
                        })()}
                      </span>
                    </div>
                  )}
                </div>

                {/* ADD CUSTOM VIDEO FORM */}
                <AnimatePresence>
                  {showAddForm && (
                    <motion.form
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleAddVideo}
                      className={`p-4 rounded-xl border glow-shadow flex flex-col gap-3 overflow-hidden transition-all ${tc('bg-[#0A0A0B] border-white/10', 'bg-white border-slate-200')}`}
                    >
                      <h4 className={`text-xs font-bold flex items-center gap-1.5 ${tc('text-white', 'text-slate-800')}`}>
                        <Plus className="w-3.5 h-3.5 text-blue-500" />
                        <span>Añadir Video Custom (Embed)</span>
                      </h4>

                      {formError && (
                        <div className="text-[11px] text-red-500 bg-red-500/5 border border-red-500/10 px-3 py-2 rounded">
                          {formError}
                        </div>
                      )}

                      <div>
                        <label className={`text-[10px] font-semibold block mb-1 ${tc('text-white/50', 'text-slate-500')}`}>Título del Video *</label>
                        <input
                          type="text"
                          placeholder="p.ej., Chill Cyber Lounge Synth"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className={`w-full border rounded p-2 text-xs focus:outline-none focus:border-blue-500 ${tc('bg-[#050506] border-white/10 text-white', 'bg-white border-slate-200 text-slate-800')}`}
                        />
                      </div>

                      <div>
                        <label className={`text-[10px] font-semibold block mb-1 ${tc('text-white/50', 'text-slate-500')}`}>URL o Enlace de Compartir *</label>
                        <input
                          type="text"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={newUrl}
                          onChange={(e) => setNewUrl(e.target.value)}
                          className={`w-full border rounded p-2 text-xs focus:outline-none focus:border-blue-500 ${tc('bg-[#050506] border-white/10 text-white', 'bg-white border-slate-200 text-slate-800')}`}
                        />
                        <span className={`text-[9px] block mt-1 ${tc('text-white/40', 'text-slate-400')}`}>
                          Aceptamos enlaces estándar de YouTube, Vimeo, Twitch o embeds limpios.
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={`text-[10px] font-semibold block mb-1 ${tc('text-white/50', 'text-slate-500')}`}>Categoría</label>
                          <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className={`w-full border rounded p-2 text-xs focus:outline-none focus:border-blue-500 ${tc('bg-[#050506] border-white/10 text-white', 'bg-white border-slate-200 text-slate-800')}`}
                          >
                            <option value="Música & Chill">Música & Chill</option>
                            <option value="Programación / ASMR">Programación / ASMR</option>
                            <option value="Aesthetic / Visual">Aesthetic / Visual</option>
                            <option value="Ciencia / Relax">Ciencia / Relax</option>
                          </select>
                        </div>
                        <div>
                          <label className={`text-[10px] font-semibold block mb-1 ${tc('text-white/50', 'text-slate-500')}`}>Autor</label>
                          <input
                            type="text"
                            placeholder="Canal o Autor"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            className={`w-full border rounded p-2 text-xs focus:outline-none focus:border-blue-500 ${tc('bg-[#050506] border-white/10 text-white', 'bg-white border-slate-200 text-slate-800')}`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className={`text-[10px] font-semibold block mb-1 ${tc('text-white/50', 'text-slate-500')}`}>Descripción</label>
                        <textarea
                          placeholder="Breve descripción del video o vibes nocturnas..."
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                          rows={2}
                          className={`w-full border rounded p-2 text-xs focus:outline-none focus:border-blue-500 resize-none ${tc('bg-[#050506] border-white/10 text-white', 'bg-white border-slate-200 text-slate-800')}`}
                        />
                      </div>

                      <div className="flex gap-2 justify-end mt-1">
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className={`text-xs px-3 py-1.5 rounded transition-all border ${tc('bg-white/5 border-white/10 text-white/80 hover:bg-white/10', 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200')}`}
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded transition-all flex items-center gap-1 shadow"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Guardar</span>
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* VIDEOS LIST */}
                <div className="flex flex-col gap-3">
                  {videos.map((video) => {
                    const isActive = activeVideo?.id === video.id;
                    return (
                      <div
                        key={video.id}
                        onClick={() => {
                          setActiveVideo(video);
                          // Exit cinema mode on selecting another video to avoid disorientation
                          if (cinemaMode) setCinemaMode(false);
                        }}
                        className={`group relative p-3.5 rounded-xl cursor-pointer border transition-all duration-300 ${
                          isActive 
                            ? tc('bg-gradient-to-r from-blue-500/10 to-[#0A0A0B] border-blue-500/45 glow-shadow', 'bg-gradient-to-r from-blue-50 to-white border-blue-500/45 shadow-sm') 
                            : tc('bg-white/[0.02] hover:bg-white/[0.05] border-white/5 hover:border-white/10', 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300')
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Left visual representation / Thumbnail container */}
                          <div className={`w-14 h-14 rounded flex items-center justify-center transition-all shrink-0 ${
                            isActive 
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                              : tc('bg-white/5 text-white/40 group-hover:text-blue-400', 'bg-slate-100 text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50')
                          }`}>
                            <Film className="w-5 h-5" />
                          </div>

                          {/* Metadata */}
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] text-blue-500 font-mono block uppercase tracking-widest mb-0.5">{video.category}</span>
                            <h5 className={`text-xs font-bold truncate leading-snug ${
                              isActive ? tc('text-white', 'text-blue-600') : tc('text-white/80 group-hover:text-white', 'text-slate-700 group-hover:text-slate-900')
                            }`}>
                              {video.title}
                            </h5>
                            <span className={`text-[10px] block truncate mt-0.5 ${tc('text-white/40', 'text-slate-400')}`}>Autor: {video.author}</span>
                          </div>

                          {/* Quick delete for custom videos */}
                          {video.isCustom && (
                            <button
                              onClick={(e) => handleDeleteVideo(video.id, e)}
                              className={`p-1 rounded transition-colors absolute top-2 right-2 opacity-0 group-hover:opacity-100 ${tc('text-white/40 hover:text-red-400 hover:bg-red-500/10', 'text-slate-400 hover:text-red-600 hover:bg-red-50')}`}
                              title="Borrar video"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT: DEPLOYMENT HUB (Nginx Reverse Proxy & Render Blueprint Configurator) */}
            {activeSidebarTab === 'nginx' && (
              <div className="flex flex-col gap-5 max-h-[85vh] overflow-y-auto pr-1">
                
                {/* Header overview */}
                <div className={`border p-4 rounded-xl flex items-start gap-3 transition-all ${tc('bg-blue-500/5 border-blue-500/15', 'bg-blue-50 border-blue-100')}`}>
                  <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className={`font-bold mb-1 ${tc('text-white', 'text-slate-800')}`}>Configuración Reverse Proxy</p>
                    <p className={`leading-relaxed ${tc('text-white/70', 'text-slate-600')}`}>
                      Utiliza estas plantillas para orquestar Next.js con un proxy reverso <strong>Nginx</strong> para desplegar en <strong>Render</strong> de forma segura con cabeceras avanzadas.
                    </p>
                  </div>
                </div>

                {/* 1. Nginx Config file */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold flex items-center gap-1.5 ${tc('text-white/80', 'text-slate-700')}`}>
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      <span>nginx.conf</span>
                    </span>
                    <button
                      onClick={() => {
                        copyToClipboard(NGINX_CONF, 'nginx');
                        findSecret('nginx-copy', 100, 'Configuración de Nginx Copiada');
                      }}
                      className={`text-[10px] font-mono flex items-center gap-1 px-2.5 py-1 rounded transition-colors border ${tc('bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-blue-400', 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-blue-600')}`}
                    >
                      {copiedTextType === 'nginx' ? (
                        <>
                          <Check className="w-3 h-3 text-blue-400 animate-pulse" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className={`text-[10px] font-mono p-3 rounded border overflow-x-auto max-h-48 leading-relaxed transition-all ${tc('text-white/60 bg-[#050506] border-white/10', 'text-slate-600 bg-slate-50 border-slate-200')}`}>
                    {NGINX_CONF}
                  </pre>
                </div>

                {/* 2. Dockerfile configuration */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold flex items-center gap-1.5 ${tc('text-white/80', 'text-slate-700')}`}>
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      <span>Dockerfile</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(DOCKERFILE, 'dockerfile')}
                      className={`text-[10px] font-mono flex items-center gap-1 px-2.5 py-1 rounded transition-colors border ${tc('bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-blue-400', 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-blue-600')}`}
                    >
                      {copiedTextType === 'dockerfile' ? (
                        <>
                          <Check className="w-3 h-3 text-blue-400" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className={`text-[10px] font-mono p-3 rounded border overflow-x-auto max-h-48 leading-relaxed transition-all ${tc('text-white/60 bg-[#050506] border-white/10', 'text-slate-600 bg-slate-50 border-slate-200')}`}>
                    {DOCKERFILE}
                  </pre>
                </div>

                {/* 3. supervisord.conf configuration */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold flex items-center gap-1.5 ${tc('text-white/80', 'text-slate-700')}`}>
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>supervisord.conf</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(SUPERVISORD_CONF, 'supervisord')}
                      className={`text-[10px] font-mono flex items-center gap-1 px-2.5 py-1 rounded transition-colors border ${tc('bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-blue-400', 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-blue-600')}`}
                    >
                      {copiedTextType === 'supervisord' ? (
                        <>
                          <Check className="w-3 h-3 text-blue-400" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className={`text-[10px] font-mono p-3 rounded border overflow-x-auto max-h-40 leading-relaxed transition-all ${tc('text-white/60 bg-[#050506] border-white/10', 'text-slate-600 bg-slate-50 border-slate-200')}`}>
                    {SUPERVISORD_CONF}
                  </pre>
                </div>

                {/* 4. Render Blueprint render.yaml */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold flex items-center gap-1.5 ${tc('text-white/80', 'text-slate-700')}`}>
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>render.yaml</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(RENDER_YAML, 'render')}
                      className={`text-[10px] font-mono flex items-center gap-1 px-2.5 py-1 rounded transition-colors border ${tc('bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-blue-400', 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-blue-600')}`}
                    >
                      {copiedTextType === 'render' ? (
                        <>
                          <Check className="w-3 h-3 text-blue-400" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className={`text-[10px] font-mono p-3 rounded border overflow-x-auto max-h-40 leading-relaxed transition-all ${tc('text-white/60 bg-[#050506] border-white/10', 'text-slate-600 bg-slate-50 border-slate-200')}`}>
                    {RENDER_YAML}
                  </pre>
                </div>

                {/* 5. Spanish deployment guide steps (Interactive Render vs VPS) */}
                <div className={`p-4 rounded-xl border flex flex-col gap-3 transition-all ${tc('bg-[#0A0A0B] border-white/10', 'bg-white border-slate-200')}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                    <h4 className={`text-xs font-bold flex items-center gap-1.5 ${tc('text-white', 'text-slate-800')}`}>
                      <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                      <span>Guía de Despliegue en Render / VPS</span>
                    </h4>
                    
                    {/* Toggle selector */}
                    <div className={`p-0.5 rounded border flex flex-wrap items-center gap-0.5 self-start sm:self-auto ${tc('bg-[#050506] border-white/10', 'bg-slate-50 border-slate-200')}`}>
                      <button
                        type="button"
                        onClick={() => setActiveGuideTab('render-standard')}
                        className={`px-2.5 py-1 rounded text-[10px] font-semibold tracking-tight transition-all ${
                          activeGuideTab === 'render-standard'
                            ? tc('bg-blue-600/15 text-blue-400', 'bg-blue-100 text-blue-700')
                            : tc('text-white/50 hover:text-white', 'text-slate-500 hover:text-slate-800')
                        }`}
                      >
                        Render Estándar
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveGuideTab('render-docker')}
                        className={`px-2.5 py-1 rounded text-[10px] font-semibold tracking-tight transition-all ${
                          activeGuideTab === 'render-docker'
                            ? tc('bg-blue-600/15 text-blue-400', 'bg-blue-100 text-blue-700')
                            : tc('text-white/50 hover:text-white', 'text-slate-500 hover:text-slate-800')
                        }`}
                      >
                        Render Docker
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveGuideTab('vps')}
                        className={`px-2.5 py-1 rounded text-[10px] font-semibold tracking-tight transition-all ${
                          activeGuideTab === 'vps'
                            ? tc('bg-blue-600/15 text-blue-400', 'bg-blue-100 text-blue-700')
                            : tc('text-white/50 hover:text-white', 'text-slate-500 hover:text-slate-800')
                        }`}
                      >
                        VPS sin Cloudflare
                      </button>
                    </div>
                  </div>

                  {/* Render Standard Guide Content */}
                  {activeGuideTab === 'render-standard' && (
                    <div className="flex flex-col gap-3">
                      <p className={`text-[11px] ${tc('text-white/60', 'text-slate-500')}`}>
                        La forma recomendada y más rápida de subir a <strong>Render</strong> de forma nativa sin Docker:
                      </p>

                      <ol className={`text-[11px] list-decimal pl-4 space-y-2.5 leading-relaxed ${tc('text-white/80', 'text-slate-700')}`}>
                        <li>
                          <span className={`font-bold ${tc('text-white', 'text-slate-800')}`}>Configurar el &ldquo;Root Directory&rdquo; (CRÍTICO):</span>
                          <span className={`block mt-0.5 ${tc('text-white/60', 'text-slate-500')}`}>
                            Si tus archivos están dentro de una carpeta contenedora en tu GitHub (ej: <code className={`font-mono text-[10px] ${tc('text-amber-400', 'text-amber-600')}`}>ai-studio-applet</code>), ve a <strong>Settings &rarr; Root Directory</strong> en el panel de Render y escribe el nombre de esa carpeta. Si no lo haces, obtendrás el error: <code className="font-mono text-red-500 text-[10px]">&ldquo;Couldn&apos;t find a package.json file&rdquo;</code>.
                          </span>
                        </li>
                        <li>
                          <span className={`font-bold ${tc('text-white', 'text-slate-800')}`}>Crear un servicio web (Web Service):</span> Conecta tu cuenta de GitHub, selecciona el repositorio y elige el entorno <strong>Node</strong>.
                        </li>
                        <li>
                          <span className={`font-bold ${tc('text-white', 'text-slate-800')}`}>Comandos de Construcción y Arranque:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                            <div className={`p-2 rounded border ${tc('bg-[#050506] border-white/5', 'bg-slate-50 border-slate-100')}`}>
                              <span className={`text-[9px] block mb-0.5 font-semibold ${tc('text-white/40', 'text-slate-400')}`}>BUILD COMMAND</span>
                              <code className={`font-mono text-[10px] ${tc('text-blue-400', 'text-blue-600')}`}>npm install && npm run build</code>
                            </div>
                            <div className={`p-2 rounded border ${tc('bg-[#050506] border-white/5', 'bg-slate-50 border-slate-100')}`}>
                              <span className={`text-[9px] block mb-0.5 font-semibold ${tc('text-white/40', 'text-slate-400')}`}>START COMMAND</span>
                              <code className={`font-mono text-[10px] ${tc('text-emerald-400', 'text-emerald-600')}`}>npm run start</code>
                            </div>
                          </div>
                        </li>
                        <li>
                          <span className={`font-bold ${tc('text-white', 'text-slate-800')}`}>Variables de Entorno:</span> Agrega tu clave <code className={`font-mono ${tc('text-blue-400', 'text-blue-600')}`}>GEMINI_API_KEY</code> en la pestaña <strong>Environment</strong> de tu Web Service.
                        </li>
                      </ol>

                      {/* No Domain Information Box */}
                      <div className={`p-3 rounded-lg flex items-start gap-2.5 mt-1 border ${tc('bg-blue-500/5 border-blue-500/10', 'bg-blue-50 border-blue-100')}`}>
                        <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <div className="text-[10px]">
                          <span className={`font-bold block mb-0.5 ${tc('text-white', 'text-slate-800')}`}>¿No tienes un dominio propio?</span>
                          <span className={tc('text-white/60', 'text-slate-600')}>
                            ¡No te preocupes! Render te asignará automáticamente un subdominio gratuito y seguro con SSL (ej: <code className={`font-mono text-[9px] ${tc('text-blue-400', 'text-blue-600')}`}>https://tu-app.onrender.com</code>). No necesitas configurar DNS ni comprar un dominio para ver tu aplicación en vivo.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Render Docker Guide Content */}
                  {activeGuideTab === 'render-docker' && (
                    <div className="flex flex-col gap-3">
                      <p className={`text-[11px] ${tc('text-white/60', 'text-slate-500')}`}>
                        Despliegue avanzado usando contenedores Docker con el servidor web Nginx como proxy inverso y Supervisor:
                      </p>

                      <ol className={`text-[11px] list-decimal pl-4 space-y-2.5 leading-relaxed ${tc('text-white/80', 'text-slate-700')}`}>
                        <li>Coloca los archivos <code className={`font-mono ${tc('text-blue-400', 'text-blue-600')}`}>nginx.conf</code>, <code className={`font-mono ${tc('text-purple-400', 'text-purple-600')}`}>Dockerfile</code>, <code className={`font-mono ${tc('text-emerald-400', 'text-emerald-600')}`}>supervisord.conf</code> y <code className={`font-mono ${tc('text-amber-400', 'text-amber-600')}`}>render.yaml</code> en la carpeta de tu código.</li>
                        <li>Sube tu código a un repositorio de GitHub.</li>
                        <li>
                          <span className={`font-bold ${tc('text-white', 'text-slate-800')}`}>Ajustar &ldquo;Root Directory&rdquo; (Obligatorio si usas carpetas):</span>
                          <span className={`block mt-0.5 ${tc('text-white/60', 'text-slate-500')}`}>
                            Si tu repositorio contiene la carpeta del proyecto (como <code className="font-mono text-[10px]">ai-studio-applet</code>), ve a la pestaña <strong>Settings</strong> de tu servicio web en Render y define el <strong>&ldquo;Root Directory&rdquo;</strong> con el nombre exacto de la carpeta para evitar fallos de compilación.
                          </span>
                        </li>
                        <li>En el panel de Render, selecciona <strong>&ldquo;Blueprints&rdquo;</strong> e importa el archivo <code className="font-mono">render.yaml</code>, o simplemente crea un Web Service con Runtime <strong>&ldquo;Docker&rdquo;</strong>.</li>
                        <li>Render compilará la imagen y lanzará Next.js junto con Nginx de forma transparente.</li>
                      </ol>
                    </div>
                  )}

                  {/* VPS Content fallback */}
                  {activeGuideTab === 'vps' && (
                    <div className={`flex flex-col gap-3 text-[11px] leading-relaxed ${tc('text-white/80', 'text-slate-700')}`}>
                      <p className={tc('text-white/60', 'text-slate-500')}>
                        Para alojar en tu propio VPS (Ubuntu/Debian) con DNS directo (sin proxy de Cloudflare), sigue estos pasos profesionales:
                      </p>
                      
                      <div className="flex flex-col gap-3 mt-1">
                        <div>
                          <span className={`font-bold block mb-0.5 ${tc('text-white', 'text-slate-800')}`}>1. Configurar Registro DNS (Registro A)</span>
                          <span className={tc('text-white/60', 'text-slate-500')}>
                            En tu proveedor de dominio, apunta un registro <code className={`font-mono text-[10px] ${tc('text-blue-400', 'text-blue-600')}`}>A</code> directamente a la <strong>IP pública de tu VPS</strong>. Asegúrate de desactivar la opción proxy (en Cloudflare pon &ldquo;Solo DNS / DNS Only&rdquo; para desactivar el CDN y permitir validación SSL directa de Let&apos;s Encrypt).
                          </span>
                        </div>

                        <div>
                          <span className={`font-bold block mb-0.5 ${tc('text-white', 'text-slate-800')}`}>2. Instalar dependencias en el VPS</span>
                          <span className={`block mb-1 ${tc('text-white/60', 'text-slate-500')}`}>
                            Instala el servidor web Nginx y el cliente Certbot para gestionar certificados SSL automáticos:
                          </span>
                          <pre className={`text-[10px] font-mono p-2 rounded border overflow-x-auto leading-normal ${tc('bg-[#050506] border-white/5 text-blue-400', 'bg-slate-50 border-slate-200 text-blue-600')}`}>
                            sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
                          </pre>
                        </div>

                        <div>
                          <span className={`font-bold block mb-0.5 ${tc('text-white', 'text-slate-800')}`}>3. Configurar bloque de servidor en Nginx</span>
                          <span className={`block mb-1 ${tc('text-white/60', 'text-slate-500')}`}>
                            Crea un archivo de configuración en <code className={`font-mono ${tc('text-amber-400', 'text-amber-600')}`}>/etc/nginx/sites-available/nocturna</code> con el proxy reverso directo apuntando al puerto 3000:
                          </span>
                          <pre className={`text-[9px] font-mono p-2.5 rounded border overflow-x-auto leading-normal max-h-36 ${tc('bg-[#050506] border-white/5 text-white/50', 'bg-slate-50 border-slate-200 text-slate-600')}`}>
{`server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`}
                          </pre>
                          <span className={`text-[10px] mt-1 block ${tc('text-white/40', 'text-slate-400')}`}>
                            Habilítalo con: <code className={`font-mono text-[9px] ${tc('text-white/50', 'text-slate-500')}`}>sudo ln -s /etc/nginx/sites-available/nocturna /etc/nginx/sites-enabled/</code> y verifica con <code className={`font-mono text-[9px] ${tc('text-white/50', 'text-slate-500')}`}>sudo nginx -t && sudo systemctl restart nginx</code>.
                          </span>
                        </div>

                        <div>
                          <span className={`font-bold block mb-0.5 ${tc('text-white', 'text-slate-800')}`}>4. Compilar e Iniciar la App (Puerto 3000)</span>
                          <span className={tc('text-white/60', 'text-slate-500')}>
                            Sube el código a tu VPS, instala dependencias, compila e inicia Next.js usando un gestor de procesos como PM2 para que corra en segundo plano permanentemente:
                            <code className={`font-mono text-[10px] block mt-1 p-1.5 rounded border ${tc('text-blue-400 bg-[#050506] border-white/5', 'text-blue-600 bg-slate-50 border-slate-200')}`}>
                              {"npm install && npm run build && pm2 start npm --name \"nocturna\" -- start"}
                            </code>
                          </span>
                        </div>

                        <div>
                          <span className={`font-bold block mb-0.5 ${tc('text-white', 'text-slate-800')}`}>5. Instalar Certificado SSL Certbot</span>
                          <span className={tc('text-white/60', 'text-slate-500')}>
                            Genera tus certificados SSL directamente. Certbot validará tu dominio de forma transparente y reconfigurará Nginx para forzar HTTPS de forma segura:
                            <code className={`font-mono text-[10px] block mt-1 p-1.5 rounded border ${tc('text-emerald-400 bg-[#050506] border-white/5', 'text-emerald-600 bg-slate-50 border-slate-200')}`}>
                              sudo certbot --nginx -d tudominio.com -d www.tudominio.com
                            </code>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: NOCTURNA QUEST GAMIFICATION AND CHALLENGES */}
            {activeSidebarTab === 'quest' && (
              <div className="flex flex-col gap-4">
                {/* Score Summary Banner */}
                <div className={`p-4 rounded-xl border flex flex-col gap-2.5 relative overflow-hidden transition-all ${
                  tc('bg-gradient-to-br from-yellow-500/10 to-[#0A0A0B] border-yellow-500/20 text-yellow-400', 'bg-gradient-to-br from-amber-50 to-white border-amber-200 text-amber-800')
                }`}>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500 animate-spin" style={{ animationDuration: '6s' }} />
                    <h4 className="font-bold text-xs uppercase tracking-wider">Tablero de Desafíos</h4>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${tc('text-white/70', 'text-slate-600')}`}>
                    ¡Resuelve secretos en la red, toma decisiones correctas y suma puntos de experiencia!
                  </p>

                  {/* Progress Indicator */}
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-medium">Secretos Encontrados</span>
                      <span className="font-bold font-mono">{secretsFound.length} / 4</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden w-full ${tc('bg-white/10', 'bg-slate-200')}`}>
                      <div 
                        className="h-full bg-yellow-500 rounded-full transition-all duration-500" 
                        style={{ width: `${(secretsFound.length / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Individual Quest Missions */}
                <div className="flex flex-col gap-3">
                  {/* Quest 1: Pulsing header sparkles */}
                  <div className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                    secretsFound.includes('header-star')
                      ? tc('bg-green-500/5 border-green-500/20 text-green-400', 'bg-green-50 border-green-200 text-green-800')
                      : tc('bg-[#0A0A0B] border-white/5', 'bg-white border-slate-200')
                  }`}>
                    <div className="mt-0.5">
                      {secretsFound.includes('header-star') ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
                      )}
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between font-bold mb-0.5">
                        <span className={tc('text-white', 'text-slate-800')}>La Estrella Parpadeante</span>
                        <span className="font-mono text-[10px] text-yellow-500">+50 PTS</span>
                      </div>
                      <p className={tc('text-white/60', 'text-slate-500')}>
                        {secretsFound.includes('header-star')
                          ? '¡Has hecho clic en el destello anómalo junto al título del encabezado!'
                          : 'Hay un destello anómalo parpadeando cerca del logo en el encabezado. Haz clic para estabilizarlo.'}
                      </p>
                    </div>
                  </div>

                  {/* Quest 2: Comment hack search query */}
                  <div className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                    secretsFound.includes('comment-hack')
                      ? tc('bg-green-500/5 border-green-500/20 text-green-400', 'bg-green-50 border-green-200 text-green-800')
                      : tc('bg-[#0A0A0B] border-white/5', 'bg-white border-slate-200')
                  }`}>
                    <div className="mt-0.5">
                      {secretsFound.includes('comment-hack') ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <MessageSquare className="w-4 h-4 text-indigo-500" />
                      )}
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between font-bold mb-0.5">
                        <span className={tc('text-white', 'text-slate-800')}>El Susurro de la Consola</span>
                        <span className="font-mono text-[10px] text-yellow-500">+100 PTS</span>
                      </div>
                      <p className={tc('text-white/60', 'text-slate-500')}>
                        {secretsFound.includes('comment-hack')
                          ? '¡Has introducido el código secreto en el buscador y revelado el canal alternativo!'
                          : 'Escribe la palabra secreta "secret" o "hack" en el buscador de comentarios para revelar transmisiones dev.'}
                      </p>
                    </div>
                  </div>

                  {/* Quest 3: Cinema activation */}
                  <div className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                    secretsFound.includes('cinema-activation')
                      ? tc('bg-green-500/5 border-green-500/20 text-green-400', 'bg-green-50 border-green-200 text-green-800')
                      : tc('bg-[#0A0A0B] border-white/5', 'bg-white border-slate-200')
                  }`}>
                    <div className="mt-0.5">
                      {secretsFound.includes('cinema-activation') ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Maximize2 className="w-4 h-4 text-purple-500" />
                      )}
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between font-bold mb-0.5">
                        <span className={tc('text-white', 'text-slate-800')}>Modo Cine Completo</span>
                        <span className="font-mono text-[10px] text-yellow-500">+50 PTS</span>
                      </div>
                      <p className={tc('text-white/60', 'text-slate-500')}>
                        {secretsFound.includes('cinema-activation')
                          ? '¡Inmersión total! Has alternado el modo de cine para optimizar tu enfoque.'
                          : 'Encuentra y pulsa el botón del Modo Cine en el encabezado para expandir la pantalla.'}
                      </p>
                    </div>
                  </div>

                  {/* Quest 4: Nginx copy configurator */}
                  <div className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                    secretsFound.includes('nginx-copy')
                      ? tc('bg-green-500/5 border-green-500/20 text-green-400', 'bg-green-50 border-green-200 text-green-800')
                      : tc('bg-[#0A0A0B] border-white/5', 'bg-white border-slate-200')
                  }`}>
                    <div className="mt-0.5">
                      {secretsFound.includes('nginx-copy') ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Server className="w-4 h-4 text-pink-500" />
                      )}
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between font-bold mb-0.5">
                        <span className={tc('text-white', 'text-slate-800')}>El Latido del Proxy</span>
                        <span className="font-mono text-[10px] text-yellow-500">+100 PTS</span>
                      </div>
                      <p className={tc('text-white/60', 'text-slate-500')}>
                        {secretsFound.includes('nginx-copy')
                          ? '¡Planos asegurados! Copiaste la configuración de Nginx para estudiarla.'
                          : 'Ve a la pestaña Nginx Hub y copia la configuración de nginx.conf para guardar los planos.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ultimate Title Claim Banner when all 4 secrets are resolved */}
                {secretsFound.length === 4 && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/40 text-center flex flex-col items-center gap-2.5 shadow-lg shadow-yellow-500/5"
                  >
                    <Trophy className="w-8 h-8 text-yellow-500 animate-bounce" />
                    <div>
                      <h5 className={`font-bold text-sm ${tc('text-white', 'text-amber-950')}`}>¡LOGRO LEGENDARIO DESBLOQUEADO!</h5>
                      <p className={`text-[10px] mt-0.5 ${tc('text-white/70', 'text-amber-800')}`}>Has estabilizado toda la red de Nocturna Pro con éxito.</p>
                    </div>
                    {!secretsFound.includes('legendary-title') ? (
                      <button
                        type="button"
                        onClick={() => findSecret('legendary-title', 200, 'Título de Señor de la Red Nocturna reclamado')}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-[#050506] font-bold text-xs py-2 rounded-lg transition-all shadow-md uppercase tracking-wider"
                      >
                        Reclamar Título: Señor de la Red 👑
                      </button>
                    ) : (
                      <div className="px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-bold font-mono tracking-widest uppercase">
                        Soberano de la Red Nocturna 👑
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {/* TAB CONTENT: TELEGRAM GROUP FEED */}
            {activeSidebarTab === 'telegram' && (
              <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Group Association card */}
                <div className={`p-4 rounded-xl border flex flex-col gap-3 transition-all ${
                  tc('bg-gradient-to-br from-sky-500/10 to-[#0A0A0B] border-sky-500/20 text-sky-400', 'bg-gradient-to-br from-sky-50 to-white border-sky-200 text-sky-800')
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Send className="w-5 h-5 text-sky-400 rotate-45" />
                      <h4 className="font-bold text-xs uppercase tracking-wider font-mono">Grupo de Telegram Asociado</h4>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/20 uppercase">Activo 🌐</span>
                  </div>
                  
                  <p className={`text-xs leading-relaxed ${tc('text-white/60', 'text-slate-600')}`}>
                    Este canal de feed está enlazado a la comunidad del grupo de Telegram. Cualquier usuario puede publicar novedades, ver la actividad reciente y reaccionar a los posts.
                  </p>

                  <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[10px] font-mono text-white/40">URL GRUPO:</span>
                    <a 
                      href={telegramUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs font-mono text-sky-400 hover:underline truncate flex-1 font-bold"
                    >
                      {telegramUrl}
                    </a>
                  </div>
                </div>

                {/* PUBLISH FEED UPDATE */}
                <form onSubmit={handleAddTelegramPost} className={`p-4 rounded-xl border flex flex-col gap-3 ${tc('bg-[#0A0A0B] border-white/5', 'bg-white border-slate-200')}`}>
                  <h4 className={`text-xs font-bold flex items-center gap-2 ${tc('text-white', 'text-slate-800')}`}>
                    <Plus className="w-4 h-4 text-sky-400" />
                    <span>Publicar en el Feed de Telegram</span>
                  </h4>
                  <textarea
                    placeholder="Escribe una novedad o comparte un enlace interesante para la comunidad..."
                    value={newTelegramPostText}
                    onChange={(e) => setNewTelegramPostText(e.target.value)}
                    rows={3}
                    className={`w-full border rounded-lg p-2.5 text-xs focus:outline-none focus:border-sky-500 resize-none ${
                      tc('bg-[#050506] border-white/10 text-white placeholder-white/30', 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400')
                    }`}
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newTelegramPostText.trim()}
                      className="bg-sky-500 hover:bg-sky-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5 rotate-45" />
                      <span>Publicar</span>
                    </button>
                  </div>
                </form>

                {/* FEED POSTS */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono uppercase tracking-widest ${tc('text-white/40', 'text-slate-500')}`}>Mensajes del Feed ({telegramFeed.length})</span>
                  </div>
                  
                  {telegramFeed.length === 0 ? (
                    <div className={`text-center py-12 rounded-xl border border-dashed ${tc('bg-[#050506]/30 border-white/10 text-white/40', 'bg-slate-50 border-slate-200 text-slate-400')}`}>
                      <Send className="w-8 h-8 mx-auto mb-2 opacity-40 rotate-45 text-sky-500" />
                      <p className="text-xs font-mono uppercase tracking-widest">AÚN NO HAY PUBLICACIONES EN EL FEED</p>
                    </div>
                  ) : (
                    telegramFeed.map((post) => (
                      <div
                        key={post.id}
                        className={`p-4 rounded-xl border flex flex-col gap-2.5 transition-all hover:scale-[1.01] ${
                          tc('bg-[#0A0A0B] border-white/5', 'bg-white border-slate-200 shadow-sm')
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow">
                              {post.senderName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h5 className={`text-xs font-bold ${tc('text-white', 'text-slate-800')}`}>{post.senderName}</h5>
                              <span className="text-[10px] text-sky-400 font-mono">@{post.senderUsername}</span>
                            </div>
                          </div>
                          <span className={`text-[9px] font-mono ${tc('text-white/30', 'text-slate-400')}`}>{post.timestamp}</span>
                        </div>
                        
                        <p className={`text-xs leading-relaxed ${tc('text-white/80', 'text-slate-600')}`}>
                          {post.text}
                        </p>
                        
                        {/* Likes counter reaction */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
                          <span className="text-[9px] font-mono text-white/30">ID: {post.id}</span>
                          <button
                            type="button"
                            onClick={async () => {
                              awardPoints(10, 'Reacción a post de Telegram');
                            }}
                            className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                              tc('bg-white/5 border-white/10 hover:bg-rose-500/15 hover:text-rose-400 hover:border-rose-500/20 text-white/60', 'bg-slate-100 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600')
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3 text-rose-500 fill-rose-500" />
                            <span className="font-bold">Me gusta</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: SOCIAL HUB (CHAT & INBOX) */}
            {activeSidebarTab === 'social' && (
              <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
                
                {/* SUB-TABS SELECTOR */}
                <div className={`p-1 rounded-lg border flex gap-1 ${tc('bg-[#0A0A0B]/60 border-white/5', 'bg-slate-100 border-slate-200')}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveInboxRecipient('invitado'); // Reset to default DM or general
                    }}
                    className={`flex-1 text-center py-1.5 rounded text-[11px] font-bold uppercase tracking-wider font-mono transition-all ${
                      activeInboxRecipient === 'invitado'
                        ? 'bg-violet-600 text-white shadow'
                        : tc('text-white/40 hover:text-white', 'text-slate-500 hover:text-slate-800')
                    }`}
                  >
                    Chat en Vivo 💬
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveInboxRecipient('Admin_Nocturno'); // Toggle to DM
                    }}
                    className={`flex-1 text-center py-1.5 rounded text-[11px] font-bold uppercase tracking-wider font-mono transition-all ${
                      activeInboxRecipient !== 'invitado'
                        ? 'bg-violet-600 text-white shadow'
                        : tc('text-white/40 hover:text-white', 'text-slate-500 hover:text-slate-800')
                    }`}
                  >
                    Bandeja Inbox 📥
                  </button>
                </div>

                {/* RENDER CHAT ROOM */}
                {activeInboxRecipient === 'invitado' ? (
                  <div className="flex flex-col gap-3">
                    <div className={`p-4 rounded-xl border flex flex-col gap-2 transition-all ${
                      tc('bg-gradient-to-br from-violet-500/10 to-[#0A0A0B] border-violet-500/20 text-violet-400', 'bg-gradient-to-br from-violet-50 to-white border-violet-200 text-violet-800')
                    }`}>
                      <h4 className="font-bold text-xs uppercase tracking-wider font-mono">Chat Grupal de la Comunidad</h4>
                      <p className={`text-xs leading-relaxed ${tc('text-white/60', 'text-slate-600')}`}>
                        Comparte impresiones, debate con otros noctámbulos en tiempo real y disfruta de las listas de reproducción.
                      </p>
                    </div>

                    {/* Chat Log container */}
                    <div className={`rounded-xl border flex flex-col overflow-hidden h-[340px] ${tc('bg-[#040405] border-white/10 text-white', 'bg-white border-slate-200 text-slate-800')}`}>
                      <div className="px-3.5 py-2 bg-black/40 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-bold font-mono text-white/50">SALA GENERAL LIVES</span>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest">Activo</span>
                        </div>
                      </div>

                      <div className="flex-1 p-3 overflow-y-auto space-y-2.5 font-sans text-xs flex flex-col">
                        {chatMessages.length === 0 ? (
                          <div className="text-white/30 text-center py-20 font-mono uppercase tracking-widest text-[10px]">Aún no hay mensajes en el chat</div>
                        ) : (
                          chatMessages.map((msg) => {
                            const isMe = msg.sender === (currentUser ? currentUser.username : (authorName || 'Invitado_Nocturno'));
                            return (
                              <div
                                key={msg.id}
                                className={`max-w-[85%] rounded-2xl p-2.5 leading-relaxed flex flex-col ${
                                  isMe
                                    ? 'self-end bg-violet-600 text-white rounded-br-none'
                                    : tc('self-start bg-zinc-800/80 text-white rounded-bl-none border border-white/5', 'self-start bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200')
                                }`}
                              >
                                <span className={`text-[8px] font-bold uppercase mb-0.5 ${isMe ? 'text-violet-200' : 'text-violet-400'}`}>
                                  {msg.sender}
                                </span>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                <span className={`text-[8px] mt-1 text-right block ${isMe ? 'text-white/40' : 'text-slate-400'}`}>{msg.timestamp}</span>
                              </div>
                            );
                          })
                        )}
                      </div>

                      <form onSubmit={handleSendLiveChatMessage} className="p-2 border-t border-white/5 bg-black/20 flex gap-2">
                        <input
                          type="text"
                          placeholder="Escribe un mensaje en el chat vivo..."
                          value={newLiveChatMessageText}
                          onChange={(e) => setNewLiveChatMessageText(e.target.value)}
                          className={`flex-1 border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-violet-500 font-mono ${
                            tc('bg-black/50 border-white/10 text-white placeholder-white/30', 'bg-white border-slate-200 text-slate-800 placeholder-slate-400')
                          }`}
                        />
                        <button
                          type="submit"
                          disabled={!newLiveChatMessageText.trim()}
                          className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700/50 disabled:text-zinc-500 text-white rounded-lg transition-colors flex items-center justify-center"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>
                ) : (
                  /* RENDER USER-TO-USER INBOX MESSAGE DRAWER */
                  <div className="flex flex-col gap-3">
                    <div className={`p-4 rounded-xl border flex flex-col gap-2 transition-all ${
                      tc('bg-gradient-to-br from-indigo-500/10 to-[#0A0A0B] border-indigo-500/20 text-indigo-400', 'bg-gradient-to-br from-indigo-50 to-white border-indigo-200 text-indigo-800')
                    }`}>
                      <h4 className="font-bold text-xs uppercase tracking-wider font-mono">Bandeja de Mensajería Privada</h4>
                      <p className={`text-xs leading-relaxed ${tc('text-white/60', 'text-slate-600')}`}>
                        Envía y recibe mensajes directos instantáneos con otros miembros y personal del soporte del portal.
                      </p>
                    </div>

                    {/* SELECT RECIPIENT DROPDOWN */}
                    <div className="flex flex-col gap-1">
                      <label className={`text-[10px] font-bold font-mono tracking-wider ${tc('text-white/40', 'text-slate-500')}`}>RECEPTOR PRIVADO:</label>
                      <select
                        value={activeInboxRecipient}
                        onChange={(e) => setActiveInboxRecipient(e.target.value)}
                        className={`w-full border rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 ${
                          tc('bg-[#050506] border-white/10 text-white', 'bg-white border-slate-200 text-slate-800')
                        }`}
                      >
                        <option value="Admin_Nocturno">👑 Admin_Nocturno (Administrador)</option>
                        <option value="DJ_Nocturno">🎵 DJ_Nocturno (Lounge Curator)</option>
                        <option value="Soporte_VIP">🛡️ Soporte_VIP (Atención VIP)</option>
                        <option value="Explorador_Premium">⭐ Explorador_Premium (Miembro VIP)</option>
                      </select>
                    </div>

                    {/* Private Conversation thread */}
                    <div className={`rounded-xl border flex flex-col overflow-hidden h-[260px] ${tc('bg-[#040405] border-white/10 text-white', 'bg-white border-slate-200 text-slate-800')}`}>
                      <div className="px-3.5 py-2 bg-black/40 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-bold font-mono text-indigo-400 uppercase">Chat con @{activeInboxRecipient}</span>
                        <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Encriptado</span>
                      </div>

                      <div className="flex-1 p-3 overflow-y-auto space-y-2.5 font-sans text-xs flex flex-col">
                        {(() => {
                          const myUsername = currentUser ? currentUser.username : 'invitado';
                          const conversation = inboxMessages.filter(msg => 
                            (msg.sender.toLowerCase() === myUsername.toLowerCase() && msg.recipient.toLowerCase() === activeInboxRecipient.toLowerCase()) ||
                            (msg.sender.toLowerCase() === activeInboxRecipient.toLowerCase() && msg.recipient.toLowerCase() === myUsername.toLowerCase())
                          );

                          return conversation.length === 0 ? (
                            <div className="text-white/30 text-center py-16 font-mono text-[9px] uppercase tracking-wider">No hay mensajes previos en esta conversación</div>
                          ) : (
                            conversation.map((msg) => {
                              const isMe = msg.sender.toLowerCase() === myUsername.toLowerCase();
                              return (
                                <div
                                  key={msg.id}
                                  className={`max-w-[85%] rounded-2xl p-2.5 leading-relaxed flex flex-col ${
                                    isMe
                                      ? 'self-end bg-indigo-600 text-white rounded-br-none'
                                      : tc('self-start bg-zinc-800/80 text-white rounded-bl-none border border-white/5', 'self-start bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200')
                                  }`}
                                >
                                  <span className="text-[8px] font-bold uppercase mb-0.5 text-indigo-300">
                                    {msg.sender}
                                  </span>
                                  <p className="whitespace-pre-wrap">{msg.text}</p>
                                  <span className={`text-[8px] mt-1 text-right block ${isMe ? 'text-white/40' : 'text-slate-400'}`}>{msg.timestamp}</span>
                                </div>
                              );
                            })
                          );
                        })()}
                      </div>

                      <form onSubmit={handleSendInboxMessage} className="p-2 border-t border-white/5 bg-black/20 flex gap-2">
                        <input
                          type="text"
                          placeholder={`Escribe un DM privado para ${activeInboxRecipient}...`}
                          value={newInboxMessageText}
                          onChange={(e) => setNewInboxMessageText(e.target.value)}
                          className={`flex-1 border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-mono ${
                            tc('bg-black/50 border-white/10 text-white placeholder-white/30', 'bg-white border-slate-200 text-slate-800 placeholder-slate-400')
                          }`}
                        />
                        <button
                          type="submit"
                          disabled={!newInboxMessageText.trim()}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700/50 disabled:text-zinc-500 text-white rounded-lg transition-colors flex items-center justify-center"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: TELEGRAM BOT CONTROL AND SERVER DATABASE */}
            {activeSidebarTab === 'bot' && (
              <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* Header Card */}
                <div className={`p-4 rounded-xl border flex flex-col gap-2.5 relative overflow-hidden transition-all ${
                  tc('bg-[#0A0A0B] border-white/10 text-white', 'bg-white border-slate-200 text-slate-800')
                }`}>
                  <p className="text-xs">
                    Esta sección está migrada. Utiliza las pestañas superiores <strong>Telegram Feed</strong> y <strong>Social Chat</strong>.
                  </p>
                </div>
              </div>
            )}

            {activeSidebarTab === 'bot' && (
              <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {/* DYNAMIC TELEGRAM SETUP & TROUBLESHOOTING GUIDE */}
                <div className={`p-4 rounded-xl border flex flex-col gap-3 transition-all ${
                  tc('bg-[#0E0F12]/80 border-white/10 text-white', 'bg-white border-slate-200 text-slate-800')
                }`}>
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold tracking-wide uppercase font-mono">Guía de Inicio del Bot Real</span>
                    </div>
                    <button
                      onClick={() => setShowRealBotGuide(!showRealBotGuide)}
                      className={`text-[10px] font-mono hover:underline ${tc('text-blue-400', 'text-blue-600')}`}
                    >
                      {showRealBotGuide ? '[ Ocultar ]' : '[ Mostrar ]'}
                    </button>
                  </div>

                  {showRealBotGuide && (
                    <div className="space-y-3.5 text-xs animate-in fade-in duration-200">
                      <div className="p-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-[11px] leading-relaxed text-yellow-300">
                        ⚠️ <strong className="font-semibold">¿Por qué no inicia tu Bot?</strong> El bot <span className="font-mono underline">@Start_vidroxbot</span> es una plantilla predeterminada. Para usar el bot de forma real, necesitas crear tu propio bot en Telegram y conectar esta aplicación.
                      </div>

                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold font-mono flex-shrink-0 mt-0.5">1</div>
                          <div>
                            <p className="font-bold text-[11px]">Crea tu Bot en Telegram</p>
                            <p className={`text-[11px] mt-0.5 ${tc('text-white/60', 'text-slate-500')}`}>
                              Busca a <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">@BotFather</a> en Telegram, envíale el comando <code className="px-1 py-0.5 bg-black/30 rounded font-mono text-[10px]">/newbot</code>, sigue los pasos y copia el <strong>Token de API</strong> que te proporcione.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold font-mono flex-shrink-0 mt-0.5">2</div>
                          <div>
                            <p className="font-bold text-[11px]">Configura las Variables de Entorno</p>
                            <p className={`text-[11px] mt-0.5 ${tc('text-white/60', 'text-slate-500')}`}>
                              Ve al menú de <strong>Configuración (Settings)</strong> en AI Studio, y en la sección de secretos agrega:
                              <code className="block mt-1 p-1.5 bg-black/40 rounded font-mono text-[10px] text-blue-300 border border-white/5 select-all">
                                TELEGRAM_BOT_TOKEN=&quot;TU_TOKEN_AQUÍ&quot;
                              </code>
                            </p>
                            <div className="mt-1.5 flex items-center gap-1.5 text-[10px]">
                              <span>Estado en el servidor:</span>
                              {hasTelegramToken ? (
                                <span className="text-green-400 font-bold font-mono flex items-center gap-1 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20">
                                  ● CONFIGURADO 🟢
                                </span>
                              ) : (
                                <span className="text-red-400 font-bold font-mono flex items-center gap-1 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                                  ● NO DETECTADO 🔴 (Agrégalo en variables de entorno)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 border-t border-white/5 pt-3">
                          <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold font-mono flex-shrink-0 mt-0.5">3</div>
                          <div className="flex-1">
                            <p className="font-bold text-[11px]">Vincula y Activa el Webhook</p>
                            <p className={`text-[11px] mt-0.5 ${tc('text-white/60', 'text-slate-500')}`}>
                              Para que Telegram reenvíe los videos que reciba el bot a este reproductor web en vivo, debes enlazar el Webhook. Pega el Token de tu Bot aquí para abrir el activador directo:
                            </p>

                            <div className="mt-2.5 flex flex-col sm:flex-row gap-2">
                              <input
                                type="text"
                                value={customBotToken}
                                onChange={(e) => setCustomBotToken(e.target.value)}
                                placeholder="Pega el Token de tu bot creado..."
                                className="flex-1 bg-black/40 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder-white/30 font-mono focus:outline-none focus:border-cyan-500"
                              />
                              <button
                                type="button"
                                disabled={!customBotToken.trim()}
                                onClick={() => {
                                  const webhookUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/telegram` : '/api/telegram';
                                  const cleanToken = customBotToken.trim();
                                  const finalLink = `https://api.telegram.org/bot${cleanToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;
                                  window.open(finalLink, '_blank');
                                  
                                  setSimulatedChat(prev => [...prev, {
                                    id: 'setup-success-' + Date.now(),
                                    sender: 'bot',
                                    text: `⚙️ [WEBHOOK] Intentando registrar Webhook de Telegram...\nSe abrió una nueva pestaña para vincular tu bot.\n\nVerifica que la pestaña indique:\n{"ok":true,"result":true,"description":"Webhook was set"}`,
                                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  }]);
                                }}
                                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded text-[11px] font-bold font-mono uppercase tracking-wider transition-colors shrink-0"
                              >
                                Activar Webhook ⚡
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Grid Server & DB Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-xl border font-mono ${tc('bg-[#0A0A0B] border-white/5 text-white', 'bg-slate-50 border-slate-200 text-slate-800')}`}>
                    <div className="flex items-center gap-1.5 mb-2 border-b border-white/5 pb-1.5">
                      <Cpu className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[10px] font-bold text-blue-400 font-mono">SERVIDOR</span>
                    </div>
                    <div className="space-y-1.5 text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-white/40">Entorno:</span>
                        <span className="text-emerald-400 font-mono">Cloud Run</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Puerto:</span>
                        <span className="font-mono">3000 (Proxy)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Node.js:</span>
                        <span className="font-mono">{nodeVersion || 'v20.x'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Uptime:</span>
                        <span className="text-cyan-300 font-mono">{serverUptime ? `${Math.floor(serverUptime)}s` : '0s'}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border font-mono ${tc('bg-[#0A0A0B] border-white/5 text-white', 'bg-slate-50 border-slate-200 text-slate-800')}`}>
                    <div className="flex items-center gap-1.5 mb-2 border-b border-white/5 pb-1.5">
                      <Database className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[10px] font-bold text-cyan-400 font-mono">BASE DE DATOS</span>
                    </div>
                    <div className="space-y-1.5 text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-white/40">Tipo:</span>
                        <span className="font-mono">Local Store</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Ruta:</span>
                        <span className="text-orange-400 font-mono">/tmp/nocturnal_db.json</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Peticiones:</span>
                        <span className="text-cyan-400 font-bold font-mono">{serverRequests || 1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Estado:</span>
                        <span className="text-green-400 font-bold font-mono">ACTIVA 🟢</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TELEGRAM SIMULATOR TERMINAL */}
                <div className={`rounded-xl border flex flex-col overflow-hidden h-[340px] ${tc('bg-[#040405] border-white/10 text-white', 'bg-white border-slate-200 text-slate-800')}`}>
                  {/* Header */}
                  <div className="px-3.5 py-2.5 bg-black/40 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                      <span className="text-[10px] font-bold font-mono tracking-wider text-white/70">SIMULADOR @Start_vidroxbot</span>
                    </div>
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Canal de Prueba</span>
                  </div>

                  {/* Message Log */}
                  <div className="flex-1 p-3 overflow-y-auto space-y-2.5 font-sans text-xs flex flex-col justify-end">
                    {simulatedChat.map((msg) => (
                      <div
                        key={msg.id}
                        className={`max-w-[85%] rounded-2xl p-2.5 text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'self-end bg-blue-600 text-white rounded-br-none font-mono text-[11px]'
                            : 'self-start bg-zinc-800/80 text-white rounded-bl-none border border-white/5'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <span className="block text-[8px] text-white/40 mt-1 text-right font-mono">{msg.timestamp}</span>
                      </div>
                    ))}
                    {isSimulatingMessage && (
                      <div className="self-start bg-zinc-800/80 text-white rounded-2xl rounded-bl-none border border-white/5 p-2.5 text-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    )}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!simulatedInput.trim() || isSimulatingMessage) return;
                    const userText = simulatedInput.trim();
                    setSimulatedChat(prev => [...prev, {
                      id: 'user-' + Date.now(),
                      sender: 'user',
                      text: userText,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }]);
                    setSimulatedInput('');
                    
                    // Trigger bot reply
                    if (typeof setIsSimulatingMessage === 'function') {
                      setIsSimulatingMessage(true);
                    }
                    setTimeout(() => {
                      let reply = 'Lo siento, no entendí ese comando. Prueba con /help o pega un enlace de video.';
                      if (userText.startsWith('/start')) {
                        reply = '¡Hola! Bienvenido al simulador de Vidroxbot. Pega un enlace de video para comenzar o usa /status para ver el estado del servidor.';
                      } else if (userText.startsWith('/status')) {
                        reply = '🤖 ESTADO DEL SERVIDOR:\n• Servidor: ACTIVO 🟢\n• Base de Datos: ACTIVA 🟢\n• Nginx Proxy: ok';
                      } else if (userText.startsWith('/help')) {
                        reply = 'Comandos disponibles:\n• /start - Iniciar el bot\n• /status - Ver estado del servidor\n• /help - Mostrar esta ayuda';
                      } else if (userText.includes('youtube.com') || userText.includes('youtu.be') || userText.includes('http')) {
                        reply = '📥 ¡Video detectado! Procesando el enlace para extraer metadatos y agregarlo a la lista de reproducción...';
                      }

                      setSimulatedChat(prev => [...prev, {
                        id: 'bot-' + Date.now(),
                        sender: 'bot',
                        text: reply,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }]);
                      if (typeof setIsSimulatingMessage === 'function') {
                        setIsSimulatingMessage(false);
                      }
                    }, 1000);
                  }} className="p-2 border-t border-white/5 bg-black/20 flex gap-2">
                    <input
                      type="text"
                      placeholder="Prueba un comando como /status o pega un video..."
                      value={simulatedInput}
                      onChange={(e) => setSimulatedInput(e.target.value)}
                      disabled={isSimulatingMessage}
                      className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <button
                      type="submit"
                      disabled={isSimulatingMessage || !simulatedInput.trim()}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700/50 disabled:text-zinc-500 text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

                {/* CONNECTION AND METRICS LOGS TERMINAL */}
                <div className={`rounded-xl border flex flex-col overflow-hidden h-[190px] font-mono ${tc('bg-[#020203] border-white/10 text-white', 'bg-slate-900 border-slate-700 text-slate-100')}`}>
                  <div className="px-3.5 py-2.5 bg-black/50 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[10px] font-bold text-white/70">REGISTROS DE CONEXIÓN Y BASE DE DATOS</span>
                    </div>
                    <span className="text-[8px] text-white/30 uppercase tracking-widest">Tiempo real</span>
                  </div>

                  <div className="flex-1 p-2.5 overflow-y-auto space-y-1.5 text-[10px] leading-relaxed scrollbar-thin select-none">
                    {serverLogs.length === 0 ? (
                      <div className="text-white/30 text-center py-8">Iniciando monitor de logs del servidor...</div>
                    ) : (
                      serverLogs.slice(0, 15).map((log: any) => (
                        <div key={log.id} className="flex flex-col border-b border-white/5 pb-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-white/30 font-mono">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                            <div className="flex gap-1">
                              <span className={`px-1 rounded-[3px] text-[8px] font-bold font-mono ${
                                log.type === 'SYNC' ? 'bg-zinc-800 text-zinc-300' :
                                log.type === 'BOT_WRITE' ? 'bg-blue-900/40 text-blue-300' :
                                'bg-purple-900/40 text-purple-300'
                              }`}>
                                {log.type}
                              </span>
                              <span className={`px-1 rounded-[3px] text-[8px] font-bold font-mono ${
                                log.status === 'SUCCESS' ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'
                              }`}>
                                {log.status} ({log.durationMs}ms)
                              </span>
                            </div>
                          </div>
                          <p className="text-cyan-300/85 mt-0.5 whitespace-pre-wrap font-mono text-[9px]">{log.details}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className={`border-t py-6 mt-auto text-xs font-mono transition-colors duration-300 ${tc('border-white/10 bg-[#0A0A0B] text-white/40', 'border-slate-200 bg-white text-slate-500')}`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>Nocturnal Visualizer & Reverse Proxy Blueprint</span>
          </div>
          <div>
            <span>Desarrollado a nivel profesional y listo para producción</span>
          </div>
        </div>
      </footer>

      {/* USER AUTHENTICATION DIALOG (MODAL) */}
      <AnimatePresence>
        {authModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuthModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              className={`relative w-full max-w-md rounded-2xl border p-6 shadow-2xl z-10 transition-colors duration-300 ${
                tc('bg-[#0A0A0B] border-white/10 text-white', 'bg-white border-slate-200 text-slate-800')
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setAuthModalOpen(false)}
                className={`absolute top-4 right-4 p-1.5 rounded-lg border transition-all ${
                  tc('border-white/5 hover:border-white/20 bg-white/5 text-white/60 hover:text-white', 'border-slate-100 hover:border-slate-300 bg-slate-50 text-slate-500 hover:text-slate-800')
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Title Header */}
              <div className="flex flex-col items-center gap-1.5 mb-6 text-center">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/10">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-sm tracking-widest uppercase">
                  {authTab === 'login' ? 'Acceso Nocturno' : 'Unirse a la Red'}
                </h4>
                <p className={`text-[10px] uppercase font-mono tracking-wider ${tc('text-blue-400', 'text-blue-600')}`}>
                  {authTab === 'login' ? 'Introduce tus credenciales' : 'Registra tu perfil en la red'}
                </p>
              </div>

              {/* Tab Selector Buttons */}
              <div className={`flex border-b mb-6 ${tc('border-white/5', 'border-slate-100')}`}>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('login');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 text-center ${
                    authTab === 'login'
                      ? 'border-blue-500 text-blue-500'
                      : tc('border-transparent text-white/40 hover:text-white/60', 'border-transparent text-slate-400 hover:text-slate-600')
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('register');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 text-center ${
                    authTab === 'register'
                      ? 'border-blue-500 text-blue-500'
                      : tc('border-transparent text-white/40 hover:text-white/60', 'border-transparent text-slate-400 hover:text-slate-600')
                  }`}
                >
                  Crear Cuenta
                </button>
              </div>

              {/* Errors & Success Banners */}
              {authError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
                  <span className="font-bold">Error:</span>
                  <span>{authError}</span>
                </div>
              )}
              {authSuccess && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2">
                  <span className="font-bold">Éxito:</span>
                  <span>{authSuccess}</span>
                </div>
              )}

              {/* AUTHENTICATION FORMS */}
              <form onSubmit={authTab === 'login' ? handleLogin : handleRegister} className="flex flex-col gap-4">
                
                {authTab === 'register' && (
                  <div className="flex flex-col gap-1">
                    <label className={`text-[10px] font-mono uppercase tracking-wider ${tc('text-white/40', 'text-slate-500')}`}>
                      Nombre de Usuario
                    </label>
                    <div className="relative">
                      <User className={`w-4 h-4 absolute left-3 top-3.5 ${tc('text-white/30', 'text-slate-400')}`} />
                      <input
                        type="text"
                        placeholder="ej. cyber_ninja"
                        value={authUsername}
                        onChange={(e) => setAuthUsername(e.target.value)}
                        className={`w-full text-xs py-3 pl-10 pr-4 rounded-xl border focus:outline-none focus:border-blue-500 font-mono ${
                          tc('bg-[#050506] border-white/10 text-white placeholder-white/20', 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400')
                        }`}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className={`text-[10px] font-mono uppercase tracking-wider ${tc('text-white/40', 'text-slate-500')}`}>
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className={`w-4 h-4 absolute left-3 top-3.5 ${tc('text-white/30', 'text-slate-400')}`} />
                    <input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className={`w-full text-xs py-3 pl-10 pr-4 rounded-xl border focus:outline-none focus:border-blue-500 font-mono ${
                        tc('bg-[#050506] border-white/10 text-white placeholder-white/20', 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400')
                      }`}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className={`text-[10px] font-mono uppercase tracking-wider ${tc('text-white/40', 'text-slate-500')}`}>
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className={`w-4 h-4 absolute left-3 top-3.5 ${tc('text-white/30', 'text-slate-400')}`} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className={`w-full text-xs py-3 pl-10 pr-4 rounded-xl border focus:outline-none focus:border-blue-500 font-mono ${
                        tc('bg-[#050506] border-white/10 text-white placeholder-white/20', 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400')
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* Remember Me Option */}
                <div className="flex items-center justify-between mt-1 mb-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={authRememberMe}
                      onChange={(e) => setAuthRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                    />
                    <span className={`text-[11px] font-mono ${tc('text-white/60', 'text-slate-500')}`}>
                      Recordarme en este equipo
                    </span>
                  </label>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-blue-600/15 uppercase tracking-wider"
                >
                  {authTab === 'login' ? 'Iniciar Sesión' : 'Registrarse Ahora'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INVISIBLE / SECRET INJECTION CONSOLE */}
      <AnimatePresence>
        {secretConsoleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSecretConsoleOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Panel (Cyber Terminal / Secret Box) */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className={`relative w-full max-w-lg rounded-2xl border p-6 shadow-2xl shadow-blue-500/5 z-10 font-mono ${
                tc('bg-[#070709] border-blue-500/20 text-white', 'bg-slate-900 border-blue-500/20 text-slate-100')
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setSecretConsoleOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/5 hover:border-white/20 bg-white/5 text-white/60 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Title Header */}
              <div className="flex flex-col items-center gap-2 mb-6 text-center">
                <div className="w-12 h-12 bg-blue-900/40 border border-blue-500/30 rounded-full flex items-center justify-center shadow-inner shadow-blue-500/20">
                  <span className="text-xl animate-pulse text-blue-400">⚡</span>
                </div>
                <h4 className="font-bold text-sm tracking-widest text-blue-400 uppercase">
                  CONSOLA INVISIBLE DE INYECCIÓN
                </h4>
                <p className="text-[10px] text-white/50 uppercase tracking-widest">
                  Canal directo de transmisión multimedia
                </p>
              </div>

              {/* Console Info text */}
              <div className="p-3 mb-4 rounded-lg bg-blue-500/5 border border-blue-500/10 text-[11px] text-blue-300 leading-relaxed">
                <span className="font-bold">CONSEJO:</span> Introduce cualquier enlace de vídeo (YouTube, Vimeo) o pega el bloque HTML completo de un código <span className="text-cyan-400 font-bold">embed iframe</span>. La red lo asimilará instantáneamente.
              </div>

              {/* Errors & Success Banners */}
              {secretConsoleError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                  <span className="font-bold">[ERR]:</span>
                  <span>{secretConsoleError}</span>
                </div>
              )}
              {secretConsoleSuccess && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2 animate-bounce">
                  <span className="font-bold">[SYS]:</span>
                  <span>{secretConsoleSuccess}</span>
                </div>
              )}

              {/* AUTHENTICATION FORMS */}
              <form onSubmit={handleSecretConsoleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-bold">
                    Enlace de vídeo o Código iframe Embed
                  </label>
                  <textarea
                    rows={4}
                    placeholder="https://www.youtube.com/watch?v=...&#10;O pega <iframe src=&quot;...&quot; ...></iframe>"
                    value={secretInputText}
                    onChange={(e) => setSecretInputText(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-white/10 bg-[#020203] text-blue-300 placeholder-white/20 focus:outline-none focus:border-blue-500 font-mono resize-none focus:ring-1 focus:ring-blue-500"
                    required
                    autoFocus
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 uppercase tracking-wider"
                >
                  Ejecutar Inyección ➔
                </button>
              </form>
              
              <div className="mt-4 text-center text-[9px] text-white/20 select-none">
                ATAJO GLOBAL: PEGA DIRECTAMENTE (CTRL+V) EN LA PÁGINA O ESCRIBE &quot;NOCTURNA&quot;
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
