import { PrismaClient } from '@prisma/client';
import express from 'express';
import passport from 'passport';

import authRouter from './auth/router';
import clientRouter from './client/router';
import { localStrategy, jwtStrategy } from './auth/strategies';

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

const jwtAuth = passport.authenticate('jwt', { session: false });

passport.use(localStrategy);
passport.use(jwtStrategy);

// add prisma to request object so all the routes
// can access it without having to import into each
// route file
app.use(function (req, res, next) {
  req.prisma = prisma;
  next();
});

app.use('/api/auth', authRouter);
app.use('/api/client', clientRouter);

const port = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () =>
  console.log(`REST API server ready on Port ${port}`)
);
