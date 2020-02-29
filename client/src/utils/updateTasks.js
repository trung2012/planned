export const handleTaskAssignment = (socket, taskId, projectId, { assignUserToTask, unassignUserFromTask }) => {

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
    socket.emit('unassign_task', { taskId, projectId, updatedAt: Date.now() });
  }

  return {
    handleAssignTask,
    handleUnassignTask
  }
}

export const handleTaskUpdate = (socket, taskId, projectId, { updateTaskAttributes }) => {
  const handleAttributeUpdate = data => {
    const updatedTask = {
      taskId,
      data: {
        ...data,
        updatedAt: Date.now()
      },
      projectId
    }
    socket.emit('update_task_attributes', updatedTask);
    updateTaskAttributes(updatedTask);
  }

  const handleCompletionToggle = currentProgress => {
    if (currentProgress.toLowerCase() === 'completed') {
      handleAttributeUpdate({
        progress: 'Not started'
      });
    } else {
      handleAttributeUpdate({
        progress: 'Completed'
      });
    }
  }

  return {
    handleAttributeUpdate,
    handleCompletionToggle
  }
}