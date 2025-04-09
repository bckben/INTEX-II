import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

          <Form className="d-flex me-3">
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-light">
              <i className="bi bi-search"></i>
            </Button>
          </Form>

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