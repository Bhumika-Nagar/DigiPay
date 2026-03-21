const express= require("express");
const {z}= require("zod");
const {jwt}= require("jsonwebtoken");
const {bcrypt}= require("bcrypt");
const { User } = require("../db");
const router= express.Router();

    const schema= z.object({
        username:z.string(),
        firstname:z.string().min(3).max(30),
        lastname:z.string().min(3).max(30),
        password:z.string().min(6)
    })


router.post("/signup",async(req,res)=>{
    const {username}= req.body;
    const {firstname}= req.body;
    const {lastname}= req.body;
    const {password}= req.body;

    const {success}=schema.safeparse(req.body);
    if(!success){
        return res.status(411).json({
            message:"incorrect inputs"
        })
    }

    const existingUser= await User.findOne({ username })
    if(existingUser){
        return res.status(404).json({
            message:"user already exists"
        });
    }

    const hashedPassword= await bcrypt.hash(password,10);
    const user = await User.create({
    username,
    firstname,
    lastname,
    password: hashedPassword
});

    
    res.status(201).json({
    message: "User created successfully"
});


});


route.post("signin",async(req,res)=>{
    const {username}= req.body;
    const {password}= req.body;

    const user= await User.findOne({ username })
    if(!user){
        return res.status(404).json({
            message:"invalid credentials"
        })
    }

    const isMatch= await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({
            message:"invalid credentials"
        });
    }

    const userId= user._id;
    const token= jwt.sign({
        userId
    },process.env.JWT_SECRET);

    res.json({
        message:"login successful",
        token:token
    })
});



module.exports= router;