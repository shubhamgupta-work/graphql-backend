const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 100 },
    excerpt: { type: String, required: true, maxlength: 1000 },
    content: {
      type: String,
      required: true,
      maxlength: 10000,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Public"],
      default: "Draft",
    },
    category: { type: mongoose.Schema.ObjectId, ref: "Category" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Post = mongoose.model("Post", schema);

module.exports = Post;
