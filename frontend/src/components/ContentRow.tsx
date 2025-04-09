import React, { useEffect, useState } from 'react';
import { Movie } from '../api/movieApi';
import './ContentRow.css';

interface ContentRowProps {
  title: string;
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

const ContentRow: React.FC<ContentRowProps> = ({ title, movies, onMovieClick }) => {
  const [displayMovies, setDisplayMovies] = useState<Movie[]>([]);
  const [visibleCount, setVisibleCount] = useState(50);

  const getPosterUrl = (title: string): string => {
    const normalized = title.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    return `https://cineniche.blob.core.windows.net/posters/${normalized}.jpg`;
  };

  // Shuffle once per session and store in sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem(`row-${title}`);
    if (stored) {
      setDisplayMovies(JSON.parse(stored));
    } else {
      const shuffled = [...movies];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      sessionStorage.setItem(`row-${title}`, JSON.stringify(shuffled));
      setDisplayMovies(shuffled);
    }
  }, [title, movies]);

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + 50);
  };

  return (
    <div className="content-row">
      <h2 className="row-title">{title}</h2>
      <div className="items-container">
        {displayMovies.slice(0, visibleCount).map((movie) => (
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
              loading="eager"
              onError={(e) => {
                const target = e.currentTarget;
                target.src = '/assets/movie_tape.jpg';
              }}
            />
          </div>
        ))}

        {visibleCount < displayMovies.length && (
          <div className="see-more-card" onClick={handleSeeMore}>
            + See More
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentRow;