'use client'

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Row from "@/components/Row";
import Modal from "@/components/Modal";
import { Play } from 'lucide-react';
import { getThemeConfig } from '@/utils/theme';

interface Props {
  trendingNow: any[];
  topRated: any[];
  actionMovies: any[];
  comedyMovies: any[];
  horrorMovies: any[];
  romanceMovies: any[];
  documentaries: any[];
}

const MainContent = ({ 
  trendingNow, 
  topRated, 
  actionMovies, 
  comedyMovies, 
  horrorMovies, 
  romanceMovies, 
  documentaries
}: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [watchHistory, setWatchHistory] = useState<any[]>([]);
  const theme = getThemeConfig();

  // Load watch history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('musti-watch-history');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      // Filter out Arabic movies from history
      const filteredHistory = history.filter((movie: any) => {
        const title = (movie.title || movie.name || '').toLowerCase();
        const isArabic = movie.original_language === 'ar' || 
                         title.includes('omar & salma') || 
                         title === 'restart' || 
                         title === 'love story' ||
                         title === 'the suit';
        return !isArabic;
      });
      setWatchHistory(filteredHistory);
      localStorage.setItem('musti-watch-history', JSON.stringify(filteredHistory));
    }
  }, []);

  const handleMovieClick = (movie: any) => {
    setSelectedMovie(movie);
    setShowModal(true);

    // Update watch history
    setWatchHistory((prev) => {
      // Remove movie if it already exists to move it to the front
      const filtered = prev.filter((m) => m.id !== movie.id);
      const newHistory = [movie, ...filtered].slice(0, 20); // Keep last 20 movies
      localStorage.setItem('musti-watch-history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleSearch = async (query: string) => {
    if (!query) {
      setSearchResults(null);
      setSearchQuery('');
      return;
    }

    setSearchQuery(query);
    const API_KEY = 'd8c7480fda6456d4e63823d156aa1cab';
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const heroMovie = trendingNow[Math.floor(Math.random() * trendingNow.length)];

  const michaelMovie = {
    id: 1022789,
    title: "Michael",
    overview: "Discover the making of a king. The story of Michael Jackson, one of the most influential artists the world has ever known, and his life beyond the music.",
    backdrop_path: "/michael-backdrop.webp",
    media_type: "movie"
  };

  return (
    <div className={`relative min-h-screen bg-[#141414] ${theme.specialStyle}`}>
      {theme.eventName === 'Michael' && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="sparkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: i % 2 === 0 ? '#FFD700' : 'white'
              }}
            />
          ))}
        </div>
      )}
      <Navbar onSearch={handleSearch} />
      
      <main className="relative pb-24 transition-all duration-500">
        {searchResults ? (
          <div className="pt-32 px-4 lg:px-16">
            <h1 className="text-2xl md:text-4xl font-bold mb-8 text-gray-400">
              Results for: <span className={`${theme.primaryColor} italic transition-all duration-500`}>"{searchQuery}"</span>
            </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {searchResults.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleMovieClick(movie)}
                  className="relative cursor-pointer transform hover:scale-105 transition duration-300 group"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl border border-white/5">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
                      className="w-full h-full object-cover"
                      alt={movie.title || movie.name}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <div className={`p-3 rounded-full backdrop-blur-md border border-white/30 ${theme.isEventActive ? theme.accentColor + '/20' : 'bg-white/20'}`}>
                        <Play className={`h-6 w-6 fill-white text-white`} />
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-xs md:text-sm font-semibold text-gray-300 truncate group-hover:text-white transition">
                    {movie.title || movie.name}
                  </p>
                </div>
              ))}
            </div>
            {searchResults.length === 0 && (
              <div className="text-center py-20">
                <p className="text-xl text-gray-500 font-medium">No results found for your search.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <Hero 
              movie={theme.eventName === 'Michael' ? michaelMovie : heroMovie} 
              onPlayClick={() => handleMovieClick(theme.eventName === 'Michael' ? michaelMovie : heroMovie)} 
            />
            
            <section className="md:space-y-24 -mt-16 lg:-mt-32 relative z-10">
              {watchHistory.length > 0 && (
                <Row title="Continue Watching" movies={watchHistory} onMovieClick={handleMovieClick} />
              )}
              <Row title="Trending Now" movies={theme.eventName === 'Michael' ? [michaelMovie, ...trendingNow] : trendingNow} onMovieClick={handleMovieClick} />
              <Row title="Top Rated" movies={topRated} onMovieClick={handleMovieClick} />
              <Row title="Action Thrillers" movies={actionMovies} onMovieClick={handleMovieClick} />
              <Row title="Comedies" movies={comedyMovies} onMovieClick={handleMovieClick} />
              <Row title="Scary Movies" movies={horrorMovies} onMovieClick={handleMovieClick} />
              <Row title="Romance" movies={romanceMovies} onMovieClick={handleMovieClick} />
              <Row title="Documentaries" movies={documentaries} onMovieClick={handleMovieClick} />
            </section>
          </>
        )}
      </main>

      <Modal showModal={showModal} setShowModal={setShowModal} movie={selectedMovie} />
    </div>
  );
};

export default MainContent;
