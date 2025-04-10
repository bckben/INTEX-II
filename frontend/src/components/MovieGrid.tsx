import React, { useEffect, useRef, useState, useCallback } from 'react';
import './MovieGrid.css';
import { Movie } from '../api/movieApi';

interface MovieGridProps {
  movies: Movie[];
  onMovieClick?: (showId: string) => void;
}

const CHUNK_SIZE = 50;

const MovieGrid: React.FC<MovieGridProps> = ({ movies, onMovieClick }) => {
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastMovieRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => Math.min(prev + CHUNK_SIZE, movies.length));
      }
    });

    if (node) observerRef.current.observe(node);
  }, [movies.length]);

  const fallbackPoster = '/assets/movie_tape.jpg';

  const getPosterUrl = (title: string) => {
    const normalized = title.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    return `https://cineniche.blob.core.windows.net/posters/${normalized}.jpg`;
  };

  return (
    <div className="movie-grid">
      {movies.slice(0, visibleCount).map((movie, idx) => {
        const isLast = idx === visibleCount - 1;

        return (
          <div
            key={movie.show_id}
            ref={isLast ? lastMovieRef : null}
            className="movie-card"
            onClick={() => onMovieClick?.(movie.show_id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onMovieClick?.(movie.show_id)}
          >
            <div className="movie-poster">
              <img
                src={getPosterUrl(movie.title)}
                alt={movie.title}
                loading="lazy"
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
        );
      })}
    </div>
  );
};

export default MovieGrid;