import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      prisma: PrismaClient;
    }
  }
}

const app = express();
app.use(express.json());

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

// add prisma to request object so all the routes
// can access it without having to import into each
// route file
app.use(function (req, res, next) {
  req.prisma = prisma;
  next();
});

const port = process.env.PORT || 3000;
app.listen(process.env.PORT || 3000, () =>
  console.log(`REST API server ready on Port ${port}`)
);
