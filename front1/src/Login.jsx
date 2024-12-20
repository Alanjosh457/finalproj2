import React, { useState } from 'react';
import styles from "./login.module.css";
import { login } from './services';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const Login = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [formError, setFormError] = useState({
    email: null,
    password: null
  });

  const regi = () => {
    navigate('/register');
  }

  const handleClick = async (e) => {
    e.preventDefault();

    let errors = false;
    setFormError((formError) => {
      return { ...formError, email: null, password: null }
    });

    if (!formData.email || formData.email.length < 1 || !formData.email.includes("@") || !formData.email.includes(".")) {
      setFormError((formError) => {
        return { ...formError, email: "Valid email is required" }
      });
      errors = true;
    }

    if (!formData.password || formData.password.length < 1) {
      setFormError((formError) => {
        return { ...formError, password: "Password is required" }
      });
      errors = true;
    }

    if (errors) {
      return;
    }

    try {
      setLoading(true);
      const response = await login(formData);
      toast.success(response.message);

      if (response.token) {
        localStorage.setItem("token", response.token);
     
        
        navigate("/Home");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div>
        <h1>Login to your account</h1>
        <h1>Create your personal job finder</h1>
      </div>
      <div>
        <form className={styles.form} onSubmit={handleClick}>
          <input
            value={formData.email}
            type="text"
            placeholder='Enter email'
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {formError.email && <p className={styles.error}>{formError.email}</p>}

          <input
            value={formData.password}
            type="password"
            placeholder='Enter password'
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {formError.password && <p className={styles.error}>{formError.password}</p>}

          <button onClick={regi}>Register</button>
          <button type='submit' disabled={loading}>{loading ? "Loading..." : "Sign In"}</button>
        </form>
      </div>
    </>
  );
}

export default Login;
