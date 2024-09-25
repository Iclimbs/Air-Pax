const mongoose = require("mongoose");
const PaymentSchema = mongoose.Schema({
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
    refno:String,
    method:String,
    CreatedAt: { type: Date, default: Date.now },
});
const PaymentModel = mongoose.model("Payment", PaymentSchema)
module.exports = { PaymentModel };