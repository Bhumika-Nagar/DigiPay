const express= require("express");
const mongoose= require("mongoose");
const {z}= require("zod");
const jwt= require("jsonwebtoken");
const bcrypt= require("bcrypt");
const { User, Account, SchedulePayment } = require("../db");
const { authmiddleware } = require("../middleware");
const cron= require("node-cron");
const { processScheduledPayments } = require("../jobs/cron");
const router= express.Router();

router.get("/",authmiddleware,async(req,res)=>{

})


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

    const { toUserId, amount }= req.body;
    const executeAt= new Date (req.body.executeAt);
    try{
        const payment= await SchedulePayment.create({
            fromUserId:req.userId,
            toUserId,
            amount,
            executeAt
        })
        res.json({
            message:"payment scheduled successfully",
            payment
        });
    }catch(err){

    }
})


router.patch("/:id/cancel",authmiddleware,async(req,res)=>{})
module.exports= router;

