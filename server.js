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

const app = express();
const server = http.createServer(app);
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
    console.log('joined project')
  })

  socket.on('initial_data', async projectId => {
    const project = await Project.findById(projectId.toString());
    await project.populate({
      path: 'lists',
      populate: {
        path: 'tasks',
        model: 'Task'
      }
    })
      .populate('members')
      .execPopulate();

    const data = {
      currentProject: {
        name: project.name,
        description: project.description,
        color: project.color,
        owner: project.owner
      },
      lists: project.lists,
      members: project.members
    };

    console.log(data)

    socket.emit('data_updated', data);
  })

  socket.on('add_list', async ({ name, projectId }) => {
    try {
      const newList = new List({
        name,
        project: projectId
      })

      const list = await newList.save();
      socket.emit('list_added', list)
      socket.broadcast.to(projectId).emit('data_updated');
    } catch (err) {
      socket.emit('new_error', 'Something went wrong with our server');
    }
  })

  socket.on('leave', (projectId) => {
    socket.leave(projectId)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected');
  })
});

////////////////////////////

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
