import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Import Toaster
import Header from './Header';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import FormsPage from './FormsPage';
import ResponsePage from './ResponsePage';
import SettingsPage from './SettingsPage';
import Submission from './Submission';
import DisplayAllResponses from './DisplayAllResponses';
import Navbar from './Navbar'; // Import the Navbar component
import Records from './Records'
import './App.css';

const App = () => {
  const location = useLocation(); // Get current route
  const showNavbar = ['/forms', '/Display'].some((path) =>
    location.pathname.startsWith(path)
  ); // Check if Navbar should be shown

  return (
    <div>
      <Toaster /> {/* Place Toaster here, outside Routes */}
      {/* Conditionally render Navbar */}
      {showNavbar && <Navbar />}
      
      <Routes>
        {/* Route for the landing page with Header */}
        <Route path="/" element={<Header />} />

        {/* Other independent routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Home/:workspaceId/" element={<Home key={location.pathname} />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/forms/:formbotId/" element={<FormsPage />} />
        <Route path="/response/:formbotId/" element={<ResponsePage />} />
        <Route path="/Submission" element={<Submission />} />
        <Route path="/Display/:formbotId/" element={<DisplayAllResponses />} />
        <Route path="/Records" element={<Records />} />

        {/* Add more routes here if needed */}
      </Routes>
    </div>
  );
};

export default App;
