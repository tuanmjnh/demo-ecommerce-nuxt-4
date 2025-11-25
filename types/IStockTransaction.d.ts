import { Types } from "mongoose"
export { }
declare global {
  namespace Models {
    export interface StockTransaction {
      stockId: string | Types.ObjectId                        // Liên kết đến IStock
      productId: string | Types.ObjectId
      warehouseId?: string | Types.ObjectId
      type: 'import' | 'export' | 'adjust'  // Loại giao dịch
      quantity: number                      // Số lượng thay đổi
      price?: number                        // Giá nhập hoặc giá bán
      total?: number                        // Tổng tiền (nếu có)
      note?: string                         // Ghi chú (VD: "Nhập hàng đợt 1")
      created: Common.IChangeData | null           // Người thực hiện, Thời điểm tạo, IP thực hiện
      updated?: Common.IChangeData | null          // Người cập nhật, Thời điểm cập nhật, IP cập nhật
      createdAt?: number
      updatedAt?: number
    }
    export interface IStockTransaction extends StockTransaction {
      _id?: string
    }
  }
}
