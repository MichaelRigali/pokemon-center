import React, { useEffect } from 'react';
import '../retro-style.css';

const Home = () => {
  useEffect(() => {
    // Create a <link> element to load the Google font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    link.rel = 'stylesheet';

    // Append the link to the document head
    document.head.appendChild(link);

    // Cleanup the link when the component unmounts
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className='content'>
      <h1>Welcome to Pok&eacute;Mart!</h1>
      <p>Buy and sell your favorite Pokémon cards here!</p>
    </div>
  );
};

export default Home;
