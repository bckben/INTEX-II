import React, { useState, useEffect } from 'react';
import { 
  fetchAllMovies, 
  deleteMovie, 
  Movie 
} from '../api/movieApi';
import MovieForm from '../components/MovieForm';
import './Admin.css';

const Admin: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [moviesPerPage, setMoviesPerPage] = useState<number>(10);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [totalMovies, setTotalMovies] = useState<number>(0);

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
        setMovies(prevMovies => prevMovies.filter(movie => movie.show_id !== movieId));
        setTotalMovies(prev => prev - 1);
      } else {
        setError('Failed to delete movie');
      }
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setShowAddForm(false);
  };

  const handleAddNew = () => {
    setEditingMovie(null);
    setShowAddForm(true);
  };

  const handleFormClose = () => {
    setEditingMovie(null);
    setShowAddForm(false);
  };

  const handleFormSubmit = () => {
    loadMovies();
    setEditingMovie(null);
    setShowAddForm(false);
  };

  const handleMoviesPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMoviesPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Pagination calculation
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  const totalPages = Math.ceil(movies.length / moviesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1>Movie Admin Dashboard</h1>

        <div className="admin-controls">
          <button className="btn-add" onClick={handleAddNew}>Add New Movie</button>

          <div className="pagination-controls">
            <span>Movies per page: </span>
            <select 
              value={moviesPerPage} 
              onChange={handleMoviesPerPageChange}
              className="select-movies-per-page"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading movies...</div>
        ) : (
          <>
            <div className="movie-table-container">
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
                      <td>{movie.director || 'N/A'}</td>
                      <td>{movie.rating}</td>
                      <td className="action-buttons">
                        <button 
                          className="btn-edit"
                          onClick={() => handleEdit(movie)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDelete(movie.show_id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="page-button"
              >
                &laquo; Prev
              </button>

              <span className="page-info">
                Page {currentPage} of {totalPages} (Showing {indexOfFirstMovie + 1}-{Math.min(indexOfLastMovie, totalMovies)} of {totalMovies})
              </span>

              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="page-button"
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
                <button className="close-button" onClick={handleFormClose}>&times;</button>
              </div>
              <MovieForm 
                movie={editingMovie}
                onSubmitSuccess={handleFormSubmit}
                onCancel={handleFormClose}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;