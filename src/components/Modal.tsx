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
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const theme = getThemeConfig();

  const provider = { 
    name: 'Server 1', 
    url: (type: string, id: string, s?: number, e?: number) => {
      if (type === 'tv') {
        // vidsrc.me often handles time parameters better with &t= or &start=
        return `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`;
      }
      return `https://vidsrc.me/embed/movie?tmdb=${id}`;
    }
  };

  useEffect(() => {
    if (showModal) {
      setIframeKey(prev => prev + 1);
      setTimeOffset(0); // Reset time offset
      setSeason(1); // Default to season 1
      setEpisode(1); // Default to episode 1
    }
  }, [showModal]);

  if (!showModal || !movie) return null;

  // Robust media type detection
  const mediaType = movie?.media_type || (movie?.title ? 'movie' : 'tv');
  const movieId = movie?.id;

  // Try multiple common time parameters to increase compatibility
  const timeParams = timeOffset > 0 ? `&t=${timeOffset}&start=${timeOffset}` : '';
  const url = `${provider.url(mediaType, movieId, season, episode)}${timeParams}`;

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  const skipTime = (seconds: number) => {
    setTimeOffset(prev => prev + seconds);
    setIframeKey(prev => prev + 1); // Reload iframe with new time
  };

  const nextEpisode = () => {
    setEpisode(prev => prev + 1);
    setTimeOffset(0);
    setIframeKey(prev => prev + 1);
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

      {mediaType === 'tv' && (
        <div className="absolute bottom-6 left-6 z-50 flex items-center space-x-4 bg-black/60 p-3 rounded-xl border border-white/20 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col">
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 ml-1">Season</label>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setSeason(Math.max(1, season - 1))}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-white text-sm transition"
              >-</button>
              <span className={`text-lg font-bold min-w-[20px] text-center ${theme.isEventActive ? theme.primaryColor : 'text-red-500'}`}>{season}</span>
              <button 
                onClick={() => setSeason(season + 1)}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-white text-sm transition"
              >+</button>
            </div>
          </div>
          
          <div className="w-px h-10 bg-white/10 mx-2" />

          <div className="flex flex-col">
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 ml-1">Episode</label>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setEpisode(Math.max(1, episode - 1))}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-white text-sm transition"
              >-</button>
              <span className={`text-lg font-bold min-w-[20px] text-center ${theme.isEventActive ? theme.primaryColor : 'text-red-500'}`}>{episode}</span>
              <button 
                onClick={() => setEpisode(episode + 1)}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-white text-sm transition"
              >+</button>
            </div>
          </div>
        </div>
      )}
      
      <div className="w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative border border-white/5 flex items-center justify-center group">
        <iframe 
          key={iframeKey}
          src={url} 
          className="w-full h-full" 
          frameBorder="0" 
          allowFullScreen
          allow="autoplay *; fullscreen *; picture-in-picture *; encrypted-media *; gyroscope; accelerometer"
        ></iframe>

        {/* Netflix-style Skip Controls Overlay (TV Shows Only) */}
        {mediaType === 'tv' && (
          <div className="absolute bottom-16 right-10 flex flex-col space-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <button 
              onClick={(e) => { e.stopPropagation(); skipTime(85); }}
              className="pointer-events-auto flex items-center space-x-3 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/40 backdrop-blur-lg transition-all duration-300 text-lg font-medium tracking-wide shadow-2xl"
              style={{ minWidth: '180px' }}
            >
              <Forward className="h-6 w-6" />
              <span>Skip Intro</span>
            </button>
            
            <button 
              onClick={(e) => { e.stopPropagation(); nextEpisode(); }}
              className="pointer-events-auto flex items-center space-x-3 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/40 backdrop-blur-lg transition-all duration-300 text-lg font-medium tracking-wide shadow-2xl"
              style={{ minWidth: '180px' }}
            >
              <Forward className="h-6 w-6" />
              <div className="flex flex-col items-start">
                <span>Next Episode</span>
                <span className="text-[10px] opacity-60 uppercase font-bold tracking-tighter">S{season} E{episode + 1}</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
