require('dotenv').config()
const express = require("express")
const ejs = require("ejs")
const path = require('node:path');
const { transporter } = require('../../service/transporter');
const { SeatModel } = require("../../model/seat.model")
const { TripModel } = require("../../model/trip.model");
const { PaymentModel } = require('../../model/payment.model');
const { OtherUserModel } = require('../../model/Other.seat.model');

const OtherPaymentRouter = express.Router()

OtherPaymentRouter.get("/success/", async (req, res) => {
    const { pnr, ref, method } = req.query
    const filter = { pnr: pnr };
    const update = {
        $set: { isBooked: true }, // set status field
    }
    const seat = await SeatModel.updateMany(filter, update);
    const paymentdetails = await PaymentModel.find({ pnr: pnr })
    paymentdetails[0].refno = ref,
        paymentdetails[0].method = method,
        paymentdetails[0].paymentstatus.pending = false
    paymentdetails[0].paymentstatus.complete = true
    await paymentdetails[0].save()
    const userdetails = await OtherUserModel.find({ pnr: pnr })
    const tripdetails = await TripModel.find({ _id: userdetails[0].tripId })
    let Gmrconfirmpayment = path.join(__dirname, "../../emailtemplate/gmrconfirmpayment.ejs")
    ejs.renderFile(Gmrconfirmpayment, { user: userdetails[0].primaryuser, seat: userdetails[0].passengerdetails, trip: tripdetails[0], pnr: userdetails[0].pnr, amount: userdetails[0].amount }, function (err, template) {
        if (err) {
            res.json({ status: "error", message: err.message })
        } else {
            const mailOptions = {
                from: process.env.emailuser,
                to: `${userdetails[0].primaryuser.email}`,
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
    })
})


OtherPaymentRouter.get("/failure/", async (req, res) => {
    const { pnr, ref, method } = req.query
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
    paymentdetails[0].refno = ref,
        paymentdetails[0].method = method,
        paymentdetails[0].paymentstatus.pending = false
    paymentdetails[0].paymentstatus.failure = true
    await paymentdetails[0].save()
    res.json({ status: "success", message: "Ticket Booking Failed !!" })
})
module.exports = { OtherPaymentRouter }
