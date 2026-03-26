const express= require("express");
const mongoose= require("mongoose");
const {z}= require("zod");
const jwt= require("jsonwebtoken");
const bcrypt= require("bcrypt");
const { User, Account } = require("../db");
const { authmiddleware } = require("../middleware");
const router= express.Router();

router.get("/balance",authmiddleware,async(req,res)=>{
    const account= await Account.findOne({
        userId:new mongoose.Types.ObjectId(req.userId)
    });
        res.json({
            balance:account.balance
        })
})

router.post("/transfer", authmiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { amount, to } = req.body;

    const account = await Account.findOne({
      userId: req.userId,
    }).session(session);

    if (!account || account.balance < amount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "insufficient balance",
      });
    }

    const receiver = await Account.findOne({
      userId: to,
    }).session(session);

    if (!receiver) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "cannot find the receiver",
      });
    }

    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);

    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "transaction completed successfully",
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.log(err);
    res.status(500).json({
      message: "Transaction failed",
    });
  }
});

module.exports= router;