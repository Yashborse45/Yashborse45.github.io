const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true // Corrected from 'require' to 'required'
    },
    category: { // New category field
        type: String,
        enum: ["Sport", "Cultural"], // Enum to limit values
        required: true // Optional: You can make it required or not based on your requirement
    },
    likes: [{ type: ObjectId, ref: "USER" }],
    comments: [{
        comment: { type: String },
        postedBy: { type: ObjectId, ref: "USER" }
    }],
    postedBy: {
        type: ObjectId,
        ref: "USER"
    }
}, { timestamps: true });

mongoose.model("POST", postSchema);
