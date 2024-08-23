require('dotenv').config()
const express = require("express")
const { VehicleModel } = require("../model/vehicle.model")
const vehicleRouter = express.Router()

vehicleRouter.post("/add", async (req, res) => {
    const { busname, busno, registrationno, facilities, seat } = req.body;
    try {
        const newbus = new VehicleModel({ busname, busno, registrationno, facilities, seat })
        await newbus.save()
        res.json({ status: "success", message: "Working on bus details system" })
    } catch (error) {
        res.json({ status: "error", message: "Adding Bus Process Failed" })

    }
})

vehicleRouter.get("/listall", async (req, res) => {
    try {
        const buslist = await VehicleModel.find({active:false})
       console.log(buslist);
        res.json({ status: "success", message: "Working on bus details system" })
    } catch (error) {
        console.log(error.message);
        
        res.json({ status: "error", message: "Adding Bus Process Failed" })

    }
})
module.exports = { vehicleRouter }