import { Document, Schema, model } from 'mongoose'
import { FileAttachSchema, ChangeDataSchema } from './common.model'

export interface UserDocument extends Models.User, Document { }
// const fileSchema = new Schema<Models.IFileAttach>({
//   public_id: String,
//   url: { type: String, required: true },
//   type: String,
//   size: Number,
//   created_at: { type: Number, default: () => Date.now() }
// }, { _id: false })

const userSchema = new Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  groups: { type: [String], required: true },
  fullName: { type: String, required: true },
  email: { type: String, default: null },
  phone: { type: String, default: null },
  personNumber: { type: String, default: null },
  region: { type: String, default: null },
  avatar: { type: FileAttachSchema, default: null },
  avatars: { type: [FileAttachSchema], default: [] },
  about: { type: String, default: null },
  dateBirth: { type: Number, default: null },
  gender: { type: String, default: null },
  address: { type: String, default: null },
  roles: { type: [String], default: [] },
  salt: { type: String, select: false },
  verified: { type: Boolean, default: false },
  flag: { type: Number, default: 1 }, // 1 'active', 2 'inactive', 3 'banned'
  lastLogin: { at: { type: Number, default: null }, ip: { type: String, default: null } },
  lastChangePass: { at: { type: Number, default: null }, ip: { type: String, default: null } },
  created: { type: ChangeDataSchema },
  updated: { type: ChangeDataSchema, default: null },
})

// userSchema.pre('save', async function (next) {
//   const user = this as any
//   if (!user.isModified('password')) return next()
//   const salt = await bcrypt.genSalt(12)
//   user.salt = salt
//   user.password = await bcrypt.hash(user.password, salt)
//   next()
// })
export const UserModel = model<UserDocument>('user', userSchema)

