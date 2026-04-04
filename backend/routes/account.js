const express = require("express");
const { Account } = require("../db");
const authmiddleware = require("../middleware");

const router = express.Router();

router.get("/balance", authmiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    if (!account) {
        return res.status(404).json({
            message: "account not found"
        });
    }

    res.json({
        balance: account.balance
    });
});

router.post("/transfer", authmiddleware, async (req, res) => {
    const { amount, receiverId, to } = req.body;
    const targetUserId = receiverId || to;

    if (!targetUserId || !amount || Number(amount) <= 0) {
        return res.status(400).json({
            message: "invalid transfer details"
        });
    }

    if (String(targetUserId) === String(req.userId)) {
        return res.status(400).json({
            message: "cannot transfer to yourself"
        });
    }

    const senderAccount = await Account.findOne({
        userId: req.userId
    });

    if (!senderAccount || senderAccount.balance < Number(amount)) {
        return res.status(400).json({
            message: "balance not available"
        });
    }

    const receiverAccount = await Account.findOne({
        userId: targetUserId
    });

    if (!receiverAccount) {
        return res.status(404).json({
            message: "cannot find the receiver"
        });
    }

    await Account.updateOne(
        { userId: req.userId },
        {
            $inc: { balance: -Number(amount) }
        }
    );

    await Account.updateOne(
        { userId: targetUserId },
        {
            $inc: { balance: Number(amount) }
        }
    );

    res.json({
        message: "transaction completed successfully"
    });
});

module.exports = router;
