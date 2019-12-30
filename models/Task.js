const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String
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
  progress: {
    type: String,
    default: 'Not started'
  },
  priority: {
    type: String,
    default: 'Low'
  },
  due: {
    type: Date
  },
  note: {
    type: String
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


// taskSchema.pre('save', async function (next) {
//   const task = this;

//   const list = await List.findById(task.list);
//   list.tasks.push(task._id);
//   await list.save();

//   next();
// })

taskSchema.pre('remove', async function (next) {
  const task = this;

  await require('./List').findByIdAndUpdate(
    task.list,
    { $pull: { tasks: task._id } },
    { new: true }
  )

  next();
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;