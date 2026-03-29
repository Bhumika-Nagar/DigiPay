const cron = require("node-cron");
const { processScheduledPayments } = require("../controllers/schedulePayment");

cron.schedule("* * * * *", async () => {
  await processScheduledPayments();
});