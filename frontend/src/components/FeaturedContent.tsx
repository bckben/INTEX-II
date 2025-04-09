// FeaturedContent.tsx
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Movie } from '../api/movieApi';
import './FeaturedContent.css';

interface FeaturedContentProps {
  movie: Movie;
  onMoreInfoClick: (movie: Movie) => void;
}

const FeaturedContent: React.FC<FeaturedContentProps> = ({ movie, onMoreInfoClick }) => {
  const fallbackPoster = '/assets/movie_tape.jpg';

  const getPosterUrl = (title: string) =>
    `https://cineniche.blob.core.windows.net/posters/${title.replace(/[^a-zA-Z0-9 ]/g, '').trim()}.jpg`;

  return (
    <div className="featured-wrapper">
      <Container fluid className="featured-container">
        <Row className="align-items-center gx-5">
          <Col md={7} className="featured-text">
            <h1 className="featured-title">{movie.title}</h1>
            <div className="featured-meta">
              {movie.release_year && <span className="year">{movie.release_year}</span>}
              {movie.rating && <span className="rating">{movie.rating}</span>}
              {movie.duration && <span className="duration">{movie.duration}</span>}
            </div>
            <p className="featured-description">{movie.description}</p>
            <div className="featured-buttons">
              <Button variant="light" size="lg" className="me-2 play-btn">
                <i className="bi bi-play-fill"></i> Play
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="info-btn"
                onClick={() => onMoreInfoClick(movie)}
              >
                <i className="bi bi-info-circle"></i> More Info
              </Button>
            </div>
          </Col>

          <Col md={5} className="featured-poster">
            <div className="poster-frame">
              <img
                src={getPosterUrl(movie.title)}
                alt={movie.title}
                onError={(e) => (e.currentTarget.src = fallbackPoster)}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FeaturedContent;