
const express = require('express'); 
const http = require('http'); 
const socketIo = require('socket.io'); 
const mongoose = require('mongoose'); 
const cors = require('cors'); 

 

const app = express(); 

const server = http.createServer(app); 

const io = socketIo(server); 

 

app.use(cors()); 

app.use(express.json()); 

 

// Connect to MongoDB 

mongoose.connect('mongodb://localhost/bus_booking', { useNewUrlParser: true, useUnifiedTopology: true }); 

 

// Seat Schema 

const seatSchema = new mongoose.Schema({ 

    seatNumber: String, 

    isBooked: { type: Boolean, default: false }, 

    isLocked: { type: Boolean, default: false }, 

    lockExpires: Date, 

}); 

 

const Seat = mongoose.model('Seat', seatSchema); 

 

// API to get available seats 

app.get('/seats', async (req, res) => { 

    const seats = await Seat.find(); 

    res.json(seats); 

}); 

 

// Lock a seat 

async function lockSeat(seatNumber) { 

    const seat = await Seat.findOne({ seatNumber }); 

    if (seat && !seat.isBooked && !seat.isLocked) { 

        seat.isLocked = true; 

        seat.lockExpires = Date.now() + 10 * 60 * 1000; // Lock for 10 minutes 

        await seat.save(); 

        return seat; 

    } 

    return null; 

} 

 

// Unlock expired seats 

async function unlockExpiredSeats() { 

    const now = Date.now(); 

    await Seat.updateMany({ isLocked: true, lockExpires: { $lt: now } }, { isLocked: false, lockExpires: null }); 

} 

 

// Socket.io connection 

io.on('connection', (socket) => { 

    console.log('New client connected'); 

 

    // Handle locking a seat 

    socket.on('lock_seat', async (seatNumber) => { 

        const seat = await lockSeat(seatNumber); 

        if (seat) { 

            io.emit('seat_locked', seatNumber); 

        } else { 

            socket.emit('lock_failed', seatNumber); 

        } 

    }); 

 

    // Handle booking a seat 

    socket.on('book_seat', async (seatNumber) => { 

        await unlockExpiredSeats(); // Unlock any expired seats 

        const seat = await Seat.findOne({ seatNumber }); 

        if (seat && !seat.isBooked && seat.isLocked) { 

            seat.isBooked = true; 

            seat.isLocked = false; // Unlock the seat upon booking 

            await seat.save(); 

            io.emit('seat_booked', seatNumber); 

        } 

    }); 

 

    socket.on('disconnect', () => { 

        console.log('Client disconnected'); 

    }); 

}); 

 

// Start the server 

const PORT = process.env.PORT || 4000; 

server.listen(PORT, () => { 

    console.log(`Server is running on port ${PORT}`); 

}); 