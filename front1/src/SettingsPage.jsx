import React, { useState, useContext } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { updateUser } from './services';
import { UserContext } from './UserContext';
import styles from './settings.module.css';
import propic from './images/propic.png';
import lock from './images/lock.png';
import eye from './images/eye.png';
import logout from './images/logout22.png';

const SettingsPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { setUser } = useContext(UserContext);
  const [showOldPassword, setShowOldPassword] = useState(false); // Track visibility for old password
  const [showNewPassword, setShowNewPassword] = useState(false); // Track visibility for new password
  const navigate = useNavigate(); // Initialize useNavigate hook

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!name && !email && !newPassword) {
      toast.error('Please fill in at least one field to update.');
      return;
    }

    if (email && !validateEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (newPassword && !oldPassword) {
      toast.error('Old password is required to set a new password.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in first.');
      return;
    }

    try {
      const response = await updateUser(
        { name, email, oldPassword, newPassword },
        token
      );

      toast.success(response.message || 'Settings updated successfully!');
      const updatedUser = { name: name || '', email: email || '' };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist updates

      setName('');
      setEmail('');
      setOldPassword('');
      setNewPassword('');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'An error occurred. Please try again.');
    }
  };

  // Toggle visibility of the old password
  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  // Toggle visibility of the new password
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  // Handle logout functionality
  const handleLogout = () => {
    // Clear user data from context and local storage
    
    // Optionally, redirect to login page or home
    navigate('/'); // Replace '/login' with your actual login route
  };

  return (
    <div className={styles.container}>
      <h2>Settings</h2>
      <form onSubmit={handleUpdate} className={styles.form}>
        <div className={styles.inputGroup}>
          <img src={propic} alt="Profile" className={styles.loc} />
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your new name"
          />
        </div>
        <div className={styles.inputGroup}>
          <img src={lock} alt="Lock" className={styles.loc} />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your new email"
          />
        </div>
        <div className={styles.inputGroup}>
          <img src={lock} alt="Lock" className={styles.loc} />
          <img
            src={eye}
            alt="Show Password"
            className={styles.eye1}
            onClick={toggleOldPasswordVisibility}
          />
          <input
            type={showOldPassword ? 'text' : 'password'} // Toggle password visibility
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter your old password"
          />
        </div>
        <div className={styles.inputGroup}>
          <img src={lock} alt="Lock" className={styles.loc} />
          <img
            src={eye}
            alt="Show Password"
            className={styles.eye1}
            onClick={toggleNewPasswordVisibility}
          />
          <input
            type={showNewPassword ? 'text' : 'password'} // Toggle password visibility
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
          />
        </div>
        <button type="submit" className={styles.updateButton}>
          Update
        </button>
      </form>

      {/* Logout Button */}
      <div className={styles.loggers}>
        <img
          src={logout}
          alt="Logout"
          className={styles.logoutImage}
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
