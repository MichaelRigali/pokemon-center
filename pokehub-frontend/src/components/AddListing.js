// src/components/AddListing.js
import React, { useState } from 'react';
import axios from 'axios';

const AddListing = () => {
  const [formData, setFormData] = useState({
    cardName: '',
    cardSet: '',
    price: '',
    condition: '',
    imageUrl: ''
  });

  const { cardName, cardSet, price, condition, imageUrl } = formData;

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Get the token from localStorage

    // Send data to backend with Authorization header
    axios.post('/api/listings', formData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log('Listing added:', response.data);
        setFormData({
          cardName: '',
          cardSet: '',
          price: '',
          condition: '',
          imageUrl: ''
        });
      })
      .catch(error => {
        console.error('Error adding listing:', error);
      });
  };

  return (
    <div>
      <h1>Add a New Listing</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="cardName" value={cardName} onChange={handleChange} placeholder="Card Name" required />
        <input type="text" name="cardSet" value={cardSet} onChange={handleChange} placeholder="Card Set" required />
        <input type="number" name="price" value={price} onChange={handleChange} placeholder="Price" required />
        <input type="text" name="condition" value={condition} onChange={handleChange} placeholder="Condition" required />
        <input type="text" name="imageUrl" value={imageUrl} onChange={handleChange} placeholder="Image URL" required />
        <button type="submit">Add Listing</button>
      </form>
    </div>
  );
};

export default AddListing;
