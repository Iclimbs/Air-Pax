const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubuserSchema = new Schema({
    Fname: { type: String }, Lname: { type: String }, Age: { type: Number }, Gender: { type: String }, Phoneno: { type: Number }, Email: { type: String }, Country: { type: String }, SeatNo: { type: String }, status: { type: String, default: "Pending" }})

const otheruserschema = mongoose.Schema({
  primaryuser: {
    name: {
      type: String,
    },
    email: {
      type: String,
      default: true
    },
    phoneno: {
      type: Number,
    }
  },
  passengerdetails: [SubuserSchema],
  tripId: String,
  bookingRefId: String,
  amount: Number,
  pnr: String,
  CreatedAt: { type: Date, default: Date.now },
});
const OtherUserModel = mongoose.model("GMR", otheruserschema);
module.exports = { OtherUserModel };