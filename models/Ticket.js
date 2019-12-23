const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List'
  },
  progress: {
    type: String,
    required: true,
    default: 'Not started'
  },
  priority: {
    type: String,
    require: true,
    default: 'Low'
  },
  due: {
    type: Date
  },
  note: {
    type: String
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
})