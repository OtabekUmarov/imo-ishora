const {
  Schema,
  model
} = require('mongoose')

const puzzle = new Schema({
  answer: {
    type: String,
    required: true
  },
  img: String,
})


module.exports = model('Puzzle', puzzle)