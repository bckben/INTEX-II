import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchAllMovies, fetchMovieById, Movie } from '../api/movieApi';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import GenreSelector from '../components/GenreSelector';
import MovieGrid from '../components/MovieGrid';
import MovieCard from '../components/MovieCard';
import './MovieList.css';
import Fuse from 'fuse.js';

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
  const [fuzzySuggestions, setFuzzySuggestions] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const MOVIES_PER_BATCH = 100;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search')?.toLowerCase() || '';

  const genreFieldMap: Record<string, string[]> = {
    'Action & Adventure': ['action', 'adventure', 'tV_Action'],
    Comedy: ['comedies', 'tV_Comedies', 'comedies_International_Movies', 'comedies_Romantic_Movies'],
    Drama: ['dramas', 'tV_Dramas', 'dramas_International_Movies', 'dramas_Romantic_Movies'],
    Horror: ['horror_Movies'],
    Fantasy: ['fantasy'],
    Thriller: ['thrillers', 'international_Movies_Thrillers'],
    Documentary: ['documentaries', 'docuseries', 'crime_TV_Shows_Docuseries'],
    Anime: ['anime_Series_International_TV_Shows'],
    International: ['british_TV_Shows_Docuseries_International_TV_Shows', 'documentaries_International_Movies'],
  };

  const filterAndSortMovies = (movies: Movie[], query: string): Movie[] => {
    if (!query) return movies;

    const lowerQuery = query.toLowerCase();

    return movies.filter(
      (movie) =>
        (movie.title?.toLowerCase().includes(lowerQuery) ?? false) ||
        (movie.cast?.toLowerCase().includes(lowerQuery) ?? false) ||
        (movie.director?.toLowerCase().includes(lowerQuery) ?? false) ||
        movie.release_year?.toString().includes(lowerQuery)
    );
  };

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchAllMovies();
        setMovies(data);
      } catch (err) {
        setError('Failed to load movies. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  useEffect(() => {
    if (!loading && movies.length > 0) {
      let result = [...movies];

      if (selectedGenre !== 'All') {
        const genreKeys = genreFieldMap[selectedGenre] || [];
        result = result.filter((movie: any) =>
          genreKeys.some((key) => movie[key] === 1)
        );
      }

      let exactMatches = result;
      if (searchQuery) {
        exactMatches = filterAndSortMovies(result, searchQuery);
      }

      exactMatches.sort((a, b) =>
        sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title)
      );

      setFilteredMovies(exactMatches);
      setDisplayedMovies(exactMatches.slice(0, MOVIES_PER_BATCH));
      setHasMore(exactMatches.length > MOVIES_PER_BATCH);

      if (searchQuery && exactMatches.length === 0) {
        const fuse = new Fuse(result, {
          threshold: 0.4,
          keys: ['title', 'cast', 'director', 'release_year'],
        });

        const fuzzy = fuse.search(searchQuery).map((res) => res.item);
        setFuzzySuggestions(fuzzy.slice(0, 10));
      } else {
        setFuzzySuggestions([]);
      }
    }
  }, [loading, movies, selectedGenre, sortOrder, searchQuery]);

  const loadMoreMovies = useCallback(() => {
    if (!hasMore) return;
    const currentCount = displayedMovies.length;
    const nextBatch = filteredMovies.slice(currentCount, currentCount + MOVIES_PER_BATCH);
    setDisplayedMovies((prev) => [...prev, ...nextBatch]);
    if (currentCount + MOVIES_PER_BATCH >= filteredMovies.length) {
      setHasMore(false);
    }
  }, [displayedMovies, filteredMovies, hasMore]);

  const lastMovieRef = useCallback(
    (node: HTMLDivElement) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreMovies();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadMoreMovies, hasMore]
  );

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
  };

  const handleSortChange = (order: 'asc' | 'desc') => {
    setSortOrder(order);
  };

  const handleMovieClick = async (showId: string) => {
    const movieFromList = movies.find((m) => m.show_id === showId);
    if (movieFromList) {
      setSelectedMovie(movieFromList);
    } else {
      try {
        const movieData = await fetchMovieById(showId);
        if (movieData) {
          setSelectedMovie(movieData);
        }
      } catch (err) {
        console.error(`Error fetching movie ${showId}:`, err);
      }
    }
  };

  const handleCloseMovieCard = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="movie-list-page">
      <Navbar onMovieClick={handleMovieClick} />

      <div className="container">
        <div className="header-section">
          <h1>
            {selectedGenre === 'All' ? 'All Movies' : `${selectedGenre} Movies`}
          </h1>
          <div className="sorting-controls">
            <button
              className={`sort-button ${sortOrder === 'asc' ? 'active' : ''}`}
              onClick={() => handleSortChange('asc')}
            >
              A-Z
            </button>
            <button
              className={`sort-button ${sortOrder === 'desc' ? 'active' : ''}`}
              onClick={() => handleSortChange('desc')}
            >
              Z-A
            </button>
          </div>
        </div>

        <GenreSelector
          selectedGenre={selectedGenre}
          onGenreChange={handleGenreChange}
        />

        {loading ? (
          <div className="loading">Loading movies...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : filteredMovies.length === 0 ? (
          <>
            <div className="no-results">
              No exact matches found for "<strong>{searchQuery}</strong>".
            </div>
            {fuzzySuggestions.length > 0 && (
              <div className="fuzzy-suggestions">
                <h5>You might be thinking of:</h5>
                <MovieGrid movies={fuzzySuggestions} onMovieClick={handleMovieClick} />
              </div>
            )}
          </>
        ) : (
          <>
            <MovieGrid movies={displayedMovies} onMovieClick={handleMovieClick} />
            {hasMore && (
              <div ref={lastMovieRef} style={{ height: '50px', textAlign: 'center', padding: '20px' }}>
                <span style={{ color: '#999' }}>Loading more movies...</span>
              </div>
            )}
          </>
        )}
      </div>

      {selectedMovie && (
        <MovieCard movie={selectedMovie} onClose={handleCloseMovieCard} />
      )}

      <Footer />
    </div>
  );
};

export default MovieList;