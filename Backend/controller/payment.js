require('dotenv').config()
const express = require("express")
const generateUniqueId = require('generate-unique-id');
const { SeatModel } = require("../model/seat.model")
const { TripModel } = require("../model/trip.model")
const PaymentRouter = express.Router()

PaymentRouter.get("/success/:pnr", async (req, res) => {
    const { pnr } = req.params
    const filter = { pnr:pnr };
    const update = {
        $set: { isBooked: true }, // set status field

    }
    const seat = await SeatModel.updateMany(filter, update);
    return res.json({ status: "success", message: "Testing Success !!" })
})


PaymentRouter.get("/failure/:pnr", async (req, res) => {
    const { pnr} = req.params
    const filter = { pnr:pnr,isBooked:false };

    // Delete documents that match the filter
    const seat = await SeatModel.deleteMany(filter);
    console.log(seat);
    
    res.json({ status: "success", message: "New Counter Added !!" })
})
module.exports = { PaymentRouter }
