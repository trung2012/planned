export const handleTaskAssignment = (socket, taskId, projectId, assignUserToTask, unassignUserFromTask) => {

  const handleAssignTask = user => {
    const updatedAt = Date.now();
    assignUserToTask({ taskId, user, updatedAt });
    socket.emit('assign_user_to_task', {
      taskId,
      user,
      projectId,
      updatedAt
    });
  }

  const handleUnassignTask = () => {
    unassignUserFromTask({ taskId });
    socket.emit('unassign_task', { taskId, projectId });
  }

  return {
    handleAssignTask,
    handleUnassignTask
  }
}