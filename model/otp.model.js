const mongoose = require("mongoose");
const OtpSchema = mongoose.Schema({
    pnr: String,
    tripId: String,
    seatNumbers: Array,
    otp:Number,
    expireAt: {
        type: Date,
        default: null, // This will be populated only if `shouldExpire` is true
        index: { expires: '0' } // TTL index based on this field; expires if not null
    },
    CreatedAt: { type: Date, default: Date.now },
});
const OtpModel = mongoose.model("Otp", OtpSchema)
module.exports = { OtpModel };