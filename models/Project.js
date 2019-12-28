const mongoose = require('mongoose');

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
    }
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
})

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;