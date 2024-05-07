const jwt = require("jsonwebtoken");
const logger = require("./logger");
const User = require("../models/user");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  // logger.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: error.message });
  }

  next(error);
};

const tokenExtractor = (request, response, next) => {
  // code that extracts the token
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    request.token = authorization.replace("Bearer ", "");
  } else request.token = null;

  next();
};

const userExtractor = async (request, response, next) => {
  // code that extracts the user
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return response.status(401).json({ error: "Invalid user" });
    }

    request.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

const checkAdmin = async (request, response, next) => {
  try {
    if (!request.user) {
      return response.status(404).send({ message: "User not found" });
    }
    if (request.user.role !== "admin") {
      return response
        .status(500)
        .send({ message: "User do not have permission" });
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
