import express from 'express'
import { getAllEvents, addEvent, getEventLeaderboard, getMemberEvents } from '../controllers/eventController.js'
import { requireAuth,requireAdmin } from '../middleware/requireAuth.js'

const router = express.Router()

// Public/authenticated routes
router.get('/events', getAllEvents)
router.get('/leaderboard/:eventId', requireAuth, getEventLeaderboard)

// Member routes - requires authentication
router.get('/events/member/:memberId', requireAuth, getMemberEvents)

// Admin routes
router.post('/events', requireAuth, requireAdmin, addEvent)

export default router
