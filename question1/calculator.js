const axios = require('axios');
const MAX_WINDOW_SIZE = 10;
let numbers = [];

const fetchNumbers = async (type) => {
    let url = '';
    if (type === 'p') url = 'http://20.244.56.144/evaluation-service/primes';
    if (type === 'f') url = 'http://20.244.56.144/evaluation-service/fibo';
    if (type === 'e') url = 'http://20.244.56.144/evaluation-service/even';
    if (type === 'r') url = 'http://20.244.56.144/evaluation-service/rand';

    try {
        const response = await axios.get(url);
        return response.data.numbers;
    } catch (error) {
        throw new Error('Failed to fetch numbers from the test server');
    }
};

const calculateAverage = (numArray) => {
    const sum = numArray.reduce((acc, curr) => acc + curr, 0);
    return (sum / numArray.length).toFixed(2);
};

const numbersCalculator = async (req, res) => {
    const { numberid } = req.params;

    try {
        const fetchedNumbers = await fetchNumbers(numberid);

        // Merge with existing numbers and maintain uniqueness
        numbers = [...new Set([...numbers, ...fetchedNumbers])];

        // If there are more than 10 numbers, pop the oldest one
        if (numbers.length > MAX_WINDOW_SIZE) {
            numbers = numbers.slice(-MAX_WINDOW_SIZE);
        }

        const avg = calculateAverage(numbers);

        res.json({
            windowPrevState: numbers.slice(0, -1),
            windowCurrState: numbers,
            numbers: fetchedNumbers,
            avg: avg
        });
    } catch (error) {
        res.status(500).json({ message: 'Error in number calculation', error: error.message });
    }
};

module.exports = numbersCalculator;
