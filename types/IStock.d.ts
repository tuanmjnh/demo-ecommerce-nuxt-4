import { Types } from "mongoose"
export { }
declare global {
  namespace Models {
    export interface Stock {
      productId: string | Types.ObjectId    // ID sản phẩm cha
      variantCombination: string[]          // Mảng các option ID (VD: ["2.5g", "Lưỡi đôi"])
      sku: string                           // Mã SKU riêng biệt
      price: number                         // Giá bán
      priceImport?: number                  // Giá nhập
      priceSale?: number                    // Giá khuyến mãi
      quantity: number                      // Số lượng tồn kho hiện tại
      warehouseId?: string                  // Nếu quản lý đa kho
      image?: Common.IFileAttach            // Ảnh riêng của biến thể
      barcode?: string
      qrcode?: string
      updatedAt?: number                    // Thời gian cập nhật cuối
    }
    export interface IStock extends Stock {
      _id?: string
    }
  }
}
