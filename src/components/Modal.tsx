'use client'

import { X, RefreshCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getThemeConfig } from '@/utils/theme';

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  movie: any;
}

const Modal = ({ showModal, setShowModal, movie }: Props) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [activeProvider, setActiveProvider] = useState(0);
  const theme = getThemeConfig();

  const providers = [
    { name: 'Server 1', url: (type: string, id: string) => `https://vidsrc.me/embed/${type}?tmdb=${id}` },
    { name: 'Server 2', url: (type: string, id: string) => `https://vidsrc.cc/v2/embed/${type}/${id}` },
    { name: 'Server 3', url: (type: string, id: string) => `https://vidsrc.to/embed/${type}/${id}` },
    { name: 'Server 4', url: (type: string, id: string) => `https://vidsrc.xyz/embed/${type}/${id}` },
    { name: 'Server 5', url: (type: string, id: string) => `https://embed.su/embed/${type}/${id}` },
  ];

  useEffect(() => {
    if (showModal) {
      setIframeKey(prev => prev + 1);
      setActiveProvider(0); // Reset to default provider when opening new movie
    }
  }, [showModal]);

  if (!showModal || !movie) return null;

  // Robust media type detection
  const mediaType = movie?.media_type || (movie?.title ? 'movie' : 'tv');
  const movieId = movie?.id;

  const url = providers[activeProvider].url(mediaType, movieId);

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  const handleSwitchProvider = () => {
    setActiveProvider((prev) => (prev + 1) % providers.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
      <div className="absolute top-6 right-6 flex items-center space-x-3 z-50">
        <button 
          onClick={handleSwitchProvider}
          className={`flex items-center space-x-2 px-4 py-2 bg-black/60 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/10 transition shadow-lg backdrop-blur-md`}
        >
          <span className={theme.isEventActive ? theme.primaryColor : 'text-red-500'}>●</span>
          <span>{providers[activeProvider].name}</span>
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
      
      <div className="w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative border border-white/5 flex items-center justify-center">
        <iframe 
          key={iframeKey}
          src={url} 
          className="w-full h-full" 
          frameBorder="0" 
          allowFullScreen
          allow="autoplay *; fullscreen *; picture-in-picture *; encrypted-media *; gyroscope; accelerometer"
        ></iframe>
      </div>
    </div>
  );
};

export default Modal;
