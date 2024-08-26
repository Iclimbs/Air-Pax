const mongoose = require("mongoose");
const tripschema = mongoose.Schema({
    name:{
        type:String,
        required:true
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
        type: mongoose.Types.ObjectId,
        required: true
    },
    starttime: {
        type: Date,
        required: true
    }, endtime: {
        type: Date,
        required: true
    },
    totaltime: {
        type: Date,
        required: true
    },
    distance: {
        type: String,
        required: true
    },
    price:{
        type:Number,
        required:true
    },
    CreatedAt: { type: Date, default: Date.now },
});
const TripModel = mongoose.model("Trips", tripschema)
module.exports = { TripModel };