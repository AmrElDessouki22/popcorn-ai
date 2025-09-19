import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/services/UserService';
import { dbConnection } from '@/lib/database';
import { ApiResponseBuilder, handleApiError } from '@/helpers/utils/api';

export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = null as any;
  }
  public async signup(request: NextRequest): Promise<NextResponse> {
    try {
      await dbConnection.connect();
      
      this.userService = new UserService();
      
      const body = await request.json();
      
      if (!body.email || !body.password || !body.firstName || !body.lastName) {
        return NextResponse.json(
          ApiResponseBuilder.error('Email, password, firstName, and lastName are required'),
          { status: 400 }
        );
      }

      const result = await this.userService.create(body);
      
      const { password, ...userWithoutPassword } = result;
      
      return NextResponse.json(
        ApiResponseBuilder.success(userWithoutPassword, 'User registered successfully')
      );
    } catch (error) {
      console.error('Signup error:', error);
      return NextResponse.json(
        handleApiError(error),
        { status: 400 }
      );
    }
  }


  public async getProfile(request: NextRequest, session: any): Promise<NextResponse> {
    try {
      await dbConnection.connect();
      
      this.userService = new UserService();
      
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const user = await this.userService.findById(parseInt(session.user.id));
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const { password, ...userWithoutPassword } = user;
      
      return NextResponse.json(
        ApiResponseBuilder.success(userWithoutPassword, 'User profile retrieved successfully')
      );
    } catch (error) {
      console.error('Get profile error:', error);
      return NextResponse.json(
        handleApiError(error),
        { status: 500 }
      );
    }
  }
}