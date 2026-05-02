'use client'

import { X, RefreshCcw, Plus, Check, Forward, Server } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { getThemeConfig } from '@/utils/theme';

const INTRO_END_TIME = 90; // Default skip to 1:30

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
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentProvider, setCurrentProvider] = useState(0);
  const [showProviderMenu, setShowProviderMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = getThemeConfig();

  const providers = [
    { 
      name: 'Server 1 (VidSrc.to)', 
      url: (type: string, id: string, s?: number, e?: number) => {
        if (type === 'tv') {
          return `https://vidsrc.to/embed/tv/${id}/${s}/${e}`;
        }
        return `https://vidsrc.to/embed/movie/${id}`;
      }
    },
    { 
      name: 'Server 2 (VidSrc.icu)', 
      url: (type: string, id: string, s?: number, e?: number) => {
        if (type === 'tv') {
          return `https://vidsrc.icu/embed/tv/${id}/${s}/${e}`;
        }
        return `https://vidsrc.icu/embed/movie/${id}`;
      }
    },
    { 
      name: 'Server 3 (MultiEmbed)', 
      url: (type: string, id: string, s?: number, e?: number) => {
        if (type === 'tv') {
          return `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${s}&e=${e}`;
        }
        return `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`;
      }
    },
    { 
      name: 'Server 4 (Embed-API)', 
      url: (type: string, id: string, s?: number, e?: number) => {
        if (type === 'tv') {
          return `https://player.embed-api.stream/?id=${id}&s=${s}&e=${e}`;
        }
        return `https://player.embed-api.stream/?id=${id}`;
      }
    },
    { 
      name: 'Server 5 (Vidplay)', 
      url: (type: string, id: string, s?: number, e?: number) => {
        if (type === 'tv') {
          return `https://vidplay.site/tv/tmdb-${id}-${s}-${e}`;
        }
        return `https://vidplay.site/movie/tmdb-${id}`;
      }
    },
    { 
      name: 'Server 6 (2Embed)', 
      url: (type: string, id: string, s?: number, e?: number) => {
        if (type === 'tv') {
          return `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`;
        }
        return `https://www.2embed.cc/embed/${id}`;
      }
    }
  ];

  useEffect(() => {
    if (showModal) {
      setIframeKey(prev => prev + 1);
      setTimeOffset(0);
      setSeason(1);
      setEpisode(1);
      setShowSkipButton(false);
      
      // Check session storage if already skipped for this movie
      const hasSkipped = sessionStorage.getItem(`skipped_${movie?.id}`);
      if (!hasSkipped) {
        const timer = setTimeout(() => {
          setShowSkipButton(true);
        }, 3000); // 3 seconds delay
        return () => clearTimeout(timer);
      }
    }
  }, [showModal, movie?.id]);

  useEffect(() => {
    setIframeKey(prev => prev + 1);
  }, [currentProvider]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [showModal]);

  // Close provider menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProviderMenu) {
        setShowProviderMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showProviderMenu]);

  if (!showModal || !movie) return null;

  // Robust media type detection
  const mediaType = movie?.media_type || (movie?.title ? 'movie' : 'tv');
  const movieId = movie?.id;

  // Try multiple common time parameters to increase compatibility
  const timeParams = timeOffset > 0 ? `&t=${timeOffset}&start=${timeOffset}` : '';
  const url = `${providers[currentProvider].url(mediaType, movieId, season, episode)}${timeParams}`;

  const handleSkipIntro = () => {
    sessionStorage.setItem(`skipped_${movie?.id}`, 'true');
    setShowSkipButton(false);
    setTimeOffset(INTRO_END_TIME);
    setIframeKey(prev => prev + 1); // Reload iframe with new time
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="absolute top-6 right-6 flex items-center space-x-3 z-50">
        {/* Provider Selection Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProviderMenu(!showProviderMenu)}
            className={`flex items-center space-x-2 px-4 py-2 bg-black/60 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition shadow-lg backdrop-blur-md`}
          >
            <Server className="h-4 w-4" />
            <span>{providers[currentProvider].name}</span>
          </button>
          
          {showProviderMenu && (
            <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl min-w-[220px] overflow-hidden">
              {providers.map((provider, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentProvider(index);
                    setShowProviderMenu(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm transition hover:bg-white/10 ${
                    currentProvider === index 
                      ? 'bg-white/15 text-white font-semibold' 
                      : 'text-gray-300'
                  }`}
                >
                  {provider.name}
                </button>
              ))}
            </div>
          )}
        </div>
        
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
      
      <div 
        ref={containerRef}
        className="w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative border border-white/5 flex items-center justify-center group"
      >
        <iframe 
          key={iframeKey}
          src={url} 
          className="w-full h-full" 
          frameBorder="0" 
          allowFullScreen
          allow="autoplay *; fullscreen *; picture-in-picture *; encrypted-media *; gyroscope; accelerometer"
        ></iframe>

        {/* Netflix-style Skip Intro Button */}
        <div 
          className={`absolute bottom-[15%] right-0 mb-4 mr-0 flex flex-col items-end space-y-4 transition-all duration-500 transform ${
            showSkipButton && isVisible 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-full pointer-events-none'
          }`}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); handleSkipIntro(); }}
            className="bg-black/70 hover:brightness-125 text-white font-bold py-2 px-6 border-2 border-white rounded-l-md transition-all duration-300 backdrop-blur-sm min-h-[44px] text-lg sm:text-xl flex items-center space-x-2 shadow-2xl"
          >
            <Forward className="h-5 w-5 sm:h-6 sm:w-6" />
            <span>SKIP INTRO</span>
          </button>
          
          {mediaType === 'tv' && (
            <button 
              onClick={(e) => { e.stopPropagation(); nextEpisode(); }}
              className="bg-black/70 hover:brightness-125 text-white font-bold py-2 px-6 border-2 border-white rounded-l-md transition-all duration-300 backdrop-blur-sm min-h-[44px] text-lg sm:text-xl flex items-center space-x-2 shadow-2xl"
            >
              <Forward className="h-5 w-5 sm:h-6 sm:w-6" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-sm sm:text-base uppercase">Next Episode</span>
                <span className="text-[10px] opacity-60 uppercase font-bold tracking-tighter">S{season} E{episode + 1}</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
