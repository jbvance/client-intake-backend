import { PrismaClient } from '@prisma/client';

// declare namespace NodeJS {
//   export interface ProcessEnv {
//     HOST: string;
//     DB_URL: string;
//     DB_NAME?: string;
//     JWT_SECRET: string;
//   }
// }

// declare namespace Express {
//   export interface Request {
//     user?: {
//       id: string;
//       email: string;
//     };
//   }
// }

declare namespace Express {
  export interface User {
    id: string;
    email: string;
  }
}

// declare module 'express-serve-static-core' {
//   interface Request {
//     prisma: PrismaClient;
//   }
// }
