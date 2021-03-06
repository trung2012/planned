const mongoose = require('mongoose');
const List = require('./List');
const Task = require('./Task');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#0b61d9'
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  lists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List'
    }
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  }
})

projectSchema.pre('remove', async function (next) {
  const project = this;

  await Promise.all([
    Task.deleteMany({ project: project._id }),
    List.deleteMany({ project: project._id })
  ]);

  next();
})

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;