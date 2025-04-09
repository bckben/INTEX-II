import React, { useEffect, useState } from 'react';
import { Movie, fetchRecommendations, fetchAllMovies } from '../api/movieApi';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie | null;
  onClose: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClose }) => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [userRating, setUserRating] = useState<number>(0);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(movie);
  const [showFullCast, setShowFullCast] = useState(false);

  const fallbackPoster = '/assets/movie_tape.jpg';

  useEffect(() => {
    const storedRatings = JSON.parse(localStorage.getItem('movieRatings') || '{}');
    if (selectedMovie?.show_id && storedRatings[selectedMovie.show_id]) {
      setUserRating(storedRatings[selectedMovie.show_id]);
    }
  }, [selectedMovie]);

  useEffect(() => {
    const loadAll = async () => {
      const all = await fetchAllMovies();
      setAllMovies(all);
    };
    loadAll();
  }, []);

  useEffect(() => {
    const loadRecs = async () => {
      if (selectedMovie?.title) {
        try {
          setLoadingRecs(true);
          const recs = await fetchRecommendations(selectedMovie.title);
          setRecommendations(recs);
        } catch (err) {
          console.error('Error loading recommendations:', err);
        } finally {
          setLoadingRecs(false);
        }
      }
    };
    loadRecs();
  }, [selectedMovie]);

  const getPosterUrl = (title: string) => {
    const normalizedTitle = title.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    return `https://cineniche.blob.core.windows.net/posters/${normalizedTitle}.jpg`;
  };

  const getActiveGenres = () => {
    const genres: string[] = [];
    Object.entries(selectedMovie || {}).forEach(([key, value]) => {
      if (
        value === 1 &&
        !['show_id', 'title', 'type', 'director', 'cast', 'country', 'release_year', 'rating', 'duration', 'description'].includes(key)
      ) {
        genres.push(key.replace(/_/g, ' '));
      }
    });
    return genres;
  };

  const handleRating = (num: number) => {
    const storedRatings = JSON.parse(localStorage.getItem('movieRatings') || '{}');
    const currentId = selectedMovie?.show_id!;
    if (userRating === num) {
      delete storedRatings[currentId];
      setUserRating(0);
    } else {
      storedRatings[currentId] = num;
      setUserRating(num);
    }
    localStorage.setItem('movieRatings', JSON.stringify(storedRatings));
  };

  if (!selectedMovie) return null;

  const activeGenres = getActiveGenres();

  const rawCast = selectedMovie.cast || '';
  const shouldTruncate = rawCast.length > 25;
  const visibleCast = showFullCast || !shouldTruncate ? rawCast : rawCast.slice(0, 25) + '...';

  return (
    <div className="movie-card-overlay" onClick={onClose}>
      <div className="movie-card-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="movie-card-content">
          <div className="movie-poster-container">
            <img
              src={getPosterUrl(selectedMovie.title)}
              alt={selectedMovie.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackPoster;
              }}
              className="movie-detail-poster"
            />
          </div>

          <div className="movie-details">
            <h2>{selectedMovie.title}</h2>
            <div className="movie-meta-details">
              <span className="year">{selectedMovie.release_year}</span>
              <span className="rating">{selectedMovie.rating}</span>
              <span className="duration">{selectedMovie.duration}</span>
            </div>
            <p className="movie-description">{selectedMovie.description}</p>

            {selectedMovie.director && (
              <p className="movie-director">
                <strong>Director:</strong> {selectedMovie.director}
              </p>
            )}

            {rawCast && (
              <p className="movie-cast">
                <strong>Cast:</strong> {visibleCast}{' '}
                {shouldTruncate && (
                  <span
                    className="see-more"
                    onClick={() => setShowFullCast(prev => !prev)}
                    style={{ color: '#999', cursor: 'pointer' }}
                  >
                    ({showFullCast ? 'see less' : 'see more'})
                  </span>
                )}
              </p>
            )}

            {activeGenres.length > 0 && (
              <div className="movie-genres">
                <span className="label">Genres:</span>
                <div className="genre-tags">
                  {activeGenres.map((genre, idx) => (
                    <span key={idx} className="genre-clip">{genre}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="rating-bar">
              <span className="label">Your Rating:</span>
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  className={`star ${userRating >= num ? 'filled' : ''}`}
                  onClick={() => handleRating(num)}
                >
                  ★
                </span>
              ))}
            </div>

            <div className="recommendation-section">
              <h3>Recommended For You</h3>
              {loadingRecs ? (
                <p className="rec-loading">Loading recommendations...</p>
              ) : (
                <div className="recommendation-carousel">
                  {recommendations.slice(0, 10).map((title, idx) => {
                    const match = allMovies.find(m => m.title === title);
                    return (
                      <div
                        className="rec-poster-card"
                        key={idx}
                        onClick={() => match && setSelectedMovie(match)}
                      >
                        <img
                          src={getPosterUrl(title)}
                          alt={title}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = fallbackPoster;
                          }}
                        />
                        <div className="rec-hover-title">{title}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;