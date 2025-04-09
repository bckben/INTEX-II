import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './CreateAccount.css';

const CreateAccount: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    console.log('Account creation with:', { name, phone, email, password, agreeTerms });

    // Simulate successful registration
    localStorage.setItem('userId', '3'); // Replace with actual logic later
    navigate('/home');
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

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="create-account-input"
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
              />
            </Form.Group>

            <Form.Group className="mb-3 terms-container">
              <Form.Check
                type="checkbox"
                id="agree-terms"
                label="I agree to the Terms of Service"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
                className="agree-terms"
              />
            </Form.Group>

            <Button
              variant="danger"
              type="submit"
              className="create-account-button w-100"
              disabled={!agreeTerms}
            >
              Create Account
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