'use strict';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
const router = express.Router();
const { createAuthToken, hashPassword } = require('../utils');

// Post to register a new user
router.post('/signup', async (req: Request, res: Response) => {
  const requiredFields = ['email', 'password'];
  const missingField = requiredFields.find((field) => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      success: false,
      message: `Missing field ${missingField}`,
    });
  }

  const stringFields = ['email', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    (field) => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      success: false,
      message: `Incorrect field type: expected string for field '${nonStringField}'`,
    });
  }

  // If the email and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
  const explicityTrimmedFields = ['email', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    (field) => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField,
    });
  }

  const sizedFields: any = {
    email: {
      min: 5,
    },
    password: {
      min: 10,
      // bcrypt truncates after 72 characters
      max: 72,
    },
  };
  const tooSmallField = Object.keys(sizedFields).find(
    (field) =>
      'min' in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField: any = Object.keys(sizedFields).find(
    (field) =>
      'max' in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `${tooSmallField} must be at least ${sizedFields[tooSmallField].min} characters long`
        : `${tooLargeField} must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField,
    });
  }

  let { email, password, firstName = '', lastName = '' } = req.body;
  // Email and password come in pre-trimmed, otherwise we throw an error
  // before this
  firstName = firstName.trim();
  lastName = lastName.trim();

  try {
    const user: any = await req.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return res.status(401).json({
        success: false,
        message: 'Email already taken',
        payload: {},
      });
    }

    // email is available, hash password and create user
    const hashedPassword: string = await hashPassword(password);
    const newUser = await req.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    // return user info and authtoken
    const userPayload = {
      id: newUser.id,
      email,
    };
    const authToken = createAuthToken(userPayload);
    return res.status(201).json({
      user: userPayload,
      authToken,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal server error - ' + err,
      payload: {},
    });
  }
});

const localAuth = passport.authenticate('local', { session: false });

//The user provides an email and password to login
router.post('/login', localAuth, (req: Request, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken, user: req.user });
});

const jwtAuth = passport.authenticate('jwt', { session: false });

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

export default router;
