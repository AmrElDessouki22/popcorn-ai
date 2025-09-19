import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { UserController } from '@/controllers/UserController';
import { dbConnection } from '@/lib/database';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnection.connect();
    const userController = new UserController();
    return await userController.getUsers();
  } catch (error) {
    console.error('Database connection error:', error);
    return new Response(JSON.stringify({ error: 'Database connection failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

