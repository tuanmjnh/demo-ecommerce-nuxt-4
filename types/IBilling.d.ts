export { }
declare global {
  namespace Models {
    export interface OrderItem {
      productId: string,
      name: string,
      price: number,
      quantity: number,
    }
    export interface HistoryOrderItem {
      action: 'add' | 'update' | 'remove' | 'cancelled',
      items: OrderItem[],
      reason?: string,
      updated?: Common.IChangeData | null
    }
    export interface Billing {
      key: string
      code: string
      groupId: string
      items: OrderItem[],
      customer?: string,
      note?: string,
      total: number,
      status: Common.BillingStatusType,
      flag: number
      history?: HistoryOrderItem[] | null
      created: Common.IChangeData | null
      updated?: Common.IChangeData | null
    }
    export interface IBilling extends Billing {
      _id?: string
    }
    export interface BillingTable {
      group: Models.IGroup,
      billing?: Models.IBilling | null
    }
  }
}
