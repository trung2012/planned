const Project = require('../../models/Project');

module.exports = io => {

  io.on('connection', socket => {

    if (!socket.decoded_token.name.toLowerCase().includes('guest')) {
      socket.on('add_member', async ({ user, projectId }) => {
        try {
          await Project.updateOne(
            { _id: projectId },
            { $push: { members: user._id } }
          );

          socket.to(projectId).emit('member_added', user);
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

          socket.to(projectId).emit('member_deleted', _id);
        } catch (err) {
          console.log(err)
          socket.emit('new_error', 'Error deleting project member. Please try again');
        }
      })
    }
  })
}