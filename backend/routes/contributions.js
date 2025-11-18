import express from 'express'
import { getContributions, getContributionStats } from '../controllers/contributionController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.get('/contributions', requireAuth, getContributions)
router.get('/contributions/stats', requireAuth, getContributionStats)

export default router