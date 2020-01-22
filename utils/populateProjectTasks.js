const Task = require('../models/Task');

module.exports = async projects => {
  const populatedProjects = await Promise.all(projects.map(async project => {
    const tasks = await Task.find({ project: project._id }).lean().populate({
      path: 'assignee',
      select: '-password'
    })

    return { ...project.toJSON(), tasks }
  }))

  return populatedProjects;
}