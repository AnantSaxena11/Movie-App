import Search from "./components/Search"
import { useState, useEffect } from 'react';
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`
  }
}
type Movie = {
  id: number,
  title: string;
  vote_average : number;
  poster_path : string;
  release_date : string;
  original_language : string
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [errorMsg, SeterrorMsg] = useState<string>("")
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [isLoading, setisLoading] = useState<boolean>(false);

  const fetchMovies = async () => {
    setisLoading(true);
    SeterrorMsg("");
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch Movies")
      }
      const data = await response.json();
      if (data.Response === "False") {
        setMovieList([]);
        throw new Error("Failed to fetch Movies Data")
      }
      console.log(data)
      setMovieList(data.results || [])
      setisLoading(false);
    } catch (error) {
      console.error(`Error fetching movies ${error}`)
      SeterrorMsg("Error fetching the movies try again later")
    }
    finally {
      setisLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies()
  }, []);
  return (
    <main>
      <div className='pattern' />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Image" />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>
          {isLoading ? (<Spinner />) :
            errorMsg ? (<p className="text-red-500">{errorMsg}</p>) :
              (
                <ul>
                  {movieList.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </ul>
              )
          };
        </section>
      </div>
    </main>
  )
}

export default App
