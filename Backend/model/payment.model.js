const mongoose = require("mongoose");
const PaymentSchema = mongoose.Schema({
    seatNumber: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    lockExpires: Date,
    tripId: {
        type: String,
        required: true
    },
    bookedby: {
        type: String,
        required: true
    },
    details: {
        fname: String,
        lname: String,
        age: Number,
        gender: String
    },
    pnr: String,
    userid: String,
    amount: Number,
    paymentstatus: {
        pending: {
            type: Boolean,
            default: true
        },
        complete: {
            type: Boolean,
            default: false
        },
        failure:{
            type:Boolean,
            default:false
        },
        refund:{
            type:Boolean,
            default:false
        }
    },
    refundamount:Number,
    CreatedAt: { type: Date, default: Date.now },
});
const PaymentModel = mongoose.model("Payment", PaymentSchema)
module.exports = { PaymentModel };