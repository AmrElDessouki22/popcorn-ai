import path from "path";
import { DataSource } from 'typeorm';
import { User } from './src/models/User';
import { Product } from './src/models/Product';
import { Role } from './src/models/Role';
import { Conversation } from './src/models/Conversation';
import { Message } from './src/models/Message';
import 'dotenv/config';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'popcorn_db',
  synchronize: false, 
  logging: process.env.NODE_ENV === 'development',
  entities: [path.join(__dirname, '../models/**/*.{ts,js}')],
  migrations: [path.join(__dirname, "..", "migrations/**/*.{ts,js}")],
  subscribers: [path.join(__dirname, "..", "subscribers/**/*.{ts,js}")],
  connectorPackage: 'mysql2',
  migrationsTableName: 'migrations',
  migrationsRun: false,
});

export default AppDataSource;