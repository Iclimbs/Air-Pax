require('dotenv').config()
const express = require("express")
const { UserModel } = require("../model/user.model")
const userRouter = express.Router()

userRouter.post("/login", async (req, res) => {
    try {
        const { email } = req.body
        const userExists = await UserModel.find({ email })
        if (userExists.length === 0) {
            res.json({ status: "error", message: "No User Exists Please SignUp First" })
        } else {

        }
    } catch (error) {
        res.json({ status: "error", message: "Your Enquiry Registration is Unsuccessful." })
    }
})


userRouter.post("/signup", async (req, res) => {
    try {
        const { email } = req.body
        const userExists = await UserModel.find({ email })
        if (userExists.length >= 1) {
            res.json({ status: "error", message: "User Already Exists with this Email ID. Please Try another Email ID" })
        } else {
            
        }
    } catch (error) {
        res.json({ status: "error", message: "Your Enquiry Registration is Unsuccessful." })
    }
})


module.exports = { userRouter }