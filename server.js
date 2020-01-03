require('./db/mongoose');
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIO = require('socket.io');
const socketioJwt = require('socketio-jwt');

const userRouter = require('./routers/api/user');
const projectRouter = require('./routers/api/project');

const List = require('./models/List');
const Project = require('./models/Project');
const Task = require('./models/Task');

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);

const io = socketIO(server);

////////////////////////////
//Socket operations

io.use(socketioJwt.authorize({
  secret: process.env.JWT_SECRET,
  handshake: true
}));

io.on('connection', (socket) => {
  console.log(socket.decoded_token.id, ' connected');

  socket.on('join', (projectId) => {
    socket.join(projectId);
    console.log(`joined project ${projectId}`)
  })

  socket.on('initial_data', async projectId => {
    try {
      const project = await Project.findById(projectId.toString()).populate({
        path: 'lists',
        model: 'List',
        populate: {
          path: 'tasks',
          model: 'Task',
          populate: [
            {
              path: 'assignee',
              model: 'User'
            },
            {
              path: 'list',
              model: 'List',
              select: '-tasks -project'
            }
          ]
        }
      });
      const projectMemberIds = [...project.members];
      await project.populate('members', '-password').execPopulate();

      const data = {
        currentProject: {
          name: project.name,
          description: project.description,
          color: project.color,
          owner: project.owner
        },
        lists: project.lists,
        members: project.members,
        memberIds: projectMemberIds
      };

      socket.emit('data_updated', data);
    } catch (err) {
      socket.emit('new_error', 'Error loading data. Please try again');
    }
  })

  socket.on('add_member', async ({ user, projectId }) => {
    try {
      const project = await Project.findById(projectId);
      project.members.push(user._id);
      project.save();

      io.in(projectId).emit('member_added', user);
    } catch (err) {
      socket.emit('new_error', 'Error adding project member. Please try again');
    }
  })

  socket.on('delete_member', async ({ _id, projectId }) => {
    try {
      const project = await Project.findById(projectId);
      project.members = project.members.filter(member => member._id.toString() !== _id);
      project.save();

      io.in(projectId).emit('member_deleted', _id);
    } catch (err) {
      console.log(err)
      socket.emit('new_error', 'Error deleting project member. Please try again');
    }
  })

  socket.on('add_list', async ({ name, projectId }) => {
    try {
      const newList = new List({
        name,
        project: projectId
      })

      const list = await newList.save();

      const project = await Project.findById(list.project);
      project.lists.push(list._id);
      await project.save();

      io.in(projectId).emit('list_added', list);
    } catch (err) {
      socket.emit('new_error', 'Error adding list. Please try again');
    }
  })

  socket.on('delete_list', async ({ listId, projectId }) => {
    try {
      const list = await List.findById(listId);

      await list.remove();

      io.in(projectId).emit('list_deleted', list);
    } catch (err) {
      console.log(err)
      socket.emit('new_error', 'Error deleting list. Please try again');
    }
  })

  socket.on('edit_list_name', async ({ listId, listName, projectId }) => {
    try {
      const list = await List.findById(listId);
      list.name = listName;
      await list.save();

      io.in(projectId).emit('list_name_updated', list);
    } catch (err) {
      socket.emit('new_error', 'Error updating list name');
    }
  })

  socket.on('add_task', async ({ taskData, projectId }) => {
    try {
      const newTask = new Task({
        ...taskData,
        project: projectId
      })

      await newTask.save();
      const list = await List.findById(newTask.list);
      list.tasks.push(newTask._id);
      await list.save();

      const task = await Task.findById(newTask._id);

      io.in(projectId).emit('task_added', task);
    } catch (err) {
      console.log(err)
      socket.emit('new_error', 'Error adding task');
    }
  })

  socket.on('delete_task', async ({ taskId, projectId }) => {
    try {
      const task = await Task.findById(taskId);
      await task.remove();

      io.in(projectId).emit('task_deleted', task);
    } catch (err) {
      console.log(err)
      socket.emit('new_error', 'Error deleting task');
    }
  })

  socket.on('leave', (projectId) => {
    socket.leave(projectId);
    console.log(`left project ${projectId}`)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected');
  })
});

////////////////////////////

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
