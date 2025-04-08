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
    action: 0
  };

  const [formData, setFormData] = useState<Movie>(initialState);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'release_year' || name === 'action' 
        ? Number(value) 
        : value
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
        <label htmlFor="action">Action Level</label>
        <input
          type="range"
          id="action"
          name="action"
          value={formData.action}
          onChange={handleChange}
          min="0"
          max="5"
        />
        <div className="range-value">{formData.action}</div>
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