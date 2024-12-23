import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import { Toaster } from 'react-hot-toast'; // Import Toaster
import Login from './Login';
import Register from './Register';
import Home from './Home';
import FormsPage from './FormsPage';
import ResponsePage from './response';
import Settings from './settings';
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
        <Route path="/settings" element={<Settings />} />
        <Route path="/forms/:formbotId" element={<FormsPage />} />
        <Route path="/response" element={<ResponsePage />} />
     
        
        {/* Add more routes here if needed */}
      </Routes>
    </div>
  );
};

export default App;
