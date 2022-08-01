import { PrismaClient } from '@prisma/client';

declare namespace NodeJS {
  export interface ProcessEnv {
    HOST: string;
    DB_URL: string;
    DB_NAME?: string;
    JWT_SECRET: string;
  }
}

declare namespace Express {
  interface User {
    id: string;
    email: string;
  }
  export interface Request {
    user?: User;
  }
}
