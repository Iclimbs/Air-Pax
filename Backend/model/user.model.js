const mongoose = require("mongoose");
const userschema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age:{
    type:String
  },
  gender:{
    type:String
  },
  address:{
    type:String
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
  forgotpasswordtoken: {
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
  picture: {
    type: String
  },
  type: {
    admin: {
      type: Boolean,
      default: false
    },
    user: {
      type: Boolean,
      default: true

    }
  },
  CreatedAt: { type: Date, default: Date.now },
});
const UserModel = mongoose.model("Users", userschema);
module.exports = { UserModel };