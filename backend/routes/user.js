const express = require("express");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, Account } = require("../db");
const authmiddleware = require("../middleware");
const { blacklistToken } = require("../tokenBlacklist");

const router = express.Router();

const schema = z.object({
    username: z.string(),
    firstname: z.string().min(3).max(30),
    lastname: z.string().min(3).max(30),
    password: z.string().min(6)
});

router.post("/signup", async (req, res) => {
    const { username, firstname, lastname, password } = req.body;

    const { success } = schema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "incorrect inputs"
        });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(404).json({
            message: "user already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        firstname,
        lastname,
        password: hashedPassword
    });

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 1000
    });

    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET
    );

    res.status(201).json({
        message: "User created successfully",
        token
    });
});

router.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({
            message: "invalid credentials"
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({
            message: "invalid credentials"
        });
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET
    );

    res.json({
        message: "login successful",
        token
    });
});

router.post("/logout", authmiddleware, async (req, res) => {
    blacklistToken(req.token, req.tokenExp);

    res.json({
        message: "logout successful"
    });
});

router.get("/details", authmiddleware, async (req, res) => {
    const user = await User.findById(req.userId).select("username firstname lastname");

    if (!user) {
        return res.status(404).json({
            message: "user not found"
        });
    }

    res.json(user);
});

const updatedBody = z.object({
    password: z.string().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional()
});

router.put("/edit", authmiddleware, async (req, res) => {
    const { success } = updatedBody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "error while updating info"
        });
    }

    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    try {
        await User.updateOne(
            { _id: req.userId },
            { $set: req.body }
        );

        res.json({
            message: "Updated successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong"
        });
    }
});

router.get("/bulk", authmiddleware, async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        _id: { $ne: req.userId },
        $or: [
            {
                firstname: {
                    $regex: filter
                }
            },
            {
                lastname: {
                    $regex: filter
                }
            }
        ]
    });

    res.json({
        users: users.map(user => ({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    });
});

module.exports = router;
