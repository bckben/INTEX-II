import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { registerUser } from '../api/registrationApi';
import './CreateAccount.css';

const CreateAccount: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
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
      setEmail(emailParam);
    }
  }, [location]);

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
    
    try {
      setLoading(true);
      
      // Call the registration endpoint
      const response = await registerUser({
        name,
        phone,
        email,
        password
      });
      
      if (response.success) {
        console.log('Account creation successful:', response);
        
        // Store user ID from response
        localStorage.setItem('userId', response.user_id.toString());
        
        // Redirect to home page
        navigate('/home');
      } else {
        // Handle unsuccessful registration
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-account-page">
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
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="create-account-input"
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="create-account-input"
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="create-account-input"
                disabled={loading}
              />
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