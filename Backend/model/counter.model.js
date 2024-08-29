const mongoose = require("mongoose");
const counterschema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    phoneno: {
        type: Number,
        required: true,

    },
    location: {
        type: String,
        required: true,
    },
    status: {
        enabled: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    CreatedAt: { type: Date, default: Date.now },
});
const CounterModel = mongoose.model("Counter", counterschema);
module.exports = { CounterModel };