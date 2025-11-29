/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const database = 'demo-ecommerce';
const collection = 'options';

// Create a new database.
use(database);

// Create a new collection.
// db.createCollection(collection);
// db.posts.find({ pins: { $in: ['POST_FEATURED']}}).sort({ createdAt: -1 })
db.menus.updateMany({}, { $set: { locations: ['HEADER_MAIN'] } })
// db.types.find({code:'test'})
// db.groups.updateMany({}, { $set: { icon: 'icon-park-outline:group' } })
// db.groups.find({ color: '#607d8b' })
// db.groups.updateMany({ color: '#D7D7D8' }, { $set: { color: '#2b2b2b' } })
// db.groups.countDocuents({ code: new RegExp('HANGNGOAI', 'i'), _id: { $ne: ObjectId('6125b6bf9b2efc2d4c4befec') } })
// db.groups.find({ code: 'manager' })
// db.news.find()
// db.news.distinct('groups')
// db.news.find({ groups: { $in: ['0CB982EF'] } })
// db.news.updateMany({ groups: { $in: ['D76F09D8'] } }, { $set: { groups: ['68ff7dfffcff9e2aa0aedd83'] } })
// db.news.updateMany({}, { $set: { bottomContent: 'Hy vọng với những thông tin được chia sẻ của "Bag VN" về xây nhà trọn gói tại Thái Nguyên sẽ giúp cho Quý Khách hàng có được những quyết định đúng đắn nhất trên hành trình hoàn thiện ngôi nhà mơ ước của mình!' } })
// db.news.updateMany({}, { $set: { "author": "Admin", "date": 1761843600000 } })
// db.options.countDocuments()
// db.groups.countDocuments()
// The prototype form to create a collection:
/* db.createCollection( <name>,
  {
    capped: <boolean>,
    autoIndexId: <boolean>,
    size: <number>,
    max: <number>,
    storageEngine: <document>,
    validator: <document>,
    validationLevel: <string>,
    validationAction: <string>,
    indexOptionDefaults: <document>,
    viewOn: <string>,
    pipeline: <pipeline>,
    collation: <document>,
    writeConcern: <document>,
    timeseries: { // Added in MongoDB 5.0
      timeField: <string>, // required for time series collections
      metaField: <string>,
      granularity: <string>,
      bucketMaxSpanSeconds: <number>, // Added in MongoDB 6.3
      bucketRoundingSeconds: <number>, // Added in MongoDB 6.3
    },
    expireAfterSeconds: <number>,
    clusteredIndex: <document>, // Added in MongoDB 5.3
  }
)*/

// More information on the `createCollection` command can be found at:
// https://www.mongodb.com/docs/manual/reference/method/db.createCollection/
