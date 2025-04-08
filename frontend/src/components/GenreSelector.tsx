import React from 'react';
import './GenreSelector.css';

interface GenreSelectorProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

const GenreSelector: React.FC<GenreSelectorProps> = ({ selectedGenre, onGenreChange }) => {
  // List of genres - you can expand this based on your actual data
  const genres = [
    'All',
    'Action & Adventure',
    'Comedy',
    'Drama',
    'Horror',
    'Sci-Fi',
    'Thriller',
    'Documentary',
    'Anime',
    'International'
  ];

  return (
    <div className="genre-selector">
      <div className="genres-container">
        {genres.map((genre) => (
          <button
            key={genre}
            className={`genre-button ${selectedGenre === genre ? 'active' : ''}`}
            onClick={() => onGenreChange(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GenreSelector;