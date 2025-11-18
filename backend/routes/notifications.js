import express from 'express'
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../controllers/notificationController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.get('/notifications', requireAuth, getNotifications)
router.put('/notifications/:id/read', requireAuth, markNotificationAsRead)
router.put('/notifications/read-all', requireAuth, markAllNotificationsAsRead)

export default router