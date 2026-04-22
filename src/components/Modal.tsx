'use client'

import { X } from 'lucide-react';
import { useState } from 'react';

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  movie: any;
}

const Modal = ({ showModal, setShowModal, movie }: Props) => {
  const [provider, setProvider] = useState('vidsrc.xyz');
  
  if (!showModal || !movie) return null;

  // Robust media type detection
  const mediaType = movie?.media_type || (movie?.title ? 'movie' : 'tv');
  const movieId = movie?.id;

  let url = '';
  if (provider === 'vidsrc') url = `https://vidsrc.net/embed/${mediaType}/${movieId}`;
  else if (provider === 'vidsrc.to') url = `https://vidsrc.to/embed/${mediaType}/${movieId}`;
  else if (provider === 'player') url = `https://player.player.com/embed/${movieId}`;
  else if (provider === '2embed') url = `https://2embed.org/embed/${movieId}`;
  else if (provider === 'vidplay') url = `https://vidplay.net/e/${movieId}`;
  else if (provider === 'streamhub') url = `https://streamhub.to/embed/${movieId}`;
  else if (provider === 'filelinked') url = `https://filelinked.store/embed/${movieId}`;
  else if (provider === 'goku') url = `https://goku.to/e/${movieId}`;

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
            <option value="vidsrc">Server 1 (Vidsrc)</option>
            <option value="vidsrc.to">Server 2 (Vidsrc.to)</option>
            <option value="player">Server 3 (Player)</option>
            <option value="2embed">Server 4 (2Embed)</option>
            <option value="vidplay">Server 5 (Vidplay)</option>
            <option value="streamhub">Server 6 (Streamhub)</option>
            <option value="filelinked">Server 7 (Filelinked)</option>
            <option value="goku">Server 8 (Goku)</option>
          </select>
        </div>
        <button 
          onClick={() => setShowModal(false)}
          className="text-white hover:text-red-600 transition p-2 bg-black/50 rounded-full shadow-lg border border-white/20"
        >
          <X className="h-8 w-8" />
        </button>
      </div>
      
      <div className="w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative border border-white/5">
        <iframe 
          src={url} 
          className="w-full h-full" 
          frameBorder="0" 
          allowFullScreen
          allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
    </div>
  );
};

export default Modal;
