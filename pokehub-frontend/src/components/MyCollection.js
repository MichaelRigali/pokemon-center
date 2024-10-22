import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyCollection = ({ token }) => {
  const [collection, setCollection] = useState([]);
  const [error, setError] = useState('');

  // Fetch user's card collection
  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/collection', {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure token is passed
          },
        });
        setCollection(res.data);
      } catch (err) {
        setError('Failed to load collection');
      }
    };

    if (token) {
      fetchCollection(); // Fetch collection if token exists
    }
  }, [token]);

  return (
    <div className="content">
      <h1>My Pokémon Card Collection</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {collection.length === 0 ? (
        <p>Your collection is empty.</p>
      ) : (
        <ul className="collection-list">
          {collection.map((card) => (
            <li key={card._id} className="collection-item">
              <img src={`http://localhost:5000${card.imageUrl}`} alt={card.name} style={{ width: '100px' }} />
              <h3>{card.name}</h3>
              <p>Series: {card.series}</p>
              <p>Edition: {card.edition}</p>
              <p>Holographic: {card.holographic ? 'Yes' : 'No'}</p>
              <p>Grade: {card.grade}</p>
              <p>Price: ${card.price}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyCollection;
