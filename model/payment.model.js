const mongoose = require("mongoose");
const PaymentSchema = mongoose.Schema({
    pnr: String,
    userid: String,
    amount: Number,
    paymentstatus: {
        type:String,
        default:"Pending"
    },
    refundamount:Number,
    refundreason:String,
    refno:String,
    method:String,
    CreatedAt: { type: Date, default: Date.now },
});
const PaymentModel = mongoose.model("Payment", PaymentSchema)
module.exports = { PaymentModel };