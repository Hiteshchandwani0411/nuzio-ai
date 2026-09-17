import { Router } from 'express'
import { authenticate } from '../../middleware/auth.js'
import { validate } from '../../middleware/validate.js'
import { preferencesSchema } from './user.validation.js'
import * as userController from './user.controller.js'

const router = Router()

router.get('/me', authenticate, userController.getProfile)
router.get('/preferences', authenticate, userController.getPreferences)
router.put('/preferences', authenticate, validate(preferencesSchema), userController.updatePreferences)

export default router