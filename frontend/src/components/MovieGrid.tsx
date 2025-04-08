import React, { useEffect } from 'react';
import './MovieGrid.css';
import { Movie } from '../api/movieApi';

interface MovieGridProps {
  movies: Movie[];
  onMovieClick?: (showId: string) => void; // 🔥 Optional click handler
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, onMovieClick }) => {
  const fallbackPoster = '/assets/movie_tape.jpg';

  const getPosterUrl = (title: string) => {
    const normalizedTitle = title.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    return `https://cineniche.blob.core.windows.net/posters/${normalizedTitle}.jpg`;
  };

  useEffect(() => {
    movies.forEach((movie) => {
      const img = new Image();
      img.src = getPosterUrl(movie.title);
    });
  }, [movies]);

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <div
          key={movie.show_id}
          className="movie-card"
          onClick={() => onMovieClick?.(movie.show_id)} // 🧠 Only fires if onMovieClick is passed
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onMovieClick?.(movie.show_id);
          }}
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
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;