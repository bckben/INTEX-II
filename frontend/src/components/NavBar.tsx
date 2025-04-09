import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './NavBar.css';
import { Movie, fetchAllMovies } from '../api/movieApi';

interface NavBarProps {
  onMovieClick?: (showId: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ onMovieClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('search') || '';
    setSearchQuery(query);
  }, [location.search]);

  useEffect(() => {
    const loadMovies = async () => {
      const data = await fetchAllMovies();
      setAllMovies(data);
    };
    loadMovies();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      const results = allMovies.filter(
        (movie) =>
          (movie.title?.toLowerCase().includes(lowerQuery) ?? false) ||
          (movie.cast?.toLowerCase().includes(lowerQuery) ?? false) ||
          (movie.director?.toLowerCase().includes(lowerQuery) ?? false)
      );
      setSearchResults(results.slice(0, 5));
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery, allMovies]);

  // Close dropdown if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
    navigate('/movies');
  };

  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        setShowDropdown(false);
        navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  return (
    <Navbar
      variant="dark"
      expand="lg"
      fixed="top"
      className={`navbar-custom ${isScrolled ? 'navbar-scrolled' : ''}`}
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/home" className="d-flex align-items-center">
          <img
            src="/assets/logo.png"
            alt="CineNiche Logo"
            className="navbar-logo me-2"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/movies">All Movies</Nav.Link>
            <Nav.Link as={Link} to="/admin">Retro Flashback</Nav.Link>
            <Nav.Link as={Link} to="/gallery">Gallery</Nav.Link>
            <Nav.Link as={Link} to="/blog">Blog</Nav.Link>
          </Nav>

          <div className="search-container position-relative me-3">
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleEnter}
              />
              {searchQuery && (
                <Button variant="outline-light" onClick={handleClear}>
                  ✕
                </Button>
              )}
            </Form>

            {showDropdown && searchResults.length > 0 && (
              <ul className="search-dropdown" ref={dropdownRef}>
                {searchResults.map((movie) => (
                  <li
                    key={movie.show_id}
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                      setShowDropdown(false);
                      onMovieClick?.(movie.show_id);
                    }}
                    className="dropdown-item"
                  >
                    {movie.title}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {isLoggedIn ? (
            <div className="user-profile">
              <img
                src="/images/profile-placeholder.jpg"
                alt="User Profile"
                className="profile-image"
              />
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">Profile</Link>
                <Link to="/settings" className="dropdown-item">Settings</Link>
                <button className="dropdown-item" onClick={() => setIsLoggedIn(false)}>
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Button
              as={Link as any}
              to="/login"
              variant="danger"
              className="logout-button"
            >
              Log Out
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;