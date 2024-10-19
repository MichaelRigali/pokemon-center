import React, { useState } from 'react';
import axios from 'axios';

const AddListing = ({ token }) => {
  const [formData, setFormData] = useState({
    cardName: '',
    cardSet: '',
    price: '',
    condition: '',
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
    formDataToSend.append('cardName', formData.cardName);
    formDataToSend.append('cardSet', formData.cardSet);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('condition', formData.condition);

    try {
      const res = await axios.post('http://localhost:5000/api/listings', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Listing created successfully!');
      setError(''); // Clear error if any
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
          <label>Card Name:</label>
          <input
            type="text"
            name="cardName"
            value={formData.cardName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Card Set:</label>
          <input
            type="text"
            name="cardSet"
            value={formData.cardSet}
            onChange={handleChange}
            required
          />
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
          <label>Condition:</label>
          <select name="condition" value={formData.condition} onChange={handleChange} required>
            <option value="mint">Mint</option>
            <option value="near-mint">Near Mint</option>
            <option value="lightly played">Lightly Played</option>
            <option value="moderately played">Moderately Played</option>
            <option value="heavily played">Heavily Played</option>
          </select>
        </div>
        <div>
          <label>Upload Image:</label>
          <input type="file" onChange={handleFileChange} accept="image/*" required />
        </div>
        <button type="submit">Add Listing</button>
      </form>
    </div>
  );
};

export default AddListing;
