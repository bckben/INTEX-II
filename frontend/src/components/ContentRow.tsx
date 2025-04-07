import React from 'react';
import { Movie } from '../api/movieApi';
import './ContentRow.css';

interface ContentRowProps {
  title: string;
  movies: Movie[];
}

const ContentRow: React.FC<ContentRowProps> = ({ title, movies }) => {
  return (
    <div className="content-row">
      <h2 className="row-title">{title}</h2>
      <div className="items-container">
        {movies.slice(0, 6).map((movie) => (
          <div key={movie.show_id} className="content-item">
            <img 
              src={`/images/movies/${movie.show_id}.jpg`} 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder.jpg';
              }}
              alt={movie.title} 
              className="item-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentRow;