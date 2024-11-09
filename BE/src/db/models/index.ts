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
  path.join(__dirname, '..', 'config', 'database.config.ts'),
).href;
const config = (await import(configPath)).default[env];

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // You might need this for self-signed certificates
        },
      },
      logging: config.logging,
    })
  : new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      dialectOptions: config.dialectOptions,
      logging: config.logging,
    });

const db: any = {};

const modelFiles = fs.readdirSync(__dirname).filter(file => {
  return (
    file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts'
  );
});

for (const file of modelFiles) {
  // Convert model file paths to `file://` URLs for dynamic import
  const modelPath = pathToFileURL(path.join(__dirname, file)).href;
  const model = (await import(modelPath)).default(sequelize);
  db[model.name] = model;
}

// Set up associations between models
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
