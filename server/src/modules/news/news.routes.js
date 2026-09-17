import { Router } from 'express'
import { authenticate } from '../../middleware/auth.js'
import * as newsController from './news.controller.js'

const router = Router()

router.get('/personalized', authenticate, newsController.getPersonalized)
router.get('/', authenticate, newsController.getFeed)
router.get('/search', authenticate, newsController.search)
router.get('/:id', authenticate, newsController.getArticle)

export default router