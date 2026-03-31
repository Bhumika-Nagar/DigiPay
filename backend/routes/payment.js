const express= require("express");
const mongoose= require("mongoose");
const {z}= require("zod");
const jwt= require("jsonwebtoken");
const bcrypt= require("bcrypt");
const { User, Account, ScheduledPayment } = require("../db");
const { authmiddleware } = require("../middleware");
const cron= require("node-cron");
const { processScheduledPayments } = require("../jobs/cron");
const router= express.Router();

router.get("/ScheduledPayments", authmiddleware, async (req, res) => {
  try {
    const payments = await ScheduledPayment.find({ fromUserId: req.userId })
      .populate("toUserId", "firstname lastname username")
      .sort({ createdAt: -1 });

    res.json({ payments });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching scheduled payments",
      error: err.message,
    });
  }
});

router.post("/schedule/run", authmiddleware, async (req, res) => {
  try {
    const processedCount = await processScheduledPayments();

    res.json({
      message: "Scheduled payments processed successfully",
      processed: processedCount
    });
  } catch (err) {
    res.status(500).json({
      message: "Error processing scheduled payments",
      error: err.message
    });
  }
});


router.post("/schedule",authmiddleware,async(req,res)=>{
    console.log("schedule route hit");
    const { toUserId, amount }= req.body;
    const executeAt= new Date (req.body.executeAt);
    try{
        const payment= await ScheduledPayment.create({
            fromUserId:req.userId,
            toUserId,
            amount,
            executeAt
        })
        res.json({
            message:"payment scheduled successfully",
            payment
        });
    } catch (err) {
  res.status(500).json({ message: "Error scheduling payment", error: err.message });
}

})

router.patch("/cancel/:paymentId",authmiddleware,async(req,res)=>{
  try{
  const paymentId= req.params.paymentId;

  const payment= await ScheduledPayment.findById(paymentId);

  if(!payment){
    return res.status(404).json({
        message:"payment not found"
    })
  }

  if (payment.fromUserId.toString() !== req.userId) {
  return res.status(403).json({
    message: "Not authorized"
  });
}

  if(payment.status!="pending"){
    return res.status(400).json({
      message:"cannot cancel this payment"
    });
  }

  payment.status="cancelled";
  await payment.save();

  res.json({
    message:"payment cancelled successfully",
    payment
  })
}catch(err){
  res.status(500).json({
    message:"error cancelling payment",
    error:err.message
  })
}
  })

module.exports= router;

