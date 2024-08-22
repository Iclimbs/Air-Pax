require('dotenv').config()
const express = require("express")
const { BusModel } = require("../model/bus.model")
const busRouter = express.Router()

busRouter.post("/add", async (req, res) => {
    const { busname, busno, registrationno, facilities, seat } = req.body;
    try {
        const newbus = new BusModel({ busname, busno, registrationno, facilities, seat })
        await newbus.save()
        res.json({ status: "success", message: "Working on bus details system" })
    } catch (error) {
        res.json({ status: "error", message: "Adding Bus Process Failed" })

    }
})

busRouter.get("/listall", async (req, res) => {
    try {
        const buslist = await BusModel.find({active:false})
       console.log(buslist);
        res.json({ status: "success", message: "Working on bus details system" })
    } catch (error) {
        console.log(error.message);
        
        res.json({ status: "error", message: "Adding Bus Process Failed" })

    }
})
module.exports = { busRouter }