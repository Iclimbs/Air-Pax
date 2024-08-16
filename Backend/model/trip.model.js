const mongoose = require("mongoose");
const tripschema = mongoose.Schema({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    busid: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    journeydate: {
        type: String
    },
    starttime: {
        type: Date,
        required: true
    },
    endtime: {
        type: Date,
        required: true
    },
    journeytotaltime: {
        type: Date,
        required: true
    },
    distance: {
        true: String,
        required: true
    },
    CreatedAt: { type: Date, default: Date.now },
});
const TripModel = mongoose.model("Trips", tripschema);
module.exports = { TripModel };