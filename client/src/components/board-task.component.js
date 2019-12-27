import React from 'react';

import './board-task.styles.scss';

const BoardTask = ({ task }) => {
  return (
    <div className='board-task'>
      <header className='board-task__header'>
        <span>{task.title}</span>
      </header>
      <div className='board-task__content'>
        <div>icons</div>
        <span className='task-options'>...</span>
      </div>
    </div>
  );
}

export default BoardTask;