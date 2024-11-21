require('dotenv').config()
const express = require("express")
const { SeatModel } = require('../model/seat.model')
const ReportRouter = express.Router()


// Getting Sale's Report

ReportRouter.get("/sales/daily", async (req, res) => {
    // Params :- req.query.date format :- YYYY-MM-DD
    // Url :- http://localhost:4500/api/v1/report/sales/daily?date=2024-11-21
    let startOfDay;
    let endOfDay;
    if (req.query.date) {
        startOfDay = new Date(req.query.date);
        startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00
        endOfDay = new Date(req.query.date);
        endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59    
    } else {
        startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00
        endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59    
    }
    const result = await SeatModel.aggregate([
        {
            $match: {
                CreatedAt: { $gte: startOfDay, $lte: endOfDay },
                "details.status": "Confirmed"
            },
        },
        {
            $group: {
                _id: null, // No grouping key
                totalSum: { $sum: "$details.amount" }, // Calculate the sum of the 'price' field
            },
        },
    ]);
    if (result.length > 0) {
        res.json({ status: "success", data: result })
    } else {
        res.json({ status: "error", message: "No Data Found On The Particular Date" })

    }

})

ReportRouter.get("/sales/weekly", async (req, res) => {
    // Params :- req.query.from  format :- YYYY-MM-DD && req.query.to  format :- YYYY-MM-DD
    // ?from=2024-11-13&to=2024-11-20
    // Url :- http://localhost:4500/api/v1/report/sales/weekly?from=2024-11-13&to=2024-11-21


    let endOfToday;
    let startOfWeek;

    if (req.query.from && req.query.to) {
        endOfToday = new Date(req.query.to);
        endOfToday.setHours(23, 59, 59, 999); // End of today
        startOfWeek = new Date(req.query.from);
        startOfWeek.setHours(0, 0, 0, 0); // Start of the day 7 days ago
    } else {
        endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999); // End of today
        startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - 7); // 7 days back
        startOfWeek.setHours(0, 0, 0, 0); // Start of the day 7 days ago
    }
    const result = await SeatModel.aggregate([
        {
            $match: {
                CreatedAt: { $gte: startOfWeek, $lte: endOfToday },
                "details.status": "Confirmed"
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$CreatedAt" } }, // Group by day
                totalSum: { $sum: "$details.amount" }, // Calculate the sum of the 'price' field
            },
        },
        { $sort: { _id: 1 } }, // Sort by date in ascending order
    ]);
    if (result.length > 0) {
        res.json({ status: "success", data: result })
    } else {
        res.json({ status: "error", message: "No Data Found Between Following Dates" })

    }
})

ReportRouter.get("/sales/monthly", async (req, res) => {
    // Url :- http://localhost:4500/api/v1/report/sales/monthly?month=January

    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const now = new Date();

    let startOfMonth;
    let endOfMonth;

    if (req.query.month) {
        const monthindex = month.indexOf(req.query.month)
        startOfMonth = new Date(now.getFullYear(), monthindex, 1);
        // Calculate the end of the current month (last day of the month)
        endOfMonth = new Date(now.getFullYear(), monthindex + 1, 0);

    } else {
        startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        // Calculate the end of the current month (last day of the month)
        endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    // Calculate the start of the current month (1st day of the month)

    const result = await SeatModel.aggregate([
        {
            $match: {
                CreatedAt: { $gte: startOfMonth, $lte: endOfMonth },
                "details.status": "Confirmed"
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$CreatedAt" } }, // Group by day
                totalSum: { $sum: "$details.amount" }, // Calculate the sum of the 'price' field
            },
        },
        { $sort: { _id: 1 } }, // Sort by date in ascending order

    ]);
    if (result.length > 0) {
        res.json({ status: "success", data: result })
    } else {
        res.json({ status: "error", message: "No Data Found For Following Month" })

    }
})


module.exports = { ReportRouter }