import { Dialect } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export interface DatabaseConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: Dialect;
  use_env_variable?: string;
  logging: boolean | ((sql: string, timing?: number) => void);
}

interface Config {
  development: DatabaseConfig;
  test: DatabaseConfig;
  production: DatabaseConfig;
}

const config: Config = {
  development: {
    username: 'fsadmin',
    password: '5pYiaw9DBCTnsruaoWylw8djfF0ltWbP',
    database: 'dbifs',
    host: 'dpg-cs7nbpt6l47c73c69eh0-a',
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // You might need this for self-signed certificates
      },
    },
  },
  test: {
    username: process.env.DB_USER || 'test_user',
    password: process.env.DB_PASS || 'test_pass',
    database: process.env.DB_NAME || 'test_db',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.DB_USER || 'prod_user',
    password: process.env.DB_PASS || 'prod_pass',
    database: process.env.DB_NAME || 'prod_db',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false,
  },
};

export default config;
