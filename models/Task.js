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
    enum: ['Low', 'Medium', 'High', 'Urgent'],
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
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
})

taskSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'task'
})

taskSchema.virtual('attachments', {
  ref: 'File',
  localField: '_id',
  foreignField: 'task'
})


taskSchema.pre('remove', async function (next) {
  const task = this;

  await Promise.all([
    require('./List').updateOne(
      { _id: task.list },
      { $pull: { tasks: task._id } },
      { new: true }
    ),
    require('./Comment').deleteMany(
      { task: task._id }
    )
  ])

  const files = await require('./File').find({ task: task._id });

  files.forEach(async file => {
    try {
      await file.remove();
    } catch (err) {
      throw new Error(err);
    }
  })

  next();
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;