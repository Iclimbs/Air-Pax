const mongoose = require("mongoose");
const busschema = mongoose.Schema({
    busname: {
        type: String,
        required: true,
    },
    busno: {
        type: String,
        required: true,
    },
    registrationno: {
        type: String,
        required: true
    },
    facilities: {
        type: Array
    },
    seat: {
        type: Object,
        required: true
    },
    CreatedAt: { type: Date, default: Date.now },
});
const BusModel = mongoose.model("Bus", busschema);
module.exports = { BusModel };