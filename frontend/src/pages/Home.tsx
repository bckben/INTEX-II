import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import './Home.css';
import NavBar from '../components/NavBar';
import FeaturedContent from '../components/FeaturedContent';
import ContentRow from '../components/ContentRow';
import Footer from '../components/Footer';
import MovieCard from '../components/MovieCard';
import { fetchAllMovies, Movie } from '../api/movieApi';
import { getUserRecommendations } from '../api/recommendationApi';

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recentlyRated, setRecentlyRated] = useState<Movie[]>([]);

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

  useEffect(() => {
    const fetchRecommendations = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) return;

      try {
        const recommendedIds = await getUserRecommendations(parseInt(storedUserId));
        const matched = recommendedIds
          .map(id => movies.find(m => m.show_id === id))
          .filter((m): m is Movie => Boolean(m));
        setRecommendedMovies(matched);
      } catch (err) {
        console.error("Error fetching user recommendations:", err);
      }
    };

    if (movies.length > 0) {
      fetchRecommendations();
      updateRecentlyRated();
    }
  }, [movies]);

  const updateRecentlyRated = () => {
    const storedRatings = JSON.parse(localStorage.getItem('movieRatings') || '{}');
    const ratedMovieIds = Object.keys(storedRatings).slice(-6).reverse();
    const recent = ratedMovieIds
      .map(id => movies.find(m => m.show_id === id))
      .filter((m): m is Movie => Boolean(m));
    setRecentlyRated(recent);
  };

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

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseMovieCard = () => {
    setSelectedMovie(null);
    updateRecentlyRated();
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
        {recommendedMovies.length > 0 && (
          <ContentRow
            title="Recommended for You"
            movies={recommendedMovies}
            onMovieClick={handleMovieClick}
          />
        )}

        {recentlyRated.length > 0 && (
          <ContentRow
            title="Recently Rated"
            movies={recentlyRated}
            onMovieClick={handleMovieClick}
          />
        )}

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
