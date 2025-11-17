import express from 'express';
import { getAllApplications, getApplicationById } from '../controllers/applicationController.js';

export const applicationRouter = express.Router();

applicationRouter.get('/', getAllApplications);
applicationRouter.get('/:id', getApplicationById);