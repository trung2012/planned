const List = require('../../models/List');
const Project = require('../../models/Project');
const Task = require('../../models/Task');

module.exports = io => {
  io.on('connection', (socket) => {

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

    socket.on('fetch_all_lists_by_project', async projectId => {
      try {
        const lists = await List.find({ project: projectId })
          .lean()
          .select('-tasks');

        socket.emit('get_all_lists_by_project', lists);
      } catch (err) {
        console.log(err)
        socket.emit('new_error', 'Error ordering lists');
      }
    })

  })
}