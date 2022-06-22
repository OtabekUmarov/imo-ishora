const {
  Schema,
  model
} = require('mongoose')

const test = new Schema({
  answer: {
    type: String,
    required: true
  },
})


module.exports = model('Test', test)