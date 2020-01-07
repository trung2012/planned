import React from 'react';
import BoardTaskContainer from './board-task-container.component';

import './board-tasks.styles.scss';

const BoardTasks = ({ list }) => {

  return (
    <div className='board-tasks'>

      {
        list &&
        (
          list.tasks.length > 0 &&
          list.tasks.map(taskId => (
            <BoardTaskContainer key={taskId} taskId={taskId} list={list} />
          ))
        )
      }
    </div>
  );
}

export default BoardTasks;