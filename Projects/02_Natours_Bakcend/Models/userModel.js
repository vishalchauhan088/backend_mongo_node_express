const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      validate: [validator.isEmail, "Please provide valid email id"],
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: ["true", "Password is required"],
      minLength: [8, "Password must be of length 8"],
    },
    passwordConfirm: {
      type: String,
      required: [true, "please provide confirm password"],
    },
    //explicitly defining timestamps to use select property
    createdAt: {
      type: Date,
      select: false,
    },

    updatedAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
