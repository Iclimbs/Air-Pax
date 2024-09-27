require('dotenv').config()
const express = require("express")
const PaymentGateway = express.Router()


const merchantId = process.env.MID;
const accessCode = process.env.access_code;
const workingKey = process.env.Working_key; // Replace with your CCAvenue working key
const ccavenueUrl = 'https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction';


PaymentGateway.post("/initiate-payment", async (req, res) => {
    // const { amount, orderId, customerDetails } = req.body;
    console.log(req.body);
    const data = {
        merchant_id:merchantId,
        order_id: 'testing',
        amount: 1,
        currency: 'INR',
        redirect_url: 'https://airpax.co/api/v1/gateway/payment-status', // Your payment status route
        cancel_url: 'https://airpax.co/api/v1/gateway/payment-cancel',
        language: 'EN',
        billing_name: 'uttam',
        billing_email: 'uttamkrshaw@iclimbs.com',
        billing_tel: 9091390251,
        billing_address: '269',
        billing_city: 'Gurugram',
        billing_state: 'Haryana',
        billing_zip: 122015,
        billing_country: 'India',
    };

    const encryptedData = encrypt(JSON.stringify(data), workingKey);

    res.json({
        encryptedData: encryptedData,
        accessCode: accessCode,
        ccavenueUrl: ccavenueUrl,
    });
})


PaymentGateway.post("/payment-status", async (req, res) => {
    const { encResp } = req.body;  // CCAvenue sends encrypted response in 'encResp'
    const decryptedData = decrypt(encResp, workingKey);

    // Process the decrypted data
    const paymentStatus = JSON.parse(decryptedData);

    if (paymentStatus.order_status === 'Success') {
        res.send('Payment Success!');
    } else {
        res.send('Payment Failed or Canceled');
    }
})
module.exports = { PaymentGateway }

// py73gwlx8d