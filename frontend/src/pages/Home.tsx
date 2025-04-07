import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import './Home.css';
import NavBar from '../components/NavBar';
import FeaturedContent from '../components/FeaturedContent';
import ContentRow from '../components/ContentRow';
import Footer from '../components/Footer';
import { fetchAllMovies, Movie } from '../api/movieApi';

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
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

  // Select a random movie for the featured content
  const featuredMovie = movies.length > 0 ? 
    movies[Math.floor(Math.random() * movies.length)] : 
    null;

  // Filter movies by type/genre for different rows
  const getMoviesByType = (type: string) => {
    return movies.filter(movie => movie.type?.toLowerCase() === type.toLowerCase());
  };

  // Categorize movies by release year (newer vs older)
  const getMoviesByYear = (startYear: number, endYear: number) => {
    return movies.filter(movie => 
      movie.release_year >= startYear && movie.release_year <= endYear
    );
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
          title={featuredMovie.title}
          description={featuredMovie.description}
          imageUrl={`/images/banners/${featuredMovie.show_id}.jpg`}
        />
      )}
      
      <Container fluid className="content-container">
        <ContentRow 
          title="Trending Now" 
          movies={movies.slice(0, 8)} 
        />
        
        <ContentRow 
          title="TV Shows" 
          movies={getMoviesByType('TV Show')} 
        />
        
        <ContentRow 
          title="Movies" 
          movies={getMoviesByType('Movie')} 
        />
        
        <ContentRow 
          title="New Releases" 
          movies={getMoviesByYear(2020, 2025)} 
        />
        
        <ContentRow 
          title="Classics" 
          movies={getMoviesByYear(1950, 1990)} 
        />
      </Container>
      
      <Footer />
    </div>
  );
};

export default Home;