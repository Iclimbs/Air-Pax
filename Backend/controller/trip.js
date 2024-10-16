const express = require("express")
const { TripModel } = require("../model/trip.model");
const { SeatModel } = require("../model/seat.model");
const tripRouter = express.Router()

tripRouter.post("/add", async (req, res) => {
    const { name, from, to, busid, journeystartdate, journeyenddate, starttime, endtime, distance, price, totalseats, totaltime } = req.body;
    try {
        const newtrip = new TripModel({ name, from, to, busid, journeystartdate, journeyenddate, starttime, endtime, totaltime, price, distance, totalseats, bookedseats: 0, availableseats: totalseats })
        await newtrip.save()
        res.json({ status: "success", message: "Successfully Addeded A New Trip" })
    } catch (error) {
        res.json({ status: "error", message: "Adding Trip Process Failed" })
    }
})

tripRouter.patch("/edit/:id", async (req, res) => {
    const { id } = req.params
    try {
        const trip = await TripModel.findByIdAndUpdate({ _id: id }, req.body)
        await trip.save()
        res.json({ status: "success", message: " Trip Details Successfully Updated !!" })
    } catch (error) {
        res.json({ status: "error", message: "Failed To Update  Trip  Details" })
    }
})

tripRouter.get("/listall", async (req, res) => {
    try {
        const trips = await TripModel.find({})
        res.json({ status: "success", data: trips })
    } catch (error) {
        res.json({ status: "error", message: "Get List Failed" })
    }
})


// tripRouter.post("/list", async (req, res) => {
//     const { from, to, date, tickets } = req.body
//     console.log("Body ", req.body);

//     try {
//         const trips = await TripModel.find({ from: from, to: to, journeystartdate: date, availableseats: { $gte: tickets } })
//         res.json({ status: "success", data: trips })
//     } catch (error) {
//         res.json({ status: "error", message: "Get List Failed" })

//     }
// })



tripRouter.get("/list", async (req, res) => {
    const { from, to, date } = req.query
    try {
        const trips = await TripModel.find({ from: from, to: to, journeystartdate: date })
        res.json({ status: "success", data: trips })
    } catch (error) {
        res.json({ status: "error", message: "Get List Failed" })

    }
})



tripRouter.get("/list/today", async (req, res) => {
    try {
        const dateObj = new Date();
        const month = dateObj.getUTCMonth() + 1; // months from 1-12
        const day = dateObj.getUTCDate();
        const year = dateObj.getUTCFullYear();
        const newDate = year + "-" + month + "-" + day;
        const trips = await TripModel.find({ journeystartdate: newDate })
        return res.json({ status: "success", data: trips })
    } catch (error) {
        res.json({ status: "error", message: "Get List Failed" })

    }
})



tripRouter.get("/detailone/:id", async (req, res) => {
    try {
        const trips = await TripModel.find({ _id: req.params.id })
        const seats = await SeatModel.find({ tripId: req.params.id })
        // Seat's Which are already booked & Payment is completed
        let bookedseats = trips[0].seatsbooked;
        // check the list of Seat's whose seats are already booked. So that we can inform the user to change his seat's
        let lockedseats = [];
        for (let index = 0; index < seats.length; index++) {
            if (bookedseats.includes(seats[index].seatNumber) === false) {
                lockedseats.push(seats[index].seatNumber)
            }
        }
        let currentseat = bookedseats.concat(lockedseats)
        trips[0].seatsbooked = currentseat
        trips[0].bookedseats = currentseat.length;
        trips[0].availableseats = trips[0].totalseats - currentseat.length
        res.json({ status: "success", data: trips })
    } catch (error) {
        res.json({ status: "error", message: `Get List Failed ${error.message}` })

    }
})

module.exports = { tripRouter }