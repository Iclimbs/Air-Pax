require('dotenv').config()
const express = require("express")
const { SeatModel } = require("../model/seat.model")
const { TripModel } = require("../model/trip.model");
const { PaymentModel } = require('../model/payment.model');
const { UserModel } = require('../model/user.model');
const ejs = require("ejs")
const path = require('node:path');
const { transporter } = require('../service/transporter');
const PaymentRouter = express.Router()

PaymentRouter.get("/success/:pnr", async (req, res) => {
    const { pnr } = req.params
    const filter = { pnr: pnr };
    const update = {
        $set: { isBooked: true }, // set status field
    }
    const seat = await SeatModel.updateMany(filter, update);
    const paymentdetails = await PaymentModel.find({ pnr: pnr })
    paymentdetails[0].paymentstatus.pending = false;
    paymentdetails[0].paymentstatus.complete = true;
    await paymentdetails[0].save()
    const seatdetails = await SeatModel.find({ pnr: pnr })
    let userid = seatdetails[0].bookedby;
    let tripid = seatdetails[0].tripId;
    const userdetails = await UserModel.find({ _id: userid })
    const tripdetails = await TripModel.find({ _id: tripid })
    let confirmpayment = path.join(__dirname, "../emailtemplate/confirmpayment.ejs")
    ejs.renderFile(confirmpayment, { user: userdetails[0], seat: seatdetails, trip: tripdetails[0],payment:paymentdetails[0]}, function (err, template) {
        if (err) {
            res.json({ status: "error", message: err.message })
        } else {
            const mailOptions = {
                from: process.env.emailuser,
                to: `${userdetails[0].email}`,
                subject: `Booking Confirmation on AIRPAX, Bus: ${tripdetails[0].busid}, ${tripdetails[0].journeystartdate}, ${tripdetails[0].from} - ${tripdetails[0].to}`,
                html: template
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.json({ status: "error", error: 'Failed to send email' });
                } else {
                    return res.json({ status: "success", message: 'Please Check Your Email', redirect: "/" });
                }
            })
        }
    })})


PaymentRouter.get("/failure/:pnr", async (req, res) => {
    const { pnr } = req.params
    const filter = { pnr: pnr, isBooked: false };
    const lockedseats = await SeatModel.find(filter) // contains list of all the seats which are currently locked with the particula Pnr ID. 
    let removeseats = [] // list of seat's which need's to be removed whose payment is not yet completed 
    let tripid = "" // Trip ID this consists the id of the Trip From which the unbooked seats will be Removed
    for (let index = 0; index < lockedseats.length; index++) {
        removeseats.push(lockedseats[index].seatNumber)
        tripid = lockedseats[index].tripId
    }
    const trip = await TripModel.find({ _id: tripid })
    const bookedseats = trip[0].seatsbooked.filter(item => !removeseats.includes(item)); // bookedseats will contain the list of those seats whose payment is completed
    trip[0].seatsbooked = bookedseats
    trip[0].bookedseats = trip[0].bookedseats - removeseats.length
    trip[0].availableseats = trip[0].availableseats + removeseats.length
    await trip[0].save()
    const seat = await SeatModel.deleteMany(filter);
    const paymentdetails = await PaymentModel.find({ pnr: pnr })
    paymentdetails[0].paymentstatus.pending = false;
    paymentdetails[0].paymentstatus.failure = true;
    await paymentdetails[0].save()
    res.json({ status: "success", message: "Ticket Booking Failed !!" })
})


module.exports = { PaymentRouter }

// py73gwlx8d