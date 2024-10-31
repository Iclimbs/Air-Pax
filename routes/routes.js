const router = require("express").Router();
const { CounterRouter } = require("../controller/counter");
const { FoodRouter } = require("../controller/food");
const { OtherPaymentRouter } = require("../controller/GMR/otherpayment");
const { OtherSeatRouter } = require("../controller/GMR/otherseat");
const { PaymentRouter } = require("../controller/payment");
const { PaymentGateway } = require("../controller/paymentgateway");
const { PnrRouter } = require("../controller/pnr");
const { SeatRouter } = require("../controller/seat");
const { TicketRouter } = require("../controller/ticket");
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
    .use("/food",FoodRouter)
    .use("/new/seat/",OtherSeatRouter)
    .use("/new/payment",OtherPaymentRouter)
    .use("/pnr",PnrRouter)
    .use("/ticket",TicketRouter)



module.exports = router;