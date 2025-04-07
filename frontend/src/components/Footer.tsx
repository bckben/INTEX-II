import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <Container>
        <Row>
          <Col md={4}>
            <h5>About CineNiche</h5>
            <p>"Searching for gems... and exploiting them any way we can."</p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="footer-links">
              <li><a href="/film-reviews">Film Reviews</a></li>
              <li><a href="/study-on-fear">A Study On Fear</a></li>
              <li><a href="/fake-criterion">Fake Criterions & Images</a></li>
              <li><a href="/shop">Etsy Shop</a></li>
              <li><a href="/childrens-book">Children's Book</a></li>
              <li><a href="/radio-interview">Radio Interview</a></li>
              <li><a href="/deviantart">DeviantART</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Connect With Us</h5>
            <div className="social-links">
              <a href="#" className="social-icon"><i className="bi bi-facebook"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-twitter"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-instagram"></i></a>
              <a href="#" className="social-icon"><i className="bi bi-youtube"></i></a>
            </div>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <p className="copyright-text">
              &copy; {new Date().getFullYear()} CineNiche. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;