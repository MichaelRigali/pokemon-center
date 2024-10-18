import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = ({ token }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    profilePic: '/uploads/profile_pics/default-profile.png' // Default profile picture
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(Date.now()); // Force image reload with timestamp

  // Fetch user data when the component mounts or token changes
  const fetchProfile = async () => {
    if (!token) {
      setError('No token provided');
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}` // Send token in request header
        }
      });

      // Ensure the profilePic is part of the formData, fallback to default if missing
      setFormData({
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        profilePic: res.data.profilePic || '/uploads/profile_pics/default-profile.png' // Fallback to default picture
      });
    } catch (err) {
      setError('Failed to load profile');
    }
  };

  useEffect(() => {
    fetchProfile(); // Fetch profile every time the component mounts
  }, [token]);

  // Handle file input change for profile picture upload
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Capture the selected file
  };

  // Upload profile picture
  const handleProfilePicUpload = async () => {
    if (!selectedFile) {
      setError('Please select a profile picture to upload');
      return;
    }

    const formDataPic = new FormData();
    formDataPic.append('profilePic', selectedFile); // Append the selected file to form data

    try {
      const res = await axios.put(
        'http://localhost:5000/api/users/upload-profile-pic',
        formDataPic,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setSuccess(res.data.msg);

      // Force image reload to prevent caching
      setForceUpdate(Date.now());

      // Update the profile picture in the state immediately
      setFormData((prevState) => ({
        ...prevState,
        profilePic: res.data.profilePic // Update with the new profile picture path
      }));

    } catch (err) {
      setError('Failed to upload profile picture');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error
    setSuccess(''); // Reset success

    try {
      const res = await axios.put(
        'http://localhost:5000/api/users/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}` // Send token in request header
          }
        }
      );
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const { name, email, role, profilePic } = formData;

  return (
    <div>
      <h1>Your Profile</h1>

      {/* Display the profile picture if it exists, or show a default */}
      <div>
        <img
          src={`http://localhost:5000${profilePic}?t=${forceUpdate}`} // Force reload by appending a timestamp to prevent caching
          alt='Profile'
          style={{ width: '150px', height: '150px', borderRadius: '50%' }} // Circular profile image
        />
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='name'
          value={name}
          onChange={handleChange}
          placeholder='Name'
          required
        />
        <input
          type='email'
          name='email'
          onChange={handleChange}
          value={email}
          placeholder='Email'
          required
        />
        <input
          type='text'
          name='role'
          value={role}
          placeholder='Role'
          readOnly
        />

        {/* Profile picture upload */}
        <div>
          <label>Upload Profile Picture:</label>
          <input type='file' onChange={handleFileChange} />
          <button type='button' onClick={handleProfilePicUpload}>
            Save Profile Picture
          </button>
        </div>

        <button type='submit'>Update Profile</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default Profile;
