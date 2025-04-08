import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieById, Movie } from '../api/movieApi';
import axios from 'axios';
import './MovieDetail.css';

const fallbackPoster = '/assets/movie_tape.jpg';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [recLoading, setRecLoading] = useState(true);

  useEffect(() => {
    const loadMovie = async () => {
      if (!id) return;
      const data = await fetchMovieById(id);
      setMovie(data);
      setLoading(false);
    };
    loadMovie();
  }, [id]);

  useEffect(() => {
    const fetchRecs = async () => {
      if (!movie?.title) return;
      try {
        setRecLoading(true);
        const res = await axios.get(`/recommendations/show?title=${encodeURIComponent(movie.title)}`);
        setRecommendations(res.data);
      } catch (err) {
        console.error('Failed to fetch recommendations', err);
      } finally {
        setRecLoading(false);
      }
    };
    fetchRecs();
  }, [movie]);

  const getPosterUrl = (title: string) => {
    const normalized = title.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    return `https://cineniche.blob.core.windows.net/posters/${normalized}.jpg`;
  };

  if (loading) return <div className="loading">Loading movie...</div>;
  if (!movie) return <div className="error">Movie not found.</div>;

  return (
    <div className="movie-detail">
      <div className="poster">
        <img
          src={getPosterUrl(movie.title)}
          alt={movie.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackPoster;
          }}
        />
      </div>
      <div className="info">
        <h1>{movie.title}</h1>
        <p><strong>Director:</strong> {movie.director}</p>
        <p><strong>Cast:</strong> {movie.cast}</p>
        <p><strong>Year:</strong> {movie.release_year}</p>
        <p><strong>Rating:</strong> {movie.rating}</p>
        <p><strong>Duration:</strong> {movie.duration}</p>
        <p><strong>Description:</strong> {movie.description}</p>
      </div>

      <div className="recommendations">
        <h2>Recommended for You</h2>
        {recLoading ? (
          <p>Loading recommendations...</p>
        ) : recommendations.length > 0 ? (
          <ul>
            {recommendations.map((title, idx) => (
              <li key={idx}>{title}</li>
            ))}
          </ul>
        ) : (
          <p>No recommendations found.</p>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;