import { AppDataSource } from './database-config';
import 'reflect-metadata';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        console.log('Initializing database connection...');
        
        await AppDataSource.initialize();
        this.isConnected = true;
        
        console.log('Database connection established successfully');
        console.log('Connected entities:', AppDataSource.entityMetadatas.map(meta => meta.name));
        console.log('Message entity metadata:', AppDataSource.entityMetadatas.find(meta => meta.name === 'Message'));
      } catch (error) {
        console.error('Error during database connection:', error);
        console.error('Entity metadata available:', AppDataSource.entityMetadatas.length);
        throw error;
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      await AppDataSource.destroy();
      this.isConnected = false;
      console.log('Database connection closed');
    }
  }

  public getDataSource() {
    return AppDataSource;
  }

  public isDatabaseConnected(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const dbConnection = DatabaseConnection.getInstance();