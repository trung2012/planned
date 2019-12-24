require('./db/mongoose');
const express = require('express');
const http = require('http');
const cors = require('cors');
const userRouter = require('./routers/api/user');
const projectRouter = require('./routers/api/project');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
