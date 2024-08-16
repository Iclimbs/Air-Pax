const router = require("express").Router();
const { busRouter } = require("../controller/bus");
const { tripRouter } = require("../controller/trip");
const { userRouter } = require("../controller/user");

router
    .use("/user", userRouter)
    .use("/bus",busRouter)
    .use("trip",tripRouter)

module.exports = router;