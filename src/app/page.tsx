import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Row from "@/components/Row";
import requests from "@/utils/requests";

export default async function Home() {
  const [
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.fetchTrending).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json()),
  ]);

  if (!trendingNow.results) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#141414] text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Missing API Key</h1>
          <p className="text-gray-400">Please add your TMDB API key to the .env.local file.</p>
        </div>
      </div>
    );
  }

  const heroMovie = trendingNow.results[Math.floor(Math.random() * trendingNow.results.length)];

  return (
    <div className="relative h-screen bg-[#141414] lg:h-[140vh]">
      <Navbar />
      <main className="relative pb-24 lg:space-y-24">
        <Hero movie={heroMovie} />
        
        <section className="md:space-y-24">
          <Row title="Trending Now" movies={trendingNow.results} />
          <Row title="Top Rated" movies={topRated.results} />
          <Row title="Action Thrillers" movies={actionMovies.results} />
          <Row title="Comedies" movies={comedyMovies.results} />
          <Row title="Scary Movies" movies={horrorMovies.results} />
          <Row title="Romance" movies={romanceMovies.results} />
          <Row title="Documentaries" movies={documentaries.results} />
        </section>
      </main>
    </div>
  );
}
