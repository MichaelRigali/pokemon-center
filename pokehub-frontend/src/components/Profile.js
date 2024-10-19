import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../retro-style.css'; // Import the retro styles

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
  const [fileName, setFileName] = useState(''); // Initialize fileName state
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
    const file = e.target.files[0];
    setSelectedFile(file);
    setFileName(file ? file.name : ''); // Display selected file name
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
    <div className='content'>
      <h1>Trainer Profile</h1>

      {/* Display the profile picture */}
      <div className='profile-pic-container'>
        <img
          src={`http://localhost:5000${profilePic}?t=${forceUpdate}`} // Force reload by appending a timestamp
          alt='Profile'
          className='profile-pic' // Use class for styling
        />
      </div>

      <form onSubmit={handleSubmit} className='profile-form'>
        <input
          type='text'
          name='name'
          value={name}
          onChange={handleChange}
          placeholder='Name'
          required
          className='profile-input' // Add class for consistent input styling
        />
        <input
          type='email'
          name='email'
          onChange={handleChange}
          value={email}
          placeholder='Email'
          required
          className='profile-input'
        />
        <input
          type='text'
          name='role'
          value={role}
          placeholder='Role'
          readOnly
          className='profile-input'
        />

        {/* Profile picture upload */}
        <div className='profile-upload-container'>
          <label htmlFor="file-upload" className='file-upload-label'>
            Choose Profile Picture
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className='file-input'
          />
          <span className='file-name'>{fileName || 'No file chosen'}</span> {/* Display the selected file name */}
          <button type='button' onClick={handleProfilePicUpload} className='profile-button'>
            Save Profile Picture
          </button>
        </div>

        <button type='submit' className='profile-button'>
          Update Profile
        </button>
      </form>

      {error && <p className='error-message'>{error}</p>}
      {success && <p className='success-message'>{success}</p>}
    </div>
  );
};

export default Profile;
