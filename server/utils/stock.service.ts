import { ModelStock } from '../models/stock.model'
import { ModelStockTransaction } from '../models/stock-transaction.model'
import { ProductModel } from '../models/product.model'
import mongoose from 'mongoose'

export const StockService = {
  /**
   * Perform a stock transaction (Import/Export/Adjust)
   * This automatically updates the Stock quantity and logs the Transaction
   */
  async performTransaction(data: {
    productId: string,
    warehouseId: string,
    type: 'import' | 'export' | 'adjust',
    quantity: number,
    price?: number,
    note?: string,
    variantCombination?: string[],
    user?: any, // Auth user info
    ip?: string
  }) {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      // 1. Find or Create Stock Entry
      // We need a specific stock record for this Product + Warehouse + Variant combo
      let stock = await ModelStock.findOne({
        productId: data.productId,
        warehouseId: data.warehouseId,
        variantCombination: { $eq: data.variantCombination || [] }
      }).session(session)

      if (!stock) {
        if (data.type === 'export') {
          throw new Error('Stock record not found for export')
        }
        // If import/adjust, create new stock record if missing
        // Note: SKU generation logic should ideally be here or passed in
        const sku = `SKU-${Date.now()}`
        stock = new ModelStock({
          productId: data.productId,
          warehouseId: data.warehouseId,
          variantCombination: data.variantCombination || [],
          sku: sku,
          price: data.price || 0,
          quantity: 0
        })
      }

      // 2. Calculate New Quantity
      const oldQty = stock.quantity || 0
      let newQty = oldQty

      if (data.type === 'import') {
        newQty = oldQty + data.quantity
      } else if (data.type === 'export') {
        if (oldQty < data.quantity) {
          throw new Error(`Insufficient stock. Current: ${oldQty}, Request: ${data.quantity}`)
        }
        newQty = oldQty - data.quantity
      } else if (data.type === 'adjust') {
        newQty = data.quantity // Set to specific value
      }

      // 3. Update Stock
      stock.quantity = newQty
      if (data.price && data.type === 'import') {
        stock.priceImport = data.price // Update latest import price
      }
      await stock.save({ session })

      // 4. Create Transaction Log
      const transaction = new ModelStockTransaction({
        stockId: stock._id,
        productId: data.productId,
        warehouseId: data.warehouseId,
        type: data.type,
        quantity: data.quantity, // Always store positive value of transaction
        price: data.price || stock.price,
        total: (data.price || stock.price) * data.quantity,
        note: data.note,
        created: { at: Date.now(), by: data.user?.username || 'system', ip: data.ip }
      })
      await transaction.save({ session })

      // 5. Optional: Sync total quantity to Product Model (if you keep a cache there)
      // await ProductService.recalculateTotalStock(data.productId, session)

      await session.commitTransaction()
      return transaction

    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }
}
