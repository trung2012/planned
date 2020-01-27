const express = require('express');
const router = new express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const parser = require('../../middleware/multer');
const cloudinary = require('cloudinary');

const Task = require('../../models/Task');
const File = require('../../models/File');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const getInitials = require('../../utils/getInitials')
const getRandomColor = require('../../utils/getRandomColor')


//Register User
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send('Please fill all fields')
  }

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).send('User already exists')
    }

    const newUser = new User({
      name,
      email,
      password,
      initials: getInitials(name),
      color: getRandomColor()
    })

    const hashedPassword = await bcrypt.hash(newUser.password, 10)

    newUser.password = hashedPassword;
    const user = await newUser.save()

    jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, (err, token) => {
      if (err) throw new Error(err);
      res.status(201).json({
        token,
        user
      })
    })
  } catch (err) {
    res.status(500).send('Something went wrong')
  }
})

// User Login

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Please fill in all fields')
  }

  try {
    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      return res.status(401).send('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, existingUser.password)

    if (!isMatch) {
      return res.status(401).send('Invalid credentials')
    }

    jwt.sign({ id: existingUser._id, name: existingUser.name }, process.env.JWT_SECRET, (err, token) => {
      if (err) throw Error(err);

      res.status(200).json({
        token,
        user: existingUser
      })
    })
  } catch (err) {
    console.log(err)
    res.status(500).send('Something went wrong')
  }

})

router.put('/password', auth, async (req, res) => {
  try {
    const { user } = req;

    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    if (oldPassword === newPassword) {
      return res.status(400).send('New password cannot be the same as old password')
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).send('Passwords do not match')
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password)

    if (!isMatch) {
      return res.status(400).send('Old password is incorrect. Please try again')
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.send('Password updated successfully')
  } catch (err) {
    res.status(500).send('Internal Server Error')
  }
})

router.get('/', auth, async (req, res) => {
  try {
    if (req.user) {
      return res.status(200).send({ token: req.token, user: req.user })
    }
  } catch (err) {
    res.status(401).send('Authorization failed')
  }
})

router.get('/all', auth, async (req, res) => {
  try {
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);
    const options = req.query.name ? {
      $or: [
        { 'name': { $regex: req.query.name, $options: 'i' } }
      ]
    } : null;

    if (req.user) {
      const users = await User.find(options)
        .limit(limit)
        .skip(skip)
        .populate({
          path: 'projects',
        });
      return res.status(200).send(users)
    } else {
      throw new Error('Invalid request')
    }
  } catch (err) {
    res.status(401).send('Authorization failed')
  }
})

// Change profile picture

router.post('/avatar/:fileName', [auth, parser.single('file')], async (req, res) => {
  try {
    if (req.user) {
      const { file } = req;

      cloudinary.v2.uploader.upload(file.path, { resource_type: 'image', use_filename: true, folder: 'planned_files' }, async (error, result) => {
        if (error) {
          fs.unlinkSync(file.path);
          if (error.message.toLowerCase().includes('invalid')) {
            return res.status(400).send('Invalid file input')
          }
          return res.status(500).send('Internal Server Error');
        }

        fs.unlinkSync(file.path);

        const newFile = new File({
          name: req.params.fileName,
          url: result.secure_url,
          public_id: result.public_id
        });

        await newFile.save();
        const oldFile = await File.findById(req.user.avatar);

        req.user.avatar = newFile._id;

        if (oldFile) {
          cloudinary.v2.uploader.destroy(oldFile.public_id, (error, result) => {
            if (error) {
              throw new Error(error)
            }
          })
          await oldFile.remove();
        }

        await req.user.save();

        res.send({
          ...req.user.toJSON(),
          avatar: newFile
        });
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
})

router.get('/mytasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ assignee: req.user._id })
      .lean().populate({
        path: 'assignee',
        select: '-password',
        populate: {
          path: 'avatar'
        }
      })
      .populate({
        path: 'createdBy',
        select: '-password'
      })
      .populate({
        path: 'updatedBy',
        select: '-password'
      })
      .populate({
        path: 'completedBy',
        select: '-password'
      })
      .populate({
        path: 'comments',
        options: {
          sort: {
            'createdAt': -1
          }
        },
        populate: {
          path: 'author',
          select: '-password'
        }
      })
      .populate('attachments');

    res.send(tasks);
  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
})

module.exports = router;