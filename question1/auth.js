const axios = require('axios');
require('dotenv').config();

const auth = async (req, res) => {
    const { email, name, rollNo } = req.body;

    try {
        const response = await axios.post('http://20.244.56.144/evaluation-service/auth', {
            email,
            name,
            rollNo,
            accessCode: process.env.ACCESS_CODE,
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Authorization failed', error: error.message });
    }
};

module.exports = auth;
