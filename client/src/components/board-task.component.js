import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import MoreOptions from './more-options.component';
import { ReactComponent as OptionsIcon } from '../assets/options.svg';
import { SocketContext } from '../context/SocketContext';

import './board-task.styles.scss';

const BoardTask = ({ task }) => {
  const { projectId } = useParams();
  const socket = useContext(SocketContext);
  const [showTaskOptions, setShowTaskOptions] = useState(false);

  const handleDeleteClick = () => {
    socket.emit('delete_task', { taskId: task._id, projectId });
    setShowTaskOptions(false);
  }

  return (
    <div className='board-task'>
      <div className='board-task__heading'>
        <span>{task.name}</span>
      </div>
      <div className='board-task__content'>
        <div>icons</div>
        <OptionsIcon className='options-icon' onClick={() => setShowTaskOptions(!showTaskOptions)}>...</OptionsIcon>
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
  );
}

export default BoardTask;