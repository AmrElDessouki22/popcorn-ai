import { DataSource } from 'typeorm';
import { BaseRepository } from './BaseRepository';
import { User } from '@/models/User';

export class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(dataSource, User);
  }

  public async findByEmail(email: string, includeDeleted: boolean = false): Promise<User | null> {
    return await this.findOne({ email } as Partial<User>, includeDeleted);
  }

  public async findActiveUsers(includeDeleted: boolean = false): Promise<User[]> {
    return await this.findMany({ isActive: true } as Partial<User>, includeDeleted);
  }

  public async findInactiveUsers(): Promise<User[]> {
    return await this.findMany({ isActive: false } as Partial<User>);
  }

  public async softDeleteUser(id: number): Promise<boolean> {
    return await this.softDelete(id);
  }

  public async restoreUser(id: number): Promise<boolean> {
    return await this.restore(id);
  }

  public async findDeletedUsers(): Promise<User[]> {
    return await this.findDeleted();
  }
}