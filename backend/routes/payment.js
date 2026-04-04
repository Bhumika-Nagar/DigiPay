const express = require("express");
const authmiddleware = require("../middleware");
const { Account, Payment } = require("../db");
const {
    processScheduledPayments,
    normalizeLegacyPaymentStatuses
} = require("../controllers/schedulePayment");

const router = express.Router();

router.get("/ScheduledPayments", authmiddleware, async (req, res) => {
    await normalizeLegacyPaymentStatuses();

    const payments = await Payment.find({
        fromUserId: req.userId
    }).populate("toUserId", "firstname lastname username").sort({ executeAt: -1 });

    res.json({
        payments
    });
});

router.post("/schedule", authmiddleware, async (req, res) => {
    const { toUserId, amount, executeAt } = req.body;

    if (!toUserId || !amount || Number(amount) <= 0 || !executeAt) {
        return res.status(400).json({
            message: "invalid payment details"
        });
    }

    if (String(toUserId) === String(req.userId)) {
        return res.status(400).json({
            message: "cannot schedule payment to yourself"
        });
    }

    const receiverAccount = await Account.findOne({
        userId: toUserId
    });

    if (!receiverAccount) {
        return res.status(404).json({
            message: "cannot find the receiver"
        });
    }

    const payment = await Payment.create({
        fromUserId: req.userId,
        toUserId,
        amount: Number(amount),
        executeAt: new Date(executeAt)
    });

    res.status(201).json({
        message: "payment scheduled successfully",
        payment
    });
});

router.post("/schedule/run", authmiddleware, async (req, res) => {
    try {
        const processed = await processScheduledPayments();

        res.json({
            message: "scheduled payments processed successfully",
            processed
        });
    } catch (error) {
        res.status(500).json({
            message: "error processing scheduled payments"
        });
    }
});

router.patch("/cancel/:paymentId", authmiddleware, async (req, res) => {
    const payment = await Payment.findOne({
        _id: req.params.paymentId,
        fromUserId: req.userId
    });

    if (!payment) {
        return res.status(404).json({
            message: "payment not found"
        });
    }

    if (payment.status !== "pending") {
        return res.status(400).json({
            message: "only pending payments can be cancelled"
        });
    }

    payment.status = "cancelled";
    await payment.save();

    res.json({
        message: "payment cancelled successfully"
    });
});

module.exports = router;
