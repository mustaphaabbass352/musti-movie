'use client'

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Row from "@/components/Row";
import Modal from "@/components/Modal";

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

  const handleMovieClick = (movie: any) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const heroMovie = trendingNow[Math.floor(Math.random() * trendingNow.length)];

  return (
    <div className="relative h-screen bg-[#141414] lg:h-[140vh]">
      <Navbar />
      <main className="relative pb-24 lg:space-y-24">
        <Hero movie={heroMovie} onPlayClick={() => handleMovieClick(heroMovie)} />
        
        <section className="md:space-y-24">
          <Row title="Trending Now" movies={trendingNow} onMovieClick={handleMovieClick} />
          <Row title="Top Rated" movies={topRated} onMovieClick={handleMovieClick} />
          <Row title="Action Thrillers" movies={actionMovies} onMovieClick={handleMovieClick} />
          <Row title="Comedies" movies={comedyMovies} onMovieClick={handleMovieClick} />
          <Row title="Scary Movies" movies={horrorMovies} onMovieClick={handleMovieClick} />
          <Row title="Romance" movies={romanceMovies} onMovieClick={handleMovieClick} />
          <Row title="Documentaries" movies={documentaries} onMovieClick={handleMovieClick} />
        </section>
      </main>

      <Modal showModal={showModal} setShowModal={setShowModal} movie={selectedMovie} />
    </div>
  );
};

export default MainContent;
