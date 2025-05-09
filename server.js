const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Example endpoint
app.get('/', (req, res) => {
  res.send('Hello, Backend!');
});

// Sample REST API endpoint
app.get('/api/posts', (req, res) => {
  const posts = [
    { id: 1, title: 'First Post', body: 'This is the body of the first post' },
    { id: 2, title: 'Second Post', body: 'This is the body of the second post' },
  ];
  res.json(posts);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
