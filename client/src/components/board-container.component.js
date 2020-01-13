import React, { useContext } from 'react';
import { BoardContext } from '../context/BoardContext';

import BoardLists from './board-lists.component';

const BoardContainer = () => {
  const { boardState } = useContext(BoardContext);

  const lists = boardState.currentProject.lists && boardState.currentProject.lists.map(listId => {
    const list = { ...boardState.lists[listId] };
    list.tasks = list.tasks.map(taskId => boardState.tasks[taskId]);

    return list;
  })

  return (
    lists ?
      <BoardLists lists={lists} />
      : null
  );
}

export default BoardContainer;