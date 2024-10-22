import React, { useState } from 'react';

const Forum = () => {
  const [posts, setPosts] = useState([
    { id: 1, title: 'Favorite Pokémon Cards?', content: 'Let’s discuss your favorite Pokémon cards!' },
    { id: 2, title: 'Best Cards for Trading?', content: 'What are the best cards to trade in 2024?' }
  ]);

  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPost.title && newPost.content) {
      setPosts((prevPosts) => [...prevPosts, { id: posts.length + 1, ...newPost }]);
      setNewPost({ title: '', content: '' });
    }
  };

  return (
    <div className="content">
      <h1>Pokémon Card Forum</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={newPost.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            name="content"
            value={newPost.content}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Post</button>
      </form>

      <div className="forum-posts">
        {posts.map((post) => (
          <div key={post.id} className="forum-post">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;
