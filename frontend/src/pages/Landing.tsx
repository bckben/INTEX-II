import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';
import CookieBanner from '../components/CookieBanner';

const Landing: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to the CreateAccount page with the email as a URL parameter
    // Using the correct route path from App.tsx (/create instead of /create-account)
    window.location.href = `/create?email=${encodeURIComponent(email)}`;
  };

  return (
    <div className="landing-page">
      <div className="landing-background">
        <div className="landing-overlay"></div>
        <header className="landing-header">
          <div className="landing-logo">
            <Link to="/">
              <img
                src="/assets/logo.png"
                alt="CineNiche Logo"
                className="navbar-logo"
              />
            </Link>
          </div>
          <div className="landing-nav">
            <div className="language-selector">
              <select defaultValue="en">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
            <Link to="/login" className="sign-in-button">Sign In</Link>
          </div>
        </header>

        <div className="landing-content">
          <div className="content-container">
            <h1>Unlimited movies,<br />TV shows, and more</h1>
            <h2>Watch anytime, anywhere.</h2>
            <p className="ready-text">Ready to watch? Enter your email to create or restart your membership.</p>
            
            <form onSubmit={handleSubmit} className="email-form">
              <input 
                type="email" 
                placeholder="Email address" 
                value={email}
                onChange={handleEmailChange}
                required
              />
              <button type="submit" className="get-started-button">
                Get Started <span className="arrow">&#8250;</span>
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Cookie Consent Banner */}
      <CookieBanner />
    </div>
  );
};

export default Landing;