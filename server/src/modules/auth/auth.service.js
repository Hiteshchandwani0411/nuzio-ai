import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../../config/index.js'
import User from '../users/user.model.js'
import { getUserById } from '../users/user.service.js'
import { ApiError } from '../../utils/ApiError.js'

export async function registerUser(payload) {
  if (!payload?.email || !payload?.password) {
    throw new ApiError(400, 'Email and password are required')
  }

  const existing = await User.findOne({ email: payload.email })
  if (existing) {
    throw new ApiError(409, 'Email already registered')
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10)
  const user = await User.create({ ...payload, password: hashedPassword })
  return { user: user.toSafeObject(), token: signToken(user.id) }
}

export async function loginUser(payload) {
  if (!payload?.email || !payload?.password) {
    throw new ApiError(400, 'Email and password are required')
  }

  const user = await User.findOne({ email: payload.email }).select('+password')

  if (!user) {
    throw new ApiError(401, 'Invalid email or password')
  }

  if (!user.password) {
    throw new ApiError(401, 'This account is missing a password. Please reset or re-register it.')
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password)
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password')
  }

  return { user: user.toSafeObject(), token: signToken(user.id) }
}

export async function getCurrentUser(userId) {
  return getUserById(userId)
}

export function signToken(userId) {
  return jwt.sign({ sub: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  })
}