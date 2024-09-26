const express = require("express")
const { TripModel } = require("../model/trip.model")
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



tripRouter.get("/detailone/:id", async (req, res) => {
    try {
        const trips = await TripModel.find({ _id: req.params.id })
        res.json({ status: "success", data: trips })
    } catch (error) {
        res.json({ status: "error", message: "Get List Failed" })

    }
})

module.exports = { tripRouter }