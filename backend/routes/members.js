import express from 'express'
import { getAllMembers, getCurrentMemberProfile, updateProfile } from '../controllers/memberController.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { requireAdmin } from '../middleware/requireAuth.js'

const router = express.Router()

// Admin only - get all members with stats
router.get('/', requireAuth, requireAdmin, getAllMembers)

// Member - get own extended profile
router.get('/profile', requireAuth, getCurrentMemberProfile)

// Member - update own profile
router.put('/profile', requireAuth, updateProfile)

export default router