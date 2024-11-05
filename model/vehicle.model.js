const mongoose = require("mongoose");
const vehicleschema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    busimeino: {
        type: String,
        required: true,
    },
    simno: {
        type: String,
        required: true
    },
    facilities: {
        type: Array,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    CreatedAt: { type: Date, default: Date.now },
});
const VehicleModel = mongoose.model("Vehicles", vehicleschema);
module.exports = { VehicleModel };