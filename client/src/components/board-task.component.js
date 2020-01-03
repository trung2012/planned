import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import MoreOptions from './more-options.component';
import { ReactComponent as OptionsIcon } from '../assets/options.svg';
import { SocketContext } from '../context/SocketContext';

import './board-task.styles.scss';
import BoardTaskDetails from './board-task-details.component';

const BoardTask = ({ task }) => {
  const { projectId } = useParams();
  const socket = useContext(SocketContext);
  const [showTaskOptions, setShowTaskOptions] = useState(false);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  const handleDeleteClick = () => {
    socket.emit('delete_task', { taskId: task._id, projectId });
    setShowTaskOptions(false);
  }

  return (
    <React.Fragment>
      <div className='board-task'>
        <div className='board-task__heading'>
          <span onClick={() => setShowTaskDetails(true)}>{task.name}</span>
          <OptionsIcon className='options-icon' onClick={() => setShowTaskOptions(!showTaskOptions)}>...</OptionsIcon>
        </div>
        <div className='board-task__content' onClick={() => setShowTaskDetails(true)}>
          <div>icons</div>
        </div>
        {
          showTaskOptions &&
          <MoreOptions dismiss={() => setShowTaskOptions(false)}>
            <div className='more-options-item'>Copy Task</div>
            <div className='more-options-item'>Assign</div>
            <div className='more-options-item' onClick={handleDeleteClick}>Delete</div>
          </MoreOptions>
        }
      </div>
      {
        showTaskDetails &&
        <BoardTaskDetails task={task} dismiss={() => setShowTaskDetails(false)} />
      }
    </React.Fragment>
  );
}

export default BoardTask;