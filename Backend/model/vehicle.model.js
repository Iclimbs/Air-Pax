const mongoose = require("mongoose");
const vehicleschema = mongoose.Schema({
    name: {
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
    active: {
        type: Boolean,
        default: false
    },
    seat: {
        type: Object,
        required: true
    },
    CreatedAt: { type: Date, default: Date.now },
});
const VehicleModel = mongoose.model("Bus", vehicleschema);
module.exports = { VehicleModel };