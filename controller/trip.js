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

tripRouter.post("/add/bulk", async (req, res) => {
    const { name, from, to, busid, journeystartdate, journeyenddate, starttime, endtime, distance, totaltime, price, totalseats, time } = req.body;
    // Bulk Data Which Will be Stored in Data Base
    const data = [];

    // Convert startDate to a Date object for initial value
    let journeyStartDate = new Date(journeystartdate);
    let journeyEndDate = new Date(journeyenddate);

    // Loop to add 30 consecutive days
    for (let i = 0; i < time; i++) {
        // Format and store the current date in the dates array
        data.push({
            name, from, to, busid, journeystartdate: journeyStartDate.toISOString().split('T')[0], journeyenddate: journeyEndDate.toISOString().split('T')[0], starttime, endtime, distance, totaltime, price, bookedseats: 0, availableseats: totalseats, totalseats
        })
        // // Move to the next day
        journeyStartDate.setDate(journeyStartDate.getDate() + 1);
        journeyEndDate.setDate(journeyEndDate.getDate() + 1);
    }

    try {
        await TripModel.insertMany(data)
        res.json({ status: "success", message: "Successfully Addeded Trip's in Bulk", })
    } catch (error) {
        res.json({ status: "error", message: `Adding Trip Process Failed ${error.message}` })
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

tripRouter.get("/list", async (req, res) => {
    const { from, to, date } = req.query
    try {
        const trips = await TripModel.find({ from: from, to: to, journeystartdate: date })
        res.json({ status: "success", data: trips })
    } catch (error) {
        res.json({ status: "error", message: "Get List Failed" })
    }
})



tripRouter.get("/list/schedule", async (req, res) => {
    try {
        // Creating Date To Filter Data on the Basis of Date 

        const currentdate = new Date();
        // Creating Current Date

        const currentmonth = currentdate.getUTCMonth() + 1; // months from 1-12
        const currentday = currentdate.getUTCDate();
        const currentyear = currentdate.getUTCFullYear();
        const currentDate = currentyear + "-" + currentmonth + "-" + currentday;

        // Creating TIme
        const hour = currentdate.getHours();
        const minutes = currentdate.getMinutes();
        const currenttime = hour + ":" + minutes

        // Creating End Date
        const enddate = new Date(new Date().setDate(new Date().getDate() + 7))
        const endmonth = enddate.getUTCMonth() + 1; // months from 1-12
        const endday = enddate.getUTCDate();
        const endyear = enddate.getUTCFullYear();
        const endDate = endyear + "-" + endmonth + "-" + endday;

        const trips = await TripModel.find({ journeystartdate: { $lte: endDate, $gte: currentDate }, starttime: { $gt: currenttime } })
        return res.json({ status: "success", data: trips })
    } catch (error) {
        console.log(error.message);

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
            if ((bookedseats.includes(seats[index].seatNumber) === false) && ((seats[index].details.status == "Pending") || (seats[index].details.status == "Completed"))) {
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