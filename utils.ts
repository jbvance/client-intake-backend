import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const createAuthToken = function (user: any): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('No JWT Secret was provided');
  }
  return jwt.sign({ user }, process.env.JWT_SECRET, {
    subject: user.email,
    expiresIn: process.env.JWT_EXPIRY,
    algorithm: 'HS256',
  });
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const validatePassword = (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

//module.exports = { createAuthToken, hashPassword, validatePassword };
