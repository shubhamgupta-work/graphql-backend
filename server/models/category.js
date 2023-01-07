const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    maxlength: 250,
  },
  author: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
});

const Category = mongoose.model("Category", schema);
module.exports = Category;
