import requests from "@/utils/requests";
import MainContent from "@/components/MainContent";

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

  return (
    <MainContent 
      trendingNow={trendingNow.results}
      topRated={topRated.results}
      actionMovies={actionMovies.results}
      comedyMovies={comedyMovies.results}
      horrorMovies={horrorMovies.results}
      romanceMovies={romanceMovies.results}
      documentaries={documentaries.results}
    />
  );
}
