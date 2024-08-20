const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");

const usersRouter = require("./routes/users.route");
const authRouter = require("./routes/auth.route");
const abonementRouter = require("./routes/abonement.route");
const trainingRouter = require("./routes/training.route");
const salesRouter = require("./routes/sales.route");

const middleware = require("./middlewares");
const { connectToDatabase } = require("./utils/db");
// const { scheduleDailyJob } = require("./utils/scheduledTrainingChecker");

if (process.env.NODE_ENV === "test") {
  // const testingRouter = require("./controllers/testing");
  app.use("/api/testing", usersRouter);
}
// Connect to the database
connectToDatabase();

// check the trainings and return to user abonement if needed
const db = require("./db/models/index");
db.sequelize.sync({ force: true });

console.log(db.User);
// console.log(
//   db.User.create({
//     firstName: "John",
//     lastName: "Doe",
//     email: "john.doe@example.com",
//   })
// );
// scheduleDailyJob();

app.use(cors());

app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/abonements", abonementRouter);
app.use("/api/training-sessions", trainingRouter);
app.use("/api/sales", salesRouter);

// Serve the React app for any other route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
