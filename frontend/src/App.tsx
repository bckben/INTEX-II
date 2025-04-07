import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import Home from './pages/Home';
import Login from './pages/Login';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* Add other routes as you build them */}
        {/* <Route path="/this-week" element={<ThisWeek />} /> */}
        {/* <Route path="/retro" element={<RetroFlashback />} /> */}
        {/* <Route path="/gallery" element={<Gallery />} /> */}
        {/* <Route path="/blog" element={<Blog />} /> */}
        {/* <Route path="/signup" element={<Signup />} /> */}
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
      </Routes>
    </Router>
  );
};

export default App;