import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { AuthModel } from '../models/auth.model'
import { UserModel } from '../models/user.model'
import { RoleModel } from '../models/role.model'
import { CommonService } from './common.service' // Assuming CommonService is in utils now or adjust path
import { createPassword, NewToken } from 'tm-libs/crypto'

// Helper
const hashToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

const getAuthRoutes = async (roles: string[]) => {
  const distinctRoutes = await CommonService.distinctByIds(RoleModel, 'routes', roles)
  return distinctRoutes.map(r => String(r))
}

const jwtSign = (payload: any, jwtSecret: any, jwtExpire: any) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpire || '1d' })
}

export const AuthService = {
  async register(args: any) {
    // Logic moved to UserService.create mostly, but kept here for consistency
    const exists = await UserModel.findOne({ username: args.username })
    if (exists) throw new Error('existUsername')

    const { password, salt } = await createPassword(args.password)
    const u = new UserModel({ ...args, password, salt })
    await u.save()

    const user = await UserModel.findById(u._id).select('-password -salt')
    return { user }
  },

  async login(args: {
    username: string,
    password: string,
    deviceId: string,
    deviceType: Common.DeviceType,
    deviceName?: string,
    ip?: string | null,
    jwtSecret: string,
    jwtExpire: string | number,
    jwtRefreshExpire: number,
    maxAllowed: number,
    userAgent?: string
  }) {
    // const config = useRuntimeConfig()

    // 1. Find User
    const user = await UserModel.findOne({ username: args.username }).select('+password +salt').lean<Models.IUser>()
    if (!user) throw new Error('invalidCredentials')

    // 2. Validate Password
    let match = false
    if (user.salt) {
      const hashed = await createPassword(args.password, user.salt)
      match = hashed.password === user.password
    } else {
      match = await bcrypt.compare(args.password, user.password)
    }
    if (!match) throw new Error('invalidCredentials')

    // 3. Check Device Limit
    // Parse config for max devices per type
    // config.maxDevices should be structured like { pc: 5, mobile: 5 } in nuxt.config
    // const maxConfig = (config.maxDevices as any) || {}
    // const maxAllowed = Number(maxConfig[args.deviceType.toLowerCase()] || 0)

    if (args.maxAllowed > 0) {
      const activeDevices = await AuthModel.countDocuments({ userId: user._id, deviceType: args.deviceType, flag: 1 })
      if (activeDevices >= args.maxAllowed) {
        // throw new Error(`Exceeded maximum number of ${args.deviceType} devices (${maxAllowed})`)
        throw new Error('deviceLimited')
      }
    }

    // 4. Generate Tokens
    const refreshToken = NewToken()
    const refreshTokenHash = hashToken(refreshToken)
    const refreshExpireAt = Date.now() + (Number(args.jwtRefreshExpire) || 30 * 24 * 3600 * 1000)

    const routes = await getAuthRoutes(user.roles)

    // Payload for Access Token
    const payload = {
      user: { _id: user._id, username: user.username, fullName: user.fullName, roles: user.roles },
      routes,
      // refreshToken: refreshTokenHash // Optional to include hash in JWT
    }

    const accessToken = jwtSign(payload, args.jwtSecret, args.jwtExpire)
    // const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpire || '1d' })

    // 5. Save Session
    await AuthModel.findOneAndUpdate(
      { userId: user._id, deviceId: args.deviceId },
      {
        $set: {
          deviceType: args.deviceType,
          deviceName: args.deviceName,
          userAgent: args.userAgent,
          refreshToken: refreshTokenHash,
          refreshExpireAt,
          ip: args.ip,
          flag: 1,
          updatedAt: Date.now()
        },
        $setOnInsert: {
          userId: user._id,
          deviceId: args.deviceId,
          createdAt: Date.now(),
        },
      },
      { upsert: true, new: true }
    )

    // 6. Update User Login Info
    const safeUser = await UserModel.findOneAndUpdate(
      { _id: user._id },
      { $set: { lastLogin: { at: Date.now(), ip: args.ip } } },
      { new: true }
    ).select('-password -salt')

    return { user: safeUser, routes, accessToken, refreshToken }
  },

  async refresh(args: { userId?: string, deviceId: string, refreshToken: string }) {
    const config = useRuntimeConfig()

    // Find session by deviceId (and userId if provided, though deviceId+refreshToken pair is usually enough)
    // We need to find the session that matches the device and has active flag
    // Note: Ideally we query by deviceId and verify the user later
    const query: any = { deviceId: args.deviceId, flag: 1 }
    if (args.userId) query.userId = args.userId

    const session = await AuthModel.findOne(query)
    if (!session) throw new Error('invalidRefreshToken')

    // Check expiry
    if (!session.refreshExpireAt || session.refreshExpireAt < Date.now()) {
      throw new Error('refreshExpired')
    }

    // Compare Token
    const providedHash = hashToken(args.refreshToken)
    const storedHash = session.refreshToken || ''

    // Safe Compare
    const providedBuffer = Buffer.from(providedHash)
    const storedBuffer = Buffer.from(storedHash)

    let isValid = false
    try {
      isValid = providedBuffer.length === storedBuffer.length && crypto.timingSafeEqual(providedBuffer, storedBuffer)
    } catch (e) { isValid = false }

    if (!isValid) {
      // Security: If token mismatch, maybe theft -> revoke session
      await AuthModel.deleteOne({ _id: session._id })
      throw new Error('invalidRefreshToken')
    }

    // Get User info for new token
    const user = await UserModel.findById(session.userId).lean<Models.IUser>()
    if (!user) throw new Error('noExistAccount')

    // Rotate Token
    const newRefreshToken = NewToken()
    const newRefreshTokenHash = hashToken(newRefreshToken)
    const refreshExpireAt = Date.now() + (Number(config.jwtRefreshExpire) || 30 * 24 * 3600 * 1000)

    const routes = await getAuthRoutes(user.roles)

    const payload = {
      user: { _id: user._id, username: user.username, fullName: user.fullName, roles: user.roles },
      routes
    }
    const accessToken = jwtSign(payload, config.jwtSecret, config.jwtExpire) //jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpire || '1d' })

    // Update Session
    session.refreshToken = newRefreshTokenHash
    session.refreshExpireAt = refreshExpireAt
    session.updatedAt = Date.now()
    await session.save()

    return { accessToken, refreshToken: newRefreshToken }
  },

  async listDevices(userId: string) {
    return AuthModel.find({ userId }).select('-refreshToken -__v')
  },

  async logout(userId: string, deviceId: string) {
    await AuthModel.findOneAndUpdate({ userId, deviceId }, { flag: 0 })
    return true
  },

  async revokeDevice(userId: string, deviceId: string) {
    await AuthModel.deleteOne({ userId, deviceId })
    return true
  },

  verifyToken(token: string, jwtSecret: string) {
    try {
      return jwt.verify(token, jwtSecret) as System.JwtPayload
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        const decoded = jwt.decode(token)
        throw { message: 'expired', decoded }
      }
      throw new Error('invalidAccessToken')
    }
  }
}
