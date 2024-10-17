import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ token }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    profilePic: '', // Add profilePic field to manage the uploaded image
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

  const handleProfilePicUpload = async (e) => {
    const formData = new FormData();
    formData.append('profilePic', e.target.files[0]); // Append the file to form data

    try {
      const res = await axios.put('http://localhost:5000/api/users/upload-profile-pic', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(res.data.msg);
    } catch (err) {
      setError('Failed to upload profile picture');
    }
  };

  const { name, email, role, profilePic } = formData;

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
      
      {/* Profile Picture Upload */}
      <input type="file" onChange={handleProfilePicUpload} />
      {profilePic && <img src={`http://localhost:5000${profilePic}`} alt="Profile" />} {/* Display the uploaded profile pic */}
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default Profile;
