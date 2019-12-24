const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket'
    }
  ]
}, { id: false })

listSchema.pre('remove', async function (next) {
  const list = this;

  next();
})


const List = mongoose.model('List', listSchema);

module.exports = List;