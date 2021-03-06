import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import BoardTaskDetails from './board-task-details.component';
import Modal from './modal.component';
import { SocketContext } from '../context/SocketContext';
import { MyTasksContext } from '../context/MyTasksContext';

import './board-task-details-container.styles.scss';

const MyTasksTaskDetailsContainer = () => {
  const history = useHistory();
  const { socket } = useContext(SocketContext);
  const {
    myTasksState,
    setMyTasksShowTaskDetails,
    setMyTasksIsCurrentlyOpenedTaskDeleted,
    deleteTaskFromMyTasks,
    addMyTasksError,
    setMyTasksCurrentlyOpenedTask,
    addTaskAttachmentMyTasks
  } = useContext(MyTasksContext);
  const task = myTasksState.currentlyOpenedTask;
  const [lists, setLists] = useState([]);
  const list = task && lists.find(list => list._id === task.list);

  useEffect(() => {
    if (task) {
      socket.emit('join', task.project);
      socket.emit('fetch_all_lists_by_project', task.project);
    }

    socket.on('get_all_lists_by_project', lists => {
      setLists(lists);
    })

    socket.on('task_deleted', data => {
      if (data.taskId === task._id) {
        setMyTasksIsCurrentlyOpenedTaskDeleted(true);
        deleteTaskFromMyTasks({ taskId: task._id });
      }
    })

    socket.on('file_uploaded', file => {
      addTaskAttachmentMyTasks(file);
    })

    socket.on('new_error', errorMessage => {
      addMyTasksError(errorMessage);
    })

    return () => {
      if (task) {
        socket.emit('leave', task.project);
      }
      socket.off('new_error');
      socket.off('get_all_lists_by_project');
      socket.off('task_deleted');
      socket.off('file_uploaded');
    }
  }, [
    task,
    socket,
    deleteTaskFromMyTasks,
    setMyTasksIsCurrentlyOpenedTaskDeleted,
    addMyTasksError,
    addTaskAttachmentMyTasks
  ])

  if (task && list) {

    return (
      myTasksState.isCurrentlyOpenedTaskDeleted ?
        <Modal
          dismiss={() => {
            setMyTasksIsCurrentlyOpenedTaskDeleted(false);
            setMyTasksShowTaskDetails(false);
            setMyTasksCurrentlyOpenedTask(null);
            history.push('/mytasks');
          }}
          modalTitle='Error: Task deleted'
        >
          <span className='deleted-task-message'>This task has recently been deleted or reassigned. Please return to My Tasks or reload the page</span>
        </Modal>
        :
        myTasksState.showTaskDetails &&
        <BoardTaskDetails
          task={task}
          list={list}
          listSelectOptions={lists}
          isViewingMyTasks={true}
          dismiss={() => {
            setMyTasksShowTaskDetails(false);
            history.push('/mytasks')
          }} />
    );
  }

  return null;
}

export default MyTasksTaskDetailsContainer;