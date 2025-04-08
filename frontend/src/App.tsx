import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import Home from './pages/Home';
import Login from './pages/Login';
import MovieList from './pages/MovieList';
import Landing from './pages/Landing';
import Admin from './pages/Admin';

// Import axios for global configuration
import axios from 'axios';

// Set up axios defaults
axios.defaults.baseURL = 'https://cineniche-backend-v2-haa5huekb0ejavgw.eastus-01.azurewebsites.net';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.timeout = 10000;

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movies" element={<MovieList />} />
        <Route path="/admin" element={<Admin />} />
        {/* Add other routes as you build them */}
        {/* <Route path="/signup" element={<SignUp />} /> */}
        {/* <Route path="/movie/:id" element={<MovieDetail />} /> */}
        {/* <Route path="/this-week" element={<ThisWeek />} /> */}
        {/* <Route path="/retro" element={<RetroFlashback />} /> */}
        {/* <Route path="/gallery" element={<Gallery />} /> */}
        {/* <Route path="/blog" element={<Blog />} /> */}
      </Routes>
    </Router>
  );
};
// Trigger redeploy

export default App;