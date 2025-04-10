import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookieBanner.css';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    const cookiesBannerClosed = sessionStorage.getItem('cookiesBannerClosed');
    
    // If neither accepted nor closed in this session, show the banner
    if (!cookiesAccepted && !cookiesBannerClosed) {
      // Small delay for better user experience
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // Store in localStorage (persists even after browser close)
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  const handleClose = () => {
    // Store in sessionStorage (cleared when browser is closed)
    sessionStorage.setItem('cookiesBannerClosed', 'true');
    setIsVisible(false);
  };

  return (
    <div className={`cookie-banner ${isVisible ? 'show' : ''}`}>
      <div className="cookie-content">
        <div className="cookie-text">
          We use cookies to improve your experience on our site. By continuing to browse, you agree to our use of cookies.
        </div>
        <div className="cookie-actions">
          <button className="cookie-accept" onClick={handleAccept}>
            Accept All Cookies
          </button>
          <Link to="/privacy" className="cookie-more">
            Learn More
          </Link>
        </div>
      </div>
      <button className="cookie-close" onClick={handleClose} aria-label="Close">
        &times;
      </button>
    </div>
  );
};

export default CookieBanner;