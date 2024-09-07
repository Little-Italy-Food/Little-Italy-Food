const mongoose = require("mongoose");
const { Schema } = mongoose;

const replySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    desc: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    img: {
      type: String,
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
    userMentions: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "Users",
        },
      },
    ],
    sentTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    chefMentions: [
      {
        chefId: {
          type: Schema.Types.ObjectId,
          ref: "Chefs",
        },
      },
    ],
    replies: [replySchema],
    sharedFrom: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema, "posts");
