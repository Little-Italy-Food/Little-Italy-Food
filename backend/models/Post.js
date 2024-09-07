// models/Post.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    img: {
      type: String, // Store image URL or file path
    },
    desc: {
      type: String,
      required: true,
    },
    video: String,

    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    liked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema, "posts");
