import express from 'express'
import { getAboutContent, updateAboutContent } from '../controllers/contentController.js'
import { requireAuth, requireAdmin } from '../middleware/requireAuth.js'

const router = express.Router()

// Public route - anyone can view about content
router.get('/content/about', getAboutContent)

// Admin only - update about content
router.put('/content/about', requireAuth, requireAdmin, updateAboutContent)

export default router