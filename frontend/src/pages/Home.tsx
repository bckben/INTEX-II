import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import './Home.css';
import NavBar from '../components/NavBar';
import FeaturedContent from '../components/FeaturedContent';
import ContentRow from '../components/ContentRow';
import Footer from '../components/Footer';
import MovieCard from '../components/MovieCard';
import { fetchAllMovies, Movie, MovieRating } from '../api/movieApi';
import axios from 'axios';

const FEATURED_IDS = [
  's341', 's1334', 's2520', 's2583',
  's8069', 's8581', 's330', 's574', 's7073', 's1359', 's779',
  's6201', 's173', 's334', 's443', 's452', 's461'
];

const API_BASE = 'https://cineniche-backend-v2-haa5huekb0ejavgw.eastus-01.azurewebsites.net';

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [ratings, setRatings] = useState<MovieRating[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [recentlyRated, setRecentlyRated] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMoreRecs, setShowMoreRecs] = useState(false);
  const [genreRecs, setGenreRecs] = useState<{ genre: string; recommendations: string[] | string }[]>([]);

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        const [movieData, ratingData] = await Promise.all([
          fetchAllMovies(),
          axios.get<MovieRating[]>(`${API_BASE}/ratings`).then(res => res.data),
        ]);
        setMovies(movieData);
        setRatings(ratingData);
      } catch (err) {
        console.error('❌ Error loading movies or ratings:', err);
        setError('Something went wrong while loading content.');
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  useEffect(() => {
    const fetchRecs = async () => {
      const storedUserId = localStorage.getItem('userId');
      const token = localStorage.getItem('authToken');

      if (!storedUserId || !token || movies.length === 0) return;

      try {
        const response = await axios.get<string[]>(
          `${API_BASE}/recommendations/user/${storedUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );

        const recIds = response.data;
        const matched = recIds
          .map(id => movies.find(m => m.show_id === id))
          .filter((m): m is Movie => Boolean(m));
        setRecommendedMovies(matched);
      } catch (err) {
        console.error('❌ Failed to fetch user recommendations:', err);
      }

      updateRecentlyRated();
    };

    if (movies.length > 0) {
      fetchRecs();
    }
  }, [movies]);

  useEffect(() => {
    const fetchGenreRecs = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const res = await axios.get(`${API_BASE}/Recommendations/Genre/${userId}`);
        setGenreRecs(res.data);
        console.log(`🎯 Loaded ${res.data.length} genre rows for user ${userId}`);
        res.data.forEach((row: any) =>
          console.log(`→ ${row.genre}: ${Array.isArray(row.recommendations) ? row.recommendations.length : 'n/a'} shows`)
        );
      } catch (err) {
        console.error("❌ Failed to fetch genre recommendations", err);
      }
    };

    if (movies.length > 0) {
      fetchGenreRecs();
    }
  }, [movies]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % FEATURED_IDS.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const updateRecentlyRated = () => {
    const storedRatings = JSON.parse(localStorage.getItem('movieRatings') || '{}');
    const ratedMovieIds = Object.keys(storedRatings).slice(-6).reverse();
    const recent = ratedMovieIds
      .map(id => movies.find(m => m.show_id === id))
      .filter((m): m is Movie => Boolean(m));
    setRecentlyRated(recent);
  };

  const handleMovieClick = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseMovieCard = () => {
    setSelectedMovie(null);
    updateRecentlyRated();
  };

  const handleFeatureNav = (direction: 'prev' | 'next') => {
    setFeaturedIndex(prev => {
      const total = FEATURED_IDS.length;
      return direction === 'prev'
        ? (prev - 1 + total) % total
        : (prev + 1) % total;
    });
  };

  const featuredMovies = movies.filter(m => FEATURED_IDS.includes(m.show_id));
  const featuredMovie = featuredMovies[featuredIndex];

  const trendingMovies = () => {
    const avgMap: Record<string, { total: number; count: number }> = {};
    ratings.forEach(r => {
      if (!avgMap[r.show_id]) avgMap[r.show_id] = { total: 0, count: 0 };
      avgMap[r.show_id].total += r.rating;
      avgMap[r.show_id].count += 1;
    });

    const topRatedIds = Object.entries(avgMap)
      .filter(([_, { total, count }]) => count > 0 && total / count >= 4)
      .map(([id]) => id);

    return movies.filter(m => topRatedIds.includes(m.show_id));
  };

  const classics = movies.filter(m => m.release_year >= 1950 && m.release_year <= 1990);
  const newReleases = movies.filter(m => m.release_year >= 2020);
  const tvShows = movies.filter(m => m.type?.toLowerCase() === 'tv show').slice(0, 25);
  const familyMovies = movies.filter(m => ['G', 'PG'].includes(m.rating?.toUpperCase() || ''));
  const bingeWorthy = movies.filter(m =>
    m.type?.toLowerCase() === 'tv show' &&
    /\d+\s*seasons?/i.test(m.duration) &&
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
      <NavBar
        onMovieClick={(id) => {
          const movie = movies.find(m => m.show_id === id);
          if (movie) {
            setSelectedMovie(movie);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {featuredMovie && (
        <FeaturedContent
          movie={featuredMovie}
          onMoreInfoClick={handleMovieClick}
          onPrev={() => handleFeatureNav('prev')}
          onNext={() => handleFeatureNav('next')}
        />
      )}

      <Container fluid className="full-width-container">
        {recommendedMovies.length > 0 && (
          <>
            <ContentRow
              title="Recommended for You"
              movies={recommendedMovies}
              onMovieClick={handleMovieClick}
              includeExplorePanel
              onExploreClick={() => setShowMoreRecs(prev => !prev)}
              customExploreLabel={showMoreRecs ? "Thanks, I'm Good for Now" : "Explore More Curated Picks For You"}
            />

            {showMoreRecs &&
              genreRecs.map((rec, index) => {
                let showIds: string[] = [];
                try {
                  showIds = Array.isArray(rec.recommendations)
                    ? rec.recommendations
                    : JSON.parse(rec.recommendations);
                } catch (e) {
                  console.error(`⚠️ Failed to parse recommendations for genre ${rec.genre}`, e);
                  return null;
                }

                const matchedMovies = showIds
                  .map(id => movies.find(m => m.show_id.trim() === id.trim()))
                  .filter((m): m is Movie => Boolean(m));

                return (
                  <ContentRow
                    key={index}
                    title={`More ${rec.genre} Picks For You`}
                    movies={matchedMovies}
                    onMovieClick={handleMovieClick}
                  />
                );
              })}
          </>
        )}

        {recentlyRated.length > 0 && (
          <ContentRow title="Recently Rated" movies={recentlyRated} onMovieClick={handleMovieClick} disableShuffle />
        )}
        <ContentRow title="Trending Now" movies={trendingMovies()} onMovieClick={handleMovieClick} />
        <ContentRow title="Binge-Worthy Shows" movies={bingeWorthy} onMovieClick={handleMovieClick} />
        <ContentRow title="New Releases" movies={newReleases} onMovieClick={handleMovieClick} />
        <ContentRow title="Family Movie Night" movies={familyMovies} onMovieClick={handleMovieClick} />
        <ContentRow title="TV Shows" movies={tvShows} onMovieClick={handleMovieClick} />
        <ContentRow title="Classics" movies={classics} onMovieClick={handleMovieClick} />
      </Container>

      {selectedMovie && <MovieCard movie={selectedMovie} onClose={handleCloseMovieCard} />}
      <Footer />
    </div>
  );
};

export default Home;