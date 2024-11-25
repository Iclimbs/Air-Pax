const mongoose = require("mongoose");
const foodbookingschema = mongoose.Schema({
    foodItems: {
        type: Array,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    seatId: {
        type: String,
        required: true,
    },
    tripId: {
        type: String,
        required: true,
    },
    bookedBy:{
        type:String,
        required:true
    },
    CreatedAt: { type: Date, default: Date.now },
});
const FoodBookingModel = mongoose.model("FoodBooked", foodbookingschema);
module.exports = { FoodBookingModel };