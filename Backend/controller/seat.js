require('dotenv').config()
const express = require("express")
const generateUniqueId = require('generate-unique-id');
const { SeatModel } = require("../model/seat.model")
const { TripModel } = require("../model/trip.model");
const { PaymentModel } = require('../model/payment.model');
const SeatRouter = express.Router();
const ccav = require("../payment/ccavutil")
const crypto = require('node:crypto');


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
            lockExpires: Date.now() + 20 * 60 * 1000, // Lock for 20 minutes
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
        await trip[0].save();
        const paymentdetails = new PaymentModel({ pnr: ticketpnr, userid: userdetails._id, amount: amount })
        await paymentdetails.save()
        const result = await SeatModel.insertMany(seatdetails);
        const data = {
            tid : new Date().getTime(),
            merchant_id: "1734948",
            order_id: "123654789",
            currency: "INR",
            amount: "120",
            redirect_url: "http://localhost:5173/payment/success",
            cancel_url: "http://localhost:5173/payment/cancel",
            language: "EN"
        };

        const code = "ATKQ05LI96BY04QKYB";
        const workingKey = "474EDB6F843BA3C2D56DB27412290038";
        const ccavenueUrl = "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction";

        let md5 = crypto.createHash('md5').update(workingKey).digest();
        let keyBase64 = Buffer.from(md5).toString('base64');

        //Initializing Vector and then convert in base64 string
        let ivBase64 = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]).toString('base64');
        let body = `tid=${data.tid}&merchant_id=1734948&order_id=123654789&amount=6000.00&currency=INR&redirect_url=http%3A%2F%2Flocalhost%3A3000%success&cancel_url=http%3A%2F%2Flocalhost%3A3000%failure&language=EN`
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


module.exports = { SeatRouter }
