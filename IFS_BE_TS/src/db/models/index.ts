import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = (
  await import(path.join(__dirname, '..', 'config', 'database.config.ts'))
).default[env];

// console.log('Index --- ', config);

export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

const db: any = {};

const modelFiles = fs.readdirSync(__dirname).filter(file => {
  return (
    file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts'
  );
});

for (const file of modelFiles) {
  const model = (await import(path.join(__dirname, file))).default(sequelize);
  console.log('Model --- ', model);
  db[model.name] = model;
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
