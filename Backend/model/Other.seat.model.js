const mongoose = require("mongoose");
const otheruserschema = mongoose.Schema({
  primaryuser: {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneno: {
      type: Number,
    }
  },
  passengerdetails: Array,
  tripId: String,
  bookingRefId: String,
  amount:Number,
  pnr:String,
  CreatedAt: { type: Date, default: Date.now },
});
const OtherUserModel = mongoose.model("GMR", otheruserschema);
module.exports = { OtherUserModel };