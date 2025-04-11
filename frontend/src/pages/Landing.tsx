import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Landing.css";
import CookieBanner from "../components/CookieBanner";
import Footer from "../components/Footer";

// Enhanced email sanitization function
const sanitizeEmail = (email: string): { sanitized: string; isValid: boolean; wasModified: boolean } => {
  if (!email) return { sanitized: '', isValid: false, wasModified: false };
  
  const originalEmail = String(email).trim();
  
  // Remove potentially dangerous characters and scripts
  let sanitized = originalEmail
    .replace(/[<>]/g, '') // Remove angle brackets that could be used for HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/alert\s*\(/gi, '') // Remove alert() calls
    .replace(/script/gi, 'scrpt') // Neutralize script keyword
    .replace(/:/g, '') // Remove colons that break email format
    .replace(/;/g, '') // Remove semicolons (potential SQL injection)
    .replace(/--/g, '') // Remove SQL comment markers
    .replace(/'/g, '') // Remove single quotes (SQL injection)
    .replace(/"/g, ''); // Remove double quotes

  // Check if the email was modified during sanitization
  const wasModified = originalEmail !== sanitized;
  
  // Basic email validation regex - more permissive than HTML5's built-in validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(sanitized);
  
  return { 
    sanitized: sanitized.toLowerCase(), 
    isValid, 
    wasModified 
  };
};

const Landing: React.FC = () => {
  const [email, setEmail] = useState("");
  const [sanitizedEmail, setSanitizedEmail] = useState("");
  const [wasEmailSanitized, setWasEmailSanitized] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    
    // Skip validation for empty inputs
    if (!inputEmail.trim()) {
      setIsEmailValid(true);
      setWasEmailSanitized(false);
      setValidationMessage("");
      setSanitizedEmail("");
      return;
    }
    
    // Apply sanitization
    const { sanitized, isValid, wasModified } = sanitizeEmail(inputEmail);
    setSanitizedEmail(sanitized);
    setWasEmailSanitized(wasModified);
    setIsEmailValid(isValid);
    
    // Set appropriate validation message
    if (wasModified) {
      setValidationMessage("Your input has been adjusted for security");
    } else if (!isValid && inputEmail.length > 5) {
      setValidationMessage("Please enter a valid email address");
    } else {
      setValidationMessage("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only proceed if the email is valid after sanitization
    if (isEmailValid && sanitizedEmail) {
      window.location.href = `/create?email=${encodeURIComponent(sanitizedEmail)}`;
    } else {
      // Show validation message if trying to submit invalid email
      setValidationMessage("Please enter a valid email address");
    }
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
              Ready to watch? Enter your email to create or restart your
              membership.
            </p>

            <form onSubmit={handleSubmit} className="email-form">
              <div className="email-input-container">
                {/* Changed from type="email" to type="text" to allow our custom validation */}
                <input
                  type="text"
                  placeholder="Email address"
                  value={email}
                  onChange={handleEmailChange}
                  className={`${!isEmailValid || wasEmailSanitized ? "sanitized-input" : ""} ${!isEmailValid ? "invalid-input" : ""}`}
                  required
                  aria-invalid={!isEmailValid}
                  aria-describedby="email-validation-message"
                />
                {validationMessage && (
                  <div 
                    id="email-validation-message"
                    className={`validation-message ${!isEmailValid ? "error" : "warning"}`}
                  >
                    {validationMessage}
                  </div>
                )}
              </div>
              <button 
                type="submit" 
                className="get-started-button"
                disabled={!isEmailValid || !email.trim()}
              >
                Get Started <span className="arrow">&#8250;</span>
              </button>
            </form>
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