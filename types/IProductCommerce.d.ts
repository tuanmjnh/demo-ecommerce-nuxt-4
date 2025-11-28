declare namespace Models {
  // --- A. CÁC TYPE HỖ TRỢ SẢN PHẨM ---

  export type ProductType = 'simple' | 'variable' | 'virtual'; // Đơn giản | Có biến thể | Sản phẩm ảo
  export type StockStatus = 'instock' | 'outofstock' | 'onbackorder';

  // 1. Quản lý giá
  export interface IProductPrice {
    regular: number; // Giá gốc
    sale?: number; // Giá khuyến mãi
    saleStart?: number; // Ngày bắt đầu giảm giá
    saleEnd?: number; // Ngày kết thúc giảm giá
    currency: string; // 'VND', 'USD'
  }

  // 2. Quản lý kho (Inventory)
  export interface IInventory {
    sku: string; // Mã sản phẩm (Unique)
    manageStock: boolean; // Có quản lý số lượng tồn kho không?
    quantity: number; // Số lượng còn lại
    status: StockStatus; // Trạng thái kho
    sold?: number; // Số lượng đã bán (để hiển thị "Đã bán 100+")
  }

  // 3. Thuộc tính (Dùng cho lọc: Màu sắc, Kích thước, Thương hiệu)
  export interface IAttribute {
    key: string; // vd: 'color', 'size', 'brand'
    name: string; // vd: 'Màu sắc', 'Kích thước'
    options: string[]; // vd: ['Xanh', 'Đỏ'], ['S', 'M', 'L']
    isVariation: boolean; // Có dùng để tạo biến thể không?
    isVisible: boolean; // Có hiện ra ở tab "Thông tin thêm" không?
  }

  // 4. Biến thể (Variants - Khi user chọn Màu Đỏ + Size S thì ra giá khác)
  export interface IVariation {
    _id: string; // ID riêng của biến thể
    sku?: string;
    price: IProductPrice;
    inventory: IInventory;
    attributes: { [key: string]: string }; // { color: 'Red', size: 'S' }
    image?: Common.IFileAttach; // Ảnh riêng cho biến thể này (ví dụ áo màu đỏ)
  }

  // --- B. INTERFACE SẢN PHẨM CHÍNH ---

  // Kế thừa toàn bộ Post (Title, Slug, Content, SEO, Author...)
  export interface Product extends Post {
    // Ghi đè hoặc định nghĩa lại type
    type: 'product';
    productType: ProductType; // simple/variable

    // Dữ liệu bán hàng cốt lõi
    price: IProductPrice;
    inventory: IInventory;

    // Thuộc tính & Biến thể
    attributes?: IAttribute[];
    variations?: IVariation[]; // Chỉ dùng nếu productType = 'variable'

    // Sản phẩm bán chéo (Upsell/Cross-sell)
    upsellIds?: string[]; // Gợi ý sản phẩm xịn hơn
    crossSellIds?: string[]; // Gợi ý mua kèm (vd: Mua điện thoại gợi ý ốp lưng)

    // Thông số kỹ thuật chi tiết (đặc thù hàng điện máy/nội thất)
    specs?: { label: string, value: string }[]; // [{label: 'Chất liệu', value: 'Gỗ Sồi'}]
  }

  export interface IProduct extends Product {
    _id?: string;
  }
}