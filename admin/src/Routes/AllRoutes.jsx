import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Bus from '../Pages/Bus'
import Trip from '../Pages/Trip'
import BusSeatLayout from '../Components/Seat'
const AllRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Bus />} />
                <Route path="/trip" element={<Trip />} />
                <Route path='/seat' element={<BusSeatLayout/>} />
            </Routes>
        </>
    )
}

export default AllRoutes