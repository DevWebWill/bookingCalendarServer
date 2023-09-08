import express from 'express';
import { register, login, logout, refresh, complete, user } from '../controllers/Auth.controller.js';
import auth from '../../middleware/auth.js';
import verifyJWT from './verifyjwt.js';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.post('/refresh', refresh);

router.post('/complete', complete);

router.get('/user', auth, user);

export default router;