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

  const mediaType = movie?.media_type || 'movie';
  const movieId = movie?.id;

  let url = '';
  if (provider === 'vidsrc.xyz') url = `https://vidsrc.xyz/embed/${mediaType}/${movieId}`;
  else if (provider === 'vidsrc.to') url = `https://vidsrc.to/embed/${mediaType}/${movieId}`;
  else if (provider === 'vidsrc.me') url = `https://vidsrc.me/embed/${mediaType}?tmdb=${movieId}`;
  else if (provider === 'vidsrc.cc') url = `https://vidsrc.cc/v2/embed/${mediaType}/${movieId}`;
  else if (provider === 'embed.su') url = `https://embed.su/embed/${mediaType}/${movieId}`;
  else if (provider === 'vidsrc.pro') url = `https://vidsrc.pro/embed/${mediaType}/${movieId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="absolute top-6 right-6 flex items-center space-x-4 z-50">
        <div className="bg-gray-800 rounded-lg p-1 flex items-center border border-gray-600">
          <span className="text-[10px] text-gray-400 px-2 uppercase font-bold">Server</span>
          <select 
            value={provider} 
            onChange={(e) => setProvider(e.target.value)}
            className="bg-transparent text-white text-xs outline-none cursor-pointer border-l border-gray-600 pl-2 pr-1 py-1"
          >
            <option value="vidsrc.xyz">Server 1 (Default)</option>
            <option value="vidsrc.to">Server 2 (Fast)</option>
            <option value="vidsrc.me">Server 3 (Arabic Support 🌟)</option>
            <option value="vidsrc.cc">Server 4 (Ultimate Library 🌍)</option>
            <option value="embed.su">Server 5 (Stable)</option>
            <option value="vidsrc.pro">Server 6 (Backup)</option>
          </select>
        </div>
        <button 
          onClick={() => setShowModal(false)}
          className="text-white hover:text-red-600 transition"
        >
          <X className="h-8 w-8" />
        </button>
      </div>
      
      <div className="w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl relative">
        <iframe 
          src={url} 
          className="w-full h-full" 
          frameBorder="0" 
          allowFullScreen
          sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-popups allow-presentation"
        ></iframe>
      </div>
    </div>
  );
};

export default Modal;
