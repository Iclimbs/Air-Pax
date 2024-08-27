const express = require("express")
const { TripModel } = require("../model/trip.model")
const tripRouter = express.Router()

tripRouter.post("/add", async (req, res) => {
    const { name, from, to, busid, journeystartdate, journeyenddate, starttime, endtime,  distance, price } = req.body;
    const startDate = new Date(journeystartdate)
    const endDate = new Date(journeyenddate)
    const startimetotal = Number(starttime.slice(0, 2)) * 60 + Number(starttime.slice(3))
    const endimetotal = Number(endtime.slice(0, 2)) * 60 + Number(endtime.slice(3))
    const totaltime = endimetotal - startimetotal;
    try {
        const newtrip = new TripModel({ name, from, to, busid, journeystartdate: startDate, journeyenddate: endDate, starttime, endtime, price, distance, totaltime })
        await newtrip.save()
        res.json({ status: "success", message: "Working on Trip details system" })
    } catch (error) {
        console.log(error.message);
        res.json({ status: "error", message: "Adding Trip Process Failed" })

    }
})

module.exports = { tripRouter }