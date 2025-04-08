import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../api/movieApi';
import './MovieGrid.css';

interface MovieGridProps {
  movies: Movie[];
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies }) => {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <Link 
          to={`/movie/${movie.show_id}`} 
          key={movie.show_id} 
          className="movie-card"
        >
          <div className="movie-poster">
            {/* Since we don't have poster URLs in the data model, using a placeholder */}
            <div className="placeholder-poster">
              {/* Display first letter of movie title as a fallback */}
              {movie.title.charAt(0)}
            </div>
            <div className="hover-info">
              <h3>{movie.title}</h3>
              <div className="movie-meta">
                <span>{movie.release_year}</span>
                <span className="rating">{movie.rating}</span>
                <span>{movie.duration}</span>
              </div>
              <p className="movie-description">{
                movie.description.length > 100 
                  ? `${movie.description.substring(0, 100)}...` 
                  : movie.description
              }</p>
            </div>
          </div>
          <div className="movie-title">{movie.title}</div>
        </Link>
      ))}
    </div>
  );
};

export default MovieGrid;