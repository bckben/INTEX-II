import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllMovies, Movie } from '../api/movieApi';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import GenreSelector from '../components/GenreSelector';
import MovieGrid from '../components/MovieGrid';
import './MovieList.css';

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

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
  }, [movies, selectedGenre, sortOrder]);

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };

  const handleSortChange = (order: 'asc' | 'desc') => {
    setSortOrder(order);
  };

  const handleMovieClick = (showId: string) => {
    navigate(`/movie/${showId}`);
  };

  return (
    <div className="movie-list-page">
      <Navbar />
      <div className="container">
        <div className="header-section">
          <h1>
            {selectedGenre === 'All' ? 'All Movies' : `${selectedGenre} Movies`}
          </h1>
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

        <GenreSelector
          selectedGenre={selectedGenre}
          onGenreChange={handleGenreChange}
        />

        {loading ? (
          <div className="loading">Loading movies...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : filteredMovies.length === 0 ? (
          <div className="no-results">No movies found for the selected genre.</div>
        ) : (
          <MovieGrid movies={filteredMovies} onMovieClick={handleMovieClick} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MovieList;