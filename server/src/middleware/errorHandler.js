export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500
  const payload = { message: err.message || 'Internal Server Error' }
  if (process.env.NODE_ENV === 'development' && err.stack) {
    payload.stack = err.stack
  }
  res.status(statusCode).json(payload)
}