import mongoose from 'mongoose';
import { MONGODB_URI } from './config/mongodb.config';
import { logger } from '../utils/logger';

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI as string);
    logger.info('Connected to MongoDB');
  } catch (err) {
    if (err instanceof Error) {
      logger.error('Error connecting to MongoDB:', err.message);
    } else {
      logger.error('Error connecting to MongoDB:', err);
    }
  }
};

export default connectToDB;
