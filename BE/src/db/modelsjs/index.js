import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// Convert `import.meta.url` to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

// Convert the path for the config file to a `file://` URL for dynamic import
const configPath = pathToFileURL(
  path.join(__dirname, '..', 'config', 'database.config.js'),
).href;
const config = (await import(configPath)).default[env];

export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

const db = {};

// Load model files
const modelFiles = fs.readdirSync(__dirname).filter(file => {
  return (
    file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  );
});

for (const file of modelFiles) {
  // Convert model file paths to `file://` URLs for dynamic import
  const modelPath = pathToFileURL(path.join(__dirname, file)).href;
  const model = (await import(modelPath)).default(sequelize);
  db[model.name] = model;
}

// Set up associations if they exist
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
