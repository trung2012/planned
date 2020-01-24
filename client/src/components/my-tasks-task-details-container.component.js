import React, { useContext, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { BoardContext } from '../context/BoardContext';
import BoardTaskDetails from './board-task-details.component';
import Modal from './modal.component';
import { SocketContext } from '../context/SocketContext';
import { MyTasksContext } from '../context/MyTasksContext';

import './board-task-details-container.styles.scss';

const MyTasksTaskDetailsContainer = () => {
  const history = useHistory();
  const { taskId } = useParams();
  const { socket} = useContext(SocketContext);
  const { boardState, setShowTaskDetails, setIsCurrentlyOpenedTaskDeleted } = useContext(BoardContext);
  const { myTaskState } = useContext(MyTasksContext);
  const task = myTaskState.list

  useEffect(() => {
    if (task.project) {
      socket.emit('join', task.project);
    }
  }, [task, socket])

  return (
    boardState.isCurrentlyOpenedTaskDeleted ?
      <Modal
        dismiss={() => {
          setIsCurrentlyOpenedTaskDeleted(false);
          setShowTaskDetails(false);
          history.push('/mytasks');
        }}
        modalTitle='Error: Task deleted'
      >
        <span className='deleted-task-message'>This task has recently been deleted. Please return to the projects page or reload the page</span>
      </Modal>
      :
      boardState.showTaskDetails &&
      <BoardTaskDetails
        task={task}
        list={list}
        dismiss={() => {
          setShowTaskDetails(false);
          history.push('/mytasks')
        }} />
  );
}

export default MyTasksTaskDetailsContainer;