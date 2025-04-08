import React, { useState } from 'react';
import { Movie, addMovie, updateMovie } from '../api/movieApi';
import './MovieForm.css';

interface MovieFormProps {
  movie: Movie | null;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

const MovieForm: React.FC<MovieFormProps> = ({ 
  movie, 
  onSubmitSuccess, 
  onCancel 
}) => {
  const initialState: Movie = movie || {
    show_id: '',
    type: '',
    title: '',
    director: '',
    cast: '',
    country: '',
    release_year: new Date().getFullYear(),
    rating: '',
    duration: '',
    description: '',
    Action: 0,
    Adventure: 0,
    Anime_Series_International_TV_Shows: 0,
    British_TV_Shows_Docuseries_International_TV_Shows: 0,
    Children: 0,
    Comedies: 0,
    Comedies_Dramas_International_Movies: 0,
    Comedies_International_Movies: 0,
    Comedies_Romantic_Movies: 0,
    Crime_TV_Shows_Docuseries: 0,
    Documentaries: 0,
    Documentaries_International_Movies: 0,
    Docuseries: 0,
    Dramas: 0,
    Dramas_International_Movies: 0,
    Dramas_Romantic_Movies: 0,
    Family_Movies: 0,
    Fantasy: 0,
    Horror_Movies: 0,
    International_Movies_Thrillers: 0,
    International_TV_Shows_Romantic_TV_Shows_TV_Dramas: 0,
    Kids__TV: 0,
    Language_TV_Shows: 0,
    Musicals: 0,
    Nature_TV: 0,
    Reality_TV: 0,
    Spirituality: 0,
    TV_Action: 0,
    TV_Comedies: 0,
    TV_Dramas: 0,
    Talk_Shows_TV_Comedies: 0,
    Thrillers: 0
  };

  const [formData, setFormData] = useState<Movie>(initialState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Initialize selected genres based on movie data
  React.useEffect(() => {
    if (movie) {
      const genres: string[] = [];
      Object.entries(movie).forEach(([key, value]) => {
        if (value === 1 && key !== 'show_id' && key !== 'release_year' && 
            !['type', 'title', 'director', 'cast', 'country', 'rating', 'duration', 'description'].includes(key)) {
          genres.push(key);
        }
      });
      setSelectedGenres(genres);
    }
  }, [movie]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'release_year' ? Number(value) : value
    }));
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    // Update selected genres list for UI
    if (checked) {
      setSelectedGenres(prev => [...prev, name]);
    } else {
      setSelectedGenres(prev => prev.filter(genre => genre !== name));
    }
    
    // Update formData with 1 or 0 value
    setFormData(prev => ({
      ...prev,
      [name]: checked ? 1 : 0
    }));
  };

  const handleRemoveGenre = (genre: string) => {
    setSelectedGenres(prev => prev.filter(g => g !== genre));
    setFormData(prev => ({
      ...prev,
      [genre]: 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let success;
      if (movie) {
        // Update existing movie
        success = await updateMovie(formData);
      } else {
        // Add new movie
        const newMovie = await addMovie(formData);
        success = !!newMovie;
      }

      if (success) {
        onSubmitSuccess();
      } else {
        setError('Failed to save movie');
      }
    } catch (err) {
      setError('An error occurred while saving the movie');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // All available genres from the Movie interface
  const allGenres = [
    'Action', 'Adventure', 'Anime_Series_International_TV_Shows',
    'British_TV_Shows_Docuseries_International_TV_Shows', 'Children',
    'Comedies', 'Comedies_Dramas_International_Movies',
    'Comedies_International_Movies', 'Comedies_Romantic_Movies',
    'Crime_TV_Shows_Docuseries', 'Documentaries',
    'Documentaries_International_Movies', 'Docuseries', 'Dramas',
    'Dramas_International_Movies', 'Dramas_Romantic_Movies',
    'Family_Movies', 'Fantasy', 'Horror_Movies', 'International_Movies_Thrillers',
    'International_TV_Shows_Romantic_TV_Shows_TV_Dramas', 'Kids__TV',
    'Language_TV_Shows', 'Musicals', 'Nature_TV', 'Reality_TV',
    'Spirituality', 'TV_Action', 'TV_Comedies', 'TV_Dramas',
    'Talk_Shows_TV_Comedies', 'Thrillers'
  ];

  // Display formatted genre name
  const formatGenreName = (genre: string) => {
    return genre
      .replace(/_/g, ' ')
      .replace(/TV Shows/g, 'TV')
      .replace(/International Movies/g, 'Int\'l Movies');
  };

  return (
    <form onSubmit={handleSubmit} className="movie-form">
      {error && <div className="form-error">{error}</div>}
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="show_id">Movie ID</label>
          <input
            type="text"
            id="show_id"
            name="show_id"
            value={formData.show_id}
            onChange={handleChange}
            disabled={!!movie}
            required
          />
          {!movie && <small>Enter a unique ID for the movie</small>}
        </div>

        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select a type</option>
            <option value="Movie">Movie</option>
            <option value="TV Show">TV Show</option>
            <option value="Documentary">Documentary</option>
            <option value="Stand-up Comedy">Stand-up Comedy</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="director">Director</label>
          <input
            type="text"
            id="director"
            name="director"
            value={formData.director}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="cast">Cast</label>
          <input
            type="text"
            id="cast"
            name="cast"
            value={formData.cast}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="release_year">Release Year</label>
          <input
            type="number"
            id="release_year"
            name="release_year"
            value={formData.release_year}
            onChange={handleChange}
            min="1900"
            max="2099"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <select
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
          >
            <option value="">Select a rating</option>
            <option value="G">G</option>
            <option value="PG">PG</option>
            <option value="PG-13">PG-13</option>
            <option value="R">R</option>
            <option value="TV-Y">TV-Y</option>
            <option value="TV-Y7">TV-Y7</option>
            <option value="TV-G">TV-G</option>
            <option value="TV-PG">TV-PG</option>
            <option value="TV-14">TV-14</option>
            <option value="TV-MA">TV-MA</option>
            <option value="NR">NR (Not Rated)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="duration">Duration</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g. 120 min or 2 Seasons"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Genres</label>
        <div className="selected-genres">
          {selectedGenres.map(genre => (
            <div key={genre} className="genre-tag">
              {formatGenreName(genre)}
              <button 
                type="button" 
                onClick={() => handleRemoveGenre(genre)}
                className="remove-genre"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        <div className="genre-dropdown">
          <label htmlFor="genre-select">Add Genre:</label>
          <div className="genre-options">
            {allGenres.map(genre => (
              <div key={genre} className="genre-option">
                <input
                  type="checkbox"
                  id={`genre-${genre}`}
                  name={genre}
                  checked={selectedGenres.includes(genre)}
                  onChange={handleGenreChange}
                />
                <label htmlFor={`genre-${genre}`}>{formatGenreName(genre)}</label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="form-buttons">
        <button 
          type="button" 
          className="btn-cancel"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn-submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : movie ? 'Update Movie' : 'Add Movie'}
        </button>
      </div>
    </form>
  );
};

export default MovieForm;