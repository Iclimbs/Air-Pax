const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConductorSchema = new Schema({
    LogIn: { type: Date },
    LogOut: { type: Date },
    fuel: { type: Number },
    fuelCost: { type: Number }
})

const DriverSchema = new Schema({
    LogIn: { type: Date },
    LogOut: { type: Date },
    maintenance: { type: Number },
})



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
    driver: {
        type: String
    },
    conductor: {
        type: String
    },
    facilities: {
        type: Array,
        default: []
    },
    conductordetails: ConductorSchema,
    driverdetails: DriverSchema,
    CreatedAt: { type: Date, default: Date.now },
});
const TripModel = mongoose.model("Trips", tripschema)
module.exports = { TripModel };