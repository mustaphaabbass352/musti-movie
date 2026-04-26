'use client'

import { Play, Plus, Check } from 'lucide-react';
import { getThemeConfig } from '@/utils/theme';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string;
  media_type?: string;
}

interface Props {
  movie: Movie;
  onPlayClick: () => void;
  toggleWatchlist: (movie: any) => void;
  isInWatchlist: boolean;
}

const Hero = ({ movie, onPlayClick, toggleWatchlist, isInWatchlist }: Props) => {
  const theme = getThemeConfig();
  if (!movie) return null;

  const backdropPath = theme.eventBackdrop || movie?.backdrop_path || movie?.poster_path;
  const imageUrl = backdropPath 
    ? (backdropPath.startsWith('http') || backdropPath.startsWith('/') 
        ? backdropPath 
        : `https://image.tmdb.org/t/p/original${backdropPath}`)
    : '';

  return (
    <div className="relative h-[95vh] w-full flex flex-col justify-center lg:h-[140vh] lg:justify-end lg:pb-32">
      {/* Background Image Container */}
      <div className="absolute top-0 left-0 h-full w-full pointer-events-none overflow-hidden">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Hero Background"
            className="h-full w-full object-cover"
          />
        )}
        {/* Gradients to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 px-4 lg:px-16 space-y-6 pb-12">
        <h1 className={`text-5xl font-bold md:text-7xl lg:text-9xl max-w-4xl tracking-tight uppercase ${theme.isEventActive ? theme.primaryColor : 'text-white'} shadow-sm transition-all duration-500`}>
          {theme.eventName === 'Michael' && movie.id === 936075 ? 'MICHAEL' : (movie?.title || movie?.name)}
        </h1>
        <div className="flex items-center space-x-4">
          {theme.eventName === 'Michael' && movie.id === 936075 ? (
            <>
              <p className="text-[#FFD700] text-xl md:text-3xl font-black uppercase tracking-widest animate-pulse">
                Now Streaming
              </p>
              <span className="px-2 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold rounded">HD</span>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-sm uppercase tracking-tighter">Weekly Spotlight</span>
              <span className="px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-gray-300 text-xs font-medium rounded">Top Trending</span>
            </div>
          )}
        </div>
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
            Play
          </button>
          <button 
            onClick={() => toggleWatchlist(movie)}
            className="flex items-center gap-x-2 rounded bg-gray-500/70 px-8 py-3 text-sm font-bold text-white transition hover:bg-gray-500/40 md:text-xl shadow-lg border border-white/10"
          >
            {isInWatchlist ? <Check className="h-5 w-5 md:h-8 md:w-8" /> : <Plus className="h-5 w-5 md:h-8 md:w-8" />}
            {isInWatchlist ? 'In Watchlist' : 'Watchlist'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
