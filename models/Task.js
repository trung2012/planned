const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  progress: {
    type: String,
    enum: ['Not started', 'In progress', 'Completed'],
    default: 'Not started'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Important'],
    default: 'Low'
  },
  due: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
})

taskSchema.pre('remove', async function (next) {
  const task = this;

  await require('./List').updateOne(
    { _id: task.list },
    { $pull: { tasks: task._id } },
    { new: true }
  )

  next();
})

// taskSchema.pre('findOne', function (next) {
//   this.populate([
//     {
//       path: 'assignee',
//       model: 'User'
//     },
//     {
//       path: 'list',
//       model: 'List',
//       select: '-tasks -project'
//     }
//   ])

//   next();
// })

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;