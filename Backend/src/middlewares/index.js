const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const User = require("../models/user");

const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method);
  logger.info("Path:  ", req.path);
  logger.info("Body:  ", req.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: error.message });
  }

  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    req.token = authorization.replace("Bearer ", "");
  } else req.token = null;

  next();
};

const userExtractor = async (req, res, next) => {
  try {
    // const decodedToken = jwt.verify(req.token, process.env.SECRET);
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ error: "Invalid user or token" });
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

const checkAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(404).send({ message: "User not found" });
    }
    if (req.user.role !== "admin") {
      return res.status(401).send({ message: "No permission" });
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
  checkAdmin,
};
