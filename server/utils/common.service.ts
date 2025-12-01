import mongoose, { type ClientSession, type Document, type FilterQuery, type UpdateQuery } from 'mongoose'

export const CommonService = {

  /** * ✅ OPTIMIZED: Get paginated list 
   * Sử dụng .lean() để giảm tải bộ nhớ cho Vercel 
   */
  async findAll<T extends Document>(
    Model: mongoose.Model<T>,
    filter: FilterQuery<T> = {},
    options: { page?: number; limit?: number; sort?: any } = {}
  ) {
    // 1. Setup variables
    const { page = 1, limit: inputLimit, sort } = options;
    const isPaginated = inputLimit !== undefined;
    const limit = inputLimit ?? 0;
    const skip = isPaginated ? (page - 1) * limit : 0;

    // 2. Build Query with .lean()
    let findQuery = Model.find(filter).lean();

    if (sort) {
      findQuery = findQuery.sort(sort);
    }

    if (isPaginated) {
      findQuery = findQuery.skip(skip).limit(limit);
    }

    // 3. Execute concurrently
    const [items, total] = await Promise.all([
      findQuery.exec(),
      // Count documents cũng cần exec()
      isPaginated ? Model.countDocuments(filter).exec() : Promise.resolve(0)
    ]);

    // 4. Return result
    if (isPaginated) {
      return { items, total, page, limit };
    } else {
      return { items, total: items.length, page: 1, limit: items.length };
    }
  },

  /** * ✅ OPTIMIZED: Get list matching filter 
   */
  async findAllMatching<T extends Document>(
    Model: mongoose.Model<T>,
    filter: FilterQuery<T> = {},
    options: { sort?: any } = {}
  ) {
    const { sort = { createdAt: -1 } } = options
    // Thêm .lean()
    return await Model.find(filter).sort(sort).lean().exec()
  },

  /** * ✅ OPTIMIZED: Get details by ID 
   */
  async findById<T extends Document>(Model: mongoose.Model<T>, id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    // Thêm .lean()
    return await Model.findById(new mongoose.Types.ObjectId(id)).lean().exec()
  },

  /** * ✅ OPTIMIZED: Full text search 
   */
  async search<T extends Document>(Model: mongoose.Model<T>, keyword: string) {
    // Thêm .lean()
    return await Model.find({ $text: { $search: keyword } } as any).lean().exec()
  },

  /** * Get distinct list (Distinct trả về array primitive nên không cần lean)
   */
  async distinct<T extends Document>(Model: mongoose.Model<T>, key: string, text: string) {
    const filter: Record<string, any> = {}
    if (text) {
      filter[key] = new RegExp(text, 'i')
    }
    return await Model.distinct(key, filter).exec()
  },

  async distinctByIds<T extends Document>(Model: mongoose.Model<T>, key: keyof T, ids: (string | mongoose.Types.ObjectId)[], extraFilter: Record<string, any> = {}) {
    const filter: Record<string, any> = { ...extraFilter }
    if (ids?.length) {
      const objectIds = ids.map(id => new mongoose.Types.ObjectId(id))
      filter._id = { $in: objectIds }
    }
    return await Model.distinct(key as string, filter).exec()
  },

  /** * ✅ OPTIMIZED: Find one 
   */
  async findOne<T extends Document>(Model: mongoose.Model<T>, filter: FilterQuery<T>) {
    // Thêm .lean()
    return await Model.findOne(filter).lean().exec()
  },

  /** * Check if exist 
   */
  async exists<T extends Document>(Model: mongoose.Model<T>, filter: FilterQuery<T>, excludeId?: string) {
    if (excludeId) filter._id = { $ne: excludeId }
    const result = await Model.exists(filter)
    return !!result
  },

  /** * ✅ OPTIMIZED: Check exist custom field
   */
  async checkExist<T extends mongoose.Document>(model: mongoose.Model<T>, field: keyof T, value: any, excludeId?: string): Promise<boolean> {
    const query: any = { [field]: value }
    if (excludeId) query._id = { $ne: excludeId }
    // Chỉ select _id cho nhẹ
    const exist = await model.findOne(query).select('_id').lean().exec()
    return !!exist
  },

  async checkExistMulti<T extends mongoose.Document>(model: mongoose.Model<T>, conditions: Partial<Record<keyof T, any>>, excludeId?: string): Promise<boolean> {
    const query: any = { ...conditions }
    if (excludeId) query._id = { $ne: excludeId }
    const exist = await model.findOne(query).select('_id').lean().exec()
    return !!exist
  },

  /** * Create new 
   */
  async create<T extends Document>(Model: mongoose.Model<T>, data: Partial<T>, session?: ClientSession) {
    // Với create thì không dùng lean() vì cần trả về document để có thể save tiếp nếu cần logic sau đó
    // Tuy nhiên return về API thì object này sẽ được serialize JSON
    // data._id = new mongoose.Types.ObjectId() // Mongoose tự tạo ID, không cần dòng này trừ khi bắt buộc
    const doc = new Model(data)
    return session ? doc.save({ session }) : doc.save()
  },

  /** * ✅ OPTIMIZED: Update 
   */
  async update<T extends Document>(Model: mongoose.Model<T>, id: string, data: UpdateQuery<T>, raw: boolean = false, session?: ClientSession) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;

      const updateData = raw ? data : { $set: data }

      // Thêm { lean: true } vào options để trả về object thường sau khi update
      return await Model.findByIdAndUpdate(
        new mongoose.Types.ObjectId(id),
        updateData,
        { new: true, session, lean: true }
      ).exec()
    } catch (error) {
      console.log(error)
      return null
    }
  },

  /** * Update flags 
   */
  async updateFlagByIds<T extends Document>(Model: mongoose.Model<T>, ids: string | string[], flag: number): Promise<Common.IResponseArray> {
    const rs: Common.IResponseArray = { success: [], error: [], status: false }

    const idArray = Array.isArray(ids) ? ids : [ids]
    const objectIds = idArray.map(id => new mongoose.Types.ObjectId(id))

    const result = await Model.updateMany(
      { _id: { $in: objectIds } },
      { $set: { flag } }
    ).exec()

    rs.success = idArray
    rs.status = result.modifiedCount > 0
    return rs
  },

  /** * ✅ OPTIMIZED: Delete by ID list 
   */
  async deleteByIds<T extends Document>(Model: mongoose.Model<T>, ids: string | string[]): Promise<Common.IResponseArray> {
    const rs: Common.IResponseArray = { success: [], error: [], status: false }

    const idArray = Array.isArray(ids) ? ids : [ids]
    const objectIds = idArray.map(id => new mongoose.Types.ObjectId(id))

    // Optimize: Chỉ select _id và dùng lean()
    const existing = await Model.find({ _id: { $in: objectIds } })
      .select('_id')
      .lean()
      .exec()

    const existingIds = new Set(existing.map((d: any) => d._id.toString()))

    if (existingIds.size > 0) {
      await Model.deleteMany({ _id: { $in: Array.from(existingIds) } }).exec()
    }

    rs.success = idArray.filter(id => existingIds.has(id))
    rs.error = idArray.filter(id => !existingIds.has(id))
    rs.status = true

    return rs
  }
}