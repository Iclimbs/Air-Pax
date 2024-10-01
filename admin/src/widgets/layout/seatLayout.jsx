import React from "react";
import { GiSteeringWheel } from "react-icons/gi";
import { MdOutlineChair } from "react-icons/md";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";



const Seat = ({ seatNumber, isSelected, onClick, alreadybooked }) => {
  console.log(seatNumber,isSelected);
  return (
    <div className={`cursor-pointer relative lg:w-16 h-16 flex flex-col justify-center items-center ${alreadybooked} ? "border border-red-700" : ${isSelected} ? "border border-gray-700" : "border border-green-700" `} {...(alreadybooked ? null : { onClick })}>
      <img
        src={alreadybooked ? "/assets/bookedseat.svg" : isSelected ? "/assets/selectedseat.svg" : "/assets/emptyseat.svg"}
        alt="Seat Layout"
        className={`w-10 h-10 cursor-pointer lg:rotate-0 rotate-90 path{fill:'#FF0000'}`}
      />
      <span className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-xs font-bold">
        {seatNumber}
      </span>
    </div>
  );
};

const SeatLayout = (props) => {
  const renderSeats = (rows) => {
    const seatsPerRow = 8;
    return rows.flatMap(row =>
      Array.from({ length: seatsPerRow }, (_, i) => {
        const seatNumber = `${i + 1}${row}`;
        return (
          <Seat
            key={seatNumber}
            seatNumber={seatNumber}
            isSelected={props.selectedSeats.includes(seatNumber)}
            onClick={() => props.handleSeatClick(seatNumber)}
            alreadybooked={props.bookedSeats.includes(seatNumber)}
          />
        );
      })
    );
  };

  const renderSeatsColumn = (row) => {
    const seatsPerRow = 8;
    return Array.from({ length: seatsPerRow }, (_, i) => {
      const seatNumber = `${i + 1}${row}`;
      return (
        <Seat
          key={seatNumber}
          seatNumber={seatNumber}
          isSelected={props.selectedSeats.includes(seatNumber)}
          onClick={() => props.handleSeatClick(seatNumber)}
          alreadybooked={props.bookedSeats.includes(seatNumber)}
        />
      );
    });
  };

  return (
    <>
      <div className="space-y-5">
        <h2 className="text-xl font-medium text-secondaryText lg:text-left text-center">Choose a Seat</h2>
        <div className="w-full flex flex-col lg:flex-row justify-between">
          <div className="w-full lg:w-8/12 flex flex-col lg:flex-row">
            <div className="w-full flex flex-col lg:flex-row lg:gap-x-5">
              <div className="flex justify-center w-1/2 m-auto lg:w-16 px-2 h-full border-b-2 lg:border-b-0 lg:border-r-2 border-dashed border-neutral-300">
                <GiSteeringWheel className="text-5xl mt-6 text-primary lg:-rotate-90" />
              </div>
              <div className="lg:px-4 flex flex-col items-center lg:hidden block">
                <div className="lg:space-y-8 flex flex-row lg:flex-col">
                  <div className="flex gap-x-4">
                    <div className="flex flex-col items-center">
                      {renderSeatsColumn('A')}
                    </div>
                    <div className="flex flex-col items-center">
                      {renderSeatsColumn('B')}
                    </div>
                    <div className="w-5"></div>
                    <div className="flex flex-col items-center">
                      {renderSeatsColumn('C')}
                    </div>
                    <div className="flex flex-col items-center">
                      {renderSeatsColumn('D')}
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block lg:px-4 flex flex-col items-center">
                <div className="lg:space-y-8 flex lg:flex-col">
                  <div>
                    <div className="w-full grid grid-cols-2 lg:grid-cols-8 gap-x-4">
                      {renderSeats(['A']).slice(0, 8)}
                    </div>
                    <div className="w-full grid grid-cols-2 lg:grid-cols-8 gap-x-4">
                      {renderSeats(['B']).slice(0, 8)}
                    </div>
                    <div className="h-8"></div>
                    <div className="w-full grid grid-cols-2 lg:grid-cols-8 gap-x-4">
                      {renderSeats(['C']).slice(0, 8)}
                    </div>
                    <div className="w-full grid grid-cols-2 lg:grid-cols-8 gap-x-4">
                      {renderSeats(['D']).slice(0, 8)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
          <div className='lg:space-y-8 space-y-0 w-full lg:pt-0 pt-5 lg:w-28 flex lg:flex-col flex-row justify-between flex-wrap'>
            <div className='flex items-center gap-x-2'>
              <MdOutlineChair className='text-lg text-neutral-500 ' />
              <p className="text-white dark:text-neutral-200 text-sm font-normal">
                Available
              </p>
            </div>
            <div className='flex items-center gap-x-2'>
              <MdOutlineChair className='text-lg text-red-500 ' />
              <p className="text-white dark:text-neutral-200 text-sm font-normal">
                Booked
              </p>

            </div>
            <div className='flex items-center gap-x-2'>
              <MdOutlineChair className='text-lg text-primary ' />
              <p className="text-white dark:text-neutral-200 text-sm font-normal">
                Selected
              </p>
            </div>
            <div className='flex items-center gap-x-2'>
              <RiMoneyRupeeCircleLine className='text-lg text-neutral-500 ' />
              <p className="text-white dark:text-neutral-200 text-sm font-normal">
                Rs. {props.seatprices}
              </p>
            </div>
          </div>
        </div>
        </div>
   
        {/* Selected Seats */}
        {
          props.selectedSeats.length > 0 && 
          <div className='!mt-10 text-white'>
            <h3 className='text-lg font-bold'>Selected Seats:</h3>
            <div className='flex flex-wrap'>
              {props.selectedSeats.map(Seat => (
                <div className='w-10 h-10 rounded-md m-1.5 text-lg font-medium bg-primary flex items-center justify-center text-black' key={Seat}>
                  {Seat}
                </div>
              ))}
            </div>
          </div>
        }
        {/* Caluculate Price */}
        {
          props.selectedSeats.length > 0 &&
          <div className='!mt-5 flex items-center gap-x-4 text-white'>
            <h3 className='text-lg font-bold'>Total Fair Price:</h3>
            <p className='text-lg font-medium'>
              Rs. {props.selectedSeats.length * props.seatprices}
            </p>
            <span className="text-sm text-neutral-400 font-normal">
              {'Including all of the taxes'}
            </span>
          </div >}
      </div>
    </>
  );
};

export default SeatLayout;