const express= require("express");

const accountRouter = require("./account");
const paymentRouter = require("./payment");
const userRouter = require("./user");
const router = express.Router();


router.use("/user",userRouter);
router.use("/account",accountRouter);
router.use("/payment", paymentRouter);

module.exports= router;
