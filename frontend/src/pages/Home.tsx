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

const FEATURED_IDS = [
  's341', 's356', 's1334', 's2520', 's2583',
  's8069', 's8581', 's330', 's574', 's7073', 's1359', 's779',
  's6201', 's173', 's334', 's443', 's452', 's461'
];

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [ratings, setRatings] = useState<MovieRating[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [recentlyRated, setRecentlyRated] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        const [movieData, ratingData] = await Promise.all([
          fetchAllMovies(),
          axios.get<MovieRating[]>('https://cineniche-backend-v2-haa5huekb0ejavgw.eastus-01.azurewebsites.net/ratings').then(res => res.data),
        ]);
        setMovies(movieData);
        setRatings(ratingData);
      } catch (err) {
        console.error(err);
        setError('Something went wrong loading movies.');
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
          .map((id) => movies.find((m) => m.show_id === id))
          .filter((m): m is Movie => Boolean(m));
        setRecommendedMovies(matched);
      } catch (err) {
        console.error('Error fetching user recommendations:', err);
      }

      updateRecentlyRated();
    };

    if (movies.length > 0) {
      fetchRecs();
    }
  }, [movies]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % FEATURED_IDS.length);
    }, 12000); // Slower transition: 12 seconds
    return () => clearInterval(interval);
  }, []);

  const updateRecentlyRated = () => {
    const storedRatings = JSON.parse(localStorage.getItem('movieRatings') || '{}');
    const ratedMovieIds = Object.keys(storedRatings).slice(-6).reverse();
    const recent = ratedMovieIds
      .map((id) => movies.find((m) => m.show_id === id))
      .filter((m): m is Movie => Boolean(m));
    setRecentlyRated(recent);
  };

  const handleMovieClick = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseMovieCard = () => {
    setSelectedMovie(null);
    updateRecentlyRated();
  };

  const handleFeatureNav = (direction: 'prev' | 'next') => {
    setFeaturedIndex((prev) => {
      const total = FEATURED_IDS.length;
      if (direction === 'prev') {
        return (prev - 1 + total) % total; // wrap to last if at first
      } else {
        return (prev + 1) % total; // wrap to first if at last
      }
    });
  };

  const featuredMovies = movies.filter((m) => FEATURED_IDS.includes(m.show_id));
  const featuredMovie = featuredMovies[featuredIndex];

  const trendingMovies = () => {
    const avgMap: Record<string, { total: number; count: number }> = {};
    ratings.forEach((r) => {
      if (!avgMap[r.show_id]) avgMap[r.show_id] = { total: 0, count: 0 };
      avgMap[r.show_id].total += r.rating;
      avgMap[r.show_id].count += 1;
    });

    const topRatedIds = Object.entries(avgMap)
      .filter(([_, { total, count }]) => count > 0 && total / count >= 4)
      .map(([id]) => id);

    return movies.filter((m) => topRatedIds.includes(m.show_id));
  };

  const classics = movies.filter((m) => m.release_year >= 1950 && m.release_year <= 1990);
  const newReleases = movies.filter((m) => m.release_year >= 2020);
  const tvShows = movies.filter((m) => m.type?.toLowerCase() === 'tv show').slice(0, 25);
  const familyMovies = movies.filter((m) => ['G', 'PG'].includes(m.rating?.toUpperCase() || ''));
  const bingeWorthy = movies.filter((m) =>
    m.type?.toLowerCase() === 'tv show' && /\d+\s*seasons?/i.test(m.duration) &&
    parseInt(m.duration.match(/\d+/)?.[0] || '0') >= 5
  );

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
          onPrev={() => handleFeatureNav('prev')}
          onNext={() => handleFeatureNav('next')}
        />
      )}

      <Container fluid className="content-container">
        {recommendedMovies.length > 0 && (
          <ContentRow title="Recommended for You" movies={recommendedMovies} onMovieClick={handleMovieClick} />
        )}
        {recentlyRated.length > 0 && (
          <ContentRow title="Recently Rated" movies={recentlyRated} onMovieClick={handleMovieClick} disableShuffle />
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