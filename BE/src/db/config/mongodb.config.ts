import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI =
  process.env.NODE_ENV === 'development'
      ? process.env.DEV_MONGODB_URI
      : process.env.MONGODB_URI;

export { MONGODB_URI };
