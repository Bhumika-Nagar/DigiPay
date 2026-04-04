require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const mainRouter = require("./routes/index");
const { startScheduledPaymentJob } = require("./jobs/cron");

app.use(cors());
app.use(express.json());
app.use("/api/v1", mainRouter);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        startScheduledPaymentJob();
        console.log("mongodb connected");
    })
    .catch(err => console.log(err));

app.listen(5000, () => {
    console.log("server running at port 5000");
});
