require('dotenv').config()
const express = require("express")
const { VehicleModel } = require("../model/vehicle.model")
const vehicleRouter = express.Router()

vehicleRouter.post("/add", async (req, res) => {
    const { name, busno, registrationno, facilities, seat } = req.body;
    try {
        const newbus = new VehicleModel({ name, busno, registrationno, facilities: facilities.split(","), seat })
        await newbus.save()
        res.json({ status: "success", message: "New Vehicle Added !!" })
    } catch (error) {
        res.json({ status: "error", message: "Failed To Add New Vehicle" })
    }
})

vehicleRouter.get("/listall", async (req, res) => {
    try {
        const vehicleList = await VehicleModel.find({ assigned: null })
        if (vehicleList) {
            res.json({ status: "success", data: vehicleList })
        } else {
            res.json({ status: "error", message: "No Bus is Available Right Now !" })
        }
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})
module.exports = { vehicleRouter }