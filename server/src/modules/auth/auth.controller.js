import { catchAsync } from '../../utils/catchAsync.js'
import * as authService from './auth.service.js'

export const register = catchAsync(async (req, res) => {
  const { user, token } = await authService.registerUser(req.body)
  res.status(201).json({ user, token })
})

export const login = catchAsync(async (req, res) => {
  const { user, token } = await authService.loginUser(req.body)
  res.status(200).json({ user, token })
})

export const logout = catchAsync(async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' })
})

export const getMe = catchAsync(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.sub)
  res.status(200).json({ user })
})