const router = require("express").Router();
const { userRouter } = require("../controller/user");

router
    .use("/user", userRouter)

module.exports = router;