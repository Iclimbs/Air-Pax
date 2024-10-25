import { useContext, useEffect, useState } from "react";
import HeroBanner from "../../components/Common/HeroBanner";
import { UserContext } from '@/context/UserContext';
import { useParams } from "react-router-dom";
import Food from "../../components/Booking/Food";
import Payement from "../../components/Booking/Payement";
import BusDetails from "../../components/Booking/BusDetails";
import { toast } from "react-hot-toast"
import AboveFooter from "../../components/Common/AboveFooter";
import Footer from "../../components/Common/Footer";
import SeatLayout from "@/widgets/layout/seatLayout";


const Ticket = () => {
  const { user, getUser } = useContext(UserContext);
  const params = useParams();
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [totalSeats, settotalSeats] = useState(0);
  const [seatprices, setSeatPrices] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]); // List of Seat's Selected By the User For Booking
  const [bookedSeats, setbookedSeats] = useState([]);
  const [total_price, setTotal_price] = useState(0);
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    let totalcost = userData.reduce((total, item) => item.amount + total, 0)
    setTotal_price(totalcost)
    getData();
  }, [userData]);
  // Function to calculate total price

  // Handle Value change in Passenger Detail's Form 
  const handleChange = (e, i) => {
    const { name, value } = e.target;
    const onchangeValue = [...userData];
    onchangeValue[i][name] = value;
    setUserData(onchangeValue);
  };

  // Updating Food Quantity 
  const updateFoodQuantity = (passengerid, foodName, quantity, price) => {
    setUserData(userData.map((passenger, index) => {
      if (index === passengerid) {
        const foodItem = passenger.food.find(item => item.name === foodName);
        // let foodprice = passenger.food.map(item => item.quantity + item.price)
        let foodprice = passenger.food.reduce((total, item) => item.quantity * item.price + total, 0)
        let latestprice = foodprice + (quantity * Number(price)) + seatprices;
        if (foodItem) {
          // Remove the food item if quantity is 0, otherwise update the quantity
          const newQuantity = foodItem.quantity + quantity;
          return {
            ...passenger,
            amount: latestprice,
            food: quantity === 0
              ? passenger.food.filter(item => item.name !== foodName)
              : passenger.food.map(item =>
                item.name === foodName ? { ...item, quantity: newQuantity } : item
              )
          };
        } else {
          return quantity > 0 ? {
            ...passenger,
            amount: latestprice,
            food: [...passenger.food, { name: foodName, quantity, price: Number(price) }]
          } : passenger;
        }
      }
      return passenger;
    }));
  };

  const clearFood = (index) => {
    setUserData(userData.map((passenger, i) => (
      (index === i) ? { ...passenger, amount: 1200, food: [] } :passenger
  )))
  }

// Api Call to get the List of all Food Item's 
const getData = async () => {
  try {
    const response = await fetch(
      `http://localhost:4500/api/v1/food/listall/active`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      toast.error(response.status)
    }

    const result = await response.json();

    // Add a quantity field to each food item with an initial value of 0
    const updatedMenu = result.data.map((item) => ({
      ...item,
      quantity: 0,
    }));
    setMenuData(updatedMenu);
  } catch (err) {
    toast.error(err.message)
  }
};

// show food selected

const handleSeatClick = (seatNumber) => {
  if (selectedSeats.includes(seatNumber)) {
    setSelectedSeats(selectedSeats.filter((Seat) => Seat !== seatNumber));
    setUserData(userData.filter((item) => item.seatno !== seatNumber));
  } else {
    if (selectedSeats.length < 8) {
      setSelectedSeats([...selectedSeats, seatNumber]);
      setUserData([
        ...userData,
        {
          fname: "",
          lname: "",
          age: "",
          gender: "",
          seatno: seatNumber,
          food: [],
          amount: seatprices
        },
      ]);
    } else {
      toast.error("You Can Only Select a maximum of 8 seats")
    }
  }
};

// Getting Detail's Of A Particular Trip 
useEffect(() => {
  getUser();
  fetch(`http://localhost:4500/api/v1/trip/detailone/${params.id}`)
    .then((res) => res.json())
    .then((res) => {
      setData(res.data);
      settotalSeats(res.data[0].totalseats);
      setSeatPrices(res.data[0].price);
      setbookedSeats(res.data[0].seatsbooked);
    })
    .catch((err) => toast.error(err.message))
}, []);

const handleSubmit = (event) => {
  event.preventDefault();
  if (userData.length == 0) {
    return toast.error("Please Select Atleast One Seat");
  }
  const payload = {
    userdetails: user,
    passengerdetails: userData,
    tripId: params.id,
    totalamount: total_price,
  };
  fetch(`http://localhost:4500/api/v1/seat/selectedseats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status == "success") {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.data.ccavenueUrl;

        const encRequestInput = document.createElement("input");
        encRequestInput.type = "hidden";
        encRequestInput.name = "encRequest";
        encRequestInput.value = data.data.encryptedData;

        const accessCodeInput = document.createElement("input");
        accessCodeInput.type = "hidden";
        accessCodeInput.name = "access_code";
        accessCodeInput.value = data.data.code;

        form.appendChild(encRequestInput);
        form.appendChild(accessCodeInput);
        document.body.appendChild(form);
        form.submit(); // Automatically submit form
      } else {
        toast.error(data.message);
      }
    })
    .catch((error) => {
      toast.error(error.message);
    });
};
return (
  <>
    <Navbar />
    <div>
      <HeroBanner img={"/assets/bg.png"} title={"Book Ticket"} />
      <div className="flex xl:flex-row flex-col mx-4 lg:mx-24 gap-5 my-10">
        <div className="py-10 w-full  lg:px-8 px-5  bg-[#171717] rounded-lg lg:w-2/33">
          <SeatLayout
            bookedSeats={bookedSeats}
            totalSeats={totalSeats}
            seatprices={seatprices}
            selectedSeats={selectedSeats}
            handleSeatClick={handleSeatClick}
          />
          {userData.length !== 0 ?
            <form className="space-y-8 mt-2" onSubmit={handleSubmit}>
              <p className="text-secondaryText font-heading text-2xl">
                Passenger Details
              </p>
              <div className="grid gap-6">
                {userData?.map((val, i) => (
                  <div
                    key={i}
                    className={`p-6 rounded-lg shadow-lg bg-[#1c1c1c] grid lg:grid-cols-2 gap-8`}
                  >
                    <div className="space-y-4">
                      <label
                        className="block text-lg text-white"
                        htmlFor="fname"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        name="fname"
                        value={val.fname}
                        onChange={(e) => handleChange(e, i)}
                        className="w-full p-3 border border-gray-500 rounded-lg bg-[#2a2a2a] text-white"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <label
                        className="block text-lg text-white"
                        htmlFor="lname"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lname"
                        value={val.lname}
                        onChange={(e) => handleChange(e, i)}
                        className="w-full p-3 border border-gray-500 rounded-lg bg-[#2a2a2a] text-white"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <label
                        className="block text-lg text-white"
                        htmlFor="seatno"
                      >
                        Selected Seat
                      </label>
                      <input
                        type="text"
                        name="seatno"
                        value={val.seatno}
                        readOnly
                        className="w-full p-3 border border-gray-500 rounded-lg bg-[#2a2a2a] text-white"
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-lg text-white" htmlFor="age">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={val.age}
                        onChange={(e) => handleChange(e, i)}
                        className="w-full p-3 border border-gray-500 rounded-lg bg-[#2a2a2a] text-white"
                        placeholder="Enter your age"
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-lg text-white">Gender</label>
                      <select
                        name="gender"
                        value={val.gender}
                        onChange={(e) => handleChange(e, i)}
                        className="w-full p-3 border border-gray-500 rounded-lg bg-[#2a2a2a] text-white"
                        required
                      >
                        <option value="">Please Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other's</option>
                      </select>
                    </div>

                    {/* <div className="space-y-4">
                        <label
                          className="block text-lg text-white"
                          htmlFor="travel_purpose"
                        >
                          Purpose of Travel
                        </label>
                        <select
                          className="w-full p-3 border border-gray-500 rounded-lg bg-[#2a2a2a] text-white"
                          name="travel_purpose"
                          onChange={(e) => handleChange(e, i)}
                        >
                          <option value="">Please Select</option>
                          <option value="Leisure">Leisure</option>
                          <option value="Business">Business</option>
                          <option value="Visiting Family & Friends">
                            Visiting Family & Friends
                          </option>
                          <option value="Govt Travel">Govt Travel</option>
                          <option value="Education">Education</option>
                          <option value="Medical">Medical</option>
                          <option value="Others">Others</option>
                        </select>
                      </div> */}

                    <Food
                      i={i}
                      val={val}
                      menuData={menuData}
                      setMenuData={setMenuData}
                      changequantity={updateFoodQuantity}
                      getData={getData}
                      clearFood={clearFood}
                    />
                  </div>
                ))}
              </div>

              <button
                className="text-white font-bold px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg w-full lg:w-1/3 md:w-1/2 mt-6 transition-colors"
                type="submit"
              >
                Pay Now
              </button>
            </form>
            : null
          }
        </div>
        <div className="xl:w-1/2 w-full space-y-3">
          <Payement data={data} total_price={total_price} userdata={userData} />
          <BusDetails />
        </div>
      </div>
    </div>
    <AboveFooter/>
    <Footer/>
  </>
);
};

export default Ticket;
