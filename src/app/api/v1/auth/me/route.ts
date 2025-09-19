import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { AuthController } from '@/controllers/AuthController';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const authController = new AuthController();
  return await authController.getProfile(request, session);
}