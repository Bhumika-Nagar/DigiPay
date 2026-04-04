const mongoose = require("mongoose");
const { Account, Payment } = require("../db");

async function normalizeLegacyPaymentStatuses() {
    await Payment.updateMany(
        { status: "completed" },
        { $set: { status: "success" } }
    );
}

async function processScheduledPayments() {
    await normalizeLegacyPaymentStatuses();

    const now = new Date();

    const payments = await Payment.find({
        status: "pending",
        executeAt: { $lte: now }
    });

    let processedCount = 0;

    for (const payment of payments) {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const senderAccount = await Account.findOne({
                userId: payment.fromUserId
            }).session(session);

            const receiverAccount = await Account.findOne({
                userId: payment.toUserId
            }).session(session);

            if (!senderAccount || !receiverAccount || senderAccount.balance < payment.amount) {
                await Payment.updateOne(
                    { _id: payment._id },
                    { $set: { status: "failed" } }
                ).session(session);
            } else {
                await Account.updateOne(
                    { userId: payment.fromUserId },
                    { $inc: { balance: -payment.amount } }
                ).session(session);

                await Account.updateOne(
                    { userId: payment.toUserId },
                    { $inc: { balance: payment.amount } }
                ).session(session);

                await Payment.updateOne(
                    { _id: payment._id },
                    { $set: { status: "success" } }
                ).session(session);
            }

            await session.commitTransaction();
            processedCount += 1;
        } catch (error) {
            await session.abortTransaction();

            await Payment.updateOne(
                { _id: payment._id },
                { $set: { status: "failed" } }
            );
        } finally {
            await session.endSession();
        }
    }

    return processedCount;
}

module.exports = {
    processScheduledPayments,
    normalizeLegacyPaymentStatuses
};
