export { }
declare global {
  namespace Models {
    export interface Product {
      code: string // Product code (unique code)
      title: string // Product name
      slug: string // Friendly URL
      desc?: string // Short description
      content?: string // Detailed description
      groups: string[] // Category group
      variants: Models.IVariant[] // Category list
      stocks: IStock[] // Detailed inventory list
      priceSelling: number,
      pricePromotional: number,
      quantity: number,
      unit?: string // Unit (e.g., piece, box)
      brand?: string // Brand
      originName?: string // Origin
      originAddress?: string // Manufacturer address
      weight?: number // Weight
      warranty?: string // Warranty
      image?: Common.IFileAttach // Main image
      images?: Common.IFileAttach[] // Image set
      tags?: string[] // Search tag
      attributes?: Common.IMeta[] // Extended attributes (height length, width,...)
      meta?: Common.IMeta[] // Metadata SEO
      pins?: string[] // Pin to category
      sort?: number // Display order
      flag?: number // 0 inactive, 1 active, 2 drafts
      created: Common.IChangeData | null
      updated?: Common.IChangeData | null
    }
    export interface IProduct extends Product {
      _id?: string
    }
  }
}
