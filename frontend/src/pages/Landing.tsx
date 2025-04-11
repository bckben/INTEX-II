import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";
import CookieBanner from "../components/CookieBanner";
import Footer from "../components/Footer";

const Landing: React.FC = () => {
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
            <Link to="/login" className="sign-in-button">
              Sign In
            </Link>
          </div>
        </header>

        <div className="landing-content">
          <div className="content-container">
            <h1>
              Unlimited movies,
              <br />
              TV shows, and more
            </h1>
            <h2>Watch anytime, anywhere.</h2>
            <p className="ready-text">
              Ready to watch? Start your membership today.
            </p>

            <div className="cta-button-wrapper">
              <Link to="/create" className="get-started-button">
                Get Started <span className="arrow">›</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Consent Banner */}
      <CookieBanner />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;