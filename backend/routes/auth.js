import express from 'express';
import { registerUser } from '../controllers/authController.js';
import { loginUser } from '../controllers/authController.js';
import { logoutUser } from '../controllers/authController.js';

export const authRouter = express.Router();
authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);