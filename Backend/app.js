const express = require("express");
const app = express();
const cors = require("cors");

const abonementRouter = require("./controllers/abonements");
const trainingRouter = require("./controllers/trainings");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const salesRouter = require("./controllers/sales");

const middleware = require("./utils/middleware");
const { connectToDatabase } = require("./utils/db");

if (process.env.NODE_ENV === "test") {
    const testingRouter = require("./controllers/testing");
    app.use("/api/testing", testingRouter);
}
// Connect to the database
connectToDatabase();

app.use(cors());
// app.use(express.static('build'))
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/abonements", abonementRouter);
app.use("/api/sales", salesRouter);
app.use("/api/training-sessions", trainingRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
