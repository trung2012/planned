const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: String
  },
  imageUrl: {
    type: String
  },
  note: {
    type: String
  },
  completed: {
    type: Boolean,
    default: false
  },
  list: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;