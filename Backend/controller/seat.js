require('dotenv').config()
const express = require("express")
const generateUniqueId = require('generate-unique-id');
const { SeatModel } = require("../model/seat.model")
const { TripModel } = require("../model/trip.model")
const SeatRouter = express.Router()

SeatRouter.post("/selectedseats", async (req, res) => {
    const { userdetails, passengerdetails, tripId } = req.body
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
        const result = await SeatModel.insertMany(seatdetails);
        return res.json({ status: "success", pnr: ticketpnr })
    }
})

module.exports = { SeatRouter }