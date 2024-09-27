const router = require("express").Router();
const { CounterRouter } = require("../controller/counter");
const { OtherPaymentRouter } = require("../controller/otherpayment");
const { OtherSeatRouter } = require("../controller/otherseat");
const { PaymentRouter } = require("../controller/payment");
const { PaymentGateway } = require("../controller/paymentgateway");
const { SeatRouter } = require("../controller/seat");
const { tripRouter } = require("../controller/trip");
const { userRouter } = require("../controller/user");
const { validateRouter } = require("../controller/validate");
const { vehicleRouter } = require("../controller/vehicle");

router
    .use("/user", userRouter)
    .use("/vehicle",vehicleRouter)
    .use("/trip",tripRouter)
    .use("/counter",CounterRouter)
    .use("/validate",validateRouter)
    .use("/seat",SeatRouter)
    .use("/payment",PaymentRouter)
    .use("/gateway",PaymentGateway)
    .use("/new/seat/",OtherSeatRouter)
    .use("/new/payment",OtherPaymentRouter)


module.exports = router;