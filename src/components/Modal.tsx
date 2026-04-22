'use client'

import { X, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  movie: any;
}

const Modal = ({ showModal, setShowModal, movie }: Props) => {
  const [provider, setProvider] = useState('vidsrc.net');

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
  } else if (provider === 'vidapi') {
    url = `https://vidapi.xyz/embed/${mediaType}/${movieId}`;
  } else if (provider === 'embedmaster') {
    url = `https://embedmaster.link/${mediaType}/${movieId}`;
  } else if (provider === '2embed') {
    url = `https://www.2embed.stream/embed/${mediaType}/${movieId}`;
  } else if (provider === 'arabseed') {
    url = `https://m.arabseed.one/search?q=${encodeURIComponent(movieTitle)}`;
  }

  const isExternalProvider = provider === 'arabseed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
      <div className="absolute top-6 right-6 flex items-center space-x-4 z-50">
        <div className="bg-[#2a2a2a] rounded-full px-4 py-1.5 flex items-center border border-white/10 shadow-xl">
          <span className="text-[10px] text-gray-400 mr-3 uppercase font-black tracking-widest">Server</span>
          <select 
            value={provider} 
            onChange={(e) => setProvider(e.target.value)}
            className="bg-transparent text-white text-xs outline-none cursor-pointer font-bold pr-2"
          >
            <option value="vidsrc.net">Server 1 (Vidsrc.net - Stable)</option>
            <option value="vidsrc.me">Server 2 (Vidsrc.me - Global)</option>
            <option value="vidapi">Server 3 (VidAPI - International)</option>
            <option value="embedmaster">Server 4 (EmbedMaster - New)</option>
            <option value="2embed">Server 5 (2Embed - Backup)</option>
            <option value="arabseed">Server 6 (Arabseed - New Tab Only)</option>
          </select>
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
            src={url} 
            className="w-full h-full" 
            frameBorder="0" 
            allowFullScreen
            allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default Modal;
