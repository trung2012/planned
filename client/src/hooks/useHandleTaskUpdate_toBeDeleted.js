import { useContext } from 'react';
import { BoardContext } from '../context/BoardContext';
import { SocketContext } from '../context/SocketContext';

const useHandleTaskUpdate = (taskId) => {
  const { socket } = useContext(SocketContext);
  const { boardState, updateTaskAttributes, assignUserToTask, unassignUserFromTask } = useContext(BoardContext);

  const handleAssignTask = user => {
    const updatedAt = Date.now();
    assignUserToTask({ taskId, user, updatedAt });
    socket.emit('assign_user_to_task', {
      taskId,
      user,
      projectId: boardState.currentProject._id,
      updatedAt
    });
  }

  const handleUnassignTask = () => {
    unassignUserFromTask({ taskId });
    socket.emit('unassign_task', { taskId, projectId: boardState.currentProject._id });
  }

  const handleAttributeUpdate = data => {
    const updatedTask = {
      taskId,
      data: {
        ...data,
        updatedAt: Date.now()
      },
      projectId: boardState.currentProject._id
    }
    socket.emit('update_task_attributes', updatedTask);
    updateTaskAttributes(updatedTask);
  }

  const handleCompletionToggle = progress => {
    if (progress === 'Completed') {
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
    handleAssignTask,
    handleUnassignTask,
    handleAttributeUpdate,
    handleCompletionToggle
  }
}

export default useHandleTaskUpdate;