const express = require('express');
const axios = require('axios');
const app = express();
const port = 9876;

const MAX_WINDOW_SIZE = 10;
let numbers = [];

// Helper function to fetch numbers from the Test Server API
const fetchNumbers = async (type) => {
    let url = '';
    if (type === 'p') url = 'http://20.244.56.144/evaluation-service/primes';
    else if (type === 'f') url = 'http://20.244.56.144/evaluation-service/fibo';
    else if (type === 'e') url = 'http://20.244.56.144/evaluation-service/even';
    else if (type === 'r') url = 'http://20.244.56.144/evaluation-service/rand';
    
    try {
        const response = await axios.get(url, { timeout: 500 });
        return response.data.numbers;
    } catch (error) {
        throw new Error('Failed to fetch numbers from the test server');
    }
};

// Helper function to calculate average
const calculateAverage = (numArray) => {
    const sum = numArray.reduce((acc, curr) => acc + curr, 0);
    return (sum / numArray.length).toFixed(2);
};

// Main route to handle number requests
app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;

    if (!['p', 'f', 'e', 'r'].includes(numberid)) {
        return res.status(400).json({ message: 'Invalid number ID. Use p, f, e, or r.' });
    }

    try {
        // Fetch the new numbers
        const fetchedNumbers = await fetchNumbers(numberid);

        // Merge with existing numbers and maintain uniqueness
        numbers = [...new Set([...numbers, ...fetchedNumbers])];

        // If there are more than 10 numbers, pop the oldest one
        if (numbers.length > MAX_WINDOW_SIZE) {
            numbers = numbers.slice(-MAX_WINDOW_SIZE);
        }

        // Calculate the average
        const avg = calculateAverage(numbers);

        // Prepare response
        res.json({
            windowPrevState: numbers.slice(0, -fetchedNumbers.length), // Previous state before the latest fetch
            windowCurrState: numbers, // Current window with new numbers
            numbers: fetchedNumbers,  // Numbers fetched from the third-party API
            avg: avg // Average of the current window
        });
    } catch (error) {
        res.status(500).json({ message: 'Error in number calculation', error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
