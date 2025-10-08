const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const POST = mongoose.model('POST');

// Filter posts by category
router.get('/posts/category/:category/:subCategory?', (req, res) => {
    const { category, subCategory } = req.params;

    let query = { category: category };

    // If the subCategory is present, add it to the query
    if (subCategory) {
        query.subCategory = subCategory;
    }

    POST.find(query)
        .populate('postedBy', '_id name photo')
        .populate('comments.postedBy', '_id name')
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            console.error(err);
            return res.status(422).json({ error: 'Unable to fetch posts.' });
        });
});

module.exports = router;
