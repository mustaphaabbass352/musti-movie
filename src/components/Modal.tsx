'use client'

import { X, RefreshCcw, Plus, Check, Forward } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getThemeConfig } from '@/utils/theme';

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  movie: any;
  toggleWatchlist: (movie: any) => void;
  isInWatchlist: boolean;
}

const Modal = ({ showModal, setShowModal, movie, toggleWatchlist, isInWatchlist }: Props) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [timeOffset, setTimeOffset] = useState(0);
  const theme = getThemeConfig();

  const provider = { name: 'Server 1', url: (type: string, id: string) => `https://vidsrc.me/embed/${type}?tmdb=${id}` };

  useEffect(() => {
    if (showModal) {
      setIframeKey(prev => prev + 1);
      setTimeOffset(0); // Reset time offset
    }
  }, [showModal]);

  if (!showModal || !movie) return null;

  // Robust media type detection
  const mediaType = movie?.media_type || (movie?.title ? 'movie' : 'tv');
  const movieId = movie?.id;

  // Some providers support ?t= or &t= seconds. We add it to the URL.
  // We use &t= because most of these providers already have ? in their base URL.
  const url = `${provider.url(mediaType, movieId)}${timeOffset > 0 ? `&t=${timeOffset}` : ''}`;

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  const skipTime = (seconds: number) => {
    setTimeOffset(prev => prev + seconds);
    setIframeKey(prev => prev + 1); // Reload iframe with new time
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
      <div className="absolute top-6 right-6 flex items-center space-x-3 z-50">
        <button 
          onClick={() => toggleWatchlist(movie)}
          className={`flex items-center space-x-2 px-4 py-2 bg-black/60 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition shadow-lg backdrop-blur-md`}
          title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          {isInWatchlist ? <Check className={`h-5 w-5 ${theme.isEventActive ? theme.primaryColor : 'text-green-500'}`} /> : <Plus className="h-5 w-5" />}
          <span>Watchlist</span>
        </button>
        <button 
          onClick={handleRefresh}
          className={`text-white ${theme.isEventActive ? 'hover:' + theme.primaryColor : 'hover:text-red-600'} transition p-2 bg-black/50 rounded-full shadow-lg border border-white/20`}
          title="Refresh Player"
        >
          <RefreshCcw className="h-6 w-6" />
        </button>
        <button 
          onClick={() => setShowModal(false)}
          className={`text-white ${theme.isEventActive ? 'hover:' + theme.primaryColor : 'hover:text-red-600'} transition p-2 bg-black/50 rounded-full shadow-lg border border-white/20`}
        >
          <X className="h-8 w-8" />
        </button>
      </div>
      
      <div className="w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative border border-white/5 flex items-center justify-center group">
        <iframe 
          key={iframeKey}
          src={url} 
          className="w-full h-full" 
          frameBorder="0" 
          allowFullScreen
          allow="autoplay *; fullscreen *; picture-in-picture *; encrypted-media *; gyroscope; accelerometer"
        ></iframe>

        {/* Skip Controls Overlay */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <button 
            onClick={(e) => { e.stopPropagation(); skipTime(30); }}
            className="pointer-events-auto flex items-center space-x-2 px-4 py-2 bg-black/80 hover:bg-white/20 text-white rounded-full border border-white/30 backdrop-blur-md transition text-xs font-bold"
          >
            <Forward className="h-4 w-4" />
            <span>Skip Recap</span>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); skipTime(85); }}
            className="pointer-events-auto flex items-center space-x-2 px-4 py-2 bg-black/80 hover:bg-white/20 text-white rounded-full border border-white/30 backdrop-blur-md transition text-xs font-bold"
          >
            <Forward className="h-4 w-4" />
            <span>Skip Intro</span>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); skipTime(180); }}
            className="pointer-events-auto flex items-center space-x-2 px-4 py-2 bg-black/80 hover:bg-white/20 text-white rounded-full border border-white/30 backdrop-blur-md transition text-xs font-bold"
          >
            <Forward className="h-4 w-4" />
            <span>Skip Credits</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
