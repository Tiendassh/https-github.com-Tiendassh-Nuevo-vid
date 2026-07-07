'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Maximize2,
  Volume2
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

  // Tab state (Sidebar) - 'videos' | 'nginx'
  const [activeSidebarTab, setActiveSidebarTab] = useState<'videos' | 'nginx'>('videos');
  const [activeGuideTab, setActiveGuideTab] = useState<'render-standard' | 'render-docker' | 'vps'>('render-standard');
  const [copiedTextType, setCopiedTextType] = useState<string | null>(null);
  
  // UI preferences
  const [cinemaMode, setCinemaMode] = useState(false);
  const [glowEffect, setGlowEffect] = useState(true);

  // Telegram Group Config
  const [telegramUrl, setTelegramUrl] = useState('https://t.me/NocturnaPro');
  const [isEditingTelegram, setIsEditingTelegram] = useState(false);
  const [tempTelegramUrl, setTempTelegramUrl] = useState('https://t.me/NocturnaPro');

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
    let finalTelegram = 'https://t.me/NocturnaPro';
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

    setTimeout(() => {
      setVideos(loadedVideos);
      setActiveVideo(defaultActive);
      setTelegramUrl(finalTelegram);
      setTempTelegramUrl(finalTelegram);
      setAuthorName(finalAuthor);
      setMounted(true);
    }, 0);
  }, []);

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
    
    if (trimmed.includes('/embed/') || trimmed.includes('player.vimeo.com/video/')) {
      return trimmed;
    }
    
    // YouTube standard watch URL
    let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = trimmed.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=0&modestbranding=1`;
    }
    
    // Vimeo standard
    regExp = /^.*(vimeo\.com\/)((channels\/[a-z]+\/)|(groups\/[a-z]+\/videos\/)|(album\/\d+\/video\/))?(\d+)?.*/;
    match = trimmed.match(regExp);
    if (match && match[6]) {
      return `https://player.vimeo.com/video/${match[6]}?autoplay=1`;
    }
    
    return trimmed;
  }

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
    <div className="min-h-screen flex flex-col transition-all duration-300">
      
      {/* Dynamic Ambient Background Glow (Glow Effect behind active video) */}
      {glowEffect && !cinemaMode && (
        <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none z-0"></div>
      )}
      {glowEffect && !cinemaMode && (
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
      )}

      {/* TOP DECORATIVE HEADER (Professional Polish Nav Bar) */}
      <header className="border-b border-white/10 bg-[#0A0A0B] sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-white block">
                  NOCTURNA <span className="text-blue-500">PRO</span>
                </span>
              </div>
            </div>

            {/* Quick stats / Deployment status indicators */}
            <div className="hidden lg:flex gap-2">
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] uppercase tracking-widest font-semibold text-white/70">
                Deploy: Render
              </div>
              <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded text-[10px] uppercase tracking-widest font-semibold">
                Nginx: Up
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Author Name Badge styled matching the theme */}
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded px-3 py-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              <span className="text-xs font-mono text-white/50">Usuario:</span>
              <input 
                type="text" 
                value={authorName} 
                onChange={(e) => {
                  setAuthorName(e.target.value);
                  localStorage.setItem('nocturnal_author_name', e.target.value);
                }}
                placeholder="Tu usuario..."
                className="bg-transparent text-xs text-blue-400 font-semibold focus:outline-none w-28 text-left border-b border-transparent hover:border-white/20 focus:border-blue-500"
              />
            </div>

            {/* Cinema Mode Switch */}
            <button 
              id="btn-cinema"
              onClick={() => setCinemaMode(!cinemaMode)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border transition-all ${
                cinemaMode 
                  ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 font-medium' 
                  : 'bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/10'
              }`}
              title="Alternar Modo Cine"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{cinemaMode ? 'Salir Cine' : 'Modo Cine'}</span>
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
                onClick={() => {
                  setTempTelegramUrl(telegramUrl);
                  setIsEditingTelegram(!isEditingTelegram);
                }}
                className={`p-1.5 rounded border transition-all ${
                  isEditingTelegram 
                    ? 'bg-blue-600/20 text-blue-400 border-blue-500/40' 
                    : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'
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
                    className="absolute right-0 top-11 z-50 bg-[#0A0A0B] border border-white/10 p-3 rounded-lg shadow-xl w-64 flex flex-col gap-2.5"
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
                          setTelegramUrl(finalUrl || 'https://t.me/NocturnaPro');
                          localStorage.setItem('nocturnal_telegram_url', finalUrl || 'https://t.me/NocturnaPro');
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
            {glowEffect && (
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>
            )}
            
            <div className="relative z-10 w-full rounded-2xl overflow-hidden bg-black border border-white/10 aspect-video flex flex-col justify-between shadow-2xl">
              {activeVideo ? (
                <iframe
                  id="main-video-iframe"
                  src={activeVideo.url}
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white/50">
                  <Play className="w-12 h-12 text-white/20 mb-2 animate-bounce" />
                  <p>Selecciona un video de la barra lateral para reproducir.</p>
                </div>
              )}
            </div>
          </div>

          {/* ACTIVE VIDEO INFO METADATA */}
          {activeVideo && (
            <div id="video-metadata-card" className="bg-[#0A0A0B]/80 border border-white/10 rounded-2xl p-6 glow-shadow">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 font-mono tracking-wider font-semibold px-2.5 py-0.5 rounded border border-blue-500/20 uppercase">
                      {activeVideo.category}
                    </span>
                    <span className="text-xs text-white/50 font-mono">ID: {activeVideo.id}</span>
                  </div>
                  <h1 className="text-2xl font-semibold text-white tracking-tight leading-snug">
                    {activeVideo.title}
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      copyToClipboard(activeVideo.url, 'embed-url');
                    }}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-white/80 hover:text-white px-4 py-2 rounded transition-all"
                  >
                    {copiedTextType === 'embed-url' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-blue-400 animate-scale" />
                        <span className="text-blue-400">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-white/60" />
                        <span>Share</span>
                      </>
                    )}
                  </button>

                  {activeVideo.isCustom && (
                    <button
                      onClick={(e) => handleDeleteVideo(activeVideo.id, e)}
                      className="bg-red-500/10 border border-red-500/20 hover:border-red-500 hover:bg-red-500/20 text-xs text-red-400 hover:text-white px-4 py-2 rounded transition-all flex items-center gap-1.5"
                      title="Eliminar este video personalizado"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="h-px bg-white/10 my-4"></div>

              <div>
                <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                  <span>Canal Autor:</span>
                  <span className="text-xs font-semibold text-white">{activeVideo.author}</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed bg-white/5 p-4 rounded border border-white/10">
                  {activeVideo.description}
                </p>
              </div>
            </div>
          )}

          {/* QUALITY FOOTER COMMENTS SECTION (Al pie del reproductor) */}
          <div id="comments-section" className="bg-[#0A0A0B]/80 border border-white/10 rounded-2xl p-6 glow-shadow flex flex-col gap-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <h3 className="font-sans font-semibold text-sm uppercase tracking-wider text-white">Comments</h3>
                <span className="text-xs bg-white/5 text-white/60 px-2.5 py-1 rounded border border-white/10 font-mono">
                  {comments.length}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Search Comments */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Buscar comentarios..."
                    value={commentSearch}
                    onChange={(e) => setCommentSearch(e.target.value)}
                    className="bg-[#050506] border border-white/10 rounded py-1.5 pl-9 pr-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-500 w-44"
                  />
                </div>

                {/* Sort selector */}
                <button
                  onClick={() => setCommentSort(commentSort === 'rating' ? 'newest' : 'rating')}
                  className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded transition-all"
                >
                  <Sliders className="w-3 h-3 text-blue-500" />
                  <span>
                    Sort: {commentSort === 'rating' ? 'Relevancia' : 'Recientes'}
                  </span>
                </button>
              </div>
            </div>

            {/* Comment Input Form */}
            <form onSubmit={handleAddComment} className="bg-[#0A0A0B] p-4 rounded-xl border border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                  {authorName ? authorName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/50 font-medium">Publicar como:</span>
                    <span className="text-xs font-mono text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded">
                      {authorName || 'AnonDev'}
                    </span>
                  </div>
                  
                  <textarea
                    placeholder="Escribe un comentario técnico o de apreciación..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={2}
                    className="w-full bg-[#050506] text-white text-sm p-3 rounded border border-white/10 focus:outline-none focus:border-blue-500 resize-none placeholder-white/30"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-white/5 disabled:text-white/30 text-white font-semibold text-xs px-4 py-2 rounded transition-all flex items-center gap-1.5"
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
                      className="p-4 rounded-xl bg-[#0A0A0B]/40 border border-white/10 flex flex-col gap-3"
                    >
                      {/* Comment Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded bg-gradient-to-tr ${comment.avatarColor} flex items-center justify-center font-bold text-white text-xs`}>
                            {comment.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-white/90">{comment.author}</span>
                            <span className="text-[10px] text-white/40 block">{comment.timestamp}</span>
                          </div>
                        </div>

                        {/* Voting controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleVote(comment.id, 'up')}
                            className={`p-1.5 rounded transition-colors ${
                              comment.userVote === 'up'
                                ? 'bg-blue-500/10 text-blue-400'
                                : 'text-white/40 hover:text-white'
                            }`}
                            title="Me gusta"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <span className={`text-xs font-mono min-w-4 text-center ${
                            comment.rating > 0 
                              ? 'text-blue-400 font-medium' 
                              : comment.rating < 0 
                                ? 'text-red-400' 
                                : 'text-white/40'
                          }`}>
                            {comment.rating}
                          </span>
                          <button
                            onClick={() => handleVote(comment.id, 'down')}
                            className={`p-1.5 rounded transition-colors ${
                              comment.userVote === 'down'
                                ? 'bg-red-500/10 text-red-400'
                                : 'text-white/40 hover:text-white'
                            }`}
                            title="No me gusta"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Comment Text */}
                      <p className="text-sm text-white/80 leading-relaxed pl-1">
                        {comment.text}
                      </p>

                      {/* Comment Actions Footer */}
                      <div className="flex items-center gap-4 pl-1">
                        <button
                          onClick={() => {
                            setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
                          }}
                          className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors"
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
                            className="overflow-hidden pl-6 border-l border-white/10 my-1"
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
                                className="flex-1 bg-[#050506] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500"
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
                        <div className="mt-2 pl-4 border-l-2 border-white/10 flex flex-col gap-3">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="p-3 rounded bg-[#050506]/40 border border-white/5 flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded bg-gradient-to-tr ${reply.avatarColor} flex items-center justify-center font-bold text-white text-[10px]`}>
                                  {reply.author.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <span className="text-xs font-semibold text-white/95">{reply.author}</span>
                                  <span className="text-[9px] text-white/40 ml-1.5">{reply.timestamp}</span>
                                </div>
                              </div>
                              <p className="text-xs text-white/80 leading-normal pl-1">
                                {reply.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-[#050506]/30 rounded-xl border border-dashed border-white/10 text-white/40">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="text-xs font-mono uppercase tracking-wider">NINGÚN COMENTARIO COINCIDE CON TU BÚSQUEDA.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR TABS (VIDEOS / DEPLOYMENT) */}
        {!cinemaMode && (
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* TABS SWITCHER */}
            <div className="bg-[#0A0A0B] p-1.5 rounded-xl border border-white/10 flex items-center gap-1.5">
              <button
                onClick={() => setActiveSidebarTab('videos')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-xs font-semibold tracking-tight transition-all ${
                  activeSidebarTab === 'videos'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25'
                    : 'text-white/60 hover:text-white border border-transparent'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explorar Videos</span>
              </button>
              
              <button
                id="btn-tab-nginx"
                onClick={() => setActiveSidebarTab('nginx')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-xs font-semibold tracking-tight transition-all ${
                  activeSidebarTab === 'nginx'
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25'
                    : 'text-white/60 hover:text-white border border-transparent'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>Nginx / Render Hub</span>
              </button>
            </div>

            {/* TAB CONTENT: VIDEOS */}
            {activeSidebarTab === 'videos' && (
              <div className="flex flex-col gap-4">
                
                {/* Curator Header & Add Custom Video Button */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Canales Curados ({videos.length})</span>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir Video</span>
                  </button>
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
                      className="bg-[#0A0A0B] p-4 rounded-xl border border-white/10 glow-shadow flex flex-col gap-3 overflow-hidden"
                    >
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Plus className="w-3.5 h-3.5 text-blue-500" />
                        <span>Añadir Video Custom (Embed)</span>
                      </h4>

                      {formError && (
                        <div className="text-[11px] text-red-400 bg-red-500/5 border border-red-500/10 px-3 py-2 rounded">
                          {formError}
                        </div>
                      )}

                      <div>
                        <label className="text-[10px] text-white/50 font-semibold block mb-1">Título del Video *</label>
                        <input
                          type="text"
                          placeholder="p.ej., Chill Cyber Lounge Synth"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full bg-[#050506] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-white/50 font-semibold block mb-1">URL o Enlace de Compartir *</label>
                        <input
                          type="text"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={newUrl}
                          onChange={(e) => setNewUrl(e.target.value)}
                          className="w-full bg-[#050506] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                        <span className="text-[9px] text-white/40 block mt-1">
                          Aceptamos enlaces estándar de YouTube, Vimeo, Twitch o embeds limpios.
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-white/50 font-semibold block mb-1">Categoría</label>
                          <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full bg-[#050506] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                          >
                            <option value="Música & Chill">Música & Chill</option>
                            <option value="Programación / ASMR">Programación / ASMR</option>
                            <option value="Aesthetic / Visual">Aesthetic / Visual</option>
                            <option value="Ciencia / Relax">Ciencia / Relax</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-white/50 font-semibold block mb-1">Autor</label>
                          <input
                            type="text"
                            placeholder="Canal o Autor"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            className="w-full bg-[#050506] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-white/50 font-semibold block mb-1">Descripción</label>
                        <textarea
                          placeholder="Breve descripción del video o vibes nocturnas..."
                          value={newDescription}
                          onChange={(e) => setNewDescription(e.target.value)}
                          rows={2}
                          className="w-full bg-[#050506] border border-white/10 rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                        />
                      </div>

                      <div className="flex gap-2 justify-end mt-1">
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="bg-white/5 border border-white/10 text-white/80 text-xs px-3 py-1.5 rounded hover:bg-white/10 transition-all"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded transition-all flex items-center gap-1"
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
                            ? 'bg-gradient-to-r from-blue-500/10 to-[#0A0A0B] border-blue-500/45 glow-shadow' 
                            : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Left visual representation / Thumbnail container */}
                          <div className={`w-14 h-14 rounded flex items-center justify-center transition-all shrink-0 ${
                            isActive 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-white/5 text-white/40 group-hover:text-blue-400'
                          }`}>
                            <Film className="w-5 h-5" />
                          </div>

                          {/* Metadata */}
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] text-blue-500 font-mono block uppercase tracking-widest mb-0.5">{video.category}</span>
                            <h5 className={`text-xs font-bold truncate leading-snug ${
                              isActive ? 'text-white' : 'text-white/80 group-hover:text-white'
                            }`}>
                              {video.title}
                            </h5>
                            <span className="text-[10px] text-white/40 block truncate mt-0.5">Autor: {video.author}</span>
                          </div>

                          {/* Quick delete for custom videos */}
                          {video.isCustom && (
                            <button
                              onClick={(e) => handleDeleteVideo(video.id, e)}
                              className="p-1 rounded text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors absolute top-2 right-2 opacity-0 group-hover:opacity-100"
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
                <div className="bg-blue-500/5 border border-blue-500/15 p-4 rounded-xl flex items-start gap-3">
                  <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-white mb-1">Configuración Reverse Proxy</p>
                    <p className="text-white/70 leading-relaxed">
                      Utiliza estas plantillas para orquestar Next.js con un proxy reverso <strong>Nginx</strong> para desplegar en <strong>Render</strong> de forma segura con cabeceras avanzadas.
                    </p>
                  </div>
                </div>

                {/* 1. Nginx Config file */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white/80 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      <span>nginx.conf</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(NGINX_CONF, 'nginx')}
                      className="text-[10px] font-mono flex items-center gap-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 hover:text-blue-400 px-2.5 py-1 rounded transition-colors"
                    >
                      {copiedTextType === 'nginx' ? (
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
                  <pre className="text-[10px] font-mono text-white/60 bg-[#050506] p-3 rounded border border-white/10 overflow-x-auto max-h-48 leading-relaxed">
                    {NGINX_CONF}
                  </pre>
                </div>

                {/* 2. Dockerfile configuration */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white/80 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      <span>Dockerfile</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(DOCKERFILE, 'dockerfile')}
                      className="text-[10px] font-mono flex items-center gap-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 hover:text-blue-400 px-2.5 py-1 rounded transition-colors"
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
                  <pre className="text-[10px] font-mono text-white/60 bg-[#050506] p-3 rounded border border-white/10 overflow-x-auto max-h-48 leading-relaxed">
                    {DOCKERFILE}
                  </pre>
                </div>

                {/* 3. supervisord.conf configuration */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white/80 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>supervisord.conf</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(SUPERVISORD_CONF, 'supervisord')}
                      className="text-[10px] font-mono flex items-center gap-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 hover:text-blue-400 px-2.5 py-1 rounded transition-colors"
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
                  <pre className="text-[10px] font-mono text-white/60 bg-[#050506] p-3 rounded border border-white/10 overflow-x-auto max-h-40 leading-relaxed">
                    {SUPERVISORD_CONF}
                  </pre>
                </div>

                {/* 4. Render Blueprint render.yaml */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white/80 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>render.yaml</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(RENDER_YAML, 'render')}
                      className="text-[10px] font-mono flex items-center gap-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 hover:text-blue-400 px-2.5 py-1 rounded transition-colors"
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
                  <pre className="text-[10px] font-mono text-white/60 bg-[#050506] p-3 rounded border border-white/10 overflow-x-auto max-h-40 leading-relaxed">
                    {RENDER_YAML}
                  </pre>
                </div>

                {/* 5. Spanish deployment guide steps (Interactive Render vs VPS) */}
                <div className="bg-[#0A0A0B] p-4 rounded-xl border border-white/10 flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                      <span>Guía de Despliegue en Render / VPS</span>
                    </h4>
                    
                    {/* Toggle selector */}
                    <div className="bg-[#050506] p-0.5 rounded border border-white/10 flex flex-wrap items-center gap-0.5 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setActiveGuideTab('render-standard')}
                        className={`px-2.5 py-1 rounded text-[10px] font-semibold tracking-tight transition-all ${
                          activeGuideTab === 'render-standard'
                            ? 'bg-blue-600/15 text-blue-400'
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        Render Estándar
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveGuideTab('render-docker')}
                        className={`px-2.5 py-1 rounded text-[10px] font-semibold tracking-tight transition-all ${
                          activeGuideTab === 'render-docker'
                            ? 'bg-blue-600/15 text-blue-400'
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        Render Docker
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveGuideTab('vps')}
                        className={`px-2.5 py-1 rounded text-[10px] font-semibold tracking-tight transition-all ${
                          activeGuideTab === 'vps'
                            ? 'bg-blue-600/15 text-blue-400'
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        VPS sin Cloudflare
                      </button>
                    </div>
                  </div>

                  {/* Render Standard Guide Content */}
                  {activeGuideTab === 'render-standard' && (
                    <div className="flex flex-col gap-3">
                      <p className="text-[11px] text-white/60">
                        La forma recomendada y más rápida de subir a <strong>Render</strong> de forma nativa sin Docker:
                      </p>

                      <ol className="text-[11px] text-white/80 list-decimal pl-4 space-y-2.5 leading-relaxed">
                        <li>
                          <span className="font-bold text-white">Configurar el &ldquo;Root Directory&rdquo; (CRÍTICO):</span>
                          <span className="block text-white/60 mt-0.5">
                            Si tus archivos están dentro de una carpeta contenedora en tu GitHub (ej: <code className="font-mono text-[10px] text-amber-400">ai-studio-applet</code>), ve a <strong>Settings &rarr; Root Directory</strong> en el panel de Render y escribe el nombre de esa carpeta. Si no lo haces, obtendrás el error: <code className="font-mono text-red-400 text-[10px]">&ldquo;Couldn&apos;t find a package.json file&rdquo;</code>.
                          </span>
                        </li>
                        <li>
                          <span className="font-bold text-white">Crear un servicio web (Web Service):</span> Conecta tu cuenta de GitHub, selecciona el repositorio y elige el entorno <strong>Node</strong>.
                        </li>
                        <li>
                          <span className="font-bold text-white">Comandos de Construcción y Arranque:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                            <div className="bg-[#050506] p-2 rounded border border-white/5">
                              <span className="text-[9px] text-white/40 block mb-0.5 font-semibold">BUILD COMMAND</span>
                              <code className="font-mono text-blue-400 text-[10px]">npm install && npm run build</code>
                            </div>
                            <div className="bg-[#050506] p-2 rounded border border-white/5">
                              <span className="text-[9px] text-white/40 block mb-0.5 font-semibold">START COMMAND</span>
                              <code className="font-mono text-emerald-400 text-[10px]">npm run start</code>
                            </div>
                          </div>
                        </li>
                        <li>
                          <span className="font-bold text-white">Variables de Entorno:</span> Agrega tu clave <code className="font-mono text-blue-400">GEMINI_API_KEY</code> en la pestaña <strong>Environment</strong> de tu Web Service.
                        </li>
                      </ol>

                      {/* No Domain Information Box */}
                      <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-lg flex items-start gap-2.5 mt-1">
                        <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <div className="text-[10px]">
                          <span className="font-bold text-white block mb-0.5">¿No tienes un dominio propio?</span>
                          <span className="text-white/60">
                            ¡No te preocupes! Render te asignará automáticamente un subdominio gratuito y seguro con SSL (ej: <code className="font-mono text-blue-400 text-[9px]">https://tu-app.onrender.com</code>). No necesitas configurar DNS ni comprar un dominio para ver tu aplicación en vivo.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Render Docker Guide Content */}
                  {activeGuideTab === 'render-docker' && (
                    <div className="flex flex-col gap-3">
                      <p className="text-[11px] text-white/60">
                        Despliegue avanzado usando contenedores Docker con el servidor web Nginx como proxy inverso y Supervisor:
                      </p>

                      <ol className="text-[11px] text-white/80 list-decimal pl-4 space-y-2.5 leading-relaxed">
                        <li>Coloca los archivos <code className="font-mono text-blue-400">nginx.conf</code>, <code className="font-mono text-purple-400">Dockerfile</code>, <code className="font-mono text-emerald-400">supervisord.conf</code> y <code className="font-mono text-amber-400">render.yaml</code> en la carpeta de tu código.</li>
                        <li>Sube tu código a un repositorio de GitHub.</li>
                        <li>
                          <span className="font-bold text-white">Ajustar &ldquo;Root Directory&rdquo; (Obligatorio si usas carpetas):</span>
                          <span className="block text-white/60 mt-0.5">
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
                    <div className="flex flex-col gap-3 text-[11px] text-white/80 leading-relaxed">
                      <p className="text-white/60">
                        Para alojar en tu propio VPS (Ubuntu/Debian) con DNS directo (sin proxy de Cloudflare), sigue estos pasos profesionales:
                      </p>
                      
                      <div className="flex flex-col gap-3 mt-1">
                        <div>
                          <span className="font-bold text-white block mb-0.5">1. Configurar Registro DNS (Registro A)</span>
                          <span className="text-white/60">
                            En tu proveedor de dominio, apunta un registro <code className="font-mono text-blue-400 text-[10px]">A</code> directamente a la <strong>IP pública de tu VPS</strong>. Asegúrate de desactivar la opción proxy (en Cloudflare pon &ldquo;Solo DNS / DNS Only&rdquo; para desactivar el CDN y permitir validación SSL directa de Let&apos;s Encrypt).
                          </span>
                        </div>

                        <div>
                          <span className="font-bold text-white block mb-0.5">2. Instalar dependencias en el VPS</span>
                          <span className="text-white/60 block mb-1">
                            Instala el servidor web Nginx y el cliente Certbot para gestionar certificados SSL automáticos:
                          </span>
                          <pre className="text-[10px] font-mono bg-[#050506] p-2 rounded border border-white/5 overflow-x-auto text-blue-400 leading-normal">
                            sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx
                          </pre>
                        </div>

                        <div>
                          <span className="font-bold text-white block mb-0.5">3. Configurar bloque de servidor en Nginx</span>
                          <span className="text-white/60 block mb-1">
                            Crea un archivo de configuración en <code className="font-mono text-amber-400">/etc/nginx/sites-available/nocturna</code> con el proxy reverso directo apuntando al puerto 3000:
                          </span>
                          <pre className="text-[9px] font-mono bg-[#050506] p-2.5 rounded border border-white/5 overflow-x-auto text-white/50 leading-normal max-h-36">
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
                          <span className="text-white/40 text-[10px] mt-1 block">
                            Habilítalo con: <code className="font-mono text-[9px] text-white/50">sudo ln -s /etc/nginx/sites-available/nocturna /etc/nginx/sites-enabled/</code> y verifica con <code className="font-mono text-[9px] text-white/50">sudo nginx -t && sudo systemctl restart nginx</code>.
                          </span>
                        </div>

                        <div>
                          <span className="font-bold text-white block mb-0.5">4. Compilar e Iniciar la App (Puerto 3000)</span>
                          <span className="text-white/60">
                            Sube el código a tu VPS, instala dependencias, compila e inicia Next.js usando un gestor de procesos como PM2 para que corra en segundo plano permanentemente:
                            <code className="font-mono text-[10px] text-blue-400 block mt-1 bg-[#050506] p-1.5 rounded border border-white/5">
                              {"npm install && npm run build && pm2 start npm --name \"nocturna\" -- start"}
                            </code>
                          </span>
                        </div>

                        <div>
                          <span className="font-bold text-white block mb-0.5">5. Instalar Certificado SSL Certbot</span>
                          <span className="text-white/60">
                            Genera tus certificados SSL directamente. Certbot validará tu dominio de forma transparente y reconfigurará Nginx para forzar HTTPS de forma segura:
                            <code className="font-mono text-[10px] text-emerald-400 block mt-1 bg-[#050506] p-1.5 rounded border border-white/5">
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
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#0A0A0B] text-white/40 py-6 mt-auto text-xs font-mono transition-colors duration-300">
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
    </div>
  );
}
