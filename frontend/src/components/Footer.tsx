import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <Container>
        <Row className="text-center text-md-start">
          <Col md={4} className="mb-4 mb-md-0">
            <h5>About CineNiche</h5>
            <p className="footer-description">
              CineNiche is a next-generation streaming platform delivering rare, curated content to film lovers around the world.
              From cult classics and international cinema to indie gems and obscure documentaries,
              we bring the movies you won’t find anywhere else—personalized just for you.
            </p>
          </Col>

          <Col md={4} className="mb-4 mb-md-0">
            <h5>Contact Us</h5>
            <p className="footer-description">Have questions or need help? We’re here for you.</p>
            <ul className="footer-contact">
              <li><strong>Email:</strong> support@cineniche.com</li>
              <li><strong>Phone:</strong> (888) 555-1970</li>
            </ul>
          </Col>

          <Col md={4} className="text-center text-md-start">
            <h5>Connect With Us</h5>
            <div className="social-links justify-content-center justify-content-md-start">
              <a href="#" className="social-icon"><i className="bi bi-facebook"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-twitter"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-instagram"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-youtube"></i></a>
            </div>
          </Col>
        </Row>

        <hr />

        <Row>
          <Col className="text-center">
            <p className="copyright-text">
              <strong>&copy; {new Date().getFullYear()} CineNiche.</strong> All Rights Reserved.
              &nbsp;&nbsp;|&nbsp;&nbsp;<a href="/privacy">Privacy Policy</a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;