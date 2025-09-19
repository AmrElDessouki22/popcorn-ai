import CredentialsProvider from 'next-auth/providers/credentials';
import { UserRepository } from '@/repositories/UserRepository';
import { dbConnection } from '@/lib/database';
import { comparePassword } from '@/helpers/utils/password';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await dbConnection.connect();
          const userRepository = new UserRepository(dbConnection.getDataSource());
          const user = await userRepository.findOne({ email: credentials.email });

          if (!user) return null;

          const isPasswordValid = await comparePassword(credentials.password, user.password);
          if (!isPasswordValid) return null;

          return {
            id: user.id.toString(),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.phone = user.phone;
        token.isActive = user.isActive;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
      } else if (token.id && (!token.firstName || !token.createdAt)) {
        try {
          await dbConnection.connect();
          const userRepository = new UserRepository(dbConnection.getDataSource());
          const dbUser = await userRepository.findById(parseInt(token.id as string));
          if (dbUser) {
            token.firstName = dbUser.firstName;
            token.lastName = dbUser.lastName;
            token.phone = dbUser.phone;
            token.isActive = dbUser.isActive;
            token.createdAt = dbUser.createdAt;
            token.updatedAt = dbUser.updatedAt;
          }
        } catch (error) {
          console.error('JWT callback - error fetching user data from DB:', error);
        }
      }
      
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.phone = token.phone as string;
        session.user.isActive = token.isActive as boolean;
        session.user.createdAt = token.createdAt as Date;
        session.user.updatedAt = token.updatedAt as Date;
      }
      
      return session;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl + "/dashboard";
    },
  },
  pages: {
    signIn: '/auth/signin',
    newUser: '/dashboard',
  },
  // Use v1 API path for NextAuth
  basePath: '/api/v1/auth',
  secret: process.env.NEXTAUTH_SECRET,
};