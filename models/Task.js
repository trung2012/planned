const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
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

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;