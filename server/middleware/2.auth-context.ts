import jwt from 'jsonwebtoken'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  // 1. Get header
  const header = getHeader(event, 'authorization') || getHeader(event, 'x-access-token')

  if (!header) return

  // 2. Token standardization
  const token = String(header).replace(/^Bearer\s+/i, '')

  try {
    // 3. Verify and assign to context
    const decoded = jwt.verify(token, config.jwt_secret)
    event.context.auth = decoded // Now you can access event.context.auth anywhere
  } catch (err) {
    // Token error or expired -> Do nothing, let auth guard handle it later
    event.node.res.statusCode = 401
    event.node.res.statusMessage = 'Unauthorized'
    return 'Unauthorized'
  }
})
