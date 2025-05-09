const express = require('express');
const axios = require('axios');
const app = express();
const port = 9876;

let windowSize = 10; // Size of the window
let storedNumbers = [];

app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;

    // Fetching numbers from the appropriate API based on the numberid
    let url = '';
    if (numberid === 'p') {
        url = 'http://20.244.56.144/evaluation-service/primes';
    } else if (numberid === 'f') {
        url = 'http://20.244.56.144/evaluation-service/fibo';
    } else if (numberid === 'e') {
        url = 'http://20.244.56.144/evaluation-service/even';
    } else if (numberid === 'r') {
        url = 'http://20.244.56.144/evaluation-service/rand';
    } else {
        return res.status(400).send({ error: 'Invalid number ID' });
    }

    try {
        const response = await axios.get(url, { timeout: 500 });

        // Extracting numbers from the response
        const numbers = response.data.numbers;
        
        // Add the new numbers to the stored list (avoiding duplicates)
        numbers.forEach(num => {
            if (!storedNumbers.includes(num)) {
                storedNumbers.push(num);
            }
        });

        // Ensure the window size is respected (limit the numbers to the window size)
        if (storedNumbers.length > windowSize) {
            storedNumbers = storedNumbers.slice(-windowSize);
        }

        // Calculating the average of the numbers in the window
        const avg = storedNumbers.reduce((acc, curr) => acc + curr, 0) / storedNumbers.length;

        // Sending the response
        res.status(200).send({
            windowPrevState: storedNumbers.slice(0, -numbers.length), // Numbers before the latest request
            windowCurrState: storedNumbers,
            numbers,
            avg: avg.toFixed(2)
        });
    } catch (error) {
        return res.status(500).send({ error: 'Error fetching numbers from server or processing request.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
