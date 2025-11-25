export { }
declare global {
  namespace Models {
    export interface Warehouse {
      title: string              // Tên kho (VD: "Kho Hà Nội", "Kho Hồ Chí Minh")
      code: string               // Mã kho (VD: "HN", "HCM")
      address?: string           // Địa chỉ cụ thể
      contactName?: string       // Người liên hệ
      contactPhone?: string      // số điện thoại liên hệ
      description?: string       // Mô tả chi tiết
      status?: 'active' | 'inactive'
      created: Common.IChangeData | null
      updated?: Common.IChangeData | null
    }
    export interface IWarehouse extends Warehouse {
      _id?: string
    }
  }
}
