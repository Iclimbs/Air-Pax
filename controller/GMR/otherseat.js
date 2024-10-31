require('dotenv').config()
const express = require("express")
const generateUniqueId = require('generate-unique-id');
const { SeatModel } = require("../../model/seat.model")
const { TripModel } = require("../../model/trip.model")
const { OtherUserModel } = require("../../model/Other.seat.model");
const { PaymentModel } = require('../../model/payment.model');
const OtherSeatRouter = express.Router()

OtherSeatRouter.post("/selectedseats", async (req, res) => {
    const { PrimaryUser, PassengerDetails, TripId, BookingRefId, Amount } = req.body
    const ticketpnr = generateUniqueId({
        length: 10,
        useLetters: true,
        useNumbers: true
    });
    let seats = [] // All the Seats Passenger Detail's For Which User is Applying to Book 
    let seatdetails = [] // All the Details of the Passenger's 

    for (let index = 0; index < PassengerDetails.length; index++) {
        seats.push(PassengerDetails[index].SeatNo)
        seatdetails.push({
            seatNumber: PassengerDetails[index].SeatNo, isLocked: true, tripId: TripId, bookedby: PrimaryUser.PhoneNo,
            lockExpires: Date.now() + 20 * 60 * 1000, // Lock for 20 minutes
            pnr: ticketpnr,
            details: { fname: PassengerDetails[index].Fname, lname: PassengerDetails[index].Lname, age: PassengerDetails[index].Age, gender: PassengerDetails[index].Gender, phoneno: PassengerDetails[index].PhoneNo, email: PassengerDetails[index].Email, country: PassengerDetails[index].Country, seatno: PassengerDetails[index].SeatNo }
        })
    }
    const trip = await TripModel.find({ _id: TripId })
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
        const newticket = new OtherUserModel({
            primaryuser: { name: PrimaryUser.Name, phoneno: PrimaryUser.PhoneNo, email: PrimaryUser.Email },
            passengerdetails: PassengerDetails,
            tripId: TripId,
            bookingRefId: BookingRefId,
            amount: Amount,
            pnr: ticketpnr
        })
        try {
            await newticket.save()
        } catch (error) {
            console.log(error);
            res.json({ status: "error", message: `Failed To Save Details ${error.message}` })

        }
        let new_seatsbooked = bookedseats.concat(seats)
        trip[0].seatsbooked = new_seatsbooked
        trip[0].availableseats = trip[0].availableseats - seats.length
        trip[0].bookedseats = new_seatsbooked.length
        await trip[0].save();
        const result = await SeatModel.insertMany(seatdetails);
        const payment = new PaymentModel({
            pnr: ticketpnr,
            userid: PrimaryUser.PhoneNo,
            amount: Amount,
        })
        try {
            await payment.save()
        } catch (error) {
            res.json({ status: "error", message: `Failed To Save Details ${error.message}` })

        }
        return res.json({ status: "success", pnr: ticketpnr })
    }
})

module.exports = { OtherSeatRouter }
