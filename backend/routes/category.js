const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const POST = mongoose.model('POST');

// Filter posts by category
router.get('/posts/category/:category', (req, res) => {
    POST.find({ category: req.params.category })
        .populate('postedBy', '_id name photo')  // Populate the 'postedBy' fields (_id, name, photo from USER)
        .populate('comments.postedBy', '_id name')  // Populate 'postedBy' within comments (if needed)
        .then(posts => {
            res.status(200).json(posts);  // Send filtered posts as JSON response
        })
        .catch(err => {
            console.error(err);  // Log the error for debugging
            return res.status(422).json({ error: 'Unable to fetch posts by category.' });
        });
});

module.exports = router;
