import { catchAsync } from '../../utils/catchAsync.js'
import * as userService from './user.service.js'

export const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user.sub)
  res.status(200).json({ user })
})

export const getPreferences = catchAsync(async (req, res) => {
  const result = await userService.getPreferences(req.user.sub)
  res.status(200).json(result)
})

export const updatePreferences = catchAsync(async (req, res) => {
  const result = await userService.updatePreferences(req.user.sub, req.body)
  res.status(200).json(result)
})