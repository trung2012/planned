const socketioJwt = require('socketio-jwt');

const List = require('../../models/List');
const Project = require('../../models/Project');
const Task = require('../../models/Task');

const convertArrayToMap = require('../../utils/convertArrayToMap');

module.exports = io => {

  io.use(socketioJwt.authorize({
    secret: process.env.JWT_SECRET,
    handshake: true
  }));

  io.on('connection', (socket) => {
    console.log(socket.decoded_token.name, 'connected');

    socket.on('join', (projectId) => {
      socket.join(projectId);
      console.log(`${socket.decoded_token.name} joined project ${projectId}`)
    })

    socket.on('initial_data', async projectId => {
      try {

        const [project, lists, tasks] = await Promise.all([
          Project.findById(projectId).lean().populate({
            path: 'members',
            select: '-password',
            populate: {
              path: 'avatar'
            }
          }),
          List.find({ project: projectId }).lean(),
          Task.find({ project: projectId }).lean().populate({
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
            .populate('attachments')
        ])

        const memberIds = project.members.map(member => member._id);

        const listsMap = convertArrayToMap(lists);

        const tasksMap = convertArrayToMap(tasks);

        const data = {
          currentProject: {
            ...project,
            members: []
          },
          lists: listsMap,
          tasks: tasksMap,
          members: project.members,
          memberIds
        };

        socket.emit('data_updated', data);
      } catch (err) {
        console.log(err)
        socket.emit('new_error', 'Error loading data. Please try again');
      }
    })

    socket.on('leave', (projectId) => {
      socket.leave(projectId);
      console.log(`${socket.decoded_token.name} left project ${projectId}`)
    })

    socket.on('disconnect', () => {
      console.log(`${socket.decoded_token.name} disconnected`);
    })
  })
}