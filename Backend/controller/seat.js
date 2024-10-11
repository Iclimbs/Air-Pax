require('dotenv').config()
const express = require("express")
const generateUniqueId = require('generate-unique-id');
const { SeatModel } = require("../model/seat.model")
const { TripModel } = require("../model/trip.model");
const { PaymentModel } = require('../model/payment.model');
const SeatRouter = express.Router();
const ccav = require("../payment/ccavutil")
const crypto = require('node:crypto');
const jwt = require('jsonwebtoken')


SeatRouter.post("/selectedseats", async (req, res) => {
    const { userdetails, passengerdetails, tripId, amount } = req.body
    const ticketpnr = generateUniqueId({
        length: 10,
        useLetters: true,
        useNumbers: true
    });
    let seats = [] // All the Seats Passenger Detail's For Which User is Applying to Book 
    let seatdetails = [] // All the Details of the Passenger's 
    for (let index = 0; index < passengerdetails.length; index++) {
        seats.push(passengerdetails[index].seatno)
        seatdetails.push({
            seatNumber: passengerdetails[index].seatno, isLocked: true, tripId: tripId, bookedby: userdetails._id,
            lockExpires: Date.now() + 15 * 60 * 1000, // Lock for 20 minutes
            pnr: ticketpnr,
            details: { fname: passengerdetails[index].fname, lname: passengerdetails[index].lname, age: passengerdetails[index].age, gender: passengerdetails[index].gender }
        })
    }
    const trip = await TripModel.find({ _id: tripId })
    let bookedseats = trip[0].seatsbooked;
    let alreadyexist = false;
    let alreadyexistseats = []; //check the list of Seat's whose seats are already booked. 

    for (let index = 0; index < seats.length; index++) {
        if (bookedseats.includes(seats[index])) {
            alreadyexistseats.push(seats[index])
            alreadyexist = true;
        }
    }
    if (alreadyexist) {
        return res.json({ status: "error", message: "Some Seat's Are Already Booked Please Select Any Other Seat", seats: alreadyexistseats })
    } else {
        let new_seatsbooked = bookedseats.concat(seats)
        trip[0].seatsbooked = new_seatsbooked
        trip[0].availableseats = trip[0].availableseats - seats.length
        trip[0].bookedseats = new_seatsbooked.length
        try {
            await trip[0].save();
        } catch (error) {
            return res.json({ status: "error", message: "Failed To Lock Seats in The Trip" })
        }
        try {
            const paymentdetails = new PaymentModel({ pnr: ticketpnr, userid: userdetails._id, amount: amount })
            await paymentdetails.save()
        } catch (error) {
            return res.json({ status: "error", message: "Failed To Added Payment Details" })

        }
        try {
            const result = await SeatModel.insertMany(seatdetails);
        } catch (error) {
            return res.json({ status: "error", message: "Failed To Added Seat Details" })
        }
        const data = {
            tid: new Date().getTime(),
            merchant_id: process.env.MID,
            order_id: ticketpnr,
            currency: "INR",
            total_amount: amount,
            redirect_url: process.env.success_url,
            cancel_url: `https://airpax.co/payment/failure/${ticketpnr}`,
            language: "EN"
        };

        const code = process.env.access_code;
        const workingKey = process.env.Working_key;
        const ccavenueUrl = process.env.url;
        let md5 = crypto.createHash('md5').update(workingKey).digest();
        let keyBase64 = Buffer.from(md5).toString('base64');

        //Initializing Vector and then convert in base64 string
        let ivBase64 = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]).toString('base64');
        let body = `tid=${data.tid}&merchant_id=${data.merchant_id}&order_id=${data.order_id}&amount=${data.total_amount}&currency=INR&redirect_url=${process.env.success_url}&cancel_url=${process.env.failure_url}${data.order_id}&language=EN`

        let encryptedData = ccav.encrypt(body, keyBase64, ivBase64);

        return res.json({
            status: "success",
            data: {
                encryptedData,
                code,
                ccavenueUrl
            }
        });
    }
})

// Get List of All the Seat's Booked Till Now Only For Admin
SeatRouter.get("/listall", async (req, res) => {
    try {
        const seatlist = await SeatModel.find({})
        res.json({ status: "success", data: seatlist })
    } catch (error) {
        res.json({ status: "error", message: "Failed To Get Booked Ticket List" })
    }
})

// Get List of All the Incoming Seat Bookings From that particular period of TIme Only For the User
SeatRouter.get("/list/booked/incoming", async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, 'Authentication')
    try {
        const seatlist = await SeatModel.find({ isBooked: true, bookedby: decoded._id }, {})
        res.json({ status: "success", data: seatlist })
    } catch (error) {
        res.json({ status: "error", message: "Failed To Get Booked Ticket List" })
    }
})

// Get List of All the Seat's Booked Till Now By the User
SeatRouter.get("/list/booked/history", async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, 'Authentication')
    try {
        const seatlist = await SeatModel.find({ isBooked: true, bookedby: decoded._id }, { isBooked: 0, isLocked: 0, lockExpires: 0, bookedby: 0 })
        res.json({ status: "success", data: seatlist })
    } catch (error) {
        res.json({ status: "error", message: "Failed To Get Booked Ticket List" })

    }
})



// Get List of All the Detail's Of a particular Seat's Booked By the User
SeatRouter.get("/list/booked/:id", async (req, res) => {
    try {
        const seatlist = await SeatModel.find({})
        res.json({ status: "success", data: seatlist })
    } catch (error) {
        res.json({ status: "error", message: "Failed To Get Booked Ticket List" })

    }
})

module.exports = { SeatRouter }
