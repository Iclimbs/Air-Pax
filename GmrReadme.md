SEAT BOOKING FOR GMR

Link :- http://localhost:4500/api/v1/new/seat/selectedseats

Payload :- 
{
  "PrimaryUser": {
    "Name": "Uttam Kumar",
    "Email": "uttamkr5599@gmail.com",
    "PhoneNo": 9091390251
  },
  "PassengerDetails": [
    {
      "Fname": "sdas",
      "Lname": "sads",
      "Gender": "Female", 
      "Age": 22,
      "PhoneNo": 7898789878,
      "Email": "adwq@gmail.com",
      "Country": "1",
      "SeatNo": "1B"
    },
    {
      "Fname": "addsd",
      "Lname": "sads",
      "Gender": "Male",
      "Age": 44,
      "PhoneNo": 7876787657,
      "Email": "adwsq@gmail.com",
      "Country": "1",
      "SeatNo": "2B"
    }
  ],
  "TripId": "6700e3e708ce3ed7c91b5824",
  "BookingRefId": "TH638628903213",
  "Amount": 3171.84
}

PAYMENT SUCCESS FOR GMR
Payment Success :- http://localhost:4500/api/v1/new/payment/success?pnr=9huqbkb1rt&ref=TH6386303864207&method=mastercard

PAYMENT FAILURE FOR GMR
Payment Failure :- http://localhost:4500/api/v1/new/payment/failure?pnr=4bry6avzzt&ref=TH638633814237&method=razorpay


PNR STATUS FOR GMR
PNR STATUS :- http://localhost:4500/api/v1/pnr/gmr/:pnr


TICKET CANCELLATION FOR GMR
TICKET CANCEL :- http://localhost:4500/api/v1/ticket/gmr/cancel
Paylod :- {
"tripId": "66f1197ca1d4b90b144cd945",
"bookingRefId": "422",
"pnr": "jcr46ebaj2",
"cancelticket": ["2B","2A"]
}
