import React, { useState } from 'react';


import MoreOptions from './more-options.component';
import { ReactComponent as Options } from '../assets/options.svg';
import './board-task.styles.scss';

const BoardTask = ({ task }) => {
  const [showTaskOptions, setShowTaskOptions] = useState(false);

  const handleDeleteClick = () => {

  }

  return (
    <div className='board-task'>
      <div className='board-task__heading'>
        <span>{task.title}</span>
      </div>
      <div className='board-task__content'>
        <div>icons</div>
        <Options className='options-icon' onClick={() => setShowTaskOptions(!showTaskOptions)}>...</Options>
      </div>
      {
        showTaskOptions &&
        <MoreOptions dismiss={() => setShowTaskOptions(false)}>
          <div className='more-options'>
            <div className='more-options-item'>Copy Task</div>
            <div className='more-options-item'>Assign</div>
            <div className='more-options-item' onClick={handleDeleteClick}>Delete</div>
          </div>
        </MoreOptions>
      }
    </div>
  );
}

export default BoardTask;