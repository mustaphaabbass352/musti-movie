'use client'

import { Play, Info } from 'lucide-react';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string;
  media_type?: string;
}

const Hero = ({ movie, onPlayClick }: { movie: Movie; onPlayClick: () => void }) => {
  if (!movie) return null;

  return (
    <div className="relative h-[95vh] w-full flex flex-col justify-center lg:h-[140vh] lg:justify-end lg:pb-32">
      {/* Background Image Container */}
      <div className="absolute top-0 left-0 h-full w-full">
        <img
          src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path || movie?.poster_path}`}
          alt="Hero"
          className="h-full w-full object-cover"
        />
        {/* Gradients to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 px-4 lg:px-16 space-y-6 pb-12">
        <h1 className="text-5xl font-bold md:text-7xl lg:text-9xl max-w-4xl tracking-tight uppercase text-white shadow-sm">
          {movie?.title || movie?.name}
        </h1>
        <p className="max-w-xs text-sm text-shadow-md md:max-w-lg md:text-xl lg:max-w-3xl lg:text-2xl line-clamp-3 text-gray-200 font-medium">
          {movie?.overview}
        </p>

        <div className="flex space-x-4 pt-4">
          <button 
            onClick={onPlayClick}
            className="flex items-center gap-x-2 rounded bg-white px-8 py-3 text-sm font-bold text-black transition hover:bg-gray-200 md:text-xl shadow-lg"
          >
            <Play className="h-4 w-4 fill-black text-black md:h-7 md:w-7" />
            Play
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
