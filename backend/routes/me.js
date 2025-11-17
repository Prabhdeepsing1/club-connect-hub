import express from 'express';
import { getMe } from '../controllers/meController.js';

export const meRouter = express.Router();
meRouter.get('/', getMe);
