import { RoleModel } from '../models/role.model'
import { GroupModel } from '../models/group.model'
import { UserModel } from '../models/user.model'
import { createPassword } from 'tm-libs/crypto'
export async function seedDatabase() {
  try {
    // Roles
    const result: Partial<{ role: any, group: any, user: any }> = {}
    const roles: Models.IRole[] = [
      {
        key: 'system',
        code: 'ROOT',
        title: 'Root',
        desc: 'Root',
        level: 0,
        color: '#DA556C',
        icon: 'icon-park-outline:protect',
        routes: ['dashboard', 'workbench', 'monitor', 'profile', 'system', 'users', 'roles', 'routes', 'userGroups', 'options', 'config'],
        sort: 0,
        flag: 1,
        created: { at: Date.now(), by: 'system', ip: '' },
      }
    ]
    for (const r of roles) {
      const exists = await RoleModel.findOne({ code: r.code.toUpperCase() })
      if (!exists) result.role = await RoleModel.create(r)
      else result.role = exists
    }

    // Groups
    const groups: Models.IGroup[] = [
      {
        key: 'system',
        code: 'ROOT',
        title: 'Root Group',
        slug: 'root_group',
        slugFull: 'root_group',
        parent: null,
        desc: 'Root',
        level: 0,
        sort: 0,
        flag: 1,
        type: null,
        name: 'root',
        path: 'root',
        redirect: null,
        component: null,
        children: null,
        created: { at: Date.now(), by: 'system', ip: '' },
      }
    ]
    for (const g of groups) {
      const exists = await GroupModel.findOne({ code: g.code.toUpperCase() })
      if (!exists) result.group = await GroupModel.create(g)
      else result.group = exists
    }

    // Default root
    const root = await UserModel.findOne({ username: 'root' })
    if (!root) {
      const hashed = await createPassword('552-$2b$10$-dae67')
      const userRoot: Models.User = {
        username: 'root',
        password: hashed.password,
        groups: [result.group.code],
        fullName: 'Root',
        email: 'minhtuan200990@gmail.com',
        phone: '',
        personNumber: '',
        region: '',
        avatar: {
          'public_id': 'avatar-admin-default',
          'display_name': 'cb3e7456-7b83-3e9a-b287-cb691fe24a5e_vufudo',
          'url': 'http://res.cloudinary.com/dvkmve9tn/image/upload/v1762338160/avatar-admin-default.png',
          'format': 'png',
          'bytes': 56217,
          'created_at': 1762338160000
        },
        about: '',
        roles: [result.role._id],
        salt: hashed.salt,
        verified: true,
        flag: 1, // 1 'active', 2 'inactive', 3 'banned'
        created: { at: Date.now(), by: 'system', ip: '' }
      }
      await UserModel.create(userRoot)
      console.log('✅ Seeded root username: root / 552-$2b$10$-dae67')
    }
  } catch (err) {
    console.error('❌ Seed error', err)
  }
}
