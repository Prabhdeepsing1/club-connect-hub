import express from 'express'
import { getGsocOrgs, getGsocOrgById } from '../controllers/gsocController.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = express.Router()

// Members only routes
router.get('/gsoc/orgs', requireAuth, getGsocOrgs)
router.get('/gsoc/orgs/:id', requireAuth, getGsocOrgById)

export default router