require('dotenv').config()
const express = require("express")
const PaymentGateway = express.Router()
const ccav = require("../payment/ccavutil")
const qs = require('querystring');
const crypto = require('node:crypto');


const merchantId = process.env.MID;
const accessCode = process.env.access_code;
const workingKey = process.env.Working_key; // Replace with your CCAvenue working key
const ccavenueUrl = 'https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction';

PaymentGateway.post("/payment-status", async (req, res) => {
    const { encResp, orderNo, accessCode } = req.body
    let md5 = crypto.createHash('md5').update(workingKey).digest();
    let keyBase64 = Buffer.from(md5).toString('base64');

    //Initializing Vector and then convert in base64 string
    let ivBase64 = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]).toString('base64');
    let ccavEncResponse = "";
    let ccavPOST = "";
    req.on('data', function (data) {
        ccavEncResponse += data;
        ccavPOST = qs.parse(ccavEncResponse);
        let encryption = ccavPOST.encResp;
        ccavResponse = ccav.decrypt(encryption, keyBase64, ivBase64);
    });

    req.on('end', function () {
		var pData = '';
		pData = '<table border=1 cellspacing=2 cellpadding=2><tr><td>'
		pData = pData + ccavResponse.replace(/=/gi, '</td><td>')
		pData = pData.replace(/&/gi, '</td></tr><tr><td>')
		pData = pData + '</td></tr></table>'
		htmlcode = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Response Handler</title></head><body><center><font size="4" color="blue"><b>Response Page</b></font><br>' + pData + '</center><br></body></html>';
		res.writeHeader(200, { "Content-Type": "text/html" });
		res.write(htmlcode);
		res.end();
	});

})
module.exports = { PaymentGateway }

// py73gwlx8d