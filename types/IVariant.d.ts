export { }
declare global {
  namespace Models {
    export interface IVariantOption {
      // _id: string                // ID duy nhất cho lựa chọn
      label: string             // Tên hiển thị (VD: "2.5g")
      value: string             // Giá trị lưu trữ (VD: "2.5")
      image?: Common.IFileAttach       // Ảnh riêng cho lựa chọn (nếu có)
    }
    export interface Variant {
      name: string              // Tên phân loại (VD: "Trọng lượng")
      options: IVariantOption[] // Danh sách các giá trị của nhóm
      showImage?: boolean       // Có hiển thị ảnh cho từng lựa chọn không
      order?: number            // Thứ tự hiển thị
      desc?: string             // Mô tả cho phân loại
      created?: Common.IChangeData | null
      updated?: Common.IChangeData | null
    }
    export interface IVariant extends Variant {
      _id?: string
    }
  }
}
