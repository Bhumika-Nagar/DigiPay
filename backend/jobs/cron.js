const cron = require("node-cron");
const { processScheduledPayments } = require("../controllers/schedulePayment");

function startScheduledPaymentJob() {
    cron.schedule("* * * * *", async () => {
        try {
            await processScheduledPayments();
        } catch (error) {
            console.error("Scheduled payment cron failed", error);
        }
    });
}

module.exports = {
    startScheduledPaymentJob
};
