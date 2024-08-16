const mongoose = require("mongoose");
const busschema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    no: {
        type: String,
        required: true,
    },
    registrationno: {
        type: String,
        required: true
    },
    facilities: {
        type: String
    },
    seat: {
        type: Object,
        required: true
    },
    CreatedAt: { type: Date, default: Date.now },
});
const BusModel = mongoose.model("Bus", busschema);
module.exports = { BusModel };