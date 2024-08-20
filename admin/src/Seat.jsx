import React, { useState } from 'react'
import { MdOutlineChair } from "react-icons/md";
export const Seat = ({ seatNumber, isSelected, onClick }) => {
    return (
        <MdOutlineChair className={`text-3xl -rotate-90 cursor-pointer ${isSelected ? 'text-violet-600' : 'text-neutral-600'}`} />
    )
}

const BusSeatLayout = () => {
    const totalSeats = 41;
    const [selectedSeats, setSelectedSeats] = useState([])
    const handleSeatClick = (seatNumber) => {
        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats(selectedSeats.filter((Seat) => Seat !== seatNumber));
        } else {
            if (selectedSeats.length < 10) {
                setSelectedSeats([...selectedSeats, seatNumber])
            } else {
                alert("You Can Only Select a maximum of 10 seats")
            }
        }
    }

}

const renderSeats = () => {
    let seats = [];
    for (let index = 0; index < totalSeats; index++) {
        seats.push(
            <Seat
                key={i}
                seatNumber={i}
                isSelected={selectedSeats.includes(i)}
                onClick={() => handleSeatClick(i)}
            />
        )
    }
    return seats;
}
return (
    <div className='space-y-5'>
        <h2 className='text-xl text-neutral-800 font-medium'>Choose a Seat</h2>
        {/* Seat Layout  */}
        <div className="w-full flex justify-between">
            <div className="flex-1 w-full flex">
                <div className='w-full flex-1 flex gap-x-5 items-stretch'>
                    .w-10.h-full.border-r-2.border-dashed.border-neutral-300.
                    <div className='w-10 h-full border-r-2 border-dashed border-neutral-300 '>

                    </div>
                </div>
            </div>
            <div className='space-y-3 w-28'>

            </div>
        </div>
        {/* Selected Seats */}
        {dwadw}
        {/* Caluculate Price */}
        {wadad}
    </div>
)
export default Seat