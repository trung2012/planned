export default ({ lists, listsOrder, tasks }) => {
  return listsOrder.map(listId => {
    const list = lists[listId];
    list.tasks = list.tasks.map(taskId => tasks[taskId]);
    return list;
  })
}