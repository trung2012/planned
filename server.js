require('./db/mongoose');
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIO = require('socket.io');
const socketioJwt = require('socketio-jwt');
const cloudinary = require('cloudinary');

const userRouter = require('./routers/api/user');
const projectRouter = require('./routers/api/project');

const List = require('./models/List');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Comment = require('./models/Comment');
const File = require('./models/File');
const convertArrayToMap = require('./utils/convertArrayToMap');

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());

const io = socketIO(server);
const fileRouter = require('./routers/api/file')(io);
app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/files', fileRouter);

////////////////////////////
//Socket operations

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
          select: '-password'
        }),
        List.find({ project: projectId }).lean(),
        Task.find({ project: projectId }).lean().populate({
          path: 'assignee',
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
          .populate('createdBy')
        //   ,
        // Task.aggregate([
        //   {
        //     $group: { _id: '$progress', tasks: { $push: '$_id' } }
        //   }
        // ])
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

  socket.on('add_member', async ({ user, projectId }) => {
    try {
      await Project.updateOne(
        { _id: projectId },
        { $push: { members: user._id } }
      );

      io.in(projectId).emit('member_added', user);
    } catch (err) {
      console.log(err)
      socket.emit('new_error', 'Error adding project member. Please try again');
    }
  })

  socket.on('delete_member', async ({ _id, projectId }) => {
    try {
      await Project.updateOne(
        { _id: projectId },
        { $pull: { members: _id } }
      );

      io.in(projectId).emit('member_deleted', _id);
    } catch (err) {
      console.log(err)
      socket.emit('new_error', 'Error deleting project member. Please try again');
    }
  })

  socket.on('add_list', async (listData) => {
    try {
      const newList = new List(listData);

      await Promise.all([
        newList.save(),
        Project.updateOne(
          { _id: listData.project },
          { $push: { lists: listData._id } }
        )
      ])

      socket.to(listData.project).emit('list_added', newList);
    } catch (err) {
      console.log(err)
      socket.emit('new_error', 'Error adding list. Please try again');
    }
  })

  socket.on('delete_list', async ({ listId, projectId }) => {
    try {
      const list = await List.findById(listId);

      await list.remove();

      socket.to(projectId).emit('list_deleted', list);
    } catch (err) {
      console.log(err)
      socket.emit('new_error', 'Error deleting list. Please try again');
    }
  })

  socket.on('edit_list_name', async ({ listId, listName, projectId }) => {
    try {
      await List.updateOne(
        { _id: listId },
        { $set: { name: listName } },
        { new: true }
      );

      socket.to(projectId).emit('list_name_updated', { _id: listId, name: listName });
    } catch (err) {
      socket.emit('new_error', 'Error updating list name');
    }
  })

  socket.on('add_task', async ({ taskData, projectId }) => {
    try {
      const newTask = new Task({
        ...taskData,
        assignee: taskData.assignee ? taskData.assignee._id : null,
        project: projectId,
        createdBy: taskData.createdBy._id
      })

      await Promise.all([
        newTask.save(),
        List.updateOne(
          { _id: taskData.list },
          { $push: { tasks: taskData._id } },
          { new: true }
        )
      ])

      socket.to(projectId).emit('task_added', { ...taskData });
    } catch (err) {
      console.log(err)
      socket.emit('new_error', 'Error adding task');
    }
  })

  socket.on('delete_task', async ({ taskId, projectId }) => {
    try {
      const task = await Task.findById(taskId);
      await task.remove();

      socket.to(projectId).emit('task_deleted', { taskId, listId: task.list });
    } catch (err) {
      console.log(err)
      socket.emit('new_error', 'Error deleting task');
    }
  })

  socket.on('assign_user_to_task', async ({ taskId, user, updatedAt, projectId }) => {
    try {
      await Task.updateOne(
        { _id: taskId },
        { $set: { assignee: user._id, updatedAt } },
        { new: true }
      )

      socket.to(projectId).emit('task_assigned', { taskId, user });
    } catch (err) {
      console.log(err)
      socket.emit('new_error', 'Error assigning task to user');
    }
  })

  socket.on('unassign_task', async ({ taskId, projectId, updatedAt }) => {
    try {
      await Task.updateOne(
        { _id: taskId },
        { $set: { assignee: undefined, updatedAt } },
        { new: true }
      )

      socket.to(projectId).emit('task_assigned', { taskId });
    } catch (err) {
      console.log(err)
      socket.emit('new_error', 'Error removing task assignment');
    }
  })

  socket.on('assign_task_to_new_list', async ({ data, projectId }) => {
    try {
      const { task, oldListId, newListId, updatedAt } = data;

      await Promise.all([
        Task.updateOne({ _id: task._id }, { $set: { list: newListId, updatedAt } }),
        List.updateOne({ _id: oldListId }, { $pull: { tasks: task._id } }),
        List.updateOne({ _id: newListId }, { $push: { tasks: task._id } }),
      ])

      socket.to(projectId).emit('task_assigned_to_new_list', data);

    } catch (err) {
      socket.emit('new_error', 'An error occurred while moving task');
    }
  })

  socket.on('update_task_attributes', async ({ taskId, data, projectId }) => {
    try {
      await Task.updateOne(
        { _id: taskId },
        { $set: data },
        { new: true }
      )

      socket.to(projectId).emit('task_attributes_updated', { taskId, data });

    } catch (err) {
      console.log(err)
      socket.emit('new_error', 'Error updating task');
    }
  })

  socket.on('add_comment', async commentData => {
    try {
      const comment = new Comment({
        ...commentData,
        author: commentData.author._id
      });

      await Promise.all([
        comment.save(),
        Task.updateOne(
          { _id: commentData.task },
          { $set: { updatedAt: Date.now() } }
        )
      ])

      socket.to(commentData.project).emit('comment_added', commentData);
    } catch (err) {
      console.log(err)
      socket.emit('new_error', 'Error adding comment');
    }
  })

  socket.on('delete_attachment', async ({ file, projectId }) => {
    try {
      await Promise.all([
        File.findByIdAndDelete(file._id),
        Task.updateOne(
          { _id: file.task },
          { $set: { updatedAt: Date.now() } }
        ),
        cloudinary.v2.uploader.destroy(file.public_id, { resource_type: 'raw' }, (error, result) => {
          if (error) {
            throw new Error(error)
          }
        })
      ])

      socket.to(projectId).emit('attachment_deleted', file);
    } catch (err) {
      console.log(err)
      socket.emit('new_error', 'Error deleting attachment');
    }
  })

  socket.on('change_filename', async ({ file, newName, projectId }) => {
    try {
      await Promise.all([
        File.updateOne(
          { _id: file._id },
          { $set: { name: newName } }
        ),
        Task.updateOne(
          { _id: file.task },
          { $set: { updatedAt: Date.now() } }
        )
      ]);

      socket.to(projectId).emit('attachment_renamed', { file, newName });
    } catch (err) {
      console.log(err)
      socket.emit('new_error', 'Error renaming attachment');
    }
  })

  socket.on('replace_single_list', async ({ list, taskId }) => {
    try {
      await Promise.all([
        List.replaceOne(
          { _id: list._id },
          list
        ),
        Task.updateOne(
          { _id: taskId },
          { $set: { updatedAt: Date.now() } }
        )
      ])

      socket.to(list.project).emit('single_list_replaced', { list, taskId });
    } catch (err) {
      socket.emit('new_error', 'Error updating list');
    }
  })

  socket.on('replace_multiple_lists', async ({ lists, taskId }) => {
    try {
      const [startList, endList] = lists;

      await Promise.all([
        List.replaceOne(
          { _id: startList._id },
          startList
        ),
        List.replaceOne(
          { _id: endList._id },
          endList
        ),
        Task.updateOne(
          { _id: taskId },
          { $set: { list: endList._id, updatedAt: Date.now() } }
        )
      ])

      socket.to(startList.project).emit('multiple_lists_replaced', { lists, taskId });
    } catch (err) {
      console.log(err)
      socket.emit('new_error', 'Error updating lists');
    }
  })

  socket.on('reorder_lists', async ({ lists, projectId }) => {
    try {
      await Project.updateOne(
        { _id: projectId },
        { $set: { lists } }
      );

      socket.to(projectId).emit('lists_reordered', lists);
    } catch (err) {
      console.log(err)
      socket.emit('new_error', 'Error ordering lists');
    }
  })

  socket.on('leave', (projectId) => {
    socket.leave(projectId);
    console.log(`${socket.decoded_token.name} left project ${projectId}`)
  })

  socket.on('disconnect', () => {
    console.log(`${socket.decoded_token.name} disconnected`);
  })
});

////////////////////////////

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
