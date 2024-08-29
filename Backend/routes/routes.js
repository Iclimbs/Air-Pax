const router = require("express").Router();
const { CounterRouter } = require("../controller/counter");
const { tripRouter } = require("../controller/trip");
const { userRouter } = require("../controller/user");
const { vehicleRouter } = require("../controller/vehicle");

router
    .use("/user", userRouter)
    .use("/vehicle",vehicleRouter)
    .use("/trip",tripRouter)
    .use("/counter",CounterRouter)

module.exports = router;