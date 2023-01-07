const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "invalid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  name: { type: String, maxlength: 100 },
  lastname: { type: String, maxlength: 100 },
  token: {
    type: String,
  },
});

schema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    next();
  }

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;

  next();
});

schema.methods.generateToken = async function () {
  const token = await jwt.sign(
    { email: this.email, _id: this._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
  this.token = token;
  return this.save();
};

schema.methods.comparePassword = async function (password) {
  const correctPassword = await bcrypt.compare(password, this.password);
  return correctPassword;
};

const User = mongoose.model("User", schema);

module.exports = User;
