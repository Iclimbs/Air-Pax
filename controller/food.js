require('dotenv').config()
const express = require("express")
const { FoodModel } = require("../model/food.model")
const FoodRouter = express.Router()

FoodRouter.post("/add", async (req, res) => {
    const { name, price } = req.body;
    try {
        const newfood = new FoodModel({ name, price })
        await newfood.save()
        res.json({ status: "success", message: "New Food Item Added !!" })
    } catch (error) {
        res.json({ status: "error", message: "Failed To Add New Food Item" })
    }
})

FoodRouter.patch("/edit/:id", async (req, res) => {
    const { id } = req.params
    try {
        const food = await FoodModel.findByIdAndUpdate({ _id: id }, req.body)
        await food.save()
        res.json({ status: "success", message: "Food Item Details Successfully Updated !!" })
    } catch (error) {
        res.json({ status: "error", message: "Failed To Update Food Item Details" })
    }
})


FoodRouter.patch("/disable/:id", async (req, res) => {
    const { id } = req.params
    try {
        const food = await FoodModel.findById({ _id: id })
        food.available = !food.available;
        await food.save()
        res.json({ status: "success", message: "Food Item Availability Updated !!" })
    } catch (error) {
        res.json({ status: "error", message: "Failed To Update Food Item Availability Details" })
    }
})


FoodRouter.get("/listall", async (req, res) => {
    try {
        const foodList = await FoodModel.find()
        res.json({ status: "success", data: foodList })
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})

FoodRouter.get("/listall/active", async (req, res) => {
    try {
        const foodList = await FoodModel.find({ available: true },{available:0,CreatedAt:0})
        if (foodList.length >= 1) {
            res.json({ status: "success", data: foodList })
        } else {
            res.json({ status: "error", message: "No Food Item is Available Right Now !" })
        }
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})
module.exports = { FoodRouter }