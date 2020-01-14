import React, { useContext } from 'react';
import { BoardContext } from '../context/BoardContext';

import ChartContainer from './charts-container.component';
import BoardLists from './board-lists.component';

import './board-container.styles.scss';

const BoardContainer = () => {
  const { boardState } = useContext(BoardContext);

  const lists = boardState.currentProject.lists && boardState.currentProject.lists.map(listId => {
    const list = { ...boardState.lists[listId] };
    list.tasks = list.tasks.map(taskId => boardState.tasks[taskId]);

    return list;
  })

  return (
    lists ?
      <div className='board-container'>
        <ChartContainer lists={lists} />
        <BoardLists lists={lists} />
      </div>
      : null
  );
}

export default BoardContainer;