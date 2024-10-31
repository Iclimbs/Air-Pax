import SearchRoute from '@/components/SearchRoute';
import { UserContext } from '@/context/UserContext';
import SeatLayout from '@/widgets/layout/seatLayout';
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const TicketBooking = () => {
    const { user, getUser } = useContext(UserContext);
    const params = useParams()
    const [data, setData] = useState([]); // Save A Particular Trip Data
    const [userData, setUserData] = useState([]); // Save All User's Data for which ticket will be booked
    const [totalSeats, settotalSeats] = useState(0);
    const [availableseats, setavailableseats] = useState(0);
    const [seatprices, setSeatPrices] = useState(0);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [bookedSeats, setbookedSeats] = useState([]);
    
    const handleChange = (e, i) => {
      const { name, value } = e.target;
      const onchangeValue = [...userData];
      onchangeValue[i][name] = value;
      setUserData(onchangeValue);
    };
  
    const handleSeatClick = (seatNumber) => {
      if (selectedSeats.includes(seatNumber)) {
        setSelectedSeats(selectedSeats.filter((Seat) => Seat !== seatNumber));
        setUserData(userData.filter((item) => item.seatno !== seatNumber));
      } else {
        if (selectedSeats.length < 10) {
          setSelectedSeats([...selectedSeats, seatNumber]);
          setUserData([
            ...userData,
            { fname: "", lname: "", age: "", gender: "", seatno: seatNumber },
          ]);
        } else {
          alert("You Can Only Select a maximum of 10 seats");
        }
      }
    };
  
    useEffect(() => {
      getUser();
      fetch(
        `https://air-pax.onrender.com/api/v1/trip/detailone/${params.id}`
      )
        .then((res) => res.json())
        .then((res) => {
          setData(res.data);
          settotalSeats(res.data[0].totalseats);
          setavailableseats(res.data[0].availableseats);
          setSeatPrices(res.data[0].price);
          setbookedSeats(res.data[0].seatsbooked);
        })
        .catch((err) => console.log(err));
    }, []);
  
    // const handleSubmit = (event) => {
    //   event.preventDefault();
    //   const payload = {
    //     userdetails:user,
    //     passengerdetails:userData,
    //     tripId:params.id
  
    //   }
    //   fetch(`https://air-pax.onrender.com/api/v1/seat/selectedseats`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
  
    //     },
    //     body: JSON.stringify(payload),
    //   })
    //     .then((response) => response.json())
    //     .then((data) => {
    //       if (data.status == "success") {
    //         console.log("bookTicket", data);
    //         // localStorage.setItem("token", JSON.stringify(data.token))
    //         // navigate("/");
    //       } else {
    //         console.log("bookTicket", data);
    //         // toast.error(data.message);
    //       }
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //       // toast.error("An error occurred. Please try again later.");
    //     });
  
    // };
  return (
    <div>
         {/* <div className="py-10 w-full lg:px-8 px-5 bg-[#171717] rounded-lg lg:w-2/33 text-white">
            <SeatLayout
              bookedSeats={bookedSeats}
              totalSeats={totalSeats}
              seatprices={seatprices}
              selectedSeats={selectedSeats}
              handleSeatClick={handleSeatClick}
            />

            <form className="flex flex-col mt-8" onSubmit={handleSubmit}>
              <div>
                <p className="text-secondaryText font-heading text-xl pt-5">
                  User Contact Details
                </p>
                <div className="flex flex-wrap ">
                  <div className="w-full md:w-1/2 md:pr-4 mb-4 md:mb-0 ">
                    <div className="">
                      <label className="block mt-6 mb-2 text-xl" htmlFor="name">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="userfname"
                        className="w-full p-2 border border-white rounded-lg bg-[#171717]"
                        placeholder="Enter your name"
                        required
                        value={user?.name.split(" ")[0]}
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 md:pl-4">
                    <div className="mt-6 ">
                      <label className="block text-xl mb-2" htmlFor="lastName">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="userlname"
                        className="w-full p-2 border border-white rounded-lg bg-[#171717]"
                        placeholder="Enter your last name"
                        required
                        value={user?.name.split(" ")[1]}
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2  ">
                    <div className="mt-6 ">
                      <label className="block text-xl mb-2" htmlFor="lastName">
                        User Contact Number
                      </label>
                      <input
                        type="tel"
                        id="usercontactnumber"
                        className="w-full p-2 border border-white rounded-lg bg-[#171717]"
                        placeholder="Enter your Contact Number"
                        required
                        value={user?.phoneno}
                      />
                    </div>
                  </div>
                  
                </div>
              </div>
              <p className="text-secondaryText font-heading text-xl pt-5">
                Passenger Details
              </p>
              <div className="flex flex-wrap ">
                {userData?.map((val, i) => (
                  <div
                    className="border-b border-b-slate-700 grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-8 w-full  md:pr-4 mb-4 md:mb-0 "
                    key={i}
                  >
                    <div className="mb-4">
                      <label className="block mt-8 mb-2 text-xl" htmlFor="name">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="fname"
                        value={val.fname}
                        onChange={(e) => handleChange(e, i)}
                        className="w-full p-2 border border-white rounded-lg bg-[#171717]"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div className="">
                      <label
                        className="block mt-8 text-xl  mb-2"
                        htmlFor="lastName"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lname"
                        value={val.lname}
                        onChange={(e) => handleChange(e, i)}
                        className="w-full p-2 border border-white rounded-lg bg-[#171717]"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block mb-2 text-xl" htmlFor="age">
                        Selected Seat
                      </label>
                      <input
                        type="text"
                        name="seatno"
                        value={val.seatno}
                        readOnly
                        className="w-full p-2 border border-white rounded-lg bg-[#171717]"
                        placeholder="Enter your age"
                        required
                      />
                    </div>
                    <div className="mb-4 ">
                      <label className="block pb-2 text-xl" htmlFor="age">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={val.age}
                        onChange={(e) => handleChange(e, i)}
                        className="w-full p-2 border border-white rounded-lg bg-[#171717]"
                        placeholder="Enter your age"
                        required
                      />
                    </div>
                    <div className="mb-4 ">
                      <label className="block pb-2 text-xl ">Gender</label>
                      <select
                        name="gender"
                        value={val.gender}
                        onChange={(e) => handleChange(e, i)}
                        className=" rounded-lg bg-cardBackground border w-full py-2 px-2"
                        required
                      >
                        <option value="">Please Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other's</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="text-black px-3 py-2 mt-6 bg-primary rounded-lg w-1/3 "
                type="submit"
              >
                Submit
              </button>
            </form>
          </div> */}
          <SearchRoute/>
    </div>
  )
}

export default TicketBooking