import { BaseRepository } from './BaseRepository';
import { Role } from '@/models/Role';
import { DataSource } from 'typeorm';

export class RoleRepository extends BaseRepository<Role> {
  constructor(dataSource: DataSource) {
    super(dataSource, Role);
  }

  /**
   * Find role by name
   * @param name - Role name
   * @returns Promise<Role | null>
   */
  public async findByName(name: string): Promise<Role | null> {
    try {
      return await this.repository.findOne({
        where: { name }
      });
    } catch (error) {
      console.error('Error finding role by name:', error);
      throw error;
    }
  }

  /**
   * Find all active roles
   * @returns Promise<Role[]>
   */
  public async findActiveRoles(): Promise<Role[]> {
    try {
      return await this.repository.find({
        where: { isActive: true }
      });
    } catch (error) {
      console.error('Error finding active roles:', error);
      throw error;
    }
  }
}