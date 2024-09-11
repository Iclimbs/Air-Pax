const mongoose = require("mongoose");
const tripschema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    journeystartdate: {
        type: String,
        required: true
    },
    journeyenddate: {
        type: String,
        required: true
    },
    busid: {
        type: String,
        required: true
    },
    starttime: {
        type: String,
        required: true
    }, endtime: {
        type: String,
        required: true
    },
    totaltime: {
        type: String,
        required: false
    },
    distance: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    totalseats: {
        type: Number,
        required: true
    }, bookedseats: {
        type: Number,
        required: true
    },
    availableseats: {
        type: Number,
        required: true
    },
    seatsbooked: {
        type: Array
    },
    CreatedAt: { type: Date, default: Date.now },
});
const TripModel = mongoose.model("Trips", tripschema)
module.exports = { TripModel };