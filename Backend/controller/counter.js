require('dotenv').config()
const express = require("express")
const { CounterModel } = require("../model/counter.model")
const CounterRouter = express.Router()

CounterRouter.post("/add", async (req, res) => {
    const { name, city, phoneno, location } = req.body;
    try {
        const newcounter = new CounterModel({ name, city, phoneno, location })
        await newcounter.save()
        res.json({ status: "success", message: "New Counter Added !!" })
    } catch (error) {
        res.json({ status: "error", message: "Failed To Add New Counter" })
    }
})

CounterRouter.patch("/edit/:id", async (req, res) => {
    const { id } = req.params
    try {
        const counter = await CounterModel.findByIdAndUpdate({ _id: id }, req.body)
        await counter.save()
        res.json({ status: "success", message: "Counter Details Successfully Updated !!" })
    } catch (error) {
        res.json({ status: "error", message: "Failed To Update Counter  Details" })
    }
})


CounterRouter.patch("/disable/:id", async (req, res) => {
    const { id } = req.params
    try {
        const counter = await CounterModel.findById({ _id: id })
        counter.status.enabled = !counter.status.enabled;
        counter.status.disabled = !counter.status.disabled;
        await counter.save()
        res.json({ status: "success", message: "Counter Details Successfully Updated !!" })
    } catch (error) {
        res.json({ status: "error", message: "Failed To Update Counter  Details" })
    }
})


CounterRouter.get("/listall", async (req, res) => {
    try {
        const counterList = await CounterModel.find()
        res.json({ status: "success", data: counterList })

    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})


CounterRouter.get("/search/:name", async (req, res) => {
    try {
        const counterList = await CounterModel.find({name:req.params.name})        
        res.json({ status: "success", data: counterList })

    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})

CounterRouter.get("/listall/active", async (req, res) => {
    try {
        const counterList = await CounterModel.find({ 'status.enabled': true })
        if (counterList.length >= 1) {
            res.json({ status: "success", data: counterList })
        } else {
            res.json({ status: "error", message: "No Counter is Active Right Now !" })
        }
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})
module.exports = { CounterRouter }