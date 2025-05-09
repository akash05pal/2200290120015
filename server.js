const express = require('express');
const app = express();
const port = 5000;

// Sample route for root
app.get('/', (req, res) => {
  res.send('Welcome to the Backend!');
});

// API Route for posts
app.get('/api/posts', (req, res) => {
  const posts = [
    { id: 1, title: 'First Post', body: 'This is the body of the first post.' },
    { id: 2, title: 'Second Post', body: 'This is the body of the second post.' },
    { id: 3, title: 'Third Post', body: 'This is the body of the third post.' }
  ];
  res.json(posts); // Sending JSON response
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
