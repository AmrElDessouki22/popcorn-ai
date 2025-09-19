import { IService } from '../types/interfaces/IService';
import { dbConnection } from '@/lib/database';
import { UserRepository } from '@/repositories/UserRepository';
import { RoleRepository } from '@/repositories/RoleRepository';
import { User } from '@/models/User';
import { hashPassword, validatePasswordStrength } from '@/helpers/utils/password';

export class UserService implements IService<User> {
  private userRepository: UserRepository;
  private roleRepository: RoleRepository;

  constructor() {
    if (!dbConnection.isDatabaseConnected()) {
      throw new Error('Database connection not initialized. Call dbConnection.connect() first.');
    }
    this.userRepository = new UserRepository(dbConnection.getDataSource());
    this.roleRepository = new RoleRepository(dbConnection.getDataSource());
  }

  public async findById(id: number): Promise<User | null> {
    try {
      return await this.userRepository.findById(id);
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  public async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.findActiveUsers();
    } catch (error) {
      console.error('Error finding all users:', error);
      throw error;
    }
  }

  public async create(userData: Partial<User>): Promise<User> {
    try {
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        throw new Error('Email, password, firstName, and lastName are required');
      }

      const passwordValidation = validatePasswordStrength(userData.password);
      if (!passwordValidation.isValid) {
        throw new Error(`Password validation failed: ${passwordValidation.message}`);
      }

      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const hashedPassword = await hashPassword(userData.password);
      
      const userRole = await this.roleRepository.findByName('user');
      if (!userRole) {
        throw new Error('Default user role not found. Please contact support.');
      }
      
      const userToCreate = {
        ...userData,
        password: hashedPassword,
        roleId: userRole.id,
      };

      return await this.userRepository.create(userToCreate);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  public async update(id: number, userData: Partial<User>): Promise<User | null> {
    try {

      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      return await this.userRepository.update(id, userData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      return await this.userRepository.softDeleteUser(id);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  public async restore(id: number): Promise<boolean> {
    try {
      const existingUser = await this.userRepository.findByIdWithDeleted(id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      if (!existingUser.isDeleted()) {
        throw new Error('User is not deleted');
      }

      return await this.userRepository.restoreUser(id);
    } catch (error) {
      console.error('Error restoring user:', error);
      throw error;
    }
  }

  public async findDeleted(): Promise<User[]> {
    try {
      return await this.userRepository.findDeletedUsers();
    } catch (error) {
      console.error('Error finding deleted users:', error);
      throw error;
    }
  }

  public async hardDelete(id: number): Promise<boolean> {
    try {
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      return await this.userRepository.hardDelete(id);
    } catch (error) {
      console.error('Error hard deleting user:', error);
      throw error;
    }
  }

  public async findOne(filter: Partial<User>): Promise<User | null> {
    try {
      return await this.userRepository.findOne(filter);
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }

  public async findMany(filter: Partial<User>): Promise<User[]> {
    try {
      return await this.userRepository.findMany(filter);
    } catch (error) {
      console.error('Error finding users:', error);
      throw error;
    }
  }
}