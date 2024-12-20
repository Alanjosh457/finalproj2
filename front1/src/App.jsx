import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import Cards from './Cards';
import Login from './Login';
import Register from './Register';

const App = () => {
  return (
    <Routes>
      {/* Route for the landing page with Header */}
      <Route path="/" element={<Header />} />
      
      {/* Other independent routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cards" element={<Cards />} />
      {/* Add more routes here if needed */}
    </Routes>
  );
};

export default App;
