import mongoose, { type ClientSession, type Document, type FilterQuery, type UpdateQuery } from 'mongoose'

export const CommonService = {
  /** Get paginated list */
  // async findAll<T extends Document>(Model: mongoose.Model<T>, filter: FilterQuery<T> = {}, options: { page?: number; limit?: number; sort?: any } = {}) {
  //   const { page = 1, limit = 20, sort = { created: -1 } } = options
  //   const skip = (page - 1) * limit

  //   const [items, total] = await Promise.all([
  //     Model.find(filter).sort(sort).skip(skip).limit(limit),
  //     Model.countDocuments(filter)
  //   ])

  //   return { items, total, page, limit }
  // },

  async findAll<T extends Document>(
    Model: mongoose.Model<T>,
    filter: FilterQuery<T> = {},
    options: { page?: number; limit?: number; sort?: any } = {}
  ) {
    // 1. Destructure and set default values
    // 'inputLimit' preserves the original value (potentially undefined) to check for pagination mode
    const { page = 1, limit: inputLimit, sort } = options;

    // Decide whether to paginate. If 'inputLimit' is undefined, we return all data.
    const isPaginated = inputLimit !== undefined;

    // If not paginating, Mongoose limit(0) means 'no limit' (return all).
    const limit = inputLimit ?? 0;

    // Calculate skip offset (only needed if paginated)
    const skip = isPaginated ? (page - 1) * limit : 0;

    // 2. Define the base find query
    let findQuery = sort ? Model.find(filter).sort(sort) : Model.find(filter);

    // Apply skip and limit ONLY IF pagination is requested
    if (isPaginated) {
      findQuery = findQuery.skip(skip).limit(limit);
    }

    // 3. Execute concurrently (Promise.all)
    const [items, total] = await Promise.all([
      findQuery.exec(), // Fetch the documents (items)

      // Only count total documents if in pagination mode.
      // Otherwise, resolve with 0 as 'items.length' will be used for the total count.
      isPaginated ? Model.countDocuments(filter) : Promise.resolve(0)
    ]);

    // 4. Return results based on the mode
    if (isPaginated) {
      // Pagination Mode
      return { items, total, page, limit };
    } else {
      // Non-Paginated (All Data) Mode
      // Total count is the number of items fetched.
      return { items, total: items.length, page: 1, limit: items.length };
    }
  },

  async findAllMatching<T extends Document>(
    Model: mongoose.Model<T>,
    filter: FilterQuery<T> = {},
    options: { sort?: any } = {}
  ) {
    const { sort = { created: -1 } } = options
    const items = await Model.find(filter).sort(sort)
    return items
  },

  /** Get details by ID */
  async findById<T extends Document>(Model: mongoose.Model<T>, id: string) {
    return await Model.findById(new mongoose.Types.ObjectId(id))
  },

  /** Full text search (if there is a text index) */
  async search<T extends Document>(Model: mongoose.Model<T>, keyword: string) {
    return await Model.find({ $text: { $search: keyword } } as any)
  },

  /** Get the distinct list */
  async distinct<T extends Document>(Model: mongoose.Model<T>, key: string, text: string) {
    const filter: Record<string, any> = {}
    // if (text) {
    filter[key] = new RegExp(text, 'i')
    return await Model.distinct(key, filter)
    // } else return await Model.distinct(key)
  },

  async distinctByIds<T extends Document>(Model: mongoose.Model<T>, key: keyof T, ids: (string | mongoose.Types.ObjectId)[], extraFilter: Record<string, any> = {}) {
    const filter: Record<string, any> = { ...extraFilter }
    if (ids?.length) {
      const objectIds = ids.map(id => new mongoose.Types.ObjectId(id))
      filter._id = { $in: objectIds }
    }
    return await Model.distinct(key as string, filter)
  },

  /** Find one by condition */
  async findOne<T extends Document>(Model: mongoose.Model<T>, filter: FilterQuery<T>) {
    return await Model.findOne(filter)
  },

  /** Check if exist (simpler syntax) */
  async exists<T extends Document>(Model: mongoose.Model<T>, filter: FilterQuery<T>, excludeId?: string) {
    if (excludeId) filter._id = { $ne: excludeId }
    return !!(await Model.exists(filter))
  },

  async checkExist<T extends mongoose.Document>(model: mongoose.Model<T>, field: keyof T, value: any, excludeId?: string): Promise<boolean> {
    const query: any = { [field]: value }
    // If there is excludeId (in case of update) then ignore it
    if (excludeId) query._id = { $ne: excludeId }
    const exist = await model.findOne(query).lean()
    return !!exist
  },

  async checkExistMulti<T extends mongoose.Document>(model: mongoose.Model<T>, conditions: Partial<Record<keyof T, any>>, excludeId?: string): Promise<boolean> {
    const query: any = { ...conditions }
    if (excludeId) query._id = { $ne: excludeId }

    const exist = await model.findOne(query).lean()
    return !!exist
  },

  /** Create new */
  async create<T extends Document>(Model: mongoose.Model<T>, data: Partial<T>, session?: ClientSession) {
    // if (uniqueKey && data[uniqueKey]) {
    //   const exist = await Model.findOne({ [uniqueKey]: (data[uniqueKey] as any)?.toUpperCase?.() })
    //   if (exist) throw new Error('exist')
    // }
    data._id = new mongoose.Types.ObjectId()
    const doc = new Model(data)
    return session ? doc.save({ session }) : doc.save()
  },

  /** ✏️ Update */
  async update<T extends Document>(Model: mongoose.Model<T>, id: string, data: UpdateQuery<T>, raw: boolean = false, session?: ClientSession) {
    try {
      const updateData = raw ? data : { $set: data }
      return await Model.findByIdAndUpdate(new mongoose.Types.ObjectId(id), updateData, { new: true, session })
    } catch (error) {
      console.log(error)
      return null
    }
  },

  /** Update flags for multiple IDs */
  async updateFlagByIds<T extends Document>(Model: mongoose.Model<T>, ids: string | string[], flag: number): Promise<Common.IResponseArray> {
    const rs: Common.IResponseArray = { success: [], error: [], status: false }

    const idArray = Array.isArray(ids) ? ids : [ids]
    const objectIds = idArray.map(id => new mongoose.Types.ObjectId(id))

    const result = await Model.updateMany(
      { _id: { $in: objectIds } },
      { $set: { flag } }
    )

    rs.success = idArray
    rs.status = result.modifiedCount > 0
    return rs
  },

  /** Delete by ID list */
  async deleteByIds<T extends Document>(Model: mongoose.Model<T>, ids: string | string[]): Promise<Common.IResponseArray> {
    const rs: Common.IResponseArray = { success: [], error: [], status: false }

    const idArray = Array.isArray(ids) ? ids : [ids]
    const objectIds = idArray.map(id => new mongoose.Types.ObjectId(id))

    const existing = await Model.find({ _id: { $in: objectIds } }, { _id: 1 })
    const existingIds = new Set(existing.map((d: any) => d._id.toString()))

    if (existingIds.size > 0) {
      await Model.deleteMany({ _id: { $in: Array.from(existingIds) } })
    }

    rs.success = idArray.filter(id => existingIds.has(id))
    rs.error = idArray.filter(id => !existingIds.has(id))
    rs.status = true

    return rs
  }
}
