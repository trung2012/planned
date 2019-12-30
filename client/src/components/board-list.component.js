import React from 'react';

import { ReactComponent as OptionsIcon } from '../assets/options.svg';
import './board-list.styles.scss';
import BoardTasks from './board-tasks.component';

const BoardList = ({ list }) => {
  return (
    <div className='board-list'>
      <div className='board-list__header'>
        <h4 className='board-list__name'>{list.name}</h4>
        <OptionsIcon className='options-icon' />
      </div>
      <BoardTasks list={list} />
    </div>
  );
}

export default BoardList;