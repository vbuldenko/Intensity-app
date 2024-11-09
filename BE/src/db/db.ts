import mongoose from 'mongoose';
import { MONGODB_URI } from './config/mongodb.config';
import { error, info } from '../utils/logger';

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    info('Connected to MongoDB');
  } catch (err) {
    error('Error connecting to MongoDB:', error.message);
  }
};

export default connectToDB;
