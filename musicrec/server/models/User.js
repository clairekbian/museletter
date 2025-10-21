const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
  country: { type: String, default: "" },
});

module.exports = mongoose.model("User", UserSchema);
