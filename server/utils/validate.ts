import { z } from 'zod'
import type { H3Event } from 'h3'

/**
 * Reads the request body and validates it against the provided Zod schema.
 * Throws a 400 error with formatted messages if validation fails.
 * * @param event The H3 event
 * @param schema The Zod schema to validate against
 * @returns The validated data with inferred types
 */
export const validateBody = async <T>(event: H3Event, schema: z.Schema<T>): Promise<T> => {
  // 1. Read the body from the request
  const body = await readBody(event)

  // 2. Parse with Zod
  const validation = schema.safeParse(body)

  // 3. Handle Validation Errors
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'error.validation',
      // Combine all error messages into a single string or keep structure as needed
      message: validation.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ')
    })
  }

  // 4. Return valid data
  return validation.data
}
