import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import { Toaster } from 'react-hot-toast'; // Import Toaster
import Login from './Login';
import Register from './Register';
import Home from './Home';

const App = () => {
  return (
    <div>
      <Toaster /> {/* Place Toaster here, outside Routes */}
      
      <Routes>
        {/* Route for the landing page with Header */}
        <Route path="/" element={<Header />} />
        
        {/* Other independent routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Home" element={<Home />} />
        
        {/* Add more routes here if needed */}
      </Routes>
    </div>
  );
};

export default App;
