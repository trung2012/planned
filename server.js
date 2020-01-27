const path = require('path');
const express = require('express');
const http = require('http');
const cors = require('cors');
require('./db/mongoose');
const socketIO = require('socket.io');

const userRouter = require('./routers/api/user');
const projectRouter = require('./routers/api/project');

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

const io = socketIO(server);

require('./routers/socket.io/main')(io);
require('./routers/socket.io/project')(io);
require('./routers/socket.io/list')(io);
require('./routers/socket.io/task')(io);

const fileRouter = require('./routers/api/file')(io);
app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/files', fileRouter);

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if ((req.get('X-Forwarded-Proto') !== 'https')) {
      res.redirect('https://' + req.get('Host') + req.url);
    } else
      next();
  });

  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
  });
};

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
