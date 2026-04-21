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
  if (provider === 'vidsrc.xyz') url = `https://vidsrc.xyz/embed/${mediaType}/${movieId}`;
  else if (provider === 'vidsrc.to') url = `https://vidsrc.to/embed/${mediaType}/${movieId}`;
  else if (provider === 'vidsrc.cc') url = `https://vidsrc.cc/v2/embed/${mediaType}/${movieId}`;
  else if (provider === 'vidsrc.in') url = `https://vidsrc.in/embed/${mediaType}/${movieId}`;

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
            <option value="vidsrc.xyz">Server 1 (Auto)</option>
            <option value="vidsrc.to">Server 2 (Fast)</option>
            <option value="vidsrc.cc">Server 3 (HD)</option>
            <option value="vidsrc.in">Server 4 (Backup)</option>
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
