import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './FeaturedContent.css';

interface FeaturedContentProps {
  title: string;
  description: string;
  rating?: string;
  duration?: string;
  releaseYear?: number;
  imageUrl?: string; // ✅ added
}

const FeaturedContent: React.FC<FeaturedContentProps> = ({
  title,
  description,
  rating,
  duration,
  releaseYear,
  imageUrl // ✅ added
}) => {
  const fallbackPoster = '/assets/movie_tape.jpg';

  const normalizeTitle = (input: string) =>
    input.replace(/[^a-zA-Z0-9 ]/g, '').trim();

  const normalized = normalizeTitle(title);
  const posterUrl = imageUrl || `https://cineniche.blob.core.windows.net/posters/${normalized}.jpg`;

  return (
    <div className="featured-wrapper">
      <div
        className="featured-content"
        style={{ backgroundImage: `url(${posterUrl})` }}
        onError={(e: any) => {
          e.target.style.backgroundImage = `url("${fallbackPoster}")`;
        }}
      >
        <div className="featured-overlay">
          <Container fluid>
            <Row>
              <Col md={6} lg={5} className="featured-text">
                <h1>{title}</h1>
                {(rating || duration || releaseYear) && (
                  <div className="featured-meta">
                    {releaseYear && <span className="year">{releaseYear}</span>}
                    {rating && <span className="rating">{rating}</span>}
                    {duration && <span className="duration">{duration}</span>}
                  </div>
                )}
                <p className="featured-description">{description}</p>
                <div className="featured-buttons">
                  <Button variant="light" size="lg" className="me-2 play-btn">
                    <i className="bi bi-play-fill"></i> Play
                  </Button>
                  <Button variant="secondary" size="lg" className="info-btn">
                    <i className="bi bi-info-circle"></i> More Info
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default FeaturedContent;