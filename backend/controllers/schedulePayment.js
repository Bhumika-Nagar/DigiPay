const mongoose = require("mongoose");
const { Account, ScheduledPayment } = require("../db");

async function processScheduledPayments() {
  const now = new Date();

  const payments = await ScheduledPayment.find({
    status: "pending",
    executeAt: { $lte: now }
  });

  let processedCount = 0;

  for (const payment of payments) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const sender = await Account.findOne({ userId: payment.fromUserId }).session(session);
      const receiver = await Account.findOne({ userId: payment.toUserId }).session(session);

      if (!sender) {
        throw new Error("Sender account not found");
      }

      if (!receiver) {
        throw new Error("Receiver account not found");
      }

      if (sender.balance < payment.amount) {
        throw new Error("Insufficient balance");
      }

      sender.balance -= payment.amount;
      receiver.balance += payment.amount;

      await sender.save({ session });
      await receiver.save({ session });

      payment.status = "success";
      await payment.save({ session });

      await session.commitTransaction();
      processedCount++;
    } catch (err) {
      await session.abortTransaction();

      payment.status = "failed";
      payment.failureReason = err.message;
      await payment.save();

      console.log(err.message);
    } finally {
      session.endSession();
    }
  }

  return processedCount;
}

module.exports = { processScheduledPayments };
