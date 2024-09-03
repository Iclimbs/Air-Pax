require('dotenv').config()
const express = require("express")
const dns = require("dns");
const { UserModel } = require("../model/user.model");
const validateRouter = express.Router();


validateRouter.post("/email", async (req, res) => {
    try {
        const user = await UserModel.findOne({
            email: req.body.email,
        });
        if (!!user) {
            return res.json({
                status: "error",
                message:
                    "E-mail is already registered.",
            });
        }
        const domain = req.body.email.split("@")[1];
        const mx = await dns.promises.resolveMx(domain);
        if (!!mx) {
            return res.json({
                status: "success",
                message: "Valid email1"
            })
        }
        return res.status(403).json({
            status: "error",
            message: "Invalid email",
            mx,
        });
    } catch (error) {
        return res.status(403).json({
            status: "error",
            message: "Invalid email",
        });
    }
})

validateRouter.post("/tel", async (req, res) => {
    try {
        let user = await UserModel.findOne({
            phoneno: req.body.number,
        });
        if (!!user) {
            return res.json({
                status: "error",
                message:
                    "Phone number is already registered.",
            });
        }
        return res.json({
            status: "success",
            message: "Valid",
        });
    } catch (error) {
        return res.json({
            status: "error",
            message: "Invalid Phone number",
        });
    }
})
module.exports = { validateRouter }