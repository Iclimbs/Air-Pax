require('dotenv').config()
const express = require("express")
const { VehicleModel } = require("../model/vehicle.model")
const vehicleRouter = express.Router()

vehicleRouter.post("/add", async (req, res) => {
    const { name, busno, registrationno, facilities, seats, price } = req.body;
    console.log("Body ",req.body);
    
    try {
        const newvehicle = new VehicleModel({ name, busno, registrationno, facilities: facilities.split(","), seats, price })
        await newvehicle.save()
        res.json({ status: "success", message: "New Vehicle Added !!" })
    } catch (error) {
        console.log(error.message);
        res.json({ status: "error", message: "Failed To Add New Vehicle" })
    }
})



vehicleRouter.patch("/edit/:id", async (req, res) => {
    const { id } = req.params
    try {
        const  vehicle = await VehicleModel.findByIdAndUpdate({ _id: id }, req.body)
        await  vehicle.save()
        res.json({ status: "success", message: " vehicle Details Successfully Updated !!" })
    } catch (error) {
        res.json({ status: "error", message: "Failed To Update  vehicle  Details" })
    }
})



vehicleRouter.patch("/disable/:id", async (req, res) => {
    const { id } = req.params
    try {
        const vehicle = await VehicleModel.findById({ _id: id })
        vehicle.active = !vehicle.active;
        await vehicle.save()
        res.json({ status: "success", message: "Vehicle Condition Updated Successfully !!" })
    } catch (error) {
        console.log(error.message);
        res.json({ status: "error", message: "Failed To Update Vehicle Condition Details" })
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


vehicleRouter.get("/search/:id", async (req, res) => {
    try {
        const vehicleList = await VehicleModel.find({_id:req.params.id})
        res.json({ status: "success", data: vehicleList })
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})


module.exports = { vehicleRouter }