// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To redirect after login

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState(''); // For handling errors

  const navigate = useNavigate(); // Initialize useNavigate to redirect after login

  const { email, password } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      // Make a POST request to the login endpoint
      const res = await axios.post('http://localhost:5000/api/users/login', formData);
      
      // Extract token from response
      const { token } = res.data;
      
      // Save the token in localStorage
      localStorage.setItem('token', token);
      
      // Set the token in the app state (for managing logged-in status)
      setToken(token);

      // Redirect to homepage (or any other route) after successful login
      navigate('/');
      
      console.log('Logged in successfully');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid login credentials'); // Set error message for invalid login
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if login fails */}
    </div>
  );
};

export default Login;
