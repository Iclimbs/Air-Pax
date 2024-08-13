require('dotenv').config()
let rand = require("random-key");
const bcrypt = require("bcrypt")
const otpGenerator = require('otp-generator')
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


userRouter.post("/register", async (req, res) => {
    try {
        const { name, email, phoneno } = req.body
        const userExists = await UserModel.find({ phoneno })
        if (userExists.length >= 1) {
            res.json({ status: "error", message: "User Already Exists with this Phone Number. Please Try another Phone No", redirect: "/login" })
        } else {
            const user = new UserModel({
                name,
                email,
                phoneno,
                signuptoken: rand.generate(),
                otp: otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false }),
                password: null
            })
            await user.save()
            res.json({ status: "success", message: "User Registration Successful", redirect: "/login", token: user.signuptoken })
        }
    } catch (error) {
        console.log("registion error section", error.message);
        res.json({ status: "error", message: "Your Enquiry Registration is Unsuccessful." })
    }
})

userRouter.post("/otp/verification", async (req, res) => {
    try {
        const { otp } = req.body
        const user = await UserModel.find({ signuptoken: req.headers.token, otp: otp })
        user[0].verified.phone = true;
        await user[0].save()
        if (user.length >= 1) {
            res.json({ status: "success", message: "Otp Verification Successful", token: user.signuptoken })
        } else {
            res.json({ status: "error", message: "Otp Verification Failed. Please Try After Some Time", redirect: "/signup" })
        }
    } catch (error) {
        console.log("registion error section", error.message);
        res.json({ status: "error", message: "Your Enquiry Registration is Unsuccessful." })
    }
})


userRouter.post("/password/create", async (req, res) => {
    try {
        const { password, cnfpassword } = req.body
        if (password === cnfpassword) {
            const user = await UserModel.find({ signuptoken: req.headers.token })
            if (user.length >= 1 && user[0].verified.phone == true) {
                bcrypt.hash(password, process.env.saltrounds, async (err, hash) => {
                    user[0].password = hash;
                    await user[0].save()
                });
                res.json({ status: "success", message: "New Password Created Please Login Now !!" })
            } else {
                res.json({ status: "error", message: "Otp Verification Failed. Please Try After Some Time", redirect: "/signup" })
            }

        } else {
            res.json({ status: "error", message: "Password & Confirm Password Doesn't Match" })
        }
    } catch (error) {
        console.log("registion error section", error.message);
        res.json({ status: "error", message: "Your Enquiry Registration is Unsuccessful." })
    }
})



module.exports = { userRouter }