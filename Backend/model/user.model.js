const mongoose = require("mongoose");
const userschema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phoneno: {
    type: Number,
  },
  CreatedAt: { type: Date, default: Date.now },
});
const UserModel = mongoose.model("Users", userschema);
module.exports = { UserModel };