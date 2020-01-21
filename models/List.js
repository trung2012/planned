const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }
  ]
}, { id: false })


listSchema.pre('remove', async function (next) {
  const list = this;

  const tasks = await require('./Task').find({ list: list._id });

  tasks.forEach(async task => {
    try {
      await task.remove();
    } catch (err) {
      throw new Error(err);
    }
  })

  await require('./Project').updateOne(
    { _id: list.project },
    { $pull: { lists: list._id } },
    { new: true }
  )

  next();
})

const List = mongoose.model('List', listSchema);

module.exports = List;