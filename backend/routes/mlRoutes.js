const express = require('express');
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' }); // Temp folder to store uploaded images

// Route: POST /api/ml/predict
router.post('/predict', upload.single('image'), async (req, res) => {
    try {
        const formData = new FormData();
        formData.append('image', fs.createReadStream(req.file.path));

        const response = await axios.post('http://localhost:5001/predict', formData, {
            headers: formData.getHeaders(),
        });

        // Optional: delete temp file after upload
        fs.unlinkSync(req.file.path);

        res.json(response.data);
    } catch (err) {
        console.error('Prediction error:', err.message);
        res.status(500).json({ error: 'Flask prediction failed' });
    }
});

module.exports = router;
