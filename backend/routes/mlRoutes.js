const express = require("express");
const axios = require("axios");
const multer = require("multer");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Upload in memory

router.post("/predict", upload.single("image"), async (req, res) => {
    try {
        const imageBuffer = req.file.buffer;

        const response = await axios.post(
            "http://localhost:5001/predict",
            { image: imageBuffer },
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
