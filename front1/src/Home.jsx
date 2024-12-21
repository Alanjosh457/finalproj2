import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode'; // Install with: npm install jwt-decode

const Home = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Retrieve and decode the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the JWT
        setUsername(decoded.name); // Assuming the JWT payload includes `name`
        console.log(decoded); // Log the full decoded token to check its structure
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  return (
    <div>
      <h1>Welcome, {username ? username : 'Guest'}!</h1>
      {/* Other content for the home page */}
    </div>
  );
};

export default Home;
