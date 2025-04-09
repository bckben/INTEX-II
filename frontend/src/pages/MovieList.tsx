import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchAllMovies, fetchMovieById, Movie } from '../api/movieApi';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import GenreSelector from '../components/GenreSelector';
import MovieGrid from '../components/MovieGrid';
import MovieCard from '../components/MovieCard';
import './MovieList.css';
import Fuse from 'fuse.js';

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [fuzzySuggestions, setFuzzySuggestions] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [moviesPerPage, setMoviesPerPage] = useState<number>(100);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search')?.toLowerCase() || '';

  const filterAndSortMovies = (movies: Movie[], query: string): Movie[] => {
    if (!query) return movies;

    const lowerQuery = query.toLowerCase();

    return movies.filter((movie) =>
      (movie.title?.toLowerCase().includes(lowerQuery) ?? false) ||
      (movie.cast?.toLowerCase().includes(lowerQuery) ?? false) ||
      (movie.director?.toLowerCase().includes(lowerQuery) ?? false) ||
      movie.release_year?.toString().includes(lowerQuery)
    );
  };

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchAllMovies();
        setMovies(data);
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
    if (!loading && movies.length > 0) {
      let result = [...movies];

      if (selectedGenre !== 'All') {
        result = result.filter((movie) =>
          movie.type.toLowerCase() === selectedGenre.toLowerCase()
        );
      }

      let exactMatches = result;
      if (searchQuery) {
        exactMatches = filterAndSortMovies(result, searchQuery);
      }

      exactMatches.sort((a, b) =>
        sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      );

      setFilteredMovies(exactMatches);
      setCurrentPage(1);

      // Fuzzy fallback if no exact matches
      if (searchQuery && exactMatches.length === 0) {
        const fuse = new Fuse(result, {
          threshold: 0.4,
          keys: ['title', 'cast', 'director', 'release_year'],
        });

        const fuzzy = fuse.search(searchQuery).map(res => res.item);
        setFuzzySuggestions(fuzzy.slice(0, 10));
      } else {
        setFuzzySuggestions([]);
      }
    }
  }, [loading, movies, selectedGenre, sortOrder, searchQuery]);

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
      <Navbar onMovieClick={handleMovieClick} />

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
          <>
            <div className="no-results">
              No exact matches found for "<strong>{searchQuery}</strong>".
            </div>
            {fuzzySuggestions.length > 0 && (
              <div className="fuzzy-suggestions">
                <h5>You might be thinking of:</h5>
                <MovieGrid movies={fuzzySuggestions} onMovieClick={handleMovieClick} />
              </div>
            )}
          </>
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