const mongoose = require('mongoose');
const Image = require('./Image');
const Item = require('./Item');

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  tickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket'
    }
  ]
}, { id: false })

listSchema.virtual('items', {
  ref: 'Item',
  localField: '_id',
  foreignField: 'list'
})

listSchema.virtual('images', {
  ref: 'Image',
  localField: '_id',
  foreignField: 'list'
});

listSchema.set('toObject', { virtuals: true });
listSchema.set('toJSON', { virtuals: true });

listSchema.pre('remove', async function (next) {
  const list = this;

  await Image.deleteMany({ list: list._id });

  await Item.deleteMany({ list: list._id });

  next();
})


const List = mongoose.model('List', listSchema);

module.exports = List;