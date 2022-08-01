import express, { Request, Response } from 'express';
import passport from 'passport';
const router = express.Router();
import { getClientInfo } from './controller';

const jwtAuth = passport.authenticate('jwt', { session: false });

router.get('/', jwtAuth, getClientInfo);

export default router;
