import React from 'react'
import { FaRupeeSign } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { IoBusOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

const BusDetails = ({data}) => {
  return (
    <div className="flex lg:flex-row flex-col justify-between">
              <div className="w-full ">
                {
                  data.length > 0 ? (<div>
                    {data?.map((el, index) => {
                      return (
                        <div
                          className="bg-gray-400 rounded-lg p-6 space-y-6 mt-6 hover:shadow-lg transition-shadow duration-300"
                          key={index}
                        >
                          <div className="flex flex-col sm:flex-row justify-between">
                            <table className="min-w-full table-auto border-collapse">
                              <thead>
                                <tr className="border-b border-gray-800">
                                  <th className="p-3 text-left text-primary">Departure</th>
                                  <th className="p-3 text-left text-primary">Duration</th>
                                  <th className="p-3 text-left text-primary">Arrival</th>
                                  <th className="p-3 text-left text-primary">Fare</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="p-3 ">{el.starttime}</td>
                                  <td className="p-3 ">{el.totaltime}</td>
                                  <td className="p-3 ">{el.endtime}</td>
                                  <td className="p-3 ">
                                    <span className="inline-flex items-center">
                                      <FaRupeeSign /> {el.price}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="p-3 ">{el.from}</td>
                                  <td></td>
                                  <td className="p-3 ">{el.to}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="flex flex-col sm:flex-row justify-between items-center">
                            <div className="flex justify-center items-center gap-2 mb-4 sm:mb-0 ">
                              <IoBusOutline className="text-xl sm:text-lg" />
                              <p>{el.busid}</p>
                            </div>
                            <div className="flex justify-center items-center gap-2 mb-4 sm:mb-0 ">
                              <FaRegUser className="text-xl sm:text-lg" />
                              <p>{el.availableseats} Seats Available</p>
                            </div>

                            <div>
                              <Link to={`/dashboard/tickets-booking/${el._id}`}>
                                <button
                                  className="px-6 py-2 text-lg font-semibold bg-gradient-to-r from-[#ff5722] to-[#ff9800] text-white rounded-full hover:scale-105 transform transition-transform duration-300"
                                >
                                  Select Seats
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>) : (
                    <div className="text-gray-400 text-center ">
                      <img src="/assets/oops.svg" alt="oops" className="w-96 m-auto" />
                      <p className="py-2">Buses Not Available</p>
                    </div>
                  )
                }

              </div>
            </div>
  )
}

export default BusDetails