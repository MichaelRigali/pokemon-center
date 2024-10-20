import React, { useState } from 'react';
import axios from 'axios';

const AddListing = ({ token }) => {
  const [formData, setFormData] = useState({
    name: '',
    series: '',
    edition: '',
    holographic: '',
    grade: '',
    price: '',
  });
  const [selectedFile, setSelectedFile] = useState(null); // To handle image file
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle file input change for image upload
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // Capture the selected image file
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure an image is selected
    if (!selectedFile) {
      setError('Please select an image file.');
      return;
    }

    // Create FormData object to send both image and text data
    const formDataToSend = new FormData();
    formDataToSend.append('image', selectedFile); // Append image file
    formDataToSend.append('name', formData.name); // Append name
    formDataToSend.append('series', formData.series); // Append series
    formDataToSend.append('edition', formData.edition); // Append edition
    formDataToSend.append('holographic', formData.holographic); // Append holographic status
    formDataToSend.append('grade', formData.grade); // Append grade
    formDataToSend.append('price', formData.price); // Append price

    try {
      const res = await axios.post('http://localhost:5000/api/listings', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Listing created successfully!');
      setError(''); // Clear error if any

      // Optionally, clear form and file input after success
      setFormData({
        name: '',
        series: '',
        edition: '',
        holographic: '',
        grade: '',
        price: '',
      });
      setSelectedFile(null);
    } catch (err) {
      console.error('Error creating listing:', err);
      setError('Failed to create listing');
    }
  };

  return (
    <div className='content'>
      <h1>Add a New Listing</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Series:</label>
          <select name="series" value={formData.series} onChange={handleChange} required>
            <option value="">Select Series</option>
            <option value="Base Set Series">Base Set Series</option>
            <option value="Gym Heroes Series">Gym Heroes Series</option>
            {/* Add other series options here */}
          </select>
        </div>
        <div>
          <label>Edition:</label>
          <div>
            <label>
              <input
                type="radio"
                name="edition"
                value="First Edition"
                checked={formData.edition === 'First Edition'}
                onChange={handleChange}
                required
              />
              First Edition
            </label>
            <label>
              <input
                type="radio"
                name="edition"
                value="Non-First Edition"
                checked={formData.edition === 'Non-First Edition'}
                onChange={handleChange}
                required
              />
              Non-First Edition
            </label>
          </div>
        </div>
        <div>
          <label>Holographic:</label>
          <div>
            <label>
              <input
                type="radio"
                name="holographic"
                value="Holographic"
                checked={formData.holographic === 'Holographic'}
                onChange={handleChange}
                required
              />
              Holographic
            </label>
            <label>
              <input
                type="radio"
                name="holographic"
                value="Non-Holographic"
                checked={formData.holographic === 'Non-Holographic'}
                onChange={handleChange}
                required
              />
              Non-Holographic
            </label>
          </div>
        </div>
        <div>
          <label>Grade:</label>
          <select name="grade" value={formData.grade} onChange={handleChange} required>
            <option value="">Select Grade</option>
            <option value="10">10</option>
            <option value="9">9</option>
            <option value="8">8</option>
            {/* Add other grade options here */}
          </select>
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Upload Image:</label>
          <input type="file" onChange={handleFileChange} accept="image/*" required />
          {selectedFile && <p>Selected file: {selectedFile.name}</p>} {/* Display selected file name */}
        </div>
        <button type="submit">Add Listing</button>
      </form>
    </div>
  );
};

export default AddListing;
