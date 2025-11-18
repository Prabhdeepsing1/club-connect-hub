import express from 'express'
import { getAnalyticsOverview, getPRStats, getMemberActivity } from '../controllers/analyticsController.js'
import { requireAuth, requireAdmin } from '../middleware/requireAuth.js'

const router = express.Router()

// All analytics routes require admin access
router.get('/admin/analytics/overview', requireAuth, requireAdmin, getAnalyticsOverview)
router.get('/admin/analytics/pr-stats', requireAuth, requireAdmin, getPRStats)
router.get('/admin/analytics/member-activity', requireAuth, requireAdmin, getMemberActivity)

export default router