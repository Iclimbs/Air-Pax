const express = require("express")
const { TripModel } = require("../model/trip.model");
const { OtherUserModel } = require('../model/Other.seat.model');
const { PaymentModel } = require("../model/payment.model");
const ejs = require("ejs")
const path = require('node:path');
const TicketRouter = express.Router()

TicketRouter.post("/gmr/cancel", async (req, res) => {
    const { tripId, bookingRefId, pnr, cancelticket } = req.body;
    // Basic Detail's Requirements
    let ticketcost = 0;
    let cancelticketno = cancelticket.length;
    let journeytime = '';
    const currentDateTime = new Date();

    // Searching For UserDetails in GMR Model Data Contains Traveller detail's
    const ticketdetails = await OtherUserModel.find({ pnr: pnr }, { CreatedAt: 0 })
    if (ticketdetails.length == 0) {
        return res.json({ status: "error", message: "No Ticket Detail's Found Related to this Pnr" })
    }
    let newpassengerdetails = ticketdetails[0].passengerdetails;
    newpassengerdetails.forEach(element => {
        if (cancelticket.includes(element.SeatNo)) {
            element.status = 'Cancelled'
        }
    });

    try {
        ticketdetails[0].passengerdetails = newpassengerdetails;
        await ticketdetails[0].save()
    } catch (error) {
        res.json({ status: "error", message: "Failed To Update Ticket Details " })
    }

    // Getting Trip Details Like JourNey Data & Ticket Cost
    const tripdetails = await TripModel.find({ _id: ticketdetails[0].tripId })
    ticketcost = tripdetails[0].price;
    let bookedseats = tripdetails[0].seatsbooked;
    journeytime = new Date(`${tripdetails[0].journeystartdate}T${tripdetails[0].starttime}:00`)
    let newseats = bookedseats.filter(seat => !cancelticket.includes(seat));
    tripdetails[0].seatsbooked = newseats;
    try {
        await tripdetails[0].save()
    } catch (error) {
        res.json({ status: "error", message: "Ticket Cancellation Process Failed " })
    }

    // Getting Payment Details of the Pnr To Change detail's like staus & refund amount 
    const paymentdetails = await PaymentModel.find({ pnr: pnr })
    if (paymentdetails[0].paymentstatus.pending == true || paymentdetails[0].paymentstatus.failure == true) {
        return res.json({ status: "error", message: "Ticket Cancellation Process Failed !! Payment is Not Confirmed For This Pnr" })
    } else {
        let refundamount = 0;
        const timeDifferenceMs = journeytime - currentDateTime
        const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);

        if (timeDifferenceHours > 48) {

            refundamount = Math.floor((ticketcost * cancelticketno) * 0.9)
        } else if (timeDifferenceHours > 24) {
            refundamount = Math.floor((ticketcost * cancelticketno) * 0.5)
        }
        try {
            paymentdetails[0].refundamount = refundamount;
            paymentdetails[0].paymentstatus.complete = false;
            paymentdetails[0].paymentstatus.refund = true;
            await paymentdetails[0].save()
        } catch (error) {
            res.json({ status: "error", message: "Failed To Save Refund Amount For this Pnr " })
        }
    let user = ticketdetails[0].primaryuser;
    let seat = ticketdetails[0].passengerdetails;
console.log("seat ",seat);
console.log("user ",user);


        // let ticketcanceltemplate = path.join(__dirname, "../emailtemplate/gmrticketcancel.ejs")
        // ejs.renderFile(ticketcanceltemplate, { user: ticketdetails[0].primaryuser, seat: seatdetails, trip: tripdetails[0], payment: paymentdetails[0] }, function (err, template) {
        //     if (err) {
        //         res.json({ status: "error", message: err.message })
        //     } else {
        //         const mailOptions = {
        //             from: process.env.emailuser,
        //             to: `${userExists[0].email}`,
        //             subject: 'Otp To Reset Password.',
        //             html: template
        //         }
        //         transporter.sendMail(mailOptions, (error, info) => {
        //             if (error) {
        //                 console.log(error);
        //                 return res.json({ status: "error", message: 'Failed to send email', redirect: "/" });
        //             } else {
        //                 return res.json({ status: "success", message: 'Please Check Your Email', redirect: "/" });
        //             }
        //         })
        //     }
        // })

    }


})

module.exports = { TicketRouter }