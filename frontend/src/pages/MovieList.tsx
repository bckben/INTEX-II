import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllMovies, fetchMovieById, Movie } from '../api/movieApi';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import GenreSelector from '../components/GenreSelector';
import MovieGrid from '../components/MovieGrid';
import MovieCard from '../components/MovieCard';
import './MovieList.css';

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [moviesPerPage, setMoviesPerPage] = useState<number>(100);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  console.log(navigate); // temp use to avoid TS error

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchAllMovies();
        setMovies(data);
        setFilteredMovies(data);
      } catch (err) {
        setError('Failed to load movies. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  useEffect(() => {
    let result = [...movies];

    if (selectedGenre !== 'All') {
      result = result.filter((movie) =>
        movie.type.toLowerCase() === selectedGenre.toLowerCase()
      );
    }

    result.sort((a, b) =>
      sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );

    setFilteredMovies(result);
    setCurrentPage(1); // Reset page when filter or sort changes
  }, [movies, selectedGenre, sortOrder]);

  // Pagination
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  const startIndex = indexOfFirstMovie + 1;
  const endIndex = Math.min(indexOfLastMovie, filteredMovies.length);

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };

  const handleSortChange = (order: 'asc' | 'desc') => {
    setSortOrder(order);
  };

  const handleMovieClick = async (showId: string) => {
    const movieFromList = movies.find(m => m.show_id === showId);
    if (movieFromList) {
      setSelectedMovie(movieFromList);
    } else {
      try {
        const movieData = await fetchMovieById(showId);
        if (movieData) {
          setSelectedMovie(movieData);
        }
      } catch (err) {
        console.error(`Error fetching movie ${showId}:`, err);
      }
    }
  };

  const handleCloseMovieCard = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="movie-list-page">
      <Navbar />
      <div className="container">
        <div className="header-section">
          <h1>{selectedGenre === 'All' ? 'All Movies' : `${selectedGenre} Movies`}</h1>
          <div className="sorting-controls">
            <button
              className={`sort-button ${sortOrder === 'asc' ? 'active' : ''}`}
              onClick={() => handleSortChange('asc')}
            >
              A-Z
            </button>
            <button
              className={`sort-button ${sortOrder === 'desc' ? 'active' : ''}`}
              onClick={() => handleSortChange('desc')}
            >
              Z-A
            </button>
          </div>
        </div>

        <GenreSelector selectedGenre={selectedGenre} onGenreChange={handleGenreChange} />

        {loading ? (
          <div className="loading">Loading movies...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : filteredMovies.length === 0 ? (
          <div className="no-results">No movies found for the selected genre.</div>
        ) : (
          <>
            <div className="pagination-container">
              <div className="pagination-controls">
                <button
                  className="page-nav"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  « Prev
                </button>
                
                <span className="pagination-info">
                  Page {currentPage} of {totalPages} (Showing {startIndex}-{endIndex} of {filteredMovies.length})
                </span>
                
                <button
                  className="page-nav"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next »
                </button>
              </div>
              
              <div className="page-size-selector">
                Movies per page:
                <select 
                  value={moviesPerPage} 
                  onChange={(e) => setMoviesPerPage(Number(e.target.value))}
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={filteredMovies.length}>All</option>
                </select>
              </div>
            </div>
            
            <MovieGrid movies={currentMovies} onMovieClick={handleMovieClick} />
            
            <div className="pagination-container">
              <div className="pagination-controls">
                <button
                  className="page-nav"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  « Prev
                </button>
                
                <span className="pagination-info">
                  Page {currentPage} of {totalPages} (Showing {startIndex}-{endIndex} of {filteredMovies.length})
                </span>
                
                <button
                  className="page-nav"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  Next »
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedMovie && (
        <MovieCard movie={selectedMovie} onClose={handleCloseMovieCard} />
      )}

      <Footer />
    </div>
  );
};

export default MovieList;