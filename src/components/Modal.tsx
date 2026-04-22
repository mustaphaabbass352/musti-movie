'use client'

import { X, ExternalLink, RefreshCcw } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  movie: any;
}

const Modal = ({ showModal, setShowModal, movie }: Props) => {
  const [provider, setProvider] = useState('vidsrc.net');
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (showModal) {
      setIframeKey(prev => prev + 1);
    }
  }, [showModal, provider]);

  if (!showModal || !movie) return null;

  // Robust media type detection
  const mediaType = movie?.media_type || (movie?.title ? 'movie' : 'tv');
  const movieId = movie?.id;
  const movieTitle = movie?.title || movie?.name;

  let url = '';
  if (provider === 'vidsrc.net') {
    url = `https://vidsrc.net/embed/${mediaType}/${movieId}`;
  } else if (provider === 'vidsrc.me') {
    url = `https://vidsrc.me/embed/${mediaType}/${movieId}`;
  } else if (provider === 'vidsrc.pm') {
    url = `https://vidsrc.pm/embed/${mediaType}/${movieId}`;
  } else if (provider === 'vidsrc.cc') {
    url = `https://vidsrc.cc/v2/embed/${mediaType}/${movieId}`;
  } else if (provider === 'multiembed') {
    url = `https://multiembed.mov/?video_id=${movieId}&tmdb=1`;
  } else if (provider === 'embedapi') {
    url = `https://player.embed-api.stream/?id=${movieId}`;
  } else if (provider === 'autoembed') {
    url = `https://autoembed.cc/embed/${mediaType}/${movieId}`;
  } else if (provider === '2embed') {
    url = `https://2embed.cc/embed/${movieId}`;
  } else if (provider === 'arabseed') {
    url = `https://m.arabseed.one/search?q=${encodeURIComponent(movieTitle)}`;
  }

  const isExternalProvider = provider === 'arabseed';

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
      <div className="absolute top-6 right-6 flex items-center space-x-4 z-50">
        <button 
          onClick={handleRefresh}
          className="text-white hover:text-red-600 transition p-2 bg-black/50 rounded-full shadow-lg border border-white/20"
          title="Refresh Player"
        >
          <RefreshCcw className="h-6 w-6" />
        </button>
        <div className="bg-red-600 rounded-full px-4 py-2 flex items-center border border-white/20 shadow-2xl hover:bg-red-700 transition-colors">
          <span className="text-[10px] text-white mr-3 uppercase font-black tracking-widest">Select Server</span>
            <select 
              value={provider} 
              onChange={(e) => setProvider(e.target.value)}
              className="bg-transparent text-white text-xs outline-none cursor-pointer font-bold pr-2 appearance-none"
            >
              <option value="vidsrc.net" className="bg-[#141414]">Server 1 (Fastest)</option>
              <option value="vidsrc.me" className="bg-[#141414]">Server 2 (Stable)</option>
              <option value="vidsrc.pm" className="bg-[#141414]">Server 3 (New)</option>
              <option value="vidsrc.cc" className="bg-[#141414]">Server 4 (Backup)</option>
              <option value="multiembed" className="bg-[#141414]">Server 5 (Multi-Source)</option>
              <option value="embedapi" className="bg-[#141414]">Server 6 (Global)</option>
              <option value="autoembed" className="bg-[#141414]">Server 7 (Auto)</option>
              <option value="2embed" className="bg-[#141414]">Server 8 (2Embed)</option>
              <option value="arabseed" className="bg-[#141414]">Server 9 (Arabseed - New Tab)</option>
            </select>
            <div className="pointer-events-none flex items-center text-white">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
        </div>
        <button 
          onClick={() => setShowModal(false)}
          className="text-white hover:text-red-600 transition p-2 bg-black/50 rounded-full shadow-lg border border-white/20"
        >
          <X className="h-8 w-8" />
        </button>
      </div>
      
      <div className="w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative border border-white/5 flex items-center justify-center">
        {isExternalProvider ? (
          <div className="text-center space-y-8 p-12">
            <div className="flex justify-center">
              <div className="p-6 bg-red-600/10 rounded-full border border-red-600/20">
                <ExternalLink className="h-16 w-16 text-red-600" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-white">Arabseed Blocking</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Arabseed blocks other websites from showing their videos directly. To watch on Arabseed, you must open it in a new tab.
                <br/><br/>
                <span className="text-red-500 font-bold">Try Server 1, 2, or 3</span> to watch directly on this site!
              </p>
            </div>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/20 transform hover:-translate-y-1"
            >
              Open Arabseed Search
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </div>
        ) : (
          <iframe 
            key={iframeKey}
            src={url} 
            className="w-full h-full" 
            frameBorder="0" 
            allowFullScreen
            allow="autoplay *; fullscreen *; picture-in-picture *; encrypted-media *; gyroscope; accelerometer"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default Modal;
