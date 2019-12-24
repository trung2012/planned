const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fileUrl: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  public_id: {
    type: String,
    required: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }
})

const File = mongoose.model('File', fileSchema);

module.exports = File;