import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './navbar.module.css'; // Import CSS module for styling

const Navbar = () => {
  const location = useLocation();
  const formbotId = location.pathname.split('/')[2]; // Extract formbotId from URL

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        <li>
          <NavLink
            to={`/forms/${formbotId}/`}
            className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          >
        Flow
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/Display/${formbotId}/`}
            className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          >
           Responses
          </NavLink>
        </li>
      </ul>


      <ul className={styles.modes22}>
        <li className={styles.dd}>Dark mode</li>
        <li  className={styles.dl}>Light mode</li>
      </ul>
    </nav>
  );
};

export default Navbar;
