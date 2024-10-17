// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ token }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError('No token provided');
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in request header
          },
        });
        setFormData(res.data); // Set the fetched profile data
      } catch (err) {
        setError('Failed to load profile');
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); // Reset error
    setSuccess(''); // Reset success

    try {
      const res = await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in request header
        },
      });
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const { name, email, role } = formData;

  return (
    <div>
      <h1>Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="role"
          value={role}
          placeholder="Role"
          readOnly
        />
        <button type="submit">Update Profile</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default Profile;
