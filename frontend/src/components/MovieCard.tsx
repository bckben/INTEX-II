import React from 'react';
import { Movie } from '../api/movieApi';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie | null;
  onClose: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClose }) => {
  if (!movie) return null;

  const fallbackPoster = '/assets/movie_tape.jpg';

  const getPosterUrl = (title: string) => {
    const normalizedTitle = title.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    return `https://cineniche.blob.core.windows.net/posters/${normalizedTitle}.jpg`;
  };

  // Find which genres are active for this movie
  const getActiveGenres = () => {
    const genres: string[] = [];
    
    // Check all genre properties and add those with value of 1
    Object.entries(movie).forEach(([key, value]) => {
      if (
        value === 1 && 
        !['show_id', 'title', 'type', 'director', 'cast', 'country', 'release_year', 'rating', 'duration', 'description'].includes(key)
      ) {
        // Format the genre name for display
        const formattedGenre = key
          .replace(/_/g, ' ')
          .replace(/TV Shows/g, 'TV')
          .replace(/International Movies/g, 'Int\'l Movies');
        
        genres.push(formattedGenre);
      }
    });
    
    return genres;
  };

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
                    <span key={index} className="genre-tag">{genre}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;