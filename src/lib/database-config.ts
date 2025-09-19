import { DataSource } from 'typeorm';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
import { Role } from '@/models/Role';
import { Conversation } from '@/models/Conversation';
import { Message } from '@/models/Message';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'popcorn_db',
  synchronize: false, // We'll use migrations instead
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Product, Role, Conversation, Message],
  connectorPackage: 'mysql2',
});