// Code From Webiste 
const accountSid = 'AC47fea7b1829c0cf69582718e25cdbfc2';
const authToken = '[AuthToken]';
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'Testing working ',
        from: '+12406502479',
        to: '+18777804236'
    })
    .then(message => console.log(message.sid));

// Account Details :- 
    
// Account SID :- AC47fea7b1829c0cf69582718e25cdbfc2

// Auth Token :-  b57ce468f4ee491d082bb95654624944

// My Twilio phone number :- +12406502479


// Working Code 
// const accountSid = process.env.Account_sid;
// const authToken = process.env.Account_token;
// const client = require('twilio')(accountSid,authToken)
// const sendSMS = async ()=>{
//     let smsOptions = {
//         from:process.env.phoneno,
//         to:process.env.sendno,
//         body:"Testing SMS SERVICE WITH TWILIO"
//     }
//     try {
//         const message = await client.messages.create(smsOptions);
//         console.log(message)
//     } catch (error) {
//         console.log(error)
        
//     }
// } 