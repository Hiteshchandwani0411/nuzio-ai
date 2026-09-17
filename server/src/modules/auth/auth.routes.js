import { Router } from 'express'
import { authenticate } from '../../middleware/auth.js'
import { validate } from '../../middleware/validate.js'
import { registerSchema, loginSchema } from './auth.validation.js'
import * as authController from './auth.controller.js'

const router = Router()

router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)
router.post('/logout', authController.logout)
router.get('/me', authenticate, authController.getMe)

export default router