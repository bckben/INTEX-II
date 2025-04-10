import React, { useState, useEffect } from 'react';
import { fetchAllMovies, deleteMovie, Movie } from '../api/movieApi';
import MovieForm from '../components/MovieForm';
import Dashboard from '../components/Dashboard';
import './Admin.css';

const Admin: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [moviesPerPage, setMoviesPerPage] = useState<number>(10);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [, setTotalMovies] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'movies' | 'dashboard'>('movies');

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const data = await fetchAllMovies();
      setMovies(data);
      setTotalMovies(data.length);
      setLoading(false);
    } catch (err) {
      setError('Failed to load movies');
      setLoading(false);
    }
  };

  const handleDelete = async (movieId: string) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      const success = await deleteMovie(movieId);
      if (success) {
        setMovies(prev => prev.filter(movie => movie.show_id !== movieId));
        setTotalMovies(prev => prev - 1);
      } else {
        setError('Failed to delete movie');
      }
    }
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Admin Panel</h1>

        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'movies' ? 'active' : ''}`}
            onClick={() => setActiveTab('movies')}
          >
            Movie Database
          </button>
          <button
            className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard Reports
          </button>
        </div>

        {activeTab === 'movies' && (
          <>
            <div className="admin-controls">
              <button className="btn-add" onClick={() => setShowAddForm(true)}>Add New Movie</button>
              <div className="pagination-controls">
                <span>Movies per page: </span>
                <select
                  value={moviesPerPage}
                  onChange={(e) => {
                    setMoviesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="select-movies-per-page"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
              <div className="loading">Loading movies...</div>
            ) : (
              <>
                <table className="movie-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Year</th>
                      <th>Director</th>
                      <th>Rating</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMovies.map(movie => (
                      <tr key={movie.show_id}>
                        <td>{movie.show_id}</td>
                        <td>{movie.title}</td>
                        <td>{movie.type}</td>
                        <td>{movie.release_year}</td>
                        <td>{movie.director}</td>
                        <td>{movie.rating}</td>
                        <td className="action-buttons">
                          <button className="btn-edit" onClick={() => setEditingMovie(movie)}>Edit</button>
                          <button className="btn-delete" onClick={() => handleDelete(movie.show_id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pagination">
                  <button
                    className="page-button"
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    disabled={currentPage === 1}
                  >
                    &laquo; Prev
                  </button>
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="page-button"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next &raquo;
                  </button>
                </div>
              </>
            )}

            {(showAddForm || editingMovie) && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h2>
                    <button className="close-button" onClick={() => setShowAddForm(false)}>&times;</button>
                  </div>
                  <MovieForm
                    movie={editingMovie}
                    onSubmitSuccess={() => {
                      loadMovies();
                      setShowAddForm(false);
                    }}
                    onCancel={() => setShowAddForm(false)}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'dashboard' && <Dashboard />}
      </div>
    </div>
  );
};

export default Admin;