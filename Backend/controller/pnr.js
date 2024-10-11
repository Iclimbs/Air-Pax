const express = require("express")
const { TripModel } = require("../model/trip.model");
const { OtherUserModel } = require('../model/Other.seat.model');
const PnrRouter = express.Router()

PnrRouter.get("/gmr/:pnr", async (req, res) => {
    const { pnr } = req.params;
    let details = {};
    const ticketdetails = await OtherUserModel.find({ pnr: pnr }, { _id: 0, CreatedAt: 0 })
    if (ticketdetails.length == 0) {
        return res.json({ status: "error", message: "No Ticket Detail's Found Related to this Pnr" })
    }
    details.bookeduser = ticketdetails[0].primaryuser;
    details.bookedticket = ticketdetails[0].passengerdetails;
    const tripdetails = await TripModel.find({ _id: ticketdetails[0].tripId })
    if (tripdetails.length==0) {
        return res.json({ status: "error", message: "No Trip Detail's Found Related to this Pnr" })
    }
    details.tripId=tripdetails[0].tripId
    details.from=tripdetails[0].from;
    details.to=tripdetails[0].to;
    details.journeystartdate=tripdetails[0].journeystartdate;
    details.journeyenddate=tripdetails[0].journeyenddate;
    details.busid=tripdetails[0].busid;
    details.starttime=tripdetails[0].starttime;
    details.endtime=tripdetails[0].endtime;
    details.totaltime=tripdetails[0].totaltime;
    details.distance=tripdetails[0].distance;
    res.json({ status: "success", message: "Pnr Details Testing", details: details })
})

module.exports = { PnrRouter }