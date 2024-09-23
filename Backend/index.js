require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { WebSocketServer } = require("ws")
const connection = require("./connection/connection");
const app = express();

const wss = new WebSocketServer({ port: 8500 })

wss.on("connection", (socket) => {
    console.log("Connection Completed");
    socket.on("message", (msg) => {
        if (msg === 'hey') {
            socket.send("Hello !!")
        } else {
            socket.send("ta ta !!")
        }
        console.log("Client Message : " + msg);

    })
})

app.use(express.json());
app.use(cors());

app.use("/api/v1/", require("./routes/routes"));


app.listen(process.env.Port, async () => {
    try {
        await connection;
        console.log(`Server is Up & Running At Port ${process.env.Port}`);
    } catch (error) {
        console.log(error);
    }
});