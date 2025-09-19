
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      firstName: string;
      lastName: string;
      phone?: string;
      isActive: boolean;
      createdAt?: Date;
      updatedAt?: Date;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    phone?: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
}