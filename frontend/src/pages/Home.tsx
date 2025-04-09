import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import './Home.css';
import NavBar from '../components/NavBar';
import FeaturedContent from '../components/FeaturedContent';
import ContentRow from '../components/ContentRow';
import Footer from '../components/Footer';
import MovieCard from '../components/MovieCard';
import { fetchAllMovies, Movie } from '../api/movieApi';

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchAllMovies();
        setMovies(data);
        setError(null);
      } catch (err) {
        setError("Failed to load movies. Please try again later.");
        console.error("Error loading movies:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  const featuredMovie = movies.length > 0
    ? movies[Math.floor(Math.random() * movies.length)]
    : null;

  const getMoviesByType = (type: string) => {
    return movies.filter(movie => movie.type?.toLowerCase() === type.toLowerCase());
  };

  const getMoviesByYear = (startYear: number, endYear: number) => {
    return movies.filter(movie =>
      movie.release_year >= startYear && movie.release_year <= endYear
    );
  };

  const getRecentlyRatedMovies = (): Movie[] => {
    const storedRatings = JSON.parse(localStorage.getItem('movieRatings') || '{}');
    const ratedMovieIds = Object.keys(storedRatings).slice(-6).reverse();
    return ratedMovieIds
      .map(id => movies.find(m => m.show_id === id))
      .filter((m): m is Movie => Boolean(m));
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseMovieCard = () => {
    setSelectedMovie(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading amazing movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops!</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="home-page">
      <NavBar />

      {featuredMovie && (
        <FeaturedContent
          movie={featuredMovie}
          onMoreInfoClick={handleMovieClick}
        />
      )}

      <Container fluid className="content-container">
        <ContentRow
          title="Recently Rated"
          movies={getRecentlyRatedMovies()}
          onMovieClick={handleMovieClick}
        />

        <ContentRow
          title="Trending Now"
          movies={movies.slice(0, 8)}
          onMovieClick={handleMovieClick}
        />

        <ContentRow
          title="TV Shows"
          movies={getMoviesByType('TV Show')}
          onMovieClick={handleMovieClick}
        />

        <ContentRow
          title="Movies"
          movies={getMoviesByType('Movie')}
          onMovieClick={handleMovieClick}
        />

        <ContentRow
          title="New Releases"
          movies={getMoviesByYear(2020, 2025)}
          onMovieClick={handleMovieClick}
        />

        <ContentRow
          title="Classics"
          movies={getMoviesByYear(1950, 1990)}
          onMovieClick={handleMovieClick}
        />
      </Container>

      {selectedMovie && (
        <MovieCard movie={selectedMovie} onClose={handleCloseMovieCard} />
      )}

      <Footer />
    </div>
  );
};

export default Home;