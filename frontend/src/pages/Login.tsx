import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This will be connected to your API later
    console.log('Login attempt with:', { email, password, rememberMe });
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <Link to="/" className="brand-link">
          <span className="brand-text">CineNiche</span>
        </Link>
      </div>

      <div className="login-form-wrapper">
        <div className="login-form-inner">
          <h1 className="login-title">Sign In</h1>
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input"
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
              />
            </Form.Group>

            <Button 
              variant="danger" 
              type="submit" 
              className="login-button w-100"
            >
              Sign In
            </Button>

            <div className="login-options mt-3">
              <Form.Check
                type="checkbox"
                id="remember-me"
                label="Remember me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="remember-me"
              />
              <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            </div>
          </Form>

          <div className="divider">
            <span>OR</span>
          </div>

          <Button 
            variant="secondary" 
            className="code-button w-100"
          >
            Use a Sign-In Code
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;