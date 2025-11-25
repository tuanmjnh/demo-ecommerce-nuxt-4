/**
 * Calculate the total price of the order based on items
 * @param items List of order items
 * @returns Total amount
 */
export const calculateBillingTotal = (items: any[]) => {
  return items.reduce((sum, i) => sum + Number(i.price || 0) * Number(i.quantity || 0), 0)
}
