import { OptionsModel } from '../../models/options.model'

export default defineEventHandler(async (event) => {
  const rs: Common.IResponseItem = { type: 'meta-create', message: 'success', status: true, data: null }
  try {
    let body = await readBody(event)
    if (!Array.isArray(body)) body = [body]
    const user = event.context.auth?.user
    const operations = []

    for (const item of body) {
      if (!item.code) continue
      // const data = {
      //   key: 'meta',
      //   code: item,
      //   value: item,
      //   title: item,
      //   sort: 1,
      //   flag: 1,
      //   created: { at: Date.now(), by: user?.username, ip: getRequestIP(event) || null }
      // }
      operations.push({
        updateOne: {
          filter: { key: 'meta', code: item.code },
          update: {
            $setOnInsert: {
              ...item, key: 'meta', created: { at: Date.now(), by: user?.username, ip: getRequestIP(event) || null }
            }
          },
          upsert: true
        }
      })
    }

    if (operations.length > 0) await OptionsModel.bulkWrite(operations)
    rs.data = []
    setResponseStatus(event, 201)
    return rs
  } catch (e: any) {
    setResponseStatus(event, 201)
    return { data: [], success: null, status: true, message: e.message }
  }
})
