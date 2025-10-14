const express = require('express');
const router = express.Router();
const axios = require('axios');

// Route: POST /api/ml/predict
router.post('/predict', async (req, res) => {
    try {
        const { imageUrl } = req.body; // Extract imageUrl from the request body

        if (!imageUrl) {
            return res.status(400).json({ error: 'No imageUrl provided' });
        }

        // Send the image URL to the Flask server for prediction
        const response = await axios.post('http://localhost:5001/predict', {
            imageUrl: imageUrl, // Send image URL to Flask
        });

        res.json(response.data); // Return the Flask prediction response

    } catch (err) {
        console.error('Prediction error:', err.message);
        res.status(500).json({ error: 'ML model prediction failed' });
    }
});

module.exports = router;
