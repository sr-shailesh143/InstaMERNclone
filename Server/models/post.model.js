const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

// Define the Post schema
const PostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true, 
    },
    likedBy: [
        { type: ObjectId, ref: "User" } 
    ],
    feedback: [
        {
            text: { type: String }, 
            author: { type: ObjectId, ref: "User" }, 
        }
    ],
    createdBy: {
        type: ObjectId,
        ref: "User",
        required: true, 
    },
}, { timestamps: true });

const PostModel = mongoose.model("PostModel", PostSchema);
module.exports = PostModel;