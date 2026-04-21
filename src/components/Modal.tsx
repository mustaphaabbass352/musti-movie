'use client'

import { X } from 'lucide-react';
import { useState } from 'react';

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  movie: any;
}

const Modal = ({ showModal, setShowModal, movie }: Props) => {
  if (!showModal || !movie) return null;

  const mediaType = movie?.media_type || 'movie';
  const movieId = movie?.id;

  // vidsrc.me is often more reliable on static hosting like GitHub Pages
  const url = `https://vidsrc.me/embed/${mediaType}?tmdb=${movieId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={() => setShowModal(false)}
          className="text-white hover:text-red-600 transition p-2 bg-black/50 rounded-full"
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
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          referrerPolicy="no-referrer"
          sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation allow-popups allow-presentation"
        ></iframe>
      </div>
    </div>
  );
};

export default Modal;
