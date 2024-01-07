const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "/assets/profiles/user.png",
    },
    userCoins: {
      type: Number,
      default: 0,
    },

    otp: {
      type: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    expireTime: {
      type: String,
      default: "",
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
