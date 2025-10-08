const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["Sport", "Cultural"],
        required: true
    },
    subCategory: {  // 🆕 Added subCategory field
        type: String,
        default: null
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
