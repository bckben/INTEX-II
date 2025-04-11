import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

const API_BASE = 'https://cineniche-backend-v2-haa5huekb0ejavgw.eastus-01.azurewebsites.net';

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

    try {
      const response = await axios.post(
        `${API_BASE}/Login?useCookies=true&useSessionCookies=true`,
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, // 👈 Enables cookie-based auth
        }
      );

      console.log('✅ Logged in successfully (cookie-based):', response);

      // Fetch user info from /pingauth
      const ping = await axios.get(`${API_BASE}/pingauth`, {
        withCredentials: true,
      });

      const roles = ping.data.roles || [];
      const userEmail = ping.data.email;

      console.log('🧠 Auth Info:', { userEmail, roles });

      // Store email & roles in localStorage
      localStorage.setItem('authEmail', userEmail);
      localStorage.setItem('authRoles', JSON.stringify(roles));

      // 🔒 Hardcoded fallback for now
      if (userEmail === 'aray@galvan.biz') {
        localStorage.setItem('userId', '19');
      } else if (userEmail === 'vicki@cineniche.com') {
        localStorage.setItem('userId', '2');
      }

      navigate('/home');
    } catch (err: any) {
      setError('Invalid email or password. Please try again.');
      console.error('❌ Login error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay"></div>

      <header className="login-header">
        <Link to="/">
          <img src="/assets/logo.png" alt="CineNiche Logo" className="navbar-logo" />
        </Link>
      </header>

      <div className="login-form-wrapper">
        <div className="login-form-inner">
          <h1 className="login-title">Sign In</h1>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
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
            <Button variant="danger" type="submit" className="login-button" disabled={loading}>
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
          <div className="divider"><span>OR</span></div>
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