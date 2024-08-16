const router = require("express").Router();
const { busRouter } = require("../controller/bus");
const { userRouter } = require("../controller/user");

router
    .use("/user", userRouter)
    .use("/bus",busRouter)

module.exports = router;