import React, { useEffect, useState } from 'react'
import { CiLocationOn, CiCalendar } from "react-icons/ci";
import BusDetails from './BusDetails'; // Make sure to import your BusDetails component

const SearchRoute = () => {
    const [stand, setStand] = useState([]);
    const [data, setData] = useState([]);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        fetch("http://localhost:4500/api/v1/counter/listall")
          .then((res) => res.json())
          .then(res => {
            console.log("stands", res.data);
            setStand(res.data);
          })
          .catch(err => {
            console.error(err);
          });
    }, []);

    const fetchData = () => {
        fetch(
          `http://localhost:4500/api/v1/trip/list?from=${from}&to=${to}&date=${date}`
        )
          .then((response) => response.json())
          .then((res) => {
            console.log("fetch", res.data);
            setData(res.data);
            setIsSubmitted(true); // Show BusDetails after fetching data
          })
          .catch((error) => {
            console.error(error.message);
          });
    };

    return (
      <div className='my-20'>
          <h2 className='text-xl text-[#013976] font-semibold'>Choose Bus</h2>
          <form onSubmit={(e) => { e.preventDefault(); fetchData(); }}>
            <div className="flex flex-col lg:flex-row justify-center gap-8 rounded-lg lg:rounded-se-full">
   
              {/* From Select */}
              <div className="border border-[#818181] p-4 flex-1 rounded-lg flex items-center gap-3 ">
                <CiLocationOn className="text-4xl" />
                <div className="w-full">
                  <label className="text-lg font-heading text-secondaryText">
                    From
                  </label>
                  <select 
                    onChange={(e) => setFrom(e.target.value)} 
                    className="w-full focus:outline-none" 
                    name="from" 
                    required
                  >
                    <option value="">Please Select</option>
                    {stand.map((el) => (
                      <option key={el._id} value={el.name}>{el.name}</option>
                    ))}
                  </select>
                </div>
              </div>
   
              {/* To Select */}
              <div className="border border-[#818181] p-4 flex-1 rounded-lg flex items-center gap-3">
                <CiLocationOn className="text-4xl" />
                <div className="w-full">
                  <label className="text-lg font-heading text-secondaryText">
                    To
                  </label>
                  <select 
                    onChange={(e) => setTo(e.target.value)} 
                    className="w-full focus:outline-none" 
                    name="to" 
                    required
                  >
                    <option value="">Please Select</option>
                    {stand.map((el) => (
                      <option key={el._id} value={el.name}>{el.name}</option>
                    ))}
                  </select>
                </div>
              </div>
   
              {/* Date Input */}
              <div className="border border-[#818181] p-4 flex-1 rounded-lg flex items-center gap-3">
                <CiCalendar className="text-4xl " />
                <div className="w-full">
                  <label className="text-lg font-heading text-secondaryText">
                    Date
                  </label>
                  <input 
                    type="date" 
                    onChange={(e) => setDate(e.target.value)} 
                    className="w-full focus:outline-none hide-date-icon" 
                    name="date" 
                    required 
                    min={new Date().toISOString().split('T')[0]} 
                  />
                </div>
              </div>
   
              <button
                className="text-white w-36 px-2 py-4 mt-6 bg-[#013976] rounded-[40px] flex justify-center items-center"
                type='submit'
              >
               Search
              </button>
            </div>
          </form>

          {/* Render BusDetails only if the form has been submitted */}
          {isSubmitted && <BusDetails data={data} />}
      </div>
    )
}

export default SearchRoute
