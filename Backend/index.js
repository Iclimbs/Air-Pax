require("dotenv").config();
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const express = require("express");
const cors = require("cors");
const path = require("path");
const connection = require("./connection/connection");
const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

// app.use("/api/v1/", require("./routes/routes"));
// Sms Service Starting 
// SMS Service With Aws Currently working Only For Registered Number With AWS
// app.get("/", function (req, res) {
//     res.send((async () => {
//         // Define parameters for the SMS message
//         const params = {
//             Message: `Your OTP code is: ${Math.random().toString().substring(2, 8)}`, // Generate a 6-digit OTP code
//             PhoneNumber: process.env.PHONE, // Recipient's phone number from environment variables
//             MessageAttributes: {
//                 'AWS.SNS.SMS.SenderID': {
//                     'DataType': 'String',
//                     'StringValue': 'String'
//                 }
//             }
//         };

//         // Create an SNS client with the specified configuration
//         const sns = new SNSClient({
//             region: process.env.REGION, // AWS region from environment variables
//             credentials: {
//                 accessKeyId: process.env.AWS_ACCESS_KEY, // AWS access key from environment variables
//                 secretAccessKey: process.env.AWS_SECRET_KEY // AWS secret key from environment variables
//             }
//         });

//         // Send the SMS message using the defined SNS client and parameters
//         await sendSMSMessage(sns, params);
//     })())
// });



// async function sendSMSMessage(sns, params) {
//     // Create a new PublishCommand with the specified parameters
//     const command = new PublishCommand(params);

//     // Send the SMS message using the SNS client and the created command
//     const message = await sns.send(command);

//     // Return the result of the message sending operation
//     return message;
// }

// Sms Service Ending 

// Sms  Service with twilio

const accountSid = process.env.Account_sid;
const authToken = process.env.Account_token;
const client = require('twilio')(accountSid,authToken)
const sendSMS = async ()=>{
    let smsOptions = {
        from:process.env.phoneno,
        to:process.env.sendno,
        body:"Testing SMS SERVICE WITH TWILIO"
    }
    try {
        const message = await client.messages.create(smsOptions);
        console.log(message)
    } catch (error) {
        console.log(error)
        
    }
} 

 app.get("/", function (req, res) {
    res.send(sendSMS())
 })

app.listen(process.env.Port, async () => {
    try {
        await connection;
        console.log(`Server is Up & Running At Port ${process.env.Port}`);
    } catch (error) {
        console.log(error);
    }
});