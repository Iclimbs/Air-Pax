const express = require("express")
const jwt = require('jsonwebtoken');
const { TripModel } = require("../model/trip.model");
const { SeatModel } = require("../model/seat.model");
const { AdminAuthentication } = require("../middleware/Authorization");
const { OtherUserModel } = require("../model/Other.seat.model");
const tripRouter = express.Router()


function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
}


tripRouter.post("/add", async (req, res) => {
    const { name, from, to, busid, journeystartdate, journeyenddate, starttime, endtime, distance, price, totalseats, totaltime, conductor, driver } = req.body;
    try {
        const newtrip = new TripModel({ name, from, to, busid, journeystartdate, journeyenddate, starttime, endtime, totaltime, price, distance, totalseats, bookedseats: 0, availableseats: totalseats, conductor, driver })
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
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    try {
        const trips = await TripModel.find({ from: from, to: to, journeystartdate: date })
        const upcomingEvents = trips.filter(item => timeToMinutes(item.starttime) > currentMinutes);
        if (upcomingEvents.length >= 1) {
            res.json({ status: "success", data: upcomingEvents })
        } else {
            res.json({ status: "error", data: trips, message: `No Upcoming Trip's Found Today` })
        }
    } catch (error) {
        res.json({ status: "error", message: `Failed To Get List Of Today's Trip's ${error.message}` })
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
            if ((bookedseats.includes(seats[index].seatNumber) === false) && ((seats[index].details.status == "Pending") || (seats[index].details.status == "Completed") || (seats[index].details.status == "Failed"))) {
                lockedseats.push(seats[index].seatNumber)
            }
        }

        let currentseat = bookedseats.concat(lockedseats)

        trips[0].seatsbooked = currentseat

        trips[0].bookedseats = currentseat.length;

        trips[0].availableseats = trips[0].totalseats - currentseat.length

        if (trips.length !== 0) {
            res.json({ status: "success", data: trips })
        } else {
            res.json({ status: "error", message: "No Trip Found With This ID" })
        }

    } catch (error) {
        res.json({ status: "error", message: `Get List Failed ${error.message}` })
    }
})


tripRouter.get("/assigned/conductor", AdminAuthentication, async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, 'Authorization')

    try {
        const trip = await TripModel.find({ conductor: decoded._id })
        res.json({ status: "success", data: trip })
    } catch (error) {
        res.json({ status: "error", message: "Failed To Get User List" })
    }
})

tripRouter.get("/assigned/driver", AdminAuthentication, async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, 'Authorization')
    try {
        const trip = await TripModel.find({ driver: decoded._id })
        res.json({ status: "success", data: trip })
    } catch (error) {
        console.log(error.message);

        res.json({ status: "error", message: "Failed To Get User List" })
    }
})


module.exports = { tripRouter }