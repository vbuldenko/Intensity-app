const mongoose = require("mongoose");
const config = require("../utils/config");
const logger = require("../utils/logger");

const connectToDatabase = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI);
        logger.info("Connected to MongoDB");
    } catch (error) {
        logger.error("Error connecting to MongoDB:", error.message);
    }
};

module.exports = { connectToDatabase };
