const express= require("express");
const {z}= require("zod");
const jwt= require("jsonwebtoken");
const bcrypt= require("bcrypt");
const { User, Account } = require("../db");
const { authmiddleware } = require("../middleware");
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

    const {success}=schema.safeParse(req.body);
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
     
    const userId= user._id;

    await Account.create({
        userId,
        balance: Math.floor(1 + Math.random() * 1000)
    });

    const token= jwt.sign({
        userId
    },process.env.JWT_SECRET);

    res.status(201).json({
    message: "User created successfully",
    token:token
});


});


router.post("/signin",async(req,res)=>{
    const {username}= req.body;
    const {password}= req.body;

    const user= await User.findOne({ username })
    if(!user){
        return res.status(400).json({
            message:"invalid user"
        })
    }

    const isMatch= await bcrypt.compare(password,user.password)

    console.log("DB username:", user.username);
    console.log("Input username:", username);

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

router.get("/details", authmiddleware, async (req, res) => {
    const userId = req.userId;
    try {
        const user= await User.findOne({
            _id: userId
        })
        res.json({
            firstname:user.firstname
        })

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong"
        });
    }
});

router.get("/bulk",authmiddleware,async (req,res)=>{
    const filter= req.query.filter || "";

    const users= await User.find({
        $or:[
            {
                firstname:{
                    "$regex":filter,
                    "$options":"i",
                }
            },
            {
                lastname:{
                    "$regex":filter,
                    "$options":"i",
                }
            }
            
        ]
    })

res.json({
    users:users.map(user=>({
        username:user.username,
        firstname:user.firstname,
        lastname:user.lastname,
        _id:user._id
    
    }))
})

})

module.exports= router;