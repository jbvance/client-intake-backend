import passportLocal from 'passport-local';
import { Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { validatePassword } from '../utils';

// Assigns the Strategy export to the name JwtStrategy using object destructuring
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const prisma = new PrismaClient();

//const { User } = require('../users/model');
const JWT_SECRET = process.env.JWT_SECRET;

const LocalStrategy = passportLocal.Strategy;
const localOptions = { usernameField: 'email' };

export const localStrategy = new LocalStrategy(
  localOptions,
  (email, password, callback) => {
    let user: { id: string; email: string; password: string } | null;
    prisma.user
      .findUnique({
        where: {
          email,
        },
      })
      .then((_user) => {
        user = _user;
        if (!user) {
          // Return a rejected promise so we break out of the chain of .thens.
          // Any errors like this will be handled in the catch block.
          return Promise.reject({
            reason: 'LoginError',
            message: 'Incorrect email or password',
          });
        }
        return validatePassword(password, user.password);
      })
      .then((isValid) => {
        if (!isValid) {
          return Promise.reject({
            reason: 'LoginError',
            message: 'Incorrect email or password',
          });
        }
        return callback(null, { id: user!.id, email: user!.email });
      })
      .catch((err) => {
        if (err.reason === 'LoginError') {
          return callback(null, false, err);
        }
        return callback(err, false);
      });
  }
);

// Extract the jwt from cookie if request is coming from a browser using cookies
const cookieExtractor = function (req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};

export const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    ]),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256'],
  },
  (payload: any, done: any) => {
    done(null, payload.user);
  }
);
