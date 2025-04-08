import React, { useState, useEffect } from 'react';
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
    // Filter and sort movies whenever selectedGenre or sortOrder changes
    let result = [...movies];
    
    // Filter by genre
    if (selectedGenre !== 'All') {
      result = result.filter(movie => {
        // This is a simple example - you might need to adjust based on your actual data structure
        // Assuming your movie has a "type" field that can be used for genre
        return movie.type.toLowerCase() === selectedGenre.toLowerCase();
      });
    }
    
    // Sort by title
    result.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredMovies(result);
  }, [movies, selectedGenre, sortOrder]);

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };

  const handleSortChange = (order: 'asc' | 'desc') => {
    setSortOrder(order);
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
          <MovieGrid movies={filteredMovies} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MovieList;