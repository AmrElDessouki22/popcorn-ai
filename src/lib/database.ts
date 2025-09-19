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
        await AppDataSource.initialize();
        this.isConnected = true;
        console.log('Database connection established successfully');
      } catch (error) {
        console.error('Error during database connection:', error);
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