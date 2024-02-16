const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");

const abonementRouter = require("./controllers/abonements");
const trainingRouter = require("./controllers/trainings");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const salesRouter = require("./controllers/sales");
const authRouter = require("./controllers/authController");

const middleware = require("./utils/middleware");
const { connectToDatabase } = require("./utils/db");
// const { scheduleDailyJob } = require("./utils/scheduledTrainingChecker");

if (process.env.NODE_ENV === "test") {
    const testingRouter = require("./controllers/testing");
    app.use("/api/testing", testingRouter);
}
// Connect to the database
connectToDatabase();

// check the trainings and return to user abonement if needed
// scheduleDailyJob();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use("/api/auth", authRouter);
app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/abonements", abonementRouter);
app.use("/api/sales", salesRouter);
app.use("/api/training-sessions", trainingRouter);

// Serve the React app for any other route
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
