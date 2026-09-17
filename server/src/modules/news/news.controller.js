import { catchAsync } from '../../utils/catchAsync.js'
import * as newsService from './news.service.js'
import { buildBrief } from '../brief/brief.service.js'

export const getPersonalized = catchAsync(async (req, res) => {
  const payload = await buildBrief(req.user.sub, req)
  res.status(200).json(payload)
})

export const getFeed = catchAsync(async (req, res) => {
  const { articles, provider, page, totalPages } = await newsService.getPersonalizedFeed(
    req.user.sub,
    req.query,
  )
  res.status(200).json({ articles, provider, page, totalPages })
})

export const search = catchAsync(async (req, res) => {
  const { articles, provider } = await newsService.searchArticles(req.query.query)
  res.status(200).json({ articles, provider })
})

export const getArticle = catchAsync(async (req, res) => {
  const article = await newsService.getArticleById(req.params.id)
  if (!article) {
    res.status(404).json({ message: 'Article not found' })
    return
  }
  res.status(200).json({ article })
})