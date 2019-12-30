const mongoose = require('mongoose');
const listTasks = require('./Task');

const listSchema = new mongoose.Schema({
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

// listSchema.pre('save', async function (next) {
//   const list = this;

//   // const project = await Project.findById(list.project);
//   // project.lists.push(list._id);
//   // await project.save();

//   next();
// })

listSchema.pre('remove', async function (next) {
  const list = this;

  await listTasks.deleteMany({ list: list._id });

  await require('./Project').findByIdAndUpdate(
    list.project,
    { $pull: { lists: list._id } },
    { new: true }
  )

  next();
})


const List = mongoose.model('List', listSchema);

module.exports = List;