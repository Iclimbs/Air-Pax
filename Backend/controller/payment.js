require('dotenv').config()
const express = require("express")
const generateUniqueId = require('generate-unique-id');
const { SeatModel } = require("../model/seat.model")
const { TripModel } = require("../model/trip.model")

const PaymentRouter = express.Router()

PaymentRouter.get("/success/:pnr", async (req, res) => {
    const { pnr } = req.params
    const filter = { pnr: pnr };
    const update = {
        $set: { isBooked: true }, // set status field
    }
    const seat = await SeatModel.updateMany(filter, update);
    return res.json({ status: "success", message: "Ticket Booking Successful !!" })
})


PaymentRouter.get("/failure/:pnr", async (req, res) => {
    const { pnr } = req.params
    const filter = { pnr: pnr, isBooked: false };
    const lockedseats = await SeatModel.find(filter) // contains list of all the seats which are currently locked with the particula Pnr ID. 
    let removeseats = [] // list of seat's which need's to be removed whose payment is not yet completed 
    let tripid = "" // Trip ID this consists the id of the Trip From which the unbooked seats will be Removed
    for (let index = 0; index < lockedseats.length; index++) {
        removeseats.push(lockedseats[index].seatNumber)
        tripid = lockedseats[index].tripId
    }
    const trip = await TripModel.find({ _id: tripid })
    const bookedseats = trip[0].seatsbooked.filter(item => !removeseats.includes(item)); // bookedseats will contain the list of those seats whose payment is completed
    trip[0].seatsbooked=bookedseats
    await trip[0].save()
    const seat = await SeatModel.deleteMany(filter);
    res.json({ status: "success", message: "Ticket Booking Failed !!" })
})
module.exports = { PaymentRouter }
