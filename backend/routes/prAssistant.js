import express from 'express'
import { analyzePR } from '../controllers/prAssistantController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

router.post('/pr-assistant/analyze', requireAuth, analyzePR)

export default router