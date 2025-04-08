import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../api/movieApi';
import './MovieGrid.css';

interface MovieGridProps {
  movies: Movie[];
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies }) => {
  const fallbackPoster = '/assets/movie_tape.jpg'; // Default image fallback

  // Normalize movie title to match blob filename (remove symbols, keep spaces)
  const getPosterUrl = (title: string) => {
    const normalizedTitle = title
      .replace(/[^a-zA-Z0-9 ]/g, '') // Remove non-alphanumeric characters except spaces
      .trim();

    return `https://cineniche.blob.core.windows.net/posters/${normalizedTitle}.jpg`;
  };

  // 🔁 Preload all poster images
  useEffect(() => {
    movies.forEach((movie) => {
      const posterUrl = getPosterUrl(movie.title);
      const img = new Image();
      img.src = posterUrl;
    });
  }, [movies]);

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <Link
          to={`/movie/${movie.show_id}`}
          key={movie.show_id}
          className="movie-card"
        >
          <div className="movie-poster">
            <img
              src={getPosterUrl(movie.title)}
              alt={movie.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackPoster;
              }}
              className="poster-img"
            />
            <div className="hover-info">
              <h3>{movie.title}</h3>
              <div className="movie-meta">
                <span>{movie.release_year}</span>
                <span className="rating">{movie.rating}</span>
                <span>{movie.duration}</span>
              </div>
              <p className="movie-description">
                {movie.description.length > 100
                  ? `${movie.description.substring(0, 100)}...`
                  : movie.description}
              </p>
            </div>
          </div>
          <div className="movie-title">{movie.title}</div>
        </Link>
      ))}
    </div>
  );
};

export default MovieGrid;