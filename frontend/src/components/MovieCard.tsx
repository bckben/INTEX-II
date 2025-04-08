import React, { useEffect, useState } from 'react';
import { Movie, fetchRecommendations } from '../api/movieApi';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie | null;
  onClose: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClose }) => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  const fallbackPoster = '/assets/movie_tape.jpg';

  useEffect(() => {
    const loadRecs = async () => {
      if (movie?.title) {
        try {
          setLoadingRecs(true);
          const recs = await fetchRecommendations(movie.title);
          setRecommendations(recs);
        } catch (err) {
          console.error('Error loading recommendations:', err);
        } finally {
          setLoadingRecs(false);
        }
      }
    };

    loadRecs();
  }, [movie]);

  const getPosterUrl = (title: string) => {
    const normalizedTitle = title.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    return `https://cineniche.blob.core.windows.net/posters/${normalizedTitle}.jpg`;
  };

  const getActiveGenres = () => {
    const genres: string[] = [];
    Object.entries(movie || {}).forEach(([key, value]) => {
      if (
        value === 1 &&
        !['show_id', 'title', 'type', 'director', 'cast', 'country', 'release_year', 'rating', 'duration', 'description'].includes(key)
      ) {
        const formatted = key
          .replace(/_/g, ' ')
          .replace(/TV Shows/g, 'TV')
          .replace(/International Movies/g, "Int'l Movies");
        genres.push(formatted);
      }
    });
    return genres;
  };

  if (!movie) return null;
  const activeGenres = getActiveGenres();

  return (
    <div className="movie-card-overlay" onClick={onClose}>
      <div className="movie-card-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>

        <div className="movie-card-content">
          <div className="movie-poster-container">
            <img
              src={getPosterUrl(movie.title)}
              alt={movie.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackPoster;
              }}
              className="movie-detail-poster"
            />
          </div>

          <div className="movie-details">
            <h2>{movie.title}</h2>

            <div className="movie-meta-details">
              <span className="year">{movie.release_year}</span>
              <span className="rating">{movie.rating}</span>
              <span className="duration">{movie.duration}</span>
            </div>

            <p className="movie-description">{movie.description}</p>

            <div className="movie-extra-details">
              {movie.director && (
                <div className="detail-item">
                  <span className="label">Director:</span>
                  <span>{movie.director}</span>
                </div>
              )}
              {movie.cast && (
                <div className="detail-item">
                  <span className="label">Cast:</span>
                  <span>{movie.cast}</span>
                </div>
              )}
              {movie.country && (
                <div className="detail-item">
                  <span className="label">Country:</span>
                  <span>{movie.country}</span>
                </div>
              )}
              {movie.type && (
                <div className="detail-item">
                  <span className="label">Type:</span>
                  <span>{movie.type}</span>
                </div>
              )}
            </div>

            {activeGenres.length > 0 && (
              <div className="movie-genres">
                <span className="label">Genres:</span>
                <div className="genre-tags">
                  {activeGenres.map((genre, index) => (
                    <span key={index} className="genre-clip">{genre}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="recommendation-section">
              <h3>Recommended For You</h3>
              {loadingRecs ? (
                <p className="rec-loading">Loading recommendations...</p>
              ) : recommendations.length > 0 ? (
                <ul className="rec-list">
                  {recommendations.slice(0, 5).map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              ) : (
                <p className="no-recs">No recommendations found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;