import { z } from 'zod'

const itemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
})

export const BillingValidation = {
  // Structure: { group: { _id, code }, billing: { items, customer, note } }
  create: z.object({
    group: z.object({
      _id: z.string(),
      code: z.string(),
    }),
    billing: z.object({
      items: z.array(itemSchema).default([]),
      customer: z.string().optional(),
      note: z.string().optional(),
    })
  }),

  // Structure: { table: { billing: { _id, items }, group: { _id } }, items: [], reason: '' }
  update: z.object({
    table: z.object({
      billing: z.object({
        _id: z.string(),
        items: z.array(itemSchema).optional() // For history snapshot
      }),
      group: z.object({
        _id: z.string()
      })
    }),
    items: z.array(itemSchema), // New items list
    reason: z.string().optional()
  }),

  // For Patch actions (addItem, updateItem)
  itemAction: z.object({
    id: z.string(), // Billing ID
    item: itemSchema.optional(), // For add
    newItem: itemSchema.optional(), // For update
    oldItem: itemSchema.optional(), // For update
    productId: z.string().optional(), // For remove
    reason: z.string().optional()
  }),

  // For Pay/Cancel
  statusAction: z.object({
    billing: z.object({ _id: z.string() }).optional(),
    table: z.object({
      billing: z.object({ _id: z.string() }).optional()
    }).optional(),
    group: z.object({ _id: z.string() }).optional(),
    reason: z.string().optional()
  })
}
