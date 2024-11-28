const express = require("express")
const ejs = require("ejs")
const path = require('node:path');
const jwt = require('jsonwebtoken');
const { transporter } = require('../service/transporter');
const { TripModel } = require("../model/trip.model");
const { OtherUserModel } = require('../model/Other.seat.model');
const { PaymentModel } = require("../model/payment.model");
const { SeatModel } = require("../model/seat.model");
const TicketRouter = express.Router()
const { BookingModel } = require("../model/booking.model");
const { UserAuthentication } = require("../middleware/Authentication");
const { UserModel } = require("../model/user.model");
const { OtpModel } = require("../model/otp.model");
const otpGenerator = require('otp-generator')

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

    // Changing Seat Status in Seat Model     
    const seatdetails = await SeatModel.find({ pnr: pnr, tripId: tripId })

    let bulkwriteseat = []
    for (let index = 0; index < seatdetails.length; index++) {
        if (cancelticket.includes(seatdetails[index].seatNumber) && (seatdetails[index].tripId === tripId) && (seatdetails[index].pnr === pnr)) {
            bulkwriteseat.push({
                updateOne: {
                    filter: { pnr: pnr, seatNumber: seatdetails[index].seatNumber, tripId: seatdetails[index].tripId },         // condition to match first document
                    update: { $set: { "details.status": "Refunded" } }
                }
            })
        }
    }

    try {
        await SeatModel.bulkWrite(bulkwriteseat)
    } catch (error) {
        res.json({ status: "error", message: `Failed To Bulk Update Seat Detail's ${error.message}` })
    }

    // Getting Trip Details Like JourNey Data & Ticket Cost
    const tripdetails = await TripModel.find({ _id: ticketdetails[0].tripId })
    ticketcost = tripdetails[0].price;
    let bookedseats = tripdetails[0].seatsbooked;
    journeytime = new Date(`${tripdetails[0].journeystartdate}T${tripdetails[0].starttime}:00`)
    let newseats = bookedseats.filter(seat => !cancelticket.includes(seat));

    tripdetails[0].seatsbooked = newseats;
    tripdetails[0].bookedseats = newseats.length;
    tripdetails[0].availableseats = tripdetails[0].totalseats - newseats.length

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

        let ticketcanceltemplate = path.join(__dirname, "../emailtemplate/gmrticketcancel.ejs")
        ejs.renderFile(ticketcanceltemplate, { user: ticketdetails[0].primaryuser, pnr: pnr, seat: seat, trip: tripdetails[0], payment: paymentdetails[0], amount: refundamount }, function (err, template) {
            if (err) {
                res.json({ status: "error", message: err.message })
            } else {
                const mailOptions = {
                    from: process.env.emailuser,
                    to: `${user.email}`,
                    subject: `Booking Cancellation, Bus: ${tripdetails[0].busid}, ${tripdetails[0].journeystartdate}, ${tripdetails[0].from} - ${tripdetails[0].to}`,
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

TicketRouter.get("/history", UserAuthentication, async (req, res) => {
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

            if (upcomingtrips.length >= 1) {
                res.json({ status: "success", data: upcomingtrips })
            } else {
                res.json({ status: "error", message: `No Upcoming Trip's Found For Today's Booking` })
            }
        }
    } catch (error) {
        res.json({ status: "error", message: `Error Found in Trip History Details ${error.message}` })
    }
})

TicketRouter.get("/upcoming", UserAuthentication, async (req, res) => {
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

            if (upcomingtrips.length >= 1) {
                res.json({ status: "success", data: upcomingtrips })
            } else {
                res.json({ status: "error", message: `No Upcoming Trip's Found For Today's Booking` })
            }
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
    const seatdetails = await SeatModel.find({ pnr: pnr, "details.status": "Confirmed" })

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
})


TicketRouter.post("/otp/generate", async (req, res) => {
    const { pnr, tripId, seatNumbers } = req.body
    let seats = [];
    let emails = [];
    const otpExists = await OtpModel.find({ pnr: pnr, tripId: tripId })
    const randomOtp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })


    if (otpExists) {
        for (let index = 0; index < otpExists.length; index++) {
            seats.push(...otpExists[index].seatNumbers)
        }
    }

    const hasCommonValues = seatNumbers.some(value => seats.includes(value));

    if (hasCommonValues) {
        return res.json({ status: "error", message: `Otp Already Generated For Following Seat which Assigned To Following PNR. Please Try After Some Time !!` })
    }


    const bookedSeats = await SeatModel.find({ pnr: pnr, tripId: tripId, seatNumber: { $in: seatNumbers }, "details.status": "Confirmed" })

    if (bookedSeats.length === 0) {
        return res.json({ status: "error", message: `NO Confirmed Seat Found Which Is Assigned To Following PNR OR TRIPID !!` })
    }


    for (let index = 0; index < bookedSeats.length; index++) {
        if (emails.includes(bookedSeats[index].details.email) === false) {
            emails.push(bookedSeats[index].details.email)
        }
    }

    try {
        const newOtp = new OtpModel({
            pnr, tripId, seatNumbers, otp: randomOtp,
            expireAt: Date.now() + 15 * 60 * 1000, // Lock for 5 minutes
        })
        await newOtp.save()
    } catch (error) {
        return res.json({ status: "error", message: `Unable To Generate New OTP For Ticket Management of Guest ${error.message}` })
    }

    let guestmanagebookingoptverification = path.join(__dirname, "../emailtemplate/guestmanagebookingoptverification.ejs")
    ejs.renderFile(guestmanagebookingoptverification, { otp: randomOtp }, function (err, template) {
        if (err) {
            res.json({ status: "error", message: err.message })
        } else {
            const mailOptions = {
                from: process.env.emailuser,
                to: `${emails}`,
                subject: `OTP Verification For, Booking Cancellation on AIRPAX`,
                html: template
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Error in Sending Mail ", error.message);
                    return res.json({ status: "error", message: 'Failed to send email' });
                } else {
                    console.log("Email Sent ", info);
                    return res.json({ status: "success", message: 'Please Check Your Email & Verifiy OTP Within 5 Minutes', redirect: "/" });
                }
            })
        }
    })
})

TicketRouter.post("/cancel/guest", async (req, res) => {
    const { pnr, tripId, seatNumbers, bookingId, reasonForCancellation, otp } = req.body
    let seatsbooked = [];
    let emails = [];
    let hasAllSeats = true;
    const otpExists = await OtpModel.find({ pnr: pnr, tripId: tripId, otp: otp })

    if (otpExists.length !== 0) {
        for (let index = 0; index < otpExists.length; index++) {
            seatsbooked.push(...otpExists[index].seatNumbers)
        }
    } else {
        return res.json({ status: "error", message: "OTP Not Verified" })
    }
    for (let index = 0; index < seatsbooked.length; index++) {
        if (seatNumbers.includes(seatsbooked[index]) === false) {
            hasAllSeats = false
        }

    }
    const hasCommonValues = seatNumbers.some(value => seatsbooked.includes(value));

    if (hasCommonValues === false) {
        return res.json({ status: "error", message: `Please Check Seat Number's For Which You are making a request for ticket cancellation. !!` })
    }

    const bookedSeats = await SeatModel.find({ pnr: pnr, tripId: tripId, seatNumber: { $in: seatNumbers }, "details.status": "Confirmed" })

    if (bookedSeats.length === 0) {
        res.json({ status: "error", message: `NO Confirmed Seat Found Which Is Assigned To Following PNR OR TRIPID !!` })
    }


    for (let index = 0; index < bookedSeats.length; index++) {
        if (emails.includes(bookedSeats[index].details.email) === false) {
            emails.push(bookedSeats[index].details.email)
        }
    }

    const bookingdetails = await BookingModel.find({ _id: bookingId, pnr: pnr })

    // Update Booking Details
    if (!bookingdetails) {
        return res.json({ status: "error", message: "No Booking Detail's Found" })
    }
    let bookingstatus = "Cancelled"

    if (bookingdetails[0].seats.length !== seatNumbers.length) {
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
    const seatdetails = await SeatModel.find({ pnr: pnr, "details.status": "Confirmed", tripId: tripId })

    // Getting Total Amount Paid By the User For Booking Tickets Which he want to cancel right now 
    let totalamount = 0;
    let bulkwriteseat = [];
    let seatstoberemoved = [];
    let cancelledSeats = [];

    
    
    
    for (let index = 0; index < seatdetails.length; index++) {
        for (let i = 0; i < seatNumbers.length; i++) {
            console.log(seatNumbers[i]);
            if ((seatdetails[index].seatNumber == seatNumbers[i])) {
                console.log("reached here ",seatdetails[index].seatNumber);
                console.log(seatNumbers[i]);

                
                totalamount += seatdetails[index].details.amount;
                seatstoberemoved.push(seatNumbers[i])
                cancelledSeats.push(seatdetails[index])
                bulkwriteseat.push({
                    updateOne: {
                        filter: { pnr: pnr, seatNumber: seatNumbers[i], tripId: tripId },         // condition to match first document
                        update: { $set: { "details.status": "Refunded" } }
                    }
                })
            }

        }
    }

    try {
        await SeatModel.bulkWrite(bulkwriteseat)
    } catch (error) {
        return res.json({ status: "error", message: "Bulk Update Seat Process Failed " })
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
        return res.json({ status: "error", message: "Ticket Cancellation Process Failed " })
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
            return res.json({ status: "error", message: "Failed To Save Refund Amount For this Pnr " })
        }
    }
    let cancelTicket = path.join(__dirname, "../emailtemplate/guestcancelTicket.ejs")
    ejs.renderFile(cancelTicket, { user:"Sir/Madam", seat: cancelledSeats, trip: tripdetails[0], amount: paymentdetails[0].refundamount, pnr: pnr, reason: reasonForCancellation }, function (err, template) {
        if (err) {
            res.json({ status: "error", message: err.message })
        } else {
            const mailOptions = {
                from: process.env.emailuser,
                to: `${emails}`,
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
})


module.exports = { TicketRouter } 