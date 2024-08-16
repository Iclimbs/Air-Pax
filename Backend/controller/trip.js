require('dotenv').config()
const express = require("express")
const { TripModel } = require("../model/trip.model")
const tripRouter = express.Router()

tripRouter.post("/add", async (req, res) => {
    const { from, to, busid, journeydate, starttime, endtime, journeytotaltime, distance } = req.body;
    try {
        const newtrip = new TripModel({ from, to, busid, journeydate, starttime, endtime, journeytotaltime, distance })
        await newtrip.save()
        res.json({ status: "success", message: "Working on Trip details system" })
    } catch (error) {
        res.json({ status: "error", message: "Adding Trip Process Failed" })

    }
})

module.exports = { tripRouter }