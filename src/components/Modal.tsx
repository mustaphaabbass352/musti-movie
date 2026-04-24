'use client'

import { X, RefreshCcw, Monitor, Server } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getThemeConfig } from '@/utils/theme';

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  movie: any;
}

const SERVERS = [
  { id: 'vidsrc-to', name: 'Server 1 (HD)', url: (type: string, id: string) => `https://vidsrc.to/embed/${type}/${id}` },
  { id: 'vidsrc-me', name: 'Server 2 (Multi)', url: (type: string, id: string) => `https://vidsrc.me/embed/${type}?tmdb=${id}` },
  { id: 'embed-su', name: 'Server 3 (Fast)', url: (type: string, id: string) => `https://embed.su/embed/${type}/${id}` },
  { id: 'vidsrc-cc', name: 'Server 4 (Backup)', url: (type: string, id: string) => `https://vidsrc.cc/v2/embed/${type}/${id}` },
];

const Modal = ({ showModal, setShowModal, movie }: Props) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [activeServer, setActiveServer] = useState(SERVERS[0]);
  const theme = getThemeConfig();

  useEffect(() => {
    if (showModal) {
      setIframeKey(prev => prev + 1);
      setActiveServer(SERVERS[0]); // Reset to default server when modal opens
    }
  }, [showModal]);

  if (!showModal || !movie) return null;

  // Robust media type detection
  const mediaType = movie?.media_type || (movie?.title ? 'movie' : 'tv');
  const movieId = movie?.id;

  const url = activeServer.url(mediaType, movieId);

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  const handleServerChange = (server: typeof SERVERS[0]) => {
    setActiveServer(server);
    setIframeKey(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
      <div className="w-full max-w-6xl mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {SERVERS.map((server) => (
            <button
              key={server.id}
              onClick={() => handleServerChange(server)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                activeServer.id === server.id
                  ? `${theme.accentColor} text-black border-transparent shadow-lg scale-105`
                  : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
              }`}
            >
              <Server className="h-4 w-4" />
              <span className="whitespace-nowrap">{server.name}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
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
      
      <div className="mt-4 text-center text-gray-400 text-sm">
        <p>Tip: If Server 1 is slow or in CAM quality, try switching to other servers.</p>
      </div>
    </div>
  );
};

export default Modal;
