import express from 'express';
import { getAllEvents, addEvent } from '../controllers/eventController.js'
import { requireAuth, requireAdmin } from '../middleware/requireAuth.js';



export const eventRouter = express.Router()

eventRouter.get('/events', getAllEvents);
eventRouter.post('/events', requireAuth, requireAdmin, addEvent);