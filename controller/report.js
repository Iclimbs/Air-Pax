require('dotenv').config()
const express = require("express")
const { SeatModel } = require('../model/seat.model')
const { UserModel } = require('../model/user.model')
const { FoodBookingModel } = require('../model/foodbooking.model')
const ReportRouter = express.Router()

// Getting Sale's Report


ReportRouter.get("/today", async (req, res) => {

    let statisticsCardsData = [
        {
            color: "gray",
            icon: "BanknotesIcon",
            title: "Today's Sales",
            value: "",
        },
        {
            color: "gray",
            icon: "BanknotesIcon",
            title: "Today's Failed Sales",
            value: "",
        },
        {
            color: "gray",
            icon: "BanknotesIcon",
            title: "Today's Refunded Sales",
            value: "",
        },
        {
            color: "gray",
            icon: "ChartBarIcon",
            title: "Today's Registration Number's",
            value: "",
        },
        {
            color: "gray",
            icon: "ChartBarIcon",
            title: "Today's Food Booking During Travelling",
            value: "",
        },
        {
            color: "gray",
            icon: "ChartBarIcon",
            title: "Successful Payment",
            value: "",
        },
        {
            color: "gray",
            icon: "ChartBarIcon",
            title: "Failed Payment",
            value: "",
        },
        {
            color: "gray",
            icon: "ChartBarIcon",
            title: "Refunded Payment",
            value: "",
        },

    ];

    // Geting Total Amount Of Sales Done 
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59    

    const successSales = await SeatModel.aggregate([
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

    const lifetimeSuccessSales = await SeatModel.aggregate([
        {
            $match: {
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



    // Geting Total Amount Of Sales Failed 
    const lifetimeFailedSales = await SeatModel.aggregate([
        {
            $match: {
                "details.status": "Failed"
            },
        },
        {
            $group: {
                _id: null, // No grouping key
                totalSum: { $sum: "$details.amount" }, // Calculate the sum of the 'price' field
            },
        },
    ]);

    // Geting Total Amount Of Sales Failed 
    const failedSales = await SeatModel.aggregate([
        {
            $match: {
                CreatedAt: { $gte: startOfDay, $lte: endOfDay },
                "details.status": "Failed"
            },
        },
        {
            $group: {
                _id: null, // No grouping key
                totalSum: { $sum: "$details.amount" }, // Calculate the sum of the 'price' field
            },
        },
    ]);


    // Geting Total Amount Of Sales Refunded 
    const refundedSales = await SeatModel.aggregate([
        {
            $match: {
                CreatedAt: { $gte: startOfDay, $lte: endOfDay },
                "details.status": "Refunded"
            },
        },
        {
            $group: {
                _id: null, // No grouping key
                totalSum: { $sum: "$details.amount" }, // Calculate the sum of the 'price' field
            },
        },
    ]);

    // Geting Total Amount Of Sales Refunded 
    const lifetimeRefundedSales = await SeatModel.aggregate([
        {
            $match: {
                "details.status": "Refunded"
            },
        },
        {
            $group: {
                _id: null, // No grouping key
                totalSum: { $sum: "$details.amount" }, // Calculate the sum of the 'price' field
            },
        },
    ]);


    // Geting Total Number Of User's Registered Today 
    const userRegistered = await UserModel.aggregate([
        {
            $match: {
                CreatedAt: { $gte: startOfDay, $lte: endOfDay }
            },
        }
    ]);

    // Geting Total Number Of User's Registered Today 

    const unVerified = await UserModel.aggregate([
        {
            $match: {
                CreatedAt: { $gte: startOfDay, $lte: endOfDay }
            }
        }
    ]);


    // Total Food Booked Today During Travelling 
    const successFoodSales = await FoodBookingModel.aggregate([
        {
            $match: {
                CreatedAt: { $gte: startOfDay, $lte: endOfDay }
            },
        },
        {
            $group: {
                _id: null, // No grouping key
                totalSum: { $sum: "$price" }, // Calculate the sum of the 'price' field
            },
        },
    ]);



    { successSales.length !== 0 ? statisticsCardsData[0].value = `₹ ${successSales[0]?.totalSum}` : statisticsCardsData[0].value = 0 }
    { failedSales.length !== 0 ? statisticsCardsData[1].value = `₹ ${failedSales[0]?.totalSum}` : statisticsCardsData[1].value = 0 }
    { refundedSales.length !== 0 ? statisticsCardsData[2].value = `₹ ${refundedSales[0]?.totalSum}` : statisticsCardsData[2].value = 0 }
    { userRegistered.length !== 0 ? statisticsCardsData[3].value = userRegistered?.length : statisticsCardsData[3].value = 0 }
    { successFoodSales.length !== 0 ? statisticsCardsData[4].value = `₹ ${successFoodSales[0]?.totalSum}` : statisticsCardsData[4].value = 0 }
    { lifetimeSuccessSales.length !== 0 ? statisticsCardsData[5].value = `₹ ${lifetimeSuccessSales[0]?.totalSum}` : statisticsCardsData[5].value = 0 }
    { lifetimeFailedSales.length !== 0 ? statisticsCardsData[6].value = `₹ ${lifetimeFailedSales[0]?.totalSum}` : statisticsCardsData[6].value = 0 }
    { lifetimeRefundedSales.length !== 0 ? statisticsCardsData[7].value = `₹ ${lifetimeRefundedSales[0]?.totalSum}` : statisticsCardsData[7].value = 0 }
    res.json({ status: "success", data: statisticsCardsData })
})


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
    const todayResult = await SeatModel.aggregate([
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
    if (todayResult.length > 0) {
        res.json({ status: "success", data: todayResult })
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

ReportRouter.get("/sales/custom", async (req, res) => {
    // Url :- http://localhost:4500/api/v1/report/sales/monthly?month=January
    // http://localhost:4500/api/v1/report/sales/custom?from=2024-10-13&to=2024-11-13&status=Refunded
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const now = new Date();

    let start;
    let end;

    if (req.query.month) {
        const monthindex = month.indexOf(req.query.month)
        start = new Date(now.getFullYear(), monthindex, 1);
        end = new Date(now.getFullYear(), monthindex + 1, 0);
    }

    if (req.query.from && req.query.to) {
        end = new Date(req.query.to);
        end.setHours(23, 59, 59, 999); // End of today
        start = new Date(req.query.from);
        start.setHours(0, 0, 0, 0); // Start of the day
    }

    const result = await SeatModel.aggregate([
        {
            $match: {
                CreatedAt: { $gte: start, $lte: end },
                "details.status": req.query?.status
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$CreatedAt" } }, // Group by day
                totalSum: { $sum: "$details.amount" }, // Calculate the sum of the 'price' field
                records: {
                    $push: {
                        name: { $concat: ["$details.fname", " ", "$details.lname"] }, // Combine first and last name
                        age: "$details.age", // Include age
                        email: "$details.email", // Assuming "bookedby" is used as email (modify if needed)
                        gender: "$details.gender", // Include gender
                        amount: "$details.amount", // Include amount
                        mobileno: "$details.mobileno"
                    }
                }

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

ReportRouter.get("/group/age/custom", async (req, res) => {
    // Link :- http://localhost:4500/api/v1/report/group/age/custom?status=Confirmed&month=November
    // Link :- 

    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const now = new Date();

    let start;
    let end;

    if (req.query.month) {
        const monthindex = month.indexOf(req.query.month)
        start = new Date(now.getFullYear(), monthindex, 1);
        end = new Date(now.getFullYear(), monthindex + 1, 0);
    }

    if (req.query.from && req.query.to) {
        end = new Date(req.query.to);
        end.setHours(23, 59, 59, 999); // End of today
        start = new Date(req.query.from);
        start.setHours(0, 0, 0, 0); // Start of the day
    }

    const result = await SeatModel.aggregate([
        {
            $match: {
                CreatedAt: { $gte: start, $lte: end },
                "details.status": req.query?.status
            }
        },
        {
            $bucket: {
                groupBy: "$details.age", // Field to group by
                boundaries: [0, 18, 60, 100], // Define age groups: 0-17, 18-29, 30-49, 50+
                default: "Other", // Catch-all for out-of-bound ages
                output: {
                    ticketsCount: { $sum: 1 }, // Count tickets in each group
                    totalAmount: { $sum: "$details.amount" }, // Sum the ticket prices for each group
                    records: {
                        $push: {
                            name: { $concat: ["$details.fname", " ", "$details.lname"] }, // Combine first and last name
                            age: "$details.age", // Include age
                            email: "$details.email", // Assuming "bookedby" is used as email (modify if needed)
                            gender: "$details.gender", // Include gender
                            amount: "$details.amount", // Include amount
                            mobileno: "$details.mobileno"
                        }
                    }

                },
            },
        }
    ]);
    if (result.length > 0) {
        res.json({ status: "success", data: result })
    } else {
        res.json({ status: "error", message: "No Data Found For Following Month" })
    }

})


module.exports = { ReportRouter }