const express= require("express");
const {z}= require("zod");
const {jwt}= require("jsonwebtoken");
const {bcrypt}= require("bcrypt");
const { User, Account } = require("../db");
const { authmiddleware } = require("../middleware");
const router= express.Router();

router.get("balance",authmiddleware,async(req,res)=>{
    const account= await Account.findOne({
        userId:req.userId
    })
        res.json({
            balance:account.balance
        })
})

router.post("transfer",authmiddleware,async(req,res)=>{
    const { amount , receiverId } = req.body;

    const user= await Account.findOne({
        userId:req.userId
    })
    if(!Account || !Account.balance==amount){
      return res.json({
            message:"balance not available"
        })
    }

    const receiver= await Account.findOne({
        userId:receiverId
    })
    if(!receiver){
        return res.json({
            message:"cannot find the receiver"
        })
    }

    await Account.updateOne(

        {userId:req.userId},{
            $inc: {balance: -amount}
        },
            {session}
    )

    await Account.updateOne(

        {userId:receiverId},{ 
            $inc: {balance: +amount}
        },
            {session}
    )

    res.json({
        message:"transaction completed successfully"
    })
})
























module.exports= router;