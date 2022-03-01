const {
  Schema,
  model
} = require('mongoose')
const object = new Schema({
  title: {
    type: String,
    required: true
  },
  type: String,
  img: String
})
module.exports = model('Object', object)