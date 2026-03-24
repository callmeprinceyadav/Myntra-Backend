const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      maxLength: 30,
      minLength: 4,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    pass: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    shipping: {
      type: String,
      default: "",
    },
  },
  {
    versionKey: false,
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = {UserModel};