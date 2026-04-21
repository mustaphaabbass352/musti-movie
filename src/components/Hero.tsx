'use client'

import { Play, Info } from 'lucide-react';

interface Movie {
  title?: string;
  name?: string;
  overview: string;
  backdrop_path: string;
}

const Hero = ({ movie }: { movie: Movie }) => {
  return (
    <div className="relative h-[95vh] w-full flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[140vh] lg:justify-end lg:pb-12">
      <div className="absolute top-0 left-0 -z-10 h-screen w-screen">
        <img
          src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`}
          alt="Hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />
      </div>

      <div className="px-4 lg:px-16 space-y-4">
        <h1 className="text-2xl font-bold md:text-4xl lg:text-7xl">
          {movie?.title || movie?.name}
        </h1>
        <p className="max-w-xs text-xs text-shadow-md md:max-w-lg md:text-lg lg:max-w-2xl lg:text-2xl line-clamp-3">
          {movie?.overview}
        </p>

        <div className="flex space-x-3">
          <button className="flex items-center gap-x-2 rounded bg-white px-5 py-1.5 text-sm font-semibold text-black transition hover:bg-gray-200 md:px-8 md:py-2.5 md:text-xl">
            <Play className="h-4 w-4 fill-black text-black md:h-7 md:w-7" />
            Play
          </button>
          <button className="flex items-center gap-x-2 rounded bg-[gray]/70 px-5 py-1.5 text-sm font-semibold text-white transition hover:bg-[gray]/40 md:px-8 md:py-2.5 md:text-xl">
            <Info className="h-5 w-5 md:h-8 md:w-8" />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
