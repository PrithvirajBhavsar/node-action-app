const express = require('express');
const app = express();
const PORT = 3000;

// Define a basic route for the root URL
app.get('/', (req, res) => {
    res.send('Hello World from Express! Prithviraj Bhavsar, mjaa aara h');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});