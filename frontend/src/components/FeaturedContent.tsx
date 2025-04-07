import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './FeaturedContent.css';

interface FeaturedContentProps {
  title: string;
  description: string;
  imageUrl: string;
}

const FeaturedContent: React.FC<FeaturedContentProps> = ({ title, description, imageUrl }) => {
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
              <p className="featured-description">{description}</p>
              <div className="featured-buttons">
                <Button variant="danger" size="lg" className="me-2">
                  <i className="bi bi-play-fill"></i> Watch Now
                </Button>
                <Button variant="secondary" size="lg">
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