require('./db/mongoose');
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIO = require('socket.io');
const socketioJwt = require('socketio-jwt');

const userRouter = require('./routers/api/user');
const projectRouter = require('./routers/api/project');

const List = require('./models/List');
const Task = require('./models/Task');
const Comment = require('./models/Comment');

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
