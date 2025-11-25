import { UserModel } from '../models/user.model'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { createPassword } from 'tm-libs/crypto' // Ensure alias is configured

export const UserService = {
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  },

  async existsByField(field: keyof typeof UserModel.schema.obj, value: any, excludeId?: string): Promise<boolean> {
    return await CommonService.checkExist(UserModel, field, value, excludeId)
  },

  async findById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null
    const user = await UserModel.findById(id).lean()
    if (!user) return null

    // Sanitize sensitive data
    const u = user as any
    delete u.password
    delete u.salt
    return u
  },

  async create(data: any) {
    // Check duplicate username
    if (data.username) {
      const exist = await CommonService.checkExist(UserModel, 'username', data.username)
      if (exist) throw new Error('existUsername')
    }
    // Check duplicate email
    if (data.email) {
      const exist = await CommonService.checkExist(UserModel, 'email', data.email)
      if (exist) throw new Error('existEmail')
    }

    // Hash password
    const { password, salt } = await createPassword(data.password)
    data.password = password
    data.salt = salt

    const user = await CommonService.create(UserModel, data)

    // Sanitize return
    const obj = user.toObject() as any
    delete obj.password
    delete obj.salt
    return obj
  },

  async update(id: string, data: any) {
    // Check duplicates on update
    if (data.username) {
      const exist = await CommonService.checkExist(UserModel, 'username', data.username, id)
      if (exist) throw new Error('existUsername')
    }
    if (data.email) {
      const exist = await CommonService.checkExist(UserModel, 'email', data.email, id)
      if (exist) throw new Error('existEmail')
    }

    // If password is being updated directly (rare case, usually via separate endpoint)
    if (data.password) {
      const { password, salt } = await createPassword(data.password)
      data.password = password
      data.salt = salt
    }

    const updated = await CommonService.update(UserModel, id, data)
    if (!updated) throw new Error('noExist')

    const obj = updated.toObject() as any
    delete obj.password
    delete obj.salt
    return obj
  },

  async updateProfile(id: string, data: any) {
    // Use findByIdAndUpdate with select exclusion for safety
    const updated = await UserModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).select('-password -salt')

    return updated
  },

  async changePassword(id: string, oldPass: string, newPass: string) {
    const user = await UserModel.findById(id).select('+password +salt')
    if (!user) throw new Error('noExist')

    // Verify old password
    // Check if salt exists (legacy system support) or use simple bcrypt compare
    let isValid = false
    if (user.salt) {
      const hashedOld = await createPassword(oldPass, user.salt)
      isValid = hashedOld.password === user.password
    } else {
      isValid = await bcrypt.compare(oldPass, user.password)
    }

    if (!isValid) throw new Error('password')

    // Set new password
    const { password, salt } = await createPassword(newPass)
    user.password = password
    user.salt = salt
    // Reset tracking
    user.lastChangePass = { at: Date.now(), ip: '' }

    await user.save()
    return { message: 'Password updated successfully' }
  },

  async resetPassword(id: string, newPass: string) {
    const user = await UserModel.findById(id)
    if (!user) throw new Error('noExist')

    const { password, salt } = await createPassword(newPass)
    user.password = password
    user.salt = salt
    user.lastChangePass = { at: Date.now(), ip: 'system-reset' }

    await user.save()
    return { message: 'Password reset successfully' }
  },

  async delete(ids: string | string[]) {
    return await CommonService.deleteByIds(UserModel, ids)
  }
}
