# User Signup Url :- 

url :- http://localhost:4500/api/v1/user/register

body :- {
  "name":"Uttam Kumar Shaw",
  "email":"uttamkrshaw@iclimbs.com",
  "phoneno":7209408702
}

# Response From Server

{
{
  "status": "success",
  "message": "User Registration Successful",
  "redirect": "/login",
  "token": "w7hvPq9EIGAbddGN"
}}


# Otp Verification 

url :- http://localhost:4500/api/v1/user/otp/verification

body :- {
"otp":"115767"
}

# Create Password 

url :- http://localhost:4500/api/v1/user/password

Body :- {
"password":"uttam@5599",
"cnfpassword":"uttam@5599"
}



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