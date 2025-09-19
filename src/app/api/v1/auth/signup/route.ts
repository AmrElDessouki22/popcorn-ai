import { NextRequest } from 'next/server';
import { AuthController } from '@/controllers/AuthController';

export async function POST(request: NextRequest) {
  const authController = new AuthController();
  return await authController.signup(request);
}