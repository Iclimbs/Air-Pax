require('dotenv').config()
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator')
const express = require("express")
const { UserModel } = require("../model/user.model");
const { RegistrationAuthentication } = require('../middleware/Registration');
const { transporter } = require('../service/transporter');
const userRouter = express.Router()
const ejs = require("ejs")
const path = require('node:path');


const crypt = require("crypto");
const hash = {
    sha256: (data) => {
        return crypt.createHash("sha256").update(data).digest("hex");
    },
    sha512: (data) => {
        return crypt.createHash("sha512").update(data).digest("hex");
    },
    md5: (data) => {
        return crypt.createHash("md5").update(data).digest("hex");
    },
};

userRouter.post("/login", async (req, res) => {
    try {
        const { phoneno, password } = req.body
        const userExists = await UserModel.find({ phoneno })
        if (userExists.length === 0) {
            return res.json({ status: "success", message: "No User Exists Please SignUp First", redirect: "/signup" })
        } else {
            if (hash.sha256(password) === userExists[0].password) {
                let token = jwt.sign({ name: userExists[0].name, email: userExists[0].email, phoneno: userExists[0].phoneno, exp: Math.floor(Date.now() / 1000) + (60 * 60) }, "Authentication")
                res.json({ status: "success", message: "Login Successful", token: token })
            } else {
                res.json({ status: "error", message: "Wrong Password Please Try Again" })
            }
        }
    } catch (error) {
        res.json({ status: "error", message: `Error Found in Login Section ${error.message}` })
    }
})

userRouter.post("/forgot", async (req, res) => {
    try {
        const { phoneno } = req.body
        const userExists = await UserModel.find({ phoneno })
        if (userExists.length === 0) {
            return res.json({ status: "success", message: "No User Exists Please SignUp First", redirect: "/signup" })
        } else {
            let newotp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
            let forgotpasswordtoken = jwt.sign({ name: userExists[0].name, email: userExists[0].email, phoneno: userExists[0].phoneno, exp: Math.floor(Date.now() / 1000) + (60 * 15) }, "Registration");
            let link = `${process.env.domainurl}${newotp}/${forgotpasswordtoken}`
            userExists[0].otp = newotp;
            userExists[0].forgotpasswordtoken = forgotpasswordtoken
            await userExists[0].save()
            let testing = path.join(__dirname, "../emailtemplate/forgotPassword.ejs")
            ejs.renderFile(testing, { link: link }, function (err, template) {
                if (err) {
                    res.json({ status: "error", message: err.message })
                } else {
                    const mailOptions = {
                        from: 'uttamkr5599@gmail.com',
                        to: `${userExists[0].email}`,
                        subject: 'Otp To Reset Password.',
                        html: template
                    }
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return res.json({ status: "error", error: 'Failed to send email' });
                        } else {
                            return res.json({ status: "success", message: 'Email sent successfully' });
                        }
                    })
                }
            })

        }
    }
    catch (error) {
        res.json({ status: "error", message: `Error Found in Login Section ${error.message}` })
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
                signuptoken: jwt.sign({ name: name, email: email, phoneno: phoneno, exp: Math.floor(Date.now() / 1000) + (60 * 60) }, "Registration"),
                otp: otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false }),
                password: null
            })
            await user.save()
            fetch(`https://2factor.in/API/V1/${process.env.twofactorkey}/SMS/${user.phoneno}/${user.otp}/Airpax`)
                .then((response) => response.json())
                .then((data) => {
                    data.Status === 'Success' ?
                        res.json({ status: "success", message: "User Registration Successful. Please Check Your Phone For OTP", redirect: "/login", token: user.signuptoken })

                        : res.json({ status: "error", message: "User Registration UnSuccessful. Failed to Send OTP. PLease Try again Aftersome Time", redirect: "/login", token: user.signuptoken })
                });
        }
    } catch (error) {
        res.json({ status: "error", message: `Error Found in User Registration ${error.message}` })
    }
})

userRouter.post("/otp/verification", RegistrationAuthentication, async (req, res) => {
    try {
        const { otp } = req.body
        const user = await UserModel.find({ signuptoken: req.headers.token, otp: otp })
        user[0].verified.phone = true;
        user[0].otp = null;
        await user[0].save()
        if (user.length >= 1) {
            res.json({ status: "success", message: "Otp Verification Successful", token: user.signuptoken, redirect: '/createpassword' })
        } else {
            res.json({ status: "error", message: "Otp Verification Failed. Please Try After Some Time", redirect: "/signup" })
        }
    } catch (error) {
        res.json({ status: "error", message: "Your Enquiry Registration is Unsuccessful." })
    }
})

userRouter.post("/password/create", async (req, res) => {
    try {
        const { password, cnfpassword } = req.body
        if (password === cnfpassword) {
            const user = await UserModel.find({ signuptoken: req.headers.token })
            if (user.length >= 1 && user[0].verified.phone == true) {
                user[0].password = hash.sha256(password)
                await user[0].save()
                res.json({ status: "success", message: "New Password Created Please Login Now !!" })
            } else {
                res.json({ status: "error", message: "Please Complete Your OTP Verification", redirect: "/signup" })
            }
        } else {
            res.json({ status: "error", message: "Password & Confirm Password Doesn't Match" })
        }
    } catch (error) {
        res.json({ status: "error", message: `Error Found in Password Creation ${error.message}` })
    }
})

userRouter.post("/password/change", async (req, res) => {
    const { token, otp } = req.headers
    try {
        const { password, cnfpassword } = req.body
        if (password === cnfpassword) {
            const user = await UserModel.find({ forgotpasswordtoken: token, otp: otp })
            if (user.length >= 1 && user[0].verified.phone == true) {
                user[0].password = hash.sha256(password)
                user[0].forgotpasswordtoken = null
                user[0].otp = null
                await user[0].save()
                res.json({ status: "success", message: "New Password Created Please Login Now !!" })
            } else {
                res.json({ status: "error", message: "You Haven't Made a request to Change Password", redirect: "/signup" })
            }
        } else {
            res.json({ status: "error", message: "Password & Confirm Password Doesn't Match" })
        }
    } catch (error) {
        res.json({ status: "error", message: `Error Found in Creating New Password  ${error.message}` })
    }
})

module.exports = { userRouter }