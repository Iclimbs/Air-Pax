const express = require("express")
const { TripModel } = require("../model/trip.model");
const { OtherUserModel } = require('../model/Other.seat.model');
const { PaymentModel } = require("../model/payment.model");
const ejs = require("ejs")
const path = require('node:path');
const { SeatModel } = require("../model/seat.model");
const TicketRouter = express.Router()
const jwt = require('jsonwebtoken');
const { BookingModel } = require("../model/booking.model");
const { UserAuthentication } = require("../middleware/Authentication");
const { UserModel } = require("../model/user.model");
const { transporter } = require('../service/transporter');


function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}





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
    console.log("newseats ", newseats);

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
        // console.log("seat ", seat);
        // console.log("user ", user);

        let ticketcanceltemplate = path.join(__dirname, "../emailtemplate/gmrticketcancel.ejs")
        ejs.renderFile(ticketcanceltemplate, { user: ticketdetails[0].primaryuser, seat: seatdetails, trip: tripdetails[0], payment: paymentdetails[0] }, function (err, template) {
            if (err) {
                res.json({ status: "error", message: err.message })
            } else {
                const mailOptions = {
                    from: process.env.emailuser,
                    to: `${userExists[0].email}`,
                    subject: 'Otp To Reset Password.',
                    html: template
                }
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        return res.json({ status: "error", message: 'Failed to send email', redirect: "/" });
                    } else {
                        return res.json({ status: "success", message: 'Please Check Your Email', redirect: "/" });
                    }
                })
            }
        })

    }


})






// Get the List of Upcoming Tickets For the User

TicketRouter.get("/history", async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    try {
        if (!token) {
            return res.json({ status: "error", message: "Please Login to Access User Upcoming Trip Detail's", redirect: "/user/login" })
        } else {
            // Creating Date To Filter Data on the Basis of Date 
            const dateObj = new Date();
            // Creating Date
            const month = (dateObj.getUTCMonth() + 1) < 10 ? String(dateObj.getUTCMonth() + 1).padStart(2, '0') : dateObj.getUTCMonth() + 1 // months from 1-12
            const day = dateObj.getUTCDate() < 10 ? String(dateObj.getUTCDate()).padStart(2, '0') : dateObj.getUTCDate()
            const year = dateObj.getUTCFullYear();
            const newDate = year + "-" + month + "-" + day;

            const decoded = jwt.verify(token, 'Authentication')
            const upcomingtrips = await BookingModel.find({ journeystartdate: { $lte: newDate }, userid: decoded._id })
            return res.json({ status: "success", data: upcomingtrips })
        }
    } catch (error) {
        res.json({ status: "error", message: `Error Found in Trip History Details ${error.message}` })
    }
})

TicketRouter.get("/upcoming", async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    try {
        if (!token) {
            return res.json({ status: "error", message: "Please Login to Access User Upcoming Trip Detail's", redirect: "/user/login" })
        } else {

            // Creating Date To Filter Data on the Basis of Date 
            const dateObj = new Date();
            // Creating Date
            const month = (dateObj.getUTCMonth() + 1) < 10 ? String(dateObj.getUTCMonth() + 1).padStart(2, '0') : dateObj.getUTCMonth() + 1 // months from 1-12
            const day = dateObj.getUTCDate() < 10 ? String(dateObj.getUTCDate()).padStart(2, '0') : dateObj.getUTCDate()
            const year = dateObj.getUTCFullYear();
            const newDate = year + "-" + month + "-" + day;
            
            const decoded = jwt.verify(token, 'Authentication')
            const upcomingtrips = await BookingModel.find({ journeystartdate: { $gte: newDate }, userid: decoded._id, status: "Confirmed" })
            return res.json({ status: "success", data: upcomingtrips })
        }
    } catch (error) {
        res.json({ status: "error", message: `Error Found in Upcoming Trip Details ${error.message}` })
    }
})


TicketRouter.get("/detailone/:id", UserAuthentication, async (req, res) => {
    const { id } = req.params

    const booking = await BookingModel.find({ _id: id })
    const seat = await SeatModel.find({ pnr: booking[0].pnr }, { _id: 1, seatNumber: 1, details: 1 })
    booking[0].seats = seat
    res.json({ status: "success", data: booking[0] })
})

TicketRouter.post("/cancel", UserAuthentication, async (req, res) => {
    const { pnr, bookingId, seats, reasonForCancellation } = req.body
    const bookingdetails = await BookingModel.find({ _id: bookingId, pnr: pnr })
    // Update Booking Details
    if (!bookingdetails) {
        return res.json({ status: "error", message: "No Booking Detail's Found" })
    }
    let bookingstatus = "Cancelled"

    if (bookingdetails[0].seats.length !== seats.length) {
        bookingstatus = "Confirmed"
    }

    try {
        bookingdetails[0].status = bookingstatus
        await bookingdetails[0].save()
    } catch (error) {
        res.json({ status: "error", message: `Failed To Update Booking Status ${error.message}` })
    }

    // Update Payment Details 


    // Update Seat Details 
    const seatdetails = await SeatModel.find({ pnr: pnr, "details.status": "Completed" })

    // Getting Total Amount Paid By the User For Booking Tickets Which he want to cancel right now 
    let totalamount = 0;
    let bulkwriteseat = [];
    let seatstoberemoved = [];
    let cancelledSeats = [];
    for (let index = 0; index < seatdetails.length; index++) {
        for (let i = 0; i < seats.length; i++) {
            if ((seatdetails[index].id == seats[i].id) && (seatdetails[index].seatNumber == seats[i].seatNumber)) {
                totalamount += seatdetails[index].details.amount;
                seatstoberemoved.push(seats[i].seatNumber)
                cancelledSeats.push(seatdetails[index])
                bulkwriteseat.push({
                    updateOne: {
                        filter: { pnr: pnr, _id: seats[i].id },         // condition to match first document
                        update: { $set: { "details.status": "Refunded" } }
                    }
                })
            }

        }
    }
    try {
        await SeatModel.bulkWrite(bulkwriteseat)
    } catch (error) {

        res.json({ status: "error", message: "Bulk Update Seat Process Failed " })
    }

    // Generating Refund Amount Based on The Time Of Cancellation


    const tripdetails = await TripModel.find({ _id: bookingdetails[0].tripId })
    const currentDateTime = new Date();
    const journeytime = new Date(`${tripdetails[0].journeystartdate}T${tripdetails[0].starttime}:00`)
    let bookedseats = tripdetails[0].seatsbooked;
    let newseats = bookedseats.filter(seat => !seatstoberemoved.includes(seat));
    tripdetails[0].bookedseats = newseats.length;
    tripdetails[0].availableseats = tripdetails[0].totalseats - newseats.length
    tripdetails[0].seatsbooked = newseats;
    try {
        await tripdetails[0].save()
    } catch (error) {
        res.json({ status: "error", message: "Ticket Cancellation Process Failed " })
    }

    // Getting Payment Details of the Pnr To Change detail's like staus & refund amount 
    const paymentdetails = await PaymentModel.find({ pnr: pnr })
    if (paymentdetails[0].paymentstatus === "Failed") {
        return res.json({ status: "error", message: "Ticket Cancellation Process Failed !! Payment is Not Confirmed For This Pnr" })
    } else {
        let refundamount = 0;
        // let ticketcost = 0;
        const timeDifferenceMs = journeytime - currentDateTime
        const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60);

        if (timeDifferenceHours > 48) {
            refundamount = Math.floor((totalamount) * 0.9)

        } else if (timeDifferenceHours > 24) {
            refundamount = Math.floor((totalamount) * 0.5)
        }
        try {
            paymentdetails[0].refundamount = refundamount;
            paymentdetails[0].paymentstatus = "Refunded";
            paymentdetails[0].refundreason = reasonForCancellation
            await paymentdetails[0].save()
        } catch (error) {
            res.json({ status: "error", message: "Failed To Save Refund Amount For this Pnr " })
        }
    }

    const userdetails = await UserModel.find({ _id: bookingdetails[0].userid })

    let cancelTicket = path.join(__dirname, "../emailtemplate/cancelTicket.ejs")
    ejs.renderFile(cancelTicket, { user: userdetails[0], seat: cancelledSeats, trip: tripdetails[0], amount: paymentdetails[0].refundamount, pnr: pnr, reason: reasonForCancellation }, function (err, template) {
        if (err) {
            res.json({ status: "error", message: err.message })
        } else {
            const mailOptions = {
                from: process.env.emailuser,
                to: `${userdetails[0].email}`,
                subject: `Booking Cancellation on AIRPAX, Bus: ${tripdetails[0].busid}, ${tripdetails[0].journeystartdate}, ${tripdetails[0].from} - ${tripdetails[0].to}`,
                html: template
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error in Sending Mail ", error.message);
                    return res.json({ status: "error", message: 'Failed to send email' });
                } else {
                    console.log("Email Sent ", info);
                    return res.json({ status: "success", message: 'Please Check Your Email', redirect: "/" });
                }
            })
        }
    })
    // seats should be an array ob object where each object will contain id & seatNo
})


module.exports = { TicketRouter }