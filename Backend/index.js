require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connection = require("./connection/connection");
const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

// app.use("/api/v1/", require("./routes/routes"));

app.get("/", function (req, res) {
  res.send("<h1>Welcome To Air Pax Backend</h1>")
});


app.listen(process.env.Port, async () => {
  try {
    await connection;
    console.log(`Server is Up & Running At Port ${process.env.Port}`);
  } catch (error) {
    console.log(error);
  }
});