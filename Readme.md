# For Client End

# User Routes 

# User Login Url :- 
url :- http://localhost:4500/api/v1/user/login
Payload :-
{
   "phoneno":919091390251,
   "password":"testing"
}

Response From Server :- 
{
  "status": "success",
  "message": "Login Successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVXR0YW0gS3VtYXIgU2hhdyIsImVtYWlsIjoidXR0YW1rcnNoYXdAaWNsaW1icy5jb20iLCJwaG9uZW5vIjo5MTkwOTEzOTAyNTEsImV4cCI6MTcyNTk3NTkzOCwiaWF0IjoxNzI1OTcyMzM4fQ.CNfj5iQvgXRbuOW1LNld-DNq8GWLJ62wLpl7U6ntPyw"
}


# User Registration Url :- 

url :- http://localhost:4500/api/v1/user/register

Payload :- {
  "name":"Uttam Kumar Shaw",
  "email":"uttamkrshaw@iclimbs.com",
  "phoneno":7209408702
}

# Response From Server
{
  "status": "success",
  "message": "User Registration Successful",
  "redirect": "/login",
  "token": "w7hvPq9EIGAbddGN"
}


# Otp Verification 

url :- http://localhost:4500/api/v1/user/otp/verification

Payload :- {
"otp":"115767"
}

# Response From Server 

{ status: "success", message: "Otp Verification Successful", }

# Create Password 

url :- http://localhost:4500/api/v1/user/password

Payload :- {
"password":"uttam@5599",
"cnfpassword":"uttam@5599"
}
Token Required

# Forgot Password 

url :- http://localhost:4500/api/v1/user/forgot

Payload :- {
"phoneno":9091390251
}


# Change Password (Only works After Forgot Password)

url :- http://localhost:4500/api/v1/user/password/change

Payload :- {
"password":"uttam@5599",
"cnfpassword":"uttam@5599"
}
Token & Otp  Required in Headers (these details will be received in the Mail)




# Get Basic User Detail's 
GET Request
url :- http://localhost:4500/api/v1/user/me
Token is Required 
# User End 



# Trip Start 


# Change Password (Only works After Forgot Password)

url :- http://localhost:4500/api/v1/trip/list

Payload :- {
from,
to,
date,
tickets
}
Token & Otp  Required in Headers (these details will be received in the Mail)























































































































































































































# Bus & Seat Design
BusNo :- String
BusName :- String
BusRegistrationNo :- String
Facilities List :- Array
Seat Types :- ["Side Upper", "Side Lower", "Side Middle"]
Total Seat Capacity :- 50
Seats Available :- 25
Seat Details :- {
  type:-"Side Upper",
  name:"SU1",
  price:500,
  booked:Boolean(T/F),
  userid:userid
}


# Adding Bus Details :-

http://localhost:4500/api/v1/bus/add

Payload Sample :- 

{
"busname":"Testing Bus",
"busno":"TEST123",
"registrationno":"TESTING12345",
"facilities":["Water","wifi","Special seat"],
"seat":[
  {
    "seatno":"SU1",
    "seatprice":4500,
    "booked":true,
    "userid":"UTTAM12345"
}, {
    "seatno":"SU2",
    "seatprice":4500,
    "booked":true,
    "userid":"UTTAM123"
}, {
    "seatno":"SU3",
    "seatprice":4500,
    "booked":true,
    "userid":"UTTAM1234561"
}, {
    "seatno":"SU4",
    "seatprice":4500,
    "booked":true,
    "userid":"UTTAM1234523"
}, {
    "seatno":"SU5",
    "seatprice":4500,
    "booked":true,
    "userid":"UTTAM12345121"
}, {
    "seatno":"SU6",
    "seatprice":4500,
    "booked":true,
    "userid":"UTTAM123452132"
}, {
    "seatno":"SU7",
    "seatprice":4500,
    "booked":true,
    "userid":"UTTAM12345453"
}
]
}


<!-- New -->

{
  "status": "success",
  "message": "User Registration Successful. Please Check Your Phone For OTP",
  "redirect": "/login",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUmFodWwgVGl3YXJpIiwiZW1haWwiOiJ1dHRhbWtyc2hhd0BpY2xpbWJzLmNvbSIsInBob25lbm8iOjc0Mjg5MTI3MTcsImV4cCI6MTcyNDMxMzMyMSwiaWF0IjoxNzI0MzA5NzIxfQ.RZgDWtQCvY827tJ8nqeEzasdmcm4hDnf7WJu1n2W-eM"
}


<!-- Adding New Trip Detail's -->
url:- http://localhost:4500/api/v1/trip/add
Patch
Payload 
{
    "name": "Final Testing",
    "from": "66cc357b55bcb8e0f9246a00",
    "to": "66cc5a73cea1600ee1e411ac",
    "busid": "66cd60f477c9c9b4eb7c693f",
    "journeystartdate": "2024-08-28",
    "journeyenddate": "2024-08-30",
    "starttime": "03:00",
    "endtime": "15:00",
    "totaltime": "48:00",
    "price": "4500",
    "distance": "2500",
    "totalseats": "32"
}


Testing Login Id & Password
phoneno-9091390251
password- testing

# GMR Data Model

public class PassengerModel
 {
     public string fname { get; set; }
     public string lname { get; set; }
     public string Gender { get; set; }
     public int Age { get; set; }
     public string PhoneNumber { get; set; }
     public string Email { get; set; }
     public string Country { get; set; }
     public string SeatNo { get; set; }
 }
 public class PrimaryUserModel
 {
     public string Name { get; set; }
     public string Email { get; set; }
     public string PhoneNumber { get; set; }
 }

 public class BookingModel
 {
     public PrimaryUserModel PrimaryUser { get; set; }
     public List<PassengerModel> Passengers { get; set; }
     public string TripId { get; set; }
     public string BookingRefId { get; set; }
 }

 {
primaryuser:{
    name:"Uttam Kumar",
    email:"uttamkr5599@gmail.com",
    phoneno:7209408702
},
passengerdetails:[
{
    fname:"Abhinay",
    lname:"Kumar",
    gender:"Male",
    Age:25,
    phoneno:9091390251,
    email:"abhinay@gmail.com",
    country:"India",
    seatno:"1A"
},
{
    fname:"Rahul",
    lname:"Kumar",
    gender:"Male",
    Age:25,
    phoneno:9091390252,
    email:"rahul@gmail.com",
    country:"India",
    seatno:"1B"
},
tripId:"RandomID",
bookingRefId;"RandomRefID"
]
 }



 {"PrimaryUser":{"Name":"sdas sads","Email":"adwq@gmail.com","PhoneNo":7898789878},"PassengerDetails":[{"Fname":"sdas","Lname":"sads","Gender":"Female","Age":22,"PhoneNo":7898789878,"Email":"adwq@gmail.com","Country":"1","SeatNo":"5B"},{"Fname":"addsd","Lname":"sads","Gender":"Male","Age":44,"PhoneNo":7876787657,"Email":"adwsq@gmail.com","Country":"1","SeatNo":"6B"}],"TripId":"66f1198ba1d4b90b144cd946","BookingRefId":"TH638628903213","Amount":3171.84}




 /Aprpax Payload


 {
    "userdetails": {
        "_id": "66e821d29d9f7df8028a09af",
        "name": "Uttam Kumar Shaw",
        "email": "uttamkrshaw@iclimbs.com",
        "phoneno": 917209408702,
        "exp": 1727301136,
        "iat": 1727297536
    },
    "passengerdetails": [
        {
            "fname": "Abhinay",
            "lname": "Kumar",
            "age": "25",
            "gender": "Male",
            "seatno": "6D"
        },
        {
            "fname": "Rahul",
            "lname": "Kumar",
            "age": "25",
            "gender": "Male",
            "seatno": "7D"
        }
    ],
    "tripId": "66f11995a1d4b90b144cd947"
}


