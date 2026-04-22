'use client'

import { Play, Info } from 'lucide-react';
import { getThemeConfig } from '@/utils/theme';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string;
  media_type?: string;
}

const Hero = ({ movie, onPlayClick }: { movie: Movie; onPlayClick: () => void }) => {
  const theme = getThemeConfig();
  if (!movie) return null;

  const backdropPath = theme.eventBackdrop || movie?.backdrop_path || movie?.poster_path;
  const imageUrl = backdropPath 
    ? (backdropPath.startsWith('http') || (theme.isEventActive && theme.eventBackdrop === backdropPath) 
        ? backdropPath 
        : `https://image.tmdb.org/t/p/original${backdropPath}`)
    : '';

  return (
    <div className="relative h-[95vh] w-full flex flex-col justify-center lg:h-[140vh] lg:justify-end lg:pb-32">
      {/* Background Image Container */}
      <div className="absolute top-0 left-0 h-full w-full pointer-events-none">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Hero Background"
            className="h-full w-full object-cover transition-opacity duration-1000"
          />
        )}
        {/* Gradients to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 px-4 lg:px-16 space-y-6 pb-12">
        <h1 className={`text-5xl font-bold md:text-7xl lg:text-9xl max-w-4xl tracking-tight uppercase ${theme.isEventActive ? theme.primaryColor : 'text-white'} shadow-sm transition-all duration-500`}>
          {theme.eventName === 'Michael' ? 'MICHAEL' : (movie?.title || movie?.name)}
        </h1>
        {theme.eventName === 'Michael' && (
          <p className="text-[#FFD700] text-xl md:text-3xl font-black uppercase tracking-widest animate-pulse">
            Coming Soon
          </p>
        )}
        <p className="max-w-xs text-sm text-shadow-md md:max-w-lg md:text-xl lg:max-w-3xl lg:text-2xl line-clamp-3 text-gray-200 font-medium">
          {theme.eventName === 'Michael' 
            ? "Discover the making of a king. The story of Michael Jackson, one of the most influential artists the world has ever known, and his life beyond the music." 
            : movie?.overview}
        </p>

        <div className="flex space-x-4 pt-4">
          <button 
            onClick={onPlayClick}
            className={`flex items-center gap-x-2 rounded ${theme.isEventActive ? theme.accentColor + ' text-black' : 'bg-white text-black'} px-8 py-3 text-sm font-bold transition hover:opacity-80 md:text-xl shadow-lg`}
          >
            <Play className={`h-4 w-4 fill-black text-black md:h-7 md:w-7`} />
            {theme.eventName === 'Michael' ? 'Notify Me' : 'Play'}
          </button>
          <button className="flex items-center gap-x-2 rounded bg-gray-500/70 px-8 py-3 text-sm font-bold text-white transition hover:bg-gray-500/40 md:text-xl shadow-lg border border-white/10">
            <Info className="h-5 w-5 md:h-8 md:w-8" />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
