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

url :- 