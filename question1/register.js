const axios = require('axios');
require('dotenv').config();

const register = async (req, res) => {
    const { email, name, mobileNo, githubUsername, rollNo, collegeName } = req.body;

    try {
        const response = await axios.post('http://20.244.56.144/evaluation-service/register', {
            email,
            name,
            mobileNo,
            githubUsername,
            rollNo,
            collegeName,
            accessCode: process.env.ACCESS_CODE
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

module.exports = register;
