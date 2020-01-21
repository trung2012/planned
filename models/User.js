const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  password: {
    type: String,
    required: true,
  },
  initials: {
    type: String
  },
  color: {
    type: String,
    default: '#0b61d9'
  },
  avatar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }
}, { id: false })

userSchema.virtual('projects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'members'
});


userSchema.pre('find', function (next) {
  this.populate('avatar')

  next();
})

userSchema.pre('findOne', function (next) {
  this.populate('avatar')

  next();
})

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

userSchema.methods.toJSON = function () {
  const { _id, name, email, initials, color, avatar } = this;

  return { _id, name, email, initials, color, avatar }
}

const User = mongoose.model('User', userSchema);

module.exports = User;