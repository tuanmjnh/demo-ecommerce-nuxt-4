export { }
declare global {
  namespace Models {
    export interface User {
      username: string
      password: string
      groups: string[]
      fullName: string
      email: string
      phone?: string
      personNumber?: string
      region?: string
      avatar?: Common.IFileAttach | null
      avatars?: Common.IFileAttach[] | null
      about?: string
      dateBirth?: number | null,
      gender?: string
      address?: string
      roles: string[]
      salt: string
      verified: boolean
      flag: number // 1 'active', 2 'inactive', 3 'banned'
      lastLogin?: Common.ILastAccess | null,
      lastChangePass?: Common.ILastAccess | null,
      created: Common.IChangeData | null
      updated?: Common.IChangeData | null
    }
    export interface IUser extends User {
      _id?: string
    }
  }
}
