const { DataSource } = require('typeorm');
require('dotenv').config({ debug: false, override: false });

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'popcorn_db',
  synchronize: false, 
  logging: process.env.NODE_ENV === 'development',
  entities: [__dirname + '/src/models/*.ts'],
  migrations: [__dirname + '/src/migrations/**/*.ts'],
  subscribers: [__dirname + '/src/subscribers/**/*.ts'],
  connectorPackage: 'mysql2',
  migrationsTableName: 'migrations',
  migrationsRun: false,
});

module.exports = AppDataSource;