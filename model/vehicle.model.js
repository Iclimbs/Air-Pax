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
        type: Array,
        required: true
    },
    assigned: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    active: {
        type: Boolean,
        default: true
    },
    seats: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    CreatedAt: { type: Date, default: Date.now },
});
const VehicleModel = mongoose.model("Vehicles", vehicleschema);
module.exports = { VehicleModel };