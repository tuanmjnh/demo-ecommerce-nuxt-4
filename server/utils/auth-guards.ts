import type { H3Event } from 'h3'

/**
 * Check if authenticated user has at least one of the required roles
 * @param event H3Event
 * @param requiredRoles Array of role codes (e.g., ['ADMIN', 'MANAGER'])
 * @throws 403 if user doesn't have required role
 */
export const requireRole = (event: H3Event, requiredRoles: string[]) => {
  const auth = event.context.auth as System.JwtPayload | undefined

  if (!auth || !auth.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'error.unauthorized',
      message: 'Authentication required'
    })
  }

  const userRoles = auth.user.roles || []
  const hasRole = requiredRoles.some(role => userRoles.includes(role))

  if (!hasRole) {
    throw createError({
      statusCode: 403,
      statusMessage: 'error.forbidden',
      message: `Required role: ${requiredRoles.join(' or ')}`
    })
  }

  return auth
}

/**
 * Check if authenticated user has ALL of the required roles
 * @param event H3Event
 * @param requiredRoles Array of role codes
 * @throws 403 if user doesn't have all required roles
 */
export const requireAllRoles = (event: H3Event, requiredRoles: string[]) => {
  const auth = event.context.auth as System.JwtPayload | undefined

  if (!auth || !auth.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'error.unauthorized',
      message: 'Authentication required'
    })
  }

  const userRoles = auth.user.roles || []
  const hasAllRoles = requiredRoles.every(role => userRoles.includes(role))

  if (!hasAllRoles) {
    throw createError({
      statusCode: 403,
      statusMessage: 'error.forbidden',
      message: `Required all roles: ${requiredRoles.join(', ')}`
    })
  }

  return auth
}

/**
 * Check if authenticated user has access to a specific route
 * @param event H3Event
 * @param routePath Route path to check (e.g., '/admin/users')
 * @throws 403 if user doesn't have access to route
 */
export const requireRoute = (event: H3Event, routePath: string) => {
  const auth = event.context.auth as System.JwtPayload | undefined

  if (!auth || !auth.routes) {
    throw createError({
      statusCode: 401,
      statusMessage: 'error.unauthorized',
      message: 'Authentication required'
    })
  }

  const hasAccess = auth.routes.includes(routePath)

  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      statusMessage: 'error.forbidden',
      message: `Access denied to route: ${routePath}`
    })
  }

  return auth
}

/**
 * Check if user is admin (has ADMIN role)
 * @param event H3Event
 * @throws 403 if user is not admin
 */
export const requireAdmin = (event: H3Event) => {
  return requireRole(event, ['ADMIN'])
}

/**
 * Check if the authenticated user is accessing their own resource
 * @param event H3Event
 * @param resourceUserId The user ID of the resource being accessed
 * @param allowAdmin If true, admins can access any resource
 * @throws 403 if user is not the owner and not admin
 */
export const requireOwnerOrAdmin = (event: H3Event, resourceUserId: string, allowAdmin = true) => {
  const auth = event.context.auth as System.JwtPayload | undefined

  if (!auth || !auth.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'error.unauthorized',
      message: 'Authentication required'
    })
  }

  const isOwner = auth.user._id === resourceUserId
  const isAdmin = allowAdmin && (auth.user.roles || []).includes('ADMIN')

  if (!isOwner && !isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'error.forbidden',
      message: 'You can only access your own resources'
    })
  }

  return auth
}

/**
 * Get optional auth context (doesn't throw if not authenticated)
 * @param event H3Event
 * @returns Auth payload or null
 */
export const getOptionalAuth = (event: H3Event): System.JwtPayload | null => {
  return event.context.auth || null
}

/**
 * Check if user has specific permission based on custom logic
 * @param event H3Event
 * @param permissionCheck Custom function to check permission
 * @throws 403 if permission check fails
 */
export const requirePermission = (
  event: H3Event,
  permissionCheck: (auth: System.JwtPayload) => boolean,
  errorMessage = 'Permission denied'
) => {
  const auth = event.context.auth as System.JwtPayload | undefined

  if (!auth) {
    throw createError({
      statusCode: 401,
      statusMessage: 'error.unauthorized',
      message: 'Authentication required'
    })
  }

  if (!permissionCheck(auth)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'error.forbidden',
      message: errorMessage
    })
  }

  return auth
}
