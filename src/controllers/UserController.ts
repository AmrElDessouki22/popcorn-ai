import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/UserService';
import { ApiResponseBuilder, handleApiError } from '@/helpers/utils/api';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async getUsers(): Promise<NextResponse> {
    try {
      const users = await this.userService.findAll();
      return NextResponse.json(
        ApiResponseBuilder.success(users, 'Users retrieved successfully')
      );
    } catch (error) {
      return NextResponse.json(
        handleApiError(error),
        { status: 500 }
      );
    }
  }

  public async getUserById(id: string): Promise<NextResponse> {
    try {
      const userId = parseInt(id);
      
      if (isNaN(userId)) {
        return NextResponse.json(
          ApiResponseBuilder.error('Invalid user ID', 'User ID must be a number'),
          { status: 400 }
        );
      }

      const user = await this.userService.findById(userId);

      if (!user) {
        return NextResponse.json(
          ApiResponseBuilder.error('User not found', 'No user found with the provided ID'),
          { status: 404 }
        );
      }

      return NextResponse.json(
        ApiResponseBuilder.success(user, 'User retrieved successfully')
      );
    } catch (error) {
      return NextResponse.json(
        handleApiError(error),
        { status: 500 }
      );
    }
  }

  public async createUser(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json();
      const user = await this.userService.create(body);

      return NextResponse.json(
        ApiResponseBuilder.success(user, 'User created successfully'),
        { status: 201 }
      );
    } catch (error) {
      const status = error instanceof Error && error.message.includes('already exists') ? 409 : 500;
      return NextResponse.json(
        handleApiError(error),
        { status }
      );
    }
  }

  public async updateUser(id: string, request: NextRequest): Promise<NextResponse> {
    try {
      const userId = parseInt(id);
      const body = await request.json();
      
      if (isNaN(userId)) {
        return NextResponse.json(
          ApiResponseBuilder.error('Invalid user ID', 'User ID must be a number'),
          { status: 400 }
        );
      }

      const user = await this.userService.update(userId, body);

      if (!user) {
        return NextResponse.json(
          ApiResponseBuilder.error('User not found', 'No user found with the provided ID'),
          { status: 404 }
        );
      }

      return NextResponse.json(
        ApiResponseBuilder.success(user, 'User updated successfully')
      );
    } catch (error) {
      return NextResponse.json(
        handleApiError(error),
        { status: 500 }
      );
    }
  }

  public async deleteUser(id: string): Promise<NextResponse> {
    try {
      const userId = parseInt(id);
      
      if (isNaN(userId)) {
        return NextResponse.json(
          ApiResponseBuilder.error('Invalid user ID', 'User ID must be a number'),
          { status: 400 }
        );
      }

      const deleted = await this.userService.delete(userId);

      if (!deleted) {
        return NextResponse.json(
          ApiResponseBuilder.error('User not found', 'No user found with the provided ID'),
          { status: 404 }
        );
      }

      return NextResponse.json(
        ApiResponseBuilder.success(null, 'User soft deleted successfully')
      );
    } catch (error) {
      return NextResponse.json(
        handleApiError(error),
        { status: 500 }
      );
    }
  }

  public async restoreUser(id: string): Promise<NextResponse> {
    try {
      const userId = parseInt(id);
      
      if (isNaN(userId)) {
        return NextResponse.json(
          ApiResponseBuilder.error('Invalid user ID', 'User ID must be a number'),
          { status: 400 }
        );
      }

      const restored = await this.userService.restore(userId);

      if (!restored) {
        return NextResponse.json(
          ApiResponseBuilder.error('User not found or not deleted', 'No deleted user found with the provided ID'),
          { status: 404 }
        );
      }

      return NextResponse.json(
        ApiResponseBuilder.success(null, 'User restored successfully')
      );
    } catch (error) {
      return NextResponse.json(
        handleApiError(error),
        { status: 500 }
      );
    }
  }

  public async getDeletedUsers(): Promise<NextResponse> {
    try {
      const users = await this.userService.findDeleted();
      return NextResponse.json(
        ApiResponseBuilder.success(users, 'Deleted users retrieved successfully')
      );
    } catch (error) {
      return NextResponse.json(
        handleApiError(error),
        { status: 500 }
      );
    }
  }

  public async hardDeleteUser(id: string): Promise<NextResponse> {
    try {
      const userId = parseInt(id);
      
      if (isNaN(userId)) {
        return NextResponse.json(
          ApiResponseBuilder.error('Invalid user ID', 'User ID must be a number'),
          { status: 400 }
        );
      }

      const deleted = await this.userService.hardDelete(userId);

      if (!deleted) {
        return NextResponse.json(
          ApiResponseBuilder.error('User not found', 'No user found with the provided ID'),
          { status: 404 }
        );
      }

      return NextResponse.json(
        ApiResponseBuilder.success(null, 'User permanently deleted successfully')
      );
    } catch (error) {
      return NextResponse.json(
        handleApiError(error),
        { status: 500 }
      );
    }
  }

}