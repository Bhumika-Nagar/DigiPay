const { model } = require("mongoose");

 async function processScheduledPayments() {
  const now = new Date();

  const payments = await ScheduledPayment.find({
    status: "pending",
    executeAt: { $lte: now }
  });

  for (const payment of payments) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const sender = await Account.findOne({ userId: payment.fromUserId }).session(session);
      const receiver = await Account.findOne({ userId: payment.toUserId }).session(session);

      if (!sender || sender.balance < payment.amount) {
        throw new Error("Insufficient balance");
      }

      sender.balance -= payment.amount;
      receiver.balance += payment.amount;

      await sender.save({ session });
      await receiver.save({ session });

      payment.status = "completed";
      await payment.save({ session });

      await session.commitTransaction();
      return payments.length;
    } catch (err) {
      await session.abortTransaction();

      payment.status = "failed";
      await payment.save();

      console.log(err.message);
    } finally {
      session.endSession();
    }
  }
}

model.exports= {processScheduledPayments}