const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Default route to serve index.html from the root directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API route to handle requests from the frontend
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a fortune cookie that gives short, wise, and cryptic fortunes.' },
                { role: 'user', content: `You are a wise fortune cookie. Respond with short, cryptic, yet thoughtful fortunes. The user has asked: "${userMessage}"` }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('API Response:', JSON.stringify(response.data, null, 2)); // Log the API response

        res.json(response.data); // Send the response back to the client
    } catch (error) {
        // Log detailed error message
        if (error.response) {
            console.error('Error response from OpenAI:', error.response.data);
            res.status(500).json({ error: `Error response from OpenAI: ${JSON.stringify(error.response.data)}` });
        } else {
            console.error('Error connecting to OpenAI:', error.message);
            res.status(500).json({ error: `Error connecting to OpenAI: ${error.message}` });
        }
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));