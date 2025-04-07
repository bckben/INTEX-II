import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './FeaturedContent.css';

interface FeaturedContentProps {
  title: string;
  description: string;
  imageUrl: string;
  rating?: string;
  duration?: string;
  releaseYear?: number;
}

const FeaturedContent: React.FC<FeaturedContentProps> = ({ 
  title, 
  description, 
  imageUrl,
  rating,
  duration,
  releaseYear
}) => {
  return (
    <div 
      className="featured-content" 
      style={{ 
        backgroundImage: `url(${imageUrl})` 
      }}
    >
      <div className="featured-overlay">
        <Container>
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
  );
};

export default FeaturedContent;