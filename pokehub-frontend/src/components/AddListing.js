import React, { useState } from 'react';
import axios from 'axios';

const AddListing = ({ token }) => {
  const [formData, setFormData] = useState({
    name: '',
    series: '',
    setNumber: '',
    edition: '',
    holographic: '',
    grade: '',
    price: '',
    openToTrade: 'no',
    tradeDetails: ''
  });
  const [selectedFile, setSelectedFile] = useState(null); // Primary image
  const [secondaryFiles, setSecondaryFiles] = useState([]); // Secondary images
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle primary image change
  const handlePrimaryFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle secondary images change
  const handleSecondaryFilesChange = (e) => {
    setSecondaryFiles([...e.target.files]);
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Ensure primary image is selected
  if (!selectedFile) {
    setError('Please select a primary image file.');
    return;
  }

  // Create FormData for multipart/form-data submission
  const formDataToSend = new FormData();
  formDataToSend.append('primaryImage', selectedFile); // Primary image
  formDataToSend.append('name', formData.name);
  formDataToSend.append('series', formData.series);
  formDataToSend.append('setNumber', formData.setNumber);
  formDataToSend.append('edition', formData.edition);
  formDataToSend.append('holographic', formData.holographic);
  formDataToSend.append('grade', formData.grade);
  formDataToSend.append('price', formData.price);

  // Append secondary images if any
  secondaryFiles.forEach((file, index) => {
    formDataToSend.append(`secondaryImage_${index + 1}`, file);
  });

  // Append trade details if applicable
  formDataToSend.append('openToTrade', formData.openToTrade);
  if (formData.openToTrade === 'yes') {
    formDataToSend.append('tradeDetails', formData.tradeDetails);
  }

  try {
    console.log("Sending form data to the server", formDataToSend); // Log form data before sending

    const response = await axios.post('http://localhost:5000/api/listings', formDataToSend, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("Response from server:", response); // Log the server response

    setSuccess('Listing created successfully!');
    setError('');

    // Reset the form after successful submission
    setFormData({
      name: '',
      series: '',
      setNumber: '',
      edition: '',
      holographic: '',
      grade: '',
      price: '',
      openToTrade: 'no',
      tradeDetails: ''
    });
    setSelectedFile(null);
    setSecondaryFiles([]);
  } catch (err) {
    console.error('Error creating listing:', err); // Log the error if the request fails
    setError('Failed to create listing');
  }
};


  return (
    <div className='content'>
      <h1>Add a New Listing</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        {/* Name Input */}
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

        {/* Series Dropdown */}
        <div>
          <label>Series:</label>
          <select
            name="series"
            value={formData.series}
            onChange={handleChange}
            required
          >
            <option value="">Select Series</option>
            <option value="Base Set Series">Base Set Series</option>
            <option value="Gym Heroes Series">Gym Heroes Series</option>
            <option value="Topps Chrome Series">Topps Chrome Series</option>
            <option value="Neo Genesis Series">Neo Genesis Series</option>
            <option value="Legendary Collection Series">Legendary Collection Series</option>
            <option value="e-Card Series">e-Card Series</option>
            <option value="EX Ruby & Sapphire Series">EX Ruby & Sapphire Series</option>
            <option value="Diamond & Pearl Series">Diamond & Pearl Series</option>
            <option value="Nintendo Promos Series">Nintendo Promos Series</option>
            <option value="Platinum Series">Platinum Series</option>
            <option value="HeartGold SoulSilver Series">HeartGold SoulSilver Series</option>
            <option value="Call of Legends Series">Call of Legends Series</option>
            <option value="Black & White Promos Series">Black & White Promos Series</option>
            <option value="Black & White Series">Black & White Series</option>
            <option value="XY Series">XY Series</option>
            <option value="Sun & Moon Series">Sun & Moon Series</option>
            <option value="Sword & Shield Series">Sword & Shield Series</option>
            <option value="Scarlet & Violet Series">Scarlet & Violet Series</option>
          </select>
        </div>

        {/* Set Number */}
        <div>
          <label>Set Number (XXX/XXX):</label>
          <input
            type="text"
            name="setNumber"
            value={formData.setNumber}
            onChange={handleChange}
            required
          />
        </div>

        {/* Edition Radio Buttons */}
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

        {/* Holographic Radio Buttons */}
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

        {/* Grade Dropdown */}
        <div>
          <label>Grade:</label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            required
          >
            <option value="">Select Grade</option>
            <option value="10">10</option>
            <option value="9">9</option>
            <option value="8">8</option>
            <option value="7">7</option>
            <option value="6">6</option>
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="3">3</option>
            <option value="Unplayed">Unplayed</option>
            <option value="Lightly Played">Lightly Played</option>
            <option value="Moderately Played">Moderately Played</option>
            <option value="Heavily Played">Heavily Played</option>
          </select>
        </div>

        {/* Price Input */}
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

        {/* Primary Image Upload */}
        <div>
          <label>Primary Image:</label>
          <input
            type="file"
            onChange={handlePrimaryFileChange}
            accept="image/*"
            required
          />
        </div>

        {/* Secondary Images Upload */}
        <div>
          <label>Secondary Images (optional):</label>
          <input
            type="file"
            onChange={handleSecondaryFilesChange}
            accept="image/*"
            multiple
          />
        </div>

        {/* Open to Trade Radio Buttons */}
        <div>
          <label>Open to Trade:</label>
          <div>
            <label>
              <input
                type="radio"
                name="openToTrade"
                value="yes"
                checked={formData.openToTrade === 'yes'}
                onChange={handleChange}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="openToTrade"
                value="no"
                checked={formData.openToTrade === 'no'}
                onChange={handleChange}
              />
              No
            </label>
          </div>
        </div>

        {/* Trade Details Textarea */}
        {formData.openToTrade === 'yes' && (
          <div>
            <label>Trade Details (if applicable):</label>
            <textarea
              name="tradeDetails"
              value={formData.tradeDetails}
              onChange={handleChange}
              placeholder="Describe the card(s) you're willing to trade for"
            />
          </div>
        )}

        {/* Submit Button */}
        <button type="submit">Add Listing</button>
      </form>
    </div>
  );
};

export default AddListing;
