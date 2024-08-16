require('dotenv').config()
const express = require("express")
const { BusModel } = require("../model/bus.model")
const busRouter = express.Router()

busRouter.post("/add", async (req, res) => {
    res.json({status:"success",message:"Working on bus details system"})
})

module.exports = { busRouter }