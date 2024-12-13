import mongoose from 'mongoose';
import { MONGODB_URI } from './config/mongodb.config.js';
import { logger } from '../utils/logger.js';
const connectToDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('Connected to database');
  } catch (err) {
    if (err instanceof Error) {
      logger.error('Error connecting to MongoDB:', err.message);
    } else {
      logger.error('Error connecting to MongoDB:', err);
    }
  }
};
export default connectToDB;
