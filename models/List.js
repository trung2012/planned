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

  await require('./Task').deleteMany({ list: list._id });

  await require('./Project').updateOne(
    { _id: list.project },
    { $pull: { lists: list._id } },
    { new: true }
  )

  next();
})

// listSchema.pre('findOne', function (next) {
//   this.populate({
//     path: 'tasks',
//     model: 'Task',
//     populate: [
//       {
//         path: 'assignee',
//         model: 'User'
//       },
//       {
//         path: 'list',
//         model: 'List',
//         select: '-tasks -project'
//       }
//     ]
//   })

//   next();
// })


const List = mongoose.model('List', listSchema);

module.exports = List;