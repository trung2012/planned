const cloudinary = require('cloudinary');
const List = require('../../models/List');
const Task = require('../../models/Task');
const Comment = require('../../models/Comment');
const File = require('../../models/File');

module.exports = io => {
  io.on('connection', (socket) => {
    if (!socket.decoded_token.name.toLowerCase().includes('guest')) {
      socket.on('add_task', async ({ taskData, projectId }) => {
        try {
          const newTask = new Task({
            ...taskData,
            assignee: taskData.assignee ? taskData.assignee._id : null,
            project: projectId,
            createdBy: taskData.createdBy._id,
            updatedBy: taskData.updatedBy._id
          })

          await Promise.all([
            newTask.save(),
            List.updateOne(
              { _id: taskData.list },
              { $push: { tasks: taskData._id } },
              { new: true }
            )
          ])

          socket.to(projectId.toString()).emit('task_added', { ...taskData });
        } catch (err) {
          console.log(err)
          socket.emit('new_error', 'Error adding task');
        }
      })

      socket.on('delete_task', async ({ taskId, projectId }) => {
        try {
          const task = await Task.findById(taskId);
          await task.remove();

          socket.to(projectId.toString()).emit('task_deleted', { taskId, listId: task.list });
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

          socket.to(projectId.toString()).emit('task_assigned', { taskId, user });
        } catch (err) {
          console.log(err)
          socket.emit('new_error', 'Error assigning task to user');
        }
      })

      socket.on('unassign_task', async ({ taskId, projectId, updatedAt }) => {
        try {
          await Task.updateOne(
            { _id: taskId },
            { $set: { assignee: null, updatedAt } },
            { new: true }
          )

          socket.to(projectId.toString()).emit('task_assigned', { taskId });
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

          socket.to(projectId.toString()).emit('task_assigned_to_new_list', data);

        } catch (err) {
          socket.emit('new_error', 'An error occurred while moving task');
        }
      })

      socket.on('update_task_attributes', async ({ taskId, data, projectId }) => {
        try {
          if (data.completedBy) {
            data.completedBy = data.completedBy._id;
          }

          await Task.updateOne(
            { _id: taskId },
            { $set: data },
            { runValidators: true }
          )

          socket.to(projectId.toString()).emit('task_attributes_updated', { taskId, data });

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
          const [task] = await Promise.all([
            Task.findById(file.task),
            File.findByIdAndDelete(file._id),
            Task.updateOne(
              { _id: file.task },
              { $set: { updatedAt: Date.now() } }
            ),
            cloudinary.v2.uploader.destroy(file.public_id, { resource_type: 'raw' }, (error, result) => {
              if (error) {
                throw new Error(error.message)
              }
            })
          ])

          socket.to(task.project.toString()).emit('attachment_deleted', file);
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

          socket.to(projectId.toString()).emit('attachment_renamed', { file, newName });
        } catch (err) {
          console.log(err)
          socket.emit('new_error', 'Error renaming attachment');
        }
      })
    }
  })
}