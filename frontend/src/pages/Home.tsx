import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './Home.css';
import NavBar from '../components/NavBar';
import FeaturedContent from '../components/FeaturedContent';
import ContentRow from '../components/ContentRow';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  // These will be fetched from the API later
  const featuredContent = {
    title: "CineNiche Exclusive",
    description: "Searching for gems... and exploiting them any way we can.",
    imageUrl: "/images/featured-banner.jpg"
  };

  // These will be fetched from the API later
  const categories = [
    {
      id: 1,
      title: "Indie Favorites",
      items: Array(6).fill(null).map((_, i) => ({ id: i, title: `Movie ${i}`, imageUrl: "/images/placeholder.jpg" }))
    },
    {
      id: 2,
      title: "Cult Classics",
      items: Array(6).fill(null).map((_, i) => ({ id: i, title: `Movie ${i}`, imageUrl: "/images/placeholder.jpg" }))
    },
    {
      id: 3,
      title: "Documentary Spotlight",
      items: Array(6).fill(null).map((_, i) => ({ id: i, title: `Movie ${i}`, imageUrl: "/images/placeholder.jpg" }))
    }
  ];

  return (
    <div className="home-page">
      <NavBar />
      
      <FeaturedContent 
        title={featuredContent.title}
        description={featuredContent.description}
        imageUrl={featuredContent.imageUrl}
      />
      
      <Container fluid className="content-container">
        {categories.map((category) => (
          <ContentRow 
            key={category.id}
            title={category.title} 
            items={category.items} 
          />
        ))}
      </Container>
      
      <Footer />
    </div>
  );
};

export default Home;