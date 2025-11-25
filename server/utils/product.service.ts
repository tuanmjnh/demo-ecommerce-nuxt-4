import { ProductModel } from '../models/product.model'

export const ProductService = {
  /**
   * Update stock information for a product
   */
  async updateStock(productId: string, stockData: any[]) {
    return await ProductModel.findByIdAndUpdate(
      productId,
      { $set: { stocks: stockData } },
      { new: true }
    )
  }
}
