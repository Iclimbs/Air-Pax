const mongoose = require("mongoose");
const seatSchema = mongoose.Schema({
    seatNumber: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    lockExpires: Date,
    tripId: {
        type: String,
        required: true
    },
    bookedby: {
        type: String,
        required: true
    },
    details: {
        fname: String,
        lname: String,
        age: Number,
        gender: String
    },
    pnr: String,
    CreatedAt: { type: Date, default: Date.now },
});
const SeatModel = mongoose.model("Seats", seatSchema)
module.exports = { SeatModel };