import jwt from 'jsonwebtoken'
import config from '../config/index.js'

export function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const token = header.split(' ')[1]
    req.user = jwt.verify(token, config.jwtSecret)
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}