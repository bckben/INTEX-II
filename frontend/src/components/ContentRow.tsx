// ContentRow.tsx
import React from 'react';
import { Movie } from '../api/movieApi';
import './ContentRow.css';

interface ContentRowProps {
  title: string;
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

const ContentRow: React.FC<ContentRowProps> = ({ title, movies, onMovieClick }) => {
  const getPosterUrl = (title: string): string => {
    const normalized = title
      .replace(/[^a-zA-Z0-9 ]/g, '') // remove non-alphanumeric except spaces
      .trim();

    return `https://cineniche.blob.core.windows.net/posters/${normalized}.jpg`;
  };

  return (
    <div className="content-row">
      <h2 className="row-title">{title}</h2>
      <div className="items-container">
        {movies.slice(0, 6).map((movie) => (
          <div
            key={movie.show_id}
            className="content-item"
            role="button"
            tabIndex={0}
            onClick={() => onMovieClick?.(movie)}
            onKeyDown={(e) => e.key === 'Enter' && onMovieClick?.(movie)}
          >
            <img
              src={getPosterUrl(movie.title)}
              alt={movie.title}
              className="item-image"
              onError={(e) => {
                const target = e.currentTarget;
                target.src = '/assets/movie_tape.jpg';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentRow;