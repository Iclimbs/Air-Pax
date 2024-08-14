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
  password: {
    type: String
  },
  otp: {
    type: Number
  },
  signuptoken: {
    type: String
  },
  verified: {
    email: {
      type: Boolean,
      default: false
    },
    phone: {
      type: Boolean,
      default: false
    }
  },
  CreatedAt: { type: Date, default: Date.now },
});
const UserModel = mongoose.model("Users", userschema);
module.exports = { UserModel };