import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import { DatabaseConfig as Config } from '../../config/database';

// Import model initialization functions
import { initUserModel } from './user';
import { initAbonementModel } from './abonement';
import { config as dbConfig } from '../../config/database';

const basename: string = path.basename(__filename);
const env: string = process.env.NODE_ENV || 'development';

// Load the config based on the environment
const config: Config = dbConfig.development;

const db: { [key: string]: any } = {};

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(
    process.env[config.use_env_variable] as string,
    config,
  );
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'postgres', // Ensure this is correctly passed
    logging: config.logging,
    port: config.port,
  });
}

// Initialize models
initUserModel(sequelize);
initAbonementModel(sequelize);

// Read all model files in the current directory and import them into Sequelize
fs.readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.ts' && // Updated to '.ts' for TypeScript
      file.indexOf('.test.ts') === -1 // Updated to '.ts' for TypeScript
    );
  })
  .forEach((file: string) => {
    const modelPath = path.join(__dirname, file);
    const modelClass = require(modelPath).default;

    if (modelClass) {
      const model = modelClass(sequelize);
      db[model.name] = model;
    }
  });

// Set up associations, if any, for each model
Object.keys(db).forEach((modelName: string) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
