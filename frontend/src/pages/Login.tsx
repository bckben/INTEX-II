import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simulating API call
    try {
      // Add your actual login logic here
      console.log('Login attempt with:', { email, password, rememberMe });
      
      // For demonstration, just redirect after a delay
      setTimeout(() => {
        setLoading(false);
        navigate('/home');
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError('Invalid email or password. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-page">
      {/* Add background overlay */}
      <div className="login-overlay"></div>
      
      <header className="login-header">
        <Link to="/">
          <img
            src="/assets/logo.png"
            alt="CineNiche Logo"
            className="navbar-logo"
          />
        </Link>
      </header>

      <div className="login-form-wrapper">
        <div className="login-form-inner">
          <h1 className="login-title">Sign In</h1>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input"
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
                className="login-input"
                disabled={loading}
              />
            </Form.Group>

            <Button
              variant="danger"
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <div className="login-options">
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  id="remember-me"
                  label="Remember me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="remember-me"
                  disabled={loading}
                />
              </Form.Group>
              <a href="#" className="forgot-link">Need help?</a>
            </div>
          </Form>

          <div className="divider">
            <span>OR</span>
          </div>

          <Button variant="secondary" className="code-button mb-3">
            Use a sign-in code
          </Button>

          <div className="account-redirect">
            New to CineNiche? <Link to="/create" className="signup-redirect-link">Sign up now</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;