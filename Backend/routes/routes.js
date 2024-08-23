const router = require("express").Router();
const { tripRouter } = require("../controller/trip");
const { userRouter } = require("../controller/user");
const { vehicleRouter } = require("../controller/vehicle");

router
    .use("/user", userRouter)
    .use("/vehicle",vehicleRouter)
    .use("/trip",tripRouter)

module.exports = router;