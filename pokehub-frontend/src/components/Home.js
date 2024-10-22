import React, { useEffect } from 'react';
import '../retro-style.css'; // Keep your global styles

const Home = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    link.rel = 'stylesheet';

    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Pok&eacute;Mart!</h1>
      </div>
    </div>
  );
};

export default Home;
