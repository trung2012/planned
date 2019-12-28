import React from 'react';

import { ReactComponent as AddIcon } from '../assets/add.svg';
import './board-list.styles.scss';
import BoardTask from './board-task.component';

const BoardList = ({ list }) => {

  return (
    <div className='board-list'>
      <h4 className='board-list__name'>{list.name}</h4>
      <div className='board-list__tasks'>
        <div className='board-list__add-task'>
          <AddIcon className='add-icon' />
          Add task
        </div>
        {
          list &&
          (
            list.tasks.length > 0 &&
            list.tasks.map(task => (
              <BoardTask key={task._id} task={task} />
            ))
          )
        }
      </div>
    </div>
  );
}

export default BoardList;