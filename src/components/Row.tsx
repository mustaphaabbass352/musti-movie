'use client'

interface Props {
  title: string;
  movies: any[];
  onMovieClick: (movie: any) => void;
}

const Row = ({ title, movies, onMovieClick }: Props) => {
  return (
    <div className="h-40 space-y-0.5 md:space-y-2 px-4 lg:px-16">
      <h2 className="w-56 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-2xl">
        {title}
      </h2>
      <div className="group relative md:-ml-2">
        <div className="flex items-center space-x-4 overflow-x-scroll scrollbar-hide p-2 md:p-2">
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onMovieClick(movie)}
              className="relative flex-none w-[200px] md:w-[280px] cursor-pointer transform hover:scale-105 transition duration-300"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
                className="rounded shadow-lg w-full h-auto"
                alt={movie.title || movie.name}
              />
              <p className="mt-2 text-xs md:text-sm font-medium text-gray-300 truncate">
                {movie.title || movie.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Row;
