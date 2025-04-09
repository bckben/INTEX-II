import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import './Home.css';
import NavBar from '../components/NavBar';
import FeaturedContent from '../components/FeaturedContent';
import ContentRow from '../components/ContentRow';
import Footer from '../components/Footer';
import MovieCard from '../components/MovieCard';
import { fetchAllMovies, Movie, MovieRating } from '../api/movieApi';
import { getUserRecommendations } from '../api/recommendationApi';
import axios from 'axios';

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [ratings, setRatings] = useState<MovieRating[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [recentlyRated, setRecentlyRated] = useState<Movie[]>([]);

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        const [movieData, ratingData] = await Promise.all([
          fetchAllMovies(),
          axios.get<MovieRating[]>('https://cineniche-backend-v2-haa5huekb0ejavgw.eastus-01.azurewebsites.net/ratings').then(r => r.data)
        ]);
        setMovies(movieData);
        setRatings(ratingData);
      } catch (err) {
        console.error(err);
        setError("Something went wrong loading movies.");
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  useEffect(() => {
    const fetchRecs = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId || movies.length === 0) return;

      try {
        const recIds = await getUserRecommendations(parseInt(storedUserId));
        const matched = recIds
          .map(id => movies.find(m => m.show_id === id))
          .filter((m): m is Movie => Boolean(m));
        setRecommendedMovies(matched);
        updateRecentlyRated();
      } catch (err) {
        console.error("Error fetching user recommendations:", err);
      }
    };

    if (movies.length > 0) {
      fetchRecs();
    }
  }, [movies]);

  const updateRecentlyRated = () => {
    const stored = JSON.parse(localStorage.getItem('movieRatings') || '{}');
    const recent = Object.keys(stored).slice(-6).reverse()
      .map(id => movies.find(m => m.show_id === id))
      .filter((m): m is Movie => Boolean(m));
    setRecentlyRated(recent);
  };

  const featuredMovie = movies.length > 0
    ? movies[Math.floor(Math.random() * movies.length)]
    : null;

  const handleMovieClick = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseMovieCard = () => {
    setSelectedMovie(null);
    updateRecentlyRated();
  };

  // -- 🎯 Custom Filters

  const trendingMovies = () => {
    const avgMap: Record<string, { total: number, count: number }> = {};
    for (const rating of ratings) {
      if (!avgMap[rating.show_id]) {
        avgMap[rating.show_id] = { total: 0, count: 0 };
      }
      avgMap[rating.show_id].total += rating.rating;
      avgMap[rating.show_id].count += 1;
    }

    const qualified = Object.entries(avgMap)
      .filter(([_, { total, count }]) => count >= 1 && total / count >= 4)
      .map(([id]) => id);

    return movies.filter(m => qualified.includes(m.show_id));
  };

  const classics = movies.filter(m => m.release_year >= 1950 && m.release_year <= 1990);
  const newReleases = movies.filter(m => m.release_year >= 2020);
  const tvShows = movies.filter(m => m.type?.toLowerCase() === 'tv show').slice(0, 25);

  const familyMovies = movies.filter(
  (m) =>
    ['G'].includes(m.rating?.toUpperCase() || '')
);
  const bingeWorthy = movies.filter(m =>
    m.type?.toLowerCase() === 'tv show' &&
    /\d+\s*seasons?/i.test(m.duration) &&
    parseInt(m.duration.match(/\d+/)?.[0] || '0') >= 5
  );

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading amazing movies...</p></div>;
  if (error) return <div className="error-container"><h2>Oops!</h2><p>{error}</p><button onClick={() => window.location.reload()}>Try Again</button></div>;

  return (
    <div className="home-page">
      <NavBar />

      {featuredMovie && (
        <FeaturedContent movie={featuredMovie} onMoreInfoClick={handleMovieClick} />
      )}

      <Container fluid className="content-container">
        {recommendedMovies.length > 0 && (
          <ContentRow title="Recommended for You" movies={recommendedMovies} onMovieClick={handleMovieClick} />
        )}

        {recentlyRated.length > 0 && (
          <ContentRow title="Recently Rated" movies={recentlyRated} onMovieClick={handleMovieClick} />
        )}

        <ContentRow title="Trending Now" movies={trendingMovies()} onMovieClick={handleMovieClick} />
        <ContentRow title="TV Shows" movies={tvShows} onMovieClick={handleMovieClick} />
        <ContentRow title="New Releases" movies={newReleases} onMovieClick={handleMovieClick} />
        <ContentRow title="Classics" movies={classics} onMovieClick={handleMovieClick} />
        <ContentRow title="Family Movie Night" movies={familyMovies} onMovieClick={handleMovieClick} />
        <ContentRow title="Binge-Worthy Shows" movies={bingeWorthy} onMovieClick={handleMovieClick} />
      </Container>

      {selectedMovie && <MovieCard movie={selectedMovie} onClose={handleCloseMovieCard} />}

      <Footer />
    </div>
  );
};

export default Home;