const express = require('express')
const auth = require('../../middleware/auth');
const router = new express.Router();
const mongoose = require('mongoose');

const List = require('../../models/List');
const Project = require('../../models/Project');
const getRandomColor = require('../../utils/getRandomColor')

// Create new project
router.post('/create', auth, async (req, res) => {
  try {
    if (req.user && !req.user.name.toLowerCase().includes('guest')) {
      const { name, description, isPublic } = req.body;

      const existingProject = await Project.findOne({ name })

      if (existingProject) {
        return res.status(400).send('A project with the same name already exists');
      }

      const newProject = new Project({
        name,
        description,
        owner: req.user._id,
        members: [req.user._id],
        color: getRandomColor(),
        isPublic
      })

      const defaultList = new List({
        _id: mongoose.Types.ObjectId(),
        name: 'To Do',
        project: newProject._id
      })

      newProject.lists.push(defaultList._id);

      const project = await newProject.save();

      await defaultList.save();

      res.status(201).send(project)
    }
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error. Please try again')
  }
})

router.get('/all', auth, async (req, res) => {
  try {
    if (req.user) {
      const { user } = req;
      await user.populate('projects').execPopulate();

      const projects = await Project.find().or([
        { _id: { $in: user.projects } },
        { isPublic: true }
      ])

      res.send(projects);
    }
  } catch (err) {
    res.status(500).send('Internal Server Error. Please try again')
  }
})

router.delete('/:_id', auth, async (req, res) => {
  try {
    const { _id } = req.params;
    const project = await Project.findById(_id.toString())

    if (!project) {
      return res.status(404).send('Project not found')
    }

    if (req.user && req.user._id.toString() === project.owner.toString()) {
      const deleted = await project.remove();

      return res.send(deleted);
    } else {
      res.status(401).send('You are not authorized to perform this action');
    }
  } catch (err) {
    res.status(500).send('Internal Server Error. Please try again')
  }
})

module.exports = router;