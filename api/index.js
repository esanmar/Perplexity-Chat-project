const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

app.post('/ask', async (req, res) => {
    const { question } = req.body;
    console.log(req.body)
    if (!question) {
        return res.status(400).json({ error: 'Please provide a question' });
    }

    try {
        const perplexityResponse = await axios.post('https://api.perplexity.ai/chat/completions', {
            model: "mistral-7b-instruct",
            messages: [
                {
                    role: "system",
                    content: "Be precise and concise."
                },
                {
                    role: "user",
                    content: question
                }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Send the response back to the frontend
        res.json({ answer: perplexityResponse.data.choices[0].message.content });
        console.log(perplexityResponse.data.choices[0].message.content);

    } catch (error) {
        // Enhanced error handling
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data });
        } else if (error.request) {
            console.error('No response received:', error.request);
            res.status(500).json({ error: 'No response from Perplexity API' });
        } else {
            console.error('Error setting up the request:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API server listening on port ${port}`));


