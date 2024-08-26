import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Vehicle from '../Pages/Vehicle'
import Trip from '../Pages/Trip'
import BusSeatLayout from '../Components/Seat'
import Counter from '../Pages/Counter'
const AllRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Vehicle />} />
                <Route path="/trip" element={<Trip />} />
                <Route path='/seat' element={<BusSeatLayout />} />
                <Route path='/counter' element={<Counter />} />
            </Routes>
        </>
    )
}

export default AllRoutes