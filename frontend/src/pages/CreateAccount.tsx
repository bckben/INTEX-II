import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './CreateAccount.css';

const API_BASE = 'https://cineniche-backend-v2-haa5huekb0ejavgw.eastus-01.azurewebsites.net';

// Email sanitization function
const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  
  const originalEmail = String(email).trim();
  
  // Remove potentially dangerous characters and scripts
  let sanitized = originalEmail
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/script/gi, '') // Remove script keyword entirely
    .replace(/alert/gi, '') // Remove alert keyword entirely
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/:/g, '') // Remove colons
    .replace(/;/g, '') // Remove semicolons
    .replace(/--/g, '') // Remove SQL comment markers
    .replace(/'/g, '') // Remove single quotes
    .replace(/"/g, ''); // Remove double quotes
  
  return sanitized.toLowerCase();
};

const CreateAccount: React.FC = () => {
  const [email, setEmail] = useState('');
  const [wasEmailSanitized, setWasEmailSanitized] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Extract email from URL parameters on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get('email');
    if (emailParam) {
      const sanitizedEmail = sanitizeEmail(emailParam);
      setEmail(sanitizedEmail);
      setWasEmailSanitized(sanitizedEmail !== emailParam);
    }
  }, [location]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setWasEmailSanitized(false);
  };

  // Sanitize when focus leaves the input field
  const handleEmailBlur = () => {
    const originalEmail = email;
    const sanitizedEmail = sanitizeEmail(originalEmail);
    
    // Only update if something was changed
    if (originalEmail !== sanitizedEmail) {
      setEmail(sanitizedEmail);
      setWasEmailSanitized(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error state
    setError('');
    
    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Ensure terms are agreed to
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service');
      return;
    }
    
    // Ensure email is sanitized before submission
    const finalEmail = sanitizeEmail(email);
    
    try {
      setLoading(true);
      
      // Call the registration endpoint with sanitized email
      const response = await axios.post(
        `${API_BASE}/register`,
        { email: finalEmail, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Enable cookie-based auth (same as login)
        }
      );
      
      console.log('✅ Registration successful:', response);
      
      // Fetch user info from /pingauth (same as login page)
      const ping = await axios.get(`${API_BASE}/pingauth`, {
        withCredentials: true,
      });

      const roles = ping.data.roles || [];
      const userEmail = ping.data.email;

      console.log('🧠 Auth Info:', { userEmail, roles });

      // Store info in localStorage (same as login page)
      localStorage.setItem('authEmail', userEmail);
      localStorage.setItem('authRoles', JSON.stringify(roles));
      localStorage.setItem('authToken', 'cookie-auth');

      // Redirect to home page
      navigate('/login');
      
    } catch (error: any) {
      console.error('❌ Registration failed:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-account-page">
      {/* Add background overlay */}
      <div className="create-account-overlay"></div>
      
      <div className="create-account-header">
        <Link to="/" className="brand-link d-flex align-items-center">
          <img
            src="/assets/logo.png"
            alt="CineNiche Logo"
            className="navbar-logo"
          />
        </Link>
      </div>

      <div className="create-account-form-wrapper">
        <div className="create-account-form-inner">
          <h1 className="create-account-title">Create Account</h1>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3 email-input-container">
              <Form.Control
                type="text"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                required
                className={`create-account-input ${wasEmailSanitized ? "sanitized-input" : ""}`}
                disabled={loading}
              />
              {wasEmailSanitized && (
                <div className="validation-message warning">
                  Your input has been adjusted for security
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="create-account-input"
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="create-account-input"
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3 terms-container">
              <Form.Check
                type="checkbox"
                id="agree-terms"
                label={<>I agree to the <Link to="/privacy" className="terms-link">Terms of Service</Link></>}
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
                className="agree-terms"
                disabled={loading}
              />
            </Form.Group>

            <Button
              variant="danger"
              type="submit"
              className="create-account-button w-100"
              disabled={!agreeTerms || loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Form>

          <div className="account-exists">
            Already have an account? <Link to="/login" className="login-redirect-link">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;